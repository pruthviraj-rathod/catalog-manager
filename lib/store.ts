import { Product } from "../types/product";

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Sample Phone",
    category: "electronics",
    description: "A sample phone",
    expiryDate: null,
    costPrice: 10000,
    sellPrice: 12000,
    discount: 5,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Notebook",
    category: "books",
    description: "A ruled notebook",
    expiryDate: null,
    costPrice: 50,
    sellPrice: 80,
    discount: 0,
    createdAt: new Date().toISOString(),
  },
];

// In-memory store with localStorage persistence
let productsStore: Product[] | null = null;

function getStoredProducts(): Product[] {
  if (productsStore !== null) {
    return productsStore;
  }
  return [...INITIAL_PRODUCTS];
}

function saveProducts(products: Product[]): void {
  productsStore = [...products];
}

export async function getAllProducts(): Promise<Product[]> {
  return getStoredProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = getStoredProducts();
  return products.find((p) => p.id === id);
}

export async function addProduct(product: Product): Promise<Product> {
  const products = getStoredProducts();
  products.push(product);
  saveProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = getStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = {
    ...products[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  saveProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = getStoredProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  saveProducts(products);
  return true;
}

