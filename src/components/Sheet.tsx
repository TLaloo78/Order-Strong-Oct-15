import { useEffect, useRef, type ReactNode } from 'react'

interface SheetProps {
  /** Id of the element inside `children` that names the dialog. */
  labelledBy: string
  onClose: () => void
  children: ReactNode
}

/**
 * A modal built on the native <dialog>: bottom sheet on phones, side panel on
 * larger screens (see `dialog.sheet` in index.css). The browser handles the
 * focus trap, Esc to close, and returning focus to what opened it.
 */
export function Sheet({ labelledBy, onClose, children }: SheetProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    // The 'close' event is dispatched asynchronously. If the dialog was re-opened since
    // (React StrictMode mounts effects twice in dev), this event is stale: ignore it.
    const handleClose = () => {
      if (!dialog.open) onCloseRef.current()
    }
    // A click on the backdrop lands on the dialog element itself.
    const handleClick = (event: MouseEvent) => {
      if (event.target === dialog) dialog.close()
    }
    dialog.addEventListener('close', handleClose)
    dialog.addEventListener('click', handleClick)

    if (typeof dialog.showModal === 'function') dialog.showModal()
    else dialog.setAttribute('open', '')

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.removeEventListener('close', handleClose)
      dialog.removeEventListener('click', handleClick)
      document.body.style.overflow = previousOverflow
      if (dialog.open && typeof dialog.close === 'function') dialog.close()
    }
  }, [])

  return (
    <dialog ref={ref} className="sheet" aria-labelledby={labelledBy}>
      {children}
    </dialog>
  )
}
