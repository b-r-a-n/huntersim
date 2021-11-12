import * as Items from './data/items.js';
import * as Talents from './data/talents.js';
import * as Spells from './data/spells.js';
import * as Procs from './data/procs.js';
import * as Races from './data/races.js';
import * as Pets from './data/pets.js';
import {Hunter, Target, Pet} from './entities.js';
import * as Rotation from './rotation.js';

function getStats(stats) {
    var data = {};
    for (let stat in stats) {
        var curr = (data[stat] || 0); 
        curr += stats[stat];
        data[stat] = curr;
    }
    return data;
}
function getStatMods(modifiers) {
    var data = {};
    for (let mod in modifiers) {
        let val = modifiers[mod].reduce((p,c)=>p=p*(1+c),1);
        data[mod] = val-1;
    }
    return data;
}
    

const additiveStats = ['agi', 'str', 'int', 'sta', 'map', 'rap', 'critr', 'hitr', 'fps', 'mps', 'arpr', 'hstr', 'crit', 'hit', 'rcrit', 'rhit'];

function statsFromBuffs(state) {
    var modifiers = {};
    var petModifiers = {};
    var petStats = {};
    var stats = {};
    var weaponBuffs = (state.mhStone ? [state.mhStone] : []).concat((state.ohStone ? [state.ohStone] : []));
    var appliedBuffs = state.passiveBuffs.concat(weaponBuffs);
    for (let buffId of appliedBuffs) {
        let buff = Spells.spell(buffId);
        for (let k of Object.keys(buff.data)) {
            if (k.startsWith('mod')) {
                let val = buff.data[k];
                if (val) {
                    modifiers[k] = modifiers[k] || [];
                    modifiers[k].push(Number(val));
                    petModifiers['pet'+k] = petModifiers['pet'+k] || [];
                    petModifiers['pet'+k].push(Number(val));
                }
            }
            else { 
                stats[k] = (stats[k] || 0) + Number(buff.data[k]); 
                petStats[k] = (petStats[k] || 0) + Number(buff.data[k]); 
            }
        }
    }
    for (let buffId of state.petBuffs) {
        let buff = Spells.spell(buffId);
        for (let k of Object.keys(buff.data)) {
            petStats[k] = (petStats[k] || 0) + buff.data[k];
        }
    }
    modifiers['modrhst'] = modifiers['modrhst'] || [];
    modifiers['modrhst'].push(state.quiverHaste/100);
    return {modifiers: modifiers, petModifiers: petModifiers, stats: stats, petStats: petStats};
};
function statsFromTalents(talentPoints) {
    var modifiers = {};
    var petModifiers = {};
    var stats = {};
    var petStats = {};
    for (let talent in talentPoints) {
        let points = talentPoints[talent];
        if (points < 1) continue;
        let data = Talents.all[talent].mods;
        for (let k in data) {
            if (k.startsWith('mod')) {
                modifiers[k] = (modifiers[k] || []);
                modifiers[k].push(data[k]*points);
            }
            else if (k.startsWith('petmod')) {
                let key = k.split('pet')[1];
                petModifiers[key] = (petModifiers[key] || []);
                petModifiers[key].push(data[k]*points);
            }
            else if (additiveStats.includes(k)) {
                stats[k] = stats[k] || 0;
                stats[k] += data[k]*points;
            }
            else if (k.startsWith('pet') && additiveStats.includes(k.split('pet')[1])) {
                let key = k.split('pet')[1];
                petStats[key] = data[k]*points;
            }
        }
    }
    return {modifiers: modifiers, petModifiers: petModifiers, petStats: petStats, stats: stats};
}

function statsFromItems(state) {
    let result = {};
    for (let slot in state.items) {
        let itemId = state.items[slot];
        let item = Items.item(itemId);
        if (!item) { console.log('Missing item with id ' + itemId); continue; }
        for (let k in item.stats) {
            if (k == 'dps' && item.slot != 24) continue;
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
        }
    }
    for (let enchantId of Object.values(state.enchants)) {
        let enchant = Spells.spell(enchantId);
        for (let k in enchant.data) {
            result[k] = result[k] || 0;
            result[k] += enchant.data[k];
        }
    }
    return result;
}

class RandFn {
    constructor(seed) {
        this.seed = seed;
    }
    gen() {
        let val = Math.sin(this.seed++)*1000;
        return val - Math.floor(val);
    }
    check(chance) {
        let randVal = this.gen();
        return randVal < chance;
    }
    which(chances) {
        let randVal = this.gen();
        var cumulative = 0;
        for (let idx in chances) {
            cumulative += chances[idx];
            if (randVal <= cumulative) { return idx; }
        }
        console.error('Invalid chance array, should sum to 1 was ' + chances);
        return null;
    }
    between(min, max) {
        let delta = max-min;
        let randVal = this.gen();
        return Math.floor(min + delta*randVal);
    }
}

function create(settings) {
    let simTime = settings.fightDuration * 1000;
    let randFn = new RandFn(settings.randomSeed);
    let rangedWeapon = Items.item(settings.items[18]);
    let ammoId = settings.items[0];
    let ammo = Items.item(ammoId);
    let talents = Talents.decode(settings.encodedTalents);
    const damageFns = {
        1: (s, t, d) => {
            return (d+s.meleeAp(t)*s.meleeBaseSpeed()/14);
        },
        75: (s, t, d) => { 
            return s.ammoDamage()+(s.rangedAp(t)*s.rangedBaseSpeed()/14+s.bonusDamage(t)+d)*s.rangedDamageMod(t);
        },
        27050: (s, t, d) => {
            return d;
        },
        27021: (s, t, d) => {
            return (s.ammoDamage()+s.rangedAp(t)*0.2+205+d+s.bonusDamage(t))*s.rangedDamageMod(t)*s.bonusMod(t,27021);
        },
        27019: (s, t, d) => {
            return (s.rangedAp(t)*0.15+273)*s.rangedDamageMod(t)*s.bonusMod(t,27019);
        },
        34027: (s, t, d) => {
            return (d+s.meleeAp(t)*s.meleeBaseSpeed()/14+127);
        },
        34120: (s, t, d) => {
            return (s.rangedAp(t)*0.2+150+d*2.8/s.rangedBaseSpeed()+s.bonusDamage(t))*s.rangedDamageMod(t)*s.bonusMod(t,34120);
        },
        35298: (s, t, d) => {
            return d;
        }
    }
    let player = new Hunter(
        1, 'orc', Items.item(settings.items[16]), Items.item(settings.items[17]), rangedWeapon, ammo, talents, Spells
    );
    let pet = new Pet(2, player, Spells, randFn);
    let target = new Target(3, settings.targetArmor, damageFns);
    let buffsInfo = statsFromBuffs(settings);
    let talentsInfo = statsFromTalents(talents);
    let modifiers =  {}
    let petModifiers =  {}
    for (let k in buffsInfo.modifiers) {
        let val = buffsInfo.modifiers[k];
        modifiers[k] = (modifiers[k] || []).concat(val);
    }
    for (let k in talentsInfo.modifiers) {
        let val = talentsInfo.modifiers[k];
        modifiers[k] = (modifiers[k] || []).concat(val);
    }
    for (let k in buffsInfo.petModifiers) {
        let val = buffsInfo.petModifiers[k];
        petModifiers[k] = (petModifiers[k] || []).concat(val);
    }
    for (let k in talentsInfo.petModifiers) {
        let val = talentsInfo.petModifiers[k];
        petModifiers[k] = (petModifiers[k] || []).concat(val);
    }
    for (let id of settings.petAbilities) {
        let ability = Spells.spell(id);
        if (ability.type === 'buff') {
            for (let k in ability.mods) {
                let val = ability.mods[k];
                petModifiers[k] = (petModifiers[k] || []).concat(val);
            }
        }    
    }
    let playerStats = {
        RACE_SOURCE_ID: getStats(Races.race(settings.race).stats),
        GEAR_SOURCE_ID: getStats(statsFromItems(settings)),
        BUFFS_SOURCE_ID: getStats(buffsInfo.stats),
        CONSUMES_SOURCE_ID: getStats({}),
        TALENTS_SOURCE_ID: getStats(talentsInfo.stats),
        MODIFIERS_SOURCE_ID: getStatMods(modifiers),
        SUPPRESSION_ID: {crit: -0.048 - 0.0153},
    };
    for (let sourceId in playerStats) {
        player.auras.push({
            sourceId: sourceId,
            abilityId: -1,
            mods: playerStats[sourceId],
            expiresTs: simTime,
        });
    }
    // Mana pool needs to be updated to reflect new int
    player.setMaxResource(player.mana());
    let petStats = {
        FAMILY_SOURCE_ID: getStats(Pets.family(settings.petFamily).stats),
        BUFFS_SOURCE_ID: getStats(buffsInfo.petStats),
        CONSUMES_SOURCE_ID: getStats({}),
        TALENTS_SOURCE_ID: getStats(talentsInfo.petStats),
        MODIFIERS_SOURCE_ID: getStatMods(petModifiers),
        PET_HAPPINESS_SOURCE_ID: {moddmg: 0.25},
        SUPPRESSION_ID: {crit: -0.048},
    };
    for (let sourceId in petStats) {
        pet.auras.push({
            sourceId: sourceId,
            abilityId: -1,
            mods: petStats[sourceId],
            expiresTs: simTime,
        });
    }
    var modifiedSpells = {};
    if (player.talents.rapidKilling) {
        let spell = JSON.parse(JSON.stringify(Spells.spell(3045)));
        spell.cd -= (player.talents.rapidKilling*60000);
        modifiedSpells[3045] = spell;
    }
    if (player.talents.improvedArcaneShot) {
        let spell = JSON.parse(JSON.stringify(Spells.spell(27019)));
        spell.cd -= (player.talents.improvedArcaneShot*200);
        modifiedSpells[27019] = spell;
    }
    if (player.talents.goForTheThroat) {
        let spell = JSON.parse(JSON.stringify(Spells.spell(34954)));
        spell.mods.focus = (player.talents.goForTheThroat*25);
        modifiedSpells[34954] = spell;
    }
    if (player.talents.masterTactician) {
        let spell = JSON.parse(JSON.stringify(Spells.spell(34839)));
        spell.mods.crit = (player.talents.masterTactician*0.02);
        modifiedSpells[34839] = spell;
    }
    if (player.talents.improvedHawk) {
        let spell = JSON.parse(JSON.stringify(Spells.spell(6150)));
        spell.mods.modrhst = (player.talents.improvedHawk*0.05);
        modifiedSpells[6150] = spell;
    }
    var procs = [];
    for (let p of Procs.all) {
        let proc = JSON.parse(JSON.stringify(p));
        let required = Procs.requirements(p.id);
        if (required.none) { procs.push(proc); continue; }
        if (required.items) {
            var itemCount = 0;
            for (let itemId of required.items) {
                if (settings.items.includes(itemId)) itemCount++;
            }
            if (itemCount >= required.count) { procs.push(proc); continue; }
        }
        if (required.talent && player.talents[required.talent]) { procs.push(proc); continue; }
    }
    // Fill in templates
    for (let proc of procs) {
        if (proc.targetId === 's') proc.targetId = player.id;
        if (proc.targetId === 't') proc.targetId = target.id;
        if (proc.targetId === 'p') proc.targetId = pet.id;
        if (proc.ppm) proc.chance = player.rangedPPM()*proc.ppm;
        if (proc.chancePerTalent) {
            let points = player.talents[Procs.requirements(proc.id).talent];
            proc.chance = points*proc.chancePerTalent;
        }
    }
    // Special case auras
    let auras = [];
    for (let idx in Array(settings.numFerocious).fill(0)) {
        auras.push({
            targetId: player.id,
            sourceId: -idx-1,
            abilityId: 34460,
            mods: Spells.spell(34460).mods,
        });
        auras.push({
            targetId: pet.id,
            sourceId: -idx-1,
            abilityId: 34460,
            mods: Spells.spell(34460).mods,
        });
    }
    auras.push({
        targetId: player.id,
        sourceId: player.id,
        abilityId: 27044,
        mods: Spells.spell(27044).mods,
    });
    return {
        simTime: simTime,
        rand: randFn,
        player: player,
        pet: pet,
        target: target,
        debuffs: Rotation.defaultDebuffRules(settings.debuffs, target),
        buffs: Rotation.defaultBuffRules(settings, player, pet),
        auras: auras,
        modifiedSpells: modifiedSpells,
        procs: procs,
        playerRules: Rotation.defaultHunterRotation(player, pet, target),
        petRules: Rotation.defaultPetRotation(pet, settings.petAbilities, target)
    };
}
export {create}