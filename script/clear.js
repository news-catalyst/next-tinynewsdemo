#! /usr/bin/env node

var fs = require('fs');
var path = require('path');

function clearCache() {
  const cacheDir = path.join(process.cwd(), 'cached');
  console.log("clearing cache from ", cacheDir);
  let regex = /[.]json$/
  fs.readdirSync(cacheDir)
      .filter(f => regex.test(f))
      .map(f => fs.unlinkSync(path.join(cacheDir, f)))
}
clearCache();