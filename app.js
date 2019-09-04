const express = require('express');
const opn = require('opn');
const app = express();
const net = require('net');

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
app.use('/api', proxy(options))
/***************************** 开始启动反向代理 **********************************/

/**************************** 开启服务监听 ******************************/

/*
* 创建服务
* */
getUsablePort().then(function(port){
    app.listen(port, function() {
        let url = `http://${ip}:${port}`;
        opn(url);
        console.log(`项目地址 ${url}, 请在后面接上对应html的路径进行开发`);
    });
})

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

/*
* 获取一个可用的端口
* */
function getUsablePort() {
    return new Promise(function(resolve, reject){
        let port = 3000;
        let a = portIsOccupied(port).then(function (usablePort) {
            resolve(usablePort)
        });
    })
}
// 检测端口是否被占用
function portIsOccupied (port) {
    return new Promise(function (resolve, reject) {
        // 创建服务并监听该端口
        var server = net.createServer().listen(port)

        server.on('listening', function () { // 执行这块代码说明端口未被占用
            server.close() // 关闭服务
            // console.log('The port【' + port + '】 is available.') // 控制台输出信息
            resolve(port)
        })

        server.on('error', function (err) {
            if (err.code === 'EADDRINUSE') { // 端口已经被使用
                // console.log('The port【' + port + '】 is occupied, please change other port.')

                // 端口已经占用时，递归查找可用port
                portIsOccupied(port+1).then(function (usablePort) {
                    resolve(usablePort)
                })
            }
        })
    })
}