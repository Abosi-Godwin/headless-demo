import Image from "next/image";
import { shopifyFetch } from "../../../lib/Shopify";
import { notFound } from "next/navigation";
import { ProductForm } from "../../components/product/ProductForm";
import { SimilarItems } from "../../components/sections/similarItems";
import { GoBackAndWishlist } from "../../components/ui/goBackAndAddWishlist";

interface SingleProductResponse {
    product: {
        id: string;
        title: string;
        descriptionHtml: string;
        productType: string;
        images: {
            edges: { node: { url: string; altText: string } }[];
        };
        variants: {
            edges: {
                node: {
                    id: string;
                    title: string;
                    price: { amount: string; currencyCode: string };
                };
            }[];
        };
    };
}

const PRODUCT_QUERY = `
  query Product($productData: String!) {
    product(handle: $productData) {  
      id
      title
      descriptionHtml
      productType
      images(first: 4) {
        edges { node { url altText } }
      }
      variants(first: 10) {
        edges { node { id title price { amount currencyCode } } }
      }
    }
  }
`;

export default async function ProductPage({
    params
}: {
    params: Promise<{ productData: string }>;
}) {
    const { productData } = await params;

    const data = await shopifyFetch<SingleProductResponse>(PRODUCT_QUERY, {
        productData
    });

    if (!data.product) {
        return notFound();
    }

    const { product } = data;
    const mainImage = product.images.edges[0]?.node;
    const variants = product.variants.edges.map(edge => edge.node);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
         <GoBackAndWishlist productId={product.id} productTitle={product.title} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                <div className="relative aspect-[4/5] w-full bg-paper overflow-hidden">
                    {mainImage ? (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.altText ?? product.title}
                            fill
                            className="object-cover object-center"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center font-mono text-xs text-foreground/40 uppercase">
                            No image on file
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-center">
                    <nav className="font-mono text-xs tracking-widest uppercase text-foreground/50 mb-6">
                        <a
                            href="/"
                            className="hover:text-accent transition-colors"
                        >
                            Home
                        </a>
                        <span className="mx-2">/</span>
                        <span>{product.title}</span>
                    </nav>

                    <h1 className="font-display text-3xl lg:text-4xl uppercase tracking-tight mb-3 text-foreground">
                        {product.title}
                    </h1>

                    <ProductForm
                        variants={variants}
                        productTitle={product.title}
                        mainImage={mainImage?.url ?? ""}
                    />

                    <div
                        className="prose prose-sm dark:prose-invert mt-8 mb-10 text-foreground/80"
                        dangerouslySetInnerHTML={{
                            __html: product.descriptionHtml
                        }}
                    />

                    <div className="mt-8 border-t border-border-soft pt-6 font-mono text-xs tracking-wide text-foreground/60 space-y-3">
                        <p>✓ Cut from durable, considered materials</p>
                        <p>✓ True to size, checked before issue</p>
                        <p>✓ Standard shipping included over $75</p>
                    </div>
                </div>
            </div>

            <SimilarItems
                productType={product.productType}
                currentProductId={product.id}
            />
        </div>
    );
}
