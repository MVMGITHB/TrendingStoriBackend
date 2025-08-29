import User from "../models/User.js";
import sendVerificationEmail from "../utils/sendEmail.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

import slugify from 'slugify';

export const registerUser = async (req, res) => {
  const { name, email, phone, password, dateOfBirth,role,shortBio,tag,slug,socialMedia,blog,image} = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

   const verificationToken = crypto.randomBytes(32).toString("hex");    

    const user = await User.create({
      name,
      email,
      phone,
      password,
      dateOfBirth,
      role,
      verificationToken,
      shortBio,
      tag,
      slug:slug?slugify(req.body.slug).toLowerCase():"",
      socialMedia,
      blog,
      image,
    });

  
   await sendVerificationEmail(email,verificationToken);
    res.status(201).json({
      message: "User registered.",
      user:user
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    console.log(error)
  }
};







// @desc   Login user via email or phone
// @route  POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body; // identifier can be email or phone

  try {
    const user = await User.findOne({
       email: email 
    });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          dateOfBirth: user.dateOfBirth,
          specialization: user.specialization,
          role:user.role
        },
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email/phone or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
    console.log(error)
  }
};

// @desc   Logout user
// @route  POST /api/auth/logout
// @access Private
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
};



export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send({ message: "Invalid or expired token" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // res.status(200).json({ message: "Email verified successfully" });
    return res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getAllUser = async(req,res)=>{
   try {
       const users = await User.find({});
       if(!users){
        return res.status(400).json({message:"Users not found"})
       }

       res.status(200).json({
        message:"Users find successfully",
        users:users
       })

   } catch (error) {
    res.status(500).json({ message: "Server Error", error });
   }
}


export const getAllAdmin = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ['admin', 'superAdmin', 'seoAdmin'] }
    }); // 👈 Explicitly include password

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No admin users found" });
    }

    res.status(200).json({
      message:"Users find successfully",
      users:users
     })
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};


 export const updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

     const { name, email, phone, dateOfBirth,role,shortBio,tag,slug,socialMedia,blog,image} = req.body;

    if (email) user.email = email;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (image) user.image = image;
    if (role) user.role = role;
    if (shortBio) user.shortBio = shortBio;
    if (tag) user.tag = tag;
    if (socialMedia) user.socialMedia = socialMedia;
    if(slug) user.slug = slugify(slug).toLowerCase()

    // Append new blog ID(s) instead of replacing
    if (blog) {
      if (Array.isArray(blog)) {
        user.blog.push(...blog); // Add multiple blog IDs
      } else {
        user.blog.push(blog); // Add a single blog ID
      }
    }

    await user.save();
    res.status(200).json({ message: "User updated successfully", user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteUserBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { blogsToDelete } = req.body;

    if (!Array.isArray(blogsToDelete) || blogsToDelete.length === 0) {
      return res.status(400).json({ message: "No blogs provided to delete" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out blog IDs to delete
    user.blog = user.blog.filter(
      (blogId) => !blogsToDelete.includes(blogId.toString())
    );

    await user.save();
    res.status(200).json({ message: "Blog(s) deleted from user", blog: user.blog });

  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserByslug= async(req,res)=>{
      try {
          
        const user = await User.find({slug:req.params.slug}).populate({
          path: 'blog',
          populate: [
            { path: 'category', model: 'Category' },
          ]
        });
        if(!user){
          res.status(400).json({message:"User not found"})
        }
        res.status(200).json(user)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
      }
}



export const updateStatus = async (req, res) => {
  try {

    let Users = await User.findById(req.params.id)
   

    if (!Users) return res.status(404).json({ error: "Blog not found" });

    if(Users.status ==='Inactive')  {
      Users.status ='Active'
    }else{
      Users.status ='Inactive'
    }

   const users =  await  Users.save()

    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
