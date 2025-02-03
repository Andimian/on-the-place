import {
	Announcements,
	closestCenter,
	DragOverlay,
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	UniqueIdentifier,
	useSensor,
	useSensors,
	DroppableContainers,
	Active,
	defaultDropAnimationSideEffects,
	ScreenReaderInstructions, PointerActivationConstraint,
} from '@dnd-kit/core';
import {
	arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, SortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import { createRange } from './utilities';
import { Wrapper } from './Wrapper';
import { DraggableNodes } from '@dnd-kit/core/dist/store';
import { SortableItem } from './SotrableItem.tsx';
import { createPortal } from 'react-dom';
import { Item } from './Item';
import {
	AnimateLayoutChanges,
	CollisionDetection,
	DeepRequired,
	KeyboardCoordinateGetter,
	MeasuringConfiguration, Modifiers,
	NewIndexGetter
} from './types.ts';
import { KeyframeResolverParameters } from '@dnd-kit/core/dist/components/DragOverlay/hooks/useDropAnimation';
import { List } from './List';

interface SharedParameters {
	active: {
		id: UniqueIdentifier;
		data: Active['data'];
		node: HTMLElement;
		rect: ClientRect;
	};
	dragOverlay: {
		node: HTMLElement;
		rect: ClientRect;
	};
	draggableNodes: DraggableNodes;
	droppableContainers: DroppableContainers;
	measuringConfiguration: DeepRequired<MeasuringConfiguration>;
}

export type Transform = {
	x: number;
	y: number;
	scaleX: number;
	scaleY: number;
};

export interface Transition {
	property: string;
	easing: string;
	duration: number;
}

export interface DropAnimationFunctionArguments extends SharedParameters {
	transform: Transform;
}

export type DropAnimationFunction = (
	args: DropAnimationFunctionArguments
) => Promise<void> | void;

export type DropAnimation = DropAnimationFunction | DropAnimationOptions;

export interface DropAnimationOptions {
	keyframes?: KeyframeResolver;
	duration?: number;
	easing?: string;
	sideEffects?: DropAnimationSideEffects | null;
}

export type DropAnimationSideEffectsParameters = SharedParameters

type CleanupFunction = () => void;

export type DropAnimationSideEffects = (
	parameters: DropAnimationSideEffectsParameters
) => CleanupFunction | void;

export type KeyframeResolver = (
	parameters: KeyframeResolverParameters
) => Keyframe[];

const dropAnimationConfig: DropAnimation = {
	sideEffects: defaultDropAnimationSideEffects({
		styles: {
			active: {
				opacity: '0.5',
			},
		},
	}),
};

const screenReaderInstructions: ScreenReaderInstructions = {
	draggable: `
    To pick up a sortable item, press the space bar.
    While sorting, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  `,
};

export interface Props {
	activationConstraint?: PointerActivationConstraint;
	animateLayoutChanges?: AnimateLayoutChanges;
	adjustScale?: boolean;
	collisionDetection?: CollisionDetection;
	coordinateGetter?: KeyboardCoordinateGetter;
	Container?: any; // To-do: Fix me
	dropAnimation?: DropAnimation | null;
	getNewIndex?: NewIndexGetter;
	handle?: boolean;
	itemCount?: number;
	items?: UniqueIdentifier[];
	measuring?: MeasuringConfiguration;
	modifiers?: Modifiers;
	renderItem?: any;
	removable?: boolean;
	reorderItems?: typeof arrayMove;
	strategy?: SortingStrategy;
	style?: React.CSSProperties;
	useDragOverlay?: boolean;
	getItemStyles?(args: {
		id: UniqueIdentifier;
		index: number;
		isSorting: boolean;
		isDragOverlay: boolean;
		overIndex: number;
		isDragging: boolean;
	}): React.CSSProperties;
	wrapperStyle?(args: {
		active: Pick<Active, 'id'> | null;
		index: number;
		isDragging: boolean;
		id: UniqueIdentifier;
	}): React.CSSProperties;
	isDisabled?(id: UniqueIdentifier): boolean;
}

export function Sortable({
	activationConstraint,
	animateLayoutChanges,
	adjustScale = false,
	Container = List,
	collisionDetection = closestCenter,
	coordinateGetter = sortableKeyboardCoordinates,
	dropAnimation = dropAnimationConfig,
	getItemStyles = () => ({}),
	getNewIndex,
	handle = false,
	itemCount = 16,
	items: initialItems,
	isDisabled = () => false,
	measuring,
	modifiers,
	removable,
	renderItem,
	reorderItems = arrayMove,
	strategy = rectSortingStrategy,
	style,
	useDragOverlay = true,
	wrapperStyle = () => ({}),
}: Props) {
	const [items, setItems] = useState<UniqueIdentifier[]>(
		() =>
			initialItems ?? createRange<UniqueIdentifier>(itemCount, (index) => index)
	);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint,
		}),
		useSensor(TouchSensor, {
			activationConstraint,
		}),
		useSensor(KeyboardSensor, {
			// Disable smooth scrolling in Cypress automated tests
			scrollBehavior: 'Cypress' in window ? 'auto' : undefined,
			coordinateGetter,
		})
	);
	const isFirstAnnouncement = useRef(true);
	const getIndex = (id: UniqueIdentifier) => items.indexOf(id);
	const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1;
	const activeIndex = activeId != null ? getIndex(activeId) : -1;
	const handleRemove = removable
		? (id: UniqueIdentifier) =>
			setItems((items) => items.filter((item) => item !== id))
		: undefined;
	const announcements: Announcements = {
		onDragStart({active: {id}}) {
			return `Picked up sortable item ${String(
				id
			)}. Sortable item ${id} is in position ${getPosition(id)} of ${
				items.length
			}`;
		},
		onDragOver({active, over}) {
			// In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
			// The first `onDragOver` event therefore doesn't need to be announced, because it is called
			// immediately after the `onDragStart` announcement and is redundant.
			if (isFirstAnnouncement.current === true) {
				isFirstAnnouncement.current = false;
				return;
			}

			if (over) {
				return `Sortable item ${
					active.id
				} was moved into position ${getPosition(over.id)} of ${items.length}`;
			}

			return;
		},
		onDragEnd({active, over}) {
			if (over) {
				return `Sortable item ${
					active.id
				} was dropped at position ${getPosition(over.id)} of ${items.length}`;
			}

			return;
		},
		onDragCancel({active: {id}}) {
			return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
				id
			)} of ${items.length}.`;
		},
	};

	useEffect(() => {
		if (activeId == null) {
			isFirstAnnouncement.current = true;
		}
	}, [activeId]);

	return (
		<DndContext
			accessibility={{
				announcements,
				screenReaderInstructions,
			}}
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragStart={({active}) => {
				if (!active) {
					return;
				}

				setActiveId(active.id);
			}}
			onDragEnd={({over}) => {
				setActiveId(null);

				if (over) {
					const overIndex = getIndex(over.id);
					if (activeIndex !== overIndex) {
						setItems((items) => reorderItems(items, activeIndex, overIndex));
					}
				}
			}}
			onDragCancel={() => setActiveId(null)}
			measuring={measuring}
			modifiers={modifiers}
		>
			<Wrapper style={style} center>
				<SortableContext items={items} strategy={strategy}>
					<Container>
						{items.map((value, index) => (
							<SortableItem
								key={value}
								id={value}
								handle={handle}
								index={index}
								style={getItemStyles}
								wrapperStyle={wrapperStyle}
								disabled={isDisabled(value)}
								renderItem={renderItem}
								onRemove={handleRemove}
								animateLayoutChanges={animateLayoutChanges}
								useDragOverlay={useDragOverlay}
								getNewIndex={getNewIndex}
							/>
						))}
					</Container>
				</SortableContext>
			</Wrapper>
			{/* {useDragOverlay */}
			{/* 	? createPortal( */}
			{/* 		<DragOverlay */}
			{/* 			adjustScale={adjustScale} */}
			{/* 			dropAnimation={dropAnimation} */}
			{/* 		> */}
			{/* 			{activeId != null ? ( */}
			{/* 				<Item */}
			{/* 					value={items[activeIndex]} */}
			{/* 					handle={handle} */}
			{/* 					renderItem={renderItem} */}
			{/* 					wrapperStyle={wrapperStyle({ */}
			{/* 						active: {id: activeId}, */}
			{/* 						index: activeIndex, */}
			{/* 						isDragging: true, */}
			{/* 						id: items[activeIndex], */}
			{/* 					})} */}
			{/* 					style={getItemStyles({ */}
			{/* 						id: items[activeIndex], */}
			{/* 						index: activeIndex, */}
			{/* 						isSorting: activeId !== null, */}
			{/* 						isDragging: true, */}
			{/* 						overIndex: -1, */}
			{/* 						isDragOverlay: true, */}
			{/* 					})} */}
			{/* 					dragOverlay */}
			{/* 				/> */}
			{/* 			) : null} */}
			{/* 		</DragOverlay>, */}
			{/* 		document.body */}
			{/* 	) */}
			{/* 	: null} */}
		</DndContext>
	);
}
