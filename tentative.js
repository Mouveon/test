const Lame = require("node-lame").Lame;


const fs = require('fs')
const { OpusEncoder } = require('@discordjs/opus');
const prism = require('prism-media');


async function main(){


const encoder = new Lame({
    output: "/home/moveon/bot_test/demo.mp3",
    bitrate: 320,
}).setFile("/home/moveon/bot_test/FINALCOUNTDOWN.pcm");

encoder
    .encode()
    .then(() => {
        // Encoding finished
	console.log("fini")
    })
    .catch(error => {
        // Something went wrong
    });




//	const opus =  new prism.opus.Encoder({ channels: 2, rate: 48000, frameSize: 16 });
//	const encoder = new prism.opus.Encoder({channels: 2, rate: 48000, frameSize: 5760});

	//let f1 = fs.readFile('/home/moveon/bot_test/FINALCOUNTDOWN.pcm',function(err,data){
	//	var encoded = encoder.encode(data,1920)
	//	console.log(data)
	//})


//	fs.createReadStream('/home/moveon/bot_test/FINALCOUNTDOWN.pcm').pipe(encoder).pipe(fs.createWriteStream('tentat.opus'));
//	console.log(opus)




//,function(err,data){
//		console.log(data)
//		console.log(encoder)
//		const encoded = encoder.encode(data,48000)
//		fs.writeFile('/home/moveon/bot_test/tentat.mp3',encoded,(err)=>{
//			if (err) throw err;
//			console.log('file saved')
//		})
//	})
};
main();






























/*

var text
var sax
async function main(){

	await readdir('/home/moveon/quizz/tmp2.txt').then(async (texts) => {
		texts += ''
		text = texts.split('\n')
	});

//	console.log(text);
	//text.forEac

for(let i=0;i<text.length;i++){
	if(text[i].startsWith('Q')){
		 console.log("element impair")
		 //console.log("index")
		 //console.log(i)
		 // console.log("element dans le tab")
		 //console.log(text[i])
		 //text[i-1]= text[i-1]+' \ '+text[i]
		 //text.splice(i,1)
		 //console.log(text)
		//i++
		//text[i]=text[i].slice(0,-1)
	}
}

       await text.forEach(async (element,index) => {
//		console.log(element.startsWith('Q'))
//		console.log(element)

		if(element.includes('...')){
			console.log(element.indexOf('...'))
			console.log(element)
			console.log(element.substring(element.indexOf('...')+3))
			var tmp = element.substring(element.indexOf('...')+3)
			var str = element.substring(0,element.indexOf('...') + 3) + "\\" + tmp
			text[index]=str
//			console.log(str)

//			text[index-1]=text[index-1] +' '+text[index]
//			text.splice(index,1)
		}else if(element.includes('?')){
			console.log(element.indexOf('?'))
			console.log(element)
			console.log(element.substring(element.indexOf('?')+1))
			var tmp = element.substring(element.indexOf('?')+1)
			var str = element.substring(0,element.indexOf('?') + 1) + "\\" + tmp
			text[index]=str
//			console.log(str)

//			text[index-1]=text[index-1] +' '+text[index]
//			text.splice(index,1)
		}

		if(element.startsWith('Questions')){
			console.log("delete")
			console.log(text[index])
			console.log(text[index-1])
			text.splice(index-1,2)
			console.log("apres delete")
			console.log(text[index])
			console.log(text[index-1])

		}

//		if(element == '\r'){
  //      		stats_com[parseInt(element.deb, 10)] = element.temp_parl
//		}
        });

console.log(text)

       await text.forEach((element,index) => {
		if(element=='\r' || element.startsWith('SERIE ')){
			console.log("delete")
			console.log(text[index])
			text.splice(index,1)
			console.log("apres delete")
			console.log(text[index])

		}
//		if(element == '\r'){
  //      		stats_com[parseInt(element.deb, 10)] = element.temp_parl
//		}
        });


var i=0
while(i<text.length){
//for(var i=0;i<text.length;i++){
//	console.log(i)
//	console.log(i%2)
	if(!(i % 2)){
		 console.log("element impair")
		 //console.log("index")
		 //console.log(i)
		 // console.log("element dans le tab")
		 //console.log(text[i])
		 //text[i-1]= text[i-1]+' \ '+text[i]
		 //text.splice(i,1)
		 //console.log(text)
		//i++
		text[i]=text[i].slice(0,-1)
	}
//console.log("incrementation")
//console.log(i)
i++
}
text= text.join('\\')
text+=''
console.log(text)
text = text.split('\r')

var i=0
while(i<text.length){
//for(var i=0;i<text.length;i++){
//	console.log(i)
	console.log('\\')

	console.log(text[i])
	if(text[i].charAt(0)!=undefined){
		//console.log(text[i].charAt(0).trim()=="\\")
		//console.log((text[i].charAt[0]).trim()=='\\')
		if(text[i].charAt(0).trim()=='\\'){
			 console.log("slash detecte")
			 //console.log("index")
			 //console.log(i)
			 // console.log("element dans le tab")
			 //console.log(text[i])
			 //text[i-1]= text[i-1]+' \ '+text[i]
			 //text.splice(i,1)
			 //console.log(text)
			//i++
			console.log("avan")
			console.log(text[i])
			text[i]=text[i].substr(1)
	
			console.log("apres")
			console.log(text[i])

		}
	//console.log("incrementation")
	//console.log(i)
	i++
	}
}

       await text.forEach(async (element,index) => {
		if(index % 2){
			console.log("element pair")
			console.log(element)
			text[index-1]=text[index]+' \ '+text[index]
			text.splice(index,1)
		}

	});


	sax = await text.filter(async function(value,index,arr){
		//console.log("value "+value=='\r')
		//console.log("value "+value=='\n')
		//console.log(typeof(value))
		console.log(String.raw(value))
		value+= ''
		return value != '\r';
	});


	await writedir('/home/moveon/quizz/tmp2.txt', text.join(' \n')).then(() => {
		 console.log("save done")
		}).catch(er => {
		console.log(er);
	});
//	await writedir

//	console.log(text)
}
main()
//console.log(text)
*/
