import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const checkUser = asyncHandler(async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return next(); // ✅ No token? Proceed without authentication.
        }

        // ✅ Verify token safely
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!decodedToken || !decodedToken._id) {
            return next(); // ✅ Invalid token? Proceed without authentication.
        }

        // ✅ Fetch user from database
        const user = await User.findById(decodedToken._id).select(
            "-password -refreshToken"
        );

        if (!user) {
            return next(); // ✅ User not found? Proceed without authentication.
        }

        req.user = user; // ✅ Attach user to request
    } catch (error) {
        console.log("Optional authentication failed:", error.message);
    }

    next(); // ✅ Always proceed to next middleware
});
