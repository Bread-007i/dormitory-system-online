const roleMiddleware = (...roles) => {

    return (req, res, next) => {

        if (!req.user) {

            res.status(401);

            return next(
                new Error("Unauthorized")
            );
        }

        if (!roles.includes(req.user.role)) {

            res.status(403);

            return next(
                new Error("Forbidden")
            );
        }

        next();
    };

};

module.exports = roleMiddleware;