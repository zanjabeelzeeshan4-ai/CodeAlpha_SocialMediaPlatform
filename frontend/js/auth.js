// ==========================================
// REDIRECT IF ALREADY LOGGED IN
// ==========================================

const existingToken =
    localStorage.getItem("token");


if (
    existingToken &&
    (
        window.location.pathname.endsWith(
            "login.html"
        ) ||
        window.location.pathname.endsWith(
            "register.html"
        )
    )
) {

    window.location.href =
        "./index.html";
}
// ==========================================
// API BASE URL
// ==========================================

const API_BASE_URL = "http://localhost:5000/api";


// ==========================================
// LOGIN FORM
// ==========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ------------------------------------------
            // GET FORM VALUES
            // ------------------------------------------

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;


            // ------------------------------------------
            // MESSAGE ELEMENT
            // ------------------------------------------

            const authMessage =
                document.getElementById("authMessage");


            authMessage.textContent =
                "Logging in...";


            // ------------------------------------------
            // SEND LOGIN REQUEST
            // ------------------------------------------

            try {

                const response = await fetch(
                    `${API_BASE_URL}/auth/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })
                    }
                );


                const data =
                    await response.json();


                // ------------------------------------------
                // HANDLE ERROR
                // ------------------------------------------

                if (!response.ok) {

                    authMessage.textContent =
                        data.message ||
                        "Login failed";

                    return;
                }


                // ------------------------------------------
                // LOGIN SUCCESS
                // ------------------------------------------

                console.log(
                    "Login successful:",
                    data
                );


                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                authMessage.textContent =
                    "Login successful!";


                // ------------------------------------------
                // REDIRECT TO HOME
                // ------------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "./index.html";

                }, 1000);


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                authMessage.textContent =
                    "Unable to connect to server";
            }

        }
    );

}


// ==========================================
// REGISTER FORM
// ==========================================

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ------------------------------------------
            // GET FORM VALUES
            // ------------------------------------------

            const name =
                document.getElementById("name").value.trim();

            const username =
                document.getElementById("username").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;


            // ------------------------------------------
            // MESSAGE ELEMENT
            // ------------------------------------------

            const authMessage =
                document.getElementById("authMessage");


            authMessage.textContent =
                "Creating your account...";


            // ------------------------------------------
            // SEND REQUEST TO BACKEND
            // ------------------------------------------

            try {

                const response = await fetch(
                    `${API_BASE_URL}/auth/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            username,
                            email,
                            password
                        })
                    }
                );


                const data =
                    await response.json();


                // ------------------------------------------
                // HANDLE ERROR
                // ------------------------------------------

                if (!response.ok) {

                    authMessage.textContent =
                        data.message ||
                        "Registration failed";

                    return;
                }


                // ------------------------------------------
                // REGISTRATION SUCCESS
                // ------------------------------------------

                console.log(
                    "Registration successful:",
                    data
                );


                // Save JWT token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save user information
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );


                authMessage.textContent =
                    "Account created successfully!";


                // ------------------------------------------
                // REDIRECT TO HOME
                // ------------------------------------------

                setTimeout(() => {

                    window.location.href =
                        "./index.html";

                }, 1000);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                authMessage.textContent =
                    "Unable to connect to server";
            }

        }
    );

}