import { REQ_DATA } from '@src/ipcChannels';
import { IpcRequest } from '@src/main/ipc/IPCRequest';
import IpcService from '@src/main/IPCService';
import { useEffect, useRef } from 'react';

type func = () => void;
type ipcFunc = (evt: any, rest: any) => void;

export function useInterval(callback: func, interval: number): void {
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

export function useIpcOn(respCh: string, callback: ipcFunc): void {
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
  }, [respCh]);
}

export function usePolling<R extends IpcRequest>(
  request: R,
  callback: ipcFunc,
  interval: number,
): void {
  const ipcService = IpcService.getInstance();

  useInterval(() => {
    ipcService.sendPolling(REQ_DATA, request);
  }, interval);

  useIpcOn(request.responseChannel, callback);
}

export function useOncePolling<R extends IpcRequest>(
  request: R,
  callback: ipcFunc,
): void {
  const ipcService = IpcService.getInstance();
  ipcService.sendPolling(REQ_DATA, request);
  // useIpcOn(request.responseChannel, callback);
  ipcService.once(request.responseChannel, callback);
}