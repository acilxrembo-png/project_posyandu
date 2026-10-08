import express from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import * as controller from "./pemeriksaan-kehamilan.controller.js";

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("ADMIN", "KADER"), controller.create);
router.patch("/:id", authorize("ADMIN", "KADER"), controller.update);
router.put("/:id", authorize("ADMIN", "KADER"), controller.update);
router.delete("/:id", authorize("ADMIN", "KADER"), controller.remove);

export default router;
