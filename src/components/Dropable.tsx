import { useDroppable } from "@dnd-kit/core";
import { Group, DraggableTag } from "./Draggable";

export const DroppableGroup = ({ group }: { group: Group }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: group.id,
    });
  
    return (
      <div
        ref={setNodeRef}
        style={{
          border: '1px solid black',
          padding: '16px',
          margin: '8px',
          minHeight: '150px',
          backgroundColor: isOver ? 'lightyellow' : 'white',
        }}
      >
        <h3>{group.id}</h3>
        {group.tags.map((tag) => (
          <DraggableTag key={tag.id} tag={tag} groupId={group.id} />
        ))}
      </div>
    );
  };