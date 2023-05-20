const http = require('http');
const errorHandle = require('./errorHandle');
const { v4: uuidv4 } = require('uuid');
const todoList = [];

const requestListener = (req, res) => {
  // headers 標頭內容格式
  const headers = {
    'Access-Control-Allow-Headers':
      'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json',
  };
  // 設定變數、將數據流組合成完整數據
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });

  //取得所有代辦事項
  if (req.url === '/todoList' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        success: true,
        data: todoList,
      })
    );
    res.end();
    //新增代辦事項
  } else if (req.url === '/todoList' && req.method === 'POST') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        // 判斷請求資料格式是否正確
        if (title !== undefined) {
          todoList.push({
            title: title,
            id: uuidv4(),
          });
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              success: true,
              data: todoList,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
    // 刪除全部代辦事項
  } else if (req.url === '/todoList' && req.method === 'DELETE') {
    // splice 從索引值 0 到 總長刪除
    todoList.splice(0, todoList.length);
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        success: true,
        data: todoList,
      })
    );
    res.end();
    // 刪除單筆代辦資料
  } else if (req.url.startsWith('/todoList/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todoList.findIndex((item) => item.id === id);
    // 判斷是否有所引值
    if (index !== -1) {
      todoList.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          success: true,
          data: todoList,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith('/todoList/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todoList.findIndex((item) => item.id === id);
        if (index !== -1 && title !== undefined) {
          todoList[index].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              success: true,
              data: todoList,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorHandle(res);
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);
