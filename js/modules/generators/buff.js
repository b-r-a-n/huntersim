class BuffHandler {
    constructor() {
        this.buffs = [];
    }
    peekEvent() {
        var minTs = null;
        for (let buff of this.buffs) {
            let endTs = buff.ts + buff.duration;
            if ((! minTs) || (endTs < minTs)) {
                minTs = endTs;
            }
        }
        return minTs;
    }
    popEvent(sim, ts) {
        var expiringBuffIdx = null;
        var minTs = null;
        for (let idx in this.buffs) {
            let buff = this.buffs[idx];
            let endTs = buff.ts + buff.duration;
            if ((! minTs) || (endTs < minTs)) {
                expiringBuffIdx = idx;
                minTs = endTs;
            }
        }
        if (! expiringBuffIdx) { return null; }
        let buff = this.buffs[expiringBuffIdx];
        this.buffs.splice(expiringBuffIdx, 1);
        return {
            ts: minTs,
            type: 'remove' + sim.abilities(buff.abilityId).type,
            abilityId: buff.abilityId,
            sourceId: buff.sourceId,
            targetId: buff.targetId,
            totalDuration: minTs - buff.ts
        }
    }
    flush(sim, ts) {
        var events = [];
        for (let buff of this.buffs) {
            events.push({
                ts: ts,
                type: 'remove' + sim.abilities(buff.abilityId).type,
                abilityId: buff.abilityId,
                sourceId: buff.sourceId,
                targetId: buff.targetId,
                totalDuration: ts - buff.ts
            });
        }
        this.buffs = [];
        return events;
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'buff':
            case 'debuff':
                var refresh = false;
                for (var buff of this.buffs) {
                    if ((e.targetId == buff.targetId) && (e.abilityId == buff.abilityId) && (e.sourceId == buff.sourceId)) {
                        let elapsed = e.ts - buff.ts;
                        buff.duration = buff.duration - elapsed + e.duration;
                        refresh = true;
                    }
                }
                if (!refresh) { 
                    let duration = sim.abilities(e.abilityId).duration;
                    this.buffs.push({
                        ts: e.ts,
                        duration: duration,
                        abilityId: e.abilityId,
                        sourceId: e.sourceId,
                        targetId: e.targetId
                    }); 
                }
                break;
        }
    }
}
export {BuffHandler}