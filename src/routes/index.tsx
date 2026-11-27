import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Blend,
  Droplets,
  Eye,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  addToCart,
  getCartCount,
  getCartSubtotal,
  setCartQuantity,
  storefrontProducts,
  type CartState,
  type StoreCategory,
} from "@/lib/storefront";
import { Input } from "@/components/ui/input";

const categories = ["Semua", "Wajah", "Bibir", "Mata"] as const;
type CategoryFilter = (typeof categories)[number];

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AlifahStore | Makeup & Kosmetik Pilihan" },
      {
        name: "description",
        content:
          "Jelajahi pilihan makeup dan kosmetik AlifahStore untuk ritual cantik sehari-hari.",
      },
      { property: "og:title", content: "AlifahStore | Makeup & Kosmetik Pilihan" },
      {
        property: "og:description",
        content: "Makeup dan kosmetik pilihan untuk merayakan cantik versimu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [cart, setCart] = useState<CartState>({});
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = getCartCount(cart);
  const subtotal = getCartSubtotal(cart);
  const cartLines = useMemo(
    () =>
      Object.entries(cart).flatMap(([productId, quantity]) => {
        const product = storefrontProducts.find((item) => item.id === productId);
        return product && quantity > 0 ? [{ product, quantity }] : [];
      }),
    [cart],
  );
  const visibleProducts = storefrontProducts.filter((product) => {
    const matchesCategory =
      activeCategory === "Semua" || product.category === (activeCategory as StoreCategory);
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && searchableText.includes(searchQuery.trim().toLowerCase());
  });

  const addProduct = (productId: string) => {
    setCart((current) => addToCart(current, productId));
  };

  const setQuantity = (productId: string, quantity: number) => {
    setCart((current) => setCartQuantity(current, productId, quantity));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative z-30 bg-background">
        <div className="bg-rose-deep px-4 py-2 text-center text-xs font-medium text-primary-foreground sm:text-sm">
          Makeup pilihan untuk ritual cantik versimu
        </div>
        <div className="store-container flex h-[76px] items-center justify-between gap-4">
          <a href="#beranda" className="flex items-center gap-2.5" aria-label="AlifahStore, beranda">
            <span className="flex size-9 items-center justify-center rounded-full bg-rose-soft text-primary">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <span className="font-display text-[1.6rem] leading-none">AlifahStore</span>
          </a>

          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 text-sm md:flex">
            <a className="transition-colors hover:text-primary" href="#beranda">Beranda</a>
            <a className="transition-colors hover:text-primary" href="#koleksi">Koleksi</a>
            <a className="transition-colors hover:text-primary" href="#cerita">Cerita kami</a>
          </nav>

          <div className="flex items-center gap-1">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Buka menu">
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full border-r border-border bg-background sm:max-w-sm">
                <SheetHeader className="mt-8 text-left">
                  <SheetTitle className="font-display text-2xl">AlifahStore</SheetTitle>
                  <SheetDescription>Temukan ritual cantik versimu.</SheetDescription>
                </SheetHeader>
                <nav className="mt-10 flex flex-col gap-2" aria-label="Navigasi ponsel">
                  {[
                    ["Beranda", "#beranda"],
                    ["Koleksi", "#koleksi"],
                    ["Cerita kami", "#cerita"],
                  ].map(([label, href]) => (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="border-b border-border py-4 text-lg transition-colors hover:text-primary"
                    >
                      {label}
                    </a>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-10"
              aria-label={`Buka keranjang, ${cartCount} item`}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag aria-hidden="true" className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="beranda"
          className="relative isolate flex min-h-[590px] items-center overflow-hidden bg-rose-soft md:min-h-[640px]"
        >
          <img
            src="/images/products/alifah-hero.jpg"
            alt="Cushion, lipstik, serum, dan kuas makeup dalam nuansa putih dan pink"
            className="absolute inset-0 size-full object-cover object-[67%_center] md:object-center"
          />
          <div className="absolute inset-0 bg-background/55 md:bg-background/15" />
          <div className="store-container relative z-10 grid w-full items-center py-16 md:py-20">
            <div className="max-w-[34rem]">
              <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase text-primary sm:text-sm">
                <span className="h-px w-8 bg-primary" />
                AlifahStore beauty edit
              </p>
              <h1 className="font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
                Cantik yang terasa <span className="text-primary">seperti dirimu.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
                Temukan warna dan tekstur yang membuat ritual makeup sehari-hari terasa lebih istimewa.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 px-6">
                  <a href="#koleksi">
                    Jelajahi koleksi <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
                <a
                  href="#cerita"
                  className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-medium transition-colors hover:text-primary"
                >
                  Kenali AlifahStore <span aria-hidden="true">↗</span>
                </a>
              </div>
              <p className="mt-8 text-xs text-muted-foreground">Katalog dan harga pada halaman ini adalah contoh.</p>
            </div>
          </div>
          <div className="absolute bottom-7 right-6 hidden items-center gap-2 text-xs text-foreground/70 md:flex">
            <span className="h-px w-10 bg-rose-detail" />
            A little ritual, a little more you
          </div>
        </section>

        <section id="koleksi" className="scroll-mt-6 py-16 sm:py-20 md:py-24">
          <div className="store-container">
            <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="mb-3 text-sm font-semibold text-primary">Pilihan AlifahStore</p>
                <h2 className="font-display text-4xl leading-tight sm:text-5xl">Temukan ritualmu</h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                  Pilihan makeup dengan warna lembut, sentuhan modern, dan ruang untuk gayamu sendiri.
                </p>
              </div>
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">Cari produk</span>
                <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Cari produk..."
                  className="h-11 rounded-md border-border bg-background pl-10"
                  aria-label="Cari produk"
                />
              </label>
            </div>

            <div className="mt-9 flex flex-wrap gap-2" aria-label="Filter kategori">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={activeCategory === category ? "default" : "outline"}
                  aria-pressed={activeCategory === category}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">Produk dan harga ditampilkan sebagai data contoh.</p>

            {visibleProducts.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <article key={product.id} className="group min-w-0">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-rose-soft">
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground">
                        {product.badge}
                      </span>
                    </div>
                    <div className="pt-4">
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <h3 className="mt-1 min-h-12 text-sm font-semibold leading-5 sm:text-base">{product.name}</h3>
                      <p className="mt-1 font-medium text-foreground">{formatRupiah(product.price)}</p>
                      <p className="mt-2 min-h-10 text-xs leading-5 text-muted-foreground sm:text-sm">
                        {product.description}
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3 w-full border-primary/35 hover:border-primary hover:bg-accent"
                        onClick={() => addProduct(product.id)}
                        aria-label={`Tambah ${product.name} ke keranjang`}
                      >
                        <ShoppingBag aria-hidden="true" />
                        <span>Tambah ke keranjang</span>
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 border-y border-border py-12 text-center">
                <p className="font-display text-2xl">Produk belum ditemukan</p>
                <p className="mt-2 text-sm text-muted-foreground">Coba kata kunci atau kategori lain.</p>
              </div>
            )}
          </div>
        </section>

        <section id="cerita" className="scroll-mt-6 bg-rose-deep py-16 text-primary-foreground sm:py-20">
          <div className="store-container">
            <div className="mx-auto max-w-2xl text-center">
              <p className="mb-3 text-sm font-medium text-primary-foreground/75">Ruang untuk dirimu</p>
              <h2 className="font-display text-4xl leading-tight sm:text-5xl">Keindahan tak perlu terasa rumit.</h2>
              <p className="mt-5 text-sm leading-6 text-primary-foreground/75 sm:text-base">
                AlifahStore merayakan momen kecil di depan cermin—dengan pilihan yang terasa personal dan mudah dicintai.
              </p>
            </div>
            <div className="mt-12 grid gap-8 border-t border-primary-foreground/20 pt-8 sm:grid-cols-3 sm:gap-6">
              <div className="flex items-start gap-4">
                <Blend aria-hidden="true" className="mt-1 size-5 shrink-0 text-rose-detail" />
                <div>
                  <h3 className="font-semibold">Warna yang mudah dipakai</h3>
                  <p className="mt-2 text-sm leading-5 text-primary-foreground/70">Palet lembut untuk menemani banyak suasana.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Droplets aria-hidden="true" className="mt-1 size-5 shrink-0 text-rose-detail" />
                <div>
                  <h3 className="font-semibold">Tekstur yang terasa ringan</h3>
                  <p className="mt-2 text-sm leading-5 text-primary-foreground/70">Sentuhan nyaman untuk ritual harianmu.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Eye aria-hidden="true" className="mt-1 size-5 shrink-0 text-rose-detail" />
                <div>
                  <h3 className="font-semibold">Cantik versimu sendiri</h3>
                  <p className="mt-2 text-sm leading-5 text-primary-foreground/70">Makeup yang memberi ruang bagi ekspresi diri.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background py-12 sm:py-16">
        <div className="store-container">
          <div className="grid gap-10 border-b border-border pb-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
            <div>
              <a href="#beranda" className="inline-flex items-center gap-2.5" aria-label="AlifahStore, kembali ke atas">
                <span className="flex size-9 items-center justify-center rounded-full bg-rose-soft text-primary">
                  <Sparkles aria-hidden="true" className="size-5" />
                </span>
                <span className="font-display text-2xl">AlifahStore</span>
              </a>
              <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                Makeup dan kosmetik pilihan untuk momen kecil yang membuatmu merasa lebih seperti dirimu.
              </p>
              <a href="#koleksi" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                Lihat koleksi <ArrowRight aria-hidden="true" className="size-4" />
              </a>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl">Tentang pemilik</h2>
                <span className="rounded-full bg-rose-soft px-3 py-1 text-xs text-muted-foreground">Data contoh</span>
              </div>
              <dl className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Nama</dt>
                  <dd className="mt-1 text-sm font-medium">Alifah Putri</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Profil</dt>
                  <dd className="mt-1 text-sm leading-5">Pecinta makeup dan kurator pilihan kecantikan.</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Tempat, tanggal lahir</dt>
                  <dd className="mt-1 text-sm">Yogyakarta, 12 Mei 1998</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Email</dt>
                  <dd className="mt-1 text-sm">
                    <a className="underline-offset-4 hover:underline" href="mailto:alifahstore@example.com">
                      alifahstore@example.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Domisili</dt>
                  <dd className="mt-1 text-sm">Bandung, Indonesia</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AlifahStore. Dibuat dengan rasa.</p>
            <p>Foto produk ilustratif · Katalog demo</p>
          </div>
        </div>
      </footer>

      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent className="flex h-full w-full flex-col border-l border-border bg-background p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-6 py-5 text-left">
            <SheetTitle className="font-display text-2xl">Keranjang belanja</SheetTitle>
            <SheetDescription>{cartCount} produk · harga pada katalog adalah contoh</SheetDescription>
          </SheetHeader>
          {cartLines.length > 0 ? (
            <>
              <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
                {cartLines.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4">
                    <img
                      src={product.image}
                      alt=""
                      className="size-20 shrink-0 rounded-md bg-rose-soft object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{product.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{formatRupiah(product.price)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8"
                          aria-label={`Kurangi jumlah ${product.name}`}
                          onClick={() => setQuantity(product.id, quantity - 1)}
                        >
                          <Minus aria-hidden="true" className="size-3.5" />
                        </Button>
                        <span className="min-w-6 text-center text-sm" aria-label={`Jumlah ${quantity}`}>{quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="size-8"
                          aria-label={`Tambah jumlah ${product.name}`}
                          onClick={() => setQuantity(product.id, quantity + 1)}
                        >
                          <Plus aria-hidden="true" className="size-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-auto size-8 text-muted-foreground hover:text-destructive"
                          aria-label={`Hapus ${product.name} dari keranjang`}
                          onClick={() => setQuantity(product.id, 0)}
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-auto border-t border-border px-6 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal contoh</span>
                  <span className="font-semibold">{formatRupiah(subtotal)}</span>
                </div>
                <Button type="button" disabled className="h-11 w-full">
                  Checkout belum tersedia
                </Button>
                <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
                  Checkout akan tersedia setelah toko Shopify terhubung.
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-rose-soft text-primary">
                <ShoppingBag aria-hidden="true" className="size-6" />
              </span>
              <p className="mt-5 font-display text-2xl">Keranjangmu masih kosong</p>
              <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                Jelajahi koleksi pilihan dan tambahkan produk yang kamu suka.
              </p>
              <Button type="button" className="mt-6" onClick={() => setCartOpen(false)}>
                Mulai melihat-lihat <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}