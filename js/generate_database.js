// Funtion will add a newly generated database to user's database projects
async function update_user_database_project_list(database_id){
    try {
        //Getting the current user's JWT to use for the GET request
        const token = localStorage.getItem("accessToken");

        // When a database is generated, id will be stored with a user
        const newDatabaseProject = {
            database_projects: database_id // Generated DB's ID
        }
        // Making a GET request using the user's cookies
        const response = await fetch("http://localhost:3000/Users/update_database_project_list", {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDatabaseProject)
        })
    }catch(error){
        console.error("Adding database to user's projects unsuccessful:", error);
    }
}

 // Function retrieves database attributes from HTML
 function retrieve_db_attributes() {
    var entries = [];
    var classContainers = document.getElementsByClassName("class-container");

    // Iterates over each class container
    for (var i = 0; i < classContainers.length; i++) {
        var classContainer = classContainers[i];
        var corrected_class = classContainer.querySelector("input[type='text']").value;
        //corrected_class = convention_checker(spelling_correction(corrected_class),"class")
        var entry = {
            class_name: corrected_class,
            attribute_list: []
        };

        var attributeInputs = classContainer.querySelectorAll("input[type='text'][placeholder='Attribute Name']");

        // Iterate over attribute inputs within each class container
        attributeInputs.forEach(function(input) {
            var corrected_attribute = input.value
            //corrected_attribute = convention_checker(spelling_correction(input.value), "attribute");
            entry.attribute_list.push({
                attribute: corrected_attribute,
                type: input.nextElementSibling.value // Assuming type input follows the attribute name input
            });
        });
        //entries.push(entry);
        // Add the entry only if the class_name is not empty
        if (entry.class_name.trim() !== "") {
            entries.push(entry);
        }
    }
    return entries;
}

// Function will generate a new database when user clicks generate database button
export async function generate_new_database(){
    // Event listener that waits until user clicks "Generate New Database" button
    document.getElementById("create_new_database_project_button").addEventListener("click", async function(){
        // Fetching the user who created the database
        try{
            //Getting the current user's JWT to use for the GET request
            const token = localStorage.getItem("accessToken");
            // Getting the user's profile picture to display
            const user_fetch = await fetch("http://localhost:3000/Users/user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            })
            const data = await user_fetch.json();
            const db_elements = retrieve_db_attributes();
            // Creating Database object to store in Database Project collection
            const newDatabase = {
            database_name: document.getElementById("database_project_name").value,
            database_owner: data.user.email,
            database_elements: db_elements,
            database_class_relationships: []
            }
            // Getting elements from user page to generate database
            // Generating a new database using a POST request
            const response = await fetch("http://localhost:3000/Databases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newDatabase)
        });
        // When successfully created, getting the response
        const responseData = await response.json();
        // Adding newly generated user database to the user
        update_user_database_project_list(responseData.database_id);

        // Updates stored projects in the browser's local storage
        storing_database_projects();
        alert("Database Created")
        } catch (error) {
            console.error("Database could not be created:", error);
        }
    })
}

async function storing_database_projects(){
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
