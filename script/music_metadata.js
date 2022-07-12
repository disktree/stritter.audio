'use strict';

const Fs = require('fs');
const Path = require('path');
const Metadata = require('music-metadata');
const Process = require('process');
const Util = require('util');

let args = process.argv.slice(2);
if(args.length!== 2) {
    console.error('Invalid arguments');
    Process.exit(1);
}
const src = args[0]; // Directory with mp3 files
const dst = args[1]; // Path to json file to store metadata

const files = Fs.readdirSync(src);
const metadata = [];
files.forEach(f =>{
    const path = `${src}/${f}`; 
    const stat = Fs.statSync(path);
    Metadata.parseFile(path).then(data =>{
        let d = {
            file: f,
            meta: data.format
        };
        let p = dst+'/'+Path.basename(f,'.mp3')+'.json';
        let j = JSON.stringify(d);
        Fs.writeFileSync(p, j);
        //metadata.push(d);
        /*
        if(metadata.length === files.length) {
            Fs.writeFileSync(dst, JSON.stringify(metadata));
            console.log("Saved "+metadata.length+" music metadata entries into "+dst );
        }
        */
    });
});

