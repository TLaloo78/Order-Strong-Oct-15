import { useState, type InputHTMLAttributes, type ReactNode } from 'react'

const INPUT_CLASS =
  'min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-base placeholder:text-ink-soft'

export function TextField({
  id,
  label,
  hint,
  ...input
}: {
  id: string
  label: string
  hint?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <input
        id={id}
        className={INPUT_CLASS}
        aria-describedby={hint ? `${id}-hint` : undefined}
        {...input}
      />
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function PasswordField({
  id,
  label,
  hint,
  autoComplete,
  value,
  onChange,
  minLength,
}: {
  id: string
  label: string
  hint?: string
  autoComplete: 'current-password' | 'new-password'
  value: string
  onChange: (value: string) => void
  minLength?: number
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          minLength={minLength}
          required
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={INPUT_CLASS}
        />
        <button
          type="button"
          aria-pressed={visible}
          aria-label={`${visible ? 'Hide' : 'Show'} password`}
          onClick={() => setVisible((v) => !v)}
          className="min-h-12 shrink-0 rounded-xl border border-line bg-surface px-4 text-base font-semibold hover:bg-sand"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function FormMessage({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-xl px-4 py-3 text-base font-medium ${
        tone === 'error' ? 'bg-brand-tint text-brand-dark' : 'bg-leaf-tint text-leaf'
      }`}
    >
      {children}
    </p>
  )
}

export function LinkButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-lg px-1 text-base font-semibold text-brand underline underline-offset-4 hover:text-brand-dark"
    >
      {children}
    </button>
  )
}
