const fs = require('fs');
const path = require('path');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter_code = new FileSync('db/code.json') 
const db_code = low(adapter_code)
var request = require('request');
const adapter_user = new FileSync('db/user.json') 
const RSA = require('../until/rsa');
// var ws = require("nodejs-websocket");
// 小程序设置
// const appId = '';
// const secret = '';
p = new RSA.BigInt("106697219132480173106064317148705638676529121742557567770857687729397446898790451577487723991083173010242416863238099716044775658681981821407922722052778958942891831033512463262741053961681512908218003840408526915629689432111480588966800949428079015682624591636010678691927285321708935076221951173426894836169")
q = new RSA.BigInt("144819424465842307806353672547344125290716753535239658417883828941232509622838692761917211806963011168822281666033695157426515864265527046213326145174398018859056439431422867957079149967592078894410082695714160599647180947207504108618794637872261572262805565517756922288320779308895819726074229154002310375209")
const keys = RSA.get_key(p, q);

var findUser = function(name, password){
    var users = low(adapter_user).get("users").value();
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};
// 作者登录
exports.authorLogin = (req, res, next) => { 
    try{
    var sess = req.session;
    var data = db_code.get(req.body.name).value();
    console.log(req.body)
    if (data == undefined) {
        res.json({ret_code: 1, ret_msg: '验证码未生成！'});
        return;
    }
    if (data.code != req.body.code) {
        res.json({ret_code: 1, ret_msg: '验证码错误！'});
        return;
    }
    // 验证码有效时间设为100秒
    else if (+new Date() - data.time > 100000) {
        res.json({ret_code: 1, ret_msg: '验证码过期！'});
        return;
    }
    var user = findUser(req.body.name, req.body.password);
    console.log(user)
    if(user){
        req.session.regenerate(function(err) {
            if(err){
                return res.json({ret_code: 2, ret_msg: '登录失败'});                
            }
            
            req.session.loginUser = user.name;
            res.json({ret_code: 0, ret_msg: '登录成功'});                     
        });
    }else{
        console.log("账号或密码错误")
        res.json({ret_code: 1, ret_msg: '账号或密码错误'});
    }
}
catch(e){
    console.log(e);
} 
 };

// 作者登出
exports.authorLogout = (req, res, next) => { 
 };

 // 获取站点配置
 exports.get_config = (req, res, next) => {
    var users = low(adapter_user).get("users").value();
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name)
    if (loginUser == users[0].name) {
        fs.readFile('./config.js', function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.end(data.toString());
         });
    }
 };

 exports.push_config = (req, res, next) => {
    var users = low(adapter_user).get("users").value();
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name)
    if (loginUser == users[0].name) {
        var new_config = req.body.new_config.toString();
        fs.writeFile('./config.js', new_config, function (err) {
            if(err) {
             console.error(err);
             res.end("failed");
             } else {
                console.log('写入站点配置成功');
                res.end("succeed");
             }
         });
    }
 }


function readDirSync(path){
    var re = [];
	var pa = fs.readdirSync(path);
	pa.forEach(function(ele,index){
        var p = path+"/"+ele;
		var info = fs.statSync(p)	
		if(info.isDirectory()){
			re = re.concat(readDirSync(p));
		}else{
            re.push(p)
		}	
    })
    return re;
}

// 获取站点主题路径下的文件列表
exports.get_style_path = (req, res) => {
    var users = low(adapter_user).get("users").value();
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name);
    if (loginUser == users[0].name) {
        var filedir = readDirSync("public/stylesheets");
        filedir = filedir.concat(readDirSync("views"));
        filedir = filedir.concat(["config.js"])
        res.render("style", {
            dir: filedir
        });
    } else {
        res.end("请登陆")
    }
}

 // 获取站点文件
 exports.get_file = (req, res, next) => {
    var users = low(adapter_user).get("users").value();
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name)
    if (loginUser == users[0].name) {
        fs.readFile(req.body.file_name, function (err, data) {
            if (err) {
                return console.error(err);
            }
            res.end(data.toString());
         });
    }
 };

 exports.update_file = (req, res) => {
    var users = low(adapter_user).get("users").value();
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name)
    if (loginUser == users[0].name) {
        if(req.body.file_name != ""){
            fs.writeFile(req.body.file_name, req.body.file_content, function (err) {
                if(err) {
                console.error(err);
                res.end("failed");
                } else {
                    console.log('文件保存成功');
                    res.end("succeed");
                }
            });
        }
    }
 }

 // 新用户注册页面
 exports.toSignUP = (req, res) => {
    res.render("signup", {})
 }
 
 // 用户获取验证码
 exports.getcode = (req, res) => {
    // console.log("接收到客户端信息，解密前信息：", req.body.code)
    var d = RSA.decrypt(req.body.code, keys[1]);
    // console.log("使用私钥解密后：", d.toString())
    var str = RSA.FromAssic(d)
    // console.log("将信息复原为字符串：", str)
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + str + '&grant_type=authorization_code';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            sendCode(body, res);
        }
    })
 }

 // 微信小程序端用户注册
exports.wechat_signup = function(req, res) {
    const adapter_signcode = new FileSync('db/signcode.json') 
    const sign_code = low(adapter_signcode)
    var cur_code = sign_code.get(req.body.signcode).value()
    if (cur_code == undefined || cur_code == false) {
        res.end("2");
        return;
    }
    else {
        sign_code.set(req.body.signcode, false).write()
    }
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + req.body.code + '&grant_type=authorization_code';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var b = JSON.parse(body)
            if (b.openid != undefined ) {
                // 初始化验证码表
                db_code.set(req.body.nick, {
                    openid: b.openid,
                    code: "",
                    time: 0
                }).write()
                // 初始化用户密码表
                var user = low(adapter_user);
                var cur_user = user.get("users").value();
                cur_user.push({
                    name: req.body.nick,
                    password: req.body.pwd
                })
                user.assign({
                    users: cur_user
                }).write()
                // 初始化用户信息
                user.get("userInfo").set(req.body.nick, {
                    "head_img": req.body.head_img,
                    "blog_name": req.body.nick,
                    "header_logo": "/images/headerico.png",
                    "logo": "logo4.png",
                    "email": req.body.mail
                }).write()
                res.send("0")
            }
            else {
                res.send("1")
            }
        }
    })
 }

function sendCode(body, res) {
    var code = Math.random().toString(16).substr(2,4);
    var t = +new Date();
    var b = JSON.parse(body)
    if (b.openid != undefined) {
        var curuser = db_code.find({
            openid: b.openid
        })
        if (curuser.value() == undefined) {
            console.log("未注册用户")
            res.json({
                s: 1
            })
            return;
        }
        else {
            console.log("用户标识：", b.openid, " ==>已注册用户")
            curuser.assign({
                code: code,
                time: t
            }).write()
            console.log("生成临时验证码：",code, "(有效100s)")
            var r = code + '-' + String(t)
            res.json({
                code: code,
                time: t,
                s: 0
            })
        } 
    }
    else {
        res.json({
            s:2
        })
    }
}

// 生成RSA密钥
exports.getRsaKey = function(req, res) {
    // console.log("接收到客户端请求")
    // console.log('生成公钥n:', keys[0][0].toString())
    // console.log('生成公钥e:', keys[0][1].toString()) 
    res.json({
        n: keys[0][0].toString(),
        e: keys[0][1].toString() 
    });
}