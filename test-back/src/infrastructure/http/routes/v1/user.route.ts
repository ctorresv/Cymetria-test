import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../../controllers/user.controller";
import { withTryCatch } from "../../../../decorators/withTryCatch";

const router = Router();

// Inyección limpia: resolverse una única vez al configurar las rutas
const userController = container.resolve(UserController);

router.get("/", withTryCatch(userController.getUsers.bind(userController)));
router.get("/export", withTryCatch(userController.exportUsers.bind(userController)));
router.get("/:id", withTryCatch(userController.getUserById.bind(userController)));
router.post("/", withTryCatch(userController.createUser.bind(userController)));
router.put("/:id", withTryCatch(userController.updateUser.bind(userController)));
router.delete("/:id", withTryCatch(userController.deleteUser.bind(userController)));

export default router;