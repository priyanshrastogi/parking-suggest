var rc522 = require("rc522-rfid-promise");

console.log("Ready to scan");

rc522.startListening()
  .then(function(tagId){ console.log(tagId); })
  .catch(function(err) { console.log(err); });
