import { shopifyFetch } from "../lib/Shopify";
import { GraphQLResponse } from "../lib/types";

// Section Components
import { HeroSection } from "./components/sections/HeroSection";
import { AttributeSpotlight } from "./components/sections/AttributeSpotlight";
import { EditorialCollection } from "./components/sections/EditorialCollection";
import { EssentialsGrid } from "./components/sections/EssentialsGrid";
import { SocialProofBanner } from "./components/sections/SocialProofBanner";

const HOMEPAGE_QUERY = `{
  products(first: 15) {
    edges { node {
      id title handle
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
    }}
  }
}`;

export default async function Home() {
    const data = await shopifyFetch<GraphQLResponse>(HOMEPAGE_QUERY);
    const allProducts = data.products.edges.map(e => e.node);

    const editorialProducts = allProducts.slice(0, 4);
    const essentialProducts = allProducts.slice(4, 12);
    const spotlightProduct = allProducts[14];

    return (
        <div className="min-h-screen flex flex-col">
            <main>
                <HeroSection />
                <AttributeSpotlight product={spotlightProduct} />
                <EditorialCollection products={editorialProducts} />
                <EssentialsGrid products={essentialProducts} />
                <SocialProofBanner />
            </main>
        </div>
    );
}
