// let test = require('./fourth.json')
let opcodes = require('./opcodes.json');
const fs = require('node:fs');

function testConvert() {
    // console.log(test);

    let jsonArray = [];

    Object.keys(test).forEach((jsonKey) => {
        let newJson = {};
        newJson['PC'] = jsonKey;
        Object.keys(test[jsonKey]).forEach((pcKey) => {
            newJson[pcKey] = test[jsonKey][pcKey];
        });
        jsonArray.push(newJson);
    });

    // console.log(JSON.stringify(jsonArray));
    fs.writeFile('./fourth.log', JSON.stringify(jsonArray), (err) => {

    });
}

function opCodeConvert() {
    jsonArray = {};

    Object.keys(opcodes).forEach(opcodeKey => {
        jsonArray[parseInt(opcodes[opcodeKey].value, 16)] = opcodes[opcodeKey];
    });

    fs.writeFile(
        './newOpcodes.json',
        JSON.stringify(jsonArray, undefined, '\t'),
        err => { if (err) console.log(err) });
}

// testConvert();
opCodeConvert();

//Run with node converter.json > log.json
//Replace log.json with the file name, and will produce a valid JSON array