import { DragEndEvent, DndContext } from "@dnd-kit/core";
import { useState } from "react";
import { Group } from "./Draggable";
import { DroppableGroup } from "./Dropable";
import initialGroups from "./initialGroups";

const TagGroups = () => {
    const [groups, setGroups] = useState<Group[]>(initialGroups);
  
    const handleDrop = (event: DragEndEvent) => {
      const { active, over } = event;
  
      if (active.id !== over?.id && active.data?.current?.groupId !== over?.id) {
        const sourceGroup = groups.find((group) => group.id === active.data?.current?.groupId);
        const targetGroup = groups.find((group) => group.id === over?.id);
  
        if (sourceGroup && targetGroup) {
          const movedTag = sourceGroup.tags.find((tag) => tag.id === active.id);
          if (movedTag) {
            // Переместить тег из исходной группы в целевую группу
            const newSourceTags = sourceGroup.tags.filter((tag) => tag.id !== active.id);
            const newTargetTags = [...targetGroup.tags, movedTag];
  
            setGroups((prevGroups) =>
              prevGroups.map((group) =>
                group.id === sourceGroup.id
                  ? { ...group, tags: newSourceTags }
                  : group.id === targetGroup.id
                  ? { ...group, tags: newTargetTags }
                  : group
              )
            );
  
            // Отправить данные на сервер
            // (Замените это на вашу реальную логику для отправки данных)
            console.log('Sending to server:', {
              tagId: active.id,
              sourceGroupId: sourceGroup.id,
              targetGroupId: targetGroup.id,
            });
          }
        }
      }
    };
  
    return (
      <DndContext onDragEnd={handleDrop}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {groups.map((group) => (
            <DroppableGroup key={group.id} group={group} />
          ))}
        </div>
      </DndContext>
    );
  };
  
  export default TagGroups;