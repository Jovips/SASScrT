import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'
import { getBlock, Block } from '@/editor/BlockRegistry'
import api from '@/services/api'

// ─── Item arrastável ─────────────────────────────────────────
function SortableBlock({
  block,
  onEdit,
  onDelete,
}: {
  block: Block
  onEdit: (block: Block) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Component = getBlock(block.type)

  return (
    <div ref={setNodeRef} style={style} className="relative group border-2 border-transparent hover:border-blue-300 rounded transition">
      {/* Toolbar do bloco */}
      <div className="absolute top-2 right-2 z-20 hidden group-hover:flex items-center gap-1 bg-white shadow rounded px-2 py-1">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab text-gray-400 hover:text-gray-700 p-1"
          title="Arrastar"
        >
          <GripVertical size={16} />
        </button>
        <button
          onClick={() => onEdit(block)}
          className="text-blue-500 hover:text-blue-700 p-1"
          title="Editar"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(block.id)}
          className="text-red-400 hover:text-red-600 p-1"
          title="Remover"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Renderização do bloco */}
      {Component ? (
        <Component settings={block.settings} isEditing />
      ) : (
        <div className="p-8 text-center text-gray-400 border border-dashed rounded">
          Bloco desconhecido: <code>{block.type}</code>
        </div>
      )}
    </div>
  )
}

// ─── Editor principal ─────────────────────────────────────────
export default function CmsEditor({ pageSlug = 'home' }: { pageSlug?: string }) {
  const [blocks, setBlocks] = useState<Block[]>([])
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id)
      const newIndex = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex).map((b, i) => ({ ...b, position: i }))
    })
  }, [])

  const saveLayout = async () => {
    setSaving(true)
    try {
      await api.put(`/editor/layout`, { slug: pageSlug, blocks })
      alert('Layout salvo com sucesso!')
    } catch {
      alert('Erro ao salvar layout.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
  }

  const handleEdit = (block: Block) => {
    // TODO: abrir modal de edição de settings do bloco
    console.log('Editar bloco:', block)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toolbar do editor */}
      <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">Editor Visual</span>
          <span className="text-sm text-gray-400">/{pageSlug}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveLayout}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {saving ? 'Salvando...' : 'Salvar layout'}
          </button>
        </div>
      </div>

      {/* Área de blocos */}
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-2">
        {blocks.length === 0 && (
          <div className="text-center py-20 text-gray-300">
            <p className="text-lg">Nenhum bloco ainda.</p>
            <p className="text-sm mt-1">Adicione blocos para montar a página.</p>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            {blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}