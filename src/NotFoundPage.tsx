import { Link } from 'react-router'
import { EmptyState } from './components/StatusViews'

export function NotFoundPage() {
  return (
    <EmptyState
      title="We couldn't find that page"
      action={
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 font-semibold text-on-brand hover:bg-brand-dark"
        >
          Go to home
        </Link>
      }
    />
  )
}
