var fs = require('graceful-fs');
var d3 = require('d3-dsv');
var _ = require('lodash');

var hits;
var courses;

fs.readFile('./hits.csv', 'utf8', (err, data) => {
    if (err) throw err;
    hits = data;
    stepTwo();
})
fs.readFile('./ous.json', 'utf8', (err, data) => {
    if (err) throw err;
    courses = data;
    stepTwo();
})


var stepTwo = _.after(2, logVars);

function logVars() {
    var hitlist = d3.csvParse(hits);
    var json = JSON.parse(courses);

    var ouhits = [];
    var ouhitquiz = [];
    var coursesToFix = [];
    var locations = [];
    //console.log(json)
    //console.log(hitlist);

    for (var i = 0; i < hitlist.length; i++) {
        var obj = hitlist[i];
        ouhits.push(obj.LINK.split("_")[1]);
        ouhitquiz.push(obj.LINK.split("_")[4]);
    }
    console.log(ouhitquiz);
    for (var i = 0; i < ouhitquiz.length; i++) {

        ouhitquiz[i] = ouhitquiz[i].split(".")[0];
    }
    console.log(ouhitquiz);


    for (var i = 0; i < json.length; i++) {
        var obj = json[i];
        for (var j = 0; j < ouhits.length; j++) {
            if (ouhits[j] == obj.ou) {
                coursesToFix.push(obj.name)
                locations.push({"COURSE": obj.name, "OU": obj.ou, "QUIZ_ID": ouhitquiz[j]})
            }
        }
        //console.log(obj.ou);
    }
    console.log(locations);
    fs.writeFile("./toFix.csv", 'COURSE, OU, QUIZ_ID');
    for (var i = 0; i < locations.length; i++) {
    fs.appendFile("./toFix.csv", "\n" + locations[i].COURSE + ',' +locations[i].OU + ',' + locations[i].QUIZ_ID)
    }

}
