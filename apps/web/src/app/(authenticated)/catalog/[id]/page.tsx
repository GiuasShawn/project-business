import { notFound } from 'next/navigation'
import { ProductDetails } from '../../../../components/catalog/product-details'
import { catalogProducts } from '../../../../lib/catalog-data'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const product = catalogProducts.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return <ProductDetails product={product} />
}
