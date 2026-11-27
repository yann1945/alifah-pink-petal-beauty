export type StoreCategory = "Wajah" | "Bibir" | "Mata";

export interface StoreProduct {
  id: string;
  name: string;
  category: StoreCategory;
  price: number;
  image: string;
  description: string;
  badge: string;
}

export const storefrontProducts: StoreProduct[] = [
  {
    id: "petal-cushion",
    name: "Dewdrop Cushion",
    category: "Wajah",
    price: 129_000,
    image: "/images/products/cushion.jpg",
    description: "Cushion dengan hasil akhir lembut dan natural.",
    badge: "Favorit",
  },
  {
    id: "petal-lip",
    name: "Petal Melt Lip Cream",
    category: "Bibir",
    price: 89_000,
    image: "/images/products/lipstick.jpg",
    description: "Warna rose nude untuk tampilan sehari-hari.",
    badge: "Pilihan",
  },
  {
    id: "rose-blush",
    name: "Rosé Veil Liquid Blush",
    category: "Wajah",
    price: 99_000,
    image: "/images/products/blush.jpg",
    description: "Sentuhan rona segar dengan tekstur ringan.",
    badge: "Baru",
  },
  {
    id: "silk-mascara",
    name: "Silk Define Mascara",
    category: "Mata",
    price: 79_000,
    image: "/images/products/mascara.jpg",
    description: "Definisi bulu mata untuk riasan yang anggun.",
    badge: "Pilihan",
  },
];

export type CartState = Record<string, number>;

export function addToCart(cart: CartState, productId: string): CartState {
  return { ...cart, [productId]: (cart[productId] ?? 0) + 1 };
}

export function setCartQuantity(
  cart: CartState,
  productId: string,
  quantity: number,
): CartState {
  const nextCart = { ...cart };

  if (quantity <= 0) {
    delete nextCart[productId];
    return nextCart;
  }

  nextCart[productId] = quantity;
  return nextCart;
}

export function getCartCount(cart: CartState): number {
  return Object.values(cart).reduce((count, quantity) => count + quantity, 0);
}

export function getCartSubtotal(
  cart: CartState,
  products: StoreProduct[] = storefrontProducts,
): number {
  return Object.entries(cart).reduce((subtotal, [productId, quantity]) => {
    const product = products.find((item) => item.id === productId);
    return subtotal + (product ? product.price * quantity : 0);
  }, 0);
}