/**
 * @file parent
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */

const net = require('net')

// const client = net.createConnection({ port: 8124 }, () => {
const client = net.createConnection('/tmp/echo.sock', () => {
  // 'connect' listener
  console.log('connected to server!');
  client.write('world!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});
