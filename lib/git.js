const spawn = require("./spawn");

module.exports = function(workDir, isDebug){
    function git() {
        var len = arguments.length;
        var args = new Array(len);

        for (var i = 0; i < len; i++) {
            args[i] = arguments[i];
        }
        console.log(workDir, args);
        return spawn('git', args, {
            cwd: workDir, 
            verbose: isDebug
        });
    }

    return function pullFetchRebasePush(forkedRepoUrl, sourceRepoUrl) {
        console.log(forkedRepoUrl, sourceRepoUrl, workDir);
        return git('init')
            .then(() => git('remote', 'add', 'origin', forkedRepoUrl))
            .then(() => git('pull', 'origin', 'master'))
            .then(() => git('remote', 'add', 'upstream', sourceRepoUrl))
            .then(() => git('fetch', 'upstream'))
            .then(() => git('rebase', 'upstream/master'))
            .then(() => git('push', 'origin', 'master'));
    }
}