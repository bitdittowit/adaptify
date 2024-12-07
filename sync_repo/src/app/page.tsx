'use client'
import dynamic from 'next/dynamic'

export default function Home() {
  const ProgressStepper = dynamic(
    () => import('@/components/Progress/ProgressStepper').then((mod) => mod.default),
    { ssr: false }
  )
  return (
    <main>
      <ProgressStepper />
    </main>
  );
}
