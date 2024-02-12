import React from 'react'
import { Link } from 'react-router-dom'

const GroupCard = ({group}) => {
  return (
    <Link to={`/group/${group._id}`}>
    <div className='border border-black my-2'>
        <h2>{group.group_name}</h2>
        <p>{group.des}</p>
        <span className='bg-red-500 text-white m-2 rounded-full block w-5 h-5 text-center leading-2'>{group.members.length}</span>
    </div>
    </Link>
  )
}

export default GroupCard