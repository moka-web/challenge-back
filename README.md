     1|[![CircleCI](https://circleci.com/gh/moka-web/challenge-back/tree/main.svg?style=shield)](https://app.circleci.com/pipelines/github/moka-web/challenge-back) [![NestJS](https://img.shields.io/badge/NestJS-%23E0234E?logo=nestjs&logoColor=white)](https://nestjs.com) [![TypeORM](https://img.shields.io/badge/TypeORM-%230073AF?logo=typeorm&logoColor=white)](https://typeorm.io) [![Postgres](https://img.shields.io/badge/PostgreSQL-%23316192?logo=postgresql&logoColor=white)](https://www.postgresql.org) [![Docker](https://img.shields.io/badge/Docker-%230db7ed?logo=docker&logoColor=white)](https://www.docker.com) [![Jest](https://img.shields.io/badge/Jest-%23C21325?logo=jest&logoColor=white)](https://jestjs.io) [![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
     2|[![Coverage Status](https://coveralls.io/repos/github/moka-web/challenge-back/badge.svg)](https://coveralls.io/github/moka-web/challenge-back)
     3|
     4|**App Name**: **Back Challenge (back-challenge)**
     5|
     6|**🔎 Descripción**: Esta es una API construida con NestJS que gestiona usuarios y les permite asociar pokemones consultando la PokeAPI. Incluye persistencia en PostgreSQL mediante TypeORM, pruebas con Jest y despliegue local mediante Docker.
     7|
     8|**✨ Features**:
     9|- **API REST**: CRUD de usuarios.
    10|- **Gestión de pokemones por usuario**: asociar, listar (con o sin detalles desde la PokeAPI) y eliminar pokemones de un usuario.
    11|- **Validaciones**: dependencias para validación incluidas (`class-validator` / `class-transformer`).
    12|- **Integración externa**: llamadas a la PokeAPI usando `@nestjs/axios` / `axios`.
    13|- **Testing**: pruebas unitarias y e2e con `jest` y `supertest`.
    14|- **Contenerización**: `Docker` + `docker-compose` para levantar servicios dependientes.
    15|
    16|**⚙️ Pre-requisitos**:
    17|- **Node.js** (recomendado v18+)
    18|- **npm** (o `pnpm`/`yarn` si prefiere) — el repo indica `pnpm` en `package.json`.
    19|- **Docker & Docker Compose** (si se desea ejecutar con contenedores).
    20|- **PostgreSQL** (si no utiliza Docker para la DB).
    21|
    22|**📦 Instalación local (sin Docker)**:
    23|- Clonar el repositorio:
    24|  ```bash
    25|  git clone https://github.com/moka-web/challenge-back.git
    26|  cd challenge-back
    27|  ```
    28|- Instalar dependencias (con `pnpm`):
    29|  ```bash
    30|  pnpm install
    31|  ```
    32|
    33|**🔐 Variables de entorno**:
    34|
    35|- Archivo de ejemplo: `example.env` 
    36|
    37|  Debe crear un `.env` copiando ese archivo y ajustar valores según su entorno.
    38|
    39|**▶️ Ejecutar la aplicación (desarrollo)**:
    40|- Usando Nest (watch):
    41|  ```bash
    42|  pnpm run start:dev
    43|  ```
    44|- Arrancar con Node (producción):
    45|  ```bash
    46|  pnpm run build
    47|  pnpm run start:prod
    48|  ```
    49|
    50|**🐳 Ejecutar con Docker (recomendado para reproducibilidad)**:
    51|- Levantar contenedores (app + DB si está configurado en `docker-compose.yml`):
    52|  ```bash
    53|  docker-compose up --build
    54|  ```
    55|- Para pruebas de integración / entorno de test hay `docker-compose.test.yml` y el script `up_test.sh`.
    56|
    57|
    58|
    59|**🗺️ Rutas / Endpoints principales**:
    60|- `GET /api` : UI de Swagger con la documentación interactiva de la API.
    61|
    62|- `GET /` : saludo / status básico.
    63|
    64|- Usuarios (`/users`):
    65|  - `GET /users` : Obtener todos los usuarios.
    66|  - `GET /users/:id` : Obtener un usuario por ID.
    67|  - `POST /users` : Crear un nuevo usuario. Body: objeto `User` (sin `id`).
    68|  - `PUT /users/:id` : Actualizar usuario.
    69|  - `DELETE /users/:id` : Eliminar usuario.
    70|
    71|- Pokemones por usuario (`/users/:id/pokemons`):
    72|  - `POST /users/:id/pokemons` : Agregar un pokemon (body: `{ "pokemonId": number }`).
    73|  - `GET /users/:id/pokemons` : Listar pokemones asociados al usuario.
    74|  - `GET /users/:id/pokemons/details` : Listar pokemones con detalles desde la PokeAPI.
    75|  - `DELETE /users/:id/pokemons/:pokemonId` : Remover el pokemon asociado.
    76|
    77|**🧪 Testing**:
    78|- Ejecutar unit tests:
    79|  ```bash
    80|  pnpm run test
    81|  ```
    82|- Ejecutar tests e2e:
    83|  ```bash
    84|  pnpm run test:e2e
    85|  ```
    86|
    87|**🧩 Tecnologías utilizadas**:
    88|- **NestJS**: framework principal para la API.
    89|- **TypeScript**: lenguaje.
    90|- **TypeORM**: ORM para PostgreSQL.
    91|- **PostgreSQL**: base de datos relacional.
    92|- **Docker / Docker Compose**: contenerización y orquestación local.
    93|- **Jest + Supertest**: pruebas unitarias / e2e.
    94|- **@nestjs/swagger**: documentación / decoradores (presente para mejorar API).
    95|- **axios / @nestjs/axios**: llamadas HTTP a la PokeAPI.
    96|
    97|**🏛️ Decisiones de arquitectura**:
    98|- **Separación por módulos (NestJS)**: Cada responsabilidad (users, database, clients) está organizada en módulos de Nest, lo que facilita pruebas y mantenibilidad.
    99|- **Clean Architecture (principios aplicados)**: la estructura busca separar controladores (entrada), servicios (casos de uso) y repositorios/entidad (acceso a datos). Esto facilita reemplazar la capa de persistencia o adaptar la lógica sin afectar la capa de transporte.
   100|- **Por qué TypeORM**: integración estrecha con NestJS (`@nestjs/typeorm`), mapeo a entidades, migraciones y soporte para transacciones; rápido de configurar para prototipos y suficiente para este dominio.
   101|- **Por qué Docker**: garantiza entornos reproducibles (especialmente DB), facilita CI y despliegue local sin instalar dependencias de DB localmente.
   102|- **Por qué Jest**: es el estándar para testing en Node/TypeScript; buena integración con ts-jest, rápido y con herramientas de cobertura.
   103|
   104|**🔧 Áreas para mejorar / Qué se puede mejorar**:
   105|- Añadir DTOs explícitos en lugar de usar entidades directamente en los controladores (mejor separación de responsabilidades y control de las entradas).
   106|- Añadir migraciones y scripts de seeds para la base de datos.
   107|- Manejo de errores centralizado (filtros de excepciones customizados) para respuestas HTTP más consistentes.
   108|- Añadir logging estructurado (p. ej. `winston` o `pino`) y métricas.
   109|- Añadir validaciones y límites en las llamadas a la PokeAPI (caching / rate-limit).
   110|- Añadir cobertura CI (GitHub Actions / GitLab CI) para ejecutar tests y lint.
   111|
   112|
   113|**⚠️ Errores conocidos / Puntos a corregir**:
   114|- El endpoint `POST /users/:id/pokemons` lanza `throw new Error('Debe proporcionar pokemonId o pokemonName')` — debería lanzar una excepción HTTP adecuada (`BadRequestException`) para que Nest la formatee correctamente.
   115|- Manejo de colisiones de email: revisar que el repositorio/devuelva errores con códigos HTTP correctos (409 Conflict) y mensajes consistentes.
   116|- Faltan DTOs para body request (uso de `Omit<User, 'id' | 'createdAt'>` en controlador mezcla entidad y contrato de entrada).


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
