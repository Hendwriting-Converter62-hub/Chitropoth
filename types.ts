
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'Ceramics' | 'Textiles' | 'Paintings' | 'DIY Kits' | 'Jewelry';
  image: string;
  rating: number;
  reviews: Review[];
  isLimited?: boolean;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'Initiated' | 'Processing' | 'Delivered' | 'Shipped';
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

export enum Page {
  Home = 'home',
  Shop = 'shop',
  ProductDetail = 'product-detail',
  Blog = 'blog',
  BlogPost = 'blog-post',
  Cart = 'cart',
  Checkout = 'checkout',
  Auth = 'auth',
  Admin = 'admin',
  Profile = 'profile',
  Privacy = 'privacy',
  Terms = 'terms',
  Masters = 'masters',
  LimitedReleases = 'limited-releases',
  EthicalSourcing = 'ethical-sourcing',
  ContactCurator = 'contact-curator',
  JourneyLogistics = 'journey-logistics',
  StudioReturns = 'studio-returns'
}