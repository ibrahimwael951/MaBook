import {
  BicepsFlexed,
  LucideIcon,
  MessageCircleOff,
  MessageSquareHeart,
  SmilePlus,
  ToolCase,
  UserLock,
} from "lucide-react";

interface Community {
  icon: LucideIcon;
  title: string;
  description: string;
}
export const Features: Community[] = [
  {
    icon: MessageSquareHeart,
    title: "Shared Love for Books",
    description:
      "Everyone here is connected by a simple passion: reading. Whether you’re into fiction, non-fiction, self-help, fantasy, or poetry you’ll always find someone who relates to your taste or wants to discover new reads.",
  },
  {
    icon: SmilePlus,
    title: "Meaningful Interactions",
    description:
      "You can post the books you’re reading and receive likes, comments, and encouragement from fellow readers. Comments like “Great choice!” or “This inspired me to start reading again!” are what make MaBook warm and personal.",
  },
  {
    icon: BicepsFlexed,
    title: "Motivation Over Judgment",
    description:
      "No one here is judging how fast you read, what genre you like, or how long your post is. This is a space to cheer each other on, not compare.",
  },
];
export const HowTOSaveIt:Community[] = [
  {
    icon: MessageSquareHeart,
    title: "Community Guidelines",
    description:
      "We have clear, simple rules to ensure respectful behavior. No hate speech, bullying, or inappropriate content ever",
  },
  {
    icon: MessageCircleOff,
    title: "No Private Messaging",
    description:
      "To protect users from unwanted DMs or harassment, MaBook doesn’t support private chat. All interactions are public, open, and friendly.",
  },
  {
    icon: ToolCase ,
    title: "Easy Reporting Tools",
    description:
      "If you ever see a post or comment that makes you uncomfortable, you can report it instantly. Our moderation team will handle it quickly and fairly.",
  },
  {
    icon: UserLock ,
    title: "Human Moderation",
    description:
      "Our team reviews reports and content to make sure the space stays safe, kind, and distraction-free.",
  },
];
