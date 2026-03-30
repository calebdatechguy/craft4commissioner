import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/facebook')({
  beforeLoad: () => {
    window.location.href = 'https://www.facebook.com/profile.php?id=61586773749795'
  },
  component: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-xl font-semibold text-blue-900 mb-2">Redirecting to Facebook...</p>
        <p className="text-slate-500">Please wait while we take you to Eric Craft's profile.</p>
      </div>
    </div>
  ),
})
