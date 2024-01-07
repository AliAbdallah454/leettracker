import bcrypt from 'bcrypt';
import { promisePool } from "../db.js";
const login = async (req, res) => {
    try {
        const loginInfo = req.body;
        const [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [loginInfo.userName]);
        const typedRows = rows;
        if (typedRows.length > 0) {
            const userInfo = typedRows[0];
            const match = await bcrypt.compare(loginInfo.password, userInfo.password);
            if (match) {
                return res.json({ message: "Access granted" });
            }
            else {
                return res.json({ message: "Password is incorrect" });
            }
        }
        else {
            return res.json({ message: "No user found" });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ err });
    }
};
const signup = async (req, res) => {
    try {
        let signupInfo = req.body;
        let [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [signupInfo.userName]);
        if (rows.length != 0) {
            return res.send("UserName already Exists");
        }
        [rows, fields] = await promisePool.query("SELECT * FROM users WHERE email = ?", [signupInfo.email]);
        if (rows.length != 0) {
            return res.send("Email already Exists");
        }
        const saltRounds = 5;
        const hashedPassword = bcrypt.hashSync(signupInfo.password, saltRounds);
        await promisePool.execute("INSERT INTO users(user_name, email, password) VALUES (?, ?, ?)", [signupInfo.userName, signupInfo.email, hashedPassword]);
        return res.json({ ...signupInfo, password: hashedPassword });
    }
    catch (err) {
        console.log(err);
        return res.json({ err });
    }
};
export { login, signup };
//# sourceMappingURL=authService.js.map