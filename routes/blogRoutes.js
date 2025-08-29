import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  updateStatus,
  getBlogBySlug,
  getBlogsByCategorySlug,
  searchBlogs
} from '../controllers/blogController.js';

const router = express.Router();

// Routes
router.post('/createBlog', createBlog);
router.get('/getAllBlog', getAllBlogs);
router.get('/getOneBlog/:id', getBlogById);
router.get('/getOneBlogByslug/:slug', getBlogBySlug);
router.get('/getOneBlogCategoryslug/:slug', getBlogsByCategorySlug);
router.put('/updateBlog/:id', updateBlog);
router.get('/search', searchBlogs);
router.patch('/toggled/:id', updateStatus);
router.delete('/deleteBlog/:id', deleteBlog);

export default router;
