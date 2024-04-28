const { json } = require("body-parser");

function queryData(){
    
    const file_input = document.getElementById("input");  

    const file = file_input.files[0];
            
    const reader = new FileReader(); 

    reader.onload = (event) => {
        const jsonQuery = event.target.result;  
        // const lines = sqlQuery.split("\n"); 

        const parseJsonObjects = JSON.parse(jsonQuery); 

        const emp_ids = parseJsonObjects.employee.emp_id; 
        const first_names = parseJsonObjects.employee.first_name; 
        const last_names = parseJsonObjects.employee.last_name; 
        const careers = parseJsonObjects.employee.careers; 

        fetch("../js/data-querying.js")
            .then(res => {
                return res.json(); 
            }) 
            .then(data => {
                data.forEach(employee => {
                    const emp_ids = `<li>${employee.emp_id}</li>`

                    document.querySelector("ul").insertAdjacentHTML("beforeend", emp_ids)
                });   
            })
            .catch(error => console.log(error)); 
        // console.log(emp_ids); 
    
        /*
        let textLine = ""; 
        for (line in lines){
            textLine += `${lines[line]}`; 
            textLine += "\n"; 
        } */

        /* const textArea = document.getElementById("sql_code")
            .innerHTML = `${textLine}`; */ 
    }

    reader.readAsText(file); 
}

module.exports = queryData; 