// FUNCTION IS NOT WORKING YET
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