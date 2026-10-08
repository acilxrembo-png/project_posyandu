import express from "express";
import * as controller from "./users.controller.js";

const router = express.Router();

router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
