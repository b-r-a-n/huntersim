function family(name) {
    return _petFamilies[name];
}
const _petFamilies = {
    ravager: {
        stats: {str: 162, agi: 127, fps: 25, crit:0.01415, dmgmod:0.1}
    }
}
export {family}