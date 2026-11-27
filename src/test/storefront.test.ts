import { describe, expect, it } from "vitest";

import {
  addToCart,
  getCartCount,
  getCartSubtotal,
  setCartQuantity,
} from "@/lib/storefront";

describe("AlifahStore cart", () => {
  it("increments the quantity and item count when a product is added twice", () => {
    const cart = addToCart(addToCart({}, "petal-cushion"), "petal-cushion");

    expect(cart["petal-cushion"]).toBe(2);
    expect(getCartCount(cart)).toBe(2);
  });

  it("calculates the subtotal from the sample product prices", () => {
    const cart = addToCart(addToCart({}, "petal-cushion"), "petal-lip");

    expect(getCartSubtotal(cart)).toBe(218_000);
  });

  it("removes an item when its quantity reaches zero", () => {
    const cart = setCartQuantity(addToCart({}, "petal-cushion"), "petal-cushion", 0);

    expect(cart["petal-cushion"]).toBeUndefined();
    expect(getCartCount(cart)).toBe(0);
  });
});