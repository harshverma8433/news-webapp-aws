const jwt = require("jsonwebtoken");

const AuthMiddleware = async (req, res, next) => {
    
    try {
        const token = req.headers.authorization;
        console.log(token);

        if (!token) {
            return res.status(401).json({ message: "Unauthorized User! Please Login First!!!" });
        }

        try {
            const verify = jwt.verify(token, process.env.SECRET);
            req.user = verify;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Token has expired! Please Login Again!!" });
            }
            return res.status(401).json({ message: "Invalid Token! Please Login Again!!" });
        }

        next();
    } catch (error) {
        console.error("Authentication Error: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = AuthMiddleware;
