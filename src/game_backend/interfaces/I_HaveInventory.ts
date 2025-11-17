import {InventoryItem} from '../InventoryItem';
import {Signal} from '@angular/core';

/**
 * Interface exposing the game's inventory
 */
export interface I_HaveInventory {

  /**
   * the inventory of items the player has, sorted by index in ascending order.
   */
  get inventory(): ReadonlyArray<InventoryItem>;

  /**
   * returns the number of items in the inventory.
   */
  get get_inventory_item_count(): number;

  /**
   * returns the total value of all items in the inventory.
   * this is used to determine the value of the inventory as a whole.
   */
  get inventory_item_value(): number;

}
