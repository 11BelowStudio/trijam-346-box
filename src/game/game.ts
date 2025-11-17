import {ChangeDetectorRef, Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import Rand from 'rand-seed';
import {Item, items_arr, items_dict, random_item} from '../game_backend/items';
import {Rarity, rarities_arr, rarities_dict, random_rarity} from '../game_backend/rarities';
import {InventoryItem} from '../game_backend/InventoryItem';
import {Sfx} from '../game_backend/sfx';
import {I_InventoryItemGameView} from '../game_backend/interfaces/I_InventoryItemGameView';
import {I_HaveRng} from '../game_backend/interfaces/I_HaveRng';

import {money_symbol, random_power, waitUntilTrue} from "../game_backend/utils";
import {I_ItemRarity} from '../game_backend/interfaces/I_ItemRarity';
import {I_HaveMoneyAndBoxes} from '../game_backend/interfaces/I_HaveMoneyAndBoxes';
import {I_GoGambling} from '../game_backend/interfaces/I_GoGambling';
import {I_HaveInventory} from '../game_backend/interfaces/I_HaveInventory';
import {MatButton} from '@angular/material/button';
import {MatTable} from '@angular/material/table';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';


export interface GameOverDialogData {
  money_symbol: string;
  money: number;
  box_price: number;
  total_boxes_opened: number;
  total_money_spent: number;
  total_items_sold: number;
  total_money_earned: number;
  seed: string;
}

@Component({
  selector: 'app-game-over-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
  template: `
  <h1 mat-dialog-title>Game Over</h1>
  <mat-dialog-content>
    <p>You do not have enough money to continue your gambling streak.</p>

    <p>You only have {{data.money_symbol}}{{data.money}} left to spend, but boxes cost {{data.money_symbol}}{{data.box_price}}.</p>

    <p>Boxes opened: {{data.total_boxes_opened}}<br/>
    Money spent: {{data.money_symbol}}{{data.total_money_spent}}<br/>
    Total items sold: {{data.total_items_sold}}<br/>
    Money earned: {{data.money_symbol}}{{data.total_money_earned}}</p>

    <p>Seed: {{data.seed}}</p>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button matButton (click)="okClick()">ok</button>
  </mat-dialog-actions>
  `
})
export class GameOverDialog {
  readonly dialogRef = inject(MatDialogRef<GameOverDialog>);
  readonly data: GameOverDialogData = inject(MAT_DIALOG_DATA);

  okClick(): void {
    this.dialogRef.close();
  }
}




@Component({
  selector: 'app-game',
  imports: [
    MatButton
  ],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game implements I_HaveRng, I_InventoryItemGameView, I_HaveMoneyAndBoxes, I_GoGambling, I_HaveInventory {

  private readonly _initial_box_price: number = 50;

  private readonly _initial_boxes: number = 10;


  public get rng(): Rand {
    return this._rng;
  }

  private _rng: Rand;

  private readonly _seed: string;

  /**
   * the inventory of items the player has, sorted by index in ascending order.
   */
  public get inventory(): ReadonlyArray<InventoryItem>{
    return this._inventory();
  }

  public readonly sorted_inventory: Signal<Array<InventoryItem>> = computed(() =>
    this._inventory()
      .filter(itm => itm.quantity() > 0)
      .sort((a, b) => b.total_value() - a.total_value())
  );

  private readonly _inventory: WritableSignal<Array<InventoryItem>> = signal([]);


  private _money: number = 0;

  /**
   * the player's current money.
   */
  public get money(): number {
    return this._money;
  }


  private _total_items_sold: number = 0;
  /**
   * How many items have been sold so far?
   */
  public get total_items_sold(): number {
    return this._total_items_sold;
  }

  private _total_boxes_opened: number = 0;
  /**
   * How many boxes have been opened so far?
   */
  public get total_boxes_opened(): number {
    return this._total_boxes_opened;
  }

  private readonly _boxes_between_increments: number = 10;

  private _boxes_until_next_increment: number = this._boxes_between_increments;
  /**
   * How many box openings remain until the box cost increases?
   */
  public get boxes_until_next_increment(): number {
    return this._boxes_until_next_increment;
  }

  private _total_money_spent: number = 0;
  /**
   * How much money has been spent so far?
   */
  public get total_money_spent(): number {
    return this._total_money_spent;
  }

  private _total_money_earned: number = 0;
  /**
   * How much money has been earned so far?
   */
  public get total_money_earned(): number {
    return this._total_money_earned;
  }

  private _boxes: number = this._initial_boxes;

  /**
   * the player's current number of boxes.
   */
  public get boxes(): number {
    return this._boxes;
  }

  private _box_price: number = this._initial_box_price;

  /**
   * the cost of a single box.
   */
  public get box_price(): number {
    return this._box_price;
  }

  /**
   * increase the cost of a single box by a random factor.
   */
  private _increment_box_price(): void {
    this._box_price *= 1 + random_power(3, this.rng);
  }

  /**
   * calculate the total cost of buying the specified number of boxes.
   * cost = box_price * (1 - 0.99^quantity) * quantity
   * @param box_quantity how many boxes to buy
   * @returns the total cost of buying the specified number of boxes.
   */
  public box_cost(box_quantity: number) {
    return this._box_price * (Math.pow(0.99, box_quantity - 1)) * box_quantity;
  }

  /**
   * Returns the maximum number of boxes that can be purchased with the current money.
   */
  public get max_purchasable_boxes(): number {
    let boxes = Math.floor(this._money / this._box_price);
    while (this.box_cost(boxes + 10) <= this._money) {
      boxes+=10;
    }
    while (this.box_cost(boxes + 1) <= this._money) {
      boxes++;
    }
    return boxes;
  }


  /**
   * returns true if the player is currently gambling, false otherwise.
   * this is used to prevent multiple gamblings from happening simultaneously.
   */
  public get gamba_in_progress(): boolean {
    return this._gamba_in_progress;
  }

  /**
   * Are we in the middle of a gambling session?
   * @private
   */
  private _gamba_in_progress: boolean = false;

  /**
   * shorthand to check if the player has boxes to go gambling with.
   */
  public get can_go_gambling(): boolean {
    return this.boxes > 0;
  }


  /**
   * Create a new game instance
   */
  constructor(
    private ref: ChangeDetectorRef
  ) {

    this._seed = crypto.randomUUID();

    this._rng = new Rand(this._seed);

    const inventory: Array<InventoryItem> = [];
    for (const rarity of rarities_arr) {
      for (const item of items_arr) {
        inventory.push(new InventoryItem(item, rarity, this));
      }
    }
    // inventory is sorted by index in ascending order.
    inventory.sort((a, b) => a.index - b.index);
    this._inventory.set(inventory);
    this._money = 0;
    this._total_items_sold = 0;
    this._total_boxes_opened = 0;
    this._boxes_until_next_increment = this._boxes_between_increments;
    this._total_money_spent = 0;
    this._total_money_earned = 0;
    this._boxes = this._initial_boxes;
    this._box_price = this._initial_box_price;
    this._gamba_in_progress = false;

    Sfx.sfx_gamba();
  }

  public reset(seed: string = crypto.randomUUID()): void {
    this._gamba_in_progress = false;

    this._rng = new Rand(seed);

    for (const item of this._inventory()) {
      item.reset();
    }
    // inventory is sorted by index in ascending order.
    this._inventory.set(this._inventory().sort((a, b) => a.index - b.index));

    this._money = 0;
    this._total_items_sold = 0;
    this._total_boxes_opened = 0;
    this._boxes_until_next_increment = this._boxes_between_increments;
    this._total_money_spent = 0;
    this._total_money_earned = 0;
    this._boxes = this._initial_boxes;
    this._box_price = this._initial_box_price;
    this._gamba_in_progress = false;
    Sfx.sfx_gamba();
    this.ref.detectChanges();
  }


  /**
   * Callback function for when items are sold.
   * It also detects if the player has lost the game (no boxes to open, out of things to sell, cannot afford boxes)
   *
   * @param quantity_sold the number of items sold.
   * @param money_earned money earned from the sale.
   */
  items_sold(quantity_sold: number, money_earned: number): void {
    quantity_sold = Math.max(0, quantity_sold);
    money_earned = Math.max(0, money_earned);
    this._money += money_earned;

    this._total_items_sold += quantity_sold;
    this._total_money_earned += money_earned;
    this.fluctuate_inventory();

    this.ref.detectChanges();

    if (this.is_game_over()){
      this._game_over_happened();
    } else {
      if (money_earned > 0 && quantity_sold > 0){
        Sfx.sfx_sell();
      }
    }
  }

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
  public async lets_go_gambling(): Promise<[boolean, I_ItemRarity | null]> {
    if (this._gamba_in_progress){
      return [false, null];
    }if (this.boxes <= 0){
      Sfx.sfx_no();
      return [false, null];
    }
    //this._gamba_in_progress = true;
    this._boxes -= 1;
    this._total_boxes_opened += 1;
    const [gamba_sfx, gamba_id] = Sfx.sfx_gamba();
    gamba_sfx.once('end', () => {this._gamba_in_progress = false}, gamba_id);


    const new_item = this._inventory()[InventoryItem.INDEX_FROM_COMPONENTS(random_item(this.rng), random_rarity(this.rng))];

    new_item.increment_quantity();

    this._boxes_until_next_increment -= 1;
    if (this.boxes_until_next_increment <= 0){
      this._increment_box_price();
      this._boxes_until_next_increment = this._boxes_between_increments;
    }

    if (this.rng.next() < 0.25){
      this.fluctuate_inventory();
    }
    this.ref.detectChanges();
    await waitUntilTrue(() => !this._gamba_in_progress);
    //Sfx.sfx_item();
    this.ref.detectChanges();
    return [true, new_item];
  }

  /**
  * Buy boxes, returning true if successful, false otherwise.
  * @param box_quantity The number of boxes to buy.
   * If not specified, the maximum number of boxes that can be purchased with the current money will be used.
  * @returns true if the boxes were successfully purchased, false otherwise.
  */
  public buy_boxes(box_quantity: number = 0): boolean {

    if (this._money < this._box_price){
      Sfx.sfx_no();
      return false;
    }
    if (box_quantity < 1 || this._money < this.box_cost(box_quantity)){
      box_quantity = this.max_purchasable_boxes;
      if (box_quantity < 1){
        Sfx.sfx_no();
        return false;
      }
    }
    const the_cost = this.box_cost(box_quantity);

    this._money -= the_cost;
    this._total_money_spent += the_cost;
    this._boxes += box_quantity;
    Sfx.sfx_buy();

    this.fluctuate_inventory();
    return true;
  }

  /**
   * adjust the value of all items in the inventory by a random factor.
   * this is used to make the game more interesting by making the value of items fluctuate over time.
   * Called every time an item is sold, and 25% of the time when gambling.
   */
  public fluctuate_inventory(): void {
    for (const item of this._inventory()) {
      item.fluctuate();
    }
    this.ref.detectChanges();
  }

  /**
   * Detects whether the player has lost the game.
   *
   * The game is over when the player's inventory is empty, and they don't have enough money to buy a box.
   * @returns true if the game is over, false otherwise.
   */
  public is_game_over(): boolean {
    return (this.boxes <= 0 && this._money < this.box_price && this.inventory_item_count() <= 0);
  }

  /**
   * returns the total value of the inventory, including money and items.
   * this is used to determine the net worth of the player.
   */
  public get net_worth(): number {
    return this.money + this.inventory_item_value;
  }

  /**
   * returns the number of items in the inventory.
   */
  public get get_inventory_item_count(): number {
    return this.inventory_item_count();
  }

  /**
   * returns the number of items in the inventory.
   */
  public readonly inventory_item_count: Signal<number> = computed(
    () => this._inventory().reduce((acc, item) => acc + item.quantity(), 0)
  );

  /**
   * returns the total value of all items in the inventory.
   * this is used to determine the value of the inventory as a whole.
   */
  public get inventory_item_value(): number {
    return this._inventory().reduce((acc, item) => acc + item.total_value(), 0);
  }

  /**
   * returns the average value of all items in the inventory.
   */
  public get inventory_item_value_per_item(): number {
    return this.inventory_item_value / this.inventory_item_count();
  }


  readonly dialog = inject(MatDialog);

  /**
   * shows the game over message
   */
  private _game_over_happened(): void {
    Sfx.sfx_game_over();

    const dialogRef = this.dialog.open(GameOverDialog, {
      data: {
        money_symbol: money_symbol,
        money: this.money,
        box_price: this.box_price,
        total_boxes_opened: this.total_boxes_opened,
        total_money_spent: this.total_money_spent,
        total_items_sold: this.total_items_sold,
        total_money_earned: this.total_money_earned,
        seed: this._seed
      },
    });
    dialogRef.afterClosed().subscribe(result => this.reset());
    /*
    window.confirm(`GAME OVER!

    You do not have enough money to continue your gambling streak.

    You only have ${money_symbol}${this.money} left to spend, but boxes cost ${money_symbol}${this.box_price}.

    Boxes opened: ${this.total_boxes_opened}
    Money spent: ${money_symbol}${this.total_money_spent}
    Total items sold: ${this.total_items_sold}
    Money earned: ${money_symbol}${this.total_money_earned}

    Seed: ${this._seed}`);*/

  }

  protected readonly money_symbol = money_symbol;
}





