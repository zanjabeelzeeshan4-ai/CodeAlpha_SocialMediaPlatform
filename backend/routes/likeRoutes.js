import express from "express";

import {
    likePost,
    unlikePost
} from "../controllers/likeController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// LIKE POST
// ==========================================

router.post(
    "/:postId/like",
    authMiddleware,
    likePost
);


// ==========================================
// UNLIKE POST
// ==========================================

router.delete(
    "/:postId/like",
    authMiddleware,
    unlikePost
);


export default router;