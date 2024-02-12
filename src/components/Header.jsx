import React from 'react'
import { Link, Outlet } from 'react-router-dom'

const Header = () => {
  return (
    <>
    <div className='flex justify-between bg-slate-200 p-2'>
      <div className="logo">
        <Link to={'/'}>LendOwer</Link>
      </div>
      <div className="bg-green-300 text-emerald-100">
        <Link to={'/auth'}>увійти</Link>
      </div>
    </div>
    <Outlet />
    </>
  )
}

export default Header