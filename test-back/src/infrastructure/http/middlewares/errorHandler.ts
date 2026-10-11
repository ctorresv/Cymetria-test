import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../../domain/errors/DomainError";
import { HttpException } from "../errors/HttpException";
import { ENVS_APP } from "../../../config/envs.config"; // Usamos tu config de entorno

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {

    // 1. Errores de Dominio (Reglas de negocio: UserNotFound, UserAlreadyExists, etc.)
    if (err instanceof DomainError) {
        res.status(err.statusCode).json({
            ok: false,
            error: err.name,      // Ej: "UserNotFoundError"
            message: err.message, // Ej: "El usuario con id 123 no existe"
        });
        return;
    }

    // 2. Errores HTTP explícitos (Validaciones de infraestructura, auth, etc.)
    if (err instanceof HttpException) {
        res.status(err.status).json({
            ok: false,
            error: err.name,
            message: err.message,
        });
        return;
    }

    // 3. Errores desconocidos / No controlados
    console.error("[UnhandledError]:", err);

    const errorMessage = err instanceof Error ? err.message : "Ha ocurrido un error desconocido";

    res.status(500).json({
        ok: false,
        error: "InternalServerError",
        message: ENVS_APP.IS_DEVELOPMENT
            ? errorMessage
            : "Ha ocurrido un error interno en el servidor. Por favor, intente más tarde.",
    });
}