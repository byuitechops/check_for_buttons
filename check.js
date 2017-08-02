var fs = require('fs');
var _ = require('lodash');
var dsv = require('d3-dsv');
var path = "./courses";
var dirs = getdirs(path);
var curpath;
var hits = [];
console.log(dirs);


// Grab the directories in ./courses
function getdirs(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

// Check files in all directories for the search string.
function gethits(dirs) {
    // Keep track of async task and write file when loop is done
    var dirdone = _.after(dirs.length, loghits)
    dirs.forEach(function (dir) {
        curpath = path + '/' + dir;
        fs.readdir(curpath, function (err, files) {
            if (err) throw err;
            // Keep track of async task and trigger when done
            var filesdone = _.after(files.length, dirdone)
            files.forEach(function (file, index) {
                fs.readFile(curpath + '/' + file, 'utf8', (err, data) => {
                    if (err) throw err;
                    // SEARCH STRING HERE.
                    if (data.indexOf('&ltscript') >= 0) {
                        //console.log('[' + curpath + '/' + file + '] ' + ' [' + data.indexOf('%ltscript') + ']');
                        hits.push(curpath + '/' + file);
                    }
                    // Tell lodash that this file has been read.
                    filesdone();
                })
            })
        })
    })
};

// Write output to file
function loghits() {
    // Write hits to CSV or other output file
    console.log(hits);
}

gethits(dirs);
