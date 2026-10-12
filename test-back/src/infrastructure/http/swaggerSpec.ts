export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "Cymetria User Service API",
        version: "1.0.0",
        description: "API REST para la gestión de usuarios. Prueba Técnica Fullstack.",
    },
    servers: [
        {
            url: "http://localhost:4000/api/v1",
            description: "Servidor de Desarrollo",
        },
    ],
    tags: [
        { name: "Users", description: "Operaciones CRUD y exportación de usuarios" },
    ],
    paths: {
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Obtener lista paginada de usuarios",
                parameters: [
                    { in: "query", name: "page", schema: { type: "integer", default: 1 }, description: "Número de página" },
                    { in: "query", name: "pageSize", schema: { type: "integer", default: 10 }, description: "Registros por página" },
                    { in: "query", name: "search", schema: { type: "string" }, description: "Buscar por nombre o email" },
                ],
                responses: {
                    200: { description: "Lista de usuarios obtenida exitosamente" },
                    500: { description: "Error interno del servidor" },
                },
            },
            post: {
                tags: ["Users"],
                summary: "Crear un nuevo usuario",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string", example: "Juan Perez" },
                                    email: { type: "string", example: "juan@example.com" },
                                },
                                required: ["name", "email"],
                            },
                        },
                    },
                },
                responses: {
                    201: { description: "Usuario creado exitosamente" },
                    400: { description: "Datos inválidos" },
                    409: { description: "El email ya está registrado" },
                },
            },
        },
        "/users/export": {
            get: {
                tags: ["Users"],
                summary: "Exportar todos los usuarios a CSV",
                responses: {
                    200: {
                        description: "Archivo CSV generado",
                        content: { "text/csv": { schema: { type: "string", format: "binary" } } },
                    },
                },
            },
        },
        "/users/{id}": {
            put: {
                tags: ["Users"],
                summary: "Actualizar un usuario existente",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    name: { type: "string", example: "Juan Perez Actualizado" },
                                    email: { type: "string", example: "juan.new@example.com" },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: "Usuario actualizado" },
                    404: { description: "Usuario no encontrado" },
                },
            },
            delete: {
                tags: ["Users"],
                summary: "Eliminar un usuario",
                parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
                responses: {
                    200: { description: "Usuario eliminado" },
                    404: { description: "Usuario no encontrado" },
                },
            },
        },
    },
};