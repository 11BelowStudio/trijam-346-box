import {I_HaveRng} from './I_HaveRng';

export interface I_InventoryItemGameView extends I_HaveRng {

  items_sold(quantity_sold: number, money_earned: number): void;

}
