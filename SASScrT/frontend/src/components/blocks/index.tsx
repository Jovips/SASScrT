import { BlockProps, registerBlock } from '@/editor/BlockRegistry'
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

// ─── Hero Slider ────────────────────────────────────────────
function HeroSlider({ settings }: BlockProps) {
  const { title, subtitle, buttonText, buttonUrl, imageUrl } = settings as {
    title?: string
    subtitle?: string
    buttonText?: string
    buttonUrl?: string
    imageUrl?: string
  }

  return (
    <section
      className="relative flex items-center justify-center min-h-[480px] overflow-hidden"
      style={{ background: imageUrl ? `url(${imageUrl}) center/cover` : 'var(--color-primary)' }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 text-center text-white px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{title ?? 'Bem-vindo à nossa loja'}</h1>
        <p className="text-lg md:text-xl mb-8 opacity-90">{subtitle ?? 'Encontre os melhores produtos'}</p>
        {buttonText && (
          <a
            href={buttonUrl ?? '#'}
            className="inline-block px-8 py-3 rounded text-white font-semibold transition hover:opacity-90"
            style={{ background: 'var(--color-secondary)', borderRadius: 'var(--button-radius)' }}
          >
            {buttonText}
          </a>
        )}
      </div>
    </section>
  )
}

// ─── Product Grid ────────────────────────────────────────────
function ProductGrid({ settings }: BlockProps) {
  const { columns = 4, title = 'Produtos em destaque', limit = 8 } = settings as {
    columns?: number
    title?: string
    limit?: number
  }

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get(`/products?size=${limit}&sort=createdAt,desc`).then(r => r.data.content),
  })

  const gridCols: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }

  return (
    <section className="container mx-auto px-4 py-12">
      {title && <h2 className="text-2xl font-semibold mb-8">{title}</h2>}
      {isLoading ? (
        <div className={`grid gap-4 ${gridCols[Number(columns)] ?? 'grid-cols-4'}`}>
          {Array.from({ length: Number(limit) }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className={`grid gap-6 ${gridCols[Number(columns)] ?? 'grid-cols-4'}`}>
          {data?.map((product: Record<string, unknown>) => (
            <a
              key={product.id as string}
              href={`/products/${product.id}`}
              className="group rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition"
              style={{ borderRadius: 'var(--button-radius)' }}
            >
              <div className="aspect-square bg-gray-50 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl as string}
                    alt={product.name as string}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl">📦</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm text-gray-800 truncate">{product.name as string}</h3>
                <p className="text-lg font-bold mt-1" style={{ color: 'var(--color-primary)' }}>
                  R$ {(product.price as number).toFixed(2).replace('.', ',')}
                </p>
                {product.comparePrice && (
                  <p className="text-sm text-gray-400 line-through">
                    R$ {(product.comparePrice as number).toFixed(2).replace('.', ',')}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

// ─── Promo Banner ─────────────────────────────────────────────
function PromoBanner({ settings }: BlockProps) {
  const { text, backgroundColor, textColor, buttonText, buttonUrl } = settings as {
    text?: string
    backgroundColor?: string
    textColor?: string
    buttonText?: string
    buttonUrl?: string
  }

  return (
    <div
      className="py-4 px-6 text-center font-medium"
      style={{ background: backgroundColor ?? 'var(--color-secondary)', color: textColor ?? '#fff' }}
    >
      <span>{text ?? 'Frete grátis em compras acima de R$ 200!'}</span>
      {buttonText && (
        <a href={buttonUrl ?? '#'} className="ml-4 underline font-bold">
          {buttonText}
        </a>
      )}
    </div>
  )
}

// Registrar todos os blocos
registerBlock('hero-slider', HeroSlider)
registerBlock('product-grid', ProductGrid)
registerBlock('promo-banner', PromoBanner)