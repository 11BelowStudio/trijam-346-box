import Rand from 'rand-seed';

/**
 * Represents the rarity tiers of items which can be obtained.
 */
class Rarity {
  /**
   * The relative chance of this rarity being rolled.
   */
  get chance(): number {
    return this._chance;
  }

  set chance(value: number) {
    this._chance = value;
  }
  /**
   * The value multiplier of this rarity.
   */
  get val_multiplier(): number {
    return this._val_multiplier;
  }

  /**
   * The colour of this rarity.
   */
  get colour(): string {
    return this._colour;
  }
  /**
   * The initial relative chance of this rarity being rolled.
   */
  get initial_chance(): number {
    return this._initial_chance;
  }

  /**
   * The index of this rarity in the array of rarities.
   */
  get index(): number {
    return this._index;
  }

  /**
   * The name of this rarity.
   */
  public readonly name: string;

  private readonly _colour: string;

  private readonly _initial_chance: number;

  private _chance: number;

  private readonly _val_multiplier: number;

  private readonly _index: number;


  constructor(name: string, colour: string, initial_chance: number, val_multiplier: number, index: number) {
    this.name = name;
    this._colour = colour;
    this._initial_chance = initial_chance;
    this._chance = initial_chance;
    this._val_multiplier = val_multiplier;

    this._index = index;
  }
}

const boring = new Rarity("boring", "#fafaf2", 512, 1, 0);
const common = new Rarity("common", "#6090C0", 340, 1.5, 1);
const mediocre = new Rarity("mediocre", "#70c0e0", 256, 2, 2);
const alright = new Rarity("alright", "#80ffff", 205, 2.5, 3);
const nice = new Rarity("nice", "#80ff80", 170, 3, 4);
const decent = new Rarity("decent", "#ffff80", 128, 4, 5);
const cool = new Rarity("cool", "#ffa040", 64, 5, 6);
const rare = new Rarity("rare", "#ff4040", 32, 6, 7);
const amazing = new Rarity("amazing", "#d080ff", 16, 7, 8);
const woagh = new Rarity("woagh", "#ff80c0", 8, 8, 9);
const disappointing = new Rarity("disappointing", "#804000", 1, 0.1, 10);

/**
 * An array of all the rarities that can be obtained.
 */
const rarities_arr: readonly Rarity[] = [boring, common, mediocre, alright, nice, decent, cool, rare, amazing, woagh, disappointing];

/**
 * A dictionary of all the rarities that can be obtained, indexed by their name.
 */
const rarities_dict: Record<string, Rarity> = rarities_arr.reduce((acc, rarity) => ({...acc, [rarity.name]: rarity}), {});

/**
 * returns the sum of chances of all the rarities in the array.
 */
function get_rarity_sum() : number {
  return rarities_arr.reduce((acc, rarity) => acc + rarity.chance, 0);
}

/**
 * returns a random rarity from the array of rarities.
 * @param rng the seeded RNG we're using for this run
 */
function random_rarity(rng: Rand): Rarity {
  let rarity_roll: number = ((typeof rng !== 'undefined') ? rng.next() : Math.random() ) * get_rarity_sum();

  for (const rarity of rarities_arr) {
    rarity_roll -= rarity.chance;
    if (rarity_roll <= 0) {
      return rarity;
    }
  }
  return rarities_arr[rarities_arr.length - 1];
}

export {Rarity, rarities_arr, rarities_dict, random_rarity}
