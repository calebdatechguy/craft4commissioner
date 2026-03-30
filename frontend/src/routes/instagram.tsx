import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/instagram')({
  beforeLoad: () => {
    window.location.href = 'https://www.instagram.com/craft4commissioner/'
  },
  component: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl font-semibold text-blue-900 mb-2">Redirecting to Instagram...</p>
        <p className="text-slate-500">Please wait while we take you to Eric Craft's profile.</p>
      </div>
    </div>
  ),
})
