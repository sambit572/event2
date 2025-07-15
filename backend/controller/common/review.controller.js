import Review from "../../model/common/ReviewModel.js";

export const addReview = async(req,res) => {
  try{
    const {name,text,rating} = req.body;

    const newReview = new Review({
      name,
      text,
      rating,
    });
    await newReview.save();

    res.status(201).json({success:true,
      message:"Reveiw saved !",
      data: newReview
    });
  } catch(err){
    res.status(500).json({success:false, message: err.message})
  }
};

export const getAllReviews = async(req,res) => {
  try{
    const reviews = await Review.find().sort({createdAt: -1});
     res.json({ success: true, data: reviews });
  }catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}