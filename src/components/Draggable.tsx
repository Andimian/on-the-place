import { useSortable } from '@dnd-kit/sortable';

/**
 * Для каждого тега внутри группы, мы будем использовать хук useSortable, чтобы перетаскивать их внутри группы.
 * @param tag
 * @param groupId
 * @constructor
 */
export const DraggableTag = ({ tag, groupId }: { tag: Tag; groupId: string }) => {
	const { attributes, listeners, setNodeRef, isDragging } = useSortable({
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
			{tag.name}
		</div>
	);
};

export type Tag = {
	id: string;
	name: string;
};

export type Group = {
	id: string;
	tags: Tag[];
};
