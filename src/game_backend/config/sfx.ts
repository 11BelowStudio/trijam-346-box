

import {Howl, Howler} from 'howler';

import {sprintf} from 'sprintf-js';

const Sfx = {



  sfx_money: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_money_arr);
    return [snd, snd.play()]
  },

  sfx_game_over: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_gameover_arr);
    return [snd, snd.play()];
  },

  sfx_item: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_item_arr);
    return [snd, snd.play()];
  },

  sfx_gamba: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_gamba_arr);
    return [snd, snd.play()];
  },

  sfx_no: function(): [Howl, number]{
    const snd: Howl = _random_itm(sfx_no_arr);
    return [snd, snd.play()];
  },

  sfx_sell: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_sell_arr);
    return [snd, snd.play()];
  },

  sfx_yes: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_yes_arr);
    return [snd, snd.play()];
  },

  sfx_buy: function(): [Howl, number] {
    const snd: Howl = _random_itm(sfx_purchase_arr);
    return [snd, snd.play()];
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
      src: [sprintf(filename, i)]
    }))
  }
  return res;
}

const sfx_money_arr: readonly Howl[] = howl_loader("/audio/voice/money_%i.mp3",10);

const _sfx_the_word_playing: Howl = new Howl({
  src :["/audio/voice/playing.mp3"]
});

const _sfx_thank_you_for_playing: Howl = new Howl({
  src: ["/audio/voice/thank_you_for.mp3"],
  onend: soundId => {
    if (Math.random() >= 0.5){
      const h1: Howl = _sfx_the_word_playing;
      const id1: number = h1.play();
      if (Math.random() >= 0.5){
        h1.once('end', () => {
          sfx_come_again.play();
        }, id1);
      }
    } else {
      const [h2, id2] = Sfx.sfx_money();
      if (Math.random() >= 0.5){
        h2.once('end', () => {
          sfx_come_again.play();
        }, id2);
      }
    }
  }
})

const sfx_gameover_arr: readonly Howl[] = howl_loader("/audio/voice/game_over_%i.mp3", 4)
  .concat(howl_loader("/audio/voice/skill_issue.mp3"))
  .concat(howl_loader("/audio/voice/try_again.mp3"))
  .concat([_sfx_thank_you_for_playing])
;

const sfx_item_arr: readonly Howl[] = howl_loader("/audio/voice/item_%i.mp3", 3);

const sfx_gamba_arr: readonly Howl[] = howl_loader("/audio/voice/lets_gambling_%i.mp3",8);

const sfx_no_arr: readonly Howl[] = howl_loader("/audio/voice/no_%i.mp3", 3);

const sfx_sell_arr: readonly Howl[] = howl_loader("/audio/voice/sell_%i.mp3", 2).concat(sfx_money_arr);

const sfx_yes_arr: readonly Howl[] = howl_loader("/audio/voice/yes_%i.mp3",5);

const sfx_no_refund_arr: readonly Howl[] = howl_loader("/audio/voice/no_refund_%i.mp3", 5);

const sfx_buy_arr: readonly Howl[] = howl_loader("/audio/voice/buy_%i.mp3", 3);

const sfx_box_arr: readonly Howl[] = howl_loader("/audio/voice/box_%i.mp3", 8);

const sfx_good_luck: Howl = new Howl({
  src: ["/audio/voice/good_luck.mp3"]
});

const sfx_come_again: Howl = new Howl({
  src: ["/audio/voice/come_again.mp3"]
});

const sfx_thank_you_for_buying: Howl = new Howl({
  src: ["/audio/voice/thank_you_for.mp3"],
  onend: soundId => {
    if (Math.random() >= 0.5){
      const h1 = _random_itm(sfx_buy_arr)
      const id1 = h1.play();
      if (Math.random() >= 0.5){
        h1.once('end', () => {
          sfx_come_again.play();
        }, id1);
      }
    } else {
      const [h2, id2] = Sfx.sfx_money();
      if (Math.random() >= 0.5){
        h2.once('end', () => {
          sfx_come_again.play();
        }, id2);
      }
    }
  }
});

const sfx_purchase_arr: readonly Howl[] = sfx_buy_arr
  .concat(sfx_box_arr)
  .concat(sfx_no_refund_arr)
  .concat([sfx_thank_you_for_buying, sfx_good_luck]);

export {
  Sfx
}
