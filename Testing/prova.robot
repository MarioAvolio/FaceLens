*** Settings ***
Library  Selenium2Library
Library    Telnet



*** Test Cases ***    
Predizione immagine donna
    ${chrome_options} =     Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method      ${chrome_options}   add_argument    --use-fake-ui-for-media-stream
    Call Method         ${chrome_options}   add_argument    --use-fake-device-for-media-stream
    Create Webdriver    Chrome  alias=tab1  chrome_options=${chrome_options}
    
    Open Browser  http://127.0.0.1:5500/UI+CNN/index.html  chrome
    Click Button    name=upload_image
    Choose File    id=upload    /Users/kevinpretell/Downloads/Immagini prova/selfie-evolution-2010-2014-L-3lyOmg.jpeg
    Click Button    id=predict_upload
    Wait Until Page Contains    Woman   
    Sleep    5s


Predizione immagine uomo
    ${chrome_options} =     Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method      ${chrome_options}   add_argument    --use-fake-ui-for-media-stream
    Call Method         ${chrome_options}   add_argument    --use-fake-device-for-media-stream
    Create Webdriver    Chrome  alias=tab1  chrome_options=${chrome_options}
    

    Open Browser  http://127.0.0.1:5500/UI+CNN/index.html  chrome
    Click Button    name=upload_image
    Choose File    id=upload    /Users/kevinpretell/Downloads/Immagini prova/49606417152_5f65e2cb3e_b.jpg
    Click Button    id=predict_upload
    Wait Until Page Contains    Man 
    Sleep    5s

