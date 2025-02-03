import { useDroppable } from "@dnd-kit/core";
import { DraggableTag, Group } from "./Draggable";
import { rectSwappingStrategy, SortableContext } from '@dnd-kit/sortable';

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
				backgroundColor: isOver ? 'lightyellow' : 'red',
			}}
		>
			<h3>{group.id}</h3>

			{/* Чтобы разрешить сортировку тегов внутри группы, используем SortableContext и указываем стратегию сортировки. */}
			<SortableContext
				items={group.tags.map(tag => tag.id)} // список тегов для сортировки
				strategy={rectSwappingStrategy}
			>
				{group.tags.map((tag) => (
					<DraggableTag key={tag.id} tag={tag} groupId={group.id} />
				))}
			</SortableContext>
		</div>
	);
};

