'use strict';

const uuidV4 = require('uuid/v4');
const fs = require('fs');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
const polly = new AWS.Polly();
const s3 = new AWS.S3();

const childProcess = require('child_process');

/*
 * Launch embedded ffmpeg process 
 * Uses audio_data as input
 * Sends output file to /tmp/{uuidv4}
 * Returns a array [ child_process, fileName ]
 */
function spawnFFMPEG(audio_data) {
    process.env['LD_LIBRARY_PATH'] = `${process.env['LD_LIBRARY_PATH']}:${process.env['LAMBDA_TASK_ROOT']}/bin`;

    let executable = 'ffmpeg-linux';
    if (process.platform === 'darwin') {
        executable = 'ffmpeg-mac';
    }

    let fileName = uuidV4();
    console.log('Starting ffmpgeg');
    //-i pipe:0 -ac 2 -codec:a libmp3lame -b:a 48k -ar 16000 -af volume=10dB test/output.mp3 -f mp3 pipe:1
    let p = childProcess.spawn(`./${executable}`,
        ['-i', 'pipe:0', '-ac', '2', '-codec:a',
            'libmp3lame', '-b:a', '48k',
            '-ar', '16000', '-af', 'volume=10dB',
            '-f', 'mp3', `/tmp/${fileName}`],
        {cwd: './bin'});
    p.stdin.write(audio_data);
    p.stdin.end();
    return [p, fileName];
}

/*
 * Handle the chile process and returns a Promise
 * that resoved when process finishes executing
 * 
 * The Promise resolves an arry [ exit_code, fileName ]
 */ 
function handleProcess(options) {

    const p = options[0];
    const fileName = options[1];

    let result = new Promise((resolve, reject) => {
        p.stdout.on('data', (data) => {
            //console.log(`stdout: ${data}`);
            //console.log('stdout');
        });

        p.stderr.on('data', (data) => {
            //console.log(`stderr: ${data}`);
        });

        p.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                resolve([code, fileName]);
            } else {
                reject(code);
            }
        });
    });
    return result;
}

/*
 * Reads a file from /tmp/${fileName} and 
 * writes it to alexademo.ninja/polly (us-east-1)
 */ 
function writeToS3(fileName) {

    let result = new Promise((resolve, reject) => {

        fs.readFile(`/tmp/${fileName}`, (err, data) => {
            var putParams = {
                Bucket: process.env.S3_BUCKET,
                Key: `polly/${fileName}`,
                Body: data
            };
            console.log('Uploading to S3');
            s3.putObject(putParams, function (putErr, putData) {
                if (putErr) {
                    console.error(putErr);
                    reject(putErr);
                } else {
                    console.log(putData);
                    resolve(putData);
                }
            });

        });
    });

    return result;
}

/*
 * Generate a audio stream from Polly
 * 
 * voice : the polly voice (http://docs.aws.amazon.com/polly/latest/dg/API_SynthesizeSpeech.html)
 * text  : the text to read
 * 
 * return an MP3 binary stream (ReadableStream)
 */
function getPollyStream(voice, text) {

    let result = new Promise((resolve, reject) => {
        const params = {
            OutputFormat: "mp3",
            SampleRate: "22050",
            Text: text,
            TextType: 'text',
            VoiceId: voice
        };
        console.log("Calling Polly");
        polly.synthesizeSpeech(params, function (err, data) {
            if (err) {
                console.error(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                console.log(data);           // successful response
                /*
                data = {
                AudioStream: <Binary String>, 
                ContentType: "audio/mpeg", 
                RequestCharacters: 37
                }
                */
                resolve(data);
            }
        });
    });
    return result;
}

exports.handler = (event, context, callback) => {

    // console.log(JSON.stringify(process.env, null, 2));
    // console.log(JSON.stringify(event, null, 2));

    //get the polly stream
    getPollyStream(event.pathParameters.voice_id, event.body)

    //pipe it to ffmpeg 
    .then((data) => {
        
        return handleProcess(spawnFFMPEG(data.AudioStream))})

        //and send the ourput to s3         
        .then((data) => {

            // did ffmpeg exit succesfuly ?
            if (0 === data[0]) {

                const fileName = data[1];
                //wriet to S3
                writeToS3(fileName).then((data) => {

                    // prepare HTTP response 
                    let response = {
                        statusCode: 200,
                        headers: { "Content-Type" : "application/xml" },
                        body: `<audio src="https://${process.env.S3_BUCKET}/polly/${fileName}"/>`
                    };
                    callback(null, response);
                });
            }
        })

        .catch((error) => {
            console.error(error);
            let response = {
                statusCode: 500,
                body: error
            };
            callback(null, response);
        });



}
