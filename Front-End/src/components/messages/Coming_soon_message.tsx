import { toast } from "sonner";

export function coming_soon_message() {
  toast.message("We’re working on this feature  ", {
    description: "stay tuned for something awesome!",
    classNames: {
      toast: "!bg-yellow-400 !text-black rounded-xl border border-red-700",
      description: "!text-black text-sm opacity-90",
      actionButton: "bg-white text-red-600 px-2 py-1 rounded-md",
    },
    action: {
      label: "OK",
      onClick: () => console.log("OK"),
    },
  });
}
