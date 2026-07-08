// Static combos database index for React Native (no import.meta.glob)

const ggStriveCombos = require('./ggstrive.json');
const dbfzCombos = require('./dbfz.json');
const fatalFuryCombos = require('./fatalfury.json');

// MK1 Combos
const mk1Combos = {
  "Ashrah": require("./mk1_combos/ashrah.json"),
  "Baraka": require("./mk1_combos/baraka.json"),
  "Conan the Barbarian": require("./mk1_combos/conan.json"),
  "Cyrax": require("./mk1_combos/cyrax.json"),
  "Ermac": require("./mk1_combos/ermac.json"),
  "General Shao": require("./mk1_combos/shao-kahn.json"),
  "Geras": require("./mk1_combos/geras.json"),
  "Ghostface": require("./mk1_combos/ghostface.json"),
  "Havik": require("./mk1_combos/havik.json"),
  "Homelander": require("./mk1_combos/homelander.json"),
  "Johnny Cage": require("./mk1_combos/johnny-cage.json"),
  "Kenshi": require("./mk1_combos/kenshi.json"),
  "Kitana": require("./mk1_combos/kitana.json"),
  "Kung Lao": require("./mk1_combos/kung-lao.json"),
  "Li Mei": require("./mk1_combos/li-mei.json"),
  "Liu Kang": require("./mk1_combos/liu-kang.json"),
  "Mileena": require("./mk1_combos/mileena.json"),
  "Nitara": require("./mk1_combos/nitara.json"),
  "Noob Saibot": require("./mk1_combos/noob-saibot.json"),
  "Omni-Man": require("./mk1_combos/omni-man.json"),
  "Peacemaker": require("./mk1_combos/peacemaker.json"),
  "Quan Chi": require("./mk1_combos/quan-chi.json"),
  "Raiden": require("./mk1_combos/raiden.json"),
  "Rain": require("./mk1_combos/rain.json"),
  "Reiko": require("./mk1_combos/reiko.json"),
  "Reptile": require("./mk1_combos/reptile.json"),
  "Scorpion": require("./mk1_combos/scorpion.json"),
  "Sektor": require("./mk1_combos/sektor.json"),
  "Shang Tsung": require("./mk1_combos/shang-tsung.json"),
  "Sindel": require("./mk1_combos/sindel.json"),
  "Smoke": require("./mk1_combos/smoke.json"),
  "Sub-Zero": require("./mk1_combos/sub-zero.json"),
  "T-1000": require("./mk1_combos/t-1000.json"),
  "Takeda": require("./mk1_combos/takeda.json"),
  "Tanya": require("./mk1_combos/tanya.json"),
};

// SF6 Combos (from individual character files)
const rawSf6Combos = {
  "AKI": require("./sf6_combos/aki.json"),
  "Alex": require("./sf6_combos/alex.json"),
  "Akuma": require("./sf6_combos/akuma.json"),
  "Blanka": require("./sf6_combos/blanka.json"),
  "C. Viper": require("./sf6_combos/cviper.json"),
  "Cammy": require("./sf6_combos/cammy.json"),
  "Chun-Li": require("./sf6_combos/chun-li.json"),
  "Dee Jay": require("./sf6_combos/dee-jay.json"),
  "Dhalsim": require("./sf6_combos/dhalsim.json"),
  "Ed": require("./sf6_combos/ed.json"),
  "Honda": require("./sf6_combos/edmond-honda.json"),
  "Elena": require("./sf6_combos/elena.json"),
  "Guile": require("./sf6_combos/guile.json"),
  "Ingrid": require("./sf6_combos/ingrid.json"),
  "Jamie": require("./sf6_combos/jamie-siu.json"),
  "JP": require("./sf6_combos/johan-jp-petrovic.json"),
  "Juri": require("./sf6_combos/juri-han.json"),
  "Ken": require("./sf6_combos/ken-masters.json"),
  "Kimberly": require("./sf6_combos/kimberly-jackson.json"),
  "Lily": require("./sf6_combos/lily-hawk.json"),
  "Luke": require("./sf6_combos/luke-sullivan.json"),
  "M. Bison": require("./sf6_combos/m-bison.json"),
  "Mai (SF6)": require("./sf6_combos/mai-shiranui.json"),
  "Manon": require("./sf6_combos/manon.json"),
  "Marisa": require("./sf6_combos/marisa.json"),
  "Rashid": require("./sf6_combos/rashid.json"),
  "Ryu": require("./sf6_combos/ryu.json"),
  "Sagat": require("./sf6_combos/sagat.json"),
  "Terry (SF6)": require("./sf6_combos/terry-bogard.json"),
  "Zangief": require("./sf6_combos/zangief.json"),
};

const sf6Combos = {};
for (const [charName, data] of Object.entries(rawSf6Combos)) {
  if (Array.isArray(data)) {
    sf6Combos[charName] = data.map(move => ({
      name: move.name,
      input: move.input,
      damage: move.damage || "-",
      difficulty: move.difficulty || "-",
      description: move.description || "",
      category: move.category || "Special Moves"
    }));
  }
}

// Tekken 8 Combos (Requires mapping at import time if not mapped in json)
const rawTekken8Combos = {
  "Alisa": require("./tekken_8_combos/alisa.json"),
  "Anna": require("./tekken_8_combos/anna.json"),
  "Armor King": require("./tekken_8_combos/armor-king.json"),
  "Asuka": require("./tekken_8_combos/asuka.json"),
  "Azucena": require("./tekken_8_combos/azucena.json"),
  "Bryan": require("./tekken_8_combos/bryan.json"),
  "Claudio": require("./tekken_8_combos/claudio.json"),
  "Clive": require("./tekken_8_combos/clive.json"),
  "Devil Jin": require("./tekken_8_combos/devil-jin.json"),
  "Dragunov": require("./tekken_8_combos/dragunov.json"),
  "Eddy": require("./tekken_8_combos/eddy.json"),
  "Fahkumram": require("./tekken_8_combos/fahkumram.json"),
  "Feng": require("./tekken_8_combos/feng.json"),
  "Heihachi": require("./tekken_8_combos/heihachi.json"),
  "Hwoarang": require("./tekken_8_combos/hwoarang.json"),
  "Jack-8": require("./tekken_8_combos/jack-8.json"),
  "Jin Kazama": require("./tekken_8_combos/jin-kazama.json"),
  "Jun Kazama": require("./tekken_8_combos/jun-kazama.json"),
  "Kazuya": require("./tekken_8_combos/kazuya.json"),
  "King": require("./tekken_8_combos/king.json"),
  "Kuma": require("./tekken_8_combos/kuma.json"),
  "Kunimitsu": require("./tekken_8_combos/kunimitsu.json"),
  "Lars": require("./tekken_8_combos/lars.json"),
  "Law": require("./tekken_8_combos/marshal.json"),
  "Lee": require("./tekken_8_combos/lee.json"),
  "Leroy": require("./tekken_8_combos/leroy.json"),
  "Lidia": require("./tekken_8_combos/lidia.json"),
  "Lili": require("./tekken_8_combos/lili.json"),
  "Miary": require("./tekken_8_combos/miary.json"),
  "Nina Williams": require("./tekken_8_combos/nina-williams.json"),
  "Panda": require("./tekken_8_combos/panda.json"),
  "Paul Phoenix": require("./tekken_8_combos/paul-phoenix.json"),
  "Raven": require("./tekken_8_combos/raven.json"),
  "Reina": require("./tekken_8_combos/reina.json"),
  "Shaheen": require("./tekken_8_combos/shaheen.json"),
  "Steve": require("./tekken_8_combos/steve.json"),
  "Victor": require("./tekken_8_combos/victor.json"),
  "Xiaoyu": require("./tekken_8_combos/ling.json"),
  "Yoshimitsu": require("./tekken_8_combos/yoshimitsu.json"),
  "Zafina": require("./tekken_8_combos/zafina.json"),
};

const tekken8Combos = {};
for (const [charName, data] of Object.entries(rawTekken8Combos)) {
  if (Array.isArray(data)) {
    tekken8Combos[charName] = data.map(move => ({
      name: move.name,
      input: move.input,
      damage: move.damage || "-",
      difficulty: "-",
      description: move.description || "",
      category: move.category || "combo"
    }));
  }
}

const COMBOS_DB = {
  "Mortal Kombat 1": mk1Combos,
  "Street Fighter 6": sf6Combos,
  "Tekken 8": tekken8Combos,
  "Guilty Gear Strive": ggStriveCombos,
  "Dragon Ball FighterZ": dbfzCombos,
  "Fatal Fury: City of the Wolves": fatalFuryCombos
};

export default COMBOS_DB;
