#!/usr/bin/env node
const Process = require('process');
// import fs from 'fs';
// import path from 'path';
const path = require('path')
const fs = require('fs');

console.log(Process.argv.slice(2));

function copyFile(src:string,tar:string){
    src = path.join(__dirname,'template',src);
    let content = fs.readFileSync(src,'utf-8');
    writeFile(tar,content);
}

function writeFile(path:string,content:string){
    fs.writeFileSync(path,content);
}

function copyDir(src:string,tar:string){
    let paths:any[] = fs.readdirSync(src); //读取当前目录，绝对路径
    console.log(paths);
    paths.forEach(path => {
        //将读取到路径下的文件拷贝到目标路径下
        let _src = src + '/' + path;
        let _tar = tar + '/' +path;
        //获取文件信息，根据目标是文件夹还是文件进行不同操作
        fs.stat(_src,(err:any,stats:any)=>{
            if(err) throw err;
            if(stats.isFile()){
                //创建读取流
                let  rs=fs.createReadStream(_src);
                //创建写入流
                let  ws=fs.createWriteStream(_tar);
                rs.pipe(ws);
            }else if(stats.isDirectory()){
                checkDir(_src,_tar,copyDir);
            }
        })
    });

}

//检测目标文件夹内是否存在对应文件夹
function checkDir(src:string,tar:string,fn:Function){
    fs.access(tar,fs.constants.F_OK,(err:any)=>{
        if(err){
            fs.mkdirSync(tar);
            fn(src,tar);
        }else{
            fn(src,tar);
        }
    })
}

function mkDir(path:string,fn:Function){
    fs.mkdir(path,()=>{
        fn()
    });
}

const PATH = '.';
let src = 'D:/qianduankaifa/php-storm/selfsturdy/test-cli/template';
let tar = '/public';
// console.log('fs.constant',fs.constants);
mkDir(PATH + tar,function(err:any){
    if(err) console.log(err);
    copyDir(`${__dirname}/template`,PATH + tar);
})


