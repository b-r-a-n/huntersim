class Simulation {
    constructor(simTime, rand, player, pet, target, modSpells, spells) {
        this.ts = 0;
        this.simTime = simTime;
        this.rand = rand;
        this.player = player;
        this.pet = pet;
        this.target = target;
        this.eventLog = [];
        this.modSpells = modSpells;
        this._spells = spells;
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
    run(generators, maxIter=100000) {
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
        if (iters>=maxIter) console.warn('End due to max iterations');
    }
}
export {Simulation}