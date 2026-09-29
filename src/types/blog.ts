export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category_id: string;
  category_name: string;
  date: string; // formato dd/mm/aaaa
  excerpt: string;
  cover_url: string;
  cover_alt: string;
  content: string;
  created_at?: string;
}

export interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  author: string;
  author_url: string;
}
