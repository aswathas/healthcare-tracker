'use client'

import { createContext, useContext, useState } from 'react'
import Toast from '@/components/ui/Toast'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<ToastType>('info')
  const [show, setShow] = useState(false)

  const showToast = (message: string, type: ToastType) => {
    setMessage(message)
    setType(type)
    setShow(true)
    setTimeout(() => setShow(false), 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {show && <Toast message={message} type={type} onClose={() => setShow(false)} />}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
