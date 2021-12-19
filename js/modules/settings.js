function getLocalSettings(key) {
    let savedState = localStorage.getItem(key);
    if (!savedState) return null;
    let state = JSON.parse(savedState);
    return state;
}

function paramsForAura(id, auraType) {
    switch(id) {
        case 34456: return {uptime: 95, instances: 1};
        case 34501: return {uptime: 95, agility: 1100};
        case 33262:
        case 43771:
        case 28520:
        case 33077:
        case 33082:
        case 28497:
        case 24932:
        case 39926:
        case 26990:
        case 17055:
        case 31025:
        case 39235:
        case 25898:
        case 27140:
        case 20048:
        case 27142:
        case 20245:
        // Drums
        case 35475:
        case 35476:
        case 351360:
        case 351355:
        // BS imp
        case 12861:
        case 23563:
        case 37536:
        // Totem
        case 16208:
        // Lust
        case 2825: 
        // Expose
        case 14168: 
        case 14169: 
        // Imp FF
        case 33602: 
        // Imp HM
        case 19425: 
        // Consumes
        case 22838:
        case 22832:
        case 31677:
        case 20520:
        case 29528:
        case 29529:
        case 185848:
        case 185852:
        case 27050:
        case 35298:
        case 75:
        case 34120:
        case 27021:
        case 27019:
        case 34026:
        case 34074:
        case 19574:
        case 20572:
        case 26297:
        case 3045:
            return {};
    }
    return {uptime: 95};
}

const defaultSettings = {
    "passiveBuffs":[33262,43771,33077,33082,28497,24932,39926,26990,17055,39235,25898,27140,20048],
    "activeBuffs":[35476,34456,27044,25528,25359,30807,2825],
    "activeBuffParams":{},
    "activeDebuffs":[26866,14169,26993,33602,27226,27159,14325,19425,27167,34501,29859],
    "activeDebuffParams":{},
    "abilities":[35298,75,34120,27021,27019,34026,19574,20572,3045],
    "activeItems":[22838,20520],
    "petFamily":"ravager",
    "fightDuration":200,
    "iterations":100,
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

export {getLocalSettings, defaultSettings, paramsForAura}