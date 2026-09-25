import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowRight, ArrowUpRight, CalendarDays, Check, Clock3, MapPin, Phone, Users } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type MenuItem = {
  name: string;
  price: string;
  description: string;
  image: string;
};

type MenuCategory = {
  name: string;
  note: string;
  image: string;
  items: MenuItem[];
};

const menuCategories: MenuCategory[] = [
  {
    name: 'Hot Beverages',
    note: 'Slow pours, bold roasts, familiar comforts.',
    image: '/images/hot-beverages.jpg',
    items: [
      { name: 'Espresso', price: '₹100', description: 'A short, intense pull with a caramel finish.', image: '/images/hot-beverages.jpg' },
      { name: 'Cappuccino', price: '₹150', description: 'Velvety foam over our house espresso.', image: '/images/hot-beverages.jpg' },
      { name: 'Cafe Latte', price: '₹160', description: 'Silky steamed milk, gently balanced.', image: '/images/hot-beverages.jpg' },
      { name: 'Americano', price: '₹120', description: 'Espresso lengthened with hot water.', image: '/images/hot-beverages.jpg' },
      { name: 'Signature Hot Chocolate', price: '₹180', description: 'Dark cocoa, warm milk and a soft spice note.', image: '/images/hot-beverages.jpg' },
      { name: 'Cafe Mocha', price: '₹170', description: 'House chocolate folded into espresso and milk.', image: '/images/hot-beverages.jpg' },
      { name: 'Cortado', price: '₹140', description: 'A neat equal measure of coffee and warm milk.', image: '/images/hot-beverages.jpg' },
      { name: 'Flat White', price: '₹150', description: 'Microfoam and a double shot, quietly strong.', image: '/images/hot-beverages.jpg' },
    ],
  },
  {
    name: 'Cold Beverages',
    note: 'Bright, chilled and made for long afternoons.',
    image: '/images/cold-beverages.jpg',
    items: [
      { name: 'Iced Latte', price: '₹180', description: 'Cold milk and espresso over clear ice.', image: '/images/cold-beverages.jpg' },
      { name: 'Classic Cold Coffee', price: '₹190', description: 'Creamy, chilled coffee with a soft sweetness.', image: '/images/cold-beverages.jpg' },
      { name: 'Peach Iced Tea', price: '₹150', description: 'Black tea, ripe peach and a squeeze of citrus.', image: '/images/cold-beverages.jpg' },
      { name: 'Lemon Iced Tea', price: '₹140', description: 'Brewed tea brightened with fresh lemon.', image: '/images/cold-beverages.jpg' },
      { name: 'Mango Smoothie', price: '₹200', description: 'Seasonal mango blended until plush and cold.', image: '/images/cold-beverages.jpg' },
      { name: 'Berry Frappe', price: '₹220', description: 'A tangy berry blend with a snowy finish.', image: '/images/cold-beverages.jpg' },
      { name: 'Virgin Mojito', price: '₹160', description: 'Mint, lime and sparkling water, no rush.', image: '/images/cold-beverages.jpg' },
    ],
  },
  {
    name: 'Snacks & Starters',
    note: 'Little plates for the middle of a good conversation.',
    image: '/images/snacks-starters.jpg',
    items: [
      { name: 'Classic French Fries', price: '₹120', description: 'Golden, crisp and sea-salt finished.', image: '/images/snacks-starters.jpg' },
      { name: 'Peri Peri Fries', price: '₹140', description: 'Crisp fries with a warm, smoky seasoning.', image: '/images/snacks-starters.jpg' },
      { name: 'Cheese Garlic Bread', price: '₹160', description: 'Toasted bread, garlic butter and bubbling cheese.', image: '/images/snacks-starters.jpg' },
      { name: 'Nachos with Salsa', price: '₹190', description: 'Corn chips, fresh salsa and a bright kick.', image: '/images/snacks-starters.jpg' },
      { name: 'Hummus & Pita', price: '₹220', description: 'Creamy chickpea hummus with warm pita wedges.', image: '/images/snacks-starters.jpg' },
      { name: 'Falafel Wrap', price: '₹180', description: 'Herb falafel, crisp salad and tahini in a wrap.', image: '/images/snacks-starters.jpg' },
      { name: 'Veg Club Sandwich', price: '₹170', description: 'Layered vegetables, toasted bread and house spread.', image: '/images/snacks-starters.jpg' },
      { name: 'Spinach & Corn Sandwich', price: '₹160', description: 'Creamed spinach, sweet corn and grilled bread.', image: '/images/snacks-starters.jpg' },
    ],
  },
  {
    name: 'Mains',
    note: 'Unhurried plates, generous and made to order.',
    image: '/images/mains.jpg',
    items: [
      { name: 'Arrabbiata Pasta', price: '₹250', description: 'Tomato, garlic and chilli with a lively finish.', image: '/images/mains.jpg' },
      { name: 'Alfredo Pasta', price: '₹260', description: 'Silken cream sauce, parmesan and black pepper.', image: '/images/mains.jpg' },
      { name: 'Aglio e Olio', price: '₹240', description: 'Olive oil, garlic, chilli and parsley.', image: '/images/mains.jpg' },
      { name: 'Margherita Pizza', price: '₹280', description: 'Tomato, basil and melted mozzarella on a thin base.', image: '/images/mains.jpg' },
      { name: 'Farmhouse Veg Pizza', price: '₹320', description: 'Roasted vegetables, herbs and generous cheese.', image: '/images/mains.jpg' },
    ],
  },
  {
    name: 'Desserts',
    note: 'A sweet last chapter, best shared slowly.',
    image: '/images/desserts.jpg',
    items: [
      { name: 'Fresh Carrot Cake', price: '₹150', description: 'Spiced carrot crumb with a tender cream finish.', image: '/images/desserts.jpg' },
      { name: 'Chocolate Walnut Brownie', price: '₹160', description: 'Dense chocolate, toasted walnuts and soft edges.', image: '/images/desserts.jpg' },
      { name: 'Blueberry Cheesecake', price: '₹220', description: 'Creamy cheesecake with a bright berry crown.', image: '/images/desserts.jpg' },
      { name: 'Caramel Slice', price: '₹120', description: 'Buttery biscuit, deep caramel and a neat finish.', image: '/images/desserts.jpg' },
    ],
  },
];

type ReservationForm = {
  fullName: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
};

const initialForm: ReservationForm = { fullName: '', phone: '', date: '', time: '', guests: '2' };

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [form, setForm] = useState<ReservationForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = 'The Terracotta Cafe — Artisanal Coffee near Assi Ghat';
    const description = 'The Terracotta Cafe near Assi Ghat, Varanasi. Artisanal coffee, warm plates and signature floor seating.';
    const setMeta = (selector: string, attributes: Record<string, string>) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        document.head.appendChild(tag);
      }
      Object.entries(attributes).forEach(([key, value]) => tag?.setAttribute(key, value));
    };
    setMeta('meta[name="description"]', { name: 'description', content: description });
    setMeta('meta[property="og:title"]', { property: 'og:title', content: 'The Terracotta Cafe' });
    setMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    setMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const updateField = (field: keyof ReservationForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSubmitted(false);
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof ReservationForm, string>> = {};
    if (!form.fullName.trim()) nextErrors.fullName = 'Please add your name.';
    if (!/^[+]?[\d\s-]{10,}$/.test(form.phone.trim())) nextErrors.phone = 'Please enter a valid phone number.';
    if (!form.date) nextErrors.date = 'Please choose a date.';
    if (!form.time) nextErrors.time = 'Please choose a time.';
    if (!form.guests) nextErrors.guests = 'Please select the number of guests.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) setSubmitted(true);
  };

  return (
    <div className="paper-grain min-h-[100dvh] overflow-hidden">
      <header className={`site-header fixed inset-x-0 top-0 z-40 ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#top" data-testid="link-logo" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[hsl(var(--primary))] text-[hsl(var(--primary))]">
              <span className="font-display text-xl">T</span>
            </span>
            <span className="hidden text-sm font-semibold tracking-[0.15em] text-[hsl(var(--foreground))] sm:inline">TERRACOTTA</span>
          </a>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <a href="#about" data-testid="link-about" className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Our story</a>
            <a href="#menu" data-testid="link-menu" className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Menu</a>
            <a href="#reservations" data-testid="link-reservations" className="text-sm text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--primary))]">Reservations</a>
          </nav>
          <a href="#reservations" data-testid="link-header-book" className="button-primary inline-flex items-center gap-2 rounded-sm bg-[hsl(var(--primary))] px-4 py-2.5 text-xs font-semibold tracking-[0.08em] text-[hsl(var(--primary-foreground))]">
            Book a Table <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto grid min-h-[760px] max-w-7xl items-end gap-10 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-12 lg:pb-24 lg:pt-40">
          <div className="relative z-10 max-w-xl reveal">
            <p className="eyebrow mb-6">A table by the river · Varanasi</p>
            <h1 className="font-display max-w-[11ch] text-[clamp(4rem,10vw,8.8rem)] leading-[0.88] tracking-[-0.045em] text-[hsl(var(--foreground))]">The Terracotta Cafe</h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[hsl(var(--muted-foreground))]">Artisanal Coffee &amp; Cozy Vibes near Assi Ghat</p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a href="#reservations" data-testid="button-hero-book" className="button-primary inline-flex items-center gap-3 rounded-sm bg-[hsl(var(--primary))] px-6 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))]">
                Book a Table <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a href="#menu" data-testid="link-hero-menu" className="inline-flex items-center gap-2 border-b border-[hsl(var(--primary))] pb-1 text-sm font-medium text-[hsl(var(--primary))]">Explore the menu <ArrowUpRight size={15} aria-hidden="true" /></a>
            </div>
            <div className="mt-16 flex items-center gap-3 text-xs text-[hsl(var(--muted-foreground))]">
              <span className="h-px w-10 bg-[hsl(var(--accent))]" />
              Open daily · 8:15 AM — 11:00 PM
            </div>
          </div>
          <div className="relative min-h-[390px] overflow-hidden rounded-sm lg:min-h-[625px]">
            <img src="/images/terracotta-hero.jpg" alt="Warm terracotta cafe interior with low seating and a coffee table" className="hero-image absolute inset-0 h-full w-full object-cover" />
            <div className="image-shade absolute inset-0" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-[hsl(var(--primary-foreground))] sm:bottom-8 sm:left-8 sm:right-8">
              <p className="max-w-[15ch] font-display text-2xl leading-tight sm:text-3xl">Come in for a while.</p>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] opacity-80">Assi · 2024</span>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-12 -left-24 hidden h-56 w-56 rounded-full border border-[hsl(var(--accent))] opacity-60 lg:block" />
        </section>

        <section id="about" className="scroll-mt-20 border-y border-[hsl(var(--border))] bg-[hsl(var(--secondary))]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.76fr_1fr] lg:gap-24 lg:px-12 lg:py-28">
            <div>
              <p className="eyebrow mb-5">Our corner of Assi</p>
              <h2 className="font-display max-w-md text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl">The kind of place you find, then keep.</h2>
            </div>
            <div className="grid gap-8 text-[hsl(var(--muted-foreground))] sm:grid-cols-2">
              <p className="text-lg leading-relaxed">Built around slow mornings and longer conversations, our warm ambiance carries the easy rhythm of Assi Ghat. Clay, cane and sunlight make room for you to settle in.</p>
              <p className="text-lg leading-relaxed">Our artisanal coffee is roasted with care and brewed to order. And when the day calls for a little more ease, there is always a cushion waiting in our signature floor seating.</p>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl flex-wrap gap-x-12 gap-y-4 px-5 pb-20 sm:px-8 lg:px-12 lg:pb-24">
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Slow coffee</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Brewed one cup at a time</p></div>
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Floor seating</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">Our signature way to stay</p></div>
            <div className="border-l-2 border-[hsl(var(--accent))] pl-4"><p className="font-display text-2xl">Near Assi Ghat</p><p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">A short walk from the river</p></div>
          </div>
        </section>

        <section id="menu" className="scroll-mt-20 mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-14 flex flex-col justify-between gap-5 border-b border-[hsl(var(--border))] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-5">From our kitchen</p>
              <h2 className="font-display text-5xl leading-none tracking-[-0.04em] sm:text-6xl">Good things, <em className="text-[hsl(var(--primary))]">made slowly.</em></h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Coffee for the first hour, plates for the next three. Everything is vegetarian and made for lingering.</p>
          </div>
          <div className="space-y-20">
            {menuCategories.map((category, categoryIndex) => (
              <section key={category.name} aria-labelledby={`category-${categoryIndex}`}>
                <div className="mb-7 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs text-[hsl(var(--primary))]">0{categoryIndex + 1}</p>
                    <h3 id={`category-${categoryIndex}`} className="mt-1 font-display text-3xl tracking-[-0.025em] sm:text-4xl">{category.name}</h3>
                    <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">{category.note}</p>
                  </div>
                  <span className="hidden h-px flex-1 bg-[hsl(var(--border))] sm:block" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--muted-foreground))]">{category.items.length} plates</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item, itemIndex) => (
                    <article key={item.name} data-testid={`card-menu-${categoryIndex}-${itemIndex}`} className="menu-card overflow-hidden rounded-sm border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                      <div className="relative aspect-[1.55] overflow-hidden bg-[hsl(var(--muted))]">
                        <img src={item.image} alt={`${item.name} at The Terracotta Cafe`} className="h-full w-full object-cover" loading={categoryIndex === 0 && itemIndex < 2 ? 'eager' : 'lazy'} />
                        <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--card))] px-2.5 py-1 font-mono text-xs text-[hsl(var(--primary))]">{item.price}</span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-display text-xl leading-tight">{item.name}</h4>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="reservations" className="scroll-mt-20 border-t border-[hsl(var(--border))] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <div className="mx-auto grid max-w-7xl gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:px-12 lg:py-28">
            <div>
              <p className="eyebrow !text-[hsl(var(--accent))]">Pull up a chair</p>
              <h2 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.04em] sm:text-6xl">Save a little space for a good day.</h2>
              <p className="mt-7 max-w-sm text-base leading-relaxed text-[hsl(var(--primary-foreground))]/75">Tell us when you would like to settle in. This form prepares your request for review; our team will confirm availability by phone.</p>
              <div className="mt-10 space-y-4 border-t border-[hsl(var(--primary-foreground))]/20 pt-6 text-sm text-[hsl(var(--primary-foreground))]/80">
                <p className="flex items-center gap-3"><Clock3 size={16} aria-hidden="true" /> Daily, 8:15 AM — 11:00 PM</p>
                <p className="flex items-center gap-3"><MapPin size={16} aria-hidden="true" /> B1/146, Pushkar Talab Rd, Assi</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} noValidate className="rounded-sm bg-[hsl(var(--card))] p-6 text-[hsl(var(--foreground))] sm:p-9">
              <div className="mb-8 flex items-end justify-between gap-4 border-b border-[hsl(var(--border))] pb-5">
                <div><p className="eyebrow">Reservation request</p><h3 className="mt-2 font-display text-3xl">Your table, your time.</h3></div>
                <CalendarDays size={24} className="mb-1 text-[hsl(var(--primary))]" aria-hidden="true" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">Full Name</span>
                  <input data-testid="input-full-name" aria-invalid={Boolean(errors.fullName)} value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} className="input-field w-full px-3.5 py-3" placeholder="Your name" autoComplete="name" />
                  {errors.fullName && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.fullName}</span>}
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">Phone Number</span>
                  <input data-testid="input-phone" aria-invalid={Boolean(errors.phone)} type="tel" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} className="input-field w-full px-3.5 py-3" placeholder="+91 00000 00000" autoComplete="tel" />
                  {errors.phone && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.phone}</span>}
                </label>
                <label>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">Date</span>
                  <input data-testid="input-date" aria-invalid={Boolean(errors.date)} type="date" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={(event) => updateField('date', event.target.value)} className="input-field w-full px-3.5 py-3" />
                  {errors.date && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.date}</span>}
                </label>
                <label>
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">Time</span>
                  <input data-testid="input-time" aria-invalid={Boolean(errors.time)} type="time" min="08:15" max="23:00" value={form.time} onChange={(event) => updateField('time', event.target.value)} className="input-field w-full px-3.5 py-3" />
                  {errors.time && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.time}</span>}
                </label>
                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em]">Number of Guests</span>
                  <span className="relative block">
                    <Users size={16} className="pointer-events-none absolute left-3 top-3.5 text-[hsl(var(--muted-foreground))]" aria-hidden="true" />
                    <select data-testid="input-guests" aria-invalid={Boolean(errors.guests)} value={form.guests} onChange={(event) => updateField('guests', event.target.value)} className="input-field w-full appearance-none px-9 py-3">
                      {Array.from({ length: 8 }, (_, index) => <option key={index + 1} value={String(index + 1)}>{index + 1} {index === 0 ? 'guest' : 'guests'}</option>)}
                    </select>
                  </span>
                  {errors.guests && <span className="mt-1 block text-xs text-[hsl(var(--destructive))]">{errors.guests}</span>}
                </label>
              </div>
              <button data-testid="button-confirm-reservation" type="submit" className="button-primary mt-7 flex w-full items-center justify-center gap-3 rounded-sm bg-[hsl(var(--primary))] px-5 py-3.5 text-sm font-semibold text-[hsl(var(--primary-foreground))]">Confirm Reservation <ArrowRight size={17} aria-hidden="true" /></button>
              {submitted && (
                <div data-testid="status-reservation-ready" role="status" className="mt-5 border border-[hsl(var(--primary))]/25 bg-[hsl(var(--secondary))] p-4 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-[hsl(var(--primary))]"><Check size={16} aria-hidden="true" /> Your request is ready to review.</p>
                  <p className="mt-1 leading-relaxed text-[hsl(var(--muted-foreground))]">Nothing has been sent or stored. Please call +91 91296 10006 so we can confirm your table.</p>
                </div>
              )}
              <p className="mt-4 text-center text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">Frontend-only request form · confirmation happens by phone</p>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[hsl(var(--foreground))] text-[hsl(var(--primary-foreground))]">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-[1.2fr_1fr_1fr_1fr] lg:px-12 lg:py-20">
          <div>
            <p className="font-display text-3xl">The Terracotta Cafe</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[hsl(var(--primary-foreground))]/60">A warm corner for artisanal coffee, generous plates and time well spent near Assi Ghat.</p>
          </div>
          <div><p className="eyebrow !text-[hsl(var(--accent))]">Find us</p><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--primary-foreground))]/75">Address:<br />B1/146, Pushkar Talab Rd, Assi, Varanasi</p></div>
          <div><p className="eyebrow !text-[hsl(var(--accent))]">Talk to us</p><a href="tel:+919129610006" data-testid="link-footer-phone" className="mt-4 flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75 hover:text-[hsl(var(--accent))]"><Phone size={15} aria-hidden="true" /> Phone: +91 91296 10006</a><p className="mt-3 flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75"><Clock3 size={15} aria-hidden="true" /> Hours: 8:15 AM - 11:00 PM</p></div>
          <div><p className="eyebrow !text-[hsl(var(--accent))]">Stay awhile</p><a href="#reservations" data-testid="link-footer-reservations" className="mt-4 inline-flex items-center gap-2 text-sm text-[hsl(var(--primary-foreground))]/75 hover:text-[hsl(var(--accent))]">Reserve a table <ArrowUpRight size={15} aria-hidden="true" /></a></div>
        </div>
        <div className="border-t border-[hsl(var(--primary-foreground))]/15 px-5 py-6 text-center font-mono text-[10px] tracking-[0.17em] text-[hsl(var(--primary-foreground))]/55" data-testid="text-footer-credit">Made by Akshat Rastogi</div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;