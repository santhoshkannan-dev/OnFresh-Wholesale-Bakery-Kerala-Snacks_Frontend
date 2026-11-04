/**
 * OnFresh Demonstration Product & Category Data
 * 
 * NOTE: This demonstration data is used strictly for frontend layout and visual presentation
 * until the Django REST Framework product API (Phase 3) is connected.
 * Real pricing, inventory, and variants will be loaded authoritatively from the backend.
 */

export interface ProductVariantDemo {
  size: string;
  demoPrice: number;
  sku: string;
  moq: number; // Minimum wholesale order quantity
}

export interface ProductDemo {
  id: string;
  name: string;
  malayalamName?: string;
  categorySlug: string;
  categoryName: string;
  shortDescription: string;
  description: string;
  badge?: string;
  ingredients: string[];
  variants: ProductVariantDemo[];
  isFeatured: boolean;
  shelfLife: string;
  isDemo: true;
}

export interface CategoryDemo {
  id: string;
  slug: string;
  name: string;
  malayalamName?: string;
  description: string;
  varietyCount: string;
  highlight: string;
  availableSizes: string[];
}

export const DEMO_CATEGORIES: CategoryDemo[] = [
  {
    id: 'cat-1',
    slug: 'banana-chips',
    name: 'Banana Chips',
    malayalamName: 'നേന്ത്രക്കായ വറുത്തത്',
    description: 'Crispy golden chips sliced from premium Kerala Nendran raw bananas, lightly seasoned with turmeric and salt.',
    varietyCount: '4 Variants',
    highlight: 'Classic Yellow & Spicy Peri-Peri',
    availableSizes: ['250 g', '500 g', '1 kg'],
  },
  {
    id: 'cat-2',
    slug: 'traditional-snacks',
    name: 'Traditional Snacks',
    malayalamName: 'നാടൻ പലഹാരങ്ങൾ',
    description: 'Authentic festival and tea-time snacks prepared according to time-honoured Kerala recipes.',
    varietyCount: '6 Variants',
    highlight: 'Murukku, Pakkoda & Achappam',
    availableSizes: ['250 g', '500 g', '1 kg'],
  },
  {
    id: 'cat-3',
    slug: 'mixture-savouries',
    name: 'Mixture & Savouries',
    malayalamName: 'കേരള മിക്സ്ചർ',
    description: 'Crunchy sev, roasted peanuts, curry leaves, and fragrant spices blended into the beloved Kerala evening snack.',
    varietyCount: '5 Variants',
    highlight: 'Spicy Kerala & Mild Sweet Mixture',
    availableSizes: ['250 g', '500 g', '1 kg'],
  },
  {
    id: 'cat-4',
    slug: 'biscuits-cookies',
    name: 'Biscuits & Cookies',
    malayalamName: 'ബിസ്ക്കറ്റ് & കുക്കീസ്',
    description: 'Freshly baked melt-in-mouth butter cookies, coconut biscuits, and tea-dunking favourites.',
    varietyCount: '4 Variants',
    highlight: 'Bakery Butter & Jeera Cookies',
    availableSizes: ['250 g', '500 g', '1 kg'],
  },
  {
    id: 'cat-5',
    slug: 'bakery-products',
    name: 'Bakery Products',
    malayalamName: 'ബേക്കറി പലഹാരങ്ങൾ',
    description: 'Crisp cardamom rusks and traditional dry bakery bites baked fresh for retail counters.',
    varietyCount: '3 Variants',
    highlight: 'Double-baked Cardamom Rusk',
    availableSizes: ['400 g', '800 g', 'Bulk Box'],
  },
  {
    id: 'cat-6',
    slug: 'kerala-specialties',
    name: 'Kerala Specialties',
    malayalamName: 'നാടൻ പ്രത്യേകതകൾ',
    description: 'Sun-dried tapioca (kappa) chips and sweet-savoury jackfruit (chakka varuthathu) slices.',
    varietyCount: '3 Variants',
    highlight: 'Tapioca & Jackfruit Chips',
    availableSizes: ['250 g', '500 g', '1 kg'],
  },
];

export const DEMO_FEATURED_PRODUCTS: ProductDemo[] = [
  {
    id: 'prod-banana-chips-classic',
    name: 'Kerala Nendran Banana Chips',
    malayalamName: 'സ്വർണ്ണ നേന്ത്രക്കായ ചിപ്സ്',
    categorySlug: 'banana-chips',
    categoryName: 'Banana Chips',
    shortDescription: 'Golden, crispy, thin-sliced Nendran bananas fried with pure turmeric and rock salt.',
    description: 'Our signature wholesale product. Selected green Nendran plantains sourced from local plantations, thinly sliced and fried to an irresistible golden crisp. Sealed in high-barrier wholesale pouches to lock in freshness.',
    badge: 'Bestseller Wholesale',
    ingredients: ['Raw Nendran Plantains', 'Refined Vegetable Oil', 'Turmeric', 'Rock Salt'],
    variants: [
      { size: '250 g', demoPrice: 80, sku: 'ONF-BC-250', moq: 10 },
      { size: '500 g', demoPrice: 155, sku: 'ONF-BC-500', moq: 10 },
      { size: '1 kg', demoPrice: 300, sku: 'ONF-BC-1000', moq: 5 },
    ],
    isFeatured: true,
    shelfLife: '90 Days',
    isDemo: true,
  },
  {
    id: 'prod-tapioca-chips',
    name: 'Spicy Tapioca Chips (Kappa Chips)',
    malayalamName: 'എരിവുള്ള കപ്പ ചിപ്സ്',
    categorySlug: 'kerala-specialties',
    categoryName: 'Kerala Specialties',
    shortDescription: 'Crispy hand-sliced cassava chips tossed with fiery red chilli powder and salt.',
    description: 'Farm-fresh tapioca roots thinly sliced and crisped to golden perfection, coated with a balance of Kerala red chilli and salt. Highly popular snack in local bakeries and supermarkets.',
    badge: 'Popular Snack',
    ingredients: ['Fresh Tapioca Root', 'Refined Vegetable Oil', 'Red Chilli Powder', 'Salt'],
    variants: [
      { size: '250 g', demoPrice: 70, sku: 'ONF-KC-250', moq: 10 },
      { size: '500 g', demoPrice: 135, sku: 'ONF-KC-500', moq: 10 },
      { size: '1 kg', demoPrice: 260, sku: 'ONF-KC-1000', moq: 5 },
    ],
    isFeatured: true,
    shelfLife: '90 Days',
    isDemo: true,
  },
  {
    id: 'prod-kerala-murukku',
    name: 'Traditional Kerala Ribbon Murukku',
    malayalamName: 'നാടൻ റിബൺ മുറുക്ക്',
    categorySlug: 'traditional-snacks',
    categoryName: 'Traditional Snacks',
    shortDescription: 'Crunchy spiral ribbon snack infused with fragrant cumin seeds, sesame, and hing.',
    description: 'Authentic rice flour and urad dal ribbon murukku, seasoned with crushed cumin and sesame. Light on oil, perfectly crunchy, and ideal for retail tea shops and bakery counters.',
    badge: 'Tea-time Favourite',
    ingredients: ['Rice Flour', 'Urad Dal Flour', 'Sesame Seeds', 'Cumin Seeds', 'Asafoetida', 'Vegetable Oil', 'Salt'],
    variants: [
      { size: '250 g', demoPrice: 65, sku: 'ONF-MK-250', moq: 10 },
      { size: '500 g', demoPrice: 125, sku: 'ONF-MK-500', moq: 10 },
      { size: '1 kg', demoPrice: 240, sku: 'ONF-MK-1000', moq: 5 },
    ],
    isFeatured: true,
    shelfLife: '60 Days',
    isDemo: true,
  },
  {
    id: 'prod-special-kerala-mixture',
    name: 'Special Spicy Kerala Mixture',
    malayalamName: 'സ്പെഷ്യൽ കാര മിക്സ്ചർ',
    categorySlug: 'mixture-savouries',
    categoryName: 'Mixture & Savouries',
    shortDescription: 'Signature blend of gram flour sev, boondi, roasted peanuts, and fried curry leaves.',
    description: 'A classic Kerala staple. Crunchy sev, puffed boondi, fried split gram, roasted peanuts, and fragrant curry leaves tossed in a secret spice blend.',
    badge: 'High Bulk Demand',
    ingredients: ['Besan (Gram Flour)', 'Rice Flour', 'Peanuts', 'Curry Leaves', 'Garlic', 'Chilli Powder', 'Salt'],
    variants: [
      { size: '250 g', demoPrice: 75, sku: 'ONF-MX-250', moq: 10 },
      { size: '500 g', demoPrice: 145, sku: 'ONF-MX-500', moq: 10 },
      { size: '1 kg', demoPrice: 280, sku: 'ONF-MX-1000', moq: 5 },
    ],
    isFeatured: true,
    shelfLife: '75 Days',
    isDemo: true,
  },
  {
    id: 'prod-cardamom-rusk',
    name: 'Crispy Cardamom Tea Rusk',
    malayalamName: 'ഏലക്ക ബേക്കറി റസ്ക്',
    categorySlug: 'bakery-products',
    categoryName: 'Bakery Products',
    shortDescription: 'Double-baked crunchy wheat rusk infused with fragrant green Idukki cardamom.',
    description: 'Slow-baked with natural Idukki cardamom, making it the supreme accompaniment for morning and evening chai in bakeries and tea stalls.',
    badge: 'Bakery Classic',
    ingredients: ['Wheat Flour', 'Sugar', 'Vegetable Fat', 'Idukki Green Cardamom', 'Yeast', 'Milk Solids'],
    variants: [
      { size: '400 g', demoPrice: 60, sku: 'ONF-RK-400', moq: 12 },
      { size: '800 g', demoPrice: 115, sku: 'ONF-RK-800', moq: 8 },
    ],
    isFeatured: true,
    shelfLife: '120 Days',
    isDemo: true,
  },
  {
    id: 'prod-kerala-pakkoda',
    name: 'Crispy Kerala Onion Pakkoda',
    malayalamName: 'നാടൻ പക്കോഡ',
    categorySlug: 'traditional-snacks',
    categoryName: 'Traditional Snacks',
    shortDescription: 'Crunchy golden savoury fritters with crushed spices and fresh curry leaves.',
    description: 'Deep-fried golden savoury bites with a crunchy bite, spiced with cumin, fennel, and dried chillies. Rapid seller in grocery stores and supermarket snack sections.',
    badge: 'Crunchy Bite',
    ingredients: ['Gram Flour', 'Rice Flour', 'Onion Flavours', 'Curry Leaves', 'Fennel', 'Chilli', 'Salt'],
    variants: [
      { size: '250 g', demoPrice: 70, sku: 'ONF-PK-250', moq: 10 },
      { size: '500 g', demoPrice: 135, sku: 'ONF-PK-500', moq: 10 },
      { size: '1 kg', demoPrice: 260, sku: 'ONF-PK-1000', moq: 5 },
    ],
    isFeatured: true,
    shelfLife: '60 Days',
    isDemo: true,
  },
];
