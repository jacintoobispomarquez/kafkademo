const Kafka = require('node-rdkafka');
const { configFromCli } = require('./config');
const { createOperation } = require('./createOperation');

function createConsumer(config, onData) {
  const consumer = new Kafka.KafkaConsumer({
    'bootstrap.servers': config['bootstrap.servers'],
    'sasl.username': config['sasl.username'],
    'sasl.password': config['sasl.password'],
    'security.protocol': config['security.protocol'],
    'sasl.mechanisms': config['sasl.mechanisms'],
    'group.id': config.group
  }, {
    'auto.offset.reset': 'earliest'
  });

  return new Promise((resolve, reject) => {
    consumer
      .on('ready', () => resolve(consumer))
      .on('data', onData);

    consumer.connect();
  });
}

async function consumerExample() {
  const config = await configFromCli();

  if (config.usage) {
    return console.log(config.usage);
  }

  console.log(`Consuming records from ${config.topic} usin group ${config.group}`);

  let seen = 0;

  const consumer = await createConsumer(config, ({key, value, partition, offset}, ) => {
    const createOperationRecord = createOperation(key, value, config);
    console.log(`Processed record ${key} with result ${createOperationRecord} in partition ${partition} @ offset ${offset}.`);
  });

  consumer.subscribe([config.topic]);
  consumer.consume();

  process.on('SIGINT', () => {
    console.log('\nDisconnecting consumer ...');
    consumer.disconnect();
  });
}

consumerExample()
  .catch((err) => {
    console.error(`Something went wrong:\n${err}`);
    process.exit(1);
  });
