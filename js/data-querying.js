async function fetchEmployees() {
    try {
        const response = await fetch('../json/parsingJson.json');
        const data = await response.json();
        return data.employee;
    } catch (error) {
        console.error('Error fetching employees:', error);
    }
}

async function searchEmployee() {
    const employees = await fetchEmployees();
    const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
    const searchResultDiv = document.getElementById("searchResult");
    searchResultDiv.innerHTML = "";

    employees.first_name.forEach((firstName, index) => {
        if (firstName.toLowerCase() === searchInput) {
            const empId = employees.emp_id[index];
            const lastName = employees.last_name[index];
            const career = employees.career[index];
            const resultText = `Employee ID: ${empId}, Last Name: ${lastName}, Career: ${career}`;
            const resultDiv = document.createElement("div");
            resultDiv.textContent = resultText;
            searchResultDiv.appendChild(resultDiv);
        }
    });

    if (searchResultDiv.innerHTML === "") {
        searchResultDiv.textContent = "No matching employee found.";
    }
}

function searchOnEnter(event) {
    if (event.key === 'Enter') {
        searchEmployee();
    }
}
module.exports = searchOnEnter;