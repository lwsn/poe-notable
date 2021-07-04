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

  await Promise.all(
    iconPaths.map(({ x, y, w, h, name }) =>
      iconImage
        .crop({ x, y, width: w, height: h })
        .save(`./public/notable-icons/${name}`, { format: "png" })
    )
  );

  console.log(
    Object.values(clusterMods).filter(
      ({ affix }) => affix === "Notable" || affix === "of Significance"
    )
  );
})();
