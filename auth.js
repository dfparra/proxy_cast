var secret = process.env.SECRET || require('./config').secret;
function authorize(req, res, next){
  // console.log(req.headers);
  if(req.headers.passphrase !== secret){
    res.status(403).json({
      msg: 'ye shall not pass'
    });
  } else {
    next();
  }
}


module.exports = authorize;
