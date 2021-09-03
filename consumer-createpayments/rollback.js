const { Kafka } = require('kafkajs');

exports.rollback = function(key) {

    produce(key, 'credit_rollback');
}

function produce(transaction, topic) {
    const kafka = clientConfig();
    const producer = kafka.producer()

    const produce = async () => {
      await producer.connect()
      let i = 0
        try {
          await producer.send({
            topic,
            messages: [
              {
                key: transaction.toString(),
                value: transaction.toString(),
              },
            ],
          })
        } catch (err) {
          console.error("could not write message " + err)
        }
    }

    const kafkaproducer = produce();
}

function clientConfig(){
    const clientId = "create-client";
    const brokers = ["pkc-ep9mm.us-east-2.aws.confluent.cloud:9092"];
    const username = 'F76HZLUAMHUAAIAP';
    const password = '20JEhhuCZJmFyayLRAYbNzaTt6YJVxsb6nGZi6wmD4HxZJ96UZQIA64EDWlWN4XB';

    return new Kafka({
      clientId: clientId,
      brokers: brokers,
      ssl: true,
      sasl: {
        mechanism: 'plain', 
        username: username,
        password: password
      }
    })
  }