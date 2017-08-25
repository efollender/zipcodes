#!/usr/bin/env node

var fs = require('fs'),
    path = require('path'),
    bfj = require('bfj'),
    zips = {},
    str,
    data = fs.readFileSync('./free-zipcode-database.csv', 'utf8').replace(/\r/g, '').split('\n');

data.shift();


var clean = function(str) {
    return str.replace(/"/g, '').trimLeft();
}

var ucfirst = function(str) {
    str = str.toLowerCase();
    var lines = str.split(' ');
    lines.forEach(function(s, i) {
        var firstChar      = s.charAt(0),
            upperFirstChar = firstChar.toUpperCase();

        lines[i] = upperFirstChar + s.substring(1);
        
    });
    return lines.join(' ');
};

data.forEach(function(line, num) {
    line = line.split(',');
    if (line.length > 1) {
        var o = {};

        o.zip = clean(line[1]);
        o.latitude = Number(clean(line[6]));
        o.longitude = Number(clean(line[7]));
        o.city = ucfirst(clean(line[3]));
        o.state = clean(line[4]);
        if (!zips[o.zip]) {
            zips[o.zip] = o;
        }
    }
});



var stateMap = {};

for (var i in zips) {
    var item = zips[i];
    stateMap[item.state] = stateMap[item.state] || [];

    stateMap[item.state].push(item.zip);
}
bfj.stringify(zips)
  .then(json => {
    str = 'exports.codes = ' + json + ';\n';
    
    bfj.stringify(stateMap)
      .then(stateJson => {
        str += 'exports.codes = ' + stateJson + ';\n';
        fs.writeFileSync(path.join('../', 'lib', 'codes.js'), str, 'utf8');
      })
      .catch(error => {
        console.log(error);
      });
})
.catch(error => {
    console.log(error);
});

