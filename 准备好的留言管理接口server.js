// 使用express准备好的留言接口。
// 一共两个接口：
// 1. 添加留言。 post  /message。参数 name, content
// 2. 查询留言。 get   /message。

const express = require('express');
const bodyParser = require('body-parser');

// 创建服务
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const MESSAGE = [{ dt: Date.now(), name: 'test', content: '123' }];

// 添加 - post
app.post('/message', (req, res) => {
  let { name, content } = req.body;
  MESSAGE.unshift({
    dt: Date.now(),
    name,
    content
  });
  res.json({ code: 200, msg: 'add..ok' });
});
// 查询 - get
app.get('/message', (req, res) => {
  res.json({ code: 200, data: MESSAGE, msg: 'ok' });
});

app.listen(8080, function() {
  console.log('8080');
});
