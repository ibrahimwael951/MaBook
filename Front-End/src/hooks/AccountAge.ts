export function AccountAge(createdAt: string): string {
    const createdDate = new Date(createdAt);
    const now = new Date();
  
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
    if (diffDays === 0) return "Created today";
    if (diffDays === 1) return "Created 1 day ago";
    if (diffDays < 30) return `Created ${diffDays} days ago`;
  
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return "Created 1 month ago";
    if (diffMonths < 12) return `Created ${diffMonths} months ago`;
  
    const diffYears = Math.floor(diffMonths / 12);
    if (diffYears === 1) return "Created 1 year ago";
    return `Created ${diffYears} years ago`;
  }