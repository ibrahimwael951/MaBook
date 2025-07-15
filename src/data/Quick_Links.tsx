import { Book, Home, Info, LucideIcon, Newspaper, Podcast } from "lucide-react";

interface NavLinks {
  title: string;
  href: string;
  icon: LucideIcon;
}
export const Navbar: NavLinks[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Books", href: "/books", icon: Book },
  { title: "News", href: "/news", icon: Newspaper },
  { title: "Posts", href: "/posts", icon: Podcast },
];
