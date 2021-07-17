const { Image } = require("image-js");
const { fromPairs, map, isEmpty } = require("lodash");
const { parse: parseLua } = require("luaparse");
const fs = require("fs/promises");

// taken from lua-json, with added support for mixed keys in tables
const luaAstToJson = (ast) => {
  let values;
  switch (ast.type) {
    case "NilLiteral":
    case "BooleanLiteral":
    case "NumericLiteral":
    case "StringLiteral":
      return ast.value;
    case "UnaryExpression":
      if (ast.operator === "-") return -luaAstToJson(ast.argument);
      break;
    case "Identifier":
      return ast.name;
    case "TableKey":
    case "TableKeyString":
      return {
        __internal_table_key: true,
        key: luaAstToJson(ast.key),
        value: luaAstToJson(ast.value),
      };
    case "TableValue":
      return luaAstToJson(ast.value);
    case "TableConstructorExpression":
      if (ast.fields[0] && ast.fields[0].key) {
        let undefinedKey = 0;
        const object = fromPairs(
          map(ast.fields, (field) => {
            const retVal = luaAstToJson(field);
            const { key = undefinedKey++, value = retVal } = retVal;
            return [key, value];
          })
        );
        return isEmpty(object) ? [] : object;
      }
      return map(ast.fields, (field) => {
        const value = luaAstToJson(field);
        return value.__internal_table_key ? [value.key, value.value] : value;
      });
    case "LocalStatement":
      values = ast.init.map(luaAstToJson);
      return values.length === 1 ? values[0] : values;
    case "ReturnStatement":
      values = ast.arguments.map(luaAstToJson);
      return values.length === 1 ? values[0] : values;
    case "Chunk":
      return luaAstToJson(ast.body[0]);
    default:
  }
  throw new Error(`can't parse ${ast.type}`);
};

const parse = (value) => luaAstToJson(parseLua(value, { comments: false }));

(async () => {
  console.log("Parsing lua data...");
  const treeDataVersion = (
    await fs.readdir(`./pob/TreeData`, {
      withFileTypes: true,
    })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => parseFloat(dirent.name.replace("_", ".")))
    .sort()
    .reverse()[0];

  if (Number.isNaN(treeDataVersion)) throw new Error("No tree data found");

  const treeRootPath = `./pob/TreeData/${String(treeDataVersion).replace(
    ".",
    "_"
  )}`;

  const { nodes, skillSprites } = parse(
    await fs.readFile(`${treeRootPath}/tree.lua`, {
      encoding: "utf-8",
    })
  );

  const { notableSortOrder, keystones, jewels } = parse(
    await fs.readFile("./pob/Data/ClusterJewels.lua", {
      encoding: "utf-8",
    })
  );

  console.log("Generating icon data...");

  const coords = Object.keys(skillSprites)
    .filter((k) => k.endsWith("Active"))
    .reduce(
      (a, k) => ({
        ...a,
        ...skillSprites[k].reverse()[0].coords,
      }),
      {}
    );

  const nodesList = Object.values(nodes);

  const clusterNodes = [...keystones, ...Object.keys(notableSortOrder)].map(
    (k) => nodesList.find(({ name }) => name === k).icon
  );

  const iconPaths = [
    ...clusterNodes,
    ...Object.values(jewels).flatMap(({ skills }) =>
      Object.values(skills).map(({ icon }) => icon)
    ),
  ]
    .filter((v, i, l) => v && l.indexOf(v) === i)
    .map((k) => ({ ...coords[k], name: k.split("/").reverse()[0] }));

  const clusterMods = parse(
    await fs.readFile("./pob/Data/ModJewelCluster.lua", {
      encoding: "utf-8",
    })
  );

  const iconImage = await Image.load(`${treeRootPath}/skills-3.jpg`);

  console.log("Generating notables data...");

  const clusterModsArray = Object.values(clusterMods);

  const notables = clusterModsArray
    .filter(({ affix }) => affix === "Notable" || affix === "of Significance")
    .map((s) => ({
      ...s,
      name: s["0"].replace("1 Added Passive Skill is ", ""),
    }))
    .map(({ type, name, level, weightKey, weightVal, group }) => ({
      ...nodesList.find(({ name: nodeName }) => name === nodeName),
      type,
      level,
      weight: weightKey.reduce((a, k, i) => ({ ...a, [k]: weightVal[i] }), {}),
      group,
    }));

  const formattedKeystones = keystones
    .map((k) => nodesList.find(({ name }) => name === k))
    .map(({ stats, ...k }) => ({
      stats: stats.flatMap((s) => s.split("\n")),
      ...k,
    }));

  console.log("Generating jewel data...");

  const sortedJewels = Object.values(jewels).flatMap(({ size, skills }) =>
    Object.entries(skills).map(([id, { name, icon, tag, stats, enchant }]) => {
      const sizeTag = `expansion_jewel_${size.toLowerCase()}`;

      const mods = clusterModsArray
        .filter(
          ({ weightKey }) =>
            weightKey.includes(tag) || weightKey.includes(sizeTag)
        )
        .map(({ group, type, weightKey, weightVal }) => ({
          group,
          type,
          weight:
            weightVal[weightKey.findIndex((k) => k === tag || k === sizeTag)],
        }));

      const prefixWeight = mods
        .filter(({ type }) => type === "Prefix")
        .reduce((a, { weight }) => a + weight, 0);
      const suffixWeight = mods
        .filter(({ type }) => type === "Suffix")
        .reduce((a, { weight }) => a + weight, 0);

      return {
        id,
        name,
        icon: icon.replace("Art/2DArt/SkillIcons/passives/", "/notable-icons/"),
        tag,
        stats,
        enchant,
        size,
        prefixWeight,
        suffixWeight,
        notables: notables
          .filter(({ weight }) => weight[tag])
          .map(({ type, weight, name, skill }) => ({
            name,
            skill,
            type,
            weight: weight[tag],
          })),
      };
    })
  );

  console.log("Writing...");

  const notablesOutput = [...formattedKeystones, ...notables].map(
    ({ icon, ...a }) => ({
      ...a,
      icon: icon.replace("Art/2DArt/SkillIcons/passives/", "/notable-icons/"),
    })
  );

  await Promise.all([
    ...iconPaths.map(({ x, y, w, h, name }) =>
      iconImage
        .crop({ x, y, width: w, height: h })
        .save(`./public/notable-icons/${name}`, { format: "png" })
    ),
    fs.writeFile(
      "src/notables.json",
      JSON.stringify(notablesOutput, undefined, 2),
      "utf8"
    ),
    fs.writeFile(
      "src/jewels.json",
      JSON.stringify(sortedJewels, undefined, 2),
      "utf8"
    ),
  ]);

  console.log("Done!");
})();
