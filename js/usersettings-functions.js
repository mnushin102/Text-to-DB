// Need to Fix to display collaborators when available
export async function display_collaborators(){
    try {
        //Getting the current user's JWT to use for the GET request
        const token = localStorage.getItem("accessToken");
        // Making a GET request using the user's cookies
        const response = await fetch("http://localhost:3000/Users/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            // Check if the response is NOT successful
        if (!response.ok) {
            // Parse the JSON response body
            throw new Error("USER RETRIEVED FAILED");
        }

        // Gets the data from GET request
        const data = await response.json();
        // Displaying the collaborators here
        // This is the div that will display in the html
        const collaborator_div = document.getElementById('collaborators-list');
        // Clearing if previously called
        collaborator_div.innerHTML = ""
        // NEED TO CHANGE HERE, BUT NEED TO ADD COLLABORATORS
        const test = document.createElement("div")
        collaborator_div.textContent = data.user.email
        collaborator_div.appendChild(test)
        
    } catch (error) {
        console.error("USER RETIREVE NOT WORKING",error)
    }
}
// Function updates the user's profile picture based
// on what the user used as input
export async function access_profile_picture(){

    // Waiting for user to click "Update Profile Picture" Button
    document.getElementById("uploadProfilePictureButton").addEventListener("click", async function(){
        try{
            // Using the JWT to access the user's information
            const token = localStorage.getItem('accessToken');
            const profilePictureInput = document.getElementById("profilePictureInput");

             // Check if a file was uploaded
             if (profilePictureInput.files.length === 0) {
                console.error('No file selected');
                return;
            }
            
            // Get the selected file
            const file = profilePictureInput.files[0];

            // Creating a way to pass information to find
            // and replace user's profile picture
            const formData = new FormData();
            formData.append('profilePicture', file);
            
            // Making a POST request and adding the new profile picture
            const response = await fetch('http://localhost:3000/Users/uploadProfilePicture', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            // Profile Picture updated successfully
            if (response.ok) {
                console.log('Profile picture uploaded successfully');
            // Some kind of error thrown by server
            } else {
                console.error('Failed to upload profile picture');
            }
        }catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    })
};

export async function getUserProfilePicture(){
    try {
        //Getting the current user's JWT to use for the GET request
        const token = localStorage.getItem("accessToken");
        // Getting the user's profile picture to display
        const response = await fetch("http://localhost:3000/Users/user", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        
        // Check if the response is successful and contains the profile picture path
        if (response.ok && data.user.profile_picture) {
            // Finding where the profile picture will be placed on the HTML
            const profilePictureImg = document.getElementById('user_profile_picture');
            // Setting the path of where the profile picture is stored (in the img/ folder)
            profilePictureImg.src = "../"+data.user.profile_picture;
        // Errors thrown if unable to get profile picture
        } else {
            console.error('Failed to fetch profile picture');
        }
    } catch (error) {
        console.error('Error fetching profile picture:', error);
    }
}
