import mongoose from 'mongoose';

const adsBannerSchema = new mongoose.Schema(
  {
    images: [{
      type: String,
      required: true,  
    }],
    catId :{
        type: String,
        default:"",
      required: true,  
    },
    subCatId :{
        type: String,
        default:"",
      required: true,  
    },
    
  },
  {
    timestamps: true   
  }
);

const AdsBannerModel = mongoose.model('AdsBanner', adsBannerSchema);

export default AdsBannerModel;
