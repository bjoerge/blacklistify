# blacklistify

blacklistify is a browserify transform that will prevent files matching a given pattern from being accidentally included in a publicly served browserify bundle.

## Usage

```js
// ./secret js
console.log("Psst: the secret number is 42");
```

Now, if you want to make sure that `secret.js` is never being required from anywhere by accident, you can use blacklistify to make sure an error is raised if someone requires it directly, or even if someone add a `require()` for a module that requires a module that requires `secret.js`.

### Module

var blacklistify = require('blacklistify/custom');

The blacklist can contain a combination of:
  - A function that takes a path and returns true or false depending on wheter to blacklist or not
  - A regular expression that blacklists a file if it matches
  - The full path of a file to blacklist
  - A glob string (matching is done with [minimatch](https://www.npmjs.org/package/minimatch))

``` javascript
var browserify = require('browserify');
var blacklistify = require('blacklistify/custom');

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
```

If, by accident, a file matching any of the above patterns is included in the bundle, you will get an error that looks like this:

```
Error: Caught an attempt to require "/path/to/project/super.secret.js" which is blacklisted from client side bundling by the pattern "**/*.secret*" while parsing file: /path/to/project/super.secret.js
    at DestroyableTransform._transform (/path/to/project/index.js:38:26)
    at DestroyableTransform.Transform._read (/path/to/project/node_modules/through2/node_modules/readable-stream/lib/_stream_transform.js:184:10)
    at DestroyableTransform.Transform._write (/path/to/project/node_modules/through2/node_modules/readable-stream/lib/_stream_transform.js:172:12)
    at doWrite (/path/to/project/node_modules/through2/node_modules/readable-stream/lib/_stream_writable.js:237:10)
    at writeOrBuffer (/path/to/project/node_modules/through2/node_modules/readable-stream/lib/_stream_writable.js:227:5)
    at DestroyableTransform.Writable.write (/path/to/project/node_modules/through2/node_modules/readable-stream/lib/_stream_writable.js:194:11)
    at DuplexWrapper._write (/usr/local/lib/node_modules/browserify/node_modules/duplexer2/index.js:57:18)
    at doWrite (/usr/local/lib/node_modules/browserify/node_modules/duplexer2/node_modules/readable-stream/lib/_stream_writable.js:279:12)
    at writeOrBuffer (/usr/local/lib/node_modules/browserify/node_modules/duplexer2/node_modules/readable-stream/lib/_stream_writable.js:266:5)
    at DuplexWrapper.Writable.write (/usr/local/lib/node_modules/browserify/node_modules/duplexer2/node_modules/readable-stream/lib/_stream_writable.js:211:11)
```

### Command line

``` bash
browserify entry.js -t [ blacklistify ./secret.js ] > bundle.js
```

You can specify a list of files to blacklist

``` bash
browserify entry.js -t [ blacklistify ./secret.js ] > bundle.js
```

You can even use glob strings (matching is done with [minimatch](https://www.npmjs.org/package/minimatch)):

``` bash
browserify entry.js -t [ blacklistify '**/*secret*' ] > bundle.js
```
This will blacklist any file with `secret` in it
