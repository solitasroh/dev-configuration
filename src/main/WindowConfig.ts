import ElectronStore from 'electron-store';
import { screen } from 'electron';

export default interface WindowInformation {
  validity: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  isMaximized: boolean;
}

export function debugWindowConfig(deb: string, information: WindowInformation) {
  console.log(
    `[${deb}] x: ${information.x}, y: ${information.y}, width: ${information.width}. height: ${information.height}`,
  );
}

export function saveWindowConfig(information: WindowInformation): boolean {
  const store = new ElectronStore();
  debugWindowConfig('save', information);

  store.set('x', information.x);
  store.set('y', information.y);
  store.set('width', information.width);
  store.set('height', information.height);
  store.set('isMaximized', information.isMaximized);

  store.set('displaySetValidity', true);

  return true;
}

export function loadWindowConfig(): WindowInformation {
  const store = new ElectronStore();

  const primaryDisplay = screen.getPrimaryDisplay();

  const defaultWidth = Math.ceil(primaryDisplay.bounds.width * 0.8); // Display Width 80%
  const defaultHeight = Math.ceil(primaryDisplay.bounds.height * 0.7); // Display Height 70%
  const defaultX = Math.ceil(
    primaryDisplay.bounds.x +
      primaryDisplay.bounds.width / 2 -
      defaultWidth / 2,
  );
  const defaultY = Math.ceil(
    primaryDisplay.bounds.y +
      primaryDisplay.bounds.height / 2 -
      defaultHeight / 2,
  );

  const validity = store.get('displaySetValidity', false) as boolean;
  const x = store.get('x', defaultX) as number;
  const y = store.get('y', defaultY) as number;
  const width = store.get('width', defaultWidth) as number;
  const height = store.get('height', defaultHeight) as number;
  const isMaximized = store.get('isMaximized', false) as boolean;

  const target = screen.getDisplayMatching({ x, y, width, height });

  if (target !== undefined && target !== null) {
    return {
      validity,
      x,
      y,
      width,
      height,
      isMaximized,
    };
  }
  return {
    validity,
    x: defaultX,
    y: defaultY,
    width: defaultWidth,
    height: defaultHeight,
    isMaximized,
  };
}
