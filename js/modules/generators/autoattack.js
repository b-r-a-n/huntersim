class AutoAttackGenerator {
    constructor(source, target, abilityId) {
        this.source = source;
        this.target = target;
        this.abilityId = abilityId;
        this.nextAttackTs = 0;
    }
    peekEvent() {
        return this.nextAttackTs;
    }
    popEvent(ts) {
        let e = {
            ts: this.nextAttackTs,
            type: 'cast',
            sourceId: this.source.id,
            targetId: this.target.id,
            abilityId: this.abilityId,
            school: 'physical',
            cost: 0,
            duration: 0
        };
        let base = this.source.mhWeapon.stats.mspd*1000;
        this.nextAttackTs = this.nextAttackTs + (base/this.source.meleeHaste());
        return e;
    }
    handleEvent(e) {}
}
export {AutoAttackGenerator}