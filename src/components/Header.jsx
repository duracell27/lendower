import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { UserContext } from '../App'
import { removeFromSession } from '../utils/session'

const Header = () => {
  let {userAuth:{access_token, name}, setUserAuth } = useContext(UserContext)
  const signOutUser = () => {
    removeFromSession('user')
    setUserAuth({access_token: null })
}
  return (
    <>
    <div className='flex justify-between bg-slate-200 p-2'>
      <div className="logo">
        <Link to={'/'}>LendOwer</Link>
      </div>
      <div className="bg-green-300 text-emerald-100 flex gap-5">
        {access_token?(<><p className='text-black'>{name}</p> <button onClick={signOutUser}>вийти</button></>):<Link to={'/auth'}>увійти</Link>}
      </div>
    </div>
    <Outlet />
    </>
  )
}

export default Header