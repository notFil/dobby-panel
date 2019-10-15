/**
 * @(#) panel.js
 * @author notFil
 * Program Purpose: panel.js contains the main logic for the devtool panel
 *                  which includes event listeners and communication with background script
 */
var textBox = document.getElementById('inputBox');
var postdataBox = document.getElementById("dob-post-data");
var refdataBox = document.getElementById("dob-ref-data");
var cookiedataBox = document.getElementById("dob-cookie-data");
var selectedText = textBox.value;

document.addEventListener('click', clickActionFunc);
textBox.addEventListener('select', getSelectedText);  

function clickActionFunc(event){
    switch(event.target.id){
        case 'loadURLbtn':
            loadURL();
            break;
        case 'splitURLbtn':
            splitURL();
            break;
        case 'runbtn':
            run();
            break;
        case 'b64encode':
            replaceTextBoxValue(btoa(selectedText));
            break;
        case 'b64decode':
            replaceTextBoxValue(atob(selectedText));
            break;
        case 'urlencode':
            replaceTextBoxValue(encodeURI(selectedText));
            break;
        case 'urldecode':
            replaceTextBoxValue(decodeURI(selectedText));
            break;
        case 'htmlencode':
            break;
        case 'htmldecode':
            break;
        case 'md5hash':
            replaceTextBoxValue(MD5(selectedText));
            break;
        case 'sha1hash':
            replaceTextBoxValue(SHA1(selectedText));
            break;
        case 'sha256hash':
            replaceTextBoxValue(SHA256(selectedText));
            break;
        case 'rot13':
            replaceTextBoxValue(ROT13(selectedText));
            break;
        case 'addpost':
            postdataBox.style.display = event.target.checked ? "block" : "none";
            break;
        case 'changereferrer':
            refdataBox.style.display = event.target.checked ? "block" : "none";
            break;
        case 'addcookie':
            cookiedataBox.style.display = event.target.checked ? "block" : "none";
            break;
        case 'clearall':
            break;
    }
}

/* Declare the loadURL function to send the current browser tab id
to background script to retrieve the tab URL*/
function loadURL(){
    var currentTabId = browser.devtools.inspectedWindow.tabId;

    browser.runtime.sendMessage({
        tabId: currentTabId,
        action: 'load-url'
    });
    
}

/* Declare the splitURL function to split the textbox value */
function splitURL(){
    textBox.value = [
        textBox.value.split('/').slice(0,3).join('/') + '/',
        textBox.value.split('/').slice(3)
        ].join('\t')
}

function getSelectedText(e){
    selectedText = e.target.value.substring(e.target.selectionStart, e.target.selectionEnd);
    //selectedText = document.getSelection().toString();    --> NOT SUPPORTED IN FIREFOX
}

/* Declare the getPostData function to retrieve the postData and checks to see if
 it's JSON format or URL encoded form data*/
function getPostData(){
    return "";
}

/* Declare the getCookie function to retrieve the cookie textbox value and 
key-value pair array*/
function getCookieData(){
    var cookieData = cookiedataBox.value;
    var cookieArray, namevalPair = new Array();

    cookieData.split(";").forEach(c => {
        namevalPair = c.split(":");
        cookieArray.push({name:namevalPair[0], value:namevalPair[1]});
    });
    return cookieArray;
}

/* Declare the getURL function to retrieve the URL textbox value */
function getURL(){
    return "https://www.google.com";
}

/* Declare the replaceTextBoxValue function to replace selected text with 
 a new value*/
function replaceTextBoxValue(newValue){
    if(selectedText != ""){
        textBox.value = textBox.value.replace(selectedText, newValue);
        selectedText = textBox.value;
    } else {
        textBox.value = newValue;
    }
}

/* Declare the run function to load user specified URL with 
 any cookie data, HTTP referrer change and/or POST data*/
function run(){
    var postData = getPostData();
    var cookieData = getCookieData();
    var paramInfo = "";

    if(postData != null){
        paramInfo = "var param = '" + postData + "';  var url = '" + getURL() + "';";
    }
    browser.runtime.sendMessage({
        paramInfo: paramInfo,
        cookieData: cookieData,
        action: 'run'
    });
}

/* Declare the handleMessage function to receive messages from the background script */
function handleMessage(request, sender, sendResponse){
    textBox.value = request.url;
}

browser.runtime.onMessage.addListener(handleMessage); //Handle received messages