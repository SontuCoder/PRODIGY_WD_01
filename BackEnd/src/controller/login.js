const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken, verifyToken, generateRefreashToken } = require("../utils/jwtUtil");

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new error("User not found");
        };
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            throw new error("Incorrect Password!");
        };
        const token = generateToken(existingUser);
        res.status(200).json({ message: "Login successfully", token: token, user: existingUser });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid credentials" });
    }
}

async function refreshToken(req, res) {
    try {
        const { oldToken } = req.body;
        const decodedToken = verifyToken(oldToken);
        const existingUser = await User.findById(decodedToken.id);
        if (!existingUser) {
            throw new error("User not found");
        };
        const newToken = generateRefreashToken(existingUser);
        res.status(200).json({ message: "Refresh Token created successfully", token: newToken, user: existingUser });
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = { login, refreshToken };