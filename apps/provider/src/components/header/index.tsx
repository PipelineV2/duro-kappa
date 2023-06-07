import React from 'react';
import Link from 'next/link';

type PropsType = {
  title: string
}

function Header({ title = "DURO" }: PropsType) {
  return (
    <div className='w-full py-3 flex items-center justify-between'>
      <div className="text-center space-x-2">
        <span>{title}</span>
        <span>by team kappa</span>
      </div>
      <div className='flex items-center'>
        <Link href="/admin/dashboard" className='mx-1'> Dashboard </Link>
        <Link href="/admin/branches" className='mx-1'> Branches </Link>
        <Link href="/admin/settings" className='mx-1'> Settings </Link>
      </div>
    </div>
  )
}

export default Header;

