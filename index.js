//Requires
var Canvas = require('canvas')
const Lame = require("node-lame").Lame;


var stream = require('stream');
var Writable = stream.Writable ||
    require('readable-stream').Writable;

var AudioMixer = require('audio-mixer');
var CombinedStream = require('combined-stream2');

var ffmpeg = require('fluent-ffmpeg');

const Discord = require('discord.js')
const bot = new Discord.Client()
const fs = require('fs')
const util = require('util')
const {
    Readable
} = require('stream')

const MongoClient = require("mongodb").MongoClient;
const rp = require('request-promise')
const readline = require('readline-sync')
const xmlbuilder = require('xmlbuilder')
const execSync = require('child_process').execSync;
const path_val = require("../token.json")
const https = require('https')
const sortArray = require('sort-array')
const ytdl = require('ytdl-core')
const {
    CanvasRenderService
} = require('chartjs-node-canvas');
const TextToSpeechV1 = require('ibm-watson/text-to-speech/v1');
const {
    IamAuthenticator
} = require('ibm-watson/auth');

var readdir = util.promisify(fs.readFile)
var writedir = util.promisify(fs.writeFile)
var appendir = util.promisify(fs.appendFile)

//Constants and Vars

const dbName = 'botFDP'

var i = 0;

var voiceChannel

const streamOptions = {
    seek: 0,
    volume: 1
}
var num_api_q = 0
var textToSpeech = new TextToSpeechV1({
    authenticator: new IamAuthenticator({
        apikey: path_val.apikey[i]
    }),
    //apikey: 'AIuA_QXQhkrJAZXkmGUHSmAVKRbFpDDUGjrFU5edi1jp' }),
    url: path_val.url[i]
});
//https://api.eu-gb.text-to-speech.watson.cloud.ibm.com/instances/5fbc6023-3bb4-4235-a20c-fcc410fbd3d7'});


var tempo

var compte_quizz = 0;
var url = 'https://www.openquizzdb.org/api.php?key=' + path_val.keyQuizz[num_api_q] + '&amount=30'
var url_api;

const width = 1000;
const height = 400;
const canvasRenderService = new CanvasRenderService(width, height, (ChartJS) => {
    ChartJS.plugins.register({
        beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
        }
    });

});

var flag = 0;
var count = 0;
var lines
var question
var reponse

//Memory tampon
var stats = [];
//File des gens qui parlent et qu'on va insert dans mongo
var test = []

var u
var compte = 0

const data = JSON.stringify({
    todo: "Ceci est un test"
})

var debut;
var debut2;

var queue_user = []
var retient_nom;
var retient_temp;

var params
var audio
var connection
var voiceChannel
var dispatcher

var testing_line

var fail = []
var rand
var pop
var lines_temp

var var_for

var db

var p
var x
var y
var z
var t
var f
var k

var resolve_promess
var timeout_promess
var voiceChannel
////////////////////

const prefix = "!"
var ags
var command

var decompte = []
var decount = {}
var fail_compte = 0
var compte_i
//var compte_trim
var compte_trim2

var temp_quest

var temporisation
var temporisation_temporisation
var temporisation_temporisation1
var temporisation1

/////////

class Silence extends Readable {
    _read() {
        this.push(Buffer.from([0xF8, 0xFF, 0xFE]));
    }
}

var image_cache = []

//////////////FUNCTIONS///////


function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
}

function getall(string, subString) {
    return string.split(subString).length;
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function generateIncrement(maxx, fail) {
    let numx = maxx + 1
    if (fail.includes(numx)) {
        return generateIncrement(numx, fail)
    } else {
        return numx
    }
}



function generateRandom(max, failOn) {
    failOn = Array.isArray(failOn) ? failOn : [failOn]
    var num = Math.floor(Math.random() * max);

    console.log("TEST DU FAILON")

    console.log(typeof(num))
    console.log(typeof(failOn[2]))

    console.log(failOn)
    console.log(num.toString())
    console.log(failOn.includes(num.toString()))

    return failOn.includes(num.toString()) ? generateRandom(max, failOn) : num;
}

function voc(text) {
    params = {
        text: reponse,
        voice: 'fr-FR_ReneeVoice', // Optional voice
        accept: 'audio/wav'

    }
    // Synthesize speech, correct the wav header, then save to disk
    // (wav header requires a file length, but this is unknown until after the header is already generated and sent)
    // note that `repairWavHeaderStream` will read the whole stream into memory in order to process it.
    // the method returns a Promise that resolves with the repaired buffer
    textToSpeech.synthesize(params)
        .then(response => {
            audio = response.result;
            return textToSpeech.repairWavHeaderStream(audio);
        })
        .then(repairedFile => {
            fs.writeFileSync('audio.wav', repairedFile);
            console.log('audio.wav written with a corrected wav header');
            voiceChannel = bot.channels.get('278706666176774144');
            console.log("join le vocal audio");
            if (!voiceChannel)
                return console.error("DOES NOT EXIST FDP");
            voiceChannel.join().then(connection => {
                connection.playOpusStream(new Silence(), {
                    type: 'opus'
                });
                dispatcher = connection.playFile('/home/moveon/bot/audio.wav', {
                    volume: 1
                });
                dispatcher.on("end", end => {
                    console.log('fin');
                });
            });
            //		voiceChannel.leave();
        })
        .catch(err => {
            console.log(err);
        });
}

//Requete au compte quizz

function requete(url) {
    var req = https.get(url, (res) => {
        //console.log(res)
        res.on('data', (d) => {
            compte_quizz = compte_quizz + 1
            console.log("premiere requete recu")
            console.log(url)
            url_api = JSON.parse(d)
            if (url_api['response_code'] == 4) {
                console.log("on envoit une seconde requete")
                if (path_val.keyQuizz[num_api_q + 1] == undefined) {
                    num_api_q = 0
                } else {
                    num_api_q = num_api_q + 1
                }
                //		num_api_q = 4
                url = 'https://www.openquizzdb.org/api.php?key=' + path_val.keyQuizz[num_api_q] + '&amount=30'

                if (compte_quizz <= path_val.keyQuizz.length) {
                    requete(url)
                } else {
                    compte_quizz = 0
                }
            }
        });

    });
}

function getRandomLine(filename) {
    fs.readFile(filename, function(err, data) {
        if (err)
            throw err;
        var lines = data.split('\n');
        /*do something with */
        lines[Math.floor(Math.random() * lines.length)];
    })
}

const insertDocuments = function(db, temp, callback) {
    // Get the documents collection
    const collection = db.collection('radio');
    // Insert some documents
    console.log("insertDocs")
//    console.log(temp)

    console.log("test des values")

    console.log("fin test des values")

    collection.insertMany(temp, function(err, result) {
       // console.log(err)
       // console.log(result)
        callback(result);
    });
}

Object.prototype.getKey = function(value) {
    console.log("on a lelegetKey")
    for (var key in this) {
        if (this[key] == value) {
            return key;
        }
    }
    return null;
};

function sortObject(obj) {

    let tempor
    console.log("test du sort des values")
    //console.log(sortArray(Object.values(obj))
    return sortArray(Object.values(obj), {
        order: 'desc'
    }).reduce((a, v) => {
        console.log(obj.getKey(v))
        tempor = obj.getKey(v)
        a[tempor] = obj[tempor];
        return a;
    }, {});
}

/////////////////////
function sortObject2(obj) {

    console.log("test du sort des values")
    //console.log(sortArray(Object.values(obj))
    return sortArray(Object.keys(obj).map(function(x) {
        return parseInt(x, 10);
    }), {
        order: 'desc'
    }).reduce((a, v) => {
        a[v] = obj[v];
        return a;
    }, {});
}

////////////////////
var memStore = {};

function MyStream(key, num, deb, options) {
    Writable.call(this, options); // init super
    this.key = key; // save key
    this.num = num; // save key
    //     this.deb = deb; // save key
    memStore[key] = {
        'buff': new Buffer(''),
        'deriv': new Buffer('')
    }
}
util.inherits(MyStream, Writable);

MyStream.prototype._write = function(chunk, enc, cb) {
    var buffer = (Buffer.isBuffer(chunk)) ?
        chunk : // already is Buffer use it
        new Buffer(chunk, enc); // string, convert
    // concat to the buffer already there
    memStore[this.key].buff = Buffer.concat([memStore[this.key].buff, buffer]);
    memStore[this.key].deriv = Buffer.alloc(this.num * 4 * 48000);
    // store chunk, then call cb when done
    cb();
};

///////////////////////
var bot_tmp;

//////////////////////

var user_carre

bot.on('ready', async () => {

    //var propertyNames = Object.getOwnPropertyNames(Object.getPrototypeOf(bot));
    //console.log(propertyNames)

    console.log('ready')
    //LibreAntenne
    user_carre = bot.guilds.resolve('261939673662750721')

    //bot.fetchUser('699255573387935846');
    //user_carre.fetchUser('699255573387935846').then(fetched =>{
    //	console.log("PUTEPUEOTJEOAEONDOEAND")
    //	console.log("PUTEPUEOTJEOAEONDOEAND")
    //	console.log("PUTEPUEOTJEOAEONDOEAND")
    //	console.log("PUTEPUEOTJEOAEONDOEAND")
    //	console.log(fetched)

    //});


    //.then(carre =>{
    //		console.log("PUTEPUTEPUTEPUTEPUTE")
    //		console.log(carre)

    //	})

    debut = new Date().getTime();
    debut2 = new Date().getTime();
    bot_tmp = bot
    //	console.log("LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
    //bot.guilds.resolve('261939673662750721').members.fetch({limit : 1}).then(fetched =>{
    //	console.log("PUTEPUTEPUTEPUTEPUTE")
    //	console.log("PUTEPUTEPUTEPUTEPUTE")
    //	console.log("PUTEPUTEPUTEPUTEPUTE")
    //	console.log("PUTEPUTEPUTEPUTEPUTE")
    //	console.log(fetched)
    //})
    /*
    console.log("READY READY READY READY READY READY READY READY READY")
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    bot.guilds.resolve('261939673662750721').fetchUser('699255573387935846');
    console.log("READY READY READY READY READY READY READY READY READY")
     */

    //.then(fetched =>{
    //		console.log("PREMIER TERMINADO")
    //		console.log(fetched)
    //fetched.fetch('699255573387935846').then(fetchedd =>{
    //console.log("TERMINADOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    //console.log(fetchedd)

    //});

    //})
    //console.log('Second Fetch')
    //bot.guilds.resolve('261939673662750721').members.fetch().then(fetchedMembers => {

    //  console.log("FETCH TERMINADO")
    // console.log(fetchedMembers)
    //});

    //	await writedir('/home/moveon/quizz/tmp.txt',JSON.stringify(bot))
    voiceChannel = bot.channels.cache.get('278706666176774144');

    if (!voiceChannel)
        return console.error('VOICE CHAN DOES NOT EXIST FDP')

    console.log("on va join le voc")
    voiceChannel.join().then(connection => {
        console.log("vocal joined")

        connection.play(new Silence(), {
            type: 'opus'
        });

        var speakers = [];

        // Creates a new audio mixer with the specified options
        let mixer = new AudioMixer.Mixer({
            channels: 2,
            bitDepth: 16,
            sampleRate: 48000,
            clearInterval: 250
        });

        let audio_count = 0
        let audio_sample_count = 0
        let file_audio
        let voc = []
        let voc_non_fini = []
//        let voc_non_fini_cp = []

        let clk_fin = new Date().getTime()

  //      file_audio = fs.createWriteStream('audio' + audio_count + '.pcm')
  //      mixer.pipe(file_audio);

        connection.on('speaking', (user, speaking) => {
/*
            if ((new Date().getTime() - debut2) > 30000) {

                debut2 = new Date().getTime()

                console.log("TEST DES MEMSTORE")
                console.log(memStore)

                //console.log(memStore.length)

                console.log(audio_sample_count);
                console.log("TEST DES MEMSTORE");

                //    console.log(mixer.getMaxSamples());

                //console.log(mixer.inputs[0].buffer)

                //		for(let a_count=0;a_count<audio_sample_count-1;a_count++){
                //			console.log(mixer.inputs)
                //		}


                (async () => {
                    let inputs = [];
                    var length_buff = 0;
                    let audio_buff = Object.keys(memStore).length
        	    let voc_non_fini_cp = voc_non_fini
        	    let voc_cp = voc

                    console.log("VOC A TRAITER")
                    console.log(voc_cp)

                    console.log("VOC NON FINI")
                    console.log(voc_non_fini_cp)



                    for (let a_count = 0; a_count < voc_cp.length; a_count++) {

			console.log("FDP JM PERSONNE")
			console.log(memStore['aud_'+voc_cp[a_count]])

			let tempop=memStore['aud_'+voc_cp[a_count]].buff

                                    	await	 fs.open('SAMPLES_BEF_'+voc_cp[a_count]+'.pcm', 'w', async function (err, fd) {
                                                    if (err) {
                                                        throw 'cant open';
                                                    }

                                             await        fs.write(fd, tempop, 0, tempop.length, null, async function (err) {
                                                        if (err)
                                                            throw 'cant write'
                                                  await          fs.close(fd, function () {
                                                               // console.log('fichier ecrit')
                                                            });
                                                    });
                                                });

		}

		    console.log(voc_cp)
//                    await voc_cp.forEach(async element => {
//			console.log(element)
                    for (let a_count = 0; a_count < voc_cp.length; a_count++) {



                        /*
                        let input

                        input = new AudioMixer.Input({
                        channels: 2,
                        bitDepth: 16,
                        sampleRate: 48000,
                        volume: 100
                        });
                         */
                        //console.log("deriv")
                        //console.log(memStore['aud_'+a_count].deriv)

          //              console.log("buff")
            //            console.log(memStore['aud_' + voc_cp[a_count]].buff)
              //          console.log(memStore['aud_' + voc_cp[a_count]].buff.length)
/*
                        if (memStore['aud_' + voc[a_count]].buff.length != 0) {
		//	    console.log("truc 1")

                            let tmpop = await Buffer.concat([memStore['aud_' + voc_cp[a_count]].deriv, memStore['aud_' + voc_cp[a_count]].buff])






                            //				console.log("count")
                            //			console.log(tmpop.readInt16LE(0))
                            //		console.log(tmpop.length)
                            //	console.log(length_buff)
                            //console.log(tmpop.length>length_buff)

                            await inputs.push(tmpop);

			    console.log("taille du mixer")
			    console.log(tmpop.length)
			    console.log(length_buff)
			    console.log(tmpop.length>length_buff)
                            if (tmpop.length > length_buff) {
                                console.log("test validé")
                                length_buff = tmpop.length

                                /*
                                                        await fs.open('SAMPLES_'+a_count+'.pcm', 'w', async function (err, fd) {
                                                            if (err) {
                                                                throw 'cant open';
                                                            }

                                                            await fs.write(fd, tmpop, 0, tmpop.length, null, async function (err) {
                                                                if (err)
                                                                    throw 'cant write'
                                                                    await fs.close(fd, function () {
                                                                        console.log('fichier ecrit')
                                                                    });
                                                            });
                                                        });

                                */
  /*                          }
                        }

                        //	mixer.addInput(input)



                        //                  console.log("INPUT BUFFER")
                        //	console.log(input.buffer)
                    };
                    //			console.log("finit d'ecrire")
                    console.log("On va ecrire now")
                    //                console.log(inputs)

                    //console.log(mixer.getMaxSamples())
                    //console.log(mixer)

                    let samples = Math.floor(length_buff / ((16 / 8) * 2));
		    console.log("creation du mixer avec les params")
                    console.log(samples)
                    console.log(length_buff)

                    //                  console.log(inputs[0])
                    //if (samples > 0 && samples !== Number.MAX_VALUE) {

                    let mixedBuffer = new Buffer(samples * 2 * 2);

                    mixedBuffer.fill(0);

                    inputs.forEach(async (input, index) => {
                        //On reobtient la taille du buffer
                        let bytes = samples * ((16 / 8) * 2);


                        if (input.length < bytes) {
                            bytes = input.length;
                        }

                        let sample = input.slice(0, bytes);
                        //input = input.slice(bytes);

                        //On remet en mode volume
                        for (let i = 0; i < sample.length; i += 2) {
                            if (i < sample.length - 1) {
                                sample.writeInt16LE(Math.floor(100 * sample.readInt16LE(i) / 100), i);
                            }
                        }

                        //On cree le stereo
                        let monoBuffer = sample;
                        let stereoBuffer = new Buffer(monoBuffer.length * 2);
                        let availableSamples = Math.floor(monoBuffer.length / ((16 / 8) * 2));
                        for (let j = 0; j < availableSamples; j++) {

                            let m = monoBuffer.readInt16LE(j * 2);

                            stereoBuffer.writeInt16LE(m, j * 2 * 2);
                            stereoBuffer.writeInt16LE(m, (j * 2 * 2) + 2);
                        }

                        let inputBuffer = stereoBuffer


                        ////////////////////////////////////////////////////
                        
                                    		await fs.open('SAMPLES_'+index+'.pcm', 'w', async function (err, fd) {
                                                    if (err) {
                                                        throw 'cant open';
                                                    }

                                                    await fs.write(fd, input, 0, input.length, null, async function (err) {
                                                        if (err)
                                                            throw 'cant write'
                                                            await fs.close(fd, function () {
                                                                //console.log('fichier ecrit')
                                                            });
                                                    });
                                                });

////////////////////////////////////////////




/////////////////////////////////////////


                        
                        ///////////////////////////////////

                        //				console.log("MIXAGE DE"+index)
                        //let buffer = new Buffer(0)
                        for (let k = 0; k < samples * 2; k++) {
                            if (k * 2 < input.length - 1) {
                                let sample_2 = mixedBuffer.readInt16LE(k * 2) + Math.floor(input.readInt16LE(k * 2) / audio_buff);
                                //if(input.readInt16LE(k*2) != 0){
                                //	console.log(audio_buff)

                                //	console.log(Math.floor(input.readInt16LE(k*2)))
                                //}
                                mixedBuffer.writeInt16LE(sample_2, k * 2);
                            }
                        }
                    });
                    //Les saturations arrivent quand c'est cut au milieu
                    //Les remises a zero now

                    //	mixer.push(mixedBuffer);
                    /* readstereo
                    let monoBuffer = this.read(samples);
                    let stereoBuffer = new Buffer(monoBuffer.length * 2);

                    let availableSamples = this.availableSamples(monoBuffer.length);

                    for (let i = 0; i < availableSamples; i++) {
                    let m = this.readSample.call(monoBuffer, i * this.sampleByteLength);

                    this.writeSample.call(stereoBuffer, m, i * this.sampleByteLength * 2);
                    this.writeSample.call(stereoBuffer, m, (i * this.sampleByteLength * 2) + this.sampleByteLength);
                    }

                    return stereoBuffer;
                    }

                    /* read


                    return sample;


                     */
                    /*
                    let stereoBuffer = new Buffer(monoBuffer.length * 2);

                    let availableSamples = this.availableSamples(monoBuffer.length);

                    /* availableSamples

                    public availableSamples(length?: number) {
                    length = length || this.buffer.length;

                    return Math.floor(length / ((this.args.bitDepth / 8) * this.args.channels));
                    }


                     */
                    /*
                    for (let i = 0; i < availableSamples; i++) {
                    let m = this.readSample.call(monoBuffer, i * 2);

                    this.writeSample.call(stereoBuffer, m, i * 2 * 2);
                    this.writeSample.call(stereoBuffer, m, (i * 2 * 2) + 2);
                    /* writeSample

                    this.buffer.writeInt16LE

                     */
                    /*

                    }

                    return stereoBuffer;
                     */

                    //} else if(mixer.needReadable) {
                    //	clearImmediate(mixer._timer)
                    //	mixer._timer = setImmediate(mixer._read.bind(mixer));
                    //}
                    //		mixer.clearBuffers();

/*
                    console.log("STREAM FINI")

                    for (let b_count = 0; b_count < voc_cp.length; b_count++) {

//	            voc_cp.forEach(async (element,index) =>{
			if(voc_non_fini_cp.includes(voc_cp[b_count])){
			    console.log("detecte un stream non fini on efface pas")
			    console.log(voc_cp[b_count])
                            memStore['aud_' + voc_cp[b_count]].buff = Buffer.from([0x00])
                            memStore['aud_' + voc_cp[b_count]].deriv = Buffer.from([0x00])
			}else{

   //                         console.log("on efface")
                            delete memStore['aud_' + voc_cp[b_count]]
//                        delete voc_non_fini[voc_non_fini.indexOf(stats.find(u => u.user == user.username).audio_cnt)]

                            delete voc[voc.indexOf(voc_cp[b_count])]
  //                          delete voc[b_count]
			}

		    };
                    voc = voc.filter(function(el) {
                        return el != null;
                     });

/*
                    for (let voc_push = 0; voc_push < audio_buff; voc_push++) {
                        //Si stream n'est pas finit
                        if (voc_non_fini_cp.includes(voc_cp[voc_push])) {
                            //console.log(voc_push+"en cours")
                            //voc_a_traiter.push(voc_push)
                            //REARRANGEENT
                            //DELETE
                            //SAUVEGARDER LES INDICES
                        } else {
                            console.log("on efface")
                            delete memStore['aud_' + voc[voc_push]]
                            delete voc[voc_push]

                            voc = voc.filter(function(el) {
                                return el != null;
                            });

                        }
                    }
*//*
                    audio_sample_count = 0
                    length_buff = 0

                    fs.open('FINALCOUNTDOWN.pcm', 'w', function(err, fd) {
                        if (err) {
                            throw 'cant open';
                        }

                        fs.write(fd, mixedBuffer, 0, mixedBuffer.length, null, function(err) {
                            if (err)
                                throw 'cant write'
                            fs.close(fd, function() {
                    //            console.log('fichier ecrit')
                            });
                        });
                    });


                    //mixer.unpipe(file_audio)

                    if (audio_count != 10) {
                        audio_count++
                        file_audio = fs.createWriteStream('audio' + audio_count + '.pcm')
                        mixer.pipe(file_audio);
                    } else {
                        console.log("Effacement des 10")
                        for (let cnt_fi = 0; cnt_fi < 10; cnt_fi++) {
                            fs.unlink('/home/moveon/bot_test/audio' + cnt_fi + '.pcm', (err) => {
                                if (err)
                                    throw err;
                                console.log("deleted")
                            })
                        }

                        audio_count = 0;
                        file_audio = fs.createWriteStream('audio' + audio_count + '.pcm');
                        mixer.pipe(file_audio);
                    }
                    //const stream = connection.receiver.createStream(user,{mode: 'pcm'});
                })();
            }
*/
            //Save dans la BDD toutes les minutes
            if ((new Date().getTime() - debut) > 60000) {

                /*	ffmpeg(stream)
                .inputFormat('s32le')
                .audioFrequency(16000)
                .audioChannels(1)
                .audioCodec('pcm_s16le')
                .format('s16le')
                .pipe(someVirtualMic);B
                 */
                debut = new Date().getTime()
                console.log("reset")
                MongoClient.connect("mongodb://localhost/radio", {
                    useUnifiedTopology: true
                }, function(error, client) {
                    if (error) {
                        return funcCallback(error);
                    }

                    db = client.db(dbName);

                    insertDocuments(db, test, function() {
                        client.close();
                    });
                    //Reinitialise la pile des gens qui parlent et les gens qu'ont parlé
                    speakers = []
                    test = []
                });
            }

            let user_temp = user.username.replace('/', '')

            //if(user.username.includes('/')){
            //}


            //S'assure du bug des user non renvoyé
            if (user != undefined) {
                user.fetch().then(async user => {

  //                  let input
  //                  let clock_deriv = 0
                    // let clock_fin=0

                    if (speaking.equals(1)) {
                        //console.log("creation du stream audio")
                        // Creates a new audio mixer with the specified options
/*
                        input = new AudioMixer.Input({
                            channels: 2,
                            bitDepth: 16,
                            sampleRate: 48000,
                            volume: 100
                        });
                        //////////////////
*/
                        //input.on('data',function(){
                        //	console.log('data stop')
                        //});

                        console.log("parle: " + user.username);

                        let temp_deb = new Date().getTime()

                        //Memoire tampon pour save les temps de blabla
                        if (stats.find(u => u.user == user.username) != null) {

                            //temp_deb=new Date().getTime()

                            stats.find(u => u.user == user.username).voc_deb = new Date().getTime()
                            stats.find(u => u.user == user.username).cnt++
          //                  stats.find(u => u.user == user.username).audio_cnt = audio_sample_count
                            //	if(voc_non_fini.includes(audio_sample_count)){
                            //		audio_
                            //	}

                        } else {
                            stats.push({
                                'user': user.username,
                                'voc_deb': new Date().getTime()
//                                'cnt': 0,
 //                               'clock_fin': 0,
            //                    'audio_cnt': audio_sample_count
                            })
                            //temp_deb=0
                        }
/*
                        let audio = await connection.receiver.createStream(user, {
                            mode: 'pcm'
                        });
*/
                        //mixer.addInput(audio)
                        //console.log(clock_fin)
                        //console.log(temp_deb)
                        //let clk_fin=stats.find(u => u.user == user.username).clock_fin
                        //Temps de silence a mettre entre les deux stream

//                        clock_deriv = (temp_deb - debut2) / 1000
//                        console.log("TEMPS DE SILENCE : "+clock_deriv)

/*
                        let niou = new MyStream('aud_' + audio_sample_count, clock_deriv)
                        niou.on('finish', (audio_sample_count) => {
                            //	console.log('write finit')
                            //	console.log(audio_sample_count)
                        })
                        audio.pipe(niou)

                        console.log(voc_non_fini)

                        console.log("Numero du sample")
                        console.log(audio_sample_count)
                        console.log(voc_non_fini)

                        stats.find(u => u.user == user.username).audio_cnt = audio_sample_count
                        voc.push(audio_sample_count)
                        voc_non_fini.push(audio_sample_count)

                        audio_sample_count = generateIncrement(audio_sample_count, voc)
*/

                        //console.log(niou.length)
                        //console.log(input._write(niou))

                        //let niou = await Buffer.alloc(clock_deriv*48000)
                        //input.buffer = await Buffer.concat([input.buffer,niou])

                        //console.log(input.buffer)

                        //console.log(input.buffer)
                        //for(let i=0;i<48000*clock_deriv;i++){
                        //await input.push(Buffer.from([0xF8,0xFF,0xFE,0x00]))
                        //}
                        //Rajout des silences dans le buffer stereo 16bit 48000 hz

                        //console.log(input)
                        //console.log(new Silence())
                        //console.log("fin des verif")

                        // audio.pipe(input)
                        // mixer.addInput(input)

                       // await audio.pipe(fs.createWriteStream('audio' + user_temp + '_' + stats.find(u => u.user == user.username).cnt + '.pcm', {
                        //    flags: 'w'
                        //}));

                        //Rajout dans la pile des gens qui parlent
                        if (user.username != 'ZBot') {
                            speakers.push(user.username)
                        }

                        //Si l'user est deja dans l'array des gens qui parlent
                        if (test.find(u => u.user == user.username) != null) {
                            //Rajout d'un horodatage
                            //test.find(k=>k.user==user.username).deb = new Date().getTime();
                            //Si quelqu'un parle deja on rajoute une inteerupt
                            if (speakers.length > 1) {
                                test.find(f => f.user == user.username).interruptions = test.find(f => f.user == user.username).interruptions + 1;
                            }

                            //S'il n'est pas dans l'array des gens qui parlent
                        } else {
                            //Si quelqu'un parle deja on rajoute a l'array avec 1 interrupt
                            if (speakers.length > 1) {
                                if (user.username != 'ZBot') {
                                    test.push({
                                        'user': user.username,
                                        'id': user.id,
                                        'interruptions': 1,
                                        'deb': new Date().getTime(),
                                        'temp_parl': 0
                                    });
                                }
                                //On rajoute a l'array avec aucun interrupt
                            } else {
                                if (user.username != 'ZBot') {
                                    test.push({
                                        'user': user.username,
                                        'id': user.id,
                                        'interruptions': 0,
                                        'deb': new Date().getTime(),
                                        'temp_parl': 0
                                    });
                                }
                            }
                        }
                    } else {

                        //stats.find(u => u.user == user.username).clock_fin = new Date().getTime()
            //            console.log("remove d'input")
    //                    mixer.removeInput(input);
                        //			console.log(mixer)

                        console.log("parle plus: " + user.username);
      //                  console.log("numero du sample: "+stats.find(u => u.user == user.username).audio_cnt);
  //                      delete voc_non_fini[voc_non_fini.indexOf(stats.find(u => u.user == user.username).audio_cnt)]
              //          voc_non_fini = voc_non_fini.filter(function (el) {
              //          	return el != null;
              //          });

                        //                                    voc_fini.push(stats.find(u => u.user == user.username).audio_cnt)
                        //			    voc_fini.push(audio_sample_count)
                        //	clock_fin=new Date().getTime()
                        //Si il existe deja dans l'array des gens qui parlent
                        if (test.find(u => u.user == user.username) != null) {

                            //Si il s'agit d'un vrai temps de parole et pas un micro mal réglé
                            if (new Date().getTime() - stats.find(u => u.user == user.username).voc_deb > 1000) {

                                test.find(f => f.user == user.username).temp_parl = test.find(f => f.user == user.username).temp_parl + (new Date().getTime() - stats.find(u => u.user == user.username).voc_deb)
                                console.log(test.find(f => f.user == user.username).temp_parl)
                            }
                            //S'il existe pas dans l'array des gens qui parlent
                        } else {
                            //Calcul du temps de blabla
                            let temp
                            if (new Date().getTime() - stats.find(u => u.user == user.username).voc_deb > 1000) {
                                temp = new Date().getTime() - stats.find(u => u.user == user.username).voc_deb
                            } else {
                                temp = 0
                            }

                            if (user.username != 'ZBot') {
                                test.push({
                                    'user': user.username,
                                    'id': user.id,
                                    'interruptions': 0,
                                    'deb': new Date().getTime(),
                                    'temp_parl': temp
                                });

                                console.log(test.find(f => f.user == user.username).temp_parl)
                            }
                        }

                        if (speakers.includes(user.username)) {
                            if (((new Date().getTime() - (test.find(x => x.user == user.username)).deb) < 1000) && speakers.length > 1) {
                                if ((test.find(z => z.user == user.username)).interruptions >= 1) {
                                    (test.find(t => t.user == user.username)).interruptions = (test.find(t => t.user == user.username)).interruptions - 1;
                                    delete test.find(p => p.user == user.username)
                                }
                            }
                            speakers.splice(speakers.indexOf(user.username), 1)

                        }

                    }
                })
            } else {
                console.log("bizarrerie")

            }
        })
    });

});

bot.on('voiceStateUpdate', async (oldState, newState) => {

    if ((oldState.channelID === null || oldState.channelID === undefined) && newState.channelID !== null) {
        //    console.log("vocal joined")
    } else if (newState.channelID === null || newState.channelID === undefined) {
        //    console.log("vocal left")
    } else {
        //    console.log("vocal mute/unmute")
    }

});

bot.on('message', async message => {
    var valuesUser
    var valuesDeb
    var stats_com = [];
    let user_cache = [];
    var tempo = message.member.user.username;

    //	console.log(message.content)
    //Quizz active

    if (!tempo.startsWith('ToujoursPas')) {
        if (flag == 1) {

            //Recuperation de la reponse
            temporisation1 = message.content.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            //Demande d'indices
            if (message.content.startsWith("!indice")) {
                console.log("commande d'indice")
                //Incrementation du decomptes d'indice
                //Si mot composé
                if (question[1].trim().includes(' ')) {

                    console.log("mot compose")
                    //Ici que ca foire
                    console.log(getall(question[1].trim(), " "))
                    console.log(question[1].trim())
                    console.log(fail_compte)
                    console.log(getall(question[1].trim(), " ") - 1)
                    if (fail_compte < getall(question[1].trim(), " ") - 1) {
                        fail_compte++
                        message.channel.send("Tu admets ton inculture alors : " + question[1].trim().slice(0, getPosition(question[1].trim(), ' ', fail_compte)))
                        return
                    } else {
                        message.channel.send("Plus d'indices")
                        return
                    }
                } else {
                    //Si mot simple
                    console.log(question[1].trim())
                    console.log(fail_compte)
                    if (fail_compte < (question[1].trim().length - 2)) {
                        fail_compte++
                        message.channel.send("Tu admets ton inculture alors : " + question[1].trim().slice(0, fail_compte))
                        return
                    } else {
                        message.channel.send("Plus d'indices")
                        return
                    }
                }
            }

            console.log(question)
            //console.log(similarity(question[1].trim(),message.content.trim()))
            for (let compte_trim = 1; compte_trim < question.length; compte_trim++) {
                //Stock de la reponse
                console.log("on rentre dans la boucle")
                console.log(compte_trim)
                console.log(question.length)
                temporisation = question[compte_trim].trim().toLowerCase().replace(',', '').replace('.', '').normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                console.log(temporisation)
                if (temporisation.startsWith('un ')
                    //		|| temporisation.startsWith('l\' ')
                    ||
                    temporisation.startsWith('l\'') ||
                    temporisation.startsWith('en ') ||
                    temporisation.startsWith('la ') ||
                    temporisation.startsWith('le ') ||
                    temporisation.startsWith('du ') ||
                    temporisation.startsWith('au ')) {
                    console.log("article a 2 lettre reconnu")
                    temporisation_temporisation = temporisation.slice(2).trim()
                } else if (temporisation.startsWith('les ') ||
                    temporisation.startsWith('des ') ||
                    temporisation.startsWith('une ') ||
                    temporisation.startsWith('the ') ||
                    temporisation.startsWith('aux ')) {

                    console.log("article a 3 lettre reconnu")
                    temporisation_temporisation = temporisation.slice(3).trim()

                } else {
                    temporisation_temporisation = temporisation
                }
                console.log("test des rponses")
                console.log(temporisation1)
                console.log(temporisation)
                console.log(temporisation_temporisation)

                if ((similarity(temporisation, temporisation1) > 0.8) || similarity(temporisation_temporisation, temporisation1) > 0.8) {
                    resolve_promess()
                    clearTimeout(timeout_promess)
                    message.channel.send("Bravo petit cuck la réponse était: " + question[compte_trim])
                    decompte.push(message.member.user.username)
                    console.log(decompte)
                    compte_trim = question.length
                    return
                } else if (similarity(temporisation, temporisation1) > 0.5 || similarity(temporisation_temporisation, temporisation1) > 0.5) {
                    fail_compte++
                    compte_trim = question.length

                    if (question[1].trim().includes(' ') && (fail_compte < getall(question[1].trim(), " ") - 1)) {
                        message.channel.send("Tu y es presque : " + question[1].trim().slice(0, getPosition(question[1].trim(), ' ', fail_compte)))
                    } else {
                        if (fail_compte < (question[1].trim().length - 1) && (fail_compte < (question[1].trim().length - 2)) && !question[1].trim().includes(' ')) {
                            message.channel.send("Tu y es presque : " + question[1].trim().slice(0, fail_compte))
                        }
                    }
                }
            }
        }
    }
    args = message.content.slice(prefix.length).trim().split(/ +/g);
    command = args.shift().toLowerCase();

    //		if(message.member.user.id == 699255573387935846){
    //			console.log("carre")
    //			return;
    //		}


    if (!message.content.startsWith(prefix)) {
        return;
    }

    if (message.content.startsWith("!rec")) {
	//let fs
const encoder = new Lame({ 
output: "/home/moveon/bot_test/demo.mp3",
bitrate: 320,
}).setFile("/home/moveon/bot_test/FINALCOUNTDOWN.pcm");

encoder
    .encode()
    .then(() => {
        // Encoding finished
        console.log("fini")

///////////////



message.channel.send({
files: [{
attachment: 'demo.mp3',
name: 'dechet.mp3'
}]
}).then(console.log("envoye l'image graph")).catch(console.error)


////////////



    })
    .catch(error => {
        // Something went wrong
    });
    } else if (message.content.startsWith("!nique")) {
        if (tempo.startsWith("Dysth") || tempo.startsWith("Aℕ")) {
            message.channel.send("Bot interdit aux putes")
            return
        } else if (tempo.startsWith("MỴCỞ")) {
            message.channel.send("Mange ma bite myco")
            return
        }

        if (flag == 0) {
            message.channel.send("=== QUIZZ BY ANANAL, JE PRENDS LES NUDES EN PAIEMENT ===")

            flag = 1;
            fail = []

            //array des points
            decompte = []

            //Lecture des valeurs a esquive
            await readdir('/home/moveon/quizz/old.txt').then(async (data) => {
                data += ''
                lines_temp = data.split('\n')
                for (var pop = 0; pop < lines_temp.length; pop++) {
                    fail.push(lines_temp[pop])
                }
                console.log(fail)
            });

            //Lecture des questions reponses
            await readdir('/home/moveon/quizz/quizz.txt').then(async (text) => {
                text += ''
                lines = text.split('\n')
            })

            count = 0
            var count_p = Promise.resolve(count)
            //Demarrage du quizz
            while (count < 30) {
                (count => {
                    count_p = count_p.then(() => {
                        return new Promise(async function(resolve, reject) {
                            resolve_promess = resolve
                            //console.log(count)
                            //Choix de la quesstion
                            fail_compte = 0

                            console.log("einitialisaition du fail_compte")
                            console.log(fail_compte)

                            rand = generateRandom(lines.length, fail)

                            //Save dans le fichier a esquive
                            fail.push(rand.toString())
                            //Separe de la question
                            question = lines[rand].split('\\');
                            message.channel.send("Question n°: " + (count + 1))
                            await sleep(1000)
                            message.channel.send(question[0])
                            console.log(question[0])
                            timeout_promess = setTimeout(function() {
                                console.log(question[1])
                                message.channel.send("REPONSE: " + question[1])
                                resolve()
                            }, 60000)

                        })
                    })
                })(count)
                count++
            }
            count_p = count_p.then(async data => {

                count = 0

                flag = 0;

                await message.channel.send("Fin du quizz les cucks")

                console.log(decompte)

                decount = {}

                await Promise.all(
                    decompte.map(async (i) => {
                        decount[i] = (decount[i] || 0) + 1;
                        console.log(i)
                        console.log(decount)
                    }));

                await console.log("test du decount")

                console.log(fail)

                await writedir('/home/moveon/quizz/old.txt', fail.join('\n')).then(() => {
                    console.log("save done")
                }).catch(er => {
                    console.log(er);
                });

                (async () => {
                    const configuration = {
                        type: 'pie',
                        data: {
                            labels: Object.keys(decount),
                            datasets: [{
                                //label: 'déchets qui coupent la parole',
                                data: Object.values(decount),
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderWidth: 1
                            }]
                        }
                    };
                    var image = await canvasRenderService.renderToBuffer(configuration);
                    fs.writeFileSync('resultat.jpg', image);
                    message.channel.send({
                        files: [{
                            attachment: 'resultat.jpg',
                            name: 'resultat.jpg'
                        }]
                    })
                })();
            })
        } else if (flag == 1) {
            //Tant que le compteur < 30
            console.log("Bien tente fdp")

        }

    } else if (message.content.startsWith("!graph")) {
        if (tempo.startsWith("Dysth") || tempo.startsWith("Aℕ")) {
            message.channel.send("Bot interdit aux putes")
            return
            //Demande user
        }
        let quer_date

        console.log("commande graph invoque")
        stats_com = []
        valuesUser = []
        valuesDeb = []
        let query_temp
        let week = []
        let jour = []
        let stats_sem = []
        let cur_date

        for (let kek = 0; kek < 7; kek++) {
            stats_sem[kek] = [];
            jour[kek] = {}
        }

        if (args[0] != undefined) {
            console.log("Argument du graph")
            console.log(args[0])
            //Demande par heure
            if (args[0].startsWith('<@')) {
                //7 jours
                quer_date = new Date().getTime() - 604800000;
                //quer_date = 0;
                console.log("demande user")
                //console.log(bot.users.cache)
                console.log(args[0].replace('<', '').replace('!', '').replace('>', '').replace('@', ''))

                let tempo_user = args[0].replace('<', '').replace('!', '').replace('>', '').replace('@', '')

                user_carre.fetchUser(tempo_user).then(fetched => {
                    console.log("User recu");
                    console.log(fetched)
                    ////////////////////////////////////////////////


                    MongoClient.connect("mongodb://localhost/radio", {
                        useUnifiedTopology: true
                    }, function(error, client) {
                        if (error) {
                            return funcCallback(error);
                        }
                        console.log("connecte a la base de donnes des pd");
                        db = client.db(dbName);
                        console.log("recuperation des datas")

                        db.collection("radio").find({
                            "id": {
                                $eq: tempo_user
                            },
                            "deb": {
                                $gt: quer_date
                            }
                        }).toArray(async function(err, docs) {
                            console.log(err)
                            console.log("donnée recup array")
                            console.log(docs)

                            docs.forEach(element => {
                                stats_com[parseInt(element.deb, 10)] = element.temp_parl

                            });

                            console.log("verif tres rapide")
                            console.log(stats_com)
                            console.log(stats_com.indexOf(10110))

                            //Jour de la semaine
                            week[6] = new Date().setHours(0, 0, 0, 0);
                            week[5] = week[6] - 86400000;
                            week[4] = week[5] - 86400000;
                            week[3] = week[4] - 86400000;
                            week[2] = week[3] - 86400000;
                            week[1] = week[2] - 86400000;
                            week[0] = week[1] - 86400000;

                            console.log(stats_com)
                            //console.log(typeof(stats_com))

                            for (let i in stats_com) {

                                if (i > week[6]) {
                                    //Jour d'ajd
                                    stats_sem[0][i] = stats_com[i]
                                    console.log("1ere intervalle valide")

                                } else if (i < week[6] && i > week[5]) {
                                    //hier
                                    stats_sem[1][i] = stats_com[i]
                                    console.log("1ere intervalle valide")

                                } else if (i < week[5] && i > week[4]) {
                                    stats_sem[2][i] = stats_com[i]
                                    console.log("2eme intervalle valide")

                                } else if (i < week[4] && i > week[3]) {
                                    console.log("3eme intervalle valide")
                                    stats_sem[3][i] = stats_com[i]

                                } else if (i < week[3] && i > week[2]) {
                                    stats_sem[4][i] = stats_com[i]
                                    console.log("4eme intervalle valide")

                                } else if (i < week[2] && i > week[1]) {
                                    stats_sem[5][i] = stats_com[i]
                                    console.log("5eme intervalle valide")

                                } else if (i < week[1] && i > week[0]) {
                                    stats_sem[6][i] = stats_com[i]
                                    console.log("6eme intervalle valide")

                                } else if (i < week[1] && i > week[0]) {
                                    stats_sem[7][i] = stats_com[i]
                                    console.log("7eme intervalle valide")

                                }

                            }

                            //Dans l'rodre 0 = ajd, 1 = hier, ...
                            for (let kik = 0; kik < 7; kik++) {

                                /*							//On met dans jour les values de stats sem au cas ou on tombe sur des valeurs pile poil
                                Object.keys(stats_sem[kik]).some(function(v) {
                                if (Object.keys(jour[kik]).indexOf(v) !== -1) {
                                jour[kik][v] = stats_sem[kik][v];
                                }
                                });
                                 */
                                stats_sem[kik] = {
                                    ...stats_sem[kik],
                                    ...jour[kik]
                                }

                                if (stats_sem[kik] != undefined) {
                                    stats_sem[kik] = sortObject2(stats_sem[kik]);
                                }
                            }

                            console.log("premiere boucle valide")

                            console.log("week")
                            //console.log(week)

                            console.log("Les semaines");
                            console.log(stats_sem);
                            //console.log(stats_sem[0])

                            (async () => {
                                image_cache = []

                                let canvas = Canvas.createCanvas(2200, 1500)
                                let cts = canvas.getContext('2d')
                                cts.font = '30px Impact'
                                cts.beginPath()
                                cts.lineWidth = 1
                                cts.globalAlpha = 1;
                                cts.fillStyle = "white";
                                cts.fillRect(0, 0, 2500, 1500);
                                cts.fillStyle = "black";

                                for (let lap = 0; lap < 7; lap++) {
                                    //Temp parl
                                    valuesUser = Object.keys(stats_sem[lap]);
                                    //Temp deb
                                    valuesDeb = Object.values(stats_sem[lap]);

                                    //Formatage des datas
                                    valuesUser.forEach((name, index) => {
                                        //				console.log(week[6-lap]);
                                        valuesUser[index] = (parseInt(name, 10) - week[6 - lap]) / 60000;
                                        valuesDeb[index] = valuesDeb[index] / 60000;
                                    });
                                    //Temp parl
                                    // valuesUser = Object.keys(stats_sem[lap]);
                                    //Temp deb
                                    // valuesDeb = Object.values(stats_sem[lap]);
                                    console.log(valuesUser)
                                    console.log(valuesDeb)

                                    cts.strokeRect(300, 100 + 200 * lap, 1440, 100)
                                    cts.fillText(new Date(week[6 - lap]).toLocaleDateString('fr-FR'), 50, 150 + 200 * lap)
                                    cts.strokeRect(300, 300, 1440, 100)

                                    /*                                    cts.fillText(new Date(week[5]).toLocaleDateString('fr-FR'), 50, 350)
                                    cts.strokeRect(300, 500, 1440, 100)
                                    cts.fillText(new Date(week[4]).toLocaleDateString('fr-FR'), 50, 550)
                                    cts.strokeRect(300, 700, 1440, 100)
                                    cts.fillText(new Date(week[3]).toLocaleDateString('fr-FR'), 50, 750)
                                    cts.strokeRect(300, 900, 1440, 100)
                                    cts.fillText(new Date(week[2]).toLocaleDateString('fr-FR'), 50, 950)
                                    cts.strokeRect(300, 1100, 1440, 100)
                                    cts.fillText(new Date(week[1]).toLocaleDateString('fr-FR'), 50, 1150)
                                    cts.strokeRect(300, 1300, 1440, 100)
                                    cts.fillText(new Date(week[0]).toLocaleDateString('fr-FR'), 50, 1350)

                                     */
                                    for (let j = 0; j < 3; j++) {
                                        cts.fillText(j * 6 + 'h', 300 + (j * 6) * 60, 200 * lap + 250)
                                    }

                                    //Jours
                                    for (let kek = 0; kek < valuesUser.length; kek++) {
                                        //                                       valuesUser.forEach((name, index) => {
                                        cts.fillRect(300 + valuesUser[kek], 200 * lap + 100, valuesDeb[kek], 100);
                                        //                                            valuesDeb[index] = valuesDeb[index] / 60000;
                                        //                                 	});

                                    }
                                    //x=100+minute

                                    //y=200*iteration_jour+100

                                    //largeur=temps_parl
                                    //hauteur=100

                                    //image_cache.push(await canvasRenderService.renderToBuffer(configuration));
                                }
                                cts.stroke()

                                await canvas.createPNGStream().pipe(fs.createWriteStream('/home/moveon/bot_test/text.png'))
                                // console.log(path.join(__dirname, 'text.png'))
                                message.channel.send({
                                    files: [{
                                        attachment: 'text.png',
                                        name: 'dechet.jpg'
                                    }]
                                }).then(console.log("envoye l'image graph")).catch(console.error)

                                console.log("Dans l'async ")

                            })();

                            //////////////////////////////////////////////////////////
                        });
                    });

                });
                console.log(tempo_user)
                return
            } else if (args[0].slice(-1) == 'h') {
                query_temp = args[0].slice(0, -1) * 3600000
                console.log("demande graph horaire " + query_temp)
                //quer_date = new Date().getTime() - args[0].slice(0,-1)*3600000;
                //console.log(quer_date)
                //Demande par minutes
            } else if (args[0].slice(-1) == 'm') {
                console.log("demande graph minute")
                query_temp = args[0].slice(0, -1) * 60000
                //quer_date = new Date().getTime() - args[0].slice(0,-1)*60000;
            } else {
                message.channel.send("Commande invalide nonobstant")
                query_temp = 3600000
                //quer_date = new Date().getTime() - 3600000;
            }

        } else {
            query_temp = 3600000

        }
        //Calcul de la query
        console.log(query_temp)
        quer_date = new Date().getTime() - query_temp;
        console.log("query cree")
        console.log(quer_date)

        console.log(message.content.split(' '))

        MongoClient.connect("mongodb://localhost/radio", {
            useUnifiedTopology: true
        }, async function(error, client) {
            if (error) {
                B
                return funcCallback(error);
            }
            console.log("connecte a la base de donnes des pd");
            db = client.db(dbName);
            console.log("recuperation des datas")
            console.log(quer_date)

            db.collection("radio").find({
                "deb": {
                    $gt: quer_date
                }
            }).toArray(async function(err, docs) {
                console.log("donnée recup")
                console.log(docs)
                /*
                await writedir('/home/moveon/quizz/tmp.txt', JSON.stringify(docs)).then(() => {
                console.log("save done")
                }).catch(er => {
                console.log(er);
                });
                 */
                docs.forEach(async element => {

                    //Vas falloir adapter pour utiliser les ID et pas les user
                    //	    console.log(element.user);
                    if (element.id in stats_com) {
                        //stats_com[element.user]['temp_parl'] = stats_com[element.user]['temp_parl'] + element.temp_parl
                        stats_com[element.id] = stats_com[element.id] + element.temp_parl
                    } else {
                        stats_com[element.id] = element.temp_parl
                        console.log(element.user)
                        user_cache[element.id] = element.user

                        /*   		await appendir('/home/moveon/quizz/tmp.txt', JSON.stringify(stats_com)+'\n').then(() => {
                        console.log("save done")
                        }).catch(er => {
                        console.log(er);
                        });
                         */
                        /*
                        await appendir('/home/moveon/quizz/tmp.txt', element.user+'\n').then(() => {
                        console.log("save done")
                        }).catch(er => {
                        console.log(er);
                        });
                         */
                        //stats_com[element.user]={
                        //	'temp_parl': element.temp_parl
                        //}
                    }
                });

                /*      await appendir('/home/moveon/quizz/tmp.txt', JSON.stringify(stats_com)).then(() => {
                console.log("save done")
                }).catch(er => {
                console.log(er);
                });

                 */
                console.log("test des stats")
                console.log(stats_com)
                stats_com = sortObject(stats_com);
                valuesUser = Object.keys(stats_com);
                valuesDeb = Object.values(stats_com);

                //console.log("fini")
                //console.log(typeof(stats_com))
                //console.log("TEST DU SORT")
                //console.log(Object.values(stats_com))
                //tempo=Object.keys(stats_com).length

                (async () => {

                    console.log("Dans le graph")
                    console.log(stats_com)
                    console.log(valuesUser)
                    console.log(valuesUser.slice(0, 5))

                    console.log(valuesDeb)
                    console.log(valuesDeb.slice(0, 5))

                    console.log("on ne prendra que les premiers elts")
                    valuesUser = valuesUser.slice(0, 5)
                    valuesDeb = valuesDeb.slice(0, 5)

                    console.log(valuesUser)
                    console.log(valuesDeb)

                    quer_date = new Date(quer_date).toLocaleString('fr-FR')
                    //quer_date=quer_date.toISOString().replace(/T/,'').replace(/\..+/,'')

                    for (let i = 0; i < valuesDeb.length; i++) {
                        valuesUser[i] = user_cache[valuesUser[i]]
                        valuesDeb[i] = valuesDeb[i] / 60000
                    }

                    console.log("TEST DES DIVISIONS")
                    console.log(valuesDeb)
                    console.log(valuesUser)

                    //sortArray(stats_com,{order: 'desc'})
                    const configuration = {
                        type: 'horizontalBar',
                        data: {
                            labels: valuesUser,
                            datasets: [{
                                label: 'Ze Déchet',
                                data: valuesDeb,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        callback: function(value, index, values) {
                                            return value + " minutes"
                                        }
                                    },
                                    scaleLabel: {
                                        display: true
                                        //labelString: 'Les déchets'
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        //iciqu'il faudra mettre les %
                                        callback: function(value, index, values) {
                                            return value + " : " + Math.round((valuesDeb[index] / (query_temp / 60000)) * 100).toFixed(0) + "%"
                                        }
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Les déchets'
                                    }

                                }]
                            },
                            title: {
                                display: true,
                                text: 'Temps de blabla inutile depuis: ' + quer_date.toLocaleString('fr-FR')

                            }
                        }
                    };
                    var image = await canvasRenderService.renderToBuffer(configuration);
                    fs.writeFileSync('fdp.jpg', image);
                    console.log("envoit du graph")
                    message.channel.send({
                        files: [{
                            attachment: 'fdp.jpg',
                            name: 'dechet.jpg'
                        }]
                    }).then(console.log("envoye l'image graph")).catch(console.error)
                })();
            })
        });
    } else if (message.content.startsWith("!stat")) {
        if (tempo.startsWith("Dysth") || tempo.startsWith("Aℕ")) {
            message.channel.send("Bot interdit aux putes")
            return
        }
        stats_com = []

        if (args[0] != undefined) {
            if (args[0].slice(-1).toLowerCase() == 'h') {
                //					message.channel.send("Commande invalide")
                quer_date = new Date().getTime() - args[0].slice(0, -1) * 3600000;
            } else if (args[0].slice(-1).toLowerCase() == 'm') {
                quer_date = new Date().getTime() - args[0].slice(0, -1) * 60000;
            } else {
                message.channel.send("Commande invalide nonobstant")
                quer_date = new Date().getTime() - 3600000;
            }
        } else {
            //		message.channel.send("Commande invalide nonobstant")
            quer_date = new Date().getTime() - 3600000;

        }

        console.log(message.content.split(' '))
        valuesUser = []
        valuesDeb = []
        //stats=[]
        //var quer_date = new Date().getTime() - 3600000;

        MongoClient.connect("mongodb://localhost/radio", {
            useUnifiedTopology: true
        }, function(error, client) {
            if (error) {
                return funcCallback(error);
            }
            console.log("connecte a la base de donnes des pd");
            db = client.db(dbName);

            db.collection("radio").find({
                "deb": {
                    $gt: quer_date
                }
            }).toArray(function(err, docs) {
                //, function(err,result){
                //).toArray( function(err,result){
                //var poop = 0
                console.log(docs)
                docs.forEach(element => {
                    //	poop++
                    console.log(element)
                    //console.log(index)
                    //console.log(array)


                    if (element.user in stats_com) {
                        stats_com[element.user]['interruptions'] = stats_com[element.user]['interruptions'] + element.interruptions
                    } else {
                        stats_com[element.user] = {
                            'interruptions': element.interruptions
                        }

                    }

                });
                console.log("fini")
                //console.log(stats)
                console.log(stats_com)
                tempo = Object.keys(stats_com).length
                //console.log("stats finido")
                //console.log(Object.keys(stats)[0])
                //console.log(Object.values(stats)[0].interruptions)

                for (var i = 0; i < tempo; i++) {
                    //	console.log(valuesDeb[i])
                    //	console.log(Object.keys(stats)[i])
                    valuesUser[i] = Object.keys(stats_com)[i]
                    valuesDeb[i] = Object.values(stats_com)[i].interruptions
                }
                //console.log(valuesUser)
                //console.log(valuesDeb)


                //console.log(valuesUser)
                //console.log(valuesDeb)


                (async () => {
                    const configuration = {
                        type: 'bar',
                        data: {
                            labels: valuesUser,
                            datasets: [{
                                label: 'déchets qui coupent la parole',
                                data: valuesDeb,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255,99,132,1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(96, 41, 225, 0.2)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(155, 59, 4, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(155, 159, 64, 0.2)',
                                    'rgba(55, 159, 64, 0.2)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true,
                                        callback: (value) => value
                                    },
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'interruptions'
                                    }
                                }]
                            },
                            title: {
                                display: true,
                                text: 'Le FilsDePutomètre: ' + new Date(quer_date)
                            }
                        }
                    };
                    //					message.channel.send({
                    //						files:[{
                    var image = await canvasRenderService.renderToBuffer(configuration);
                    //console.log(typeof(image))
                    fs.writeFileSync('chart.jpg', image);
                    //					});
                    message.channel.send({
                        files: [{
                            attachment: 'chart.jpg',
                            name: 'dechet.jpg'
                        }]
                    })
                })();

            })
            //console.log(result)
            //result.each(function(err,results){
            //	if(results != null){
            //		console.log("results")
            //console.log(results)
            //		if(results.user in stats){
            //			console.log("il est dans stat")
            //			stats[results.user]['interruptions'] = stats[results.user]['interruptions'] + results.interruptions
            //		}else {
            //			console.log("il est pas dans stat")
            //			stats[results.user] = {
            //				'interruptions': results.interruptions
            //			}
            //		}
            //	}
            //})
            //	console.log(stats)

            //});
        });
        //  				insertDocuments(db, test, function() {
        //					console.log("insetion "+test)
        //  					client.close();
        //					console.log("connection ferme")
        //});
        //		stats =[]
        //		test=[]
        //		speakers=[]
        //});


    } else if ((message.content.startsWith("!text")) && (tempo.startsWith('Nazia') ||
            tempo.startsWith('ADF') ||
            tempo.startsWith('Electribosome') ||
            tempo.startsWith('Arthurest') ||
            tempo.startsWith('Tarkus') ||
            tempo.startsWith('Vultris') ||
            tempo.startsWith('Nihil'))) {
        //message.content
        const args = message.content.slice("!".length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        queue_user.push(tempo)
        retient_nom = tempo;
        retient_temp = new Date().getTime();

        console.log(command);
        console.log(args);
        console.log(args.join(' '));

        params = {
            text: args.join(' '),
            voice: 'fr-FR_ReneeVoice', // Optional voice
            accept: 'audio/wav'
        };

        // Synthesize speech, correct the wav header, then save to disk
        // (wav header requires a file length, but this is unknown until after the header is already generated and sent)
        // note that `repairWavHeaderStream` will read the whole stream into memory in order to process it.
        // the method returns a Promise that resolves with the repaired buffer
        textToSpeech.synthesize(params)
            .then(response => {
                audio = response.result;
                return textToSpeech.repairWavHeaderStream(audio);
            })
            .then(repairedFile => {
                fs.writeFileSync('audio.wav', repairedFile);
                console.log('audio.wav written with a corrected wav header');
                //DEBUT
                voiceChannel = bot.channels.get('278706666176774144');
                //console.log(voiceChannel);
                console.log("join le vocal audio");
                if (!voiceChannel)
                    return console.error("DOES NOT EXIST FDP");
                //console.log(voiceChannel);
                voiceChannel.join().then(connection => {
                    //console.log(connection);
                    console.log(connection)
                    connection.playOpusStream(new Silence(), {
                        type: 'opus'
                    });

                    console.log("lancement du mp3");

                    dispatcher = connection.playFile('/home/moveon/bot/audio.wav', {
                        volume: 1
                    });
                    dispatcher.on("end", end => {
                        console.log('fin');
                    });

                });
                //		voiceChannel.leave();
                //FIN
            })
            .catch(err => {
                console.log(err);
            });

        //var user = execSync('pico2wave  -l  fr-FR  -w  audio2.wav  \"'+ args.join(' ')+' \"');
        //var user = execSync('python3  /home/moveon/bot/txt2wav.py  \"'+ args.join(' ')+' \"');
        //console.log('fin');

        //DEBUT

        const voiceChannel = bot.channels.get('278706666176774144');
        //console.log(voiceChannel);
        console.log("join le vocal audio");
        if (!voiceChannel)
            return console.error("DOES NOT EXIST FDP");
        //console.log(voiceChannel);
        voiceChannel.join().then(connection => {
            //console.log(connection);
            connection.play(new Silence(), {
                type: 'opus'
            });

            console.log("lancement du mp3");

            //const dispatcher = connection.play('/home/moveon/bot/audio3.wav',{ volume : 1});
            dispatcher.on("end", end => {
                console.log('fin');
            });

        });
        //		voiceChannel.leave();
        //FIN

    } else if ((message.content.startsWith("!pokkera")) && (tempo.startsWith('Nazia'))) {

        const voiceChannel = bot.channels.get('278706666176774144');
        //	console.log(voiceChannel);
        console.log("demarre l'audio");
        if (!voiceChannel)
            return console.error("DOES NOT EXIST FDP");
        //console.log(voiceChannel);
        voiceChannel.join()
        //.then(connection => {
        //console.log("mp3 lance");
        //console.log(connection);
        connection.playOutputStream(new Silence(), {
            type: 'opus'
        });

        const dispatcher = connection.playFile('/home/moveon/sons/pokkera.mp3', {
            volume: 1
        });
        dispatcher.on("end", end => {
            voiceChannel.leave();
            console.log('fin');
            //			});

        });
    } else if (tempo == 'Bernard Menez Aka Carmin Dee' && message.attachments.size != 0) {
        console.log(message);
        if (compte < 10) {
            message.channel.send("Tes memes de boomer ne sont pas drole vas t'occuper de ton gosse");
        } else {
            message.channel.send("Ca suffit nanar ca commence a faire beaucoup");
        }
        compte++;
    }

    //	});

    //});

    /*
    //	console.log(message);
    //	console.log(message.member.user.username);
    if(message.content == '!test'){
    message.channel.send('test ok');
    }
    else if(message.content == '!roll'){
    }
    //	console.log(message.attachments.size);
    //console.log(message);


    if(message.content == '!stat'){
    message.channel.send("C'est certainement pokkera qui parle trop");
    }
    else if(message.content == '!roll'){
    }
    //	console.log(message.attachments.size);
    //console.log(message);
    if(message.content =='!pokkera' ){
    const voiceChannel = bot.channels.get('278706666176774144');
    //	console.log(voiceChannel);
    console.log("demarre l'audio");
    if(!voiceChannel) return console.error("DOES NOT EXIST FDP");
    //console.log(voiceChannel);
    voiceChannel.join().then(connection => {
    console.log("mp3 lance");
    console.log(connection);
    connection.play(new Silence(), {type:'opus'});

    const dispatcher = connection.play('/home/moveon/sons/pokkera.mp3',{ volume : 1});
    dispatcher.on("end",end=> {console.log('fin');});

    });
    voiceChannel.leave();
    }


    //DEBUT

    //FIN
    /*
    if(message.content == '!text' ){
    const voiceChannel = bot.channels.get('278706666176774144');
    //	console.log(voiceChannel);
    console.log("demarre l'audio");
    if(!voiceChannel) return console.error("DOES NOT EXIST FDP");
    //console.log(voiceChannel);
    voiceChannel.join().then(connection => {
    console.log("mp3 lance");
    //console.log(connection);
    connection.play(new Silence(), {type:'opus'});

    const dispatcher = connection.play('/home/moveon/sons/sur_de_son_coup.mp3',{ volume : 1});
    dispatcher.on("end",end=> {console.log('fin');});

    });
    }

     */
    /*

    if(message.content == '!azod' ){
    const voiceChannel = bot.channels.get('278706666176774144');
    //	console.log(voiceChannel);
    console.log("demarre l'audio");
    if(!voiceChannel) return console.error("DOES NOT EXIST FDP");
    //console.log(voiceChannel);
    voiceChannel.join().then(connection => {
    console.log("mp3 lance");
    //console.log(connection);
    connection.play(new Silence(), {type:'opus'});

    const dispatcher = connection.play(fs.createReadStream('/home/moveon/sons/sur_de_son_coup.mp3'),{ type: 'ogg/opus', volume : 1});
    dispatcher.on("end",end=> {console.log('fin');});

    });
    //		voiceChannel.leave();
    }

     */

});

//console.log("DEBUT DU CODE")
//Object.getPrototypeOf
bot.login(path_val.selfbottoken[2]);
