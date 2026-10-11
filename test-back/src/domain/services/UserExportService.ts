import { injectable, inject } from "tsyringe";
import { Readable } from "stream";
import { UserRepository } from "../ports/UserRepository";
import { UserExporterPort } from "../ports/UserExporterPort";

@injectable()
export class UserExportService {
    constructor(
        @inject("UserRepository") private readonly userRepository: UserRepository,
        @inject("UserExporterPort") private readonly userExporter: UserExporterPort
    ) { }

    exportAllUsers(): Readable {
        const usersStream = this.userRepository.findAllStream();
        return this.userExporter.exportToStream(usersStream);
    }
}