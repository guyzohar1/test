
var amqp = require('amqplib/callback_api');

var rabbit_url = "amqp://localhost:5672"

amqp.connect('amqp://admin:admin@localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {});
});

exports.sendQueue = async function(q,m)
{
  amqp.connect('amqp://admin:admin@localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
        throw error1;
        }
        
        channel.sendToQueue(q, Buffer.from(m));
    });
    });
};
