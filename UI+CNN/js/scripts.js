//LOAD MODELS
async function loadModels() {
    //console.log("Carico modelli...");
    modello = await tf.loadGraphModel("CNN/gender1/model.json");
    modello2 = await tf.loadGraphModel("CNN/gender2/model.json");
    modello3 = await tf.loadGraphModel("CNN/gender3/model.json");

    modello_age = await tf.loadGraphModel("CNN/age1/model.json");
    modello_age2 = await tf.loadGraphModel("CNN/age2/model.json");
    modello_age3 = await tf.loadGraphModel("CNN/age3/model.json");

    modello_mask = await tf.loadGraphModel("CNN/mask1/model.json");


    console.log("Modelli caricati correttamente!");
    return 0;
}



//ATTACH WEBCAM
function useWebcam() {

    // load models before attach the webcam
    loadModels();

    Webcam.set({
        //width: 320,
        //height: 240,
        width: 360,
        height: 270,
        image_format: 'jpeg',
        jpeg_quality: 90
    });
    Webcam.attach('#my_camera');
    document.getElementsByTagName('video')[0].setAttribute("id", "webcam")
    console.log("Webcam collegata correttamente!");
}



//TAKE SNAPSHOT
async function take_snapshot() {
    // take snapshot and get image data
    Webcam.snap(function(data_uri) {
        // display results in page
        document.getElementById('results').innerHTML = '<img id="imageResult2" src="' + data_uri + '"/>';
    });
    console.log("Foto scattata correttamente!");
}



//PREDICTION
var prediction_button = document.getElementById("predict_webcam");
var timepred = 1500;

async function prediction() {

    // check if there is a face
    if (document.getElementById("webcam_card").style.display == 'block') {
        if (face_detected == false) {
            window.alert("No face was found!");
            throw new Error("No face was found!");
        }
    }

    prediction_button.setAttribute('data-loading', '');



    // take a snapshot
    if (document.getElementById("webcam_card").style.display == 'block') {
        await take_snapshot();
    }


    // start the prediction phase
    console.log("Inizio predizione da Webcam...");
    img = document.getElementById('imageResult2');
    if (document.getElementById("upload_card").style.display == 'block') {
        img = document.getElementById('imageResult3');
    }
    const image = tf.browser.fromPixels(img);
    const resized_image = tf.image.resizeBilinear(image, [224, 224]).toFloat();
    const batchedImage = resized_image.expandDims(0)


    var result_gender;
    var result_age;
    var result_mask;



    // CNN selection and prediciton
    if ((document.getElementById("low").checked == true) || (document.getElementById("low2").checked == true)) {
        result_gender = modello3.predict(batchedImage).dataSync();
        result_age = modello_age3.predict(batchedImage).dataSync();
        result_mask = modello_mask.predict(batchedImage).dataSync();
        timepred = 300;
    }
    if ((document.getElementById("med").checked == true) || (document.getElementById("med2").checked == true)) {
        result_gender = modello2.predict(batchedImage).dataSync();
        result_age = modello_age2.predict(batchedImage).dataSync();
        result_mask = modello_mask.predict(batchedImage).dataSync();
        timepred = 600;
    }


    if ((document.getElementById("high").checked == true) || (document.getElementById("high2").checked == true)) {
        result_gender = modello.predict(batchedImage).dataSync();
        result_age = modello_age.predict(batchedImage).dataSync();
        result_mask = modello_mask.predict(batchedImage).dataSync();
    }




    result_age = Object.values(result_age);
    //console.log("risultato predizione mask:", result_mask);

    var response;
    var response_age;
    var response_mask;


    if (result_gender <= .5) {
        response = "Gender: Female";
    } else {
        response = "Gender: Male";
    }

    result_age = result_age.indexOf(Math.max.apply(Math, result_age));
    switch (result_age) {
        case 0:
            response_age = "Age: 0-3";
            break;
        case 1:
            response_age = "Age: 4-7";
            break;
        case 2:
            response_age = "Age: 8-14";
            break;
        case 3:
            response_age = "Age: 15-24";
            break;
        case 4:
            response_age = "Age: 25-34";
            break;
        case 5:
            response_age = "Age: 35-44";
            break;
        case 6:
            response_age = "Age: 45-54";
            break;
        case 7:
            response_age = "Age: 55+";
    }

    if (result_mask <= .5) {
        response_mask = "Mask: False";
    } else {
        response_mask = "Mask: True";
    }


    // show prediction on HTML
    if (document.getElementById("webcam_card").style.display == 'block') {
        document.getElementById("imageResult2").style.display = "none";
    }




    var resetTimeout;
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(function() {

        document.getElementById("result_gender").innerHTML = response;
        document.getElementById("result_age").innerHTML = response_age;
        document.getElementById("result_mask").innerHTML = response_mask;

        document.getElementById("result_gender2").innerHTML = response;
        document.getElementById("result_age2").innerHTML = response_age;
        document.getElementById("result_mask2").innerHTML = response_mask;

        //console.log("Risultato sesso: ", result_gender);
        //console.log("Risultato età: ", result_age);



        prediction_button.removeAttribute('data-loading');
        console.log("Predizione eseguita correttamente!");

    }, timepred);




}



//TURN ON UPLOAD CARD
function upload_image() {
    document.getElementById("result_gender2").innerHTML = "Gender: ";
    document.getElementById("result_age2").innerHTML = "Age: ";
    document.getElementById("result_mask2").innerHTML = "Mask: ";
    document.getElementById("webcam_card").style.display = "none";
    document.getElementById("upload_card").style.display = "block";
}

//TURN ON WEBCAM CARD
function webcam_image() {
    document.getElementById("result_gender").innerHTML = "Gender: ";
    document.getElementById("result_age").innerHTML = "Age: ";
    document.getElementById("result_mask").innerHTML = "Mask: ";
    document.getElementById("upload_card").style.display = "none";
    document.getElementById("webcam_card").style.display = "block";

}



//READ FILE FROM UPLOAD
async function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        // put the image on webcam area 
        reader.onload = function(e) {
            $('#imageResult3')
                .attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }

    console.log("Immagine letta correttamente");

    await new Promise((resolve) => { document.getElementById("imageResult3").onload = resolve; });
    prediction();


}