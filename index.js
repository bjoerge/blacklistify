var path = require("path");
var minimatch = require("minimatch");
var through = require("through2");

module.exports = blacklist;

function matchesPattern(filename, pattern) {
  if (typeof pattern == 'function') {
    return pattern(filename);
  }
  if (typeof pattern.test == 'function') {
    return pattern.test(filename);
  }
  if (path.join(process.cwd(), pattern) == filename) {
    return true;
  }
  return minimatch(filename, pattern);
}

function blacklist(filename, options) {

  var blacklist = options._ || [];
  
  // Skip everything in node_modules
  if (blacklist.length == 0 || filename.indexOf('node_modules') > -1) {
    return through();
  }

  var matchingPattern;
  var isBlacklisted = blacklist.some(function (pattern) {
    if (matchesPattern(filename, pattern)) {
      matchingPattern = pattern;
      return true;
    }
  });

  if (isBlacklisted) {
    return through(function () {
      this.emit('error', new Error("Caught an attempt to require " + JSON.stringify(filename) +
                                      " which is blacklisted from client side bundling by the pattern " +
                                        '"'+(matchingPattern.name || matchingPattern).toString()+'"' 
      ));
    });
  }

  return through();
}