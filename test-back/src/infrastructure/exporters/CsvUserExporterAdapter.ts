import { injectable } from "tsyringe";
import { Readable } from "stream";
import { User } from "../../domain/entities/User";
import { UserExporterPort } from "../../domain/ports/UserExporterPort";

@injectable()
export class CsvUserExporterAdapter implements UserExporterPort {

    // 1. Tipo de retorno explícito
    exportToStream(usersStream: AsyncIterable<User>): Readable {
        return Readable.from(this.generateCsvRows(usersStream));
    }

    // 2. Generador aislado para mantener el código limpio
    private async *generateCsvRows(usersStream: AsyncIterable<User>): AsyncGenerator<string> {
        // Encabezados con BOM para Excel
        yield "\uFEFFID,Nombre,Email,Fecha Creación\n";

        for await (const user of usersStream) {
            yield this.formatUserRow(user);
        }
    }

    // 3. Método privado para formatear una sola fila
    private formatUserRow(user: User): string {
        const safeName = `"${user.name.replace(/"/g, '""')}"`;
        const safeEmail = `"${user.email.replace(/"/g, '""')}"`;
        const formattedDate = user.createdAt.toISOString();

        return `${user.id},${safeName},${safeEmail},${formattedDate}\n`;
    }
}