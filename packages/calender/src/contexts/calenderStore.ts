import { createStore } from '@/store';
import { CalenderItem } from '@/types/options';
const { StoreProvider, useStore } = createStore<{ data: CalenderItem[] }>();

export { StoreProvider, useStore };
