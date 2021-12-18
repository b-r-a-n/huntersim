importScripts('../pkg/rusthuntersim.js');
const { run_sim, get_spells} = wasm_bindgen;

self.onmessage = function(e) {
    run(e.data);
}

async function run(runData) {
    await wasm_bindgen('../pkg/rusthuntersim_bg.wasm');
    let results = [];
    for (let run of runData) {
        let input = JSON.stringify(run.input);
        let stats = run_sim(input);
        results.push({itemName: run.itemName, dps: stats.dps + stats.pet_dps});
    }
    results.sort((a, b) => { 
        if (a.dps < b.dps) return 1;
        if (a.dps > b.dps) return -1;
        return 0; 
    });
    self.postMessage(results);
}
