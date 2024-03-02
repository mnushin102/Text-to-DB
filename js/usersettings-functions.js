export async function display_collaborators(){
    try {
        // Making a GET request using the user's cookies
        const response = await fetch("/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            // Check if the response is NOT successful
        if (!response.ok) {
            // Parse the JSON response body
            throw new Error("USER RETRIEVED FAILED");
        }

        const data = await response.json();
        console.log("SUCCESS");
        
    } catch (error) {
        console.error("USER RETIREVE NOT WORKING",error)
    }
}