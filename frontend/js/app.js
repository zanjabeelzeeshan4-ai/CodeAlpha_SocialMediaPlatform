// ==========================================
// CODEALPHA SOCIAL MEDIA PLATFORM
// FRONTEND APPLICATION
// ==========================================


// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL = "http://localhost:5000/api";


// ==========================================
// DOM ELEMENTS
// ==========================================

const postsContainer =
    document.getElementById("postsContainer");

const logoutBtn =
    document.getElementById("logoutBtn");

const createPostForm =
    document.getElementById("createPostForm");

const createPostMessage =
    document.getElementById("createPostMessage");

const createPostBtn =
    createPostForm?.querySelector(".create-post-btn");


// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Get logged-in user
const getCurrentUser = () => {

    try {

        return JSON.parse(
            localStorage.getItem("user")
        );

    } catch (error) {

        console.error(
            "User data parsing error:",
            error
        );

        return null;
    }
};


// Get token
const getToken = () => {

    return localStorage.getItem("token");

};


// ==========================================
// AUTH UI
// ==========================================

const updateAuthUI = () => {

    const token =
        getToken();

    const user =
        getCurrentUser();

    const createPostCard =
        document.querySelector(
            ".create-post-card"
        );


    // ------------------------------------------
    // USER NOT LOGGED IN
    // ------------------------------------------

    if (!token || !user) {

        if (createPostCard) {

            createPostCard.innerHTML = `
                <h2>
                    Login to Create a Post
                </h2>

                <p>
                    Please login to share your thoughts
                    with the community.
                </p>

                <br>

                <a
                    href="./login.html"
                    class="create-post-btn"
                >
                    Login
                </a>
            `;

        }

        return;
    }

};


// ==========================================
// LOAD POSTS
// ==========================================

const loadPosts = async () => {

    try {

        if (!postsContainer) {
            return;
        }


        postsContainer.innerHTML =
            "<p>Loading posts...</p>";


        // ------------------------------------------
        // GET TOKEN
        // ------------------------------------------

        const token =
            getToken();


        // ------------------------------------------
        // REQUEST HEADERS
        // ------------------------------------------

        const headers = {};

        if (token) {

            headers.Authorization =
                `Bearer ${token}`;

        }


        // ------------------------------------------
        // FETCH POSTS
        // ------------------------------------------

        const response =
            await fetch(
                `${API_BASE_URL}/posts`,
                {
                    method: "GET",
                    headers
                }
            );


        const data =
            await response.json();


        // ------------------------------------------
        // HANDLE ERROR
        // ------------------------------------------

        if (!response.ok) {

            postsContainer.innerHTML = `
                <p>
                    ${data.message || "Failed to load posts."}
                </p>
            `;

            return;
        }


        // ------------------------------------------
        // NO POSTS
        // ------------------------------------------

        if (
            !data.posts ||
            data.posts.length === 0
        ) {

            postsContainer.innerHTML =
                "<p>No posts available yet.</p>";

            return;
        }


        // ------------------------------------------
        // RENDER POSTS
        // ------------------------------------------

        postsContainer.innerHTML =
            data.posts
                .map((post) =>
                    createPostHTML(post)
                )
                .join("");


        // ------------------------------------------
        // LOAD COMMENTS FOR EVERY POST
        // ------------------------------------------

        data.posts.forEach((post) => {

            loadComments(post._id);

        });


    } catch (error) {

        console.error(
            "Load posts error:",
            error
        );


        if (postsContainer) {

            postsContainer.innerHTML = `
                <p>
                    Unable to connect to server.
                </p>
            `;

        }

    }

};


// ==========================================
// CREATE POST HTML
// ==========================================

const createPostHTML = (post) => {

    // ------------------------------------------
    // AUTHOR DATA
    // ------------------------------------------

    const authorName =
        post.author?.name ||
        "Unknown User";


    const username =
        post.author?.username ||
        "unknown";


    const profileImage =
        post.author?.profileImage ||
        "";


    // ------------------------------------------
    // POST IMAGE
    // ------------------------------------------

    const imageHTML =
        post.image
            ? `
                <img
                    src="${post.image}"
                    alt="Post image"
                    class="post-image"
                >
            `
            : "";


    // ------------------------------------------
    // AUTHOR AVATAR
    // ------------------------------------------

    const avatarHTML =
        profileImage
            ? `
                <img
                    src="${profileImage}"
                    alt="${authorName}"
                    class="post-avatar"
                >
            `
            : `
                <div class="post-avatar-placeholder">
                    ${authorName
                        .charAt(0)
                        .toUpperCase()}
                </div>
            `;


    // ------------------------------------------
    // RETURN POST CARD
    // ------------------------------------------

    return `
        <article
            class="post-card"
            data-post-id="${post._id}"
        >

            <!-- ==================================
                 POST HEADER
            =================================== -->

            <div class="post-header">

                <div class="post-author">

                    ${avatarHTML}

                    <div>

                        <h3>

                            <a
                                href="./public-profile.html?username=${encodeURIComponent(username)}"
                                class="post-author-link"
                            >
                                ${authorName}
                            </a>

                        </h3>

                        <p>
                            @${username}
                        </p>

                    </div>

                </div>

            </div>


            <!-- ==================================
                 POST CONTENT
            =================================== -->

            <div class="post-content">

                <p>
                    ${post.content}
                </p>

                ${imageHTML}

            </div>


            <!-- ==================================
                 POST STATS
            =================================== -->

            <div class="post-stats">

                <span class="likes-count">

                    ❤️ ${post.likesCount || 0} Likes

                </span>


                <span class="comments-count">

                    💬 ${post.commentsCount || 0} Comments

                </span>

            </div>


            <!-- ==================================
                 POST ACTIONS
            =================================== -->

            <div class="post-actions">

                <button
                    type="button"
                    class="post-action-btn like-btn"
                    data-post-id="${post._id}"
                    data-liked="${post.isLiked ? "true" : "false"}"
                >

                    ❤️
                    ${post.isLiked ? "Liked" : "Like"}

                </button>


                <button
                    type="button"
                    class="post-action-btn comment-toggle-btn"
                    data-post-id="${post._id}"
                >

                    💬 Comment

                </button>

            </div>


            <!-- ==================================
                 COMMENTS SECTION
            =================================== -->

            <div
                class="comments-section"
                id="comments-${post._id}"
            >

                <div class="comments-header">

                    <h4>
                        Comments
                    </h4>

                </div>


                <!-- ADD COMMENT FORM -->

                <form
                    class="comment-form"
                    data-post-id="${post._id}"
                >

                    <textarea
                        class="comment-input"
                        placeholder="Write a comment..."
                        maxlength="500"
                        rows="3"
                        required
                    ></textarea>


                    <button
                        type="submit"
                        class="comment-submit-btn"
                    >
                        Add Comment
                    </button>

                </form>


                <!-- COMMENTS LIST -->

                <div
                    class="comments-list"
                    id="comments-list-${post._id}"
                >

                    <p class="comments-loading">
                        Loading comments...
                    </p>

                </div>

            </div>

        </article>
    `;

};


// ==========================================
// CREATE POST
// ==========================================

if (createPostForm) {

    createPostForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ------------------------------------------
            // GET FORM VALUES
            // ------------------------------------------

            const contentInput =
                document.getElementById(
                    "postContent"
                );


            const imageInput =
                document.getElementById(
                    "postImage"
                );


            const content =
                contentInput
                    ?.value
                    .trim() || "";


            const image =
                imageInput
                    ?.value
                    .trim() || "";


            // ------------------------------------------
            // CHECK CONTENT
            // ------------------------------------------

            if (!content) {

                if (createPostMessage) {

                    createPostMessage.textContent =
                        "Please write something before posting.";

                }

                return;
            }


            // ------------------------------------------
            // GET TOKEN
            // ------------------------------------------

            const token =
                getToken();


            // ------------------------------------------
            // CHECK LOGIN
            // ------------------------------------------

            if (!token) {

                if (createPostMessage) {

                    createPostMessage.textContent =
                        "Please login to create a post.";

                }

                return;
            }


            // ------------------------------------------
            // BUTTON LOADING STATE
            // ------------------------------------------

            if (createPostMessage) {

                createPostMessage.textContent =
                    "Creating your post...";

            }


            if (createPostBtn) {

                createPostBtn.disabled =
                    true;

                createPostBtn.textContent =
                    "Creating...";

            }


            // ------------------------------------------
            // SEND REQUEST
            // ------------------------------------------

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/posts`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    `Bearer ${token}`

                            },

                            body: JSON.stringify({

                                content,

                                image

                            })

                        }
                    );


                const data =
                    await response.json();


                // ------------------------------------------
                // HANDLE ERROR
                // ------------------------------------------

                if (!response.ok) {

                    if (createPostMessage) {

                        createPostMessage.textContent =
                            data.message ||
                            "Failed to create post.";

                    }

                    return;
                }


                // ------------------------------------------
                // SUCCESS
                // ------------------------------------------

                console.log(
                    "Post created successfully:",
                    data
                );


                if (createPostMessage) {

                    createPostMessage.textContent =
                        "Post created successfully!";

                }


                // ------------------------------------------
                // CLEAR FORM
                // ------------------------------------------

                createPostForm.reset();


                // ------------------------------------------
                // RELOAD FEED
                // ------------------------------------------

                await loadPosts();


            } catch (error) {

                console.error(
                    "Create post error:",
                    error
                );


                if (createPostMessage) {

                    createPostMessage.textContent =
                        "Unable to connect to server.";

                }


            } finally {

                // ------------------------------------------
                // RESET BUTTON
                // ------------------------------------------

                if (createPostBtn) {

                    createPostBtn.disabled =
                        false;

                    createPostBtn.textContent =
                        "Create Post";

                }

            }

        }
    );

}


// ==========================================
// LIKE / UNLIKE POST
// ==========================================

const handleLike = async (
    postId,
    isLiked,
    button
) => {

    // ------------------------------------------
    // CHECK POST ID
    // ------------------------------------------

    if (!postId) {

        console.error(
            "Post ID is missing."
        );

        return;
    }


    // ------------------------------------------
    // GET TOKEN
    // ------------------------------------------

    const token =
        getToken();


    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!token) {

        alert(
            "Please login to like a post."
        );

        return;
    }


    // ------------------------------------------
    // CHECK BUTTON
    // ------------------------------------------

    if (button) {

        button.disabled =
            true;

    }


    // ------------------------------------------
    // DETERMINE METHOD
    // ------------------------------------------

    const method =
        isLiked
            ? "DELETE"
            : "POST";


    try {

        // ------------------------------------------
        // SEND LIKE REQUEST
        // ------------------------------------------

        const response =
            await fetch(
                `${API_BASE_URL}/posts/${postId}/like`,
                {
                    method,

                    headers: {

                        "Authorization":
                            `Bearer ${token}`

                    }

                }
            );


        const data =
            await response.json();


        // ------------------------------------------
        // HANDLE ERROR
        // ------------------------------------------

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to update like."
            );

            return;
        }


        // ------------------------------------------
        // RELOAD POSTS
        // ------------------------------------------

        await loadPosts();


    } catch (error) {

        console.error(
            "Like error:",
            error
        );


        alert(
            "Unable to connect to server."
        );


    } finally {

        if (button) {

            button.disabled =
                false;

        }

    }

};


// ==========================================
// LIKE BUTTON EVENT
// ==========================================

document.addEventListener(
    "click",
    (event) => {

        const likeButton =
            event.target.closest(
                ".like-btn"
            );


        // ------------------------------------------
        // NOT LIKE BUTTON
        // ------------------------------------------

        if (!likeButton) {
            return;
        }


        // ------------------------------------------
        // GET DATA
        // ------------------------------------------

        const postId =
            likeButton.dataset.postId;


        const isLiked =
            likeButton.dataset.liked === "true";


        // ------------------------------------------
        // HANDLE LIKE
        // ------------------------------------------

        handleLike(
            postId,
            isLiked,
            likeButton
        );

    }
);


// ==========================================
// LOAD COMMENTS
// ==========================================

const loadComments = async (
    postId
) => {

    const commentsList =
        document.getElementById(
            `comments-list-${postId}`
        );


    // ------------------------------------------
    // CHECK ELEMENT
    // ------------------------------------------

    if (!commentsList) {
        return;
    }


    commentsList.innerHTML = `
        <p class="comments-loading">
            Loading comments...
        </p>
    `;


    try {

        // ------------------------------------------
        // FETCH COMMENTS
        // ------------------------------------------

        const response =
            await fetch(
                `${API_BASE_URL}/comments/${postId}`,
                {
                    method: "GET"
                }
            );


        const data =
            await response.json();


        // ------------------------------------------
        // HANDLE ERROR
        // ------------------------------------------

        if (!response.ok) {

            commentsList.innerHTML = `
                <p class="comments-error">
                    ${data.message ||
                    "Failed to load comments."}
                </p>
            `;

            return;
        }


        // ------------------------------------------
        // GET COMMENTS
        // ------------------------------------------

        const comments =
            data.comments || [];


        // ------------------------------------------
        // NO COMMENTS
        // ------------------------------------------

        if (comments.length === 0) {

            commentsList.innerHTML = `
                <p class="comments-empty">
                    No comments yet.
                    Be the first to comment!
                </p>
            `;

            return;
        }


        // ------------------------------------------
        // RENDER COMMENTS
        // ------------------------------------------

        commentsList.innerHTML =
            comments
                .map((comment) =>
                    createCommentHTML(comment)
                )
                .join("");


    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );


        commentsList.innerHTML = `
            <p class="comments-error">
                Unable to load comments.
            </p>
        `;

    }

};


// ==========================================
// CREATE COMMENT HTML
// ==========================================

const createCommentHTML = (
    comment
) => {

    // ------------------------------------------
    // CURRENT USER
    // ------------------------------------------

    const currentUser =
        getCurrentUser();


    const currentUserId =
        currentUser?._id;


    // ------------------------------------------
    // COMMENT AUTHOR
    // ------------------------------------------

    const authorName =
        comment.author?.name ||
        "Unknown User";


    const username =
        comment.author?.username ||
        "unknown";


    const commentAuthorId =
        comment.author?._id;


    // ------------------------------------------
    // CHECK COMMENT OWNERSHIP
    // ------------------------------------------

    const isOwner =
        currentUserId &&
        commentAuthorId &&
        currentUserId === commentAuthorId;


    // ------------------------------------------
    // OWNER ACTIONS
    // ------------------------------------------

    const ownerActions =
        isOwner
            ? `
                <div class="comment-actions">

                    <button
                        type="button"
                        class="comment-action-btn edit-comment-btn"
                        data-comment-id="${comment._id}"
                    >
                        Edit
                    </button>


                    <button
                        type="button"
                        class="comment-action-btn delete delete-comment-btn"
                        data-comment-id="${comment._id}"
                    >
                        Delete
                    </button>

                </div>
            `
            : "";


    // ------------------------------------------
    // RETURN COMMENT
    // ------------------------------------------

    return `
        <div
            class="comment-item"
            data-comment-id="${comment._id}"
        >

            <div class="comment-author">

                <strong>

                    ${authorName}

                    <span>
                        @${username}
                    </span>

                </strong>

            </div>


            <div class="comment-content">

                ${comment.content}

            </div>


            ${ownerActions}

        </div>
    `;

};


// ==========================================
// ADD COMMENT
// ==========================================

document.addEventListener(
    "submit",
    async (event) => {

        const commentForm =
            event.target.closest(
                ".comment-form"
            );


        // ------------------------------------------
        // NOT COMMENT FORM
        // ------------------------------------------

        if (!commentForm) {
            return;
        }


        event.preventDefault();


        // ------------------------------------------
        // GET DATA
        // ------------------------------------------

        const postId =
            commentForm.dataset.postId;


        const commentInput =
            commentForm.querySelector(
                ".comment-input"
            );


        const submitButton =
            commentForm.querySelector(
                ".comment-submit-btn"
            );


        const content =
            commentInput
                ?.value
                .trim() || "";


        // ------------------------------------------
        // CHECK LOGIN
        // ------------------------------------------

        const token =
            getToken();


        if (!token) {

            alert(
                "Please login to add a comment."
            );

            return;
        }


        // ------------------------------------------
        // CHECK CONTENT
        // ------------------------------------------

        if (!content) {
            return;
        }


        // ------------------------------------------
        // BUTTON LOADING
        // ------------------------------------------

        if (submitButton) {

            submitButton.disabled =
                true;

            submitButton.textContent =
                "Adding...";

        }


        try {

            // ------------------------------------------
            // SEND REQUEST
            // ------------------------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/comments/${postId}`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            content

                        })

                    }
                );


            const data =
                await response.json();


            // ------------------------------------------
            // HANDLE ERROR
            // ------------------------------------------

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to add comment."
                );

                return;
            }


            // ------------------------------------------
            // CLEAR INPUT
            // ------------------------------------------

            commentInput.value =
                "";


            // ------------------------------------------
            // RELOAD COMMENTS
            // ------------------------------------------

            await loadComments(
                postId
            );


            // ------------------------------------------
            // REFRESH POST COUNTS
            // ------------------------------------------

            await loadPosts();


        } catch (error) {

            console.error(
                "Add comment error:",
                error
            );


            alert(
                "Unable to connect to server."
            );


        } finally {

            if (submitButton) {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    "Add Comment";

            }

        }

    }
);


// ==========================================
// EDIT COMMENT
// ==========================================

document.addEventListener(
    "click",
    (event) => {

        const editButton =
            event.target.closest(
                ".edit-comment-btn"
            );


        // ------------------------------------------
        // NOT EDIT BUTTON
        // ------------------------------------------

        if (!editButton) {
            return;
        }


        const commentId =
            editButton.dataset.commentId;


        const commentItem =
            editButton.closest(
                ".comment-item"
            );


        if (!commentItem) {
            return;
        }


        const contentElement =
            commentItem.querySelector(
                ".comment-content"
            );


        const actionsElement =
            commentItem.querySelector(
                ".comment-actions"
            );


        if (!contentElement) {
            return;
        }


        // ------------------------------------------
        // GET OLD CONTENT
        // ------------------------------------------

        const oldContent =
            contentElement.textContent.trim();


        // ------------------------------------------
        // CREATE EDIT UI
        // ------------------------------------------

        contentElement.innerHTML = `
            <textarea
                class="edit-comment-input"
                rows="3"
                maxlength="500"
            >${oldContent}</textarea>


            <div class="edit-comment-actions">

                <button
                    type="button"
                    class="edit-save-btn"
                    data-comment-id="${commentId}"
                >
                    Save
                </button>


                <button
                    type="button"
                    class="edit-cancel-btn"
                    data-comment-id="${commentId}"
                >
                    Cancel
                </button>

            </div>
        `;


        // ------------------------------------------
        // HIDE OWNER ACTIONS
        // ------------------------------------------

        if (actionsElement) {

            actionsElement.style.display =
                "none";

        }

    }
);


// ==========================================
// SAVE EDITED COMMENT
// ==========================================

document.addEventListener(
    "click",
    async (event) => {

        const saveButton =
            event.target.closest(
                ".edit-save-btn"
            );


        // ------------------------------------------
        // NOT SAVE BUTTON
        // ------------------------------------------

        if (!saveButton) {
            return;
        }


        const commentId =
            saveButton.dataset.commentId;


        const commentItem =
            saveButton.closest(
                ".comment-item"
            );


        const input =
            commentItem?.querySelector(
                ".edit-comment-input"
            );


        if (!input) {
            return;
        }


        const content =
            input.value.trim();


        // ------------------------------------------
        // VALIDATE CONTENT
        // ------------------------------------------

        if (!content) {

            alert(
                "Comment cannot be empty."
            );

            return;
        }


        // ------------------------------------------
        // GET TOKEN
        // ------------------------------------------

        const token =
            getToken();


        if (!token) {

            alert(
                "Please login first."
            );

            return;
        }


        // ------------------------------------------
        // BUTTON LOADING
        // ------------------------------------------

        saveButton.disabled =
            true;

        saveButton.textContent =
            "Saving...";


        try {

            // ------------------------------------------
            // UPDATE COMMENT
            // ------------------------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/comments/${commentId}`,
                    {
                        method: "PUT",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`

                        },

                        body: JSON.stringify({

                            content

                        })

                    }
                );


            const data =
                await response.json();


            // ------------------------------------------
            // HANDLE ERROR
            // ------------------------------------------

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to update comment."
                );

                return;
            }


            console.log(
                "Comment updated:",
                data
            );


            // ------------------------------------------
            // RELOAD FEED
            // ------------------------------------------

            await loadPosts();


        } catch (error) {

            console.error(
                "Edit comment error:",
                error
            );


            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ==========================================
// CANCEL COMMENT EDIT
// ==========================================

document.addEventListener(
    "click",
    async (event) => {

        const cancelButton =
            event.target.closest(
                ".edit-cancel-btn"
            );


        // ------------------------------------------
        // NOT CANCEL BUTTON
        // ------------------------------------------

        if (!cancelButton) {
            return;
        }


        const commentItem =
            cancelButton.closest(
                ".comment-item"
            );


        if (!commentItem) {
            return;
        }


        // ------------------------------------------
        // FIND POST CARD
        // ------------------------------------------

        const postCard =
            commentItem.closest(
                ".post-card"
            );


        // ------------------------------------------
        // GET POST ID
        // ------------------------------------------

        const postId =
            postCard
                ?.dataset
                .postId;


        // ------------------------------------------
        // RELOAD COMMENTS
        // ------------------------------------------

        if (postId) {

            await loadComments(
                postId
            );

        }

    }
);


// ==========================================
// DELETE COMMENT
// ==========================================

document.addEventListener(
    "click",
    async (event) => {

        const deleteButton =
            event.target.closest(
                ".delete-comment-btn"
            );


        // ------------------------------------------
        // NOT DELETE BUTTON
        // ------------------------------------------

        if (!deleteButton) {
            return;
        }


        const commentId =
            deleteButton.dataset.commentId;


        // ------------------------------------------
        // CONFIRM DELETE
        // ------------------------------------------

        const confirmed =
            confirm(
                "Are you sure you want to delete this comment?"
            );


        if (!confirmed) {
            return;
        }


        // ------------------------------------------
        // GET TOKEN
        // ------------------------------------------

        const token =
            getToken();


        if (!token) {

            alert(
                "Please login first."
            );

            return;
        }


        // ------------------------------------------
        // BUTTON LOADING
        // ------------------------------------------

        deleteButton.disabled =
            true;

        deleteButton.textContent =
            "Deleting...";


        try {

            // ------------------------------------------
            // DELETE COMMENT
            // ------------------------------------------

            const response =
                await fetch(
                    `${API_BASE_URL}/comments/${commentId}`,
                    {
                        method: "DELETE",

                        headers: {

                            "Authorization":
                                `Bearer ${token}`

                        }

                    }
                );


            const data =
                await response.json();


            // ------------------------------------------
            // HANDLE ERROR
            // ------------------------------------------

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete comment."
                );

                return;
            }


            console.log(
                "Comment deleted:",
                data
            );


            // ------------------------------------------
            // REFRESH FEED
            // ------------------------------------------

            await loadPosts();


        } catch (error) {

            console.error(
                "Delete comment error:",
                error
            );


            alert(
                "Unable to connect to server."
            );

        }

    }
);


// ==========================================
// COMMENT TOGGLE
// ==========================================

document.addEventListener(
    "click",
    (event) => {

        const commentButton =
            event.target.closest(
                ".comment-toggle-btn"
            );


        if (!commentButton) {
            return;
        }


        const postId =
            commentButton.dataset.postId;


        const commentsSection =
            document.getElementById(
                `comments-${postId}`
            );


        if (!commentsSection) {
            return;
        }


        // ------------------------------------------
        // TOGGLE COMMENTS
        // ------------------------------------------

        const isHidden =
            commentsSection.style.display ===
            "none";


        if (isHidden) {

            commentsSection.style.display =
                "block";

            commentButton.textContent =
                "💬 Hide Comments";

        } else {

            commentsSection.style.display =
                "none";

            commentButton.textContent =
                "💬 Comment";

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            // ------------------------------------------
            // CLEAR AUTH DATA
            // ------------------------------------------

            localStorage.removeItem(
                "token"
            );


            localStorage.removeItem(
                "user"
            );


            // ------------------------------------------
            // REDIRECT LOGIN
            // ------------------------------------------

            window.location.href =
                "./login.html";

        }
    );

}


// ==========================================
// START APPLICATION
// ==========================================

// ------------------------------------------
// UPDATE AUTH UI
// ------------------------------------------

updateAuthUI();


// ------------------------------------------
// LOAD POSTS
// ------------------------------------------

loadPosts();