import { ComponentType } from 'react'

// Tipos de blocos disponíveis
export interface Block {
  id: string
  type: string
  position: number
  settings: Record<string, unknown>
}

// Contrato que todo bloco deve implementar
export interface BlockProps {
  settings: Record<string, unknown>
  isEditing?: boolean
}

// Registro central de componentes de bloco
const blockRegistry: Record<string, ComponentType<BlockProps>> = {}

export function registerBlock(type: string, component: ComponentType<BlockProps>) {
  blockRegistry[type] = component
}

export function getBlock(type: string): ComponentType<BlockProps> | null {
  return blockRegistry[type] ?? null
}

export function getRegisteredBlockTypes(): string[] {
  return Object.keys(blockRegistry)
}