import express from "express";

import {
    createComment,
    getPostComments,
    updateComment,
    deleteComment
} from "../controllers/commentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// GET COMMENTS FOR POST
// ==========================================

router.get(
    "/:postId",
    getPostComments
);


// ==========================================
// CREATE COMMENT
// ==========================================

router.post(
    "/:postId",
    authMiddleware,
    createComment
);


// ==========================================
// UPDATE COMMENT
// ==========================================

router.put(
    "/:commentId",
    authMiddleware,
    updateComment
);


// ==========================================
// DELETE COMMENT
// ==========================================

router.delete(
    "/:commentId",
    authMiddleware,
    deleteComment
);


export default router;