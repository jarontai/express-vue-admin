'use strict';

// 基础中间件

// 返回数据或异常
// 成功:
// {
//   code: 0,
//   message: 'success',
//   data: {}/[{}]
// }
// 错误:
// {
//   code: 1,
//   message: 'reason'
// }
function reply(req, res, next) {
  res.reply = (data) => {
    let result = {
      code: 0,
      message: 'success',
      data: data
    };
    res.json(result);
  };

  res.replyError = (msg) => {
    if (msg && msg.message) {
      msg = msg.message;
    }
    let result = {
      code: 1,
      message: msg
    };
    res.json(result);
  };

  next();
}

// 通用错误处理
function error(err, req, res, next) {
  console.error(err);
  if (process.env.NODE_ENV === 'development') {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  } else {
    res.status(err.status || 500).json({error: 'Inernal error!'});
  }
}

module.exports = {
  reply: reply,
  error: error
};
