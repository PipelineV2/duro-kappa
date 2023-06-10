'use client';
import React, { useEffect } from "react";
import { useQueueContext } from "@/contexts/queue.context";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default async function Page() {
  const { meta, get_user_queue_details, leave_queue } = useQueueContext();
  const router = useRouter();

  useEffect(() => {
    if (!meta)
      get_user_queue_details();
  }, [meta, get_user_queue_details])

  const _leave_queue = async () => {
    try {
      const { message } = await leave_queue();
      toast.success(message)
      router.push('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div>
      {meta
        ? (
          <div>
            <div>you are number {meta.position} on the list! </div>

            <div className="mt-5 underline"> user list </div>
            {meta.queue.users.map((user: any) => (
              <div key={user.id}>{user.name ?? user.email}</div>
            ))}
            <button onClick={_leave_queue} className="mt-5" role="button">
              leave queue
            </button>
          </div>
        ) : (
          <div>
          </div>)}
      this is my details page.
    </div>
  )
}
