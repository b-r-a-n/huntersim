function randomChoice(chances, names, randFn) {
    if (chances.length != (names.length-1)) throw 'invalid chance size';
    let rem = Math.max(0, (1 - chances.reduce((p,c)=>{return p+c;}, 0)));
    let rId = Number(randFn.which(chances.concat([rem])));
    return names[rId];
}
function mitigation(source, target, school) {
    switch(school) {
        case 'physical': {
            var armor = target.armor;
            armor = Math.max(0, armor - source.armorPen(target));
            return armor/(armor+400+85*((5.5*70)-265.5));
        }
    }
    return 0.0;
}
function hitTable(source, target, abilityId) {
    let miss = Math.max(0, source.miss(target, abilityId)-source.hit(target, abilityId));
    let crit = source.crit(target, abilityId);
    let dodge = source.dodge(target, abilityId);
    let glance = source.glance(target, abilityId);
    return [miss, dodge, glance, crit];
}
function damage(source, target, abilityId, school, result, randFn) {
    let glanceMod = 0.75;
    var rawDamage = 0;
    var damage = 0;
    if (result === 'miss' && result === 'dodge') return damage;
    let damageMod = source.damageMod(target, abilityId, randFn);
    let critDamageMod = source.critDamageMod(target, abilityId);
    rawDamage = randFn.between(source.minDamage(target, abilityId), source.maxDamage(target, abilityId));
    rawDamage *= damageMod;
    if (result === 'crit') { rawDamage *= critDamageMod; }
    if (result === 'glance') { rawDamage *= glanceMod; }
    let mit = Math.max(0.0, 1.0 - mitigation(source, target, school));
    damage = rawDamage * mit;
    return damage;
}

const _resultTable = ['miss', 'dodge', 'glance', 'crit', 'hit'];

function damageEvent(source, target, e, randFn) {
    let result = randomChoice(hitTable(source, target, e.abilityId), _resultTable, randFn);
    let value = damage(source, target, e.abilityId, e.school, result, randFn);
    return {
        ts: e.ts,
        type: 'damage',
        abilityId: e.abilityId,
        sourceId: source.id,
        targetId: target.id,
        school: e.school,
        damage: value,
        isCritical: (result === 'crit'),
        isGlance: (result === 'glance'),
        isMiss: (result === 'miss' || result === 'dodge')
    }
}
class DamageGenerator {
    constructor(abilityIds) {
        this.nextEvents = [];
        this.abilityIds = abilityIds;
    }
    peekEvent(sim) {
        return this.nextEvents.length > 0 ? this.nextEvents[0].ts : null;
    }
    popEvent(sim) {
        let e = this.nextEvents[0];
        let source = sim.entities[e.sourceId];
        let target = sim.entities[e.targetId];
        let damage = damageEvent(source, target, e, sim.rand);
        this.nextEvents.splice(0, 1);
        return damage;
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'cast': {
               if (e.sourceId && e.targetId && e.abilityId && this.abilityIds.includes(e.abilityId)) {
                   this.nextEvents.push(e);
               }
            }
        }
    }
}
export {DamageGenerator}