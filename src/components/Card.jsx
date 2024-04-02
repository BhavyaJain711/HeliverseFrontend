import { useEffect, useState } from "react"
import { IoIosAddCircleOutline } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";
const Card = ({user,selected,handleSelect,handleRemove}) => {
  return (
    <div key={user.id} className='bg-container relative p-4 shadow-lg rounded-lg'>
        <img src={user.avatar} alt={user.first_name} className=' w-8 h-8 rounded-full mx-0' />
        {selected?<button onClick={handleRemove}><CiCircleRemove className='absolute top-4 right-4 text-3xl text-red-500 float-right cursor-pointer'/></button>:
        <button onClick={handleSelect} ><IoIosAddCircleOutline className='absolute top-4 right-4 text-3xl text-green-500 float-right cursor-pointer'/></button>}
        <h2 className='text-lg text-heading'>{user.first_name} {user.last_name}</h2>
        <p className='text-md font-medium text-body'>{user.domain}</p>
        <p className='text-sm text-body'>{user.email}</p>
        <p className='text-sm text-body'>{user.gender}</p>
        <p className='text-sm text-body'>Available: <span className="font-medium">{user.available?"Yes":"No"}</span></p>
    </div>
  )
}

export default Card