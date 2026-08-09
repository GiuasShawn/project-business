'use client'

import { animate } from 'animejs'
import { useEffect, useRef } from 'react'
import { catalogImages } from '../../lib/catalog-data'

interface RowSpec {
  cols: number
  /** Loop duration in seconds — controls row velocity. */
  duration: number
}

/**
 * Row velocities are intentionally different so the wall drifts diagonally
 * (rows scroll horizontally at different speeds while the wall is rotated).
 */
const ROWS: RowSpec[] = [
  { cols: 8, duration: 52 },
  { cols: 9, duration: 36 },
  { cols: 8, duration: 62 },
]

const TILE_ASPECT = 'aspect-[3/4]'

function WallTile({ image }: { image: string }): React.JSX.Element {
  return (
    <div className={`relative ${TILE_ASPECT} h-40 shrink-0 overflow-hidden sm:h-52 md:h-64`}>
      {/* dark tonal placeholder behind the image so the wall holds offline */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-container-high to-surface-container-lowest" />
      {/* image with cinematic dark treatment */}
      {/* blur is desktop-only: filtering many images on mobile is expensive */}
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale brightness-75 lg:opacity-50 lg:blur-[2px]"
      />
      {/* edges dimmed further to keep the wall quiet */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/40" />
    </div>
  )
}

function WallRow({ spec, rowIndex }: { spec: RowSpec; rowIndex: number }): React.JSX.Element {
  // cols (8-9) < catalogImages.length (13) and the offset advances by one per
  // tile, so every image in a row is unique — the image URL is a stable key.
  const tiles = Array.from({ length: spec.cols }, (_, i) => {
    const image = catalogImages[(rowIndex * spec.cols + i) % catalogImages.length]
    return <WallTile key={image} image={image} />
  })
  return (
    <div data-wall-row className="flex w-max will-change-transform">
      {/* two copies make the -50% translate loop seamless */}
      <div className="flex">{tiles}</div>
      <div className="flex" aria-hidden>
        {tiles}
      </div>
    </div>
  )
}

/**
 * Landing-page catalog wall.
 *
 * A continuous wall of product imagery behind the hero: 3 rows, each a
 * seamless horizontally-scrolling strip at a different velocity, the whole
 * assembly rotated a few degrees for a slight diagonal drift. Pointer
 * parallax is applied to the inner wall. The wall is decorative
 * (aria-hidden, pointer-events-none) and never interferes with the UI.
 *
 * Animation: Anime.js owns the continuous row loops; a single rAF lerp drives
 * pointer parallax. Both are disabled for prefers-reduced-motion, and the
 * loops pause when the document is hidden.
 */
export function CatalogWall(): React.JSX.Element {
  const wallRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wall = wallRef.current
    const inner = innerRef.current
    if (!wall || !inner) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    const rows = Array.from(wall.querySelectorAll<HTMLElement>('[data-wall-row]'))
    const loops = rows.map((row, i) => {
      const spec = ROWS[i % ROWS.length]
      return animate(row, {
        translateX: ['0%', '-50%'],
        duration: spec.duration * 1000,
        ease: 'linear',
        loop: true,
      })
    })

    // Pointer parallax — single rAF lerp on the inner wall.
    let targetX = 0
    let targetY = 0
    let x = 0
    let y = 0
    let raf = 0
    const onPointerMove = (event: PointerEvent): void => {
      targetX = (event.clientX / window.innerWidth - 0.5) * -22
      targetY = (event.clientY / window.innerHeight - 0.5) * -12
    }
    const tick = (): void => {
      x += (targetX - x) * 0.045
      y += (targetY - y) * 0.045
      inner.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      raf = window.requestAnimationFrame(tick)
    }

    const onVisibility = (): void => {
      if (document.hidden) {
        for (const loop of loops) loop.pause()
      } else {
        for (const loop of loops) loop.play()
      }
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    raf = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      window.cancelAnimationFrame(raf)
      for (const loop of loops) loop.cancel()
    }
  }, [])

  return (
    <div ref={wallRef} aria-hidden className="absolute inset-0 overflow-hidden">
      {/* rotated + scaled so the diagonal never exposes edges */}
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[3.5deg] scale-[1.18]"
      >
        <div className="flex flex-col gap-5">
          {ROWS.map((spec, i) => (
            <WallRow key={spec.duration} spec={spec} rowIndex={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
