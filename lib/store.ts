import { Product } from "../types/product";
import fs from "fs/promises";
import path from "path";

const PRODUCTS_FILE = path.join(process.cwd(), "products.json");

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

async function readProducts(): Promise<Product[]> {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, initialize with default products
    try {
      await writeProducts(INITIAL_PRODUCTS);
    } catch (writeError) {
      console.error("Failed to write products file:", writeError);
    }
    return INITIAL_PRODUCTS;
  }
}

async function writeProducts(products: Product[]): Promise<void> {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Failed to write products:", error);
    throw error;
  }
}

export async function getAllProducts(): Promise<Product[]> {
  return readProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const products = await readProducts();
  return products.find((p) => p.id === id);
}

export async function addProduct(product: Product): Promise<Product> {
  const products = await readProducts();
  products.push(product);
  await writeProducts(products);
  return product;
}

export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product | null> {
  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = {
    ...products[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  products[idx] = updated;
  await writeProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await readProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  products.splice(idx, 1);
  await writeProducts(products);
  return true;
}
