#!/usr/bin/env node
var Process = require('process');
// import fs from 'fs';
// import path from 'path';
var path = require('path');
var fs = require('fs');
console.log(Process.argv.slice(2));
function copyFile(src, tar) {
    src = path.join(__dirname, 'template', src);
    var content = fs.readFileSync(src, 'utf-8');
    writeFile(tar, content);
}
function writeFile(path, content) {
    fs.writeFileSync(path, content);
}
function copyDir(src, tar) {
    var paths = fs.readdirSync(src); //读取当前目录，绝对路径
    console.log(paths);
    paths.forEach(function (path) {
        //将读取到路径下的文件拷贝到目标路径下
        var _src = src + '/' + path;
        var _tar = tar + '/' + path;
        //获取文件信息，根据目标是文件夹还是文件进行不同操作
        fs.stat(_src, function (err, stats) {
            if (err)
                throw err;
            if (stats.isFile()) {
                //创建读取流
                var rs = fs.createReadStream(_src);
                //创建写入流
                var ws = fs.createWriteStream(_tar);
                rs.pipe(ws);
            }
            else if (stats.isDirectory()) {
                checkDir(_src, _tar, copyDir);
            }
        });
    });
}
//检测目标文件夹内是否存在对应文件夹
function checkDir(src, tar, fn) {
    fs.access(tar, fs.constants.F_OK, function (err) {
        if (err) {
            fs.mkdirSync(tar);
            fn(src, tar);
        }
        else {
            fn(src, tar);
        }
    });
}
function mkDir(path, fn) {
    fs.mkdir(path, function () {
        fn();
    });
}
var PATH = '.';
var src = 'D:/qianduankaifa/php-storm/selfsturdy/test-cli/template';
var tar = '/public';
// console.log('fs.constant',fs.constants);
mkDir(PATH + tar, function (err) {
    if (err)
        console.log(err);
    copyDir(__dirname + "/template", PATH + tar);
});
