const fs = require("fs");
const jewelMods = require("./ModJewelCluster.json");
let jewels = require("./ClusterJewels.json");
let tree = require("./tree.json");

let notables = Object.values(jewelMods).filter(
  t =>
    t["1"].includes("1 Added Passive Skill is") &&
    !t["1"].includes("a Jewel Socket")
);

const keyStoneNames = [
  "Disciple of Kitava",
  "Lone Messenger",
  "Nature's Patience",
  "Secrets of Suffering",
  "Kineticism",
  "Veteran's Awareness",
  "Hollow Palm Technique"
];

notables = notables.map(({ 1: name, weightKey, weightVal, type }) => ({
  type: type.toLowerCase(),
  name: name.replace("1 Added Passive Skill is ", ""),
  weightVal: weightVal.filter(v => v > 0),
  weightKey: weightKey.filter((v, i) => weightVal[i] > 0)
}));

notables = [
  ...keyStoneNames.map(name => ({
    name,
    weightKey: [],
    weightVal: [],
    type: "prefix"
  })),
  ...notables
];

notables = Object.entries(tree.nodes)
  .map(([k, v]) => ({ ...v, skill: k }))
  .filter(({ name }) => notables.some(({ name: n }) => name === n))
  .map(
    ({
      skill,
      name,
      icon,
      isKeystone,
      stats,
      reminderText,
      flavourText,
      isNotable,
      type
    }) => ({
      skill: parseInt(skill, 10),
      name,
      icon: icon.replace("Art/2DArt/SkillIcons/passives/", "/notable-icons/"),
      isKeystone,
      isNotable,
      stats: stats.reduce((acc, s) => [...acc, ...s.split("\n")], []),
      reminderText,
      flavourText,
      type,
      ...notables.find(({ name: n }) => name === n)
    })
  )
  .map(({ weightVal, weightKey, ...rest }) => ({
    ...rest,
    weight: weightKey.reduce((acc, k, i) => ({ ...acc, [k]: weightVal[i] }), [])
  }))
  .filter(
    ({ weight, isKeystone }) => isKeystone || Object.keys(weight).length > 0
  )
  .sort(({ weight: a }, { weight: b }) =>
    Object.keys(a).join("") > Object.keys(b).join("") ? 1 : -1
  );

jewels = Object.entries(jewels.jewels)
  .reduce(
    (acc, [size, { skills }]) => [
      ...acc,
      ...Object.values(skills).map(v => ({
        ...v,
        size: size.split(" ")[0].toLowerCase()
      }))
    ],
    []
  )
  .map(({ enchant, name, size, tag }) => ({
    name,
    tag,
    size,
    enchant,
    notables: notables
      .filter(({ weight }) => weight[tag])
      .map(({ skill, name, weight, type }) => ({
        skill,
        name,
        weight: weight[tag],
        type
      }))
  }));

let file = fs.openSync("./src/Notables.json", "w+");
fs.writeSync(file, JSON.stringify(notables, null, 2));
fs.closeSync(file);

file = fs.openSync("./src/Jewels.json", "w+");
fs.writeSync(file, JSON.stringify(jewels, null, 2));
fs.closeSync(file);
