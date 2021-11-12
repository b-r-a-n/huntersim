class AutoShotGenerator {
    constructor(source, target, abilityId) {
        this.baseWeaponSpeed = source.rangedWeapon.stats.rspd * 1000;
        this.source = source;
        this.isCasting = false;
        this.target = target;
        this.abilityId = abilityId;
        this.nextBeginCast = 0.0;
    }
    castTime() {
        return 500 / this.source.rangedHaste();
    }
    shotTime() {
        return this.baseWeaponSpeed/this.source.rangedHaste() - this.castTime();
    }
    peekEvent() {
        return this.nextBeginCast;
    }
    popEvent(sim) {
        return {
            ts: this.nextBeginCast,
            type: 'begincast',
            sourceId: this.source.id,
            targetId: this.target.id,
            abilityId: this.abilityId,
            school: 'physical',
            cost: 0,
            duration: this.castTime()
        };
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'buff': {
                break;
            }
            case 'begincast': {
                if (e.sourceId == this.source.id) {
                    if (e.abilityId == this.abilityId) {
                        this.nextBeginCast = e.ts + e.duration + this.shotTime();
                    } else {
                        this.nextBeginCast = Math.max(e.ts + e.duration, this.nextBeginCast);
                    }
                    this.source.nextBeginCast = this.nextBeginCast;
                    this.isCasting = true;
                }
                break;
            }
            case 'cast': {
                if (e.sourceId == this.source.id) {
                    if (e.abilityId == this.abilityId) {
                        this.nextBeginCast = e.ts + this.shotTime();
                    }
                    this.source.nextBeginCast = this.nextBeginCast;
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