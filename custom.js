var blacklistify = require("../blacklistify");
module.exports = function mktransform(blacklist) {
  return function (file) {
    return blacklistify(file, {_: blacklist});
  }
};