import { TypoContainer } from '@/components/TypoContainer'

export default async function HomePage() {
  return (
    <div className="mx-auto mt-8 flex min-h-screen max-w-5xl flex-col">
      <h1 className="mb-8 text-4xl font-bold">Typo</h1>

      <TypoContainer />
    </div>
  )
}
