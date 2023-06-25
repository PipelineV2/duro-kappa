'use client';

import { createContext, useState, useContext } from 'react';
import { apis } from '@/api';
import { UIResponse } from './auth.context';

export type QueueContextType = {
  meta: any,
  get_user_queue_details: () => Promise<UIResponse>
  leave_queue: () => Promise<UIResponse>
  list_admin_queues: () => Promise<UIResponse>
  delete_queue: (id: string) => Promise<UIResponse>
}

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [meta, setMeta] = useState<any>(null);

  const get_user_queue_details = async (): Promise<UIResponse> => {
    try {
      const { message, data } = await apis.get_queue_details()
      _setMeta(data);
      return { message }
    } catch (error: any) {
      throw new Error(`${error.message}`)
    }
  }

  const _setMeta = (meta: any) => {
    setMeta(meta)
  }

  const list_admin_queues = async () => {
    try {
      const { message, data } = await apis.list_admin_queues();
      console.log(data)
      _setMeta(data);
      return { message }
    } catch (error: any) {
      throw new Error(`${error.message}`)
    }
  }


  const leave_queue = async () => {
    try {
      const { message } = await apis.leave_queue();
      _setMeta(null)
      return { message }
    } catch (error: any) {
      throw new Error(`${error.message}`)
    }
  }

  const delete_queue = async (id: string) => {
    try {
      const { message } = await apis.delete_queue(id)
      await list_admin_queues();
      return { message }
    } catch (error: any) {
      throw new Error(`${error.message}`)
    }
  }

  return (
    <QueueContext.Provider value={{
      meta,
      get_user_queue_details,
      list_admin_queues,
      leave_queue,
      delete_queue
    }}>
      {children}
    </QueueContext.Provider>
  )
}


export const QueueContext = createContext({} as QueueContextType);

export const useQueueContext = () => useContext(QueueContext);

