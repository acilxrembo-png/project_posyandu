import * as authService from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validation.js";

async function register(req, res) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json(result);
}

async function login(req, res) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json(result);
}

async function me(req, res) {
  const user = await authService.getProfile(req.user.id);
  res.json({ user });
}

export { register, login, me };
