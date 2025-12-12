export type Product = {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  expiryDate?: string | null;
  costPrice: number;
  sellPrice: number;
  discount: number;
  createdAt?: string;
  updatedAt?: string;
};
