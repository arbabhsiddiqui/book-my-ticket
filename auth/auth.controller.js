import * as authService from "./auth.service.js"
import ApiResponse from "../common/utils/api-response.js"

const register = async (req, res) => {
    console.log(req.body)

    const user = await authService.register(req.body)
    ApiResponse.created(res, "Registration success", user)
}

const login = async (req, res) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    ApiResponse.ok(res, "Login successful", { user, accessToken });
};

const logout = async (req, res) => {
    await authService.logout(req.user.id);
    res.clearCookie("refreshToken");
    ApiResponse.ok(res, "Logout Success");
};

const getMe = async (req, res) => {
    const user = await authService.getMe(req.user.id);
    ApiResponse.ok(res, "User Profile", user);
};

const verifyEmail = async (req, res) => {
    const user = await authService.verifyEmail(req.params.token);
    ApiResponse.ok(res, "Email verified successfully", { email: user.email });
};


const forgotPassword = async (req, res) => {
    await authService.forgotPassword(req.body.email)
    ApiResponse.ok(res, "ChangePassword url send to email", {})
}

const resetPassword = async (req, res) => {
    await authService.resetPassword(req.body)
    ApiResponse.ok(res, "Successfully reset", {})
}


const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const email = req.user.email;
    await authService.changePassword({ oldPassword, newPassword, email })
    ApiResponse.ok(res, "Successfully changed", {})
}




export { register, login, logout, getMe, verifyEmail, forgotPassword, resetPassword, changePassword }