import * as Items from './data/items.js';
import * as Talents from './data/talents.js';
import * as Spells from './data/spells.js';

function statsFromItems(state) {
    let result = {};
    for (let slot in state.items) {
        let itemId = state.items[slot];
        let item = Items.item(itemId);
        if (!item) { console.log('Missing item with id ' + itemId); continue; }
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
        let lust = 2825; 
        if (buffId == lust) {
            abilities.push(buffId);
            continue;
        }
        let drums = [35475, 35476, 351360, 351355];
        if (drums.includes(buffId)) {
            abilities.push(buffId);
            continue;
        }
        pet_auras.push(buffId);
        hunter_auras.push(buffId);
    }
    for (let buffId of settings.activeDebuffs) {
        target_auras.push(buffId);
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
        abilities: abilities,
        hunter_mods: itemMods,
        pet_mods: {},
        target_mods: {
            "armor": settings.targetArmor,
        },
    };
}

export {create_wasm}