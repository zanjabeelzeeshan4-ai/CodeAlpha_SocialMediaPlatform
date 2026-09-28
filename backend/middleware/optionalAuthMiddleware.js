import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {
    try {
        const authorizationHeader =
            req.headers.authorization;

        if (!authorizationHeader) {
            return next();
        }

        if (!authorizationHeader.startsWith("Bearer ")) {
            return next();
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        // Invalid or expired token should not
        // block public feed access.
        next();
    }
};

export default optionalAuthMiddleware;