class AutoShotGenerator {
    constructor(sourceId, targetId, abilityId) {
        this.sourceId = sourceId;
        this.isCasting = false;
        this.targetId = targetId;
        this.abilityId = abilityId;
        this.nextBeginCast = 0.0;
    }
    castTime(source) {
        return 500 / source.rangedHaste();
    }
    shotTime(source) {
        return source.rangedBaseSpeed()*1000/source.rangedHaste() - this.castTime(source);
    }
    peekEvent() {
        return this.nextBeginCast;
    }
    popEvent(sim) {
        let source = sim.entities[this.sourceId];
        return {
            ts: this.nextBeginCast,
            type: 'begincast',
            sourceId: this.sourceId,
            targetId: this.targetId,
            abilityId: this.abilityId,
            school: 'physical',
            cost: 0,
            duration: this.castTime(source)
        };
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'buff': {
                break;
            }
            case 'begincast': {
                if (e.sourceId == this.sourceId) {
                    let source = sim.entities[this.sourceId];
                    if (e.abilityId == this.abilityId) {
                        this.nextBeginCast = e.ts + e.duration + this.shotTime(source);
                    } else {
                        this.nextBeginCast = Math.max(e.ts + e.duration, this.nextBeginCast);
                    }
                    source.nextBeginCast = this.nextBeginCast;
                    this.isCasting = true;
                }
                break;
            }
            case 'cast': {
                if (e.sourceId == this.sourceId) {
                    let source = sim.entities[this.sourceId];
                    if (e.abilityId == this.abilityId) {
                        this.nextBeginCast = e.ts + this.shotTime(source);
                    }
                    source.nextBeginCast = this.nextBeginCast;
                    this.isCasting = false;
                }
                break;
            }
            case 'removebuff': {
                break;
            }
        }
    }
}
export {AutoShotGenerator}