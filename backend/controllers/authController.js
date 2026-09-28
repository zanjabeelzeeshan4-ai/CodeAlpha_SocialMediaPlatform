// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

// import User from "../models/User.js";

// const generateToken = (userId) => {
//     return jwt.sign(
//         { userId },
//         process.env.JWT_SECRET,
//         {
//             expiresIn: "7d"
//         }
//     );
// };

// export const registerUser = async (req, res) => {
//     try {
//         const {
//             name,
//             username,
//             email,
//             password
//         } = req.body;

//         if (!name || !username || !email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Name, username, email and password are required"
//             });
//         }

//         if (password.length < 6) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Password must be at least 6 characters long"
//             });
//         }

//         const existingUser = await User.findOne({
//             $or: [
//                 { email: email.toLowerCase().trim() },
//                 { username: username.toLowerCase().trim() }
//             ]
//         });

//         if (existingUser) {
//             if (
//                 existingUser.email ===
//                 email.toLowerCase().trim()
//             ) {
//                 return res.status(409).json({
//                     success: false,
//                     message: "Email is already registered"
//                 });
//             }

//             return res.status(409).json({
//                 success: false,
//                 message: "Username is already taken"
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 12);

//         const user = await User.create({
//             name: name.trim(),
//             username: username.toLowerCase().trim(),
//             email: email.toLowerCase().trim(),
//             password: hashedPassword
//         });

//         const token = generateToken(user._id);

//         res.status(201).json({
//             success: true,
//             message: "User registered successfully",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 username: user.username,
//                 email: user.email,
//                 bio: user.bio,
//                 profileImage: user.profileImage
//             }
//         });
//     } catch (error) {
//         console.error("Register error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while registering user"
//         });
//     }
// };

// export const loginUser = async (req, res) => {
//     try {
//         const {
//             email,
//             password
//         } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required"
//             });
//         }

//         const user = await User.findOne({
//             email: email.toLowerCase().trim()
//         });

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         const passwordMatched = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!passwordMatched) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password"
//             });
//         }

//         const token = generateToken(user._id);

//         res.status(200).json({
//             success: true,
//             message: "Login successful",
//             token,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 username: user.username,
//                 email: user.email,
//                 bio: user.bio,
//                 profileImage: user.profileImage
//             }
//         });
//     } catch (error) {
//         console.error("Login error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while logging in"
//         });
//     }
// };

// export const getCurrentUser = async (req, res) => {
//     try {
//         const user = await User.findById(req.user.userId)
//             .select("-password");

//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             user
//         });
//     } catch (error) {
//         console.error("Get current user error:", error);

//         res.status(500).json({
//             success: false,
//             message: "Server error while fetching user"
//         });
//     }
// };

// new

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper function to generate JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

// 1. REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if (!name || !username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, username, email and password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const normalizedUsername = username.toLowerCase().trim();

        const existingUser = await User.findOne({
            $or: [
                { email: normalizedEmail },
                { username: normalizedUsername }
            ]
        });

        if (existingUser) {
            if (existingUser.email === normalizedEmail) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already registered"
                });
            }
            return res.status(409).json({
                success: false,
                message: "Username is already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            username: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword
        });

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token, // 👈 Token response mein ja raha hai
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while registering user"
        });
    }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const passwordMatched = await bcrypt.compare(password, user.password);

        if (!passwordMatched) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token, // 👈 Token response mein ja raha hai
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while logging in"
        });
    }
};

// 3. GET CURRENT USER (Protected Route)
export const getCurrentUser = async (req, res) => {
    try {
        // middleware se aane wali userId ko use kar ke user check karein
        const user = await User.findById(req.user.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user // Isme token nahi hoga (kiunke user pehle se logged in hai)
        });
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching user"
        });
    }
};
