import { Component } from '@angular/core';
import { Rarity, rarities_arr, rarities_dict } from '../game_backend/rarities';
import {Item, items_arr, items_dict} from "../game_backend/items";

@Component({
  selector: 'app-item_icon',
  imports: [],
  template: `
    <img [src]="icon_url" style="fill: {{ rarityColour }};" alt="item"/>
  `,
  //templateUrl: './item_icon.html',
  styleUrl: './item_icon.scss',
})
export class Item_icon {

  constructor() {

  }

  icon_url: string = "";
  rarityColour: string = "#ff80c0";
}
