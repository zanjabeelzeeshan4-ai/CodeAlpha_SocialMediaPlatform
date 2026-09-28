import User from "../models/User.js";

// ==========================================
// GET PUBLIC USER PROFILE
// ==========================================

export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({
            username: username.toLowerCase()
        })
            .select("-password -email")
            .populate("followers", "name username profileImage")
            .populate("following", "name username profileImage");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching profile"
        });
    }
};


// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            name,
            bio,
            profileImage
        } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (name !== undefined) {
            if (name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be at least 2 characters"
                });
            }

            user.name = name.trim();
        }

        if (bio !== undefined) {
            if (bio.length > 160) {
                return res.status(400).json({
                    success: false,
                    message: "Bio cannot exceed 160 characters"
                });
            }

            user.bio = bio.trim();
        }

        if (profileImage !== undefined) {
            user.profileImage = profileImage.trim();
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profileImage: user.profileImage,
                followers: user.followers,
                following: user.following
            }
        });
    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating profile"
        });
    }
};


// ==========================================
// FOLLOW USER
// ==========================================

export const followUser = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const targetUserId = req.params.userId;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot follow yourself"
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found"
            });
        }

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User to follow not found"
            });
        }

        const alreadyFollowing = currentUser.following.some(
            (id) => id.toString() === targetUserId
        );

        if (alreadyFollowing) {
            return res.status(400).json({
                success: false,
                message: "You are already following this user"
            });
        }

        currentUser.following.addToSet(targetUserId);
        targetUser.followers.addToSet(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: `You are now following ${targetUser.username}`
        });
    } catch (error) {
        console.error("Follow user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while following user"
        });
    }
};


// ==========================================
// UNFOLLOW USER
// ==========================================

export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const targetUserId = req.params.userId;

        if (currentUserId === targetUserId) {
            return res.status(400).json({
                success: false,
                message: "You cannot unfollow yourself"
            });
        }

        const currentUser = await User.findById(currentUserId);
        const targetUser = await User.findById(targetUserId);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "Current user not found"
            });
        }

        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const isFollowing = currentUser.following.some(
            (id) => id.toString() === targetUserId
        );

        if (!isFollowing) {
            return res.status(400).json({
                success: false,
                message: "You are not following this user"
            });
        }

        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);

        await currentUser.save();
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: `You unfollowed ${targetUser.username}`
        });
    } catch (error) {
        console.error("Unfollow user error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while unfollowing user"
        });
    }
};


// ==========================================
// GET FOLLOWERS
// ==========================================

export const getFollowers = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select("name username followers")
            .populate(
                "followers",
                "name username bio profileImage"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            count: user.followers.length,
            followers: user.followers
        });
    } catch (error) {
        console.error("Get followers error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching followers"
        });
    }
};


// ==========================================
// GET FOLLOWING
// ==========================================

export const getFollowing = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId)
            .select("name username following")
            .populate(
                "following",
                "name username bio profileImage"
            );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            count: user.following.length,
            following: user.following
        });
    } catch (error) {
        console.error("Get following error:", error);

        res.status(200).json({
            success: true,
            count: 0,
            following: []
        });
    }
};