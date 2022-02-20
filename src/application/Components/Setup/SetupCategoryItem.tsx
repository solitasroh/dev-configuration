import { SetupDef } from '@src/application/Components/Setup/SetupDef';

export interface SetupCategoryItem {
  key: number;
  category: string;
  items: SetupDef[];
}
