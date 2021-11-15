import * as Util from './util.js';
import * as UISettings from './settings.js';

function makeTable(title, rowInfo, headers=[], tooltips={}) {
    let fmt = new Intl.NumberFormat()
    let colspan = typeof(Object.values(rowInfo)[0]) === 'object' ? Object.values(rowInfo)[0].length+1 : 2;
    var html = `<table class='simple mt'><thead>`
    if (title.length > 0) {
        html += `<tr><th colspan=${colspan}>${title}</th></tr>`;
    }
    if (headers.length == colspan) {
        html += `<tr>`;
        for (let header of headers) {
            html += `<th><div>${header}</div></th>`
        }
        html += `</tr>`;
    }
    html += `</thead>`;
    for (let k in rowInfo) {
        if (tooltips[k]) {
            html += `<tr><td><div class='tooltip'>${k}<span class='tooltiptext'>${tooltips[k]}</span></div></td>`;
        } else {
            html += `<tr><td><div class='notooltip'>${k}</div></td>`;
        }
        if (colspan <= 2) {
            html += `<td>${typeof(rowInfo[k]) === typeof(1) ? fmt.format(rowInfo[k]) : rowInfo[k]}</td>`
        } else {
            for (let col of rowInfo[k]) {
                html += `<td>${typeof(col) === typeof(1) ? fmt.format(col) : col}</td>`
            }
        }
        html += '</tr>'
    }
    html += '</tbody></table>';
    return Util.t2e(html);
}

function exportCSV(simulation) {
    // ts, event, sourceId, targetId, ?result, ?damage
    let headers = [['timestamp', 'event', 'ability', 'source', 'target', 'value']];
    let data = headers.concat(simulation.eventLog.map(e=>[e.ts, e.type, e.abilityId, e.sourceId, e.targetId, e.damage]));
    let csv = "data:text/csv;charset=utf-8," + data.map(e=>e.join(',')).join('\n');
    window.open(encodeURI(csv));
}

function updateHistory(selector) {
    var i = 0;
    var results = [];
    while (i < 5) {
        let key = 'prev' + i;
        let item = localStorage.getItem(key);
        if (item) {
            let info = JSON.parse(item);
            let result = info.result;
            results.push([info.savedTs, result.hunter, result.pet, key]);
        }
        i++;
    }
    var html = '<legend>Recent</legend><table><tbody>';
    for (let result of results.sort((a,b)=>{ 
        if (a[0] < b[0]) return 1;
        if (a[0] > b[0]) return -1;
        return 0;
    })) {
        let minutesAgo = Math.floor((Date.now() - result[0])/60000);
        html += `<tr data-key='${result[3]}' class='btn'><td>${minutesAgo}m ago</td><td>DPS: ${Math.floor(result[1]+result[2])}</td></tr>`;
    }
    html += '</tbody></table>';
    let elements = Util.t2e(html);
    for (let element of elements) {
        if (element.className === 'btn') element.onclick = (e) => { 
            let storageKey = e.srcElement.dataset.key;
            let settings = JSON.parse(localStorage.getItem(storageKey));
            if (settings.savedTs) delete settings.savedTs;
            UISettings.update(document, settings);
        }
    }
    selector.replaceChildren(...elements);
}

function update(document, simulation, aggregateInfo, min, max) {
    let totalDmg = simulation.eventLog
        .filter(e=>e.type === 'damage')
        .reduce((p,c) => {
            let key = c.sourceId === simulation.pet.id ? 'Pet' : 'Hunter';
            p[key] = p[key] || 0;
            p[key] += c.damage;
            return p;
        }, {});
    for (let k in totalDmg) { totalDmg[k] = Math.floor(totalDmg[k]/(simulation.ts/1000)); }
    totalDmg['Total'] = totalDmg['Hunter'] + totalDmg['Pet'];
    let exportButton = Util.t2e('<div class="btn">Export .csv</div>');
    exportButton[0].onclick = (e) => { exportCSV(simulation); };
    document.querySelector('#result').replaceChildren(...Util.t2e('<legend>Result</legend>'));
    var tableInfo = {};
    var totalDps = 0;
    for (let k in aggregateInfo) {
        let vals = aggregateInfo[k];
        if (k==='pet') {
            tableInfo['Pet'] = ['', '', Math.floor(vals[2]*10)/10];
        } else {
            let fKey = `<a data-wh-icon-size="tiny" href=https://tbc.wowhead.com/spell=${k}></a>`
            tableInfo[fKey] = [Math.floor(vals[0]), Math.floor(1000*vals[1]/vals[0])/10, Math.floor(vals[2]*10)/10];
        }
        totalDps += vals[2];
    }
    let abilityTable = makeTable('Ability Breakdown', tableInfo);
    let html = `<div class='resultgrid'><div class='dpsgrid'><div>${Math.floor(10*totalDps)/10}</div><div>${Math.floor(10*min)/10} - ${Math.floor(10*max)/10}</div></div><div id='abilityinfo'></div></div>`
    document.querySelector('#result').append(...Util.t2e(html));
    document.querySelector('#abilityinfo').replaceChildren(...abilityTable);
    document.querySelector('.dpsgrid').append(...exportButton);
    updateHistory(document.querySelector('#history'));
    $WowheadPower.refreshLinks();

}

export {update, updateHistory}