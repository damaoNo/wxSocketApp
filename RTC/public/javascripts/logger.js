/**
 * Created by ChenChao on 2017/11/2.
 */

module.exports = function (useLog) {
    if(!useLog){
	return function () {
	    //nothing to do
	};
    }else{
	window.onerror = function (e, url, line) {
	    console.log(`${e}\n${url}\n${line}`);
	}
    }
    return function (msg) {
	var logDiv = document.getElementById('rtc-logger') || createLoggerDiv();
	var p = document.createElement('p');
	p.innerHTML = msg;
	logDiv.appendChild(p);
    }
};

function createLoggerDiv() {
    var logDiv = document.createElement('div');
    logDiv.className = 'logger';
    logDiv.setAttribute('id', 'rtc-logger');
    logDiv.innerHTML = '<h5>调试输出：</h5>';
    document.querySelector('body').appendChild(logDiv);
    return logDiv;
}