import { useEffect, useState } from 'react'
import { getBlock, Block } from '@/editor/BlockRegistry'
import api from '@/services/api'

export default function HomePage() {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/pages/home')
      .then(({ data }) => setBlocks(data.blocks ?? []))
      .catch(() => setBlocks([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main>
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
          <p className="text-xl">Loja em configuração.</p>
          <p className="text-sm mt-1">Em breve novidades!</p>
        </div>
      ) : (
        blocks
          .sort((a, b) => a.position - b.position)
          .map((block) => {
            const Component = getBlock(block.type)
            if (!Component) return null
            return <Component key={block.id} settings={block.settings} />
          })
      )}
    </main>
  )
}