/**
 * interface for the 'have money and boxes' functionality.
 */
export interface I_HaveMoneyAndBoxes {

  /**
   * Current money held by the player.
   */
  get money(): number

  /**
   * Current number of boxes held by the player.
   */
  get boxes(): number

  get total_items_sold(): number;

  get total_boxes_opened(): number;

  /**
   * How many box openings remain until the box cost increases?
   */
  get boxes_until_next_increment(): number;

  get total_money_spent(): number;

  get total_money_earned(): number;

  get box_price(): number;

  /**
   * calculate the total cost of buying the specified number of boxes.
   * cost = box_price * (1 - 0.99^quantity) * quantity
   * @param box_quantity how many boxes to buy
   * @returns the total cost of buying the specified number of boxes.
   */
  box_cost(box_quantity: number): number;

  /**
   * Returns the maximum number of boxes that can be purchased with the current money.
   */
  get max_purchasable_boxes(): number;

  /**
   * Buy boxes, returning true if successful, false otherwise.
   * @param box_quantity The number of boxes to buy.
   * If not specified, the maximum number of boxes that can be purchased with the current money will be used.
   * @returns true if the boxes were successfully purchased, false otherwise.
   */
  buy_boxes(box_quantity: number): boolean;

  /**
   * returns the total value of the inventory, including money and items.
   * this is used to determine the net worth of the player.
   */
  get net_worth(): number;

  /**
   * returns the number of items in the inventory.
   */
  get inventory_item_count(): number;

  /**
   * returns the total value of all items in the inventory.
   * this is used to determine the value of the inventory as a whole.
   */
  get inventory_item_value(): number;

  /**
   * returns the average value of all items in the inventory.
   */
  get inventory_item_value_per_item(): number;

}

