import {I_ItemRarity} from './I_ItemRarity';

/**
 * interface for the 'go gambling' functionality.
 */
export interface I_GoGambling {

  /**
   * Current number of boxes held by the player.
   */
  get boxes(): number;

  /**
   * shorthand to check if the player has boxes to go gambling with.
   */
  get can_go_gambling(): boolean

  /**
   * returns true if the player is currently gambling, false otherwise.
   * this is used to prevent multiple gamblings from happening simultaneously.
   */
  get gamba_in_progress(): boolean;

  /**
   * LET'S GO GAMBLING!
   *
   * consumes a box, and adds a random item to the inventory.
   *
   * returns a tuple of two values:
   * - a boolean indicating whether we did go gambling (true) or not (false)
   * - the item that was obtained from our gambling, or null if nothing happened (because we were mid-gamble/there were no boxes left)
   *
   * also, if we did go gambling, there's a 25% chance that the inventory will fluctuate a bit.
   * and after every 'boxes_between_increments'-th box opening, the box price will increase by a random factor.
   */
  lets_go_gambling(): Promise<[boolean, I_ItemRarity | null]>;

}
