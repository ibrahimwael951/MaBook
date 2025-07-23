import { Book, Home, Info, LucideIcon, Podcast, UsersRound } from "lucide-react";

interface NavLinks {
  title: string;
  href: string;
  icon: LucideIcon;
}
export const Navbar: NavLinks[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Books", href: "/books", icon: Book },
  { title: "Community", href: "/community", icon: UsersRound  },
  { title: "Posts", href: "/posts", icon: Podcast },
];
