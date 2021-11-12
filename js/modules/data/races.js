const _races = {
    orc: {
        stats: {str: 67, agi: 148, sta: 110, int: 74, spi: 86, hp: 3488, mana: 3253, petmoddmg: 0.05}
    },
    troll: {
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
};
function race(name) {
    return _races[name];
}
export {race};