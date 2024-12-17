import { h, ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { InteractEvent } from '@interactjs/types';
import { cls } from '@/utils/css';
import useInteract from '@/hooks/useInteract';
import {
  parseTranslateXY,
  getAttrsTransformTranslate,
  setElementStyle,
  getTransform,
  numToPx,
} from '@/utils/dom';

export interface EventContainerProps {
  children?: ComponentChildren;
}

export default function ({ children }: EventContainerProps) {
  /**
   * @zh 拖拽逻辑
   */
  useInteract(`.${cls('schedule-card')}`, void 0, {
    draggableOptions: {
      listeners: {
        start(event) {
          //   position = getAttrsTransformTranslate(event.target);
        },

        move(event) {
          // position.y += event.dy;
          // if (position.y <= 0) {
          //   position.y = 0;
          // }
          // setElementStyle(event.target, {
          //   ...getTransform({
          //     top: numToPx(position.y),
          //     left: numToPx(position.x),
          //   }),
          // });
        },
        end() {
          //   let curStyle = { ...styleConfig };
          //   curStyle.transform = getTransform({
          //     top: numToPx(position.y),
          //     left: numToPx(position.x),
          //   }).transform;
          //   setStyleConfig(() => ({ ...curStyle }));
        },
      },
    },
  });

  return (
    <>
      {children}
      <div className={cls('event-container')}></div>
    </>
  );
}
