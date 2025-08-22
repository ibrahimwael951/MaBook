import {
  Book,
  BookmarkCheck,
  Cog,
  Contact,
  Facebook,
  Headset,
  HeartPlus,
  Home,
  Info,
  Instagram,
  LucideIcon,
  NotebookTabs,
  Podcast,
  UserRoundPen,
  UsersRound,
  Youtube,
} from "lucide-react";

interface DefaultLinks {
  title: string;
  href: string;
  icon: LucideIcon;
}
interface DashLinks {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
}
export const Navbar: DefaultLinks[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Books", href: "/books", icon: Book },
  { title: "Community", href: "/community", icon: UsersRound },
  { title: "Posts", href: "/posts", icon: Podcast },
];
export const Navbar_Logged_In: DefaultLinks[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "Blogs", href: "/blogs", icon: Info },
  { title: "Books", href: "/books", icon: Book },
  { title: "New Post", href: "/newPost", icon: Podcast },
];
export const socialMedia: DefaultLinks[] = [
  { title: "instagram", href: "/", icon: Instagram },
  { title: "Facebook", href: "/about", icon: Facebook },
  { title: "Youtube", href: "/books", icon:  Youtube },
 
];
export const Company: DefaultLinks[] = [
  { title: "About", href: "/about", icon: Info },
  { title: "Contact Us", href: "/contact", icon: Contact },
  { title: "Sponsors", href: "/sponsors", icon: HeartPlus },
 
];
export const DashboardLinks: DashLinks[] = [
  {
    title: "Profile",
    href: "/profile",
    icon: UserRoundPen,
    description: "View and edit your personal information",
  },
  {
    title: "Settings",
    href: "/dashboard",
    icon: Cog,
    description: "Manage your account preferences",
  },
  {
    title: "My Blogs",
    href: "/dashboard/",
    icon: NotebookTabs,
    description: "See and manage your published blogs",
  },
  {
    title: "Book Marks",
    href: "/dashboard/",
    icon: BookmarkCheck,
    description: "Access your saved bookmarks",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Headset,
    description: "Get support or send us a message",
  },
];
