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

 // Function retrieves database attributes from HTML
 function retrieve_db_attributes() {
    var entries = [];
    var classContainers = document.getElementsByClassName("class-container");

    // Iterates over each class container
    for (var i = 0; i < classContainers.length; i++) {
        var classContainer = classContainers[i];
        var entry = {
            class_name: classContainer.querySelector("input[type='text']").value,
            attribute_list: []
        };

        var attributeInputs = classContainer.querySelectorAll("input[type='text'][placeholder='Attribute Name']");

        // Iterate over attribute inputs within each class container
        attributeInputs.forEach(function(input) {
            entry.attribute_list.push({
                attribute: input.value,
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
        })
        // When successfully created, getting the response
        const responseData = await response.json();
        // Adding newly generated user database to the user
        update_user_database_project_list(responseData.database_id)
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
    document.getElementById("create_sql_file").addEventListener("click", function() {
        // Get the project name
        var projectName = document.getElementById("database_project_name").value;

        // Create a new element to display the file name
        var fileNameElement = document.createElement("div");
        fileNameElement.textContent = projectName + ".sql";

        // Center the file name
        fileNameElement.style.textAlign = "center";

        // Add rectangle styling to the created files
        fileNameElement.style.border = "1px solid black";
        fileNameElement.style.padding = "5px";
        fileNameElement.style.margin = "5px 0";
        fileNameElement.style.backgroundColor = "white";

        // Append the file name to the export file pop-up menu
        var fileExportContainer = document.getElementById("file_export_container");
        fileExportContainer.appendChild(fileNameElement);
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

export async function file_import(){
    
}

export async function file_export(){
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
    
    // Function to download all SQL files and display their names
    document.getElementById("file_export_button").addEventListener("click", function() {
        // Get all file names
        var fileNames = [];
        var fileNameElements = document.querySelectorAll("#file_export_container > div:not(:first-child)");
        fileNameElements.forEach(function(element) {
            fileNames.push(element.textContent);
        });

        // Download each file
        fileNames.forEach(function(fileName) {
            var blob = new Blob([generateSQL()], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        });
    });

    // Add text to the export file pop-up menu
    var fileExportContainer = document.getElementById("file_export_container");
    var filesText = document.createElement("div");
    filesText.textContent = "Created Files";
    filesText.style.textAlign = "center";

    // Add margin to separate the text from file names
    filesText.style.marginBottom = "5px";
    fileExportContainer.insertBefore(filesText, fileExportContainer.firstChild);
}
