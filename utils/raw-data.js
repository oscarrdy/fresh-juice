// Used to keep the raw data from the request before it is parsed
function getRawData(req, res, next) {
  req.rawBody = '';
  req.on('data', (chunk) => {
    req.rawBody += chunk;
  });
  next();
};



// Exports
module.exports = getRawData;