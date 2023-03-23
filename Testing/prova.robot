*** Settings ***
Library  Selenium2Library
Library    Telnet


*** Test Cases ***   
Prova selenium - predizione donna
    ${chrome_options} =     Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys, selenium.webdriver
    Call Method      ${chrome_options}   add_argument    --use-fake-ui-for-media-stream
    Call Method         ${chrome_options}   add_argument    --use-fake-device-for-media-stream
    Create Webdriver    Chrome  alias=tab1  chrome_options=${chrome_options}
    
    Open Browser  http://127.0.0.1:5500/UI+CNN/index.html  chrome
    Choose File    id=upload    /Users/kevinpretell/Downloads/img_60b96b80770157-57156138-83946253.JPG
    Click Button    id=predict 
    Wait Until Page Contains    Donna   
    Sleep    10s



