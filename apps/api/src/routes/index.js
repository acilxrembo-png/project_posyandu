import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";

import authRoutes from "../modules/auth/auth.routes.js";
import usersRoutes from "../modules/users/users.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";

import puskesmasRoutes from "../modules/puskesmas/puskesmas.routes.js";
import posyanduRoutes from "../modules/posyandu/posyandu.routes.js";
import keluargaRoutes from "../modules/keluarga/keluarga.routes.js";
import wargaRoutes from "../modules/warga/warga.routes.js";
import balitaRoutes from "../modules/balita/balita.routes.js";
import kegiatanRoutes from "../modules/kegiatan/kegiatan.routes.js";
import penimbanganRoutes from "../modules/penimbangan/penimbangan.routes.js";
import vaksinRoutes from "../modules/vaksin/vaksin.routes.js";
import imunisasiRoutes from "../modules/imunisasi/imunisasi.routes.js";
import suplemenRoutes from "../modules/suplemen/suplemen.routes.js";
import kehamilanRoutes from "../modules/kehamilan/kehamilan.routes.js";
import pemeriksaanKehamilanRoutes from "../modules/pemeriksaan-kehamilan/pemeriksaan-kehamilan.routes.js";
import pemeriksaanLansiaRoutes from "../modules/pemeriksaan-lansia/pemeriksaan-lansia.routes.js";
import * as kegiatanController from "../modules/kegiatan/kegiatan.controller.js";

const router = express.Router();

// ---------- Publik ----------
router.get("/health", (req, res) => res.json({ status: "ok" }));
router.use("/auth", authRoutes);
router.get("/informasi/kegiatan", kegiatanController.listPublic);

// ---------- Khusus ADMIN ----------
router.use("/users", authenticate, authorize("ADMIN"), usersRoutes);

// ---------- ADMIN & KADER ----------
const staff = express.Router();
staff.use(authenticate, authorize("ADMIN", "KADER"));

staff.use("/dashboard", dashboardRoutes);

// Wilayah & organisasi
staff.use("/puskesmas", puskesmasRoutes);
staff.use("/posyandu", posyanduRoutes);

// Keluarga & warga
staff.use("/keluarga", keluargaRoutes);
staff.use("/warga", wargaRoutes);
staff.use("/balita", balitaRoutes);

// Kegiatan
staff.use("/kegiatan", kegiatanRoutes);

// Layanan balita
staff.use("/penimbangan", penimbanganRoutes);
staff.use("/vaksin", vaksinRoutes);
staff.use("/imunisasi", imunisasiRoutes);
staff.use("/suplemen", suplemenRoutes);

// Layanan ibu hamil
staff.use("/kehamilan", kehamilanRoutes);
staff.use("/pemeriksaan-kehamilan", pemeriksaanKehamilanRoutes);

// Layanan lansia
staff.use("/pemeriksaan-lansia", pemeriksaanLansiaRoutes);

router.use(staff);

export default router;
