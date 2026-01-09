[![CircleCI](https://circleci.com/gh/moka-web/challenge-back/tree/main.svg?style=shield)](https://app.circleci.com/pipelines/github/moka-web/challenge-back)
[![NestJS](https://img.shields.io/badge/NestJS-%23E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeORM](https://img.shields.io/badge/TypeORM-%230073AF?logo=typeorm&logoColor=white)](https://typeorm.io)
[![Postgres](https://img.shields.io/badge/PostgreSQL-%23316192?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-%230db7ed?logo=docker&logoColor=white)](https://www.docker.com)
[![Jest](https://img.shields.io/badge/Jest-%23C21325?logo=jest&logoColor=white)](https://jestjs.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Coverage Status](https://coveralls.io/repos/github/moka-web/challenge-back/badge.svg)](https://coveralls.io/github/moka-web/challenge-back)
    **App Name**: **Back Challenge (back-challenge)**
    
    |**🔎 Descripción**: Esta es una API construida con NestJS que gestiona usuarios y les permite asociar pokemones consultando la PokeAPI. Incluye persistencia en PostgreSQL mediante TypeORM, pruebas con Jest y despliegue local mediante Docker.
    
    **✨ Features**:
    - **API REST**: CRUD de usuarios.
    - **Gestión de pokemones por usuario**: asociar, listar (con o sin detalles desde la PokeAPI) y eliminar pokemones de un usuario.
    - **Validaciones**: dependencias para validación incluidas (`class-validator` / `class-transformer`).
    - **Integración externa**: llamadas a la PokeAPI usando `@nestjs/axios` / `axios`.
    - **Testing**: pruebas unitarias y e2e con `jest` y `supertest`.
    - **Contenerización**: `Docker` + `docker-compose` para levantar servicios dependientes.
    
    **⚙️ Pre-requisitos**:
    - **Node.js** (recomendado v18+)
    - **npm** (o `pnpm`/`yarn` si prefiere) — el repo indica `pnpm` en `package.json`.
    - **Docker & Docker Compose** (si se desea ejecutar con contenedores).
    - **PostgreSQL** (si no utiliza Docker para la DB).
    
    **📦 Instalación local (sin Docker)**:
    - Clonar el repositorio:
      ```bash
      git clone https://github.com/moka-web/challenge-back.git
      cd challenge-back
      ```
    - Instalar dependencias (con `pnpm`):
      ```bash
      pnpm install
      ```
    
    **🔐 Variables de entorno**:
    
    - Archivo de ejemplo: `example.env` 
    
      Debe crear un `.env` copiando ese archivo y ajustar valores según su entorno.
    
    **▶️ Ejecutar la aplicación (desarrollo)**:
    - Usando Nest (watch):
      ```bash
      pnpm run start:dev
      ```
    - Arrancar con Node (producción):
      ```bash
      pnpm run build
      pnpm run start:prod
      ```
    
    **🐳 Ejecutar con Docker (recomendado para reproducibilidad)**:
    - Levantar contenedores (app + DB si está configurado en `docker-compose.yml`):
      ```bash
      docker-compose up --build
      ```
    - Para pruebas de integración / entorno de test hay `docker-compose.test.yml` y el script `up_test.sh`.
    
    
    
    **🗺️ Rutas / Endpoints principales**:
    - `GET /api` : UI de Swagger con la documentación interactiva de la API.
    
    - `GET /` : saludo / status básico.
    
    - Usuarios (`/users`):
      - `GET /users` : Obtener todos los usuarios.
      - `GET /users/:id` : Obtener un usuario por ID.
      - `POST /users` : Crear un nuevo usuario. Body: objeto `User` (sin `id`).
      - `PUT /users/:id` : Actualizar usuario.
      - `DELETE /users/:id` : Eliminar usuario.
    
    - Pokemones por usuario (`/users/:id/pokemons`):
      - `POST /users/:id/pokemons` : Agregar un pokemon (body: `{ "pokemonId": number }`).
      - `GET /users/:id/pokemons` : Listar pokemones asociados al usuario.
      - `GET /users/:id/pokemons/details` : Listar pokemones con detalles desde la PokeAPI.
      - `DELETE /users/:id/pokemons/:pokemonId` : Remover el pokemon asociado.
    
    **🧪 Testing**:
    - Ejecutar unit tests:
      ```bash
      pnpm run test
      ```
    - Ejecutar tests e2e:
      ```bash
      pnpm run test:e2e
      ```
    
    **🧩 Tecnologías utilizadas**:
     **NestJS**: framework principal para la API.
     **TypeScript**: lenguaje.
     **TypeORM**: ORM para PostgreSQL.
    - **PostgreSQL**: base de datos relacional.
    - **Docker / Docker Compose**: contenerización y orquestación local.
    - **Jest + Supertest**: pruebas unitarias / e2e.
    - **@nestjs/swagger**: documentación / decoradores (presente para mejorar API).
    - **axios / @nestjs/axios**: llamadas HTTP a la PokeAPI.
    
  **🏛️ Decisiones de arquitectura**:
   - **Separación por módulos (NestJS)**: Cada responsabilidad (users, database, clients) está organizada en módulos de Nest, lo que facilita pruebas y mantenibilidad.
   - **Clean Architecture (principios aplicados)**: la estructura busca separar controladores (entrada), servicios (casos de uso) y repositorios/entidad (acceso a datos). Esto facilita reemplazar la capa de persistencia o adaptar la lógica sin afectar la capa de transporte.
- **Por qué TypeORM**: integración estrecha con NestJS (`@nestjs/typeorm`), mapeo a entidades, migraciones y soporte para transacciones; rápido de configurar para prototipos y suficiente para este dominio.
- **Por qué Docker**: garantiza entornos reproducibles (especialmente DB), facilita CI y despliegue local sin instalar dependencias de DB localmente.
- **Por qué Jest**: es el estándar para testing en Node/TypeScript; buena integración con ts-jest, rápido y con herramientas de cobertura.

**🔧 Áreas para mejorar / Qué se puede mejorar**:
- Añadir DTOs explícitos en lugar de usar entidades directamente en los controladores (mejor separación de responsabilidades y control de las entradas).
- Añadir migraciones y scripts de seeds para la base de datos.
- Manejo de errores centralizado (filtros de excepciones customizados) para respuestas HTTP más consistentes.
 - Añadir logging estructurado (p. ej. `winston` o `pino`) y métricas.
- Añadir validaciones y límites en las llamadas a la PokeAPI (caching / rate-limit).
- Añadir cobertura CI (GitHub Actions / GitLab CI) para ejecutar tests y lint.

  **⚠️ Errores conocidos / Puntos a corregir**:
 - El endpoint `POST /users/:id/pokemons` lanza `throw new Error('Debe proporcionar pokemonId o pokemonName')` — debería lanzar una excepción HTTP adecuada (`BadRequestException`) para que Nest la formatee correctamente.
  - Manejo de colisiones de email: revisar que el repositorio/devuelva errores con códigos HTTP correctos (409 Conflict) y mensajes consistentes.
   - Faltan DTOs para body request (uso de `Omit<User, 'id' | 'createdAt'>` en controlador mezcla entidad y contrato de entrada).


### Gestión de Migraciones y Seeds

Las migraciones en TypeORM permiten gestionar cambios en el esquema de la base de datos de manera controlada y versionada. Junto con las 'seed migrations', aseguran que la base de datos no solo tenga la estructura correcta, sino también datos iniciales esenciales para el funcionamiento de la aplicación o para el desarrollo y pruebas.

- **Ubicación**: Las migraciones TypeORM se encuentran en `src/database/migrations` (ej.: `src/database/migrations/1767677414604-tomasMig.ts`). Las seed migrations suelen ubicarse en subdirectorios, como `src/database/migrations/seed-migrations/`.
- **Archivo de configuración (DataSource)**: La configuración de TypeORM está en `src/database/data-source.ts` y exporta `AppDataSource`. Al compilar el proyecto, el CLI de TypeORM apunta a `dist/database/data-source.js`.

- **Scripts disponibles** (definidos en `package.json`):
  - `pnpm run create-migration -- <path>`: Crea una nueva migración (usa el CLI de TypeORM). Ejemplo:
    ```bash
    pnpm run create-migration -- ./src/database/migrations/my-new-migration
    ```
  - `pnpm run aply-migrations-up`: Compila (`pnpm build`) y aplica las migraciones sobre `dist/database/data-source.js`.
    ```bash
    pnpm run aply-migrations-up
    ```
  - `pnpm run aply-migrations-down`: Compila y revierte la última migración (revert).
    ```bash
    pnpm run aply-migrations-down
    ```

- **Flujo recomendado**:
  1. Crear o modificar entidades en `src/`.
  2. Generar la migración. Si prefiere generar automáticamente a partir de cambios, puede usar `migration:generate` (configurar el parámetro `-d` al `data-source` correspondiente cuando aplique desde `dist/`).
  3. Compilar el proyecto si usará los scripts provistos (`pnpm run aply-migrations-up` ejecuta `pnpm build` internamente).
  4. Ejecutar `pnpm run aply-migrations-up` para aplicar las migraciones de esquema en la base de datos objetivo.
  5. **Para ejecutar seed migrations (solo en desarrollo)**:
     ```bash
     pnpm run seed
     ```
     Este comando verificará el entorno y solo ejecutará las seed migrations si `NODE_ENV` está establecido en `development`.

- **Notas**:
  - El proyecto está configurado para buscar migraciones compiladas en `dist/database/migrations/*.js` (ver `migrations` en `src/database/data-source.ts`).
  - Asegúrese de tener las variables de entorno de conexión (`DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`) correctamente configuradas antes de ejecutar las migraciones.
  - Si prefiere ejecutar migraciones sin compilar, puede invocar el CLI de TypeORM con `ts-node`/`ts-node/register` y apuntar al `src/database/data-source.ts` (requiere instalación/configuración adicional).
