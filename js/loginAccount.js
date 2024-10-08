// Function verifies login, if all information correct, then moves to user's page
export function login() {
    // Event listener, when button is pressed, this listener will be triggered
    document.getElementById("login").addEventListener("click", async function(){
        // Email and password retrieved from html textfields
        const email_address = document.getElementById("email_username").value;
        const password = document.getElementById("password").value;
        // Updated if user is found
        let userFound = false;
        let responseData = null;

        // Saving user's inputs into an object to use later
        const userInfo = {
            email:email_address,    
            password:password
        };

        try {
            // Fetching the user using HTTPS request given email as a parameter
            const resp = await fetch(`http://localhost:3000/Users/login`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(userInfo)
            });
            if (resp.ok){
                // User is found and now retrieving the user's data
                responseData = await resp.json();
                const accessToken = responseData.accessToken;

                // Storing JWT in browser's local storage to reference it for later use
                localStorage.setItem("accessToken",accessToken);
                userFound = true;
            }
            else{
                const errorMsg = await resp.json();
                alert(errorMsg.message);
                return;
            }

            if (userFound){
                    // If User is correctly authenticated, user will be able to go to the user page
                    // Authentication is handled on the server side
                    storing_database_projects()
                    setTimeout(function(){
                        window.location.href = '../html/user.html';
                    }, 250);
            }
        } catch (error) {
            console.error("FETCH not working", error);
        }
    });
}

// Logs out and clears local storage so it doesn't interfere with next user
export function logout(){
    window.location.href = 'login.html';
    localStorage.clear();
}

// Funciton updates the browser's localStorage to have
// a user's database project list readily available
export async function storing_database_projects(){
    const accessToken = localStorage.getItem("accessToken")
    try{
        // Fetching the user using HTTPS request given email as a parameter
        const resp = await fetch(`http://localhost:3000/Users/return_db_projects`, {
            method:"GET",
            headers:{
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const responseData = await resp.json()
        localStorage.setItem("database_projects",JSON.stringify(responseData.database_projects));
        }catch(error){
            console.error("Error Fetching Database Projects", error);
        }
}