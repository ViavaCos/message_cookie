// 引入express
const express = require('express');
// 引入body-parser
const bodyParser = require('body-parser');
// 引入cookie-parser 用于解析cookie
const cookieParser = require('cookie-parser');
// 引入mysql 用于操作数据库
const mysql = require('mysql');

// 创建服务
const app = express();

// 定义一个全局变量来接受数据库中查询到的值
let database;

// 定义一个全局变量来保存cookie值
let cookieValue = null;


// 使用express4就引入了的body-parser包解析请求体中的数据
app.use(bodyParser.urlencoded({
    extended: false
}));

// 使用cookie-parser
app.use(cookieParser());

// 创建连接
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'message'
})

// 建立连接
connection.connect();

// 查询数据库
let sql = 'SELECT * FROM users';
connection.query(sql, function (error, result, fields) {
    if (error) {
        throw error;
    } else {
        // console.log(result);
        database = result;
    }
})

// 结束查询
connection.end();


// 方式二: 后端接口 2.CORS解决跨域问题
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// })
app.all('*', function (req, res, next) {
    // console.log(`${Date.now()}:来自${req.connection.remoteAddress} 访问了 ${req.method}-${req.url}。参数是：${req.query},携带cookie:${req.headers.cookie}`);
    res.header('Access-Control-Allow-Origin', req.headers.origin); //需要显示设置来源
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); //带cookies
    next();
});


// 方式二： 后端接口 1.接口设置
// 登录
app.post('/login', (req, res) => {
    // console.log(req.body);

    let { username, password } = req.body;
    cookieValue = username;

    // TODO：此处数据需要替换为数据库中的值
    // if (username == 'admin' && password == 123) {
    //     // 当请求成功时:  原生方法之设置cookie
    //     // res.setHeader('set-cookie', 'username=admin');
    //     // express自带方法设置cookie
    //     // TODO：此处数据也需要替换
    //     res.cookie('username', 'admin');
    //     res.send({
    //         code: 200,
    //         msg: '登录成功'
    //     })
    // } else {
    //     res.send({
    //         code: 500,
    //         msg: '登录失败！'
    //     })
    // }

    let loginResult = database.findIndex((item, index) => {
        return item.username === username && item.password === password;
    })

    if (loginResult !== -1) {
        res.cookie('username', username);
        res.send({
            code: 200,
            msg: '登录成功'
        })
    } else {
        res.send({
            code: 500,
            msg: '登录失败！'
        })

    }
})

// 检查登录状态
app.get('/checkLogin', (req, res, next) => {

    console.log('------------------------------------------cookie----------------------------');
    console.log(req.cookies);
    // console.log('------------------------------------------database----------------------------');
    // console.log(database);
    // res.send('获取cookie成功');

    let { username } = req.cookies;

    console.log(username);

    if (username === cookieValue) {
        res.send({ username, code: 200, msg: '已经登录' });
    } else {
        res.send({ code: 500, msg: '未登录' });
    }
})


// 退出功能      bug: 退出之后点击返回，还是显示登录状态
app.get('/logout', (req, res) => {
    // 删除cookie
    res.clearCookie('username');
    res.send({ code: 200, msg: '退出成功!' });
})


// 方式一： 后端接口
// app.get('/test', (req, res) => {

//     let param = JSON.stringify(MSG);

//     // res.send('fn(' + param + ');'); // 可行   
//     res.send(`fn({code:200,data:${param},msg:'请求成功'});`);
//     // 接收的参数必须是JSON字符串？

// })


// 监听端口
app.listen(8080, () => {
    console.log('8080: success!');
})