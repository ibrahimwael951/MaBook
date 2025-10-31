import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Book as BookType } from "@/types/shelf";

interface BookProps {
  book: BookType;
}

const BOOK_COLORS: Record<
  string,
  { spine: string; accent: string; pages: string }
> = {
  red: {
    spine: "bg-gradient-to-br from-red-700 via-red-800 to-red-900",
    accent: "border-red-950",
    pages: "bg-gradient-to-r from-amber-50 to-amber-100",
  },
  blue: {
    spine: "bg-gradient-to-br from-blue-700 via-blue-800 to-blue-950",
    accent: "border-blue-950",
    pages: "bg-gradient-to-r from-slate-50 to-slate-100",
  },
  green: {
    spine: "bg-gradient-to-br from-green-700 via-green-800 to-green-900",
    accent: "border-green-950",
    pages: "bg-gradient-to-r from-lime-50 to-lime-100",
  },
  purple: {
    spine: "bg-gradient-to-br from-purple-700 via-purple-800 to-purple-950",
    accent: "border-purple-950",
    pages: "bg-gradient-to-r from-purple-50 to-purple-100",
  },
  amber: {
    spine: "bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900",
    accent: "border-amber-950",
    pages: "bg-gradient-to-r from-yellow-50 to-yellow-100",
  },
  teal: {
    spine: "bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900",
    accent: "border-teal-950",
    pages: "bg-gradient-to-r from-cyan-50 to-cyan-100",
  },
  rose: {
    spine: "bg-gradient-to-br from-rose-700 via-rose-800 to-rose-900",
    accent: "border-rose-950",
    pages: "bg-gradient-to-r from-pink-50 to-pink-100",
  },
  indigo: {
    spine: "bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950",
    accent: "border-indigo-950",
    pages: "bg-gradient-to-r from-indigo-50 to-indigo-100",
  },
};

export const Book = ({ book }: BookProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: book.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: `${book.width}px`,
  };

  const colorScheme = BOOK_COLORS[book.color] || BOOK_COLORS.blue;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`relative h-48 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-50 z-50" : "opacity-100"
      }`}
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute right-0 top-2 bottom-2 w-2 rounded-r-sm overflow-hidden">
        <div className={`h-full ${colorScheme.pages}`}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="h-px bg-gray-300/60"
              style={{ marginTop: i === 0 ? 0 : "6px" }}
            />
          ))}
        </div>
      </div>

      <div
        className={`h-full w-full ${colorScheme.spine} rounded-l-md shadow-2xl border-r-2 ${colorScheme.accent} relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            )`,
          }}
        />

        <div className="absolute top-4 left-0 right-0 h-0.5 bg-yellow-600/40" />
        <div className="absolute top-6 left-0 right-0 h-px bg-yellow-600/30" />
        <div className="absolute bottom-6 left-0 right-0 h-px bg-yellow-600/30" />
        <div className="absolute bottom-4 left-0 right-0 h-0.5 bg-yellow-600/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-2 gap-4">
          <div className="flex-1 flex items-center justify-center w-full">
            <p
              className="!text-white font-semibold text-center text-xs px-1"
              style={{
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {book.title}
            </p>
          </div>

          {/* <p
            className="!text-white/80 text-[10px] font-medium drop-shadow-md"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
            }}
          >
            {book.author}
          </p> */}
        </div>

        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/15 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-b from-white/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/40 to-transparent" />

        <div className="absolute top-0 left-0 w-4 h-4 bg-black/20 rounded-br-full" />
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-black/20 rounded-tr-full" />
      </div>

      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/30 blur-sm rounded-full" />
    </motion.div>
  );
};
