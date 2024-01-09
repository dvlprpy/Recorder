// step one: select start & end button & video tag and create tow global var; 
let start = document.getElementById("start"), // select start button;
	stop = document.getElementById("stop"), // select End button
	video = document.querySelector("video"), // select video tag
	// create global variables 
	recording, 
	recorder;
	
// start event;	
start.addEventListener("click",async function (){
	// create async function for ask the user to select input source
	let stream = await userSource();
	// create function for start recording and stor the all stream in array;
	    recorder = startRecorder(stream);
	
	// optional 	
	start.setAttribute("disabled",true);
	stop.removeAttribute("disabled");
	let createPTage = document.createElement("p");
	createPTage.setAttribute("id","starter-text");
	createPTage.textContent = "Start Recording...";
	document.body.appendChild(createPTage);
	
});


// stop event
stop.addEventListener('click', function(){
    recorder.stop();
    document.getElementById("starter-text").innerHTML = "stop recording."
})


// ask the user to select input source
async function userSource(){
	return navigator.mediaDevices.getDisplayMedia({
        audio: true, 
        video: { mediaSource: "screen"}
    });
}


function startRecorder(s){
	let saveStream = []; // create array for stor stream step by step;
	let startRecording = new MediaRecorder(s);
	startRecording.ondataavailable = function(e){
		if(e.data.size > 0 ){
			saveStream.push(e.data);
		}
	}
	startRecording.onstop = function(){
		saveFile(saveStream);
		saveStream = [];
		document.getElementById("starter-text").innerHTML = "Stop Recording.";
	}
	startRecording.start(200);
	return startRecording;
}



function saveFile(p){
	let blob = new Blob(p, {type:"video/mp4"});
	let url = URL.createObjectURL(blob);
	video.src = url;
	
	// optional
	let promp = window.prompt("Enter Your File Name: "),
	downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.download = `${promp}.mp4`;
	document.body.appendChild(downloadLink);
	downloadLink.click();
	URL.revokeObjectURL(blob);
	document.body.removeChild(downloadLink);
}