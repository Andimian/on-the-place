import type { Active, DataRef, Translate, UniqueIdentifier } from '@dnd-kit/core';
import type {Transition} from '@dnd-kit/utilities';
import { MutableRefObject } from 'react';
import { RectMap } from '@dnd-kit/core/dist/store';
import { Transform } from './Sortable.tsx';
import { DroppableContainersMap } from './store/constructors.ts';

export type SortableTransition = Pick<Transition, 'easing' | 'duration'>;

export type AnimateLayoutChanges = (args: {
  active: Active | null;
  containerId: UniqueIdentifier;
  isDragging: boolean;
  isSorting: boolean;
  id: UniqueIdentifier;
  index: number;
  items: UniqueIdentifier[];
  previousItems: UniqueIdentifier[];
  previousContainerId: UniqueIdentifier;
  newIndex: number;
  transition: SortableTransition | null;
  wasDragging: boolean;
}) => boolean;

export interface NewIndexGetterArguments {
  id: UniqueIdentifier;
  items: UniqueIdentifier[];
  activeIndex: number;
  overIndex: number;
}

export interface NewIndexGetterArguments {
	id: UniqueIdentifier;
	items: UniqueIdentifier[];
	activeIndex: number;
	overIndex: number;
}

export type DeepRequired<T> = {
	[K in keyof T]-?: Required<T[K]>;
};

export type FirstArgument<T> = T extends (
		firstArg: infer U,
		...args: Array<any>
	) => any
	? U
	: never;

export type Without<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export interface ClientRect {
	width: number;
	height: number;
	top: number;
	left: number;
	right: number;
	bottom: number;
}

export type MeasuringFunction = (node: HTMLElement) => ClientRect;

interface Measuring {
	measure: MeasuringFunction;
}

export type DraggableMeasuring = Measuring

export type DragOverlayMeasuring = Measuring

export enum MeasuringStrategy {
	Always,
	BeforeDragging,
	WhileDragging,
}

export enum MeasuringFrequency {
	Optimized = 'optimized',
}

export interface DroppableMeasuring {
	measure: MeasuringFunction;
	strategy: MeasuringStrategy;
	frequency: MeasuringFrequency | number;
}
export interface MeasuringConfiguration {
	draggable?: Partial<DraggableMeasuring>;
	droppable?: Partial<DroppableMeasuring>;
	dragOverlay?: Partial<DragOverlayMeasuring>;
}

export type NewIndexGetter = (args: NewIndexGetterArguments) => number;

type AnyData = Record<string, any>;

export type Data<T = AnyData> = T & AnyData;

export interface Collision {
	id: UniqueIdentifier;
	data?: Data;
}

export enum KeyboardCode {
	Space = 'Space',
	Down = 'ArrowDown',
	Right = 'ArrowRight',
	Left = 'ArrowLeft',
	Up = 'ArrowUp',
	Esc = 'Escape',
	Enter = 'Enter',
	Tab = 'Tab',
}

export type KeyboardCodes = {
	start: KeyboardEvent['code'][];
	cancel: KeyboardEvent['code'][];
	end: KeyboardEvent['code'][];
};

export type Coordinates = {
	x: number;
	y: number;
};


export type KeyboardCoordinateGetter = (
	event: KeyboardEvent,
	args: {
		active: UniqueIdentifier;
		currentCoordinates: Coordinates;
		context: SensorContext;
	}
) => Coordinates | void;

export type DraggableNodes = Map<UniqueIdentifier, DraggableNode | undefined>;

export type DraggableNode = {
	id: UniqueIdentifier;
	key: UniqueIdentifier;
	node: MutableRefObject<HTMLElement | null>;
	activatorNode: MutableRefObject<HTMLElement | null>;
	data: DataRef;
};

export type SensorContext = {
	activatorEvent: Event | null;
	active: Active | null;
	activeNode: HTMLElement | null;
	collisionRect: ClientRect | null;
	collisions: Collision[] | null;
	draggableNodes: DraggableNodes;
	draggingNode: HTMLElement | null;
	draggingNodeRect: ClientRect | null;
	droppableRects: RectMap;
	droppableContainers: DroppableContainers;
	over: Over | null;
	scrollableAncestors: Element[];
	scrollAdjustedTranslate: Translate | null;
};

export interface Over {
	id: UniqueIdentifier;
	rect: ClientRect;
	disabled: boolean;
	data: DataRef;
}

export type Modifier = (args: {
	activatorEvent: Event | null;
	active: Active | null;
	activeNodeRect: ClientRect | null;
	draggingNodeRect: ClientRect | null;
	containerNodeRect: ClientRect | null;
	over: Over | null;
	overlayNodeRect: ClientRect | null;
	scrollableAncestors: Element[];
	scrollableAncestorRects: ClientRect[];
	transform: Transform;
	windowRect: ClientRect | null;
}) => Transform;

export type Modifiers = Modifier[];

export type DroppableContainers = DroppableContainersMap;

export interface DroppableContainer {
	id: UniqueIdentifier;
	key: UniqueIdentifier;
	data: DataRef;
	disabled: boolean;
	node: MutableRefObject<HTMLElement | null>;
	rect: MutableRefObject<ClientRect | null>;
}

export interface CollisionDescriptor extends Collision {
	data: {
		droppableContainer: DroppableContainer;
		value: number;
		[key: string]: any;
	};
}

export type CollisionDetection = (args: {
	active: Active;
	collisionRect: ClientRect;
	droppableRects: RectMap;
	droppableContainers: DroppableContainer[];
	pointerCoordinates: Coordinates | null;
}) => Collision[];

