const sql = require('mysql2'); 

// User's configurations to access the user's databases 
const config = sql.createConnection(  {
    host: 'localhost', 
    port: 3306, 
    database: 'demo', 
    user: 'root', 
    password: 'Mnushin102',
    options: {
        encrypt: false 
    } 
}); 

// Determine if the connection to mySQL database has been successful..
config.connect(err => {
    if(err){
        console.log('ERROR OCCURRED!', err); 
    }

    else{
        console.log("Connection to SQL Server has been Successful!"); 
    }
}); 

config.end();