import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand text-on-brand hover:bg-brand-dark border-transparent',
  secondary: 'bg-surface text-ink hover:bg-sand border-line',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-base font-semibold transition-colors ${VARIANTS[variant]} ${className}`}
      {...rest}
    />
  )
}

interface ToggleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean
}

/** A button that stays "on" until pressed again, announced as pressed to screen readers. */
export function ToggleButton({ pressed, className = '', type = 'button', ...rest }: ToggleButtonProps) {
  const tone = pressed
    ? 'bg-brand-tint text-brand-dark border-brand'
    : 'bg-surface text-ink border-line hover:bg-sand'
  return (
    <button
      type={type}
      aria-pressed={pressed}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-base font-semibold transition-colors ${tone} ${className}`}
      {...rest}
    />
  )
}
