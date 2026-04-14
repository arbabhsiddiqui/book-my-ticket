import crypto from "crypto";
import bcrypt from "bcryptjs";
import ApiError from "../common/utils/api-error.js";
import {
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken,
} from "../common/utils/jwt.utils.js";
import { pool } from "../index.mjs";
import { sendVerificationEmail } from "../common/config/email.js";


const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role_id }) => {

    const existingQuery = "SELECT * FROM users where email=$1 and is_active=true"

    const existing = await pool.query(existingQuery, [email]);

    if (existing.rowCount !== 0) throw ApiError.conflict("Email already exists");

    const { rawToken, hashedToken } = generateResetToken();

    console.log({ rawToken, hashedToken })

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const addQuery = "INSERT INTO users (name,email,password,role_id,verification_token,is_verify) VALUES ($1,$2,$3,$4,$5,$6)";

    const user = await pool.query(addQuery, [name, email, hashedPassword, role_id, hashedToken, true]);


    console.log(user)
    // try {
    //     await sendVerificationEmail(email, rawToken);
    // } catch (error) {
    //     console.error("Email send failed:", error);
    // }

    return { name, email, role_id };
};

const login = async ({ email, password }) => {


    const findUserQuery = "select id,name,email,password,is_verify,role_id FROM users WHERE email=$1 and is_active=true"

    const user = await pool.query(findUserQuery, [email]);
    if (user.rowCount === 0) throw ApiError.unauthorized("Invalid email or password");


    const userObj = user.rows[0];
    console.log(userObj)

    const isPasswordValid = await bcrypt.compare(password, userObj.password);
    if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

    if (userObj.is_verify === false) {
        throw ApiError.forbidden("Please verify your email before logging in");
    }

    const accessToken = generateAccessToken({ id: userObj.id, role: userObj.role_id });
    const refreshToken = generateRefreshToken({ id: userObj.id });

    userObj.refreshToken = hashToken(refreshToken);


    const saveTokenQuery = "UPDATE users SET refresh_token=$1 where email=$2"
    await pool.query(saveTokenQuery, [userObj.refreshToken, email]);

    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
};

// const refresh = async (token) => {
//     if (!token) throw ApiError.unauthorized("Refresh token missing");
//     const decoded = verifyRefreshToken(token);

//     const user = await User.findById(decoded.id).select("+refreshToken");
//     if (!user) throw ApiError.unauthorized("User not found");

//     if (user.refreshToken !== hashToken(token)) {
//         throw ApiError.unauthorized("Invalid refresh token");
//     }

//     const accessToken = generateAccessToken({ id: user._id, role: user.role });

//     return { accessToken };
// };

// const logout = async (userId) => {
//     //   const user = await User.findById(userId);
//     //   if (!user) throw ApiError.unauthorized("User not found");

//     //   user.refreshToken = undefined;
//     //   await user.save({ validateBeforeSave: false });

//     // await User.findByIdAndUpdate(userId, { refreshToken: null });
// };

// const forgotPassword = async (email) => {
//     console.log("email", email)
//     const user = await User.findOne({ email });
//     if (!user) throw ApiError.notfound("No account with that email");

//     const { rawToken, hashedToken } = generateResetToken();
//     console.log("clled")
//     user.resetPasswordtoken = hashedToken;
//     user.resetpasswordExpires = Date.now() + 15 * 60 * 1000;

//     await user.save({ validateBeforeSave: false });

//     console.log("for testing forgot password flow without email", rawToken)
//     return true
//     // TODO: send password reset email
// };


// const resetPassword = async ({ password, token }) => {
//     const hashedToken = hashToken(token);
//     const user = await User.findOne({ resetPasswordtoken: hashedToken }).select(
//         "+resetPasswordtoken",
//     );

//     if (!user) {
//         throw ApiError.notfound("Invalid or expired verification token");
//     }

//     user.resetPasswordtoken = undefined;
//     user.password = password;
//     await user.save({ validateBeforeSave: false });
//     return user;
// };

// const verifyEmail = async (token) => {
//     const hashedToken = hashToken(token);

//     const verifyQuery = "SELECT  id from users WHERE verification_token=$1"
//     const user = await pool.query(verifyQuery, [hashedToken]);

//     if (user.rowCount == 0) {
//         throw ApiError.badRequest("Invalid or expired verification token");
//     }

//     const { id } = user.rows[0];


//     const verifyingQuery = "UPDATE users SET is_verify=true ,verification_token=null WHERE id=$1"
//     await pool.query(verifyingQuery, [id]);

//     return true;
// };

// const getMe = async (userId) => {
//     const findUserQuery = "SELECT id,name,email,role_id FROM users WHERE id=$1 and is_active=true"

//     const resultArray = await pool.query(findUserQuery, [userId]);

//     if (resultArray.rowCount === 0) throw ApiError.notfound("User not found");

//     const user = resultArray.rows[0]

//     return user;
// };

// const changePassword = async ({ email, oldPassword, newPassword }) => {

//     const user = await User.findOne({ email }).select("+password");
//     if (!user) throw ApiError.unauthorized("Invalid email or password");

//     const isPasswordValid = await user.comparePassword(oldPassword);
//     if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

//     user.password = newPassword;
//     await user.save({ validateBeforeSave: false });
//     delete user.password;
//     return user
// }

export {
    register, login,
    // refresh, logout,
    // forgotPassword, getMe, verifyEmail, resetPassword, changePassword
};
