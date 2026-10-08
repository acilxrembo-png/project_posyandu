import express from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import * as controller from "./warga.controller.js";

const router = express.Router();

router.get("/", controller.list);
router.get("/pendaftaran", authorize("KADER"), controller.listPendingRegistrations);
router.get("/:id", controller.getById);
router.post("/pendaftaran/:userId/verifikasi", authorize("KADER"), controller.verifyRegistration);
router.post("/", authorize("ADMIN", "KADER"), controller.create);
router.patch("/:id", authorize("ADMIN", "KADER"), controller.update);
router.put("/:id", authorize("ADMIN", "KADER"), controller.update);
router.delete("/:id", authorize("ADMIN", "KADER"), controller.remove);

export default router;
