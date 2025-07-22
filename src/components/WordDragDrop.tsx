'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableWordProps {
  id: string;
  word: string;
}

function SortableWord({ id, word }: SortableWordProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 m-1 rounded-lg cursor-move hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors shadow-sm"
    >
      {word}
    </div>
  );
}

interface WordDragDropProps {
  words: string[];
  onWordsChange: (words: string[]) => void;
}

export default function WordDragDrop({ words, onWordsChange }: WordDragDropProps) {
  const [items, setItems] = useState(words.map((word, index) => ({
    id: `word-${index}-${Math.random()}`, // Add random key to ensure uniqueness
    word
  })));

  // Update items when words prop changes (for different sentences)
  useEffect(() => {
    setItems(words.map((word, index) => ({
      id: `word-${index}-${Math.random()}`,
      word
    })));
  }, [words]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        onWordsChange(newItems.map(item => item.word));
        
        return newItems;
      });
    }
  }

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 min-h-[120px]">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <SortableWord key={item.id} id={item.id} word={item.word} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        드래그하여 단어 순서를 바꿔보세요
      </p>
    </div>
  );
}