**App Name**: **Back Challenge (back-challenge)**

**Descripción**: Esta es una API construida con NestJS que gestiona usuarios y les permite asociar pokemones consultando la PokeAPI. Incluye persistencia en PostgreSQL mediante TypeORM, pruebas con Jest y despliegue local mediante Docker.

**Features**:
- **API REST**: CRUD de usuarios.
- **Gestión de pokemones por usuario**: asociar, listar (con o sin detalles desde la PokeAPI) y eliminar pokemones de un usuario.
-**Validaciones**: dependencias para validación incluidas (class-validator / class-transformer).
- **Integración externa**: llamadas a la PokeAPI usando `@nestjs/axios` / `axios`.
- **Testing**: pruebas unitarias y e2e con `jest` y `supertest`.
- **Contenerización**: `Docker` + `docker-compose` para levantar servicios dependientes.

**Pre-requisitos**:
- **Node.js** (recomendado v18+)
- **npm** (o `pnpm`/`yarn` si prefiere) — el repo indica `pnpm` en `package.json`.
- **Docker & Docker Compose** (si se desea ejecutar con contenedores).
- **PostgreSQL** (si no utiliza Docker para la DB).

**Instalación local (sin Docker)**:
- Clonar el repositorio:
  ```bash
  git clone https://github.com/moka-web/challenge-back.git
  cd challenge-back
  ```
- Instalar dependencias (con `pnpm`):
  ```bash
  pnpm install
  ```

**Variables de entorno**:

- Archivo de ejemplo: `example.env` 
Debe crear un `.env` copiando ese archivo y ajustar valores según su entorno.

**Ejecutar la aplicación (desarrollo)**:
- Usando Nest (watch):
  ```bash
  pnpm run start:dev
  ```
- Arrancar con Node (producción):
  ```bash
  pnpm run build
  pnpm run start:prod
  ```

**Ejecutar con Docker (recomendado para reproducibilidad)**:
- Levantar contenedores (app + DB si está configurado en `docker-compose.yml`):
  ```bash
  docker-compose up --build
  ```
- Para pruebas de integración / entorno de test hay `docker-compose.test.yml` y el script `up_test.sh`.



**Rutas / Endpoints principales**:
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

**Testing**:
- Ejecutar unit tests:
  ```bash
  pnpm run test
  ```
- Ejecutar tests e2e:
  ```bash
  pnpm run test:e2e
  ```

**Tecnologías utilizadas**:
- **NestJS**: framework principal para la API.
- **TypeScript**: lenguaje.
- **TypeORM**: ORM para PostgreSQL.
- **PostgreSQL**: base de datos relacional.
- **Docker / Docker Compose**: contenerización y orquestación local.
- **Jest + Supertest**: pruebas unitarias / e2e.
- **@nestjs/swagger**: documentación / decoradores (presente para mejorar API).
- **axios / @nestjs/axios**: llamadas HTTP a la PokeAPI.

**Decisiones de arquitectura**:
- **Separación por módulos (NestJS)**: Cada responsabilidad (users, database, clients) está organizada en módulos de Nest, lo que facilita pruebas y mantenibilidad.
- **Clean Architecture (principios aplicados)**: la estructura busca separar controladores (entrada), servicios (casos de uso) y repositorios/entidad (acceso a datos). Esto facilita reemplazar la capa de persistencia o adaptar la lógica sin afectar la capa de transporte.
- **Por qué TypeORM**: integración estrecha con NestJS (`@nestjs/typeorm`), mapeo a entidades, migraciones y soporte para transacciones; rápido de configurar para prototipos y suficiente para este dominio.
- **Por qué Docker**: garantiza entornos reproducibles (especialmente DB), facilita CI y despliegue local sin instalar dependencias de DB localmente.
- **Por qué Jest**: es el estándar para testing en Node/TypeScript; buena integración con ts-jest, rápido y con herramientas de cobertura.

**Áreas para mejorar / Qué se puede mejorar**:
- Añadir DTOs explícitos en lugar de usar entidades directamente en los controladores (mejor separación de responsabilidades y control de las entradas).
- Añadir migraciones y scripts de seeds para la base de datos.
- Manejo de errores centralizado (filtros de excepciones customizados) para respuestas HTTP más consistentes.
- Añadir logging estructurado (p. ej. `winston` o `pino`) y métricas.
- Añadir validaciones y límites en las llamadas a la PokeAPI (caching / rate-limit).
- Añadir cobertura CI (GitHub Actions / GitLab CI) para ejecutar tests y lint.

**Errores conocidos / Puntos a corregir**:
- El endpoint `POST /users/:id/pokemons` lanza `throw new Error('Debe proporcionar pokemonId o pokemonName')` — debería lanzar una excepción HTTP adecuada (`BadRequestException`) para que Nest la formatee correctamente.
- Manejo de colisiones de email: revisar que el repositorio/devuelva errores con códigos HTTP correctos (409 Conflict) y mensajes consistentes.
- Faltan DTOs para body request (uso de `Omit<User, 'id' | 'createdAt'>` en controlador mezcla entidad y contrato de entrada).


