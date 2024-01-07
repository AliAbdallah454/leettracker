import express from 'express';
import { login, signup } from './authService.js';
const authRouter = express.Router();
authRouter.post("/login", (req, res) => {
    login(req, res);
});
authRouter.post("/signup", (req, res) => {
    signup(req, res);
});
export { authRouter };
//# sourceMappingURL=authController.js.map