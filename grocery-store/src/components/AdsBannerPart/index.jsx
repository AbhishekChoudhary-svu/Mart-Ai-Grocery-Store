import React from 'react'
import BannerBox from '../BannerBox'

const AdsBannerPart = (props) => {
  return (
   <div className="flex gap-4 py-6 overflow-x-auto flex-nowrap scroll-smooth hide-scrollbar">
  {props.data.map((img, idx) => (
    <BannerBox key={idx} item={img.images} />
  ))}
</div>



  )
}

export default AdsBannerPart
