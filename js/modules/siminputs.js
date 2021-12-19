import * as Items from './data/items.js';
import * as Talents from './data/talents.js';
import * as Spells from './data/spells.js';

function gemMatchesSocket(socketId, gem) {
    switch (gem.subclass) {
        case 0: return socketId == 2;
        case 1: return socketId == 4;
        case 2: return socketId == 3;
        case 3: return socketId == 2 || socketId == 4;
        case 4: return socketId == 3 || socketId == 4;
        case 5: return socketId == 2 || socketId == 3;
        case 6: return socketId == 1;
        case 8: return true;
    }
    return false;
}

function getSocketBonusId(items, gems, slot) {
    let item = Items.item(items[slot]);
    if (!item.socketbonus) return 0;
    if (item.socket1) {
        if (!gems[slot]) return 0;
        if (!gems[slot][0]) return 0;
        let gem = Items.item(gems[slot][0]);
        if (!gemMatchesSocket(item.socket1, gem)) return 0;
    }
    if (item.socket2) {
        if (!gems[slot]) return 0;
        if (!gems[slot][1]) return 0;
        let gem = Items.item(gems[slot][1]);
        if (!gemMatchesSocket(item.socket2, gem)) return 0;
    }
    if (item.socket3) {
        if (!gems[slot]) return 0;
        if (!gems[slot][2]) return 0;
        let gem = Items.item(gems[slot][2]);
        if (!gemMatchesSocket(item.socket3, gem)) return 0;
    }
    return item.socketbonus;
}

const _socketBonuses = {
    75: {"agi": 2},
    90: {"agi": 4},
    104: {"sta": 6},
    2859: {"res": 3},
    2860: {"mhitr": 3, "rhitr": 3},
    2862: {"res": 3},
    2863: {"int": 3},
    2865: {"mps": 2},
    2867: {"res": 2},
    2868: {"sta": 6},
    2869: {"int": 4},
    2871: {"dgdr": 4},
    2873: {"mhitr": 4, "rhitr": 4},
    2874: {"mcritr": 4, "rcritr": 4},
    2876: {"dgdr": 2},
    2877: {"agi": 4},
    2878: {"res": 4},
    2879: {"str": 3},
    2882: {"sta": 6},
    2886: {"mhitr": 2, "rhitr": 2},
    2887: {"mcritr": 3, "rcritr": 3},
    2893: {"agi": 3},
    2895: {"sta": 4},
    2902: {"mcritr": 2, "rcritr": 2},
    2925: {"sta": 3},
    2927: {"str": 4},
    2936: {"map": 8, "rap": 8},
    2941: {"mhitr": 2, "rhitr": 2},
    2952: {"mcritr": 4, "rcritr": 4},
    2973: {"map": 6, "rap": 6},
    3015: {"str": 2},
    3092: {"mcritr": 3, "rcritr": 3},
    3114: {"map": 4, "rap": 4},
    3149: {"agi": 2},
    3164: {"sta": 3},
}

function statsFromItems(state) {
    let result = {};
    for (let slot in state.items) {
        let itemId = state.items[slot];
        let item = Items.item(itemId);
        if (!item) { continue; }
        for (let k in item.stats) {
            if (k == 'dps' && item.slot != 24) continue;
            if (k == 'mmaxdmg') {
                let newK = slot == 16 ? 'mhmaxdmg' : 'ohmaxdmg';
                result[newK] = result[newK] || 0;
                result[newK] += item.stats[k];
                continue;
            }
            if (k == 'mmindmg') {
                let newK = slot == 16 ? 'mhmaxdmg' : 'ohmindmg';
                result[newK] = result[newK] || 0;
                result[newK] += item.stats[k];
                continue;
            }
            if (k == 'mspd') {
                let newK = slot == 16 ? 'mhspd' : 'ohspd';
                result[newK] = result[newK] || 0;
                result[newK] += item.stats[k];
                continue;
            }
            result[k] = result[k] || 0;
            result[k] += item.stats[k];
        }
        for (let idx in state.gems[slot]) {
            let gemId = state.gems[slot][idx];
            if (!gemId) continue;
            let gem = Items.item(gemId);
            if (!gem) { console.log('Could not find gem with id ' + gemId); continue; }
            for (let k in gem.stats) {
                result[k] = result[k] || 0;
                result[k] += gem.stats[k];
            }
            if (gemId == 32409) {
                result['mcritd'] = result['mcritd'] || 0;
                result['mcritd'] += 0.03;
                result['rcritd'] = result['rcritd'] || 0;
                result['rcritd'] += 0.03;
            }
        }
        let socketBonusId = getSocketBonusId(state.items, state.gems, slot);
        if (Number(socketBonusId) > 0) {
            let socketBonus = _socketBonuses[socketBonusId];
            for (let k in socketBonus) {
                result[k] = result[k] || 0;
                result[k] += socketBonus[k];
            }
        }
    }
    for (let enchantId of Object.values(state.enchants)) {
        let enchant = Spells.spell(enchantId);
        for (let k in enchant.data) {
            result[k] = result[k] || 0;
            result[k] += enchant.data[k];
        }
    }
    var weaponBuffs = (state.mhStone ? [state.mhStone] : []).concat((state.ohStone ? [state.ohStone] : []));
    for (let buffId of weaponBuffs) {
        let buff = Spells.spell(buffId);
        for (let k in buff.data) {
            result[k] = result[k] || 0;
            result[k] += buff.data[k];
        }
    }
    result['rhst'] = state.quiverHaste/100;
    return result;
}
function create_wasm(settings) {
    let talents = [];
    let hunter_auras = [];
    let pet_auras = [];
    let target_auras = [];
    let talentsPoints = Talents.decode(settings.encodedTalents);
    let abilities = settings.abilities;
    let external_abilities = [];
    for (let talentId in talentsPoints) {
        let points = talentsPoints[talentId];
        if (points > 0) { 
            let aura_id = Talents.spellId(talentId, points);
            talents.push(aura_id); 
        }
    }
    for (let buffId of settings.passiveBuffs) {
        let kiblers = 43771;
        if (buffId == kiblers) {
            pet_auras.push(buffId);
            continue;
        }
        let consumes = [28520, 33262, 28497]
        if (consumes.includes(buffId)) {
            hunter_auras.push(buffId);
            continue;
        }
        pet_auras.push(buffId);
        hunter_auras.push(buffId);
    }
    for (let buffId of settings.activeBuffs) {
        let hawk = 27044;
        if (buffId == hawk) {
            hunter_auras.push(buffId);
            continue;
        }
        let ext_buff = [35475, 35476, 351360, 351355, 2825];
        if (ext_buff.includes(buffId)) {
            let buff = {id: buffId}
            external_abilities.push(buff);
            continue;
        }
        if (settings.activeBuffParams[buffId]) {
            let buff = settings.activeBuffParams[buffId];
            buff.id = buffId;
            external_abilities.push(buff);
        } else {
            pet_auras.push(buffId);
            hunter_auras.push(buffId);
        }
    }
    for (let buffId of settings.activeDebuffs) {
        if (settings.activeDebuffParams[buffId]) {
            let debuff = settings.activeDebuffParams[buffId];
            debuff.id = buffId;
            debuff.target = 3;
            external_abilities.push(debuff);
        } else {
            target_auras.push(buffId);
        }
    }
    let itemMods = statsFromItems(settings);
    let itemIds = [];
    for (let slot in settings.items) {
        itemIds.push(settings.items[slot]);
    }
    for (let itemId of settings.activeItems) {
        itemIds.push(itemId);
    }
    return {
        duration: settings.fightDuration,
        iterations: settings.iterations || 100,
        seed: settings.randomSeed,
        race: settings.race,
        pet_family: settings.petFamily,
        talents: talents,
        item_ids: itemIds,
        hunter_auras: hunter_auras,
        pet_auras: pet_auras,
        target_auras: target_auras,
        external_abilities: external_abilities,
        abilities: abilities,
        hunter_mods: itemMods,
        pet_mods: {},
        target_mods: {
            "armor": settings.targetArmor,
        },
    };
}

export {create_wasm, _socketBonuses as socketBonuses}