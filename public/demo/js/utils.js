window.onload=function(){
	var htmlTag = document.getElementsByTagName('html')[0];
	var width =Math.max(document.body.clientWidth,document.documentElement.clientWidth);
	if(width<320){
		width = 320
	}
	htmlTag.style.fontSize = (width / 7.5) + 'px';
}
utils = {
  storage: {
    set: function (key, data) {
      // 没有全局api对象时
      try {
        return window.localStorage.setItem(key, window.JSON.stringify(data))
      } catch (err) {
        return window.localStorage.setItem(key, data)
      }
    },
    get: function (key) {
      // 没有全局api对象时
      try {
        return window.JSON.parse(window.localStorage.getItem(key))
      } catch (err) {
        return window.localStorage.getItem(key)
      }
    },
    remove: function (key) {
      return window.localStorage.removeItem(key)
    }
  },
  auth: {
    toLogin: function(){
      //api.execScript({
          //name: 'main',
          //script: 'localStorage.removeItem("token");localStorage.removeItem("userInfo");vueObj.jumpTo("/wechatLogin");'
      //});
      //setTimeout(function(){
        //api.closeWin();
      //}, 500)
      // dsBridge.call("toLogin")
    }
  },
  copyText: function(text, callback){
    var input = document.createElement('input')
    input.style.position = 'absolute';
    input.value = text
    document.body.appendChild(input)
    input.select()
    input.setSelectionRange(0, input.value.length)
    document.execCommand('Copy')
    document.body.removeChild(input)
    return callback && callback();
  }
}
