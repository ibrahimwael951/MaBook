"use client";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Bookshelf } from "@/components/shelf/Bookshelf";
import { Book as BookComponent } from "@/components/shelf/Book";
import { useBookStorage } from "@/hooks/useBookStorage";
import { Book, Shelf } from "@/types/shelf";
import { Button } from "@/components/ui/button";

import { RotateCcw, BookOpen, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const Index = () => {
  const {
    shelves,
    moveBook,
    addShelf,
    deleteShelf,
    updateShelfWidth,
    updateShelfName,
    reorderShelves,
    resetShelves,
  } = useBookStorage();
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [activeShelf, setActiveShelf] = useState<Shelf | null>(null);
  const [newShelfName, setNewShelfName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Check if dragging a shelf
    const shelf = shelves.find((s) => s.id === active.id);
    if (shelf) {
      setActiveShelf(shelf);
      return;
    }

    // Check if dragging a book
    const book = shelves
      .flatMap((shelf) => shelf.books)
      .find((b) => b.id === active.id);
    if (book) {
      setActiveBook(book);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveBook(null);
      setActiveShelf(null);
      return;
    }

    // Handle shelf reordering
    if (activeShelf) {
      const oldIndex = shelves.findIndex((s) => s.id === active.id);
      const newIndex = shelves.findIndex((s) => s.id === over.id);

      if (oldIndex !== newIndex) {
        reorderShelves(oldIndex, newIndex);
        toast.success("Shelf repositioned!");
      }

      setActiveShelf(null);
      return;
    }

    const activeBookId = active.id as string;

    // Check if dropped over a shelf
    const targetShelf = shelves.find((shelf) => shelf.id === over.id);
    if (targetShelf) {
      // Dropped on empty shelf area
      moveBook(activeBookId, targetShelf.id, targetShelf.books.length);
      toast.success("Book moved!");
      setActiveBook(null);
      return;
    }

    // Check if dropped over another book
    const targetBook = shelves
      .flatMap((shelf) => shelf.books)
      .find((b) => b.id === over.id);

    if (targetBook && activeBookId !== targetBook.id) {
      const targetShelf = shelves.find((s) => s.id === targetBook.shelfId);
      if (targetShelf) {
        const targetPosition = targetShelf.books.findIndex(
          (b) => b.id === targetBook.id
        );
        moveBook(activeBookId, targetBook.shelfId, targetPosition);
        toast.success("Book repositioned!");
      }
    }

    setActiveBook(null);
  };

  const handleReset = () => {
    resetShelves();
    toast.success("Shelves reset to default!");
  };

  const handleAddShelf = () => {
    if (newShelfName.trim()) {
      addShelf(newShelfName.trim());
      setNewShelfName("");
      toast.success("Shelf added!");
    }
  };

  const handleDeleteShelf = (shelfId: string) => {
    deleteShelf(shelfId);
    toast.success("Shelf deleted!");
  };

  const sortedShelves = [...shelves].sort((a, b) => a.position - b.position);

  return (
    <section className=" pt-20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-secondaryHigh" />
            <h1 className="text-4xl font-bold text-foreground">My Library</h1>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground mb-8"
        >
          Drag and drop books between shelves to organize your collection. Your
          changes are automatically saved!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center gap-2"
        >
          <input
            placeholder="New shelf name..."
            value={newShelfName}
            onChange={(e) => setNewShelfName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddShelf()}
            className="flex-1 defaultInput"
          />
          <Button onClick={handleAddShelf} className="gap-2 ">
            <Plus className="w-4 h-4" />
            Add Shelf
          </Button>
        </motion.div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedShelves.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedShelves.map((shelf) => (
                  <div
                    key={shelf.id}
                    className={
                      shelf.width === "full" ? "lg:col-span-2" : "lg:col-span-1"
                    }
                  >
                    <Bookshelf
                      shelf={shelf}
                      onDelete={handleDeleteShelf}
                      onWidthChange={updateShelfWidth}
                      onNameChange={updateShelfName}
                    />
                  </div>
                ))}
              </div>
            </div>
          </SortableContext>

          <DragOverlay>
            {activeBook ? (
              <BookComponent book={activeBook} />
            ) : activeShelf ? (
              <div className="opacity-50">
                <Bookshelf
                  shelf={activeShelf}
                  onDelete={() => {}}
                  onWidthChange={() => {}}
                  onNameChange={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </section>
  );
};

export default Index;
