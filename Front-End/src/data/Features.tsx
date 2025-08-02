import {
  BookHeart,
  BookUp2,
  LucideIcon,
  MessageCircleOff,
  ThumbsUp,
  UserRoundPlus,
} from "lucide-react";

interface FeaturesData {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const features: FeaturesData[] = [
  {
    title: "Easy to Use",
    description:
      "Designed with simplicity in mind. You don’t need to be tech-savvy. Just log in and start sharing!",
    icon: BookHeart,
  },
  {
    title: "Post Your Reads",
    description:
      "Upload the book you’re currently reading, write a short caption or thought, and let others engage with it.",
    icon: BookUp2,
  },
  {
    title: "Like and Comment",
    description:
      "Show support for fellow readers by liking their posts or dropping a comment like “Great pick!” or “You inspired me to read this next.”",
    icon: ThumbsUp,
  },
  {
    title: "Follow Readers",
    description:
      "You can follow people whose reading tastes you like, and build a personal feed based on your favorite readers.",
    icon: UserRoundPlus,
  },
  {
    title: "No Private Chat",
    description:
      "We keep the platform clean and distraction-free. There’s no private messaging—just public interaction that motivates and uplifts.",
    icon: MessageCircleOff,
  },
];
