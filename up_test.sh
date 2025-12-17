#aqui va el comando que se utilizara para levantar el contenedor de testing 
docker-compose -f docker-compose.yml -f docker-compose.test.yml up --build postgres_test api