var child_process = require("child_process");//所需的模块
var exec = child_process.exec;
var http =require("http");
var url = require("url");
var querystring = require("querystring");//原生node获取前端ajax请求
var fs= require ("fs");
var runexec = (cmdstr,callback)=>{//封装一个方法。cmdstr是shell命名，callback是相应的所要执行的代码
	exec(cmdstr,(error, stdout, stderr)=>{
		if(error){
			console.log('error');
		}
		else{
			callback();
		}
	})
}
//定时器定时更新截图
setInterval(()=>{
	//新建一个文件夹来存截图
	runexec(`adb shell mkdir -p /sdcard/jump`,()=>{
        //将截图保存到该文件夹
      runexec(`adb shell screencap -p /sdcard/jump/screen.png`,()=>{
      	//将该截图上传到电脑
      	runexec(`adb pull /sdcard/jump/screen.png .`,()=>{
      		//删除文件夹以及里面的内容
      		runexec(`adb shell rm -r /sdcard/jump/`,()=>{
      			console.log("截图成功");
      		})
      	})
      })
	})
},3000)
http.createServer(function(req,res){
    switch (url.parse(req.url).pathname) {
      // 跳一跳路由
    case "/jump":
      // 解决跨域
      res.setHeader("Access-Control-Allow-Origin", "*")
      var query = url.parse(req.url).query
      var param = querystring.parse(query)
      // 触按屏幕时间
      var t;
      // 系数5
      t = param.length * 5.0;
      // 小于10的距离，原地跳
      if (param.length < 10) {
        t = 0;
      }
      runexec(`adb shell input swipe 100 200 300 400 ${parseInt(t)}`, () => {
        res.end('success')
      })
      break;
    default:
      //进入页面
      fs.readFile("." + url.parse(req.url).pathname, function(err, data) {
        res.end(data)
      })
  }
}).listen(1234);
console.log("开启服务器")