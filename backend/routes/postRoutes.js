import express from "express";

import {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
} from "../controllers/postController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import optionalAuthMiddleware from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();


// ==========================================
// GET ALL POSTS / FEED
// ==========================================

router.get(
    "/",
    optionalAuthMiddleware,
    getAllPosts
);


// ==========================================
// CREATE POST
// ==========================================

router.post(
    "/",
    authMiddleware,
    createPost
);


// ==========================================
// GET SINGLE POST
// ==========================================

router.get(
    "/:postId",
    optionalAuthMiddleware,
    getSinglePost
);


// ==========================================
// UPDATE POST
// ==========================================

router.put(
    "/:postId",
    authMiddleware,
    updatePost
);


// ==========================================
// DELETE POST
// ==========================================

router.delete(
    "/:postId",
    authMiddleware,
    deletePost
);


export default router;