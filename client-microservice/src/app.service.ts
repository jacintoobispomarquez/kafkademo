import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { OperationDTO } from './data/operationDTO';
import { ClientDTO } from './data/clientDTO';

@Injectable()
export class AppService {

  createOperation(payload : any): string {
    const topic = 'new_credits';
    const kafka = this.clientConfig();
    const producer = kafka.producer()

    const operation : OperationDTO = payload.operation;
    const client : ClientDTO = payload.client;
    operation.transactionID = this.getTransactionId();
    const response = {
      client,
      operation
    };
    const produce = async () => {
      await producer.connect()
      let i = 0
        try {
          await producer.send({
            topic,
            messages: [
              {
                key: operation.transactionID.toString(),
                value: JSON.stringify(response),
              },
            ],
          })
        } catch (err) {
          console.error("could not write message " + err)
        }
    }

    const kafkaproducer = produce();

    return JSON.stringify(response);

  }

  clientConfig(){
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

  getTransactionId(){
    return new Date().getTime();
  }


}

