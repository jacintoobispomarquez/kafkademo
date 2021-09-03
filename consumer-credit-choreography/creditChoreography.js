const { Kafka } = require('kafkajs');

exports.creditChoreography = function(key, value) {

    const creditData = JSON.parse(value);
    const clientData = creditData.client;
    const operationData = creditData.operation;
    produce(operationData.transactionID, clientData, 'clients');
    produce(operationData.transactionID, operationData, 'operations');
    
    return true;
}

function produce(transaction, data, topic) {
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
                value: JSON.stringify(data),
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
    const clientId = "credit-client";
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