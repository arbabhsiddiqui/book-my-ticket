import ApiError from "../common/utils/api-error.js";
import { verifyAccessToken } from "../common/utils/jwt.utils.js";
import { pool } from "../index.mjs";


const authenticate = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    console.log("token", token)

    if (!token) throw ApiError.unauthorized("Not Autheticated");
    const decoded = verifyAccessToken(token);
    console.log(decoded)
    const findUserQuery = "SELECT id,name,email,role_id FROM users WHERE id=$1 and is_active=true"

    const userArray = await pool.query(findUserQuery, [decoded.id]);
    // const user = await User.findById(decoded.id);
    if (!userArray.rowCount === 0) throw ApiError.unauthorized("User no longer exists");
    const user = userArray.rows[0];
    req.user = {
        id: user.id,
        role: user.role_id,
        name: user.name,
        email: user.email,
    };
    next();
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw ApiError.forbidden(
                "You do not have permission to perform this action",
            );
        }
        next();
    };
};

export { authenticate, authorize };
