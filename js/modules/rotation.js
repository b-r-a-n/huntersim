function hasResource(ability, source) { return ability.cost <= source.resource.current; }

function killComandUsable(ability, source, target) { 
    return hasResource(ability, source, target) && (source.auras.filter(a => a.mods.cankc).length >= 1);
}

function shotUsable(ability, source, target, ts) {
    let dur = source.nextBeginCast - ts;
    let clip = ability.castTime/source.rangedHaste() - dur;
    return hasResource(ability, source, target) && (clip <= 300);
}

function missingFromTarget(ability, source, target) { 
    return !target.auras.map(a=>a.abilityId).includes(ability.id);
}

function always() {
    return true;
}

function defaultHunterRotation(hunter, pet, target, cdTs=15000) {
    let rules = [];
    if (hunter.talents.bestialWrath) {
        rules.push({abilityId: 19574, minTs: cdTs, targetId: pet.id, usable: hasResource});
    }
    if (hunter.race === 'orc') {
        rules.push({abilityId: 20572, minTs: cdTs, targetId: hunter.id, usable: hasResource});
    }
    if (hunter.race === 'troll') {
        rules.push({abilityId: 26296, minTs: cdTs, targetId: hunter.id, usable: hasResource});
    }
    rules.push({abilityId: 3045, minTs: cdTs, targetId: hunter.id, usable: hasResource});
    rules.push({abilityId: 28507, minTs: cdTs, targetId: hunter.id, usable: hasResource});
    rules.push({abilityId: 35166, minTs: cdTs, targetId: hunter.id, usable: hasResource});
    rules.push({abilityId: 34026, targetId: pet.id, usable: killComandUsable}); // KC
    rules.push({abilityId: 27021, targetId: target.id, usable: shotUsable}); // Multi
    rules.push({abilityId: 34120, targetId: target.id, usable: shotUsable}); // Steady
    rules.push({abilityId: 27019, targetId: target.id, usable: shotUsable}); // Arcane
    return rules;
}

function defaultPetRotation(pet, abilityIds, target, cdTs=15000) {
    let rules = [];
    rules.push({abilityId: 34027, targetId: target.id, usable: killComandUsable});
    for (let abilityId of abilityIds) {
        rules.push({abilityId: abilityId, targetId: target.id, usable: hasResource});
    }
    return rules;
}

function defaultDebuffRules(debuffs, target) {
    return debuffs.map(id => { return {abilityId: id, targetId: target.id, usable: missingFromTarget}});
}
function defaultBuffRules(settings, player, pet, cdTs=15000) {
    let simTime = settings.fightDuration*1000;
    let buffRules = [];
    for (let abilityId of settings.totems) {
        buffRules.push({abilityId: abilityId, targetId: player.id, usable: missingFromTarget});
        buffRules.push({abilityId: abilityId, targetId: pet.id, usable: missingFromTarget});
    }
    if (settings.numLusts > 0) {
        buffRules.push({abilityId: 2825, minTs: cdTs, repeatInterval: simTime/settings.numLusts, targetId: player.id, usable: missingFromTarget});
        buffRules.push({abilityId: 2825, minTs: cdTs, repeatInterval: simTime/settings.numLusts, targetId: pet.id, usable: missingFromTarget});
    }
    if (settings.drums) {
        buffRules.push({abilityId: settings.drums, minTs: cdTs, repeatInterval: 120000, targetId: player.id, usable: missingFromTarget});
        buffRules.push({abilityId: settings.drums, minTs: cdTs, repeatInterval: 120000, targetId: pet.id, usable: missingFromTarget});
    }
    return buffRules;
}
export {defaultHunterRotation, defaultPetRotation, defaultDebuffRules, defaultBuffRules}