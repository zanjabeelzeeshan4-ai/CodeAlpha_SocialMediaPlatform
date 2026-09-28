// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL =
    "http://localhost:5000/api";


// ==========================================
// GET USERNAME FROM URL
// ==========================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const username =
    urlParams.get("username");


// ==========================================
// DOM ELEMENTS
// ==========================================

const publicProfileMessage =
    document.getElementById(
        "publicProfileMessage"
    );


const publicProfileImage =
    document.getElementById(
        "publicProfileImage"
    );


const publicProfileName =
    document.getElementById(
        "publicProfileName"
    );


const publicProfileUsername =
    document.getElementById(
        "publicProfileUsername"
    );


const publicProfileBio =
    document.getElementById(
        "publicProfileBio"
    );


const publicFollowersCount =
    document.getElementById(
        "publicFollowersCount"
    );


const publicFollowingCount =
    document.getElementById(
        "publicFollowingCount"
    );


const followBtn =
    document.getElementById(
        "followBtn"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================
// PROFILE USER
// ==========================================

let profileUser = null;


// ==========================================
// LOAD PUBLIC PROFILE
// ==========================================

const loadPublicProfile = async () => {

    if (!username) {

        publicProfileMessage.textContent =
            "Username not found.";

        return;
    }


    try {

        const response = await fetch(
            `${API_BASE_URL}/users/profile/${encodeURIComponent(username)}`
        );


        const data =
            await response.json();


        if (!response.ok) {

            publicProfileMessage.textContent =
                data.message ||
                "Profile not found.";

            return;
        }


        profileUser =
            data.user;


        // ------------------------------------------
        // DISPLAY PROFILE
        // ------------------------------------------

        publicProfileName.textContent =
            profileUser.name;


        publicProfileUsername.textContent =
            `@${profileUser.username}`;


        publicProfileBio.textContent =
            profileUser.bio ||
            "No bio added yet.";


        publicFollowersCount.textContent =
            profileUser.followers?.length || 0;


        publicFollowingCount.textContent =
            profileUser.following?.length || 0;


        // ------------------------------------------
        // PROFILE IMAGE
        // ------------------------------------------

        if (profileUser.profileImage) {

            publicProfileImage.innerHTML = `
                <img
                    src="${profileUser.profileImage}"
                    alt="${profileUser.name}"
                    class="profile-image"
                >
            `;

        } else {

            publicProfileImage.innerHTML = `
                <div class="profile-image-placeholder">
                    ${profileUser.name
                        .charAt(0)
                        .toUpperCase()}
                </div>
            `;
        }


        // ------------------------------------------
        // FOLLOW STATE
        // ------------------------------------------

        updateFollowButton();

    } catch (error) {

        console.error(
            "Load public profile error:",
            error
        );


        publicProfileMessage.textContent =
            "Unable to connect to server.";
    }

};


// ==========================================
// UPDATE FOLLOW BUTTON
// ==========================================

const updateFollowButton = () => {

    const currentUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!currentUser) {

        followBtn.textContent =
            "Login to Follow";

        followBtn.disabled = false;

        return;
    }


    // ------------------------------------------
    // OWN PROFILE
    // ------------------------------------------

    if (
        currentUser._id === profileUser._id
    ) {

        followBtn.style.display =
            "none";

        return;
    }


    // ------------------------------------------
    // CHECK FOLLOWING
    // ------------------------------------------

    const isFollowing =
        profileUser.followers?.some(
            (follower) => {

                const followerId =
                    typeof follower === "object"
                        ? follower._id
                        : follower;

                return followerId === currentUser._id;
            }
        );


    if (isFollowing) {

        followBtn.textContent =
            "Following";

        followBtn.classList.add(
            "following"
        );

    } else {

        followBtn.textContent =
            "Follow";

        followBtn.classList.remove(
            "following"
        );
    }

};


// ==========================================
// FOLLOW / UNFOLLOW
// ==========================================

if (followBtn) {

    followBtn.addEventListener(
        "click",
        async () => {

            const token =
                localStorage.getItem("token");


            if (!token) {

                window.location.href =
                    "./login.html";

                return;
            }


            if (!profileUser) {
                return;
            }


            const currentUser =
                JSON.parse(
                    localStorage.getItem("user")
                );


            const isFollowing =
                profileUser.followers?.some(
                    (follower) => {

                        const followerId =
                            typeof follower === "object"
                                ? follower._id
                                : follower;

                        return followerId === currentUser._id;
                    }
                );


            const method =
                isFollowing
                    ? "DELETE"
                    : "POST";


            followBtn.disabled = true;

            followBtn.textContent =
                isFollowing
                    ? "Unfollowing..."
                    : "Following...";


            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/users/${profileUser._id}/follow`,
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


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Unable to update follow."
                    );

                    updateFollowButton();

                    return;
                }


                // ------------------------------------------
                // UPDATE LOCAL PROFILE DATA
                // ------------------------------------------

                profileUser =
                    data.user;


                // ------------------------------------------
                // UPDATE UI
                // ------------------------------------------

                publicFollowersCount.textContent =
                    profileUser.followers?.length || 0;


                updateFollowButton();


            } catch (error) {

                console.error(
                    "Follow error:",
                    error
                );


                alert(
                    "Unable to connect to server."
                );


                updateFollowButton();

            } finally {

                followBtn.disabled =
                    false;
            }

        }
    );

}


// ==========================================
// LOGOUT
// ==========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "./login.html";

        }
    );

}


// ==========================================
// START
// ==========================================

loadPublicProfile();