// WIll update currently stored db projects when a new database is generated
import { storing_database_projects } from "./loginAccount.js"
// Define an array to store project names for which SQL files and UML diagrams have been created
let createdProjects = [];

// Function to check if a project has already been created
function isProjectCreated(projectName) {
    return createdProjects.hasOwnProperty(projectName);
}

// Function to disable the buttons and inputs within the modal body except for the project name
function disableModalBody() {
    const modalBody = document.querySelector("#createNewDatabaseModal .modal-body");
    const buttons = modalBody.querySelectorAll("button");
    const inputs = modalBody.querySelectorAll("input");

    buttons.forEach(button => {
        button.disabled = true;
    });

    inputs.forEach(input => {
        if (input.id !== "database_project_name") {
            input.disabled = true;
        }
    });
}

// Function to enable the buttons and inputs within the modal body except for the project name
function enableModalBody() {
    const modalBody = document.querySelector("#createNewDatabaseModal .modal-body");
    const buttons = modalBody.querySelectorAll("button");
    const inputs = modalBody.querySelectorAll("input");

    buttons.forEach(button => {
        button.disabled = false;
    });

    inputs.forEach(input => {
        input.disabled = false;
    });
}


export function add_database_class(){
    // Keeps current count of how many classes there are
    let class_index = 1;
    //When button pressed, new class div will be generated
    document.getElementById("add_class_button").addEventListener("click", async function(){
        var database_classes_container = document.getElementById("database_classes_container");
        var new_database_container = document.createElement("div")
        new_database_container.classList.add("class-container")

        // Adds padding to the top of each class container
        new_database_container.style.paddingTop = "20px";

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
    
    document.getElementById("create_sql_file").addEventListener("click", function() {
        // Get the project name
        var projectName = document.getElementById("database_project_name").value;

        // Check if SQL file for this project has already been created
        if (isProjectCreated(projectName) && createdProjects[projectName].sql) {
            alert("The sql file has already been created for this project");
            return;
        }

        // Generate SQL content
        var sqlContent = generateSQL();

        // Store SQL content for the project
        if (!createdProjects.hasOwnProperty(projectName)) {
            createdProjects[projectName] = {};
        }
        createdProjects[projectName].sqlContent = sqlContent;
        createdProjects[projectName].sql = true;

        // Update UI
        var fileNameElement = document.createElement("div");
        fileNameElement.textContent = projectName + ".sql";
        fileNameElement.style.textAlign = "center";
        fileNameElement.style.border = "1px solid black";
        fileNameElement.style.padding = "5px";
        fileNameElement.style.margin = "5px 0";
        fileNameElement.style.backgroundColor = "white";

        var fileExportContainer = document.getElementById("file_export_container");
        fileExportContainer.appendChild(fileNameElement);

        var projectNameElement = document.getElementById(`project_name_${Object.keys(createdProjects).length}`);
        if (projectNameElement) {
            projectNameElement.textContent = projectName;
        }

        alert("The sql file was created successfully!\n\nClose this pop up menu and click on the 'Export File' button to see the file");
    });
}

export async function uml_diagram(){
    // Function to generate UML diagram from user input
    function generateUMLDiagram() {
        // Get the project name
        var projectName = document.getElementById("database_project_name").value;

        // Check if UML diagram for this project has already been created
        if (isProjectCreated(projectName) && createdProjects[projectName].uml) {
            alert("The uml diagram has already been created for this project");
            return;
        }

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

        // Mark the UML diagram as created for this project
        if (!createdProjects.hasOwnProperty(projectName)) {
            createdProjects[projectName] = {};
        }
        createdProjects[projectName].uml = true;

        // Update the UML diagram element
        var umlDiagramDiv = document.getElementById(`uml-diagram_${Object.keys(createdProjects).length}`);
        if (umlDiagramDiv) {
            // Insert SVG code
            umlDiagramDiv.innerHTML = svgCode;
        }

        alert("The uml diagram was created successfully!");
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

        // Check if the project name already exists
        const projectElements = document.querySelectorAll("[id^='project_name_']");
        let isProjectExists = false;
        projectElements.forEach(projectElement => {
            if (projectElement.textContent.trim() === projectName.trim()) {
                isProjectExists = true;
            }
        });

        // If the project already exists, call disableModalBody()
        if (isProjectExists) {
            disableModalBody();
        }
        else
        {
            enableModalBody();
        }

        // Find the next available project name element
        let projectIndex = 1;
        while (document.getElementById(`project_name_${projectIndex}`)) {
            projectIndex++;
        }

        // Set the project name
        const projectNameElement = document.getElementById(`project_name_${projectIndex}`);
        if (projectNameElement) {
            projectNameElement.textContent = projectName;
        }
    }

    // Call updateProjectName function when the user changes the project name input
    document.getElementById("database_project_name").addEventListener("input", function() {
        updateProjectName();
    });
}

export function parseSQL(){

    // Meraj: parseSQL function reads an imported SQL file 
    // to be parsred before it gets posted to the browser 
        // Get the input of the file from html 
        const fileInput = document.getElementById('file_input');
        const file = fileInput.files[0];

        // Use a file object to specify a file to be read 
        const reader = new FileReader();

        // Read the file to output the results of a table 
        reader.onload = (event) => {
            const sqlContent = event.target.result;
            const lines = sqlContent.split('\n');
    
            // Define a database name, a table name, 
            // and a table structure posted to the browser 
            let dbName = '';
            let tableName = '';
            let tableStructure = '<table>';

            let insideCreateTable = false;
            let serialNumber = 1; // Counter for serial number

            // Read every line of the SQL file in a for-loop 
            for (let line of lines) {

                // Retrieve the name of the database by spliting the '`' in the SQL file 
                if (line.trim().startsWith('-- Database:')) {
                    dbName = line.trim().split('`')[1];
                }
                
                // Get the name of the table by spliting the '`' in the file 
                if (line.trim().startsWith('-- Table structure for table')) {
                    tableName = line.trim().split('`')[1];
                    insideCreateTable = true;
                }

                // Inside the created table, make sure each column is aligned in the table. 
                if (insideCreateTable) {

                    // Mach each column in the table 
                    const columnsMatch = line.trim().match(/`([^`]+)` ([^ ]+) (.+)/);

                    // If the columns are aligned, 
                    // then output the database name, 
                    // a type of each row in the column, 
                    // and the details of the third column to the structure of the table
                    if (columnsMatch) {
                        const columnName = columnsMatch[1];
                        const columnType = columnsMatch[2];
                        const columnDetails = columnsMatch[3];
                        tableStructure += `<tr><td>${serialNumber}</td><td>${columnName}</td><td>${columnType}</td><td>${columnDetails}</td></tr>`;
                        serialNumber++; // Increment serial number
                    }
                }

                // If a string in the file ends with ';', make the reading line by line stop 
                if (insideCreateTable && line.trim().endsWith(';')) {
                    break;
                }
            }
    
            // Concatenate '<table>' to '</table> 
            tableStructure += '</table>';
    
            // These three names that we need to post to the brower will be called 
            if (dbName && tableName && tableStructure) {

              // Display database name, table name, and table structure on the web 
              document.getElementById('mainHeading').innerText = dbName;
              document.getElementById('tableContainer').innerHTML = `<h3>Table structure for table: ${tableName}</h3>${tableStructure}`;
            } 
            
            // Otherwise, produce an error where the browser could not find these three names 
            else {
              document.getElementById('tableContainer').innerHTML = 'Database name, table name, or table structure not found in the SQL file.';
            }
          };
          
          reader.readAsText(file); 
    }

    // This function is called when the user imports a file ending in .sql
    /*function parseJson(){
    }
    */ 
    

    /*
    const reader = new FileReader(); 
    reader.onload = (evt) => {
        file.innerHTML = evt.target.result; 
    }
    reader.readAsText(file); */
    /*
    document.getElementById("file_import_button").addEventListener("click", function(container){

        // Get the type of a file 
        var fileType = document.getElementById("#file_input").value; 

        // Get the extension of a file 
        var fileExt = fileType.substring(fileName.lastIndexOf('.') + 1); 
        
        // Test these conditions if the user chooses a different type of file below 
        if (fileExt === container.querySelector("input[accept=.sql]")){
            parseSQL(); 
        }

        // G
        else {
            if (fileExt === container.querySelector("input[accept=.json]")){
                parseJson()
            }
        }
    }); 
}

export async function file_export(){
    // Function to download all SQL files and display their names
    document.getElementById("file_export_button").addEventListener("click", function() {
        var fileNames = [];
        var fileNameElements = document.querySelectorAll("#file_export_container > div:not(:first-child)");
        fileNameElements.forEach(function(element) {
            fileNames.push(element.textContent);
        });

        fileNames.forEach(function(fileName) {
            // Retrieve SQL content for the file
            var projectName = fileName.split(".")[0];
            var sqlContent = createdProjects[projectName].sqlContent;

            // Create Blob for the SQL content
            var blob = new Blob([sqlContent], { type: 'text/plain' });
            var url = URL.createObjectURL(blob);

            // Create anchor element to trigger download
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

// Still needs work
export async function display_database_projects(){

}

// Main delete function that updates the backend for
// both Database and User collections
async function delete_database_forever_button(db_to_delete){
    try{
    const deletion = await fetch(`http://localhost:3000/Databases/delete_database_by_id/${db_to_delete}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    //Getting the current user's JWT to use for the GET request
    const token = localStorage.getItem("accessToken");
    const delete_db_from_user = await fetch('http://localhost:3000/Users/delete_database_by_id', {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({database_id: db_to_delete})
    });
}catch(error){
    console.error("Error:",error)
}
};
// Function show's user's projects on dropdown menu, preparing to delete
export async function delete_database_project(){
    // Container that holds current databases
    const existingProjectDropdown = document.getElementById("existing_project");
    const dropdownButton = document.getElementById("database_project_dropdown_button");
    const deleteButton = document.getElementById("delete_database_forever_button_id");
    let db_to_delete;

    // Event listener that is triggered when "Delete Database Button" is finally clicked
    deleteButton.addEventListener("click", async function(event){
            // Confirmation message before deletion
            const confirmation = confirm("Are you sure you want to delete this database?");
            if (confirmation) {
                delete_database_forever_button(db_to_delete);
                storing_database_projects();
                alert("Database Successfully Deleted!")
            }  
    });
    document.getElementById("delete_database").addEventListener("click", async function(event) {
        storing_database_projects()
        // Prevents form from being submitted when option clicked
        event.preventDefault();
        // Retrieving database project names to display to the user
        const database_ids = {database_id : JSON.parse(localStorage.getItem("database_projects"))}
        try{
        // Making POST request to retrieve database projects pertaining to a user that is currently logged in
        const response = await fetch("http://localhost:3000/Databases/retrieve_all_user_databases", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(database_ids)
        });
        // Returns a JSON object with database information
        const responseData = await response.json();

        // Clears existing database names to be updated now
        existingProjectDropdown.innerHTML = "";

        // Populate dropdown with database names
        responseData.database_projects.forEach(database => {
            const dropdownItem = document.createElement("a");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.href = "#"; // Add the appropriate href attribute
            dropdownItem.textContent = database[0].database_name; // Set text to database name
            dropdownItem.addEventListener("click", function() {
                // Handle click event for the dropdown item (if needed)
                dropdownButton.textContent = database[0].database_name;

                //Actually will delete based on option
                db_to_delete = database[0].database_id;
            });
            existingProjectDropdown.appendChild(dropdownItem);
        });

    }catch(error){
        console.error("Error deleteing a database",error);
    }
    });
}
