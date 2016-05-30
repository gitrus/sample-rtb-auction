import R from 'ramda';

export default function auction(creatives, totalWinners, country) {
// check arguments
  if (!Array.isArray(creatives)) {
    throw new TypeError('ArgumentTypeError: First argument required and must be an array (creatives).');
  }
  creatives.map((creative, i) => {
    if (!Number.isSafeInteger(creative.advertiserId)) {
      throw new TypeError(`ArgumentTypeError: creatives[${i}].advertiserId must be integer.`);
    }
    if (typeof creative.price !== 'number' || creative.price <= 0) {
      throw new TypeError(`ArgumentTypeError: creatives[${i}].price must be positive number.`);
    }
    if (!!creative.country && typeof creative.country !== 'string') {
      throw new TypeError(`ArgumentTypeError: creatives[${i}].country must be a string.`);
    }
  });

  if (!Number.isSafeInteger(totalWinners) || totalWinners < 0) {
    throw new TypeError('ArgumentTypeError: Second argument required and must be non-negative integer (number of winners).');
  }

  if(!!country && typeof country !== 'string') {
    throw new TypeError(`ArgumentTypeError: Country must be a string.`)
  }

  if (totalWinners === 0 || creatives.length === 0){
    return [];
  }

// body

  Array.prototype.swap = function(i1, i2) {
    var temp = this[i1];
    this[i1] = this[i2];
    this[i2] = temp;
  }

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const nRandomElementsFromArray = (n, arr) => {
    let array = arr.slice();
    let index;
    const rtrndArray = [];

    for (let i = n; i--;) {
      index = getRandomInt(0, array.length-1);
      rtrndArray.push(array[index]);

      array.splice(index, 1);
    }

    return rtrndArray;
  };

  let creativeArray = creatives;
  let winningCreatives = [];

  if (country) {
    creativeArray = creativeArray.filter((creative) => {
      return !creative.country || creative.country === country;
    });
  }

  const creativesGroupedByAdvId = R.groupBy((creative) => {
    return creative.advertiserId;
  })(creativeArray);


  const crtvsWithUniqAdvId = Object.keys(creativesGroupedByAdvId).map((key) =>
    creativesGroupedByAdvId[key].reduce((acc, creative) => {

      if(acc.price > creative.price){
        return acc;
      }
      else if (acc.price === creative.price) {
        return (Math.random > 0.5) ? acc : creative;
      }
      else {
        return creative;
      }

    })
  );

  if(totalWinners >= crtvsWithUniqAdvId.length) {
    return crtvsWithUniqAdvId;
  }

  for (let i = 0; i < totalWinners; ++i) {
    for (let j = i + 1; j < crtvsWithUniqAdvId.length; ++j) {
      if(crtvsWithUniqAdvId[i].price < crtvsWithUniqAdvId[j].price) {
        crtvsWithUniqAdvId.swap(i, j);
      }
    }
  }

  if (
    R.findLastIndex(R.propEq('price', crtvsWithUniqAdvId[totalWinners - 1].price), crtvsWithUniqAdvId)
    !==
    (totalWinners - 1)
  ) {
    winningCreatives = crtvsWithUniqAdvId.slice(
      0,
      R.findIndex(R.propEq('price', crtvsWithUniqAdvId[totalWinners - 1].price), crtvsWithUniqAdvId)
    );

    winningCreatives = winningCreatives.concat(
      nRandomElementsFromArray(
        totalWinners - R.findIndex(R.propEq('price', crtvsWithUniqAdvId[totalWinners - 1].price), crtvsWithUniqAdvId),
        crtvsWithUniqAdvId.filter((e) => e.price === crtvsWithUniqAdvId[totalWinners - 1].price)
      )
    );
  } else {
    winningCreatives = crtvsWithUniqAdvId.slice(0, totalWinners);
  }

  return winningCreatives;
}
