import Post from "../models/Post.js";


// ==========================================
// LIKE POST
// ==========================================

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user already liked the post
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (alreadyLiked) {
            return res.status(400).json({
                success: false,
                message: "You already liked this post"
            });
        }

        // Add user to likes
        post.likes.addToSet(userId);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post liked successfully",
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error("Like post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while liking post"
        });
    }
};


// ==========================================
// UNLIKE POST
// ==========================================

export const unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check if user has liked the post
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString()
        );

        if (!alreadyLiked) {
            return res.status(400).json({
                success: false,
                message: "You have not liked this post"
            });
        }

        // Remove user from likes
        post.likes.pull(userId);

        await post.save();

        res.status(200).json({
            success: true,
            message: "Post unliked successfully",
            likesCount: post.likes.length
        });
    } catch (error) {
        console.error("Unlike post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while unliking post"
        });
    }
};