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

export async function uml_diagram(){
    // Function to generate UML diagram from user input
    function generateUMLDiagram() {
        // Initialize the UML diagram string
        let umlDiagram = '';

        // Get all class containers
        const classContainers = document.querySelectorAll(".class-container");
    
        // Loop through each class container
        classContainers.forEach((container, index) => {
            const classNameInput = container.querySelector("input[type='text'][placeholder='Class Name']");
            const className = classNameInput ? classNameInput.value : `Class${index + 1}`;

            // Calculate the y-coordinate for class rectangle and attributes
            const classRectY = 10 + index * 150;
            const attrRectY = 40 + index * 150;

            // Construct SVG elements for class rectangle and text
            umlDiagram += `
                <!-- Draw rectangle for class -->
                <rect x="10" y="${classRectY}" width="150" height="30" fill="#f0f0f0" stroke="#000000" stroke-width="1"/>
                <!-- Class name -->
                <text x="85" y="${classRectY + 22}" font-family="Arial" font-size="14" text-anchor="middle" alignment-baseline="middle">${className}</text>
            `;
        
            // Get all attribute inputs within the current class container
            const attributeInputs = container.querySelectorAll("input[type='text'][placeholder='Attribute Name']");

            // Draw the rectangle for attributes
            umlDiagram += `
                <rect x="10" y="${attrRectY}" width="150" height="${20 + attributeInputs.length * 25}" fill="#f0f0f0" stroke="#000000" stroke-width="1"/>
            `;

            // Loop through each attribute input
            attributeInputs.forEach((attributeInput, attrIndex) => {
                const attributeName = attributeInput.value.trim(); // Trim any leading/trailing whitespace
                if (attributeName !== '') {
                    const attributeTypeInput = container.querySelectorAll("input[type='text'][placeholder='Type']")[attrIndex];
                    const attributeType = attributeTypeInput ? attributeTypeInput.value.trim() : '';

                    // Construct SVG elements for attribute text
                    umlDiagram += `
                        <!-- Attribute ${attrIndex + 1} -->
                        <text x="20" y="${attrRectY + 20 + attrIndex * 25}" font-family="Arial" font-size="12" alignment-baseline="middle">+ ${attributeName} : ${attributeType}</text>
                    `;
                }
            });
        });

        // Construct the complete SVG code for the UML diagram
        const svgCode = `<svg width="300" height="${20 + classContainers.length * 150}">${umlDiagram}</svg>`;

        // Get the uml-diagram div and insert the SVG code
        const umlDiagramDiv = document.getElementById("uml-diagram");
        if (umlDiagramDiv) {
            umlDiagramDiv.innerHTML = svgCode;
        }
    }

    // Call generateUMLDiagram function when the user clicks the "Create UML" button
    document.getElementById("create_uml_diagram").addEventListener("click", function() {
        generateUMLDiagram();
    });
}

export async function projectName() {
    // Function to update the project name
    function updateProjectName() {
        const projectNameInput = document.getElementById("database_project_name");
         // Default to "Project Name" if input is empty
        const projectName = projectNameInput ? projectNameInput.value : "Project Name";
        const projectNameElement = document.getElementById("project_name");
        if (projectNameElement) {
            projectNameElement.textContent = projectName;
        }
    }

    // Call updateProjectName function when the user changes the project name input
    document.getElementById("database_project_name").addEventListener("input", function() {
        updateProjectName();
    });
}
