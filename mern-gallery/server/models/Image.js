import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  title: { type: String, required: [true, 'Title is required'], trim: true ,maxlength:80,},
  description: { type: String, default: "", required: [false], trim: true, maxlength: 240 },
  tags: { type: [String], default: [],
    validate:{
      validator:(tags)=>
        tags.length<=5 && 
      tags.every((tag)=> tag.length <=30),
      message:"A maximum of 5 tags,each up to 30 characters is allowed",
    },
   },
  isFavorite: { type: Boolean, default: false },
  // TODO (student extension): add title, description, tags, and isFavorite.
  // Keep the fields validated and do not store image bytes in MongoDB.
});

export default mongoose.model("Image", imageSchema);
