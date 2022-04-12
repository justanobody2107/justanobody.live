let valuesObj = {
    '[g]' : { 'sliceAmount' : 3, 'id' : 'a'},
    '[r]' : { 'sliceAmount' : 3, 'id' : 'b'},
    '[b]' : { 'sliceAmount' : 3, 'id' : 'c'},
    '[link]' : { 'sliceAmount' : 6, 'id' : ''},
    '[br]' : { 'sliceAmount' : 4, 'id' : ''},
}

let values = new Map(Object.entries(valuesObj));

function addChar(char, element){
    element.innerHTML += char;
}

function removeChar(element){
    element.innerHTML = element.innerHTML.slice(0, element.innerHTML.length-1);
}

function parseText(textarr) {
    for (let line of textarr) {
        let value = /\[.{1,99}\]/.exec(line);
        if (value == null || value.index != 0) {
            let element = document.getElementById('console');
            line = line.slice(0, line.length-1);
            for (let char of line) {
                addChar(char, element);
                continue;
            }
            continue;
        }
        else if (values.has(value[0])) {
            let obj = values.get(value[0]);
            let id = obj.id;
            let style = value[0].slice(1, -1);
            let type = 'span';
            let link = null;
            line = line.slice(obj.sliceAmount);
            if(style == "link") {
                link = /\(.{1,99}\)/.exec(line);
                line = line.slice(link[0].length);
                type = 'a';
            }else if(style == 'br') {
                type = 'br';
            }
            let element = document.createElement(type);
            document.getElementById('console').appendChild(element);
            element.setAttribute('id', id);
            if(link){
                element.setAttribute('href', link[0].slice(1, link[0].length-1));
            }
            line = line.slice(0, line.length-1);
            for (let char of line){
                addChar(char, element);
                continue;
            }
            continue;
        }
    };
}

function getFile(file){
    $.get(file, function(data) {
        let textarr;
        textarr = data.split('\n');
        parseText(textarr);
    });
}

getFile('assets/txt/console.txt');

let addedCount = 0;

function addText(key) {
    let element = document.getElementById('console');
    let keyCodes = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 32];
    let specialCodes = [13, 8];
    let text;
    if(keyCodes.includes(key.keyCode)){
        text = key.key;
        addChar(text, element);
        addedCount++;
    }else if(specialCodes.includes(key.keyCode)){
        if(key.keyCode == 8){
            if(addedCount > 0){
                removeChar(element);
                addedCount--;
            }
        }
    }
}

document.onkeydown=addText;