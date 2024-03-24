export function createNewDatabase()
{
    document.getElementById("createNewDatabase").addEventListener("click", async function() {
            const className = document.getElementById("class_name").value;
            const attributeName = document.getElementById("attribute_name").value;
            const attribute2Name = document.getElementById("attribute2_name").value;
            const attribute3Name = document.getElementById("attribute3_name").value;
            const type1 = document.getElementById("type1").value;
            const type2 = document.getElementById("type2").value;
            const type3 = document.getElementById("type3").value;

            const attributes = [
                { name: attributeName, type: type1 },
                { name: attribute2Name, type: type2 },
                { name: attribute3Name, type: type3 }
            ];

            try {
                const response = await fetch('/generate-sql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ className, attributes })
                });
        
                if (!response.ok) {
                    throw new Error('Failed to create database');
                }
        
                alert("The new database was created successfully!");
            } catch (error) {
                console.error('Error creating database:', error);
                alert("There was an error in creating the new database");
            }
    });
}
