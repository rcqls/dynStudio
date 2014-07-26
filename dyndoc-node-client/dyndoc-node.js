var end_token="__[[END_TOKEN]]__"

var decode_cmd=function(cmd) { 
  var regexp=/^__send_cmd__\[\[([a-zA-Z0-9_]*)\]\]__([\s\S]*)/m;
  var res=cmd.match(regexp);
  return {"cmd": res[1], "content": res[2]};
}

var net = require('net');
var client = net.connect({port: 7777, host: 'localhost'},function(){
  client.write('__send_cmd__[[dyndoc]]__[#r>>]rnorm(10)'+end_token+'\n');

client.on('data', function(data) {
    //console.log(data.toString());
    data.toString().split(end_token).slice(0,-1).map(function(cmd) {
      //console.log("<<"+cmd+">>");
      var res=decode_cmd(cmd);
      //console.log('res:', res);
      if(res["cmd"] != "windows_platform") {
        console.log('data:\n', res["content"]);
        client.end();
      }
    })
});

client.on('error', function(err) {
    console.log('error:', err.message);
});

});