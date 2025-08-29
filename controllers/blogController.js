import Blog from '../models/BlogModel.js';
import slugify from "slugify";
 
import Category from '../models/CatagoryModel.js'
// Create Blog
export const createBlog = async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      slug: slugify(req?.body?.slug).toLowerCase(),
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.log(err)
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('category')
      .populate('author')
      .populate('tag')
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getBlogsByCategorySlug = async (req, res) => {
  try {

   const category = await Category.findOne({slug:req.params.slug});

    const blogs = await Blog.find({category:category?._id})
      .populate('category')
      .populate('author')
      .populate('tag')
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const searchBlogs = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const regex = new RegExp(query, 'i'); // case-insensitive partial match

  try {
    const blogs = await Blog.find({
      $or: [
        { title: regex },
        { slug: regex },
        { mtitle: regex },
        { mdesc: regex },
        { content: regex },
        { conclusion: regex },
        { alt: regex },
        { 'faqs.ques': regex },
        { 'faqs.ans': regex }
      ],
      status: 'Active',
    })
    .populate('category')
    .populate('tag')
    .populate('author', 'name email');

    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};





// Get Single Blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category')
      .populate('author')
      .populate('tag');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get Blog by Slug
export const getBlogBySlug = async (req, res) => {
    try {
      const blog = await Blog.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('author')
        .populate('tag');
  
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.status(200).json(blog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, {
      ...req.body,
      slug: slugify(req?.body?.slug).toLowerCase(),
    }, 
    {
      new: true,
      runValidators: true
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const updateStatus = async (req, res) => {
    try {
  
      let Blogs = await Blog.findById(req.params.id)
     
  
      if (!Blogs) return res.status(404).json({ error: "Blog not found" });
  
      if(Blogs.status ==='Inactive')  {
        Blogs.status ='Active'
      }else{
        Blogs.status ='Inactive'
      }
  
     const blogs =  await  Blogs.save()
  
      res.json(blogs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
