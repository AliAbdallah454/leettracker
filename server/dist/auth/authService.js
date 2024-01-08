import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisePool } from "../db.js";
import env from 'dotenv';
env.config();
const login = async (req, res) => {
    try {
        const loginInfo = req.body;
        const [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [loginInfo.userName]);
        const typedRows = rows;
        if (typedRows.length > 0) {
            const userInfo = typedRows[0];
            const match = await bcrypt.compare(loginInfo.password, userInfo.password);
            if (match) {
                const token = jwt.sign(userInfo, process.env.JWT_KEY);
                res.cookie("jwt", token);
                const authResponse = {
                    message: "Access granted",
                    status: "ok",
                    code: 200
                };
                return res.send(authResponse);
            }
            else {
                const authResponse = {
                    message: "Password is incorrect",
                    status: "failed",
                    code: 403
                };
                return res.send(authResponse);
            }
        }
        else {
            const authResponse = {
                message: "username is incorrect",
                status: "failed",
                code: 403
            };
            return res.send(authResponse);
        }
    }
    catch (err) {
        const authResponse = {
            message: err.message,
            status: "failed",
            code: 500
        };
        return res.send(authResponse);
    }
};
const signup = async (req, res) => {
    try {
        let signupInfo = req.body;
        let [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [signupInfo.userName]);
        if (rows.length != 0) {
            const authResponse = {
                message: "UserName already Exists",
                status: "failed",
                code: 500
            };
            return res.send(authResponse);
        }
        [rows, fields] = await promisePool.query("SELECT * FROM users WHERE email = ?", [signupInfo.email]);
        if (rows.length != 0) {
            const authResponse = {
                message: "Email already Exists",
                status: "failed",
                code: 500
            };
            return res.send(authResponse);
        }
        const saltRounds = 5;
        const hashedPassword = bcrypt.hashSync(signupInfo.password, saltRounds);
        await promisePool.execute("INSERT INTO users(user_name, email, password) VALUES (?, ?, ?)", [signupInfo.userName, signupInfo.email, hashedPassword]);
        const authResponse = {
            message: "Account created",
            status: "ok",
            code: 200
        };
        return res.send(authResponse);
    }
    catch (err) {
        console.log(err);
        const authResponse = {
            message: err.message,
            status: "failed",
            code: 500
        };
        return res.send(authResponse);
    }
};
export { login, signup };
//# sourceMappingURL=authService.js.map