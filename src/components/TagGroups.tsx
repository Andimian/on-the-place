import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useState } from 'react';
import initialGroups from './initialGroups';
import { DroppableGroup } from './Dropable.tsx';

const TagGroups = () => {
	const [groups, setGroups] = useState(initialGroups);

	const handleDrop = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		const sourceGroupId = active.data?.current?.groupId;
		const targetGroupId = over.data?.current?.groupId || over.id;

		// Ищем исходную и целевую группы
		const sourceGroup = groups.find(group => group.id === sourceGroupId);
		const targetGroup = groups.find(group => group.id === targetGroupId);

		if (sourceGroup && targetGroup) {
			// Если тег перетаскивается внутри одной группы
			if (sourceGroupId === targetGroupId) {
				const oldIndex = sourceGroup.tags.findIndex(tag => tag.id === active.id);
				const newIndex = sourceGroup.tags.findIndex(tag => tag.id === over.id);

				// Если индексы отличаются, меняем их местами
				if (oldIndex !== newIndex) {
					const updatedTags = arrayMove(sourceGroup.tags, oldIndex, newIndex);

					setGroups(prevGroups =>
						prevGroups.map(group =>
							group.id === sourceGroup.id ? { ...group, tags: updatedTags } : group
						)
					);
				}
			} else {
				// Если тег перемещается между группами
				const movedTag = sourceGroup.tags.find(tag => tag.id === active.id);

				if (movedTag) {
					// Удаляем тег из исходной группы
					const updatedSourceTags = sourceGroup.tags.filter(tag => tag.id !== active.id);
					// Добавляем тег в целевую группу
					const updatedTargetTags = [...targetGroup.tags, movedTag];

					setGroups(prevGroups =>
						prevGroups.map(group =>
							group.id === sourceGroup.id
								? { ...group, tags: updatedSourceTags }
								: group.id === targetGroup.id
									? { ...group, tags: updatedTargetTags }
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
				{groups.map(group => (
					<DroppableGroup key={group.id} group={group} />
				))}
			</div>
		</DndContext>
	);
};

export default TagGroups;
