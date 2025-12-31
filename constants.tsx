import { Product, BlogPost } from './types.ts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Earthbound Terra Cotta Vase',
    price: 45.00,
    description: 'Hand-thrown terra cotta vase with a rustic glaze. Perfect for dried botanicals.',
    category: 'Ceramics',
    image: 'https://picsum.photos/seed/vase/600/600',
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
    image: 'https://picsum.photos/seed/macrame/600/600',
    rating: 4.9,
    reviews: []
  },
  {
    id: '3',
    name: 'Twilight Forest Oil Painting',
    price: 120.00,
    description: 'Original 12x12 oil painting on stretched canvas capturing a misty forest at dusk.',
    category: 'Paintings',
    image: 'https://picsum.photos/seed/painting/600/600',
    rating: 5.0,
    reviews: []
  },
  {
    id: '4',
    name: 'DIY Beeswax Candle Kit',
    price: 32.00,
    description: 'Everything you need to make 5 pure beeswax candles at home.',
    category: 'DIY Kits',
    image: 'https://picsum.photos/seed/candle/600/600',
    rating: 4.7,
    reviews: []
  },
  {
    id: '5',
    name: 'Hammered Silver Hoops',
    price: 55.00,
    description: 'Sterling silver hoop earrings with a hand-hammered texture.',
    category: 'Jewelry',
    image: 'https://picsum.photos/seed/jewelry/600/600',
    rating: 4.6,
    reviews: []
  },
  {
    id: '6',
    name: 'Linen Embroidered Napkins',
    price: 28.00,
    description: 'Set of 4 soft linen napkins with botanical embroidery.',
    category: 'Textiles',
    image: 'https://picsum.photos/seed/napkins/600/600',
    rating: 4.9,
    reviews: []
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'The Art of Slow Crafting',
    excerpt: 'In a world of mass production, why handmade goods still matter.',
    content: 'Full content about the philosophy of slow crafting...',
    author: 'Elena Vance',
    date: 'March 15, 2024',
    image: 'https://picsum.photos/seed/blog1/800/400',
    category: 'Philosophy'
  },
  {
    id: 'b2',
    title: 'Sustainable Dyeing Techniques',
    excerpt: 'Exploring natural colors derived from your own kitchen scraps.',
    content: 'Onions, beets, and turmeric - how to turn waste into art...',
    author: 'Liam Rivers',
    date: 'March 22, 2024',
    image: 'https://picsum.photos/seed/blog2/800/400',
    category: 'Tutorial'
  }
];