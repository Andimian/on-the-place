import { DndContext, useDroppable, useDraggable, DragEndEvent } from '@dnd-kit/core';

export type Tag = {
  id: string;
  label: string;
};

export type Group = {
  id: string;
  tags: Tag[];
};

export const DraggableTag = ({ tag, groupId }: { tag: Tag; groupId: string }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: tag.id,
    data: { groupId },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        padding: '8px',
        margin: '4px',
        backgroundColor: isDragging ? 'lightblue' : 'lightgray',
        cursor: 'move',
      }}
    >
      {tag.label}
    </div>
  );
};

// function useDraggable(arg0: { id: string; data: { groupId: string; }; }): {
//   attributes: any;
//   listeners: any;
//   setNodeRef: any;
//   isDragging: any;
//  } {
//   throw new Error("Function not implemented.");
// }
