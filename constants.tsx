import { Product, BlogPost } from './types.ts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Earthbound Terra Cotta Vase',
    price: 45.00,
    description: 'Hand-thrown terra cotta vase with a rustic glaze. Perfect for dried botanicals.',
    category: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviews: [
      { id: 'r1', user: 'Sarah J.', rating: 5, comment: 'Absolutely beautiful craftsmanship!', date: '2023-10-12' },
      { id: 'r2', user: 'Mark T.', rating: 4, comment: 'Smaller than expected but lovely.', date: '2023-11-05' }
    ]
  },
  {
    id: '2',
    name: 'Indigo Macramé Wall Hanging',
    price: 68.00,
    description: 'Intricately woven cotton wall art dyed with natural indigo.',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1528642252433-28956891632f?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviews: []
  },
  {
    id: '3',
    name: 'Twilight Forest Oil Painting',
    price: 120.00,
    description: 'Original 12x12 oil painting on stretched canvas capturing a misty forest at dusk.',
    category: 'Paintings',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviews: []
  },
  {
    id: 'l1',
    name: 'Celestial Hand-Glazed Urn',
    price: 240.00,
    description: 'A limited edition piece from Master Elena Vance. Featuring 24k gold leaf details and a unique midnight-blue gradient glaze. Only 10 pieces were ever created.',
    category: 'Ceramics',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviews: [],
    isLimited: true
  },
  {
    id: '4',
    name: 'DIY Beeswax Candle Kit',
    price: 32.00,
    description: 'Everything you need to make 5 pure beeswax candles at home.',
    category: 'DIY Kits',
    image: 'https://images.unsplash.com/photo-1602871171844-9a7294829715?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviews: []
  },
  {
    id: 'l2',
    name: 'Ancestral Silk Tapestry',
    price: 450.00,
    description: 'Woven over three months using rare heirloom silk. A true masterpiece of modern textile art by Master Liam Rivers.',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1544413647-b51049300985?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviews: [],
    isLimited: true
  },
  {
    id: '5',
    name: 'Hammered Silver Hoops',
    price: 55.00,
    description: 'Sterling silver hoop earrings with a hand-hammered texture.',
    category: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviews: []
  },
  {
    id: '6',
    name: 'Linen Embroidered Napkins',
    price: 28.00,
    description: 'Set of 4 soft linen napkins with botanical embroidery.',
    category: 'Textiles',
    image: 'https://images.unsplash.com/photo-1605370908691-0f75746c0397?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviews: []
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Slow Crafting',
    excerpt: 'In a world of mass production, why handmade goods still matter.',
    content: 'In our studio, we believe that time is the most valuable ingredient. When an artisan spends hours, days, or even weeks on a single object, they imbue it with a spirit that no machine can replicate. This is the art of slow crafting—a rejection of the disposable culture and a return to meaningful, long-lasting beauty.',
    author: 'Elena Vance',
    date: 'March 15, 2024',
    image: 'https://images.unsplash.com/photo-1459749411177-0421800673e6?auto=format&fit=crop&q=80&w=800',
    category: 'Philosophy'
  },
  {
    id: 'b2',
    title: 'Sustainable Dyeing Techniques',
    excerpt: 'Exploring natural colors derived from your own kitchen scraps.',
    content: 'Nature provides a palette far richer and safer than any synthetic chemical. From the warm ochre of onion skins to the vibrant fuschia of beetroots, your kitchen is a treasure trove of artisanal dyes. In this guide, we walk you through the gentle process of extracting these colors while respecting our environment.',
    author: 'Liam Rivers',
    date: 'March 22, 2024',
    image: 'https://images.unsplash.com/photo-1544413647-b51049300985?auto=format&fit=crop&q=80&w=800',
    category: 'Tutorial'
  }
];