export interface Service {
  id: string;
  name: string;
  description: string;
  category: "Desarrollo" | "Diseño" | "Automatizacion" | "Marketing" | "Soporte";
  icon: string;
  featured: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  description: string;
  technologies: string[];
  result: string;
  image: string;
  link: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  stars: number;
  avatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
}

export interface FormSubmission {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  date: string;
}

export interface SocialPost {
  id: string;
  platform: "Facebook" | "Instagram" | "TikTok" | "LinkedIn" | "YouTube" | "Threads";
  caption: string;
  likes: string;
  comments: string;
  image: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords: string;
}

export interface Database {
  services: Service[];
  portfolio: Project[];
  testimonials: Testimonial[];
  blog: BlogPost[];
  formSubmissions: FormSubmission[];
  socialPosts: SocialPost[];
  seoSettings: SEOSettings;
}
