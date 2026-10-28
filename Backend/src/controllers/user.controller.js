import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, readRefreshToken } from "../utils/auth.utils.js";

const createUser = async (req, res) => {
    try {
        const { email, password, username, role } = req.body
        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            return res.status(400).json({
                error: "User already exists",
                error: [
                    {
                        path: "email",
                        msg: "User already exists  with this email address",
                    }
                ]
            });
        }

        const hashedPassword = await bcrypt.hash(password, 15);


        const user = await User.create({ email, password: hashedPassword, username, role })

        const AccessToken = generateAccessToken(user);
        const RefreshToken = generateRefreshToken(user);
        

        await User.findByIdAndUpdate(user._id, { refreshToken: RefreshToken });

        res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
        });


        res.status(201).json({
            message: "User created successfully",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                },
                accessToken: AccessToken
            }
        })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const AccessToken = generateAccessToken(user);
        const RefreshToken = generateRefreshToken(user);

        await User.findByIdAndUpdate(user._id, { refreshToken: RefreshToken });

        res.cookie("refreshToken", RefreshToken, {
            httpOnly: true,
        });

        res.status(200).json({
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                    role: user.role
                },
                accessToken: AccessToken
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const refresh = async (req, res) => {

    const refreshToken = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("refreshToken="))
        ?.slice("refreshToken=".length);

    if (!refreshToken) {

        return res.status(401).json({
            message: "Refresh token is required."
        })

    }

    try {

        const decoded = readRefreshToken(refreshToken)

        const { id: userId, role } = decoded

        const user = await User.findById(userId)

        if (!user || refreshToken !== user.refreshToken) {
            if (user) await User.findByIdAndUpdate(user._id, {
                refreshToken: null
            })

            return res.status(401).json({
                message: "Refresh token mismatch"
            })
        }

        const accessToken = generateAccessToken(user)

        const newRefreshToken = generateRefreshToken(user)

        await User.findByIdAndUpdate(user._id, {
            refreshToken: newRefreshToken
        })

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true
        })

        res.status(200).json({
            message: "Tokens rotated successfully.",
            data: {
                user: {
                    email: user.email,
                    username: user.username,
                    id: user._id,
                    role: user.role
                },
                accessToken
            }
        })

    } catch (err) {
        return res.status(401).json({
            message: "Invalid refresh Token"
        })
    }
}

const logout = async (req, res) => {

    const refreshToken = req.headers.cookie
        ?.split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith("refreshToken="))
        ?.slice("refreshToken=".length);

    if (!refreshToken) {
        return res.status(401).json({
            message: "Refresh token is required."
        })
    }

    try {
        const decoded = readRefreshToken(refreshToken);
        const { id: userId } = decoded;

        const user = await User.findById(userId);

        if (refreshToken !== user.refreshToken) {
            return res.status(401).json({
                message: "Refresh token mismatch"
            });
        }

        await User.findByIdAndUpdate(user._id, {
            refreshToken: null
        });

        res.clearCookie("refreshToken");

        res.status(200).json({
            message: "Logout successful."
        });

    } catch (err) {
        return res.status(401).json({
            message: "Invalid refresh Token"
        });
    }
}

const getMe = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User data retrieved successfully.",
            data: {
                user: {
                    email: user.email,
                    username: user.username,
                    id: user._id,
                    role: user.role
                }
            }
        });
    }
    catch (err) {
        return res.status(401).json({
            message: "Invalid access Token"
        });
    }
}

export { createUser, loginUser, refresh, logout, getMe };
