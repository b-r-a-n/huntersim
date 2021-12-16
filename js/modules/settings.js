function getLocalSettings(key) {
    let savedState = localStorage.getItem(key);
    if (!savedState) return null;
    let state = JSON.parse(savedState);
    return state;
}

const defaultSettings = {
    "passiveBuffs":[33262,43771,33077,33082,28497,24932,39926,26990,17055,39235,25898,27140,20048],
    "activeBuffs":[35476,34456,27044,25528,25359,30807,2825],
    "activeDebuffs":[26866,14169,26993,33602,27226,27159,14325,19425,27167,34501,29859],
    "abilities":[35298,75,34120,27021,27019,34026,19574,20572,3045],
    "activeItems":[22838,20520],
    "petFamily":"ravager",
    "fightDuration":200,
    "randomSeed":90,
    "targetArmor":7700,
    "targetType":"other",
    "encodedTalents":"512002005250122431051-0505201205",
    "quiverHaste":15,
    "race":"orc",
    "mhStone":28421,
    "ohStone":28421,
    "items":[33803,30141,30017,30143,null,30139,30040,29995,29951,29966,30140,29298,28791,29383,28830,28672,27846,28315,28772],
    "gems":{
        "1":[24028,32409],
        "3":[24028,24028],
        "5":[24055,31868,31868],
        "6":[24055,24055],
        "8":[24028,24028],
        "9":[24028],
        "16":[24055,24028]
    },
    "enchants":{
        "1":29192,"3":28888,"5":27960,"7":35490,"8":34007,
        "9":34002,"10":25080,"15":34004,"16":23800,"17":23800,"18":30260
    }
 };

export {getLocalSettings, defaultSettings}