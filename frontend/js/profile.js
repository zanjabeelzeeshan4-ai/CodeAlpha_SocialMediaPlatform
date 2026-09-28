// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL =
    "http://localhost:5000/api";


// ==========================================
// DOM ELEMENTS
// ==========================================

const profileMessage =
    document.getElementById(
        "profileMessage"
    );


const profileImageContainer =
    document.getElementById(
        "profileImageContainer"
    );


const profileName =
    document.getElementById(
        "profileName"
    );


const profileUsername =
    document.getElementById(
        "profileUsername"
    );


const profileBio =
    document.getElementById(
        "profileBio"
    );


const followersCount =
    document.getElementById(
        "followersCount"
    );


const followingCount =
    document.getElementById(
        "followingCount"
    );


const profileForm =
    document.getElementById(
        "profileForm"
    );


const profileNameInput =
    document.getElementById(
        "profileNameInput"
    );


const profileBioInput =
    document.getElementById(
        "profileBioInput"
    );


const profileImageInput =
    document.getElementById(
        "profileImageInput"
    );


const updateProfileBtn =
    document.getElementById(
        "updateProfileBtn"
    );


const updateProfileMessage =
    document.getElementById(
        "updateProfileMessage"
    );


const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// ==========================================
// LOAD MY PROFILE
// ==========================================

const loadMyProfile = async () => {

    const token =
        localStorage.getItem("token");


    // ------------------------------------------
    // CHECK LOGIN
    // ------------------------------------------

    if (!token) {

        window.location.href =
            "./login.html";

        return;
    }


    profileMessage.textContent =
        "Loading profile...";


    try {

        // ------------------------------------------
        // GET CURRENT USER
        // ------------------------------------------

        const response = await fetch(
            `${API_BASE_URL}/auth/me`,
            {
                method: "GET",

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

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            window.location.href =
                "./login.html";

            return;
        }


        // ------------------------------------------
        // USER DATA
        // ------------------------------------------

        const user =
            data.user;


        // ------------------------------------------
        // DISPLAY PROFILE
        // ------------------------------------------

        profileName.textContent =
            user.name;


        profileUsername.textContent =
            `@${user.username}`;


        profileBio.textContent =
            user.bio ||
            "No bio added yet.";


        followersCount.textContent =
            user.followers?.length || 0;


        followingCount.textContent =
            user.following?.length || 0;


        // ------------------------------------------
        // PROFILE IMAGE
        // ------------------------------------------

        if (user.profileImage) {

            profileImageContainer.innerHTML = `
                <img
                    src="${user.profileImage}"
                    alt="${user.name}"
                    class="profile-image"
                >
            `;

        } else {

            profileImageContainer.innerHTML = `
                <div
                    class="profile-image-placeholder"
                >
                    ${user.name
                        .charAt(0)
                        .toUpperCase()}
                </div>
            `;
        }


        // ------------------------------------------
        // FILL EDIT FORM
        // ------------------------------------------

        profileNameInput.value =
            user.name || "";


        profileBioInput.value =
            user.bio || "";


        profileImageInput.value =
            user.profileImage || "";


        profileMessage.textContent = "";


        // ------------------------------------------
        // UPDATE LOCAL STORAGE
        // ------------------------------------------

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );


        profileMessage.textContent =
            "Unable to connect to server.";
    }

};


// ==========================================
// UPDATE PROFILE
// ==========================================

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const token =
                localStorage.getItem("token");


            if (!token) {

                window.location.href =
                    "./login.html";

                return;
            }


            // ------------------------------------------
            // GET VALUES
            // ------------------------------------------

            const name =
                profileNameInput.value.trim();


            const bio =
                profileBioInput.value.trim();


            const profileImage =
                profileImageInput.value.trim();


            // ------------------------------------------
            // VALIDATION
            // ------------------------------------------

            if (!name) {

                updateProfileMessage.textContent =
                    "Name is required.";

                return;
            }


            // ------------------------------------------
            // LOADING STATE
            // ------------------------------------------

            updateProfileBtn.disabled =
                true;

            updateProfileBtn.textContent =
                "Updating...";


            updateProfileMessage.textContent =
                "Updating your profile...";


            try {

                // ------------------------------------------
                // UPDATE API
                // ------------------------------------------

                const response = await fetch(
                    `${API_BASE_URL}/users/profile`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            name,
                            bio,
                            profileImage
                        })
                    }
                );


                const data =
                    await response.json();


                // ------------------------------------------
                // HANDLE ERROR
                // ------------------------------------------

                if (!response.ok) {

                    updateProfileMessage.textContent =
                        data.message ||
                        "Failed to update profile.";

                    return;
                }


                // ------------------------------------------
                // SUCCESS
                // ------------------------------------------

                console.log(
                    "Profile updated:",
                    data
                );


                updateProfileMessage.textContent =
                    "Profile updated successfully!";


                // ------------------------------------------
                // RELOAD PROFILE
                // ------------------------------------------

                await loadMyProfile();


            } catch (error) {

                console.error(
                    "Update profile error:",
                    error
                );


                updateProfileMessage.textContent =
                    "Unable to connect to server.";


            } finally {

                updateProfileBtn.disabled =
                    false;

                updateProfileBtn.textContent =
                    "Update Profile";
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

loadMyProfile();