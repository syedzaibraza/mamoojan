export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  healthGoals: string[];
  labels: string[];
  dietTypes: string[];
  description: string;
  benefits: string[];
  ingredients: string;
  dosage: string;
  inStock: boolean;
  stockCount?: number;

  // WooCommerce (optional) - used on product detail pages.
  attributes?: Array<{
    name: string;
    options: string[];
    variation: boolean;
  }>;
  variations?: Array<{
    id: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    stockCount?: number;
    image?: string;
    attributes: Record<string, string>; // normalized keys, e.g. { size: "Large" }
  }>;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Shilajit Resin - Pure Himalayan",
    brand: "Focus N Rulz",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.8,
    reviewCount: 312,
    image: "https://images.unsplash.com/photo-1704597435621-ff7026f124fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYmFsJTIwcHJvZHVjdHMlMjBkaXNwbGF5JTIwbWluaW1hbHxlbnwxfHx8fDE3NzMwODc0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Herbal Supplements",
    healthGoals: ["Traditional Wellness", "Energy & Vitality"],
    labels: ["Best Seller"],
    dietTypes: ["Natural", "Himalayan"],
    description: "Pure Himalayan Shilajit resin, traditionally used for centuries for energy, stamina, and overall vitality. Sourced from high-altitude regions and minimally processed to preserve natural potency.",
    benefits: ["Supports natural energy levels", "Promotes overall vitality", "Rich in fulvic acid and minerals", "Traditional Ayurvedic wellness supplement"],
    ingredients: "Pure Himalayan Shilajit Resin (standardized to 60% fulvic acid), trace minerals",
    dosage: "Dissolve a pea-sized amount in warm water or milk. Take once or twice daily.",
    inStock: true,
    stockCount: 8,
  },
  {
    id: "2",
    name: "Shilajit Gummies - Daily Wellness",
    brand: "Focus N Rulz",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.6,
    reviewCount: 187,
    image: "https://images.unsplash.com/photo-1556739664-787e863d09c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjBndW1taWVzJTIwc3VwcGxlbWVudCUyMHdlbGxuZXNzfGVufDF8fHx8MTc3MzA4NzQ4N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Herbal Supplements",
    healthGoals: ["Traditional Wellness", "Everyday Lifestyle"],
    labels: ["New", "Best Seller"],
    dietTypes: ["Natural", "Easy to Take"],
    description: "Convenient daily wellness gummies made with shilajit extract. A modern take on traditional wellness, perfect for those who prefer a tasty supplement format.",
    benefits: ["Easy-to-take gummy format", "Supports daily wellness", "Natural shilajit extract", "Great taste with no bitter aftertaste"],
    ingredients: "Shilajit Extract, Glucose Syrup, Sugar, Pectin, Citric Acid, Natural Flavors, Coconut Oil",
    dosage: "Take 2 gummies daily, preferably with a meal.",
    inStock: true,
  },
  {
    id: "3",
    name: "Shilajit Energy Shot",
    brand: "Focus N Rulz",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.7,
    reviewCount: 245,
    image: "https://images.unsplash.com/photo-1763757933154-d55844eae856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmVyZ3klMjBzaG90JTIwc3VwcGxlbWVudCUyMGJvdHRsZXxlbnwxfHx8fDE3NzMwODc0ODd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Herbal Supplements",
    healthGoals: ["Energy & Vitality", "Traditional Wellness"],
    labels: ["Sale"],
    dietTypes: ["Natural", "Liquid Formula"],
    description: "Liquid shilajit energy supplement in a convenient shot format. Quick absorption for on-the-go energy and vitality support.",
    benefits: ["Fast-acting liquid formula", "Convenient single-serve shot", "Supports energy and focus", "Portable and easy to use"],
    ingredients: "Purified Water, Shilajit Extract, Honey, Citric Acid, Natural Flavors",
    dosage: "Take 1 shot daily. Shake well before use.",
    inStock: true,
  },
  {
    id: "4",
    name: "Joshanda Herbal Tea Mix",
    brand: "MamooJan",
    price: 9.99,
    rating: 4.5,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1577016029703-cc22a7c0c28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBiYWdzJTIwdHJhZGl0aW9uYWwlMjByZW1lZHl8ZW58MXx8fHwxNzczMDg3NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Herbal Supplements",
    healthGoals: ["Traditional Wellness", "Family & Culture"],
    labels: [],
    dietTypes: ["Natural", "Herbal"],
    description: "Traditional Joshanda herbal tea mix, a time-honored remedy popular in South Asian households. Made with a blend of warming herbs and spices.",
    benefits: ["Soothing herbal blend", "Traditional warming remedy", "Comforting taste", "Perfect for cold weather"],
    ingredients: "Licorice Root, Flaxseed, Violet Flowers, Hyssop, Fennel, Black Pepper, and traditional herbs",
    dosage: "Dissolve 1 sachet in hot water. Drink warm, 1-2 times daily as needed.",
    inStock: true,
  },
  {
    id: "5",
    name: "Mango Bites - Sweet Dried Mango",
    brand: "MamooJan",
    price: 6.99,
    originalPrice: 8.99,
    rating: 4.9,
    reviewCount: 428,
    image: "https://images.unsplash.com/photo-1770124129809-fe1fe6b7c23e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMG1hbmdvJTIwZnJ1aXQlMjBzbmFja3N8ZW58MXx8fHwxNzczMDg3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Snacks & Food",
    healthGoals: ["Family & Culture", "Everyday Lifestyle"],
    labels: ["Best Seller"],
    dietTypes: ["Vegetarian", "No Artificial Colors"],
    description: "Delicious sweet dried mango bites, a nostalgic snack that brings back the flavors of home. Perfect for sharing with family and friends.",
    benefits: ["Authentic mango flavor", "Great for snacking", "Shareable family treat", "No artificial preservatives"],
    ingredients: "Dried Mango, Sugar, Citric Acid, Natural Flavors",
    dosage: "Enjoy as a snack anytime. Store in a cool, dry place.",
    inStock: true,
  },
  {
    id: "6",
    name: "Mango Chunusa - Spiced Mango Candy",
    brand: "MamooJan",
    price: 5.99,
    rating: 4.4,
    reviewCount: 213,
    image: "https://images.unsplash.com/photo-1744182896574-a7b5c1a4b2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNhbmR5JTIwc3dlZXRzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczMDg3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Snacks & Food",
    healthGoals: ["Family & Culture"],
    labels: [],
    dietTypes: ["Vegetarian"],
    description: "Traditional spiced mango candy with a tangy-sweet kick. A beloved South Asian treat enjoyed by all ages.",
    benefits: ["Unique tangy-sweet flavor", "Traditional recipe", "Fun for all ages", "Great after-meal treat"],
    ingredients: "Mango Pulp, Sugar, Spices (including black salt, cumin), Citric Acid",
    dosage: "Enjoy 2-3 pieces as desired.",
    inStock: true,
  },
  {
    id: "7",
    name: "Hazmina Digestive Candy",
    brand: "MamooJan",
    price: 4.99,
    originalPrice: 6.49,
    rating: 4.3,
    reviewCount: 178,
    image: "https://images.unsplash.com/photo-1744182896574-a7b5c1a4b2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNhbmR5JTIwc3dlZXRzJTIwY29sb3JmdWx8ZW58MXx8fHwxNzczMDg3NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Snacks & Food",
    healthGoals: ["Traditional Wellness", "Family & Culture"],
    labels: ["Sale"],
    dietTypes: ["Vegetarian", "Natural"],
    description: "Traditional digestive candy with a blend of herbs and spices. A classic after-meal treat that aids digestion naturally.",
    benefits: ["Aids digestion naturally", "Pleasant herbal taste", "Traditional recipe", "Convenient candy format"],
    ingredients: "Sugar, Digestive Herbs, Black Salt, Cumin, Fennel, Ajwain, Citric Acid",
    dosage: "Enjoy 1-2 candies after meals.",
    inStock: true,
  },
  {
    id: "8",
    name: "Tongue Scraper - Stainless Steel",
    brand: "MamooJan",
    price: 7.99,
    rating: 4.7,
    reviewCount: 342,
    image: "https://images.unsplash.com/photo-1570586790173-a031eec3f21d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3BwZXIlMjB0b25ndWUlMjBzY3JhcGVyJTIwd2VsbG5lc3N8ZW58MXx8fHwxNzczMDg3NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Personal Care & Wellness",
    healthGoals: ["Everyday Lifestyle", "Traditional Wellness"],
    labels: ["Best Seller"],
    dietTypes: ["Reusable", "Eco-Friendly"],
    description: "Premium stainless steel tongue scraper for daily oral hygiene. An ancient Ayurvedic practice now made easy with modern design.",
    benefits: ["Improves oral hygiene", "Removes bacteria from tongue", "Durable stainless steel", "Easy to clean and reuse"],
    ingredients: "Medical-grade stainless steel",
    dosage: "Use daily in the morning before brushing teeth. Gently scrape tongue from back to front 5-10 times.",
    inStock: true,
  },
  {
    id: "9",
    name: "Alum Block - Natural Crystal",
    brand: "MamooJan",
    price: 6.49,
    rating: 4.5,
    reviewCount: 198,
    image: "https://images.unsplash.com/photo-1760651913970-98e38bd28f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtJTIwY3J5c3RhbCUyMHN0b25lJTIwbmF0dXJhbHxlbnwxfHx8fDE3NzMwODc0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Personal Care & Wellness",
    healthGoals: ["Everyday Lifestyle", "Traditional Wellness"],
    labels: [],
    dietTypes: ["Natural", "Chemical-Free"],
    description: "Natural alum crystal block, a traditional grooming essential used as an aftershave and natural deodorant. Chemical-free and long-lasting.",
    benefits: ["Natural antiseptic properties", "Soothes skin after shaving", "Acts as natural deodorant", "Long-lasting crystal block"],
    ingredients: "Potassium Alum (100% Natural Crystal)",
    dosage: "Wet the block and apply to skin after shaving. Can also be used as a natural deodorant.",
    inStock: true,
  },
  {
    id: "10",
    name: "MamooJan Classic Cap",
    brand: "MamooJan",
    price: 18.99,
    originalPrice: 22.99,
    rating: 4.6,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1771736813285-4ea70605d8cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNlYmFsbCUyMGNhcCUyMGZhc2hpb24lMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NzMwODc0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Lifestyle Products",
    healthGoals: ["Everyday Lifestyle", "Cultural Connection"],
    labels: ["New"],
    dietTypes: ["Cotton Blend", "Adjustable"],
    description: "Stylish MamooJan branded cap, perfect for everyday wear. Show your love for cultural connection with this comfortable and adjustable cap.",
    benefits: ["Comfortable all-day wear", "Adjustable fit", "Stylish design", "Quality embroidered branding"],
    ingredients: "Cotton/Polyester blend, metal buckle closure",
    dosage: "One size fits most. Adjustable strap for custom fit.",
    inStock: true,
  },
  {
    id: "11",
    name: "MamooJan Water Bottle",
    brand: "MamooJan",
    price: 14.99,
    rating: 4.8,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRlciUyMGJvdHRsZSUyMHN0YWlubGVzcyUyMHN0ZWVsfGVufDF8fHx8MTc3MzA3MjM4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Lifestyle Products",
    healthGoals: ["Everyday Lifestyle"],
    labels: [],
    dietTypes: ["BPA-Free", "Reusable"],
    description: "Durable stainless steel water bottle with MamooJan branding. Keep your drinks hot or cold while staying hydrated on the go.",
    benefits: ["Double-wall insulation", "Keeps drinks hot 12hrs / cold 24hrs", "BPA-free and eco-friendly", "Leak-proof lid"],
    ingredients: "18/8 Stainless Steel, BPA-Free lid, silicone seal",
    dosage: "Hand wash recommended. Capacity: 20oz / 600ml.",
    inStock: true,
  },
  {
    id: "12",
    name: "Celebration Greeting Cards Set",
    brand: "MamooJan",
    price: 12.99,
    originalPrice: 15.99,
    rating: 4.4,
    reviewCount: 67,
    image: "https://images.unsplash.com/photo-1766419989393-e49c265eb146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVldGluZyUyMGNhcmRzJTIwY2VsZWJyYXRpb24lMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NzMwODc0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Celebration Items",
    healthGoals: ["Family & Culture", "Cultural Connection"],
    labels: ["Sale"],
    dietTypes: ["Eco Paper", "Multi-Pack"],
    description: "Beautiful set of celebration greeting cards for various occasions. Perfect for Eid, birthdays, and cultural celebrations. Connects families with thoughtful messages.",
    benefits: ["Multi-occasion card set", "Beautiful cultural designs", "High-quality card stock", "Envelopes included"],
    ingredients: "Premium card stock paper, eco-friendly inks",
    dosage: "Set of 10 cards with matching envelopes.",
    inStock: true,
    stockCount: 5,
  },
  {
    id: "13",
    name: "Event Decoration Flags",
    brand: "MamooJan",
    price: 9.99,
    rating: 4.3,
    reviewCount: 54,
    image: "https://images.unsplash.com/photo-1763879537802-18dd4a76b3c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHBhcnR5JTIwZmxhZ3MlMjBkZWNvcmF0aW9uJTIwYnVudGluZ3xlbnwxfHx8fDE3NzMwODc0OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "Celebration Items",
    healthGoals: ["Family & Culture", "Cultural Connection"],
    labels: [],
    dietTypes: ["Reusable", "Indoor/Outdoor"],
    description: "Colorful event decoration flags for cultural celebrations, parties, and gatherings. Bring festive cheer to any occasion and connect with your heritage.",
    benefits: ["Vibrant colorful designs", "Reusable for multiple events", "Easy to hang and display", "Indoor and outdoor use"],
    ingredients: "Polyester fabric, nylon string",
    dosage: "Each pack includes 15 flags on a 10-foot string.",
    inStock: true,
  },
];

export const brands = [
  "MamooJan",
  "Focus N Rulz",
];

export const categories = [
  { name: "Herbal Supplements", slug: "herbal-supplements", count: 45 },
  { name: "Snacks & Food", slug: "snacks-food", count: 32 },
  { name: "Personal Care & Wellness", slug: "personal-care-wellness", count: 28 },
  { name: "Lifestyle Products", slug: "lifestyle-products", count: 20 },
  { name: "Celebration Items", slug: "celebration-items", count: 15 },
];

export const healthGoals = [
  { name: "Traditional Wellness", icon: "Leaf", slug: "traditional-wellness" },
  { name: "Family & Culture", icon: "Heart", slug: "family-culture" },
  { name: "Energy & Vitality", icon: "Zap", slug: "energy-vitality" },
  { name: "Everyday Lifestyle", icon: "Home", slug: "everyday-lifestyle" },
  { name: "Cultural Connection", icon: "Globe", slug: "cultural-connection" },
];

export const blogPosts = [
  {
    id: "1",
    title: "What is Shilajit? A Complete Guide to This Ancient Supplement",
    excerpt: "Discover the centuries-old Himalayan resin known as Shilajit — its origins, traditional uses, and why it's becoming a modern wellness staple.",
    category: "Wellness Guides",
    image: "https://images.unsplash.com/photo-1704597435621-ff7026f124fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwaGVyYmFsJTIwcHJvZHVjdHMlMjBkaXNwbGF5JTIwbWluaW1hbHxlbnwxfHx8fDE3NzMwODc0OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "March 5, 2026",
    readTime: "8 min read",
  },
  {
    id: "2",
    title: "Connecting Families Through Traditional Foods & Snacks",
    excerpt: "How sharing familiar snacks and treats from South Asian heritage helps bridge cultural gaps and keep family traditions alive.",
    category: "Culture & Family",
    image: "https://images.unsplash.com/photo-1710186012216-9b2cf2a800bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwZmFtaWx5JTIwZ2F0aGVyaW5nJTIwZm9vZHxlbnwxfHx8fDE3NzMwODc0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 28, 2026",
    readTime: "6 min read",
  },
  {
    id: "3",
    title: "The Benefits of Joshanda: Traditional Herbal Remedy Explained",
    excerpt: "Learn about Joshanda, the traditional herbal tea mix that has been a household staple for generations, and its soothing wellness benefits.",
    category: "Traditional Remedies",
    image: "https://images.unsplash.com/photo-1577016029703-cc22a7c0c28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBiYWdzJTIwdHJhZGl0aW9uYWwlMjByZW1lZHl8ZW58MXx8fHwxNzczMDg3NDk1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "February 20, 2026",
    readTime: "5 min read",
  },
];

export const reviews = [
  { id: "1", author: "Aisha K.", rating: 5, date: "Feb 28, 2026", title: "Authentic products, fast shipping!", text: "I've been looking for authentic Shilajit resin in the US and MamooJan delivers! The quality is excellent and it arrived quickly. Reminds me of products from back home.", helpful: 42 },
  { id: "2", author: "Rashid M.", rating: 5, date: "Feb 20, 2026", title: "Mango Bites are addictive!", text: "My whole family loves these Mango Bites. They taste just like the ones we used to get in Pakistan. Ordered 5 packs and they were gone in a week!", helpful: 35 },
  { id: "3", author: "Fatima S.", rating: 4, date: "Feb 15, 2026", title: "Great cultural products", text: "Love that MamooJan brings traditional products to the US. The Joshanda is perfect for cold weather and the greeting cards are beautiful for Eid.", helpful: 28 },
  { id: "4", author: "Omar H.", rating: 5, date: "Feb 10, 2026", title: "Best tongue scraper ever", text: "High quality stainless steel tongue scraper at an affordable price. Been using it daily for months and it still looks brand new. Highly recommend!", helpful: 19 },
];
