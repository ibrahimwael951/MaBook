import { toast } from "sonner";

export function coming_soon_message() {
  toast("We’re working on this feature  ", {
    description: "stay tuned for something awesome!",
    classNames: {
      toast: "  rounded-xl border border-red-700",
      description: "!text-white text-sm opacity-90",
      actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
    },
    action: {
      label: "OK",
      onClick: () => console.log("OK"),
    },
  });
}
