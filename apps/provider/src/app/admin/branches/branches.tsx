'use client'
import { useEffect } from 'react';
import { useBranchContext } from '@/contexts/branch.context';
import Link from 'next/link';
import { ModalTrigger } from '@/components/modal';
import toast from 'react-hot-toast';

export default function Page() {
  const { get_branches, branches } = useBranchContext();

  useEffect(() => {
    console.log(branches)
    if (!branches)
      get_branches()
        .catch((e: any) => { toast.error(e.message) });
  }, [branches, get_branches])

  return (
    <div className="hidden lg:block">
      {branches
        ? (
          <div>
            {branches.map((branch: any) => (
              <div key={branch.id} className='mb-8 p-4 border border border-black shadow-outset '>
                <div className='' key={branch.id}>
                  <div className='text-xl'>Branch location: {branch.location}</div>
                  <span className='text-sm'>Branch Location: {branch.location}</span>
                  <div className='mt-2 text-bold'> admin: </div>
                  <div> {branch?.admin?.username ? `${branch.admin.username}  -  ` : ''}{branch?.admin?.email} </div>
                </div>
              </div>
            ))}
          </div>

        ) : (
          <div> hmmm... you may not be authorized to view this page</div>
        )}
    </div>
  );
}
