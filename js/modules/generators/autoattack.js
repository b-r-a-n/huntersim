class AutoAttackGenerator {
    constructor(sourceId, targetId, abilityId) {
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.abilityId = abilityId;
        this.nextAttackTs = 0;
    }
    peekEvent() {
        return this.nextAttackTs;
    }
    popEvent(sim, ts) {
        let e = {
            ts: this.nextAttackTs,
            type: 'cast',
            sourceId: this.sourceId,
            targetId: this.targetId,
            abilityId: this.abilityId,
            school: 'physical',
            cost: 0,
            duration: 0
        };
        let source = sim.entities[this.sourceId];
        let base = source.mhWeapon.stats.mspd*1000;
        this.nextAttackTs = this.nextAttackTs + (base/source.meleeHaste());
        return e;
    }
    handleEvent(e) {}
}
export {AutoAttackGenerator}