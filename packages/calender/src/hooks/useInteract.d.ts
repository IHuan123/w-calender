import { Options, Target, Listeners } from '@interactjs/types';
export interface InteractEventOptions {
    draggableOptions?: {
        listeners: Listeners;
    };
}
/**
 * @zh 手势hooks
 */
export default function useInteract(el: Target, options?: Options, eventOptions?: InteractEventOptions): {
    context: undefined;
};
