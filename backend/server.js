import errorMiddleware from "./middleware/errorMiddleware.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// CONNECT DATABASE
// ==========================================

connectDB();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/posts", likeRoutes);


// ==========================================
// ROOT ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CodeAlpha Social Media Platform API is running!"
    });
});


// // ==========================================
// // UNKNOWN ROUTE
// // ==========================================

// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: "Route not found"
//     });
// });


// // ==========================================
// // START SERVER
// // ==========================================

// app.listen(PORT, () => {
//     console.log(
//         `Server running on http://localhost:${PORT}`
//     );
// });
// ==========================================
// UNKNOWN ROUTE
// ==========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorMiddleware);


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});