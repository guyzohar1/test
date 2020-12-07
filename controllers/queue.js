
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://admin:admin@localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {});
});

exports.sendQueue = function(q,m)
{
    channel.sendToQueue(q, Buffer.from(m));
}
