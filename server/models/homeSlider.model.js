import mongoose from 'mongoose';

const homeSliderSchema = new mongoose.Schema(
  {
    images: [{
      type: String,
      required: true,  
    }],
    dateCreated :{
        type : Date,
        default:Date.now
    }
    
  },
  {
    timestamps: true   // adds createdAt and updatedAt
  }
);

const HomeSliderModel = mongoose.model('HomeSlider', homeSliderSchema);

export default HomeSliderModel;
