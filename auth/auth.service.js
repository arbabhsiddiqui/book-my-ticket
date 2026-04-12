import crypto from "crypto";
import ApiError from "../common/utils/api-error.js";
import {
    generateAccessToken,
    generateRefreshToken,
    generateResetToken,
    verifyRefreshToken,
} from "../common/utils/jwt.utils.js";
// import { sendVerificationEmail } from "../common/config/email.js";
import { pool } from "../index.mjs";


const hashToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {

    console.log("reach to service")

    const existingQuery = "SELECT * FROM users where email=$1"

    const existing = await pool.query(existingQuery, [email]);
    if (existing) throw ApiError.conflict("Email already exists");

    console.log(existing)

    // const { rawToken, hashedToken } = generateResetToken();

    // const user = await User.create({
    //     name,
    //     email,
    //     password,
    //     role,
    //     verificationToken: hashedToken,
    // });

    // console.log("for testing verfiy email without email", rawToken)

    // try {
    //     await sendVerificationEmail(email, rawToken);
    // } catch (error) {
    //     console.error("Email send failed:", error);
    // }

    // const userObj = user.toObject();
    // delete userObj.password;
    // delete userObj.verificationToken;

    // return userObj;
};

const login = async ({ email, password }) => {
    //take email and find user in DB
    // then check if password is correct
    // check if verified or not

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

    if (!user.isVerified) {
        throw ApiError.forbidden("Please verify your email before logging in");
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;

    return { user: userObj, accessToken, refreshToken };
};

const refresh = async (token) => {
    if (!token) throw ApiError.unauthorized("Refresh token missing");
    const decoded = verifyRefreshToken(token);

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user) throw ApiError.unauthorized("User not found");

    if (user.refreshToken !== hashToken(token)) {
        throw ApiError.unauthorized("Invalid refresh token");
    }

    const accessToken = generateAccessToken({ id: user._id, role: user.role });

    return { accessToken };
};

const logout = async (userId) => {
    //   const user = await User.findById(userId);
    //   if (!user) throw ApiError.unauthorized("User not found");

    //   user.refreshToken = undefined;
    //   await user.save({ validateBeforeSave: false });

    await User.findByIdAndUpdate(userId, { refreshToken: null });
};

const forgotPassword = async (email) => {
    console.log("email", email)
    const user = await User.findOne({ email });
    if (!user) throw ApiError.notfound("No account with that email");

    const { rawToken, hashedToken } = generateResetToken();
    console.log("clled")
    user.resetPasswordtoken = hashedToken;
    user.resetpasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    console.log("for testing forgot password flow without email", rawToken)
    return true
    // TODO: send password reset email
};


const resetPassword = async ({ password, token }) => {
    const hashedToken = hashToken(token);
    const user = await User.findOne({ resetPasswordtoken: hashedToken }).select(
        "+resetPasswordtoken",
    );

    if (!user) {
        throw ApiError.notfound("Invalid or expired verification token");
    }

    user.resetPasswordtoken = undefined;
    user.password = password;
    await user.save({ validateBeforeSave: false });
    return user;
};

const verifyEmail = async (token) => {
    const hashedToken = hashToken(token);
    const user = await User.findOne({ verificationToken: hashedToken }).select(
        "+verificationToken",
    );

    if (!user) {
        throw ApiError.notfound("Invalid or expired verification token");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    return user;
};

const getMe = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw ApiError.notfound("User not found");
    return user;
};

const changePassword = async ({ email, oldPassword, newPassword }) => {

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw ApiError.unauthorized("Invalid email or password");

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) throw ApiError.unauthorized("Invalid email or password");

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    delete user.password;
    return user
}

export { register, login, refresh, logout, forgotPassword, getMe, verifyEmail, resetPassword, changePassword };
