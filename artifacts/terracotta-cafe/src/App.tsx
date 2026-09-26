import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Star,
  Users,
  X,
} from 'lucide-react';
import heroImage from '@assets/caption_1790330334346.jpg';
import americanoImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.49_PM_1790331532511.jpeg';
import artisanMochaImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.49_PM_(2)_1790331532511.jpeg';
import cappuccinoImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.48_PM_(1)_1790331532509.jpeg';
import cortadoImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.50_PM_1790331532513.jpeg';
import espressoImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.48_PM_1790331532510.jpeg';
import flatWhiteImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.50_PM_(1)_1790331532512.jpeg';
import latteImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.48_PM_(2)_1790331532509.jpeg';
import loadedMochaImage from '@assets/WhatsApp_Image_2026-09-25_at_6.16.49_PM_(1)_1790331532510.jpeg';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Link, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();
const appBase = import.meta.env.BASE_URL.replace(/\/$/, '');
const appPath = (path: string) => `${appBase}${path === '/' ? '/' : path}`;

type MenuItem = {
  name: string;
  price: string;
  description: string;
  image: string;
};

type MenuCategory = {
  name: string;
  slug: string;
  note: string;
  image: string;
  items: MenuItem[];
};

type CartLine = MenuItem & { quantity: number };

const menuCategories: MenuCategory[] = [
  {
    name: 'Coffee',
    slug: 'coffee',
    note: 'Slow pours, bold roasts, familiar comforts.',
    image: espressoImage,
    items: [
      { name: 'Espresso', price: '₹100', description: 'A short, intense pull with a caramel finish.', image: espressoImage },
      { name: 'Cappuccino', price: '₹150', description: 'Velvety foam over our house espresso.', image: cappuccinoImage },
      { name: 'Cafe Latte', price: '₹160', description: 'Silky steamed milk, gently balanced.', image: latteImage },
      { name: 'Americano', price: '₹120', description: 'Espresso lengthened with hot water.', image: americanoImage },
      { name: 'Loaded Mocha', price: '₹180', description: 'Whipped cream, chocolate drizzle and a striped wafer.', image: loadedMochaImage },
      { name: 'Artisan Mocha', price: '₹170', description: 'House chocolate folded into espresso and milk.', image: artisanMochaImage },
      { name: 'Cortado', price: '₹140', description: 'A neat equal measure of coffee and warm milk.', image: cortadoImage },
      { name: 'Flat White', price: '₹150', description: 'Microfoam and a double shot, quietly strong.', image: flatWhiteImage },
    ],
  },
  {
    name: 'Pizza',
    slug: 'pizza',
    note: 'Thin bases, bright toppings and a little char.',
    image: '/images/mains.jpg',
    items: [
      { name: 'Margherita Pizza', price: '₹280', description: 'Tomato, basil and melted mozzarella on a thin base.', image: '/images/mains.jpg' },
      { name: 'Farmhouse Veg Pizza', price: '₹320', description: 'Roasted vegetables, herbs and generous cheese.', image: '/images/mains.jpg' },
      { name: 'Pesto Garden Pizza', price: '₹340', description: 'Pesto, peppers, corn and fresh mozzarella.', image: '/images/mains.jpg' },
      { name: 'Smoky Paneer Pizza', price: '₹360', description: 'Tandoori paneer, onion and a smoky tomato base.', image: '/images/mains.jpg' },
    ],
  },
  {
    name: 'Pasta',
    slug: 'pasta',
    note: 'Unhurried plates, generous and made to order.',
    image: '/images/mains.jpg',
    items: [
      { name: 'Arrabbiata Pasta', price: '₹250', description: 'Tomato, garlic and chilli with a lively finish.', image: '/images/mains.jpg' },
      { name: 'Alfredo Pasta', price: '₹260', description: 'Silken cream sauce, parmesan and black pepper.', image: '/images/mains.jpg' },
      { name: 'Aglio e Olio', price: '₹240', description: 'Olive oil, garlic, chilli and parsley.', image: '/images/mains.jpg' },
      { name: 'Pesto Penne', price: '₹280', description: 'Basil pesto, roasted vegetables and toasted seeds.', image: '/images/mains.jpg' },
    ],
  },
  {
    name: 'Shakes',
    slug: 'shakes',
    note: 'Cold, creamy and made for long afternoons.',
    image: '/images/cold-beverages.jpg',
    items: [
      { name: 'Classic Cold Coffee', price: '₹190', description: 'Creamy, chilled coffee with a soft sweetness.', image: '/images/cold-beverages.jpg' },
      { name: 'Mango Smoothie', price: '₹200', description: 'Seasonal mango blended until plush and cold.', image: '/images/cold-beverages.jpg' },
      { name: 'Berry Frappe', price: '₹220', description: 'A tangy berry blend with a snowy finish.', image: '/images/cold-beverages.jpg' },
      { name: 'Chocolate Hazelnut Shake', price: '₹240', description: 'Roasted hazelnut, cocoa and a thick, cold finish.', image: '/images/cold-beverages.jpg' },
    ],
  },
];

const reviews = [
  { name: 'Rhea Sharma', text: 'The coffee, the clay textures, the floor seating — everything feels considered and unhurried.', date: 'Visited this month' },
  { name: 'Arjun Mehta', text: 'A genuinely calm place near Assi. The cappuccino was beautiful and the staff made us feel at home.', date: 'Visited last week' },
  { name: 'Maya Kapoor', text: 'Terracotta Cafe is exactly the kind of place you hope to find while walking around Varanasi.', date: 'Visited recently' },
  { name: 'Kabir Singh', text: 'The loaded mocha is indulgent without being too sweet. We stayed for hours and never felt rushed.', date: 'Visited this month' },
  { name: 'Ananya Rao', text: 'Warm light, great vegetarian food and a lovely view of the cafe life around Assi Ghat.', date: 'Visited last month' },
  { name: 'Dev Malhotra', text: 'The flat white was precise, the playlist was perfect, and the whole room had an easy rhythm.', date: 'Visited recently' },
];

type ReservationForm = {
  fullName: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
};

const initialReservation: ReservationForm = { fullName: '', phone: '', date: '', time: '', guests: '2', notes: '' };

const priceValue = (price: string) => Number(price.replace(/[^\d]/g, ''));
const formatPrice = (amount: number) => `₹${amount}`;

function Header({ cartCount }: { cartCount: number }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const isReservationPage = location.startsWith('/reservations');
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-40 ${isScrolled ? 'is-scrolled' : ''} ${isReservationPage ? 'is-reservation' : ''}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link href={appPath('/')} data-testid="link-logo" className="header-logo group flex items-center gap-3">
          <span className="header-logo-mark flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))]"><span className="font-display text-xl">T</span></span>
          <span className="header-wordmark hidden text-sm font-semibold tracking-[0.15em] text-[hsl(var(--foreground))] sm:inline">TERRACOTTA</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          <Link href={appPath('/')} data-testid="link-home" className="header-nav-link text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Home</Link>
          <Link href={appPath('/menu')} data-testid="link-menu" className="header-nav-link text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Menu</Link>
          <Link href={appPath('/reservations')} data-testid="link-reservations" className="header-nav-link text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Reservations</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href={appPath('/menu#cart')} data-testid="link-header-cart" className="header-cart-link relative hidden items-center gap-2 border border-[hsl(var(--border))] px-3 py-2 text-xs font-semibold text-[hsl(var(--foreground))] sm:inline-flex">
            <ShoppingBag size={15} aria-hidden="true" /> Cart
            {cartCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--accent))] px-1 text-[10px]">{cartCount}</span>}
          </Link>
          <Link href={appPath('/reservations')} data-testid="link-header-book" className="header-book-link button-primary inline-flex items-center gap-2 rounded-sm bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-semibold tracking-[0.08em] text-[hsl(var(--primary-foreground))]">Book a Table <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-12 lg:py-20">
        <div><p className="font-display text-3xl">The Terracotta Cafe</p><p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(var(--primary-foreground))]/60">A warm corner for artisanal coffee, generous plates and time well spent near Assi Ghat.</p></div>
        <div><p className="eyebrow !text-[hsl(var(--accent))]">Find us</p><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--primary-foreground))]/75">Address:<br />B1/146, Pushkar Talab Rd, Assi, Varanasi</p></div>
        <div><p className="eyebrow !text-[hsl(var(--accent))]">Talk to us</p><a href="tel:+919129610006" data-testid="link-footer-phone" className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75 hover:text-[hsl(var(--accent))]"><Phone size={15} aria-hidden="true" /> Phone: +91 91296 10006</a><p className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75"><Clock3 size={15} aria-hidden="true" /> Hours: 8:15 AM - 11:00 PM</p></div>
        <div><p className="eyebrow !text-[hsl(var(--accent))]">Stay awhile</p><a href={appPath('/reservations')} data-testid="link-footer-reservations" className="mt-4 inline-flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75 hover:text-[hsl(var(--accent))]">Reserve a table <ArrowUpRight size={15} aria-hidden="true" /></a></div>
      </div>
      <div className="flex flex-col gap-3 border-t border-[hsl(var(--primary-foreground))]/15 px-5 py-6 text-center font-mono text-[10px] tracking-[0.17em] text-[hsl(var(--primary-foreground))]/55 sm:flex-row sm:items-center sm:justify-between sm:text-left" data-testid="text-footer-credit">
        <span>Made by Akshat Rastogi</span>
        <a className="tracking-normal hover:text-[hsl(var(--accent))]" href="mailto:akshat2592002@gmail.com">akshat2592002@gmail.com</a>
      </div>
    </footer>
  );
}

function HomePage() {
  const [reviewsOpen, setReviewsOpen] = useState(false);
  usePageMeta();
  return (
    <>
      <main id="top">
        <section className="relative mx-auto grid min-h-[760px] max-w-7xl items-end gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-40">
          <div className="relative z-10 max-w-xl reveal">
            <p className="hero-quote mb-8 max-w-sm font-display text-xl italic leading-relaxed text-[hsl(var(--primary))] sm:text-2xl">“Slow mornings, warm cups, good company.”</p>
            <p className="eyebrow mb-6">A table by the river · Varanasi</p>
            <h1 className="font-display max-w-[11ch] text-[clamp(4rem,10vw,8.8rem)] leading-[0.88] tracking-[-0.045em]">The Terracotta Cafe</h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">Artisanal Coffee &amp; Cozy Vibes near Assi Ghat</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a href={appPath('/reservations')} data-testid="button-hero-book" className="button-primary inline-flex items-center gap-3 rounded-sm bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))]">Book a Table <ArrowRight size={17} aria-hidden="true" /></a>
              <a href={appPath('/menu')} data-testid="link-hero-menu" className="inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-sm font-medium text-[hsl(var(--primary))]">Explore the menu <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            <div className="mt-16 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]"><span className="h-px w-10 bg-[hsl(var(--accent))]" />Open daily · 8:15 AM — 11:00 PM</div>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <img src={heroImage} alt="The cafe interior with a Terracotta Cafe logo on the table, plants, and a hanging pendant light" className="hero-image absolute inset-0 h-full w-full object-cover" />
            <div className="image-shade absolute inset-0" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[hsl(var(--primary-foreground))] sm:bottom-8 sm:left-8 sm:right-8"><p className="max-w-[15ch] font-display text-2xl leading-tight sm:text-3xl">Come in for a while.</p><span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">Assi · 2024</span></div>
          </div>
          <div className="pointer-events-none absolute -bottom-12 -left-24 hidden h-56 w-56 rounded-full border border-[hsl(var(--accent))] opacity-60 lg:block" />
        </section>
        <section id="about" className="scroll-mt-20 border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary))]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.76fr_1fr] lg:gap-24 lg:px-12 lg:py-28">
            <div><p className="eyebrow mb-5">Our corner of Assi</p><h2 className="font-display max-w-md text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl">The kind of place you find, then keep.</h2></div>
            <div className="grid gap-8 text-[hsl(var(--muted-foreground))] sm:grid-cols-2"><p className="text-lg leading-relaxed">Built around slow mornings and longer conversations, our warm ambiance carries the easy rhythm of Assi Ghat. Clay, cane and sunlight make room for you to settle in.</p><p className="text-lg leading-relaxed">Our artisanal coffee is roasted with care and brewed to order. And when the day calls for a little more ease, there is always a cushion waiting in our signature floor seating.</p></div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-12 gap-y-4 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Slow coffee</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Brewed one cup at a time</p></div>
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Floor seating</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Our signature way to stay</p></div>
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Near Assi Ghat</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">A short walk from the river</p></div>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-24">
          <div className="review-callout flex flex-col gap-8 border-y border-[hsl(var(--border))] py-8 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="eyebrow mb-3">A little love from our tables</p><h2 className="font-display text-4xl">Come for the coffee. Stay for the feeling.</h2></div>
            <button type="button" data-testid="button-reviews" onClick={() => setReviewsOpen(true)} className="inline-flex shrink-0 items-center gap-3 self-start border border-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary))] transition hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))]"><span className="flex gap-0.5 text-[hsl(var(--accent))]">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true" />)}</span> Read our reviews <ArrowUpRight size={15} /></button>
          </div>
        </section>
      </main>
      {reviewsOpen && <ReviewModal onClose={() => setReviewsOpen(false)} />}
    </>
  );
}

function ReviewModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return createPortal(
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5" role="dialog" aria-modal="true" aria-labelledby="reviews-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="review-modal max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm bg-[hsl(var(--card))] p-6 shadow-2xl sm:p-10">
        <div className="mb-8 flex items-start justify-between gap-5 border-b border-[hsl(var(--border))] pb-6"><div><p className="eyebrow">What guests say</p><h2 id="reviews-title" className="mt-2 font-display text-4xl">Good words, shared slowly.</h2></div><button type="button" aria-label="Close reviews" onClick={onClose} className="rounded-full p-2 hover:bg-[hsl(var(--muted))]"><X size={20} /></button></div>
        <div className="grid gap-5 sm:grid-cols-2">{reviews.map((review) => <article key={review.name} className="review-card border border-[hsl(var(--border))] p-5"><div className="flex items-center justify-between gap-4"><div className="flex gap-0.5 text-[hsl(var(--accent))]" aria-label="5 out of 5 stars">{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill="currentColor" aria-hidden="true" />)}</div><span className="font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">5.0 / 5</span></div><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">“{review.text}”</p><p className="mt-5 font-semibold">{review.name}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">{review.date}</p></article>)}</div>
      </div>
    </div>,
    document.body,
  );
}

function MenuPage({ cart, setCart }: { cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>> }) {
  const [activeSlug, setActiveSlug] = useState('coffee');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [orderError, setOrderError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [feedbackItem, setFeedbackItem] = useState<string | null>(null);
  const [location] = useLocation();
  const activeCategory = menuCategories.find((category) => category.slug === activeSlug) ?? menuCategories[0];
  const total = cart.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!location.includes('#cart') && window.location.hash !== '#cart') return;
    const timer = window.setTimeout(() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => window.clearTimeout(timer);
  }, [location]);

  const addToCart = (item: MenuItem) => {
    setOrderSuccess(false);
    setFeedbackItem(item.name);
    window.setTimeout(() => setFeedbackItem((current) => current === item.name ? null : current), 1200);
    setCart((current) => {
      const existing = current.find((line) => line.name === item.name);
      return existing ? current.map((line) => line.name === item.name ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { ...item, quantity: 1 }];
    });
  };
  const updateQuantity = (name: string, delta: number) => setCart((current) => current.flatMap((item) => item.name === name ? (item.quantity + delta > 0 ? [{ ...item, quantity: item.quantity + delta }] : []) : [item]));
  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOrderError('');
    if (!customerName.trim() || phone.trim().length < 10 || !tableNumber.trim() || cart.length === 0) {
      setOrderError('Please add your name, 10-digit phone number, table number and at least one item.');
      return;
    }
    try {
      const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerName, phone: `+91 ${phone}`, tableNumber, total, items: cart.map(({ name, quantity, price }) => ({ name, quantity, price: priceValue(price) })) }) });
      if (!response.ok) throw new Error('Unable to place order');
      setOrderSuccess(true);
    } catch {
      setOrderError('We could not place your order right now. Please try again.');
    }
  };

  return (
    <main id="menu" className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
      <div className="mb-10 max-w-2xl reveal"><p className="eyebrow mb-5">From our kitchen</p><h1 className="font-display text-6xl leading-none tracking-[-0.04em] sm:text-8xl">Good things, <em className="text-[hsl(var(--primary))]">made slowly.</em></h1><p className="mt-6 max-w-xl text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">Choose a table, choose your cup, and let the afternoon take its time.</p></div>
      <div className="mb-10 flex flex-wrap gap-2 border-y border-[hsl(var(--border))] py-4" role="tablist" aria-label="Menu categories">
        {menuCategories.map((category) => <button type="button" role="tab" aria-selected={activeSlug === category.slug} key={category.slug} onClick={() => setActiveSlug(category.slug)} className={`category-tab ${activeSlug === category.slug ? 'is-active' : ''}`}>{category.name}</button>)}
      </div>
      <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="font-mono text-xs text-[hsl(var(--primary))]">01 / 04</p><h2 className="mt-1 font-display text-4xl">{activeCategory.name}</h2><p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{activeCategory.note}</p></div><p className="font-mono text-xs uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">{activeCategory.items.length} delicious {activeCategory.name.toLowerCase()}</p></div>
      <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="grid gap-4 sm:grid-cols-2">
          {activeCategory.items.map((item, itemIndex) => <article key={item.name} data-testid={`card-menu-${activeSlug}-${itemIndex}`} className="menu-card overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <div className="aspect-[4/5] overflow-hidden bg-[hsl(var(--muted))]"><img src={item.image} alt={`${item.name} at The Terracotta Cafe`} className="h-full w-full object-cover" loading={itemIndex < 2 ? 'eager' : 'lazy'} /></div>
            <div className="p-5"><div className="flex items-start justify-between gap-4"><h3 className="font-display text-2xl leading-tight">{item.name}</h3><span className="shrink-0 pt-1 font-mono text-sm text-[hsl(var(--primary))]">{item.price}</span></div><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{item.description}</p><button type="button" data-testid={`button-add-${activeSlug}-${itemIndex}`} onClick={() => addToCart(item)} className={`button-primary add-order-button mt-5 flex w-full items-center justify-center gap-2 border border-[hsl(var(--primary))] px-4 py-3 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] ${feedbackItem === item.name ? 'is-added' : ''}`} aria-live="polite">{feedbackItem === item.name ? <><Check size={16} /> Added <span className="add-order-badge">+1</span></> : <><Plus size={16} /> Add to Order</>}</button></div>
          </article>)}
        </div>
        <aside id="cart" className="order-panel scroll-mt-24 rounded-sm bg-[hsl(var(--secondary))] p-5 sm:p-7 lg:sticky lg:top-24" aria-label="Dine-in cart">
          <div className="flex items-center justify-between border-b border-[hsl(var(--foreground))]/15 pb-5"><div><p className="eyebrow">Dine-in only</p><h2 className="mt-1 font-display text-3xl">Dine-In Details</h2></div><ShoppingBag className="text-[hsl(var(--primary))]" size={23} /></div>
          {orderSuccess ? <OrderSuccess cart={cart} total={total} /> : <form onSubmit={submitOrder} className="mt-6">
            {cart.length === 0 ? <div className="border border-dashed border-[hsl(var(--foreground))]/20 px-4 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">Your order is empty.<br />Add something lovely from the menu.</div> : <div className="space-y-3">{cart.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 border-b border-[hsl(var(--foreground))]/10 pb-3"><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">{formatPrice(priceValue(item.price) * item.quantity)}</p></div><div className="flex items-center gap-2"><button type="button" aria-label={`Remove one ${item.name}`} onClick={() => updateQuantity(item.name, -1)} className="rounded-full border border-[hsl(var(--foreground))]/20 p-1"><Minus size={12} /></button><span className="w-4 text-center text-sm">{item.quantity}</span><button type="button" aria-label={`Add one ${item.name}`} onClick={() => updateQuantity(item.name, 1)} className="rounded-full border border-[hsl(var(--foreground))]/20 p-1"><Plus size={12} /></button></div></div>)}</div>}
            <div className="mt-5 grid gap-4"><label><span className="field-label">Customer Name</span><input required value={customerName} onChange={(event) => setCustomerName(event.target.value)} className="input-field w-full px-3.5 py-3" placeholder="Your name" /></label><label><span className="field-label">Phone Number</span><span className="phone-field"><span className="font-semibold text-[hsl(var(--primary))]">+91</span><input required value={phone} onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))} className="min-w-0 flex-1 bg-transparent py-3 outline-none" placeholder="00000 00000" inputMode="numeric" /></span></label><label><span className="field-label">Table Number</span><input required value={tableNumber} onChange={(event) => setTableNumber(event.target.value)} className="input-field w-full px-3.5 py-3" placeholder="e.g. T-14" /></label></div>
            {orderError && <p role="alert" className="mt-4 text-xs text-[hsl(var(--destructive))]">{orderError}</p>}
            <div className="mt-6 flex items-center justify-between border-t border-[hsl(var(--foreground))]/15 pt-5"><span className="text-sm text-[hsl(var(--muted-foreground))]">Total</span><strong className="font-display text-2xl">{formatPrice(total)}</strong></div><button type="submit" data-testid="button-place-order" disabled={cart.length === 0} className="button-primary mt-5 flex w-full items-center justify-center gap-3 rounded-sm bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))] disabled:cursor-not-allowed disabled:opacity-50">Place Dine-In Order <ArrowRight size={17} /></button>
            <p className="mt-3 text-center text-xs text-[hsl(var(--muted-foreground))]">We will confirm your order at the table.</p>
          </form>}
        </aside>
      </div>
    </main>
  );
}

function OrderSuccess({ cart, total }: { cart: CartLine[]; total: number }) {
  return <div className="mt-6" data-testid="order-success" role="status"><div className="border border-[hsl(var(--primary))]/25 bg-[hsl(var(--card))] p-5"><p className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))]"><Check size={17} />Your order has been placed sir/mam.</p><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Show this summary to the team when you settle in.</p></div><div className="mt-5 space-y-3 border-b border-[hsl(var(--foreground))]/15 pb-5">{cart.map((item) => <div key={item.name} className="flex justify-between text-sm"><span>{item.quantity} × {item.name}</span><span>{formatPrice(priceValue(item.price) * item.quantity)}</span></div>)}</div><div className="flex justify-between pt-5 font-semibold"><span>Total</span><span>{formatPrice(total)}</span></div></div>;
}

function ReservationsPage() {
  const [form, setForm] = useState<ReservationForm>(initialReservation);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const updateField = (field: keyof ReservationForm, value: string) => { setForm((current) => ({ ...current, [field]: value })); setSubmitted(false); setError(''); };
  const submitReservation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.fullName.trim() || form.phone.length < 10 || !form.date || !form.time || !form.guests) { setError('Please complete every required field before sending your request.'); return; }
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, phone: `+91 ${form.phone}`, guests: Number(form.guests) }) });
      if (!response.ok) throw new Error('Unable to save reservation');
      setSubmitted(true);
    } catch { setError('We could not save your reservation right now. Please try again.'); }
  };
  return (
    <main id="reservations" className="border-t border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-32 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="reveal">
          <p className="eyebrow !text-[hsl(var(--accent))]">Pull up a chair</p>
          <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-[-0.04em] sm:text-8xl">Save a little space for a good day.</h1>
          <p className="mt-7 max-w-sm text-base leading-relaxed text-[hsl(var(--primary-foreground))]/75">Tell us when you would like to settle in. Our team will confirm your table by phone.</p>
          <div className="mt-10 space-y-4 border-t border-[hsl(var(--primary-foreground))]/20 pt-6 text-sm text-[hsl(var(--primary-foreground))]/80">
            <p className="flex items-center gap-3"><Clock3 size={16} /> Daily, 8:15 AM — 11:00 PM</p>
            <p className="flex items-center gap-3"><MapPin size={16} /> B1/146, Pushkar Talab Rd, Assi</p>
          </div>
        </div>
        <form onSubmit={submitReservation} noValidate className="rounded-sm bg-[hsl(var(--card))] p-6 text-[hsl(var(--foreground))] sm:p-9">
          <div className="mb-8 flex items-end justify-between gap-4 border-b border-[hsl(var(--border))] pb-5">
            <div><p className="eyebrow">Reservation request</p><h2 className="mt-2 font-display text-3xl">Your table, your time.</h2></div>
            <CalendarDays size={24} className="mb-1 text-[hsl(var(--primary))]" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="field-label">Name</span><input required data-testid="input-full-name" value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} className="input-field w-full px-3.5 py-3" placeholder="Your name" autoComplete="name" /></label>
            <label className="sm:col-span-2"><span className="field-label">Phone Number</span><span className="phone-field"><span className="font-semibold text-[hsl(var(--primary))]">+91</span><input required data-testid="input-phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))} className="min-w-0 flex-1 bg-transparent py-3 outline-none" placeholder="00000 00000" inputMode="numeric" /></span></label>
            <label><span className="field-label">Date</span><input required data-testid="input-date" type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(event) => updateField('date', event.target.value)} className="input-field w-full px-3.5 py-3" /></label>
            <label><span className="field-label">Time</span><input required data-testid="input-time" type="time" min="08:15" max="23:00" value={form.time} onChange={(event) => updateField('time', event.target.value)} className="input-field w-full px-3.5 py-3" /></label>
            <label className="sm:col-span-2">
              <span className="field-label">Number of Guests</span>
              <span className="relative block">
                <Users size={16} className="pointer-events-none absolute left-3 top-3.5 text-[hsl(var(--muted-foreground))]" />
                <select required data-testid="input-guests" value={form.guests} onChange={(event) => updateField('guests', event.target.value)} className="input-field w-full appearance-none px-9 py-3">
                  {Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={String(index + 1)}>{index + 1} {index === 0 ? 'guest' : 'guests'}</option>)}
                </select>
              </span>
            </label>
            <label className="sm:col-span-2"><span className="field-label">Special Notes</span><textarea data-testid="input-notes" value={form.notes} onChange={(event) => updateField('notes', event.target.value)} className="input-field min-h-24 w-full resize-y px-3.5 py-3" placeholder="A birthday, floor seating, or anything we should know" /></label>
          </div>
          {error && <p role="alert" className="mt-4 text-xs text-[hsl(var(--destructive))]">{error}</p>}
          <button data-testid="button-confirm-reservation" type="submit" className="button-primary mt-7 flex w-full items-center justify-center gap-3 rounded-sm bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))]">Confirm Reservation <ArrowRight size={17} /></button>
          {submitted && <div data-testid="status-reservation-ready" role="status" className="mt-5 border border-[hsl(var(--primary))]/25 bg-[hsl(var(--secondary))] p-4 text-sm"><p className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))]"><Check size={16} /> Your reservation request is saved.</p><p className="mt-1 leading-relaxed text-[hsl(var(--muted-foreground))]">Our team will call you at +91 {form.phone} to confirm the table.</p></div>}
          <p className="mt-4 text-center text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Dine-in reservations only · confirmation happens by phone</p>
        </form>
      </div>
    </main>
  );
}

function usePageMeta() {
  useEffect(() => {
    document.title = 'The Terracotta Cafe — Artisanal Coffee near Assi Ghat';
    const description = 'The Terracotta Cafe near Assi Ghat, Varanasi. Artisanal coffee, warm plates and signature floor seating.';
    const setMeta = (selector: string, attributes: Record<string, string>) => {
      let tag = document.querySelector(selector);
      if (!tag) { tag = document.createElement('meta'); document.head.appendChild(tag); }
      Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
    };
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: 'The Terracotta Cafe' });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  }, []);
}

function CafeRouter({ cart, setCart }: { cart: CartLine[]; setCart: React.Dispatch<React.SetStateAction<CartLine[]>> }) {
  const [location] = useLocation();
  const page = location.startsWith('/menu') ? <MenuPage cart={cart} setCart={setCart} /> : location.startsWith('/reservations') ? <ReservationsPage /> : <HomePage />;
  return <div key={location} className="page-transition">{page}</div>;
}

function App() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={appBase}><div className="paper-grain min-h-[100dvh] overflow-hidden"><Header cartCount={cartCount} /><CafeRouter cart={cart} setCart={setCart} /><Footer /></div></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default function RootApp() {
  return <RoutedErrorBoundary><App /></RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}