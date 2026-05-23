const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      );
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized'));
    }
  } else {
    res.status(401);
    next(new Error('No token provided'));
  }
};

module.exports = authMiddleware;
