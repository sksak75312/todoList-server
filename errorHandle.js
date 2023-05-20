const headers = {
  'Access-Control-Allow-Headers':
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};

const errorHandle = (res) => {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      success: false,
      message: '資料錯誤',
    })
  );
  res.end();
};

module.exports = errorHandle;