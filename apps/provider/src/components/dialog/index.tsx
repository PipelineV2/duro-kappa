import { Button } from '../button'
import Modal from '../modal/'
import { useRouter } from 'next/navigation'
import { useModalContext } from '@/contexts/modal.context'

type DialogProps = {
  children?: React.ReactNode,
  id: string
  confirm?: Function
  cancel?: Function
  title?: string
  confirmComponent?: () => React.ReactNode
  cancelComponent?: () => React.ReactNode
}

export default function Dialog({ confirmComponent, cancelComponent, title, children, id, confirm, cancel }: DialogProps) {
  const router = useRouter();

  const _cancel = () => {
    cancel?.() ?? router.back();
  }

  const _confirm = async () => {
    await confirm?.();
  }

  return (
    <Modal onClose={() => router.back()} id={id} defaultOpen={true}>
      <div className='flex flex-col p-4'>
        {title ?? <div>{title}</div>}
        <div>
          <div className='mb-2'> {children} </div>
          <div className='grid grid-cols-2 gap-5 pt-2'>
            {confirmComponent?.() ?? <Button onClick={_confirm}> confirm </Button>}
            {cancelComponent?.() ?? <Button onClick={_cancel}> cancel </Button>}
          </div>
        </div>
      </div>
    </Modal>
  )
}
