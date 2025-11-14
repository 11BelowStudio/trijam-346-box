

import {Howl, Howler} from 'howler';

import {sprintf} from 'sprintf-js';

export const Asset_db = {



  sfx_money: function(): void {
    _random_itm(sfx_money_arr).play();
  },

  sfx_game_over: function(): void {
    _random_itm(sfx_gameover_arr).play();
  },

  sfx_item: function(): void {
    _random_itm(sfx_item_arr).play();
  },

  sfx_gamba: function(): void {
    _random_itm(sfx_gamba_arr).play();
  },

  sfx_no: function(): void {
    _random_itm(sfx_no_arr).play();
  },

  sfx_sell: function(): void {
    _random_itm(sfx_sell_arr).play();
  },

  sfx_yes: function(): void {
    _random_itm(sfx_yes_arr).play();
  }
}

function _random_itm<T>(arr: ArrayLike<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function howl_loader(filename: string, count: number = 0) : Howl[] {
  if (count < 1){
    return [new Howl({
      src: filename
    })];
  }
  let res: Howl[] = []
  for (let i = 1; i <= count ; i++) {
    res.push(new Howl({
      src: [sprintf(filename, count)]
    }))
  }
  return res;
}

const sfx_money_arr: readonly Howl[] = howl_loader("/audio/voice/money_%i.mp3",10);

const _sfx_the_word_playing: Howl = new Howl({
  src :["/audio/voice/playing.mp3"]
});

const _sfx_thank_you_for: Howl = new Howl({
  src: ["/audio/voice/thank_you_for.mp3"],
  onend: soundId => {
    if (Math.random() >= 0.5){
      _sfx_the_word_playing.play();
    } else {
      Asset_db.sfx_money();
    }
  }
})

const sfx_gameover_arr: readonly Howl[] = howl_loader("/audio/voice/game_over_%i.mp3", 4)
  .concat(howl_loader("/audio/voice/skill_issue.mp3"))
  .concat(howl_loader("/audio/voice/try_again.mp3"))
  .concat([_sfx_thank_you_for])
;

const sfx_item_arr: readonly Howl[] = howl_loader("/audio/voice/item_%i.mp3", 3);

const sfx_gamba_arr: readonly Howl[] = howl_loader("/audio/voice/lets_gambling_%i.mp3",7);

const sfx_no_arr: readonly Howl[] = howl_loader("/audio/voice/no_%i.mp3", 3);

const sfx_sell_arr: readonly Howl[] = howl_loader("/audio/voice/sell_%i.mp3", 2).concat(sfx_money_arr);

const sfx_yes_arr: readonly Howl[] = howl_loader("/audio/voice/yes_%i.mp3",5);


