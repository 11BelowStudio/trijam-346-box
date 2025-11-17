import Rand from 'rand-seed';

import {Item, items_dict, items_arr} from './items';
import {Rarity, rarities_dict, rarities_arr} from './rarities';
import {money_symbol, random_power} from './utils';
import {I_InventoryItemGameView} from './interfaces/I_InventoryItemGameView';
import {I_ItemRarity} from './interfaces/I_ItemRarity';

//import { Component } from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Game} from '../game/game';
import {signal, WritableSignal, Signal, computed} from '@angular/core';


export class InventoryItem implements I_ItemRarity {
  public get item(): Item {
    return this._item;
  }
  public get rarity(): Rarity {
    return this._rarity;
  }

  public get name(): string {
    return `${this._item.name} (${this._rarity.name})`;
  }

  public get icon_url(): string {
    return this._item.icon_url;
  }

  public get colour(): string {
    return this._rarity.colour;
  }

  public get quantity(): Signal<number>{
    return this._quantity;
  }
  public set quantity(value: number) {
    if (value < 0) {
      value = 0;
    }
    this._quantity.set(Math.floor(value));
  }

  public get price(): Signal<number> {
    return this._price;
  }


  public readonly total_value: Signal<number> = computed( () => this.price() * this.quantity());

  /**
   * increase or decrease the value of this item by a random factor
   */
  public fluctuate(): void {
    let price: number = this._price();
    price *= 1 + (random_power(3, this._game.rng) * (this._game.rng.next() < 0.5 ? -1 : 1));
    price = Math.max(0.0005, price);
    this._price.set(price);
  }

  /**
   * depreciate the value of this item by a random factor
   */
  public depreciate (): void {
    let price: number = this._price();
    price *= 1 - random_power(2, this._game.rng);
    price = Math.max(0.0005, price);
    this._price.set(price);
  }

  /**
   * sell a given amount of this item, then notify the game about the sale
   * @param sell_quantity the quantity of this item to sell (negative numbers = sell all)
   * @returns the total value of the sale (game is notified automagically)
   */
  public sell(sell_quantity: number = -1): number {
    sell_quantity = Math.floor(sell_quantity);
    if (sell_quantity < 0){
      sell_quantity = this._quantity();
    }
    if (sell_quantity == 0){
      return 0;
    }
    else if (sell_quantity > this._quantity()){
      sell_quantity = this._quantity();
    }
    this._quantity.set(this._quantity() - sell_quantity);
    const sell_amount = this._price() * sell_quantity;
    this.depreciate();
    this._game.items_sold(sell_quantity, sell_amount);
    return sell_amount;
  }

  public increment_quantity(): void {
    this._quantity.set(this.quantity() + 1);
  }

  private readonly _item: Item;
  private readonly _rarity: Rarity;
  private _quantity: WritableSignal<number> = signal(0);

  private _price: WritableSignal<number> = signal(0);

  public get index(): number {
    return this._index;
  }
  private readonly _index: number;

  private readonly _game: I_InventoryItemGameView;


  constructor(item: Item, rarity: Rarity, game: Game | I_InventoryItemGameView) {
    this._item = item;
    this._rarity = rarity;
    this._game = game;
    this._quantity.set(0);
    this._index = InventoryItem.INDEX_FROM_COMPONENTS(item, rarity);
    this._price.set(item.val_multiplier * rarity.val_multiplier);
    this.fluctuate();
  }

  static INDEX_FROM_COMPONENTS(item: Item, rarity: Rarity): number {
    return (rarities_arr.indexOf(rarity) * items_arr.length) + items_arr.indexOf(item);
  }

  public reset(){
    this._quantity.set(0);
    this._price.set(this._item.val_multiplier * this._rarity.val_multiplier);
    this.fluctuate();
  }

  public get money_symbol_redundant(): string {
    return money_symbol;
  }

}
