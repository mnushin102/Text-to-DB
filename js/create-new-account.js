// Function checks if email is in use
// If not in use, creates a new account with user provided email and password
// VERY similar to login function
export function create_account() {
    // Event listener, when button is pressed, this listener will be triggered
    document.getElementById("create_account").addEventListener("click", async function(){
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
            const resp = await fetch(`http://localhost:3000/Users/email/${encodeURIComponent(userInfo.email)}`, {
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            });
            if (resp.ok){
                // User is found and now retrieving the user's data
                responseData = await resp.json();
                userFound = true;
            };

            // If email already in use, will not create account
            if (userFound){
                alert("Email already used!")
            }
            // If email not in use, will create account
            else{
               try {
                // Making the POST request with user's input information
                const resp = await fetch(`http://localhost:3000/Users`, {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                // Sends the userInfo in json format so it can be stored correctly
                body: JSON.stringify(userInfo)
            });
            if (resp.ok){
                alert("USER CREATED! YOU CAN NOW LOG IN!");
            }
               } catch (error) {
                console.error("POST not working",error);
               } 
            }
            
                        
        } catch (error) {
            console.error("FETCH not working", error);         
        }
    });
}