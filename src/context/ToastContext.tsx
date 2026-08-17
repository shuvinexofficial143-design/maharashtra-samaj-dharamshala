/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react'

type ToastTone = 'success' | 'info' | 'error'

type ToastInput = {
  message: string
  tone?: ToastTone
}

type ToastItem = ToastInput & { id: number }

const ToastContext = createContext<(toast: ToastInput | string) => void>(() => undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number) => {
    setToasts(current => current.filter(toast => toast.id !== id))
    const timer = timers.current.get(id)
    if (timer) clearTimeout(timer)
    timers.current.delete(id)
  }, [])

  const showToast = useCallback((input: ToastInput | string) => {
    const toast = typeof input === 'string' ? { message: input, tone: 'success' as const } : input
    const id = ++nextId.current
    setToasts(current => [...current.slice(-2), { ...toast, tone: toast.tone ?? 'success', id }])
    timers.current.set(id, setTimeout(() => dismiss(id), 4200))
  }, [dismiss])

  useEffect(() => {
    const activeTimers = timers.current
    return () => activeTimers.forEach(timer => clearTimeout(timer))
  }, [])

  return <ToastContext.Provider value={showToast}>
    {children}
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map(toast => {
        const Icon = toast.tone === 'error' ? CircleAlert : toast.tone === 'info' ? Info : CheckCircle2
        return <div className={`toast toast--${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'} key={toast.id}>
          <Icon aria-hidden="true" />
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(toast.id)}><X /></button>
        </div>
      })}
    </div>
  </ToastContext.Provider>
}

export function useToast() {
  return useContext(ToastContext)
}
