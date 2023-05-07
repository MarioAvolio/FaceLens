let webcamElement;
let displaySize = { width: 360, height: 270 };
let modelPath = 'models';
let currentStream;
let faceDetection;


async function checkDetection() {
    if (document.getElementById("detection-switch").checked == true) {
        webcamElement = document.getElementById('webcam');
        Promise.all([
            faceapi.nets.tinyFaceDetector.load(modelPath),
            faceapi.nets.faceLandmark68TinyNet.load(modelPath),
        ]).then(function() {
            createCanvas();
            startDetection();
        })
    } else {
        clearInterval(faceDetection);
        if (typeof canvas !== "undefined") {
            setTimeout(function() {
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            }, 1000);
        }
    }
}

function createCanvas() {
    if (document.getElementsByTagName("canvas").length == 0) {
        console.log("inizio a creare canvas");
        canvas = faceapi.createCanvasFromMedia(webcamElement)
        document.getElementById('webcam-container').append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
    }
}


function startDetection() {
    faceDetection = setInterval(async() => {
        const detections = await faceapi.detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    }, 200)
}