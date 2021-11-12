class ResourceHandler {
    constructor(sourceIds, type, period) {
        this.sourceIds = sourceIds;
        this.type = type;
        this.period = period;
        this.nextTick = 0;
        this.costs = {};
    }
    peekEvent() {
        return this.nextTick;
    }
    popEvent(sim) {
        for (let id of this.sourceIds) {
            let s = sim.entities[id];
            if (s.resource.type === this.type) {
                var val = s.resourceRegen();
                s.resource.current += val;
                s.resource.current = Math.min(s.resource.current, s.resource.max);
            }
        }
        this.nextTick += this.period;
        return null;
    }
    handleEvent(sim, e) {
        switch(e.type) {
            case 'cast': {
                var sourceId = null;
                for (let id of this.sourceIds) {
                    if (id == e.sourceId) {
                        sourceId = id;
                        break;
                    }
                }
                if (sourceId) {
                    let target = sim.entities[e.targetId];
                    let source = sim.entities[sourceId];
                    this.costs[source.id] = this.costs[source.id] || {};
                    this.costs[source.id][e.abilityId] = e.cost;
                    // TODO : Check if this should be multi (e.g. cost/(1+scr))
                    let cost = e.cost * Math.max(0, (1-source.costReduction(target, e.abilityId)));
                    source.resource.current = Math.max(0, source.resource.current - cost);
                }
                break;
            }
            case 'damage': {
                var sourceId = null;
                for (let id of this.sourceIds) {
                    if (id == e.sourceId) {
                        sourceId = id;
                        break;
                    }
                }
                if (sourceId) {
                    let target = sim.entities[e.targetId];
                    let source = sim.entities[sourceId];
                    let val = source.resourcePerHit(target);
                    source.resource.current += val;
                    source.resource.current = Math.min(source.resource.max, source.resource.current);
                }
                break;
            }
            case 'energize': {
                var sourceId = null;
                for (let id of this.sourceIds) {
                    if (id == e.sourceId) {
                        sourceId = id;
                        break;
                    }
                }
                if (sourceId) {
                    let ability = sim.abilities(e.abilityId);
                    var val = (ability.mods[this.type] || 0);
                    let source = sim.entities[sourceId];
                    source.resource.current += val;
                    source.resource.current = Math.min(source.resource.max, source.resource.current);
                }
                break;
            }
        }
    }
}
function manaHandler(entities) {
    return new ResourceHandler(entities, 'mana', 5000);
}
function focusHandler(entities) {
    return new ResourceHandler(entities, 'focus', 5000);
}
export {manaHandler, focusHandler}