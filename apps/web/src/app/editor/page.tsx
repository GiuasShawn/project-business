'use client'

import { useState } from 'react'
import { EditorPreview } from '../../components/editor/editor-preview'
import type { StorefrontState } from '../../components/editor/editor-sidebar'
import { EditorSidebar } from '../../components/editor/editor-sidebar'

const INITIAL_STATE: StorefrontState = {
  storeName: 'STUDIO NOUVEAU',
  accentColor: '#e4e1e5',
  layout: 'grid',
  featuredCollections: ['FW24 Avant-Garde Collection'],
}

/**
 * Seller customization editor page.
 *
 * Establishes the editor → live storefront preview pattern per the
 * Stitch storefront editor design. Uses local/mock state only —
 * no backend integration. This is a design foundation for future
 * domain phases to connect to.
 */
export default function EditorPage(): React.JSX.Element {
  const [state, setState] = useState<StorefrontState>(INITIAL_STATE)

  return (
    <div className="flex min-h-dvh bg-background">
      <EditorSidebar state={state} onChange={setState} />
      <EditorPreview state={state} />
    </div>
  )
}
