const _damage_functions = {
    1: (s, t, d) => {
        return (d+s.meleeAp(t)*s.meleeBaseSpeed()/14);
    },
    75: (s, t, d) => { 
        return s.ammoDamage()+(s.rangedAp(t)*s.rangedBaseSpeed()/14+s.bonusDamage(t)+d)*s.rangedDamageMod(t);
    },
    27050: (s, t, d) => {
        return d;
    },
    27021: (s, t, d) => {
        return (s.ammoDamage()+s.rangedAp(t)*0.2+205+d+s.bonusDamage(t))*s.rangedDamageMod(t)*s.bonusMod(t,27021);
    },
    27019: (s, t, d) => {
        return (s.rangedAp(t)*0.15+273)*s.rangedDamageMod(t)*s.bonusMod(t,27019);
    },
    34027: (s, t, d) => {
        return (d+s.meleeAp(t)*s.meleeBaseSpeed()/14+127);
    },
    34120: (s, t, d) => {
        return (s.rangedAp(t)*0.2+150+d*2.8/s.rangedBaseSpeed()+s.bonusDamage(t))*s.rangedDamageMod(t)*s.bonusMod(t,34120);
    },
    35298: (s, t, d) => {
        return d;
    }
}
function getMods(auras, addKeys, multKeys) {
    let result = {};
    for (let key of addKeys) { result[key] = 0; }
    for (let key of multKeys) { result[key] = 0; }
    for (let aura of (auras || [])) {
        for (let key of addKeys) {
            result[key] += (aura.mods[key] || 0);
        }
        for (let key of multKeys) {
            result[key] = ((1 + result[key]) * (1 + (aura.mods[key] || 0)) - 1);
        }
    }
    for (let key of multKeys) { result[key] += 1; }
    return result;
}
class Entity {
    constructor(id, mhWeapon, ohWeapon, rangedWeapon, ammo, talents, resource, spells) {
        this.id = id;
        this.mhWeapon = mhWeapon;
        this.ohWeapon = ohWeapon;
        this.rangedWeapon = rangedWeapon;
        this.ammo = ammo;
        this.talents = talents;
        this.agiToCrit = 4000;
        this.intToMana = 15;
        this.strToAp = 2;
        this.resource = resource;
        this.spells = spells;
        this.auras = [];
        this.abilityAuras = {};
    }
    copy() {
        return new Entity(this.id, this.mhWeapon, this.ohWeapon, this.rangedWeapon, this.ammo,
            JSON.parse(JSON.stringify(this.talents)), JSON.parse(JSON.stringify(this.resource)), spells);
    }
    setMaxResource(val) {
        let percent = this.resource.current/this.resource.max;
        this.resource.max = val;
        this.resource.current = percent*this.resource.max;
    }
    costReduction(target, abilityId) {
        return 0;
    }
    armorPen(target, abilityId) {
        let s = getMods(this.auras, ['arpr', 'arp'],[]);
        let t = getMods(target.auras, ['aarpr', 'aarp'],[]);
        return s.arp + s.arpr + t.aarp + t.aarpr;
    }
    resourcePerHit(target) {
        return 0;
    }
    meleeAp(target, abilityId) {
        let s = getMods(this.auras, ['ap', 'map', 'str'], ['modap', 'modmap', 'strp']);
        let t = getMods(target.auras, ['aap', 'amap', 'astr'], ['amodap', 'amodmap', 'astrp']);
        let apFromHunter = 0;//this.owner.rangedAp(target) * 0.22;
        let apFromStr = this.str(target) * this.strToAp;
        return Math.floor((s.ap + t.aap + s.map + t.amap + apFromStr + apFromHunter) * s.modap * t.amodap * s.modmap * t.amodmap);
    }
    rangedAp(target) {
        let s = getMods(this.auras, ['ap', 'rap', 'agi'], ['modap', 'modrap', 'modagi']);
        let t = getMods(target.auras, ['aap', 'arap', 'aagi'], ['amodap', 'amodrap', 'amodagi']);
        let agi = this.agi(target);
        let ce = 0;//this.talents.carefulAim * 0.15 * this.int(target);
        return Math.floor((s.ap + t.aap + s.rap + t.arap + agi + ce) * s.modap * t.amodap * s.modrap * t.amodrap);
    }
    resourceRegen() {
        return 0;
    }
    rangedHaste() {
        let stats = getMods(this.auras, ['hstr', 'rhstr'], ['modhst', 'modrhst']);
        return stats.modhst * stats.modrhst * (1 + stats.hstr/1580) * (1 + stats.rhstr/1580);
    }
    meleeHaste(target, abilityId) {
        let stats = getMods(this.auras, ['hstr', 'mhstr'], ['modhst', 'modmhst']);
        return stats.modhst * stats.modmhst * (1 + stats.hstr/1580) * (1 + stats.mhstr/1580);
    }
    haste(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.ranged) return this.rangedHaste(target, abilityId);
        if (ability.melee) return this.meleeHaste(target, abilityId);
        return 1.0;
    }
    str(target) {
        let s = getMods(this.auras, ['str'], ['strp']);
        let t = getMods(target.auras, ['astr'], ['astrp']);
        return (s.str + t.astr) * s.strp * t.astrp;
    }
    dodge(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.melee) return 0.065;
        return 0.0;
    }
    glance(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.melee) return 0.24;
        return 0.0;
    }
    agi(target) {
        let s = getMods(this.auras, ['agi'], ['modagi']);
        let t = getMods(target.auras, ['aagi'], ['amodagi']);
        return Math.floor((s.agi + t.aagi) * s.modagi * t.amodagi);
    }
    int(target) {
        let s = getMods(this.auras, ['int'], ['modint']);
        let t = getMods(target.auras, ['aint'], ['amodint']);
        return Math.floor((s.int + t.aint) * s.modint * t.amodint);
    }
    meleeCrit(target, abilityId) {
        let s = getMods(this.auras, ['critr', 'mcritr', 'agi', 'crit', 'mcrit'], ['modagi']);
        let t = getMods(target.auras, ['acritr', 'amcritr', 'aagi', 'amcrit', 'acrit'], ['amodagi']);
        let agi = this.agi(target);
        let critr = s.critr + t.acritr + s.mcritr + t.amcritr;
        let modcrit = s.crit + t.acrit + s.mcrit + t.amcrit;
        return agi/this.agiToCrit + critr/2207.6 + modcrit;
    }
    rangedCrit(target, abilityId) {
        let aAuras = this.abilityAuras[abilityId] || [];
        let s = getMods(this.auras, ['critr', 'rcritr', 'agi', 'crit', 'rcrit'], ['modagi']);
        let a = getMods(aAuras, ['critr', 'rcritr', 'agi', 'crit', 'rcrit'], ['modagi']);
        let t = getMods(target.auras, ['acritr', 'arcritr', 'aagi', 'arcrit', 'acrit'], ['amodagi']);
        let agi = this.agi(target);
        let critr = s.critr + a.critr + t.acritr + s.rcritr + a.rcritr + t.arcritr;
        let modcrit = s.crit + a.crit + t.acrit + s.rcrit + a.rcrit + t.arcrit;
        return agi/this.agiToCrit + critr/2207.6 + modcrit;
    }
    crit(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.ranged) return this.rangedCrit(target, abilityId);
        if (ability.melee) return this.meleeCrit(target, abilityId);
        return 0.0;
    }
    rangedDamageMod(target, abilityId) {
        let aAuras = this.abilityAuras[abilityId] || [];
        let s = getMods(this.auras, [], ['moddmg', 'modrdmg']);
        let a = getMods(aAuras, [], ['moddmg', 'modrdmg']);
        let t = getMods(target.auras, [], ['amoddmg', 'amodrdmg']);
        return s.moddmg * s.modrdmg * a.moddmg * a.modrdmg * t.amoddmg * t.amodrdmg;
    }
    rangedCritDamageMod(target, abilityId) {
        let baseMod = 2.0;
        let s = getMods(this.auras, [], ['modcritd', 'modrcritd']);
        let t = getMods(target.auras, [], ['amodcritd', 'amodrcritd']);
        return 1 + (1.0 * s.modcritd * s.modrcritd * t.amodcritd * t.amodrcritd);
    }
    meleeCritDamageMod(target, abilityId) {
        let baseMod = 2.0;
        let s = getMods(this.auras, [], ['modcritd', 'modmcritd']);
        let t = getMods(target.auras, [], ['amodcritd', 'amodmcritd']);
        return 1 + (1.0 * s.modcritd * s.modmcritd * t.amodcritd * t.amodmcritd);
    }
    meleeDamageMod(target, ability) {
        let s = getMods(this.auras, [], ['moddmg', 'modmdmg']);
        let t = getMods(target.auras, [], ['amoddmg', 'amodmdmg']);
        return s.moddmg * s.modmdmg * t.amoddmg * t.amodmdmg;
    }
    damageMod(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.ranged) return this.rangedDamageMod(target, abilityId);
        if (ability.melee) return this.meleeDamageMod(target, abilityId);
        return 1.0;
    }
    critDamageMod(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.ranged) return this.rangedCritDamageMod(target, abilityId);
        if (ability.melee) return this.meleeCritDamageMod(target, abilityId);
        return 1.0;
    }
    miss(target, abilityId) {
        return 0.08;
    }
    rangedHit(target, abilityId) {
        let s = getMods(this.auras, ['hitr', 'hit', 'rhitr', 'rhit'], []);
        let t = getMods(target.auras, ['ahitr', 'ahit', 'arhitr', 'arhit'], []);
        return s.hit + t.ahit + s.rhit + t.arhit + (s.hitr + s.rhitr + t.arhitr + t.ahitr)/1576;
    }
    meleeHit(target, abilityId) {
        let s = getMods(this.auras, ['hitr', 'hit', 'mhitr', 'mhit'], []);
        let t = getMods(target.auras, ['ahitr', 'ahit', 'amhitr', 'amhit'], []);
        return s.hit + t.ahit + s.mhit + t.amhit + (s.hitr + s.mhitr + t.amhitr + t.ahitr)/1576;

    }
    hit(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        if (ability.ranged) return this.rangedHit(target, abilityId);
        if (ability.melee) return this.meleeHit(target, abilityId);
        return 0.0;
    }
    minDamage(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        var d = ability.minDamage || 0;
        if (ability.weaponDamage) {
            if (ability.ranged) d = this.rangedWeapon.stats.rmindmg;
            if (ability.melee) d = this.mhWeapon.stats.mmindmg;
        }
        let fn = _damage_functions[abilityId] || ((s, t, d) => { return d; });
        return fn(this, target, d);
    }
    maxDamage(target, abilityId) {
        let ability = this.spells.spell(abilityId);
        var d = ability.maxDamage || 0;
        if (ability.weaponDamage) {
            if (ability.ranged) d = this.rangedWeapon.stats.rmaxdmg;
            if (ability.melee) d = this.mhWeapon.stats.mmaxdmg;
        }
        let fn = _damage_functions[abilityId] || ((s, t, d) => { return d; });
        return fn(this, target, d);
    }
    bonusDamage(target) {
        let s = getMods(this.auras, ['bdmg'], []);
        let t = getMods(target.auras, ['abdmg'], []);
        return (s.bdmg || 0) + (t.bdmg || 0);
    }
    bonusMod(target, abilityId) {
        // TODO: Added bonuses
        return 1.0;
    }
    rangedBaseSpeed(target, abilityId) {
        return this.rangedWeapon ? this.rangedWeapon.stats.rspd : 0;
    }
    meleeBaseSpeed(target, abilityId) {
        return this.mhWeapon ? this.mhWeapon.stats.mspd : 0;
    }
    rangedPPM(target, abilityId) {
        return this.rangedBaseSpeed(target, abilityId)/60;
    }
    ammoDamage(target, abilityId) {
        if (!this.rangedWeapon) return 0;
        let ammoDps = this.ammo ? this.ammo.stats.dps : 0;
        return ammoDps*this.rangedBaseSpeed(target, abilityId);
    }
    mana() {
        let stats = getMods(this.auras, ['mana', 'int'], ['modmana', 'modint']);
        return stats.mana + stats.int * stats.modint * this.intToMana * stats.modmana;
    }
    manaPerSecond() {
        let stats = getMods(this.auras, ['mps'], []);
        return stats.mps;
    }
}
class Hunter extends Entity {
    constructor(id, race, mhWeapon, ohWeapon, rangedWeapon, ammo, talents, spells) {
        let manaPool = {type: 'mana', max: 1, current: 1};
        super(id, mhWeapon, ohWeapon, rangedWeapon, ammo, talents, manaPool, spells);
        this.race = race;
        this.nextBeginCast = 0;
    }
    copy() {
        let hunter = new Hunter(this.id, this.race, this.mhWeapon, this.ohWeapon, this.rangedWeapon, this.ammo, JSON.parse(JSON.stringify(this.talents)), this.spells);
        hunter.resource = JSON.parse(JSON.stringify(this.resource));
        hunter.auras = JSON.parse(JSON.stringify(this.auras));
        return hunter;
    }
    rangedAp(target) {
        let s = getMods(this.auras, ['ap', 'rap', 'agi'], ['modap', 'modrap', 'modagi']);
        let t = getMods(target.auras, ['aap', 'arap', 'aagi'], ['amodap', 'amodrap', 'amodagi']);
        let agi = this.agi(target);
        let ce = this.talents.carefulAim * 0.15 * this.int(target);
        return Math.floor((s.ap + t.aap + s.rap + t.arap + agi + ce) * s.modap * t.amodap * s.modrap * t.amodrap);
    }
    rangedCrit(target, abilityId) {
        var crit = super.rangedCrit(target, abilityId);
        if (abilityId == 27021 && this.talents.improvedBarrage) {
            crit += (this.talents.improvedBarrage * 0.04);
        }
        if (this.race == 'troll') {
            // TODO: check for bow
            crit += 0.01;
        }
        return crit;
    }
    resourceRegen() {
        let stats = getMods(this.auras, ['mps'], []);
        return stats.mps;
    }
    resourcePerHit(target) {
        let s = getMods(this.auras, ['mph'], []);
        let t = getMods(target.auras, ['amph'], []);
        return Math.floor(s.mph + t.amph);
    }
    costReduction(target, abilityId) {
        let s = getMods(this.auras, [], ['scr']);
        var n = 1;
        // TODO: Ability const
        if ([27021, 34120, 27019].includes(abilityId)) {
            let reduction = this.talents.efficiency * 0.02;
            n += reduction;
        }
        return s.scr * n;
    }
}
class Target {
    constructor(id, armor) {
        this.id = id;
        this._armor = armor;
        this.auras = [];
    }
    copy() {
        let t = new Target(this.id, this._armor)
        t.auras = JSON.parse(JSON.stringify(this.auras));
        return t;
    }
    get armor() {
        var mod = 0;
        for (let aura of this.auras) {
            mod += aura.mods.armor || 0;
        }
        return mod + this._armor;
    }
}
class Pet extends Entity {
    constructor(id, owner, spells) {
        let petWeapon = {stats: {mspd: 2.0, mmindmg: 42, mmaxdmg: 48}};
        let focusPool = {type: 'focus', max: 100, current: 100};
        super(id, petWeapon, null, null, null, {}, focusPool, spells)
        this.owner = owner;
        this.agiToCrit = 3300;
        this.strToAp = 2;
        this.auras = [];
        this.randFn = null;
    }
    copy() {
        let p =  new Pet(this.id, this.owner, this.spells);
        p.auras = JSON.parse(JSON.stringify(this.auras));
        return p;
    }
    resourcePerHit(target) {
        let s = getMods(this.auras, ['fph'], []);
        let t = getMods(target.auras, ['afph'], []);
        return Math.floor(s.fph + t.afph);
    }
    resourceRegen() {
        let stats = getMods(this.auras, ['fps'], []);
        return stats.fps;
    }
    meleeAp(target, abilityId) {
        let s = getMods(this.auras, ['ap', 'map', 'str'], ['modap', 'modmap', 'strp']);
        let t = getMods(target.auras, ['aap', 'amap', 'astr'], ['amodap', 'amodmap', 'astrp']);
        let apFromHunter = this.owner.rangedAp({}) * 0.22;
        let apFromStr = this.str(target) * 2;
        return Math.floor((s.ap + t.aap + s.map + t.amap + apFromStr + apFromHunter) * s.modap * t.amodap * s.modmap * t.amodmap);
    }
    meleeDamageMod(target, abilityId) {
        let g = 1;
        if (abilityId == 35298 && this.randFn.check(0.5)) g = 2.0;
        return super.meleeDamageMod(target, abilityId) * g;
    }
}

export {Entity, Hunter, Target, Pet}