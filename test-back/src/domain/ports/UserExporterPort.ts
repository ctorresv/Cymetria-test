import { Readable } from "stream";
import { User } from "../entities/User";

export interface UserExporterPort {
    // Transforma el iterador de usuarios en un Stream legible (CSV/Excel)
    exportToStream(usersStream: AsyncIterable<User>): Readable;
}