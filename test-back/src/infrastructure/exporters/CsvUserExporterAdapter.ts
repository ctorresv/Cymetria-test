import { injectable } from "tsyringe";
import { Readable } from "stream";
import { User } from "../../domain/entities/User";
import { UserExporterPort } from "../../domain/ports/UserExporterPort";

@injectable()
export class CsvUserExporterAdapter implements UserExporterPort {

    exportToStream(usersStream: AsyncIterable<User>): Readable {
        return Readable.from(this.generateCsvRows(usersStream));
    }

    private async *generateCsvRows(usersStream: AsyncIterable<User>): AsyncGenerator<string> {
        yield "\uFEFFID,Nombre,Email,Fecha Creación\n";

        for await (const user of usersStream) {
            yield this.formatUserRow(user);
        }
    }

    private formatUserRow(user: User): string {
        const safeName = `"${user.name.replace(/"/g, '""')}"`;
        const safeEmail = `"${user.email.replace(/"/g, '""')}"`;
        const formattedDate = user.createdAt.toISOString();

        return `${user.id},${safeName},${safeEmail},${formattedDate}\n`;
    }
}