import { Readable } from "stream";
import { User } from "../entities/User";

export interface UserExporterPort {
    exportToStream(usersStream: AsyncIterable<User>): Readable;
}