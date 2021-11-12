class CastGenerator {
    constructor() {
        this.casts = [];
    }
    peekEvent(sim) {
        var minTs = null;
        for (let castId in this.casts) {
            let cast = this.casts[castId];
            if ((! minTs) || (cast.endTs < minTs)) {
                minTs = cast.endTs;
            }
        }
        return minTs;
    }
    popEvent(sim) {
        var nextExpirationId = null;
        var minTs = null;
        for (let castId in this.casts) {
            let cast = this.casts[castId];
            if ((! minTs) || (cast.endTs < minTs)) {
                nextExpirationId = castId;
                minTs = cast.endTs;
            }
        }
        if (! nextExpirationId) { return null; }
        let cast = this.casts[nextExpirationId];
        this.casts.splice(nextExpirationId, 1);
        return {
            ts: minTs,
            type: 'cast',
            abilityId: cast.abilityId,
            sourceId: cast.sourceId,
            targetId: cast.targetId,
            school: cast.school,
            cost: cast.cost,
            auraInfo: cast.auraInfo,
            duration: cast.endTs - cast.ts
        }
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'begincast': {
                this.casts.push({
                    endTs: e.ts + e.duration,
                    abilityId: e.abilityId,
                    sourceId: e.sourceId,
                    targetId: e.targetId,
                    school: e.school,
                    cost: e.cost,
                    auraInfo: e.auraInfo,
                    ts: e.ts
                });
                break;
            }
        }
    }
}
export {CastGenerator}