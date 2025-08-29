import slugify from "slugify";
import Category from "../models/CatagoryModel.js"; 

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Please provide category Name" });
    }

    const slug = slugify(req.body.slug || name).toLowerCase();

    const category = await Category.findOne({ name });

    if (category) {
      return res.status(400).json({ message: "Category Already Exist" });
    }

    const newCategory = new Category({ name, slug });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const getAllCategories = await Category.find();

    if (!getAllCategories) {
      return res.status(400).json({ message: "There is no Category" });
    }

    res.status(200).json(getAllCategories);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error :${error.message}` });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(400).json({ message: "There is no Category" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error :${error.message}` });
  }
};

// Update a category by ID
export const updateCategory = async (req, res) => {
  try {
    const { name, slug: rawSlug } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Generate slug from name if slug is not provided
    const slug = slugify(rawSlug || name).toLowerCase();

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug, updatedAt: Date.now() },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error: " + error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    let Categories = await Category.findById(req.params.id);

    if (!Categories) return res.status(404).json({ error: "Blog not found" });

    if (Categories.status === "Inactive") {
      Categories.status = "Active";
    } else {
      Categories.status = "Inactive";
    }

    const Categori = await Categories.save();

    res.json(Categori);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deleteCategory) {
      return res.status(400).json({ message: "Catagory Not Found" });
    }

    res.status(200).json({ message: "Category Deleted Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: `Internal Server Error :${error.message}` });
  }
};

export const uploadImage = async (req, res) => {
  // If no file is uploaded, return an error
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Create the image URL based on the server's static folder path
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    res.status(201).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
