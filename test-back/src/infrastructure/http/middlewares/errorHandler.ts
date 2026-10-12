import { Request, Response, NextFunction } from "express";
import { DomainError } from "../../../domain/errors/DomainError";
import { HttpException } from "../errors/HttpException";
import { ENVS_APP } from "../../../config/envs.config"; 

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {


    if (err instanceof DomainError) {
        res.status(err.statusCode).json({
            ok: false,
            error: err.name,      
            message: err.message, 
        });
        return;
    }

    if (err instanceof HttpException) {
        res.status(err.status).json({
            ok: false,
            error: err.name,
            message: err.message,
        });
        return;
    }

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