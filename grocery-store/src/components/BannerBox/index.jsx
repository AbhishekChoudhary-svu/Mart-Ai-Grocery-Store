import React from 'react'
import { Link } from 'react-router-dom'

const BannerBox = (props) => {
  return (
 <div className='box bannerbox flex-shrink-0 min-w-[220px] sm:min-w-[250px] md:min-w-[350px] h-[150px] sm:h-[180px] md:h-[200px] shadow-md rounded-xl hover:scale-105 hover:rotate-1 transition-all overflow-hidden'>
  <Link to={"/"}>
    <img src={props.item} className='w-full h-full object-cover' alt="" />
  </Link>
</div>

  )
}

export default BannerBox
