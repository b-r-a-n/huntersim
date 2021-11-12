class AbilityGenerator {
    constructor(source, rules) {
        this.source = source;
        this.castEndTs = null;
        this.gcdTs = 0;
        this.repeatIntervals = {};
        this.rules = rules;
        this.abilityCds = {};
        this.gcd = 1500;
    }
    nextAbility(sim, nextTs) {
        var nextAbility = null;
        var ts = null;
        var targetId = null;
        for (let rule of this.rules) {
            let globalCD = this.abilityCds[rule.abilityId] || (rule.minTs || 0);
            let targetCD = ((this.repeatIntervals[rule.targetId] || {})[rule.abilityId] || 0);
            let cdTs = Math.max(globalCD, targetCD);
            if (cdTs <= nextTs) {
                let ability = sim.abilities(rule.abilityId);
                let target = sim.entities[rule.targetId];
                if (rule.usable(ability, this.source, target, nextTs)) {
                    nextAbility = ability;
                    targetId = target.id;
                    ts = cdTs;
                    break;
                }
            } 
        }
        return {ability: nextAbility, targetId: targetId, ts: nextTs};
    }
    peekEvent(sim) {
        let nextAvailableTs = Math.max((this.castEndTs || 0), (this.gcdTs || 0), sim.ts);
        var next = this.nextAbility(sim, nextAvailableTs);
        return next.ability ? next.ts : null;
    }
    popEvent(sim) {
        let nextAvailableTs = Math.max((this.castEndTs || 0), (this.gcdTs || 0), sim.ts);
        let next = this.nextAbility(sim, nextAvailableTs);
        if (!next.ability) { console.warn('Ability no longer valid', this.castEndTs, this.gcdTs, nextAvailableTs); return; }
        var type = 'begincast';
        let isInstant = (next.ability.castTime || 0) <= 0;
        if (isInstant) {
            type = 'cast';
            this.castEndTs = next.ts;
            if (next.ability.gcd) { 
                this.gcdTs = next.ts + this.gcd; 
            }
        }
        let hasteMod = 1.0;
        if (next.ability.ranged) hasteMod = this.source.rangedHaste();
        if (next.ability.melee) hasteMod = this.source.meleeHaste();
        var duration = (next.ability.castTime || 0)/hasteMod;
        let e = {
            type: type,
            sourceId: this.source.id,
            targetId: next.targetId,
            ts: next.ts,
            duration: duration,
            gcd: next.ability.gcd,
            school: next.ability.school,
            cost: next.ability.cost,
            abilityId: next.ability.id,
            auraId: next.ability.auraId
        };
        return e;
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'begincast': {
                if (e.sourceId == this.source.id) {
                    let ability = sim.abilities(e.abilityId) || {};
                    this.castEndTs = e.ts + e.duration;
                    let cd = Math.max((ability.cd || 0) - e.duration, 0.0);
                    this.abilityCds[e.abilityId] = e.ts + cd;
                    let rules = this.rules.filter(r=>r.abilityId==e.abilityId);
                    if (rules.length > 0 && rules[0].repeatInterval) {
                        this.repeatIntervals[e.targetId] = this.repeatIntervals[e.targetId] || {};
                        this.repeatIntervals[e.targetId][e.abilityId] = e.ts + Math.max(cd, rules[0].repeatInterval);
                    }
                    if (ability.gcd) { 
                        this.gcdTs = e.ts + this.gcd; 
                    }
                }
                break;
            }
            case 'cast': {
                if (e.sourceId == this.source.id) {
                    let ability = sim.abilities(e.abilityId);
                    if (!ability) return;
                    let cd = Math.max((ability.cd || 0) - e.duration, 0.0);
                    this.abilityCds[e.abilityId] = e.ts + cd;
                    this.castEndTs = e.ts;
                    let rules = this.rules.filter(r=>r.abilityId==e.abilityId);
                    if (rules.length > 0 && rules[0].repeatInterval) {
                        this.repeatIntervals[e.targetId] = this.repeatIntervals[e.targetId] || {};
                        this.repeatIntervals[e.targetId][e.abilityId] = e.ts + Math.max(cd, rules[0].repeatInterval);
                    }
                }
                break;
            }
        }
    }
}
export {AbilityGenerator}