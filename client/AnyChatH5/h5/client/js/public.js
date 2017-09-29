(function(){
	var pageNameUrl = location.pathname.split("/").pop();
	var AnyChatH5 = {
		allStepPage:[
			{"step":0,"url":"login.html"},
			{"step":1,"url":"productChoice.html"},
			{"step":2,"url":"index.html"},
			{"step":3,"url":"taskComplete.html"}
		],
		setStep:function(url){
			var _this = this;
			_this.allStepPage.map(function(v,k){
				if(v.url == url){
					sessionStorage.setItem("step",v.step);
				}
			})
		},
		checkStep:function(url){
			var step = sessionStorage.getItem("step");
			var _this = this;
			var loginPageName = "login.html";
			if(!step && url!=loginPageName){
				location.href=loginPageName;
			}else if(step !=0 && url !=loginPageName){
				var targetStep = 0;
				_this.allStepPage.map(function(v,k){
					if(v.url == url){
						targetStep = v.step;
					}
				})
				if(targetStep != step){
					_this.setStep(url);
				}
			}else if(url==loginPageName){
                this.setStep(loginPageName);
            }else if(step ==0 && url!=loginPageName){
            	location.href=loginPageName;
            }
		},
		clearStep:function(){
			sessionStorage.removeItem("step");
		}
	}; 
	AnyChatH5.checkStep(pageNameUrl);//每个页面加载的时候;
	
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
　　　　　　 /// 当点击浏览器的 后退和前进按钮 时才会被触发， 
            window.history.pushState('forward', null, ''); 
            window.history.forward(1);
        });
    }
    window.history.pushState('forward', null, '');  //在IE中必须得有这两行
    window.history.forward(1);
	window.AnyChatH5 = window.AnyChatH5 || AnyChatH5;
})()
