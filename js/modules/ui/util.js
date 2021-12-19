const _whUrl = 'https://tbc.wowhead.com/';

function t2e(text) {
    var template = document.createElement('template');
    template.innerHTML = text;
    return template.content.childNodes;
}

function whUrl(type, id, extras={}) {
    var params = '';
    for (let k in extras) {
        let values = extras[k];
        params += `&${k}=${values.join(':')}`;
    }
    return `${_whUrl}${type}=${id}${params}`;
}

function radiobox(options, name, addNone=false) {
    var html = '';
    var selected = false;
    for (let option of options) {
        selected = selected || option.checked;
        html += `<label class='btn'><input class='${option.cls}' type='radio' data-id=${option.id} name=${name} ${option.checked ? ' checked' : ''}>`;
        html += `<a href=${option.url}></a></label>`;
    }
    if (addNone) {
        html += `<label class='btn'><input type='radio' name=${name} ${selected ? '' : 'checked'}>None</label>`;
    }
    return t2e(html);
}

function checkbox(options) {
    var html = '';
    for (let option of options) {
        html += `<label class='btn'><input class='${option.cls}' type='checkbox' data-id=${option.id}${option.checked ? ' checked' : ''}>`;
        html += `<a href=${option.url}></a>`;
        html += `<div style="flex-grow: 1; text-align: right;">`;
        if (option.agility) {
           html += `<input data-type='agility' data-id='${option.id}' type="number" value=${option.agility} style="margin-left: 8px; width: 44px">`;
        }
        if (option.instances) {
           html += `<input data-type='instances' data-id='${option.id}' type="number" value=${option.instances} style="margin-left: 8px; width: 28px">`;
        }
        if (option.uptime) {
           html += `<input data-type='uptime' data-id='${option.id}' type="number" value=${option.uptime} style="margin-left: 8px; width: 38px">`;
        }
        html += `</div></label>`;
    }
    return t2e(html);
}

export  {checkbox, radiobox, whUrl, t2e}