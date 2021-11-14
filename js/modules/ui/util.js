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
        html += `<label><input type='radio' data-id=${option.id} name=${name} ${option.checked ? ' checked' : ''}>`;
        html += `<a href=${option.url}></a></label>`;
    }
    if (addNone) {
        html += `<label><input type='radio' name=${name} ${selected ? '' : 'checked'}>None</label>`;
    }
    return t2e(html);
}

function checkbox(options) {
    var html = '';
    for (let option of options) {
        html += `<label><input type='checkbox' data-id=${option.id}${option.checked ? ' checked' : ''}>`;
        html += `<a href=${option.url}></a></label>`;
    }
    return t2e(html);
}

export  {checkbox, radiobox, whUrl, t2e}