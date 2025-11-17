import Rand from 'rand-seed';

/**
 * Represents a class of items which can be obtained.
 */
class Item {

  /**
  * The relative chance of this item type being rolled.
  */
  get chance(): number {
    return this._chance;
  }
  set chance(value: number) {
    this._chance = value;
  }
  get val_multiplier(): number {
    return this._val_multiplier;
  }
  get icon_url(): string {
    return this._icon_url;
  }
  get initial_chance(): number {
    return this._initial_chance;
  }

  get index(): number {
    return this._index;
  }
  /**
   * The name of this item type.
   */
  public readonly name: string;
  private readonly _icon_url: string;
  /**
   * The initial relative chance of this item type being rolled.
   */
  private readonly _initial_chance: number;
  /**
   * The relative chance of this item type being rolled.
   */
  private _chance: number;

  /**
   * The value multiplier of this item type.
   */
  private readonly _val_multiplier: number;
  /**
   * The index of this item type in the array of items.
   */
  private readonly _index: number;

  constructor(name: string, icon_url: string, initial_chance: number, val_multiplier: number, index: number) {
    this.name = name;
    this._icon_url = icon_url;
    this._initial_chance = initial_chance;
    this._chance = initial_chance;
    this._val_multiplier = val_multiplier;
    this._index = index;
  }
}

const trash = new Item("trash", "/assets/trash.svg", 100, 0.001, 0);
const can = new Item("leftovers", "/assets/opened-food-can.svg", 125, 0.01, 1);
const spring = new Item("junk", "/assets/spring.svg", 250, 0.1, 2);
const clown = new Item("clown", "/assets/clown.svg", 500, 1, 3);
const flower = new Item("flower pot", "/assets/flower.svg", 1000, 5, 4);
const duck = new Item("duck", "/assets/plastic-duck.svg", 1500, 10, 5);
const scissors = new Item("scissors", "/assets/scissors.svg", 975, 11, 6);
const beach_ball = new Item("beach ball", "/assets/beach_ball.svg", 950, 12.5, 7);
const shirt = new Item("t-shirt", "/assets/t-shirt.svg", 925, 15, 8);
const unicycle = new Item("unicycle", "/assets/unicycle.svg", 800, 20, 9);
const book = new Item("book", "/assets/white-book.svg", 700, 30, 10);
const skimmer_hat = new Item("skimmer hat", "/assets/skimmer-hat.svg", 600, 40, 11);
const sunglasses = new Item("sunglasses", "/assets/sunglasses.svg", 500, 50, 12);
const potion = new Item("potion-ball", "/assets/potion-ball.svg", 400, 60, 13);
const card = new Item("card", "/assets/card-7-diamonds.svg", 300, 77, 14);
const gladius = new Item("gladius", "/assets/gladius.svg", 200, 80, 15);
const crown = new Item("crown", "/assets/crown.svg", 50, 100, 16);

/**
 * An array of all the items that can be obtained.
 */
const items_arr: readonly Item[] = [trash, can, spring, clown, flower, duck, scissors, beach_ball, shirt, unicycle, book, skimmer_hat, sunglasses, potion, card, gladius, crown];

/**
 * A dictionary of all the items that can be obtained, indexed by their name.
 */
const items_dict: Record<string, Item> = items_arr.reduce((acc, itm) => ({...acc, [itm.name]: itm}), {});

/**
 * Returns the sum of chances of all the items in the array.
 */
function get_item_sum() : number {
  return items_arr.reduce((acc, itm) => acc + itm.chance, 0);
}

/**
 * Returns a random item from the array of items.
 * @param rng the seeded RNG we're using for this run
 */
function random_item(rng: Rand): Item {
  let item_roll: number = ((typeof rng !== 'undefined') ? rng.next() : Math.random() ) * get_item_sum();

  for (const itm of items_arr) {
    item_roll -= itm.chance;
    if (item_roll <= 0) {
      return itm;
    }
  }
  return items_arr[items_arr.length - 1];
}

export {Item, items_arr, items_dict, random_item}
