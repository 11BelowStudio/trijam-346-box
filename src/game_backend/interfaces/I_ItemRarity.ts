import {Item} from '../items';
import {Rarity} from '../rarities';

export interface I_ItemRarity {
  get item(): Item;
  get rarity(): Rarity;
  get name(): string;
  get icon_url(): string;
  get colour(): string;

  get index(): number;
}
