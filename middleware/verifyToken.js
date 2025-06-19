import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import e from "express";
dotenv.config();


 const verifyToken = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = decoded.userId;
        next();


    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Unauthorized" });
    }
}
export default verifyToken;