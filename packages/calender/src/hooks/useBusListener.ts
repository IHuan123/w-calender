import bus, { EventCallback } from '@/utils/bus';
import { useEffect } from 'preact/hooks';
type BusEvents = {
  [propname: symbol]: EventCallback;
};

function eventListener(events: BusEvents) {
  Object.getOwnPropertySymbols(events).map((evtName) => {
    bus.$on(evtName, events[evtName]);
  });
}
function unmountBusEvent(events: BusEvents) {
  Object.getOwnPropertySymbols(events).map((evtName) => {
    bus.$off(evtName, events[evtName]);
  });
}
export default function (events: BusEvents) {
  useEffect(() => {
    eventListener(events);
    return () => {
      unmountBusEvent(events);
    };
  }, []);
}
