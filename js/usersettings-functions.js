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
export async function upload_profile_picture(){

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

export async function deleteCurrentUser(){

    // Event listener that waits until user clicks "Delete Account button!"
    document.getElementById("confirm_delete_account_button").addEventListener("click", async function(){

    try {
        //Getting the current user's JWT to use for the GET request
        const token = localStorage.getItem("accessToken");
        // Getting the user's profile picture to display
        const response = await fetch("http://localhost:3000/Users", {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const data = await response.json();
        // Using Bootstrap's Modal element to create a nice popup
        var deletedUserModal = new bootstrap.Modal(document.getElementById('delete_account_confirmation_popup'));
        deletedUserModal.show();
        // Gives user time to read popup presented (3 seconds)
        setTimeout(function(){
            window.location.href = '../html/login.html';
        }, 3000)
        
    } catch (error) {
      console.error("Error deleting user:", error)  
    }
});
}


export async function updateUserInfo(){
    // Event listener that waits until user clicks "Confirm Update" Button
    document.getElementById("update_bio_button").addEventListener("click", async function(){
        try {
            event.preventDefault();
            // Getting values inputted by user
            const user = {}
            if (document.getElementById("firstname").value != null){
                Object.assign(user,{first_name : document.getElementById("firstname").value});
            }

            if (document.getElementById("lastname").value != null){
                Object.assign(user,{last_name : document.getElementById("lastname").value});
            }

            if (document.getElementById("email").value != null){
                Object.assign(user,{email : document.getElementById("email").value});
            }

            if (document.getElementById("phonenumber").value != null){
                Object.assign(user,{phone : document.getElementById("phonenumber").value});
            }

            if (document.getElementById("bio").value != null){
                Object.assign(user,{bio : document.getElementById("bio").value});
            }
            if (Object.keys(user).length != 0){
                //Getting the current user's JWT to use for the GET request
                const token = localStorage.getItem("accessToken");
                // Getting the user's profile picture to display
                const response = await fetch("http://localhost:3000/Users/update_profile", {
                    method: "PATCH",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(user)
                });
            }
            else{alert("NO INPUT GIVEN!")}
        } catch (error) {
            console.error("Error updating user biography:",error)
        }
    });
}
