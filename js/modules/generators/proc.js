class ProcHandler {
    constructor(procs) {
        this.procs = procs;
        this.pending = [];
        this.icds = {};
    }
    peekEvent() {
        if (this.pending.length <= 0) return null;
        return this.pending[0].ts;
    }
    popEvent(sim) {
        let e = this.pending[0];
        this.icds[e.procId] = this.icds[e.procId] || {};
        this.icds[e.procId][e.sourceId] = sim.ts + (e.procIcd || 0)
        this.pending.splice(0, 1);
        return e;
    }
    handleEvent(sim, e) {
        let procs = this.procs.filter(p => p.event === e.type);
        if (!procs) return;
        for (let proc of procs) {
            if (!proc.triggerAbilityIds.includes(e.abilityId)) continue;
            if (proc.requiresCrit && !e.isCritical) continue;
            let icd = (this.icds[proc.id] || {})[e.sourceId];
            if (icd && icd > sim.ts) continue;
            if (!sim.rand.check(proc.chance)) continue;
            let ability = sim.abilities(proc.abilityId);
            let eventInfo = {
                ts: e.ts,
                procId: proc.id,
                procIcd: proc.icd,
                sourceId: e.sourceId,
                targetId: proc.targetId,
                abilityId: ability.id,
                duration: ability.duration,
                type: ability.type
            };
            this.pending.push(eventInfo);
        }
    }
}
export {ProcHandler}