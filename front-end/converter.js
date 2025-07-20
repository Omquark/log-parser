let test = require('./fourth.json')
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

testConvert();

//Run with node converter.json > log.json
//Replace log.json with the file name, and will produce a valid JSON array