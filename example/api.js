var browserify = require('browserify');
var blacklistify = require('../custom');

var BLACKLIST = [
  /.+\.secret\.js$/,
  function matchesKey(path) {
    return path.indexOf("secret") > -1
  },
  "./super.secret.js",
  "**/*.secret*"
];

browserify('./entry.js')
  .transform(blacklistify(BLACKLIST))
  .bundle().pipe(process.stdout);