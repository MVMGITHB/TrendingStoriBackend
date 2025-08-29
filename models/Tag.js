import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema(
  {

    
    tagname: {
      type: String,
      required: true,
    },

    status:{
    type:String,
    default:"Inactive"
  },


  },
  { timestamps: true }
);

const Tag = mongoose.model('Tag', TagSchema);

export default Tag;
