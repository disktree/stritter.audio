'use strict';

const
    Fs = require('fs'),
    Path = require('path'),
    Spawn = require('child_process').spawn;

const FFMPEG_PATH = require('ffmpeg-static');
const H264 = 'libx264';
const VP9 = 'libvpx-vp9';

// Config --------------------------------------------
let cfg = {
    verbose: true,
    videoSrcPath: 'media/video',
    videoDstPath: 'assets/video',
    scale: [1920, 1080],
    quality: 25, // ~ better 18-35 smaller
    codec: H264, //VP9;
    override: false,
    fastStart: false,
    exportPosterImages: true,
    noAudio: false
};

//let verbose = true;
//let videoSrcPath = 'media/video';
//let videoDstPath = 'assets/video';
//let scale = [1920, 1080];
//let quality = 25;// ~ better 18-35 smaller
//let codec = H264; //VP9;
//let override = false;
//let fastStart = false;
//let exportPosterImages = true;
//let noAudio = false;
// ---------------------------------------------------

/* let args = process.argv.slice(2);
console.log(args);
if (args.length > 0) {
    //TODO
} */

let files = Fs.readdirSync(videoSrcPath).filter(f => {
    return f.charAt(0) !== '_' && Path.extname(f) === '.mp4';
});

const encodeVideo = (src, cb) => {
    const ext = (cfg.codec === VP9) ? 'webm' : 'mp4';
    const name = Path.basename(src, '.mp4');
    //const dst = videoDstPath + '/' + name + '_' + scale.join('x') + '.' + ext;
    const dst = cfg.videoDstPath + '/' + name + '.' + ext;
    if (cfg.override) {
        try { Fs.unlinkSync(dst); } catch (e) { }
    } else {
        if (fileExists(dst)) {
            console.warn('File already exists: ' + dst);
            cb(10);
            return;
        }
    }
    let args = ['-i', src];
    args.push('-vf');
    args = args.concat(['-vcodec', cfg.codec]);
    args = args.concat(['-crf', cfg.quality]);
    if (cfg.scale) args = args.concat(['scale=' + cfg.scale[0] + 'x' + cfg.scale[1] + ':flags=lanczos']);
    if (cfg.fastStart) args = args.concat(['-movflags', '+faststart']);
    if (cfg.noAudio) args.push('-an');
    args.push(dst);
    ffmpeg(FFMPEG_PATH, args, (code) => {
        if (!cfg.exportPosterImages || code !== 0) {
            cb(code);
        } else {
            exportFrameImage(dst, cfg.videoDstPath + '/' + name + '.jpg', 1, cb);
        }
    });
}

const exportFrameImage = (src, dst, frame = 1, cb) => {
    try { Fs.unlinkSync(dst); } catch (e) { }
    let args = ['-i', src, '-vframes', frame, dst];
    ffmpeg(args, cb);
}

const ffmpeg = (ffmpeg_path, args, cb) => {
    console.log(ffmpeg_path + ' ' + args.join(' '));
    const proc = Spawn(ffmpeg_path, args);
    proc.stdout.on('data', (data) => {
        console.log(`${data}`);
    });
    proc.stderr.on('data', (data) => {
        if (cfg.verbose) console.log(`${data}`);
    });
    proc.on('close', cb);
}

const fileExists = (path) => {
    try {
        Fs.statSync(path);
    } catch (e) {
        return false;
    }
    return true;
}

let numVideos = files.length;
let numEncoded = 0;

const encodeNext = () => {
    const src = cfg.videoSrcPath + '/' + files[numEncoded];
    encodeVideo(src, (code) => {
        if (code == 0) {
            if (++numEncoded < numVideos) {
                encodeNext();
            } else {
                console.info(numEncoded + ' videos encoded');
            }
        } else {
            console.error(`ERROR: ${code}`);
            files.shift();
            if (numEncoded < --numVideos) {
                encodeNext();
            }
        }
    });
}
encodeNext();
