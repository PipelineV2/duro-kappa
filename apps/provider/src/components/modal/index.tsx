'use client';
import Popup from 'reactjs-popup';
import React, { HTMLAttributes, ReactElement, useEffect } from 'react';
import { ModalContextType, useModalContext } from '@/contexts/modal.context';

type ModalProps = {
  as?: (click: ModalContextType) => ReactElement,
  component?: (arg: ModalContextType) => ReactElement,
  id: string,
  children?: React.ReactNode,
  trigger?: ReactElement
  defaultOpen?: boolean
  onClose?: Function
}

type ModalTriggerProps = {
  as?: (click: Function) => ReactElement,
  component?: (click: Function) => ReactElement,
  className?: string,
  children?: React.ReactNode,
  id: string
}

export default function Modal({ onClose, defaultOpen, children, id, as, component, ...attrs }: ModalProps & HTMLAttributes<HTMLDivElement>) {
  const { active, close, id: id_from_context, toggle } = useModalContext();

  let Component;
  const _Component = as ?? component;
  if (_Component)
    Component = _Component({ active, id, close, toggle });
  else {
    if (!children)
      throw new Error("cannot instantiate this component. please provide a component using 'as', 'component', or nesting children inside")
    Component = children;
  }

  useEffect(() => {
    if (defaultOpen)
      toggle(id, true);
  }, [defaultOpen, id, toggle])

  return (
    <Popup
      open={id == id_from_context && active}
      onClose={onClose ? (...args) => onClose(...args) : close}
      contentStyle={{
        width: "max-content",
        maxWidth: '30rem',
        border: '1px solid black',
        boxShadow: "5px 5px black"
      }}
      modal
      {...attrs}
    >
      {Component}
    </Popup >
  )
}

export function ModalTrigger({ children, id, className, as, component }: ModalTriggerProps) {
  const { toggle } = useModalContext();

  const click = () => toggle(id);

  const Component = as ?? component;
  if (Component)
    return Component(click);

  return (
    <div onClick={click} className={`${className ?? ""}`}>
      {children}
    </div >
  )
}

