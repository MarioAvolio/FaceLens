let webcamElement;
let displaySize = { width: 360, height: 270 };
let modelPath = 'models';
let currentStream;
let faceDetection;
let face_detected = false;


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
    console.log("Face detection started successfully!");
}


function createCanvas() {
    if (document.getElementsByTagName("canvas").length == 0) {
        canvas = faceapi.createCanvasFromMedia(webcamElement)
        document.getElementById('webcam-container').append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
        console.log("Canvas created successfully!");
    }
}



function startDetection() {
    faceDetection = setInterval(async() => {
        const detections = await faceapi.detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks(true)
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        face_detected = true;

        if (detections.length == 0) {
            face_detected = false;
        }

    }, 200)
    console.log("Face detection working correctly!");
}