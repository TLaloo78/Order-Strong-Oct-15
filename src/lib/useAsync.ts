import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T }

interface Settled<T> {
  key: string
  attempt: number
  result: { status: 'error'; error: Error } | { status: 'success'; data: T }
}

/**
 * Runs `load` whenever `key` changes (or `retry` is called) and reports
 * loading / error / success. `key` should be a string that identifies the inputs
 * `load` depends on. Stale responses from earlier keys are ignored.
 */
export function useAsync<T>(load: () => Promise<T>, key: string) {
  const [attempt, setAttempt] = useState(0)
  const [settled, setSettled] = useState<Settled<T> | null>(null)

  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    let cancelled = false
    loadRef
      .current()
      .then((data) => {
        if (!cancelled) setSettled({ key, attempt, result: { status: 'success', data } })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        const err = error instanceof Error ? error : new Error(String(error))
        setSettled({ key, attempt, result: { status: 'error', error: err } })
      })
    return () => {
      cancelled = true
    }
  }, [key, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  // Anything not yet settled for the current key/attempt counts as loading.
  const state: AsyncState<T> =
    settled && settled.key === key && settled.attempt === attempt
      ? settled.result
      : { status: 'loading' }

  return { state, retry }
}
