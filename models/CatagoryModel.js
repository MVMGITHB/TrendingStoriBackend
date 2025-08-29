import mongoose from 'mongoose';

// Define the Category Schema
const CategorySchema = new mongoose.Schema(
  
  {
    
  name: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate category names
    trim: true,
  },
  


  slug: {
    type: String,
    unique: true,
    index: true,
  },
  
  

  createdAt: {
    type: Date,
    default: Date.now,
  },

  status:{
    type:String,
    default:"Inactive"
  },



  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Model for the Category
const Category = mongoose.model('Category', CategorySchema);

export default Category;



// parent: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category', // Allows categories to have subcategories (optional)
//     default: null,
//   },
