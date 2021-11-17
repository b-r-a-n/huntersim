class RandFn {
    constructor(seed) {
        this.seed = seed;
    }
    gen() {
        let val = Math.sin(this.seed++)*1000;
        return val - Math.floor(val);
    }
    check(chance) {
        let randVal = this.gen();
        return randVal < chance;
    }
    which(chances) {
        let randVal = this.gen();
        var cumulative = 0;
        for (let idx in chances) {
            cumulative += chances[idx];
            if (randVal <= cumulative) { return idx; }
        }
        console.error('Invalid chance array, should sum to 1 was ' + chances);
        return null;
    }
    between(min, max) {
        let delta = max-min;
        let randVal = this.gen();
        return Math.floor(min + delta*randVal);
    }
}
class Simulation {
    constructor(simTime, seed, player, pet, target, modSpells, spells, abilityGroups) {
        this.ts = 0;
        this.simTime = simTime;
        this.rand = new RandFn(seed);
        this.player = player.copy();
        this.pet = pet.copy();
        this.pet.randFn = this.rand;
        this.pet.owner = this.player;
        this.target = target.copy();
        this.eventLog = [];
        this.modSpells = JSON.parse(JSON.stringify(modSpells));
        this._spells = spells;
        this._abilityGroups = abilityGroups;
    }
    get entities() {
        let ents = {};
        ents[this.player.id] = this.player;
        ents[this.pet.id] = this.pet;
        ents[this.target.id] = this.target;
        return ents;
    }
    auras(id) {
        return this.modSpells[id] || this._spells[id];
    }
    abilities(id) {
        return this.modSpells[id] || this._spells[id];
    }
    abilityGroups(id) {
        return this._abilityGroups[id] || [];
    }
    reset() {
        this.eventLog = [];
        this.ts = 0;
    }
    run(generators, maxIter=100000) {
        this.reset();
        var active = true;
        var eventLog = this.eventLog;
        var iters = 0;
        while (active && iters < maxIter) {
            iters++;
            var nextEventGenIdx = null;
            var nextTs = null;
            for (let idx in generators) {
                let generator = generators[idx];
                let eventTs = generator.peekEvent(this);
                if ((eventTs !== null) && ((nextTs === null) || (eventTs < nextTs))) {
                    nextEventGenIdx = idx;
                    nextTs = eventTs;
                }
            }
            if (! nextEventGenIdx) { active = false; continue; }
            let e = generators[nextEventGenIdx].popEvent(this);
            if (!e) { continue; }
            this.ts = e.ts;
            eventLog.push(e);
            for (let g of generators) {
                g.handleEvent(this, e);
            }
            active = (this.ts < this.simTime);
        }
        for (let g of generators) {
            if (g.flush) g.flush(this);
        }
        if (iters>=maxIter) console.warn('End due to max iterations');
    }
}
export {Simulation}