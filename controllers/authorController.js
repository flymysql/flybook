var users = require('../server/config/user').items;
const fs = require('fs');
const path = require('path');
var findUser = function(name, password){
    return users.find(function(item){
        return item.name === name && item.password === password;
    });
};
// 作者登录
exports.authorLogin = (req, res, next) => { 
    var sess = req.session;
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
        res.json({ret_code: 1, ret_msg: '账号或密码错误'});
    }     
 };

// 作者登出
exports.authorLogout = (req, res, next) => { 
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug    

    req.session.destroy(function(err) {
        if(err){
            res.json({ret_code: 2, ret_msg: '退出登录失败'});
            return;
        }
        
        // req.session.loginUser = null;
        res.clearCookie(identityKey);
        res.redirect('/');
    });
 };

 // 获取站点配置
 exports.get_config = (req, res, next) => {
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
    var sess = req.session;
    var loginUser = sess.loginUser;
    console.log(users[0].name);
    if (loginUser == users[0].name) {
        var filedir = readDirSync("public/stylesheets");
        filedir = filedir.concat(readDirSync("views"))
        res.render("style", {
            dir: filedir
        });
    } else {
        res.end("请登陆")
    }
}

 // 获取站点文件
 exports.get_file = (req, res, next) => {
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