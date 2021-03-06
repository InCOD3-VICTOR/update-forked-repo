// From https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty

const fs = require('fs');
const path = require('path');

function deleteFile(dir, file) {
    return new Promise(function (resolve, reject) {
        var filePath = path.join(dir, file);
        fs.lstat(filePath, function (err, stats) {
            if (err) {
                return reject(err);
            }
            if (stats.isDirectory()) {
                resolve(deleteDirectory(filePath));
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }
        });
    });
}

function deleteDirectory(dir) {
    return new Promise(function (resolve, reject) {
        fs.access(dir, function (err) {
            if (err) {
                return reject(err);
            }
            fs.readdir(dir, function (err, files) {
                if (err) {
                    return reject(err);
                }
                Promise.all(files.map(function (file) {
                    return deleteFile(dir, file);
                })).then(function () {
                    fs.rmdir(dir, function (err) {
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                }).catch(reject);
            });
        });
    });
}

function deleteFolderRecursive(dir) {
    if( fs.existsSync(dir) ) {
        fs.readdirSync(dir).forEach(function(file,index){
            var curPath = path.join(dir, file);
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
               fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

module.exports = {
    asyncDeleteFile: deleteFile,
    asyncDeleteFolder: deleteDirectory,
    deleteFolder: deleteFolderRecursive
}