const _races = {
    orc: {
        id: 'orc', name: 'Orc',
        stats: {str: 67, agi: 148, sta: 110, int: 74, spi: 86, hp: 3488, mana: 3253, petmoddmg: 0.05}
    },
    troll: {
        id: 'troll', name: 'Troll', 
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
    tauren: {
        id: 'tauren', name: 'Tauren',
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
    bloodelf: {
        id: 'bloodelf', name: 'Blood Elf',
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
    dwarf: {
        id: 'dwarf', name: 'Dwarf', 
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
    nightelf: {
        id: 'nightelf', name: 'Night Elf',
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
    draenei: {
        id: 'draenei', name: 'Draenei',
        stats: {str: 65, agi: 153, sta: 109, int: 73, spi: 84, hp: 3488, mana: 3253}
    },
};
function race(name) {
    return _races[name];
}
export {_races as all, race};