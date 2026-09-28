import Post from "../models/Post.js";
import Comment from "../models/Comment.js";


// ==========================================
// CREATE POST
// ==========================================

export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Post content is required"
            });
        }

        if (content.trim().length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Post content cannot exceed 1000 characters"
            });
        }

        const post = await Post.create({
            author: req.user.userId,
            content: content.trim(),
            image: image ? image.trim() : ""
        });

        const populatedPost = await Post.findById(post._id)
            .populate(
                "author",
                "name username bio profileImage"
            );

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: {
                ...populatedPost.toObject(),
                likesCount: 0,
                commentsCount: 0,
                isLiked: false
            }
        });
    } catch (error) {
        console.error("Create post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while creating post"
        });
    }
};


// ==========================================
// GET ALL POSTS / FEED
// ==========================================

export const getAllPosts = async (req, res) => {
    try {
        const currentUserId = req.user
            ? req.user.userId.toString()
            : null;

        const posts = await Post.find()
            .populate(
                "author",
                "name username bio profileImage"
            )
            .sort({ createdAt: -1 });

        const postsWithDetails = await Promise.all(
            posts.map(async (post) => {
                const commentsCount = await Comment.countDocuments({
                    post: post._id
                });

                const isLiked = currentUserId
                    ? post.likes.some(
                        (id) =>
                            id.toString() === currentUserId
                    )
                    : false;

                return {
                    ...post.toObject(),

                    likesCount: post.likes.length,

                    commentsCount,

                    isLiked
                };
            })
        );

        res.status(200).json({
            success: true,
            count: postsWithDetails.length,
            posts: postsWithDetails
        });
    } catch (error) {
        console.error("Get all posts error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching posts"
        });
    }
};


// ==========================================
// GET SINGLE POST
// ==========================================

export const getSinglePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const currentUserId = req.user
            ? req.user.userId.toString()
            : null;

        const post = await Post.findById(postId)
            .populate(
                "author",
                "name username bio profileImage"
            );

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const commentsCount = await Comment.countDocuments({
            post: post._id
        });

        const isLiked = currentUserId
            ? post.likes.some(
                (id) =>
                    id.toString() === currentUserId
            )
            : false;

        res.status(200).json({
            success: true,
            post: {
                ...post.toObject(),

                likesCount: post.likes.length,

                commentsCount,

                isLiked
            }
        });
    } catch (error) {
        console.error("Get single post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while fetching post"
        });
    }
};


// ==========================================
// UPDATE OWN POST
// ==========================================

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, image } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check ownership
        if (
            post.author.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own posts"
            });
        }

        if (content !== undefined) {
            if (!content.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Post content cannot be empty"
                });
            }

            if (content.trim().length > 1000) {
                return res.status(400).json({
                    success: false,
                    message: "Post content cannot exceed 1000 characters"
                });
            }

            post.content = content.trim();
        }

        if (image !== undefined) {
            post.image = image.trim();
        }

        await post.save();

        const updatedPost = await Post.findById(post._id)
            .populate(
                "author",
                "name username bio profileImage"
            );

        const commentsCount = await Comment.countDocuments({
            post: updatedPost._id
        });

        const isLiked = updatedPost.likes.some(
            (id) =>
                id.toString() ===
                req.user.userId.toString()
        );

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post: {
                ...updatedPost.toObject(),

                likesCount: updatedPost.likes.length,

                commentsCount,

                isLiked
            }
        });
    } catch (error) {
        console.error("Update post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while updating post"
        });
    }
};


// ==========================================
// DELETE OWN POST
// ==========================================

export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        // Check ownership
        if (
            post.author.toString() !==
            req.user.userId.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own posts"
            });
        }

        await Post.findByIdAndDelete(postId);

        // Delete comments belonging to this post
        await Comment.deleteMany({
            post: postId
        });

        res.status(200).json({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.error("Delete post error:", error);

        res.status(500).json({
            success: false,
            message: "Server error while deleting post"
        });
    }
};