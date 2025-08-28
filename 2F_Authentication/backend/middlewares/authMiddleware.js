const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Extract token from Authorization header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Access Denied. No Token Provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request object

        next(); // Proceed to next middleware or route
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or Expired Token' });
    }
};
