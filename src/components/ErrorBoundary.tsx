import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  /** Shown instead of `children` after an error. Call `reset` to try rendering `children` again. */
  fallback: (reset: () => void) => ReactNode
  children: ReactNode
}

/** Catches render-time errors, including a lazy-loaded chunk that failed to download. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  reset = () => this.setState({ failed: false })

  render() {
    return this.state.failed ? this.props.fallback(this.reset) : this.props.children
  }
}
