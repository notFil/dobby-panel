
function loadURL(tabs){
    var currentTabUrl = tabs[0].url;
    
    browser.runtime.sendMessage({
        url: currentTabUrl,
        action: 'load-url'
    });
    console.log("sent");
}

function run(paramInfo, cookieData){
    if(cookieData != ""){
        cookieData.forEach(c => {
            browser.cookies.set(c);
        });
    }

    browser.tabs.executeScript({
        code: paramInfo
    }, 
    function() {
        browser.tabs.executeScript({
            file: "/devtools/panel/submit.js"
        });
    });
}

function onError(error){
    console.log(error);
}

function handleMessage(request, sender, sendResponse){
    var currentTab = browser.tabs.query({currentWindow:true, active:true});
    currentTab.then(function(tabs){
        switch(request.action){
            case 'load-url':
                loadURL(tabs);
                break;
            case 'run':
                run(request.paramInfo, request.cookieData);
                break;
        }
    }, onError);   
}

browser.runtime.onMessage.addListener(handleMessage);
