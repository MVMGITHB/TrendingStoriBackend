import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateStatus, 
  uploadImage,
  
} from '../controllers/categoryController.js'; 
import upload from '../middlewares/single.js';
const router = express.Router();

// Create a new category
router.post('/create-categories', createCategory);

// Get all categories
router.get('/get-categories', getAllCategories);

// Get a category by ID
router.get('/get-categories/:id', getCategoryById);

// Update a category by ID
router.put('/update-categories/:id', updateCategory);
router.patch('/toggled/:id', updateStatus);

// Delete a category by ID
router.delete('/delete-categories/:id', deleteCategory);

router.post("/uploadImage", upload.single("image"), uploadImage );

export default router;
