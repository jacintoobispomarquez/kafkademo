const { Kafka } = require('kafkajs');

exports.creditChoreography = function(key, value, config) {

    const creditData = JSON.parse(value);
    const clientData = creditData.client;
    const operationData = creditData.operation;
    produce(operationData.transactionID, clientData, 'clients', config);
    produce(operationData.transactionID, operationData, 'operations', config);
    
    return true;
}

function produce(transaction, data, topic, config) {
    const kafka = clientConfig(config);
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

function clientConfig(config){
    const clientId = "credit-client";

    console.log(`Brokers ${config['bootstrap.servers']}`);
    return new Kafka({
      clientId: clientId,
      brokers: [config['bootstrap.servers']],
      ssl: true,
      sasl: {
        mechanism: config['sasl.mechanisms'], 
        username: config['sasl.username'],
        password: config['sasl.password']
      }
    })
  }