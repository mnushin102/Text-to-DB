import { display_collaborators } from "./usersettings-functions.js";
import { logout } from "./loginAccount.js"

export function sidebar_selector(){
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', event => {
            const targetId = event.target.getAttribute('data-target');

             // Check if the clicked item is the "Return Home" item
             if (event.target.id === 'user') {
                // Redirect to the login.html page
                window.location.href = 'user.html';
                return; // Exit the function to prevent further execution
            }
             // Check if the clicked item is the "Login" item
             if (event.target.id === 'login') {

                const confirm_logout = window.confirm("Are you sure you want to log out?")
                if (confirm_logout){
                    // Redirect to the login.html page
                    //window.location.href = 'login.html';
                    logout();
                    return; // Exit the function to prevent further execution
                }
            }

            // If All Collaborators tab is chosen, it will show all the collaborators that a user has worked with
            if (event.target.id == "all_collaborators"){
                display_collaborators();
            }

            // Hide all content elements
            document.querySelectorAll('.item').forEach(content => {
                content.style.display = 'none';
            });
            // Show the selected content element
            document.querySelector(targetId).style.display = 'block';
        });
    });
}