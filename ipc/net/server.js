/**
 * @file parent
 * @author Cuttle Cong
 * @date 2018/5/24
 * @description
 */
const net = require('net')

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected');
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.write('hello\r\n');
  c.pipe(c);
});
server.on('error', (err) => {
  throw err;
});
// server.listen(8124, () => {
server.listen('/tmp/echo.sock', () => {
  console.log('server bound');
});
