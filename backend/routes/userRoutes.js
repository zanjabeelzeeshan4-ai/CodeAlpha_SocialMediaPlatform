import express from "express";

import {
    getUserProfile,
    updateProfile,
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// PUBLIC PROFILE
// ==========================================

router.get(
    "/profile/:username",
    getUserProfile
);


// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

router.put(
    "/profile",
    authMiddleware,
    updateProfile
);


// ==========================================
// FOLLOW USER
// ==========================================

router.post(
    "/:userId/follow",
    authMiddleware,
    followUser
);


// ==========================================
// UNFOLLOW USER
// ==========================================

router.delete(
    "/:userId/follow",
    authMiddleware,
    unfollowUser
);


// ==========================================
// GET FOLLOWERS
// ==========================================

router.get(
    "/:userId/followers",
    getFollowers
);


// ==========================================
// GET FOLLOWING
// ==========================================

router.get(
    "/:userId/following",
    getFollowing
);


export default router;