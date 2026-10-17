import { fetchProducts } from "../../utils/FetchProducts";
import SearchClient, { type SearchProduct } from
"./components/SearchClient";

const SEARCH_QUERY = `{
  products(first: 10) {
    edges { node {
      id title handle productType tags
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
    }}
  }
}`;

const SearchPage = async () => {
    const products = await fetchProducts<SearchProduct>(SEARCH_QUERY);

    return <SearchClient products={products} />;
};

export default SearchPage;
