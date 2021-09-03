**Este reposisitorio incluye los ejemplos para el webinar de Kafka en 2Brains**


Los artefactos que existen son los siguientes:

  **client-microservice:** Es un microservicio creeado con Nest que recibe la información de una nueva operación de crédito simlada y produce un mensaje en un tópico Kafka para su procesamiento.
  
  Se utilizó el siguiente escafolding para su creación:
  
      npx @nestjs/cli new client-microservice
      
      npm i --save @nestjs/microservices
  
  **consumer-credit-choreography:** Es un consumidor y productor Kafka que recibe los datos de la operación y del cliente y alimenta otros tópicos para procesar en pralelo la trandsacción.
  
    Se ejecuta mediante el comando:
    
      node consumer.js -f ./kafka.config -t [NOMBRE_TOPICO] -g [NOMBRE_DEL_GRUPO]
  
  **consumer-createclient, consumer-createoperation y consumer-createpayments** contienen consumidores de los tópicos y la lógica de escritura en la BBDD.
    
    Se ejecutan mediante los siguientes comandos:
    
      node consumer.js -f ./kafka.config -h [HOST_BBDD_POSTGRES] -u [POSTGRES_USER] -W [POSTGRES_PASSWORD] -d [DATABASE] -p [POSTGRES_PORT] -t [TOPIC] -g [GROUP]
      
    Cada consumidor se ejecuta desde su propio directorio.

  **consumer-compensator** Es el compensador de operaciones. Es un compensador universal. así que dependiendo de los parámetros con los que se ejecuta permite compensar en distintos recursos.

    Se ejecuta mediante el siguiente comando:
    
      node compensator.js -f ./kafka.config  -h [HOST_BBDD_POSTGRES] -u [POSTGRES_USER] -W [POSTGRES_PASSWORD] -d [DATABASE] -b [POSTGRES_TABLE] -p [POSTGRES_PORT] -t [TOPIC] -g [GROUP]

      por ejemplo, para compensar operaciones: node compensator.js -f ./kafka.config [HOST_BBDD_POSTGRES] -u [POSTGRES_USER] -W [POSTGRES_PASSWORD -d Credits -b operations -p 5432 -t credit_rollback -g compensator_operations


  La base de datos utilizada es prosgres y se desplego con docker, usando los siguientes comandos:
  
    docker run --name postgresql-container -p 5432:5432 -e POSTGRES_PASSWORD=[PASSWORD] -d postgres
    
  Los scripts de creación de tablas para la base de datos se encuentran en la carpeta **postgresql_scripts**

    Clients.sql
    Operations.sql
    Payments.sql







