export function Spinner({ size = 8 }: { size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  )
}
