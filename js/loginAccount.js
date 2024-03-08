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
                    window.location.href = '../html/user.html';
            }
                        
        } catch (error) {
            console.error("FETCH not working", error)           
        }
    });
}