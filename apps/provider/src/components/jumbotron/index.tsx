'use client'
import { useAuthContext } from "@/contexts/auth.context"
import { HTMLAttributes } from "react";

export default function Jumbotron({ text, cta, ...attrs }: { text?: string, cta?: React.ReactNode } & HTMLAttributes<HTMLDivElement>) {
  const { user } = useAuthContext();

  return (
    user && (<div className="flex flex-col md:flex-row gap-8 justify-between _items-center">
      <div {...attrs}>
        <div> hello, <span className='ml-1 text-3xl'>{user.name ?? user.email}</span>  </div>
        <div>{text}</div>
      </div>
      <div className="_ml-auto">
        {cta ?? ""}
      </div>
    </div>)
  )
}
