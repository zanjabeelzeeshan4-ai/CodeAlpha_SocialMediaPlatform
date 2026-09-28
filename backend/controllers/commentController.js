import Comment from "../models/Comment.js";
import Post from "../models/Post.js";


// ==========================================
// CREATE COMMENT
// ==========================================

export const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 500 characters"
            });
        }

        // Check if post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comment = await Comment.create({
            post: postId,
            author: req.user.userId,
            content: content.trim()
        });

        const populatedComment = await Comment.findById(
            comment._id
        ).populate(
            "author",
            "name username profileImage"
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: populatedComment
        });
    } catch (error) {
        console.error("Create comment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating comment"
        });
    }
};


// ==========================================
// GET COMMENTS FOR A POST
// ==========================================

export const getPostComments = async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if post exists
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const comments = await Comment.find({
            post: postId
        })
            .populate(
                "author",
                "name username profileImage"
            )
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            comments
        });
    } catch (error) {
        console.error("Get comments error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching comments"
        });
    }
};


// ==========================================
// UPDATE OWN COMMENT
// ==========================================

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Comment content is required"
            });
        }

        if (content.trim().length > 500) {
            return res.status(400).json({
                success: false,
                message: "Comment cannot exceed 500 characters"
            });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check ownership
        if (
            comment.author.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own comments"
            });
        }

        comment.content = content.trim();

        await comment.save();

        const updatedComment = await Comment.findById(
            comment._id
        ).populate(
            "author",
            "name username profileImage"
        );

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment: updatedComment
        });
    } catch (error) {
        console.error("Update comment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating comment"
        });
    }
};


// ==========================================
// DELETE OWN COMMENT
// ==========================================

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Check ownership
        if (
            comment.author.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own comments"
            });
        }

        await Comment.findByIdAndDelete(commentId);

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        console.error("Delete comment error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting comment"
        });
    }
};