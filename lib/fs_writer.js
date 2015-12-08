"use strict"

var fs = require('fs');

// ---------------------------------------------------------------------------
function FsWriter(){
  
}

// ---------------------------------------------------------------------------
FsWriter.prototype.write = function(destination, file_path, callback){
  
  var stream = fs.createReadStream(file_path).pipe(fs.createWriteStream(destination));
    
  LOG.info("Stored " + file_path + " on " + file_path);
  
  callback();
}

module.exports = exports = FsWriter;