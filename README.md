# Prueba Técnica Fullstack – Servicio de Usuarios (Cymetria)

## 📋 Descripción
Solución completa para la gestión de usuarios, implementando un backend robusto con **Arquitectura Hexagonal** y un frontend moderno con **Next.js 16**.

**Características principales:**
- ✅ CRUD completo de usuarios con paginación
- ✅ Exportación escalable mediante streaming (CSV con BOM)
- ✅ Pruebas unitarias
- ✅ Frontend con búsqueda en tiempo real, paginación dinámica y estados optimizados
- ✅ Arquitectura Hexagonal (Ports & Adapters)

---

## 🚀 Prerrequisitos y Levantamiento

### Requisitos Previos
- **Node.js** v18 o superior
- **Docker** y Docker Desktop (para PostgreSQL)
- **npm** o **pnpm**

### 1. Backend

```bash
# Clonar y navegar al backend
cd test-back

# Instalar dependencias
npm install

# Levantar la base de datos PostgreSQL con Docker
docker run --name hexagonal-postgres \
  -e POSTGRES_PASSWORD=mi_password_123 \
  -e POSTGRES_DB=hexagonal_db \
  -p 5432:5432 \
  -v $(pwd)/docker-data/postgres:/var/lib/postgresql/data \
  -d postgres:16

# Configurar variables de entorno
cp .env.example .env.development
# (Ajusta las credenciales si es necesario)

# Ejecutar migraciones y seed (5000 usuarios de prueba)
npm run seed
```
**Notas sobre el seed y la base de datos:**
- La cantidad de usuarios generados se controla con la constante `TOTAL_USERS` dentro de `src/seed.ts`. Por defecto genera 5.000, pero puedes ajustarla según necesites.
- Si prefieres no levantar PostgreSQL, puedes usar el repositorio en memoria. Solo descomenta la línea del `InMemoryUserRepository` en `src/container.ts` y comenta la de `SequelizeUserRepository`. Es un cambio de una línea y todo sigue funcionando igual.
- Con el seed de 5.000 usuarios puedes probar la exportación escalable desde el frontend o directamente en Swagger (`GET /users/export`).

```bash
# Iniciar el servidor en modo desarrollo
npm run dev
```

**El backend estará disponible en:** `http://localhost:4000`

## 📚 Documentación de la API (Swagger)
Una vez levantado el servidor, puedes explorar, leer y probar todos los endpoints de forma interactiva en:
👉 **http://localhost:4000/api-docs**

### 1. Frontend

# En una nueva terminal, navegar al frontend
cd test-front

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev

**El frontend estará disponible en:** `http://localhost:3000`

### 3. Ejecutar Pruebas Unitarias

```bash
cd test-back
# Ejecutar todas las pruebas y generar el reporte de cobertura
npm run test
```

Al finalizar, verás en la terminal un resumen con el porcentaje de cobertura por archivo. Además, se genera automáticamente la carpeta `coverage/` con un reporte HTML detallado. Para verlo en el navegador:

```bash
# Abrir el reporte visual de cobertura (en Mac)
open coverage/lcov-report/index.html

# O en Windows
start coverage/lcov-report/index.html
```

```bash
# Ejecutar pruebas en modo observación (re-ejecuta al guardar cambios)
npm run test:watch
```

---

###  Otros scripts disponibles en el backend
- `npm run build`: Compila el proyecto TypeScript a JavaScript en la carpeta `dist/`, listo para producción.
- `npm run start`: Levanta el servidor usando la versión compilada. Requiere haber ejecutado `build` primero.
- `npm run clean`: Elimina la carpeta `dist/` generada por el build.

## 📁 Estructura del Proyecto

### Backend (`test-back`)
```text
test-back/
├── src/
│   ├── config/                 # Configuración de variables de entorno
│   ├── decorator/              # Decoradores para Inyección de Dependencias
│   ├── domain/                 # Capa de Dominio
│   │   ├── entities/           # Entidades de dominio (User)
│   │   ├── errors/             # Errores de dominio personalizados
│   │   ├── ports/              # Interfaces (UserRepository, UserExporterPort)
│   │   └── services/           # Servicios de aplicación (UserService)
│   ├── infrastructure/         # Capa de Infraestructura
│   │   ├── db/                 # Adaptadores de base de datos (Sequelize)
│   │   ├── exporters/          # Implementación de exportación CSV con streaming
│   │   └── http/               # Adaptadores HTTP (Express, Controllers, Routes)
│   ├── app.ts                  # Configuración de Express
│   ├── container.ts            # Contenedor de Inyección de Dependencias
│   ├── index.ts                # Punto de entrada del servidor
│   ── seed.ts                 # Script de seed de datos
├── tests/                      # Pruebas unitarias
├── .env.example
└── package.json
```

### Frontend (`test-front`)
```text
test-front/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Estilos globales (Tailwind + shadcn/ui)
│   │   ├── layout.tsx          # Layout raíz 
│   │   └── page.tsx            # Página principal de gestión
│   ├── components/
│   │   ├── layout/             # Componentes de layout
│   │   ├── ui/                 # Componentes base de shadcn/ui
│   │   └── users/              # Componentes específicos (Tabla, SearchBar, Modales)
│   ├── hooks/                  # Hooks personalizados (React Query)
│   ├── services/               # Llamadas a la API
│   ├── types/                  # Interfaces TypeScript
│   └── components/Providers.tsx # Providers globales
├── public/
├── .env.example
└── package.json
```

---

## 🧠 Decisiones Técnicas y Arquitectura

### 1. Arquitectura Hexagonal y Dominio Rico
Se implementó **Arquitectura Hexagonal (Ports & Adapters)** para mantener la lógica de negocio estrictamente aislada de frameworks externos (Express, Sequelize) y de la base de datos.
* **Dominio Rico:** La entidad `User` no es un simple objeto de datos (modelo anémico), sino que encapsula sus propias reglas de validación y métodos de mutación. Esto garantiza que el estado de la entidad sea siempre válido, independientemente de quién la modifique.
* **Desacoplamiento:** El uso de Inyección de Dependencias (`tsyringe`) permite intercambiar implementaciones (ej. cambiar de PostgreSQL a un repositorio en memoria para pruebas) sin tocar ni una línea de la lógica de negocio.

### 2. Estrategia de Frontend: Next.js + React Query
Aunque Next.js 16 promueve el uso de Server Components, para un panel de administración (CRUD) con mutaciones constantes y filtros en tiempo real, se optó por un **Client Component** orquestado por **React Query**.
* **Evitar complejidad innecesaria:** Hacer el fetch inicial en el servidor y luego mantenerlo sincronizado con React Query en el cliente requiere un boilerplate complejo (`dehydrate`/`hydrate`) que no aporta beneficios reales de SEO en un dashboard privado.
* **UX Fluida:** React Query gestiona el estado del servidor en el cliente de forma nativa. El uso de `keepPreviousData` evita que la tabla parpadee o se ponga en blanco al cambiar de página, y la invalidación de caché (`invalidateQueries`) asegura que los datos se actualicen al instante tras crear, editar o eliminar un usuario.

## ⚡ Estrategia de Exportación y Escalabilidad

### Desafío
Generar un archivo de exportación para más de 5.000 usuarios puede bloquear el Event Loop de Node.js y consumir toda la memoria RAM si se cargan todos los registros en un array antes de procesarlos.

### Solución implementada: Streaming + CSV con BOM
En lugar de utilizar librerías pesadas de generación de Excel (que suelen cargar todo en memoria), se implementó una solución ligera y de alto rendimiento:
1. **Lectura por bloques (Streaming):** El repositorio consulta la base de datos utilizando un generador asíncrono (`AsyncIterable`), leyendo los registros en bloques (ej. de 1.000 en 1.000). Esto mantiene el consumo de memoria constante y mínimo, sin importar si hay 5.000 o 500.000 usuarios.
2. **Transformación en tiempo real:** Los bloques se transforman a formato CSV sobre la marcha y se canalizan (`pipe`) directamente a la respuesta HTTP.
3. **Compatibilidad con Excel:** Se añade el carácter BOM (`\uFEFF`) al inicio del archivo. Esto fuerza a Microsoft Excel a reconocer la codificación UTF-8 automáticamente, mostrando correctamente tildes y caracteres especiales sin pasos manuales para el usuario final.

### Consideraciones para escalar a millones de registros
Si el volumen de datos creciera exponencialmente, esta arquitectura permite una evolución sencilla:
* Mover el proceso a un **Background Job** (ej. usando BullMQ + Redis).
* El endpoint devolvería inmediatamente un `202 Accepted` con un ID de tarea.
* Un worker procesaría el stream en segundo plano y subiría el archivo a un almacenamiento en la nube (ej. AWS S3), notificando al usuario cuando esté listo.

## ✨ Funcionalidades Adicionales (Frontend)

Más allá del CRUD básico, se implementaron detalles de UX y rendimiento para que la aplicación se sienta como un producto real:
* **Búsqueda con Debounce:** Filtrado por nombre o email con debounce espera 300ms después de que el usuario deja de escribir antes de hacer la petición al backend. Esto evita saturar la API con peticiones innecesarias en cada pulsación de tecla.
* **Paginación Dinámica e Inteligente:** El selector de "Filas por página" se adapta al volumen real de datos. Si solo hay 5 registros, no ofrece opciones de 10 o 25, evitando confusiones y errores de índice.
- **Manejo de Estados:** La tabla gestiona visualmente los estados de *Carga*, *Error* (alertas claras) y *Vacío* (mensajes contextuales), garantizando que el usuario siempre tenga feedback.

## 🧪 Pruebas y Calidad de Código

* **Enfoque en el Comportamiento:** Las pruebas unitarias no solo verifican que el código "no falle", sino que validan el comportamiento de negocio (casos felices, errores de dominio como `UserAlreadyExistsError`, y sanitización de datos).
* **Aislamiento Estricto:** Se utilizan mocks para simular las dependencias (como el repositorio de base de datos), asegurando que los tests sean rápidos, deterministas y no requieran una base de datos real para ejecutarse.
* **Cobertura y Tipado:** Se mantiene una cobertura superior al 90% en los servicios y controladores clave. Además, se priorizó el tipado estricto de TypeScript, evitando el uso de `any` para que el compilador actúe como una red de seguridad en tiempo de desarrollo.