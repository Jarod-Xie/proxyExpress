const express = require('express');
const app = express();
const ip = getIPAddress();  // 获取本机 ip

//将public目录下的静态文件对外开放访问
app.use(express.static('public'));

/***************************** 开始启动反向代理 **********************************/
var proxy = require('http-proxy-middleware');//引入nodejs的反向代理模块

// proxy middleware options
var options = {
    target: 'http://native.youquanyun.com', // target host
    changeOrigin: true,               // needed for virtual hosted sites
};
app.use(proxy(options))
/***************************** 开始启动反向代理 **********************************/

/**************************** 开启服务监听 ******************************/
app.listen('3000', function() {
    console.log(`项目地址 http://${ip}:3000`);
});


/*
  获取本机ip
*/
function getIPAddress(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces) {
        var iface = interfaces[devName];
        for(var i = 0; i<iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}