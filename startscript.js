/*
例如
npm install node-cmd --save;

在startscript.js中：
var cmd=require('node-cmd'); cmd.run('npm start'); 

pm2 start startscript.js
*/

var cmd=require('node-cmd'); 
cmd.run('npm run serve'); 