#este comando levanta el contenedor de la api con la base de datos de prod + la base de datos de test. 
#esto hay que cambiarlo para que levante solo la base de datos de test.
docker-compose  -f docker-compose.test.yml up --build 
docker-compose -f docker-compose.test.yml down -v