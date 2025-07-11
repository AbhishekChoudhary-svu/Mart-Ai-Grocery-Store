import React, { useContext, useEffect, useState } from "react";
import Rating from "@mui/material/Rating";
import { Button, TextField } from "@mui/material";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { MdOutlineVerified } from "react-icons/md";


const ReviewBox = (props) => {
  const context = useContext(MyContext);
  const [reviewData, setReviewData] = useState([]);
  const [reviews, setReviews] = useState({
    userName: "",
    userId: "",
    productId: "",
    review: "",
    rating: 1,
  });
  const onChangeInput = (e) => {
    setReviews(() => ({
      ...reviews,
      review: e.target.value,
    }));
  };
  function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 604800) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else {
    return date.toLocaleDateString(); // fallback to date
  }
}

  useEffect(() => {
    setReviews(() => ({
      ...reviews,
      userName: props.userName,
      userId: props.userId,
      productId: props.productId,
    }));
    getReviews();
  }, [props]);

  const AddReview = (e) => {
    e.preventDefault();
    postData("/api/user/addReview", reviews).then((res) => {
      if (res.error !== true) {
        context.openAlertBox("success", res.message);
        setReviews(() => ({
          ...reviews,
          review: "",
          rating: 1,
        }));
        getReviews();
      }
    });
  };

  const getReviews = () => {
    
    fetchDataFromApi(`/api/user/getReviews/${props?.productId}`).then((res) => {
      setReviewData(res?.data);
    });
  };

  return (
    <>
     <div className="lg:space-y-4 space-y-2 overflow-y-scroll max-h-[200px] lg:max-h-[300px]">
  {reviewData.length !== 0 ? 
    reviewData.map((item, idx) => {
        return(
            <div key={idx} className="border border-gray-200 rounded-lg p-2 lg:p-4">
        <div className="flex flex-col ">
             <div className="flex items-center gap-3 mb-1 lg:my-2">
            <span className="font-medium text-lg">{item.userName}</span>
            <span className="text-[10px] bg-gray-300 rounded-2xl px-3  py-0 mt-1 flex gap-1 items-center justify-start"><MdOutlineVerified className=""/>Verified</span>
            </div>
            <div className="flex items-center gap-3 mb-1 lg:my-2">
                 <Rating
            name="rating"
            value={Number(item.rating)}
            precision={0.5}
            readOnly
          />
            
            <span className="font-medium text-sm">{timeAgo(item.updatedAt)}</span>

            </div>
         
          
          
        </div>
        <p className="text-sm text-gray-600">{item.review}</p>
      </div>
        )
      
})
   : (
    <p className="text-sm text-gray-500">No reviews yet.</p>
  )}
</div>

      <div className="Reviewform py-3  ">
        <h2 className="text-[20px] font-[500] pb-4">Add a Review</h2>
        <form onSubmit={AddReview} className="w-full">
          <TextField
            id="outlined-multiline-static"
            label="Add a Review..."
            multiline
            rows={4}
            name="review"
            onChange={onChangeInput}
            className="w-full"
            value={reviews.review}
          />
          <div className="rate w-full py-4">
            <Rating
              name="rating"
              value={reviews.rating}
              onChange={(event, newValue) => {
                setReviews(() => ({
                  ...reviews,
                  rating: newValue || 1,
                }));
              }}
            />
          </div>
          <Button
            type="submit"
            className="!px-4  !bg-green-600 hover:!bg-green-500 !text-white !rounded-md !transition-colors !duration-200 !font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-white "
          >
            Submit
          </Button>
        </form>
      </div>
    </>
  );
};

export default ReviewBox;
