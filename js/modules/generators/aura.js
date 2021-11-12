class AuraGenerator {
    constructor() {
        this.auras = [];
    }
    peekEvent() {
        if (this.auras.length < 1) { return null; }
        return this.auras.map(b=>b.ts).sort()[0];
    }
    popEvent() {
        if (this.auras.length < 1) { return null; }
        var auraIdx = null;
        var minTs = null;
        for (let idx in this.auras) {
            let aura = this.auras[idx];
            if (!minTs || aura.ts < minTs) {
                minTs = aura.ts;
                auraIdx = idx;
            }
        }
        let e = this.auras[auraIdx];
        this.auras.splice(auraIdx, 1);
        return e;
    }
    handleEvent(sim, e) {
        if (e.type !== 'cast') return;
        if (!e.auraId) return;
        let aura = sim.auras(e.auraId);
        if (!aura) return;
        if (aura.type === 'buff' || aura.type === 'debuff') {
            let auraInfo = {
                ts: e.ts,
                abilityId: aura.id,
                targetId: e.targetId,
                sourceId: e.sourceId,
                mods: aura.mods,
                duration: aura.duration,
                type: aura.type
            }
            this.auras.push(auraInfo);
        }
    }
}

// Applies/removes auras based on events
class AuraHandler {
    constructor() {}
    peekEvent() {
        return null;
    }
    popEvent() {
        return null;
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'debuff':
            case 'buff': {
                let aura = sim.auras(e.abilityId);
                if (!aura) { console.warn('Aura lookup failed', e); return; }
                let target = sim.entities[e.targetId];
                let source = sim.entities[e.sourceId];
                for (let a of target.auras) {
                    // TODO: Stacking/dedup attrib
                    if (a.abilityId == aura.id && a.sourceId == e.sourceId) {
                        a.expiresTs = e.ts + a.duration;
                        return;
                    }
                }
                var auraInfo = {
                    sourceId: e.sourceId,
                    abilityId: aura.id,
                    mods: aura.modsFn ? aura.modsFn(source) : aura.mods,
                    expiresTs: e.ts + e.duration
                };
                target.auras.push(auraInfo);
                break;
            }
            case 'removedebuff':
            case 'removebuff': {
                let aura = sim.auras(e.abilityId);
                let target = sim.entities[e.targetId];
                for (let idx in target.auras) {
                    let auraInfo = target.auras[idx];
                    if (aura.id == auraInfo.abilityId && e.sourceId == auraInfo.sourceId) {
                        target.auras.splice(idx, 1);
                        break;
                    }
                }
                break;
            }
        }
    }
}
export {AuraGenerator, AuraHandler}