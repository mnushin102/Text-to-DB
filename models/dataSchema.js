// Construct a schema with the following data attributes
const schema = {
    student_id: {type: Number, required: true, maxLength: 8}, 
    first_name: {type: String, required: true, maxLength: 50}, 
    last_name: {type: String, required: true, maxLength: 50}, 
    major: {type: String, required: true, maxLength: 50} 
}; 

// Create a model to fill 
const databaseSchema = new mongoose.model(schema); 