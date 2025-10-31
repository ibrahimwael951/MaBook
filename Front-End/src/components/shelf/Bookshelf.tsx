import { useState } from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Book } from "./Book";
import { Shelf } from "@/types/shelf";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import {
  GripVertical,
  Trash2,
  Maximize2,
  Columns2,
  Check,
  X,
  Pencil,
} from "lucide-react";

interface BookshelfProps {
  shelf: Shelf;
  onDelete: (shelfId: string) => void;
  onWidthChange: (shelfId: string, width: "full" | "half") => void;
  onNameChange: (shelfId: string, name: string) => void;
}

export const Bookshelf = ({
  shelf,
  onDelete,
  onWidthChange,
  onNameChange,
}: BookshelfProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(shelf.name);

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: shelf.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: shelf.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveName = () => {
    if (editName.trim()) {
      onNameChange(shelf.id, editName.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(shelf.name);
    setIsEditing(false);
  };

  return (
    <motion.div
      ref={setSortableRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <button
            className="!cursor-grab active:!cursor-grabbing text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="h-8 defaultInput"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <Button size="sm" variant="secondary" onClick={handleSaveName}>
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                NoAnimate
                onClick={handleCancelEdit}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-foreground">
                {shelf.name}
              </h2>
              <Button
                size="sm"
                NoAnimate
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={shelf.width === "full" ? "outline" : "third"}
            onClick={() => onWidthChange(shelf.id, "full")}
            title="Full width"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={shelf.width === "half" ? "outline" : "outline"}
            onClick={() => onWidthChange(shelf.id, "half")}
            title="Half width"
          >
            <Columns2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="!bg-red-500"
            onClick={() => onDelete(shelf.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="bg-gradient-shelf rounded-lg shadow-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 right-1/4 h-8 bg-gradient-to-b from-ambient/30 to-transparent blur-sm" />

          <div
            ref={setDroppableRef}
            className="min-h-[12rem] flex gap-2 items-end px-2 relative z-10"
          >
            <SortableContext
              items={shelf.books.map((book) => book.id)}
              strategy={horizontalListSortingStrategy}
            >
              {shelf.books.length === 0 ? (
                <div className="flex items-center justify-center w-full h-48 text-primary-foreground/50 text-sm">
                  Drop books here
                </div>
              ) : (
                shelf.books.map((book) => <Book key={book.id} book={book} />)
              )}
            </SortableContext>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-2 bg-shelf-shadow/50 blur-sm" />
        </div>
      </div>
    </motion.div>
  );
};
