import IpcService from '@src/main/IPCService';
import { useEffect, useRef } from 'react';

type func = () => void;
type ipcFunc  =  (evt: any, rest: any) => void;

export function useInterval(callback: func, interval: number) : void {
    const saveCallback = useRef<func>();
    useEffect(() => {
      saveCallback.current = callback;
    });
  
    useEffect(() => {
      function tick() {
        saveCallback.current();
      }
      if (interval !== null) {
        const id = setInterval(tick, interval);
        return () => clearInterval(id);
      }
      return () => clearInterval(0);
    }, [interval]);
}

export function usePolling(respCh: string, callback: ipcFunc) : void {
    const saveHandler = useRef<ipcFunc>();
    useEffect(() => {
        saveHandler.current = callback;
    }, [callback]);

    useEffect(() => {
        const instance = IpcService.getInstance();
        
        const eventHandler = (evt: any, rest: any) => {
          saveHandler.current(evt, rest);
        };

        instance.on(respCh, eventHandler);

        return () => instance.removeListner(respCh, eventHandler);
    }, [respCh])
}