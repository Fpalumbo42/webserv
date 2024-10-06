document.getElementById("cgi").onclick = function() {myFunction()};

var window = browser.mainFrame().executeJavaScript("window").asJsObject();
window.putProperty("launchCgi", &launchCgi);