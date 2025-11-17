import Rand from 'rand-seed';


const Utils = {




}

const money_symbol: string = (Math.random() >= 0.5) ? "₥" : "₷";

function random_power(iterations: number, rng: Rand): number {
  let res: number = 1;
  for (let i = 0; i < iterations; i++) {
    res *= rng.next();
  }
  return res;
}


/**
 * from https://stackoverflow.com/a/78373940
 *
 * @async
 * @function waitUntilTrue
 * @param {() => boolean} conditionFunction
 * @param {number} [interval=10]
 * @param {number} [timeout=10000]
 * @param {boolean} [throwOnTimeout=false]
 * @returns {Promise<void>}
 */
async function waitUntilTrue(
  conditionFunction: () => boolean,
  interval: number = 10,
  timeout: number = 10000,
  throwOnTimeout: boolean = false,
): Promise<void> {
  let timePassed = 0;
  return new Promise(function poll(resolve, reject) {
    if (timePassed >= timeout) {
      return throwOnTimeout ? reject() : resolve();
    }
    if (conditionFunction()) {
      return resolve();
    }
    timePassed += interval;
    setTimeout(() => poll(resolve, reject), interval);
  });
}



export {
  money_symbol,
  random_power,
  waitUntilTrue,
};
