// 引入mysql 用于操作数据库
const mysql = require('mysql');


function getSql(sql) {


    var p = new Promise((resolve, reject) => {

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
        // let sql = 'SELECT * FROM users';
        connection.query(sql, function (error, result, fields) {
            if (error) {
                reject(error);
            } else {
                // console.log(result);
                resolve(result);
            }
        })

        // 结束查询
        connection.end();


    })

    return p;

}

module.exports = getSql;