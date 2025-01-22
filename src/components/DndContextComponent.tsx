import {DndContext} from '@dnd-kit/core';

import { Draggable } from './Draggable';
import { Droppable } from './Dropable';

export function DNDComponent() {
  return (
    <DndContext>
      <Draggable />
      <Droppable />
    </DndContext>
  )
}