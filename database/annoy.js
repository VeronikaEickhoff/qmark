var pg = require ('pg');
var http = require('http');

var pgConString = "postgres://localhost/qmark"

pg.connect(pgConString, function(err, client) {
  if(err) {
    console.log(err);
  }
  client.on('notification', function(msg) {
    console.log(msg);
    let postData = msg.payload;
    const options = {
        hostname: '192.168.28.197',
        port: msg.channel === "questions_changed" ? 5000 : 5001,
        path: msg.channel === "questions_changed" ? '/update/' : '/book/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

    const req = http.request(options);
    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    req.write(postData);
    req.end();
  });
  var query = client.query("LISTEN questions_changed");
  var query = client.query("LISTEN new_apply");
});
