// Funtion will add a newly generated database to user's database projects
export async function update_user_database_project_list(database_id){
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

// Function will generate a new database when user clicks generate database button
export async function generate_new_database(){
    document.getElementById("create_new_database_project_button").addEventListener("click", async function(){
        // Event listener that waits until user clicks "Generate New Database" button
        const newDatabase = {
        database_name: "test",
        database_owner: "bocchi",
        database_elements:[],
        database_class_relationships: []
        }
        try {
            // Getting elements from user page to generate database
            // Generating a new database using a POST request
            const response = await fetch("http://localhost:3000/Databases", {
            method: "POST",
            body: JSON.stringify(newDatabase)
        })
        // When successfully created, getting the response
        const responseData = await response.json();
        console.log(responseData)
        // Adding newly generated user database to the user
        update_user_database_project_list(responseData.newDatabase.database_id)
        } catch (error) {
            console.error("Database could not be created:", error)
        }
    })
}

export function add_database_class(){
    // Keeps current count of how many classes there are
    let class_index = 1;
    //When button pressed, new class div will be generated
    document.getElementById("add_class_button").addEventListener("click", async function(){
        var database_classes_container = document.getElementById("database_classes_container");
        var new_database_container = document.createElement("div")
        new_database_container.classList.add("class-container")
        // Creates a new field for class input
        var class_name_input = document.createElement("input");
        class_name_input.type = "text";
        class_name_input.classList.add("form-control", "mb-2");
        class_name_input.placeholder = "Class Name";
        // Dynamically adds attributes
        var add_attribute_button = document.createElement("button");
        add_attribute_button.textContent = "Add Attribute";
        add_attribute_button.classList.add("btn", "btn-info", "mr-2");
        add_attribute_button.addEventListener("click", function() {
            addAttribute(new_database_container);

        });

        var remove_class_button = document.createElement("button");
        remove_class_button.textContent = "Remove Class";
        remove_class_button.classList.add("btn", "btn-danger"); // Add Bootstrap classes for styling
        remove_class_button.addEventListener("click", function() {
            new_database_container.remove(); // Remove the entire class container
        })
        new_database_container.appendChild(class_name_input);
        new_database_container.appendChild(add_attribute_button);
        new_database_container.appendChild(remove_class_button);

        database_classes_container.appendChild(new_database_container);

        // Increment class index after each addition
        class_index++;
    });

     // Function to add attributes
     function addAttribute(database_classes_container) {
        var attribute_name_input = document.createElement("input");
        attribute_name_input.type = "text";
        attribute_name_input.placeholder = "Attribute Name";

        var attribute_type_input = document.createElement("input");
        attribute_type_input.type = "text";
        attribute_type_input.placeholder = "Type";

        database_classes_container.appendChild(attribute_name_input);
        database_classes_container.appendChild(attribute_type_input);
    }
}

export async function sql_file(){
    // Function to generate the SQL statements from entered data
    function generateSQL() {
        var sqlContent = "";
        var classContainers = document.querySelectorAll(".class-container");
        classContainers.forEach(function(container) {
            var className = container.querySelector("input[type='text'][placeholder='Class Name']").value;
            sqlContent += "CREATE TABLE " + className + " (\n";
            var attributeInputs = container.querySelectorAll("input[type='text'][placeholder='Attribute Name']");
            attributeInputs.forEach(function(attributeInput, index) {
                var attributeName = attributeInput.value;
                var attributeTypeInput = container.querySelectorAll("input[type='text'][placeholder='Type']")[index];
                var attributeType = attributeTypeInput.value;
                
                // Convert attribute type to lowercase
                attributeType = attributeType.toLowerCase();

                // Convert "String" to "VARCHAR"
                if (attributeType === "string") {
                    attributeType = "varchar(255)";
                }
                
                sqlContent += "\t" + attributeName + " " + attributeType;
                if (index < attributeInputs.length - 1) {
                    sqlContent += ",\n";
                } else {
                    sqlContent += "\n";
                }
            });
            sqlContent += ");\n\n";
        });
        return sqlContent;
    }

    // Function to create/download the SQL file
    document.getElementById("create_sql_file").addEventListener("click", function() {
        var sqlContent = generateSQL();
        var projectName = document.getElementById("database_project_name").value;
        var blob = new Blob([sqlContent], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = projectName + ".sql";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.getElementById("create_sql_file").style.display = "none";
    });
}
