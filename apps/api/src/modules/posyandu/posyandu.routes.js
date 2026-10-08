import express from "express";
import { authorize } from "../../middleware/auth.middleware.js";
import * as controller from "./posyandu.controller.js";

const router = express.Router();

// Master data: hanya ADMIN yang boleh menambah, mengubah, dan menghapus
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", authorize("ADMIN"), controller.create);
router.patch("/:id", authorize("ADMIN"), controller.update);
router.put("/:id", authorize("ADMIN"), controller.update);
router.delete("/:id", authorize("ADMIN"), controller.remove);

export default router;
