import jwt from 'jsonwebtoken';


export default function verifyToken(req, res, next) {
    const token = req.header("auth_token");

    if (!token) {
        return res.status(401).send({
            error: "Access Denied",
            invalidToken: true,
        })
    }

    try {
        const verified = jwt.verify(token, "abcdefghijklmnopqrstuvwxyz");
        req.auth = verified
    } catch (err) {
        return res.status(401).send({
            error: "Please login again to continue.",
            invalidToken: true,
        })
    }
    next();
};

