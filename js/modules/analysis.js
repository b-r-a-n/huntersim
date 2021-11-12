function castsByType(eventLog) {
    let result = eventLog.filter(e=>e.type === 'cast').reduce((p,c)=>{
        p[c.abilityId] = p[c.abilityId] || 0;
        p[c.abilityId] += 1;
        return p;
    }, {});
    return result;
}

function damageBySource(eventLog) {
    let result = eventLog.filter(e=>e.type === 'damage').reduce((p,c)=>{
        p[c.sourceId] = p[c.sourceId] || 0;
        p[c.sourceId] += c.damage;
        return p;
    }, {});
    for (let k in result) result[k] /= ((eventLog[eventLog.length-1].ts)/1000)
    return result;
}

function damageByAbility(sim, sourceId) {
    let result = sim.eventLog.filter(e=>e.type === 'damage' && e.sourceId == sourceId).reduce((p,c)=>{
        p[c.abilityId] = p[c.abilityId] || [0, 0, 0];
        p[c.abilityId][0] += 1;
        p[c.abilityId][1] += c.isCritical ? 1 : 0;
        p[c.abilityId][2] += c.damage;
        return p;
    }, {});
    for (let k in result) result[k][2] /= ((sim.ts)/1000)
    return result;
}

export {castsByType, damageBySource, damageByAbility}