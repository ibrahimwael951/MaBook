import {
  Book,
  BookmarkCheck,
  Cog,
  Headset,
  Home,
  Info,
  LucideIcon,
  NotebookTabs,
  Podcast,
  UserRoundPen,
  UsersRound,
} from "lucide-react";

interface NavLinks {
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
export const Navbar: NavLinks[] = [
  { title: "Home", href: "/", icon: Home },
  { title: "About", href: "/about", icon: Info },
  { title: "Books", href: "/books", icon: Book },
  { title: "Community", href: "/community", icon: UsersRound },
  { title: "Posts", href: "/posts", icon: Podcast },
];
export const DashboardLinks: DashLinks[] = [
  {
    title: "Profile",
    href: "/dashboard/",
    icon: UserRoundPen,
    description: "View and edit your personal information",
  },
  {
    title: "Settings",
    href: "/dashboard/",
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
    href: "/dashboard/",
    icon: Headset,
    description: "Get support or send us a message",
  },
];
