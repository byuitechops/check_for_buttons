var fs = require('graceful-fs');
var _ = require('lodash');
var async = require('async');
var dsv = require('d3-dsv');
var path = "./courses";
var dirs = getdirs(path);

//Reset the hits output file.
fs.writeFile('./hits.csv', '', (err) => {
    if (err) throw err;
    console.log('Hits file emptied.')
})

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
    async.eachOf(dirs, function (value, key, callback) {

        var curpath = path + '/' + value;

        fs.readdir(curpath, function (err, files) {
            if (err) throw err;
            // Keep track of async task and trigger when done
            var filesdone = _.after(files.length, dirdone)

            files.forEach(function (file, index) {
                var filepath = curpath + '/' + file
                if (!(fs.statSync(filepath).isDirectory())) {

                    fs.readFile(filepath, 'utf8', (err, data) => {
                        if (err) throw err;
                        // SEARCH STRING HERE.
                        if (data.indexOf('butt') >= 0) {
                            fs.appendFile('./hits.csv', filepath + ', \r\n', (err) => {
                                if (err) throw err;
                                console.log(filepath + " added to hits.");
                            });
                        }
                        // Tell lodash that this file has been read.
                        filesdone();
                    })
                }
            })
        })
    }, function (err) {
        if (err) throw err;
    })
};

// Write output to file
function loghits() {
    console.log("loghits");
    // Write hits to CSV or other output file
    fs.writefile('./hits.csv', hits, (err) => {
        if (err) throw err;
        console.log('Done.')
    })
}

gethits(dirs);
