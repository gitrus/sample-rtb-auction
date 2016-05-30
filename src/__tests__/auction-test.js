import auction from '../auction';

var createPairsFromArray = (array) => {
  var rtrndArray = [];

  for (var i = 0; i < array.length - 1; ++i) {
    for (var j = i + 1; j < array.length; ++j) {
      rtrndArray.push([array[i], array[j]])
    }
  }

  return rtrndArray;
};

var createSingleFromArray = (array) => {
  return array.map((e)=>[e]);
};

var creativesEquality = function(first, second) {
  if (!Array.isArray(first) || !Array.isArray(second)) {
    return false;
  }

  var creativeEquality = function(crtv1, crtv2) {
    return crtv1.advertiserId === crtv2.advertiserId
      && crtv1.country === crtv2.country
      && crtv1.price === crtv2.price;
  };
  if( first.length === 0 && first.length === second.length ) return true;
  return first.length === second.length
    && first.map((creative) => second.some((e) =>  creativeEquality(creative, e))).reduce((acc, e) => acc && e);
};

describe('Auction', function(){
  //negative tests
  it('should throw first argument requirement exception', function(){
    expect(function(){ auction() })
      .toThrow(new TypeError('ArgumentTypeError: First argument required and must be an array (creatives).'));
  });
  it('should throw first argument type exception', function(){
    expect(function(){ auction({},5) })
      .toThrow(new TypeError('ArgumentTypeError: First argument required and must be an array (creatives).'));
  });

  it('should throw creative.advertiserId type exception', function(){
    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: undefined,
        price: 0.5,
        country: '',
      },
    ];

    expect(function(){ auction(creatives, 1) })
      .toThrow(new TypeError('ArgumentTypeError: creatives[1].advertiserId must be integer.'));
  });
  it('should throw creative.price type exception', function(){
    var creativesA = [
      {
        advertiserId: 2,
        price: 0.5,
        country: 'Russia',
      },
      {
        advertiserId: 2,
        price: '',
        country: 'Andorra',
      },
      {
        advertiserId: 3,
        price: 0.3,
        country: 'Andorra',
      },
    ];
    var creativesB = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 2,
        price: 0,
        country: 'Russia',
      },
      {
        advertiserId: 2,
        price: 0.1,
        country: 'Andorra',
      },
    ];

    expect(function(){ auction(creativesA, 1) })
      .toThrow(new TypeError('ArgumentTypeError: creatives[1].price must be positive number.'));
    expect(function(){ auction(creativesB, 1) })
      .toThrow(new TypeError('ArgumentTypeError: creatives[1].price must be positive number.'));
  });
  it('should throw creative.country type exception', function(){
    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 2,
        price: 0.3,
        country: 'Russia',
      },
      {
        advertiserId: 2,
        price: 0.1,
      },
      {
        advertiserId: 3,
        price: 0.3,
        country: 3,
      },
    ];

    expect(function(){ auction(creatives, 1) })
      .toThrow(new TypeError('ArgumentTypeError: creatives[3].country must be a string.'));
  });

  it('should throw second argument requirement exception', function(){
    expect(function(){ auction([]) })
      .toThrow(new TypeError("ArgumentTypeError: Second argument required and must be non-negative integer (number of winners)."));
  });
  it('should throw second argument type exception', function(){
    expect(function(){ auction([], 'str') })
      .toThrow(new TypeError("ArgumentTypeError: Second argument required and must be non-negative integer (number of winners)."));
  });

  it('should throw second argument type exception', function(){
    expect(function(){ auction([], 4, 5) })
      .toThrow(new TypeError("ArgumentTypeError: Country must be a string."));
  });

  //positive tests
  it('positive test simple behaviour', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.1,
      },
      {
        advertiserId: 4,
        price: 0.35,
      },
    ];

    expect(auction(creatives, 2))
      .toEqual([
        {
          advertiserId: 1,
          price: 0.45,
          country: '',
        },
        {
          advertiserId: 2,
          price: 0.40,
          country: 'Russia',
        },
      ]);
  });

  it('positive test simple behaviour with country filtering', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 3,
        price: 0.5,
        country: 'USA'
      },
      {
        advertiserId: 4,
        price: 0.35,
      },
      {
        advertiserId: 5,
        price: 0.40,
        country: 'Russia',
      },
    ];

    expect(auction(creatives, 2, 'Russia'))
      .toEqual([
        {
          advertiserId: 1,
          price: 0.45,
          country: '',
        },
        {
          advertiserId: 5,
          price: 0.40,
          country: 'Russia',
        },
      ]);
  });

  it('positive test behaviour with unique advertiserId filtering', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.444,
        country: 'Russia',
      },
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 1,
        price: 0.40,
        country: 'USA',
      },
      {
        advertiserId: 2,
        price: 0.5,
        country: 'USA'
      },
      {
        advertiserId: 2,
        price: 0.35,
      },
      {
        advertiserId: 7,
        price: 0.3,
      },
      {
        advertiserId: 5,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 6,
        price: 0.35,
      },
    ];

    expect(auction(creatives, 4))
      .toEqual([
        {
          advertiserId: 2,
          price: 0.5,
          country: 'USA'
        },
        {
          advertiserId: 1,
          price: 0.45,
          country: '',
        },
        {
          advertiserId: 5,
          price: 0.40,
          country: 'Russia',
        },
        {
          advertiserId: 6,
          price: 0.35,
        },
      ]);
  });

  it('positive test behaviour with unique advertiserId and country filtering', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.444,
        country: 'Russia',
      },
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 1,
        price: 0.40,
        country: 'Bulgaria',
      },
      {
        advertiserId: 2,
        price: 0.5,
        country: 'Bulgaria',
      },
      {
        advertiserId: 2,
        price: 0.35,
        country: 'Bulgaria',
      },
      {
        advertiserId: 7,
        price: 0.3,
      },
      {
        advertiserId: 5,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 6,
        price: 0.35,
      },
    ];

    expect(auction(creatives, 3, 'Bulgaria'))
      .toEqual([
        {
          advertiserId: 2,
          price: 0.5,
          country: 'Bulgaria',
        },
        {
          advertiserId: 1,
          price: 0.45,
          country: '',
        },
        {
          advertiserId: 6,
          price: 0.35,
        },
      ]);
  });

  it('positive test simple behaviour number of winners equal 0', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.1,
      },
      {
        advertiserId: 4,
        price: 0.35,
      },
    ];

    expect(auction(creatives, 0))
      .toEqual([]);
    expect(auction(creatives, 0, 'Russia'))
      .toEqual([]);
  });

  it('positive test simple behaviour creatives.length equal 0', function(){
    beforeEach(function() {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [];

    expect(auction(creatives, 10))
      .toEqual([]);
    expect(auction(creatives, 10, 'USA'))
      .toEqual([]);
  });

  // simple check sum of n of uniform distribution should have a normal distribution.
  it('positive test simple behaviour with random', function () {
    beforeEach(function () {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.40,
      },
      {
        advertiserId: 4,
        price: 0.40,
      },
      {
        advertiserId: 4,
        price: 0.35,
      },
      {
        advertiserId: 7,
        price: 0.10,
        country: 'Russia',
      },
    ];
    var numberOfTests = 1000;
    var winningSets = [];

    var subArrayOfWinners = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      }
    ];
    var subArrayOfRandomWinners = [
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.40,
      },
      {
        advertiserId: 4,
        price: 0.40,
      },
    ];

    for (var i = numberOfTests; i--;) {
      winningSets[i] = auction(creatives, 2);
    }

    var indexingArray = winningSets.map((winningSet) =>
      createSingleFromArray(subArrayOfRandomWinners).reduce((acc, single, i) =>{
        return  acc || (creativesEquality(winningSet, subArrayOfWinners.concat(single)) ? i + 1 : false);
      }, false)
    );

    expect(indexingArray.reduce((acc, e) => acc && e))
      .toBeTruthy();
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeGreaterThan(numberOfTests * 1.33);
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeLessThan(numberOfTests * 2.66);
  });

  it('positive test behaviour with random and country filtering', function () {
    beforeEach(function () {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 7,
        price: 0.10,
        country: 'USA',
      },
      {
        advertiserId: 1,
        price: 1,
        country: '',
      },
      {
        advertiserId: 3,
        price: 0.5,
        country: 'USA'
      },
      {
        advertiserId: 4,
        price: 0.5,
      },
      {
        advertiserId: 5,
        price: 0.50,
        country: 'Russia',
      },
    ];

    var numberOfTests = 1000;
    var winningSets = [];

    for (var i = numberOfTests; i--;) {
      winningSets[i] = auction(creatives, 2, 'USA');
    }

    var subArrayOfWinners = [
      {
        advertiserId: 1,
        price: 1,
        country: '',
      },
    ];

    var subArrayOfRandomWinners = [
      {
        advertiserId: 3,
        price: 0.5,
        country: 'USA'
      },
      {
        advertiserId: 4,
        price: 0.5,
      },
    ];

    var indexingArray = winningSets.map((winningSet) =>
      createSingleFromArray(subArrayOfRandomWinners).reduce((acc, single, i) =>{
        return  acc || (creativesEquality(winningSet, subArrayOfWinners.concat(single)) ? i + 1 : false);
      }, false)
    );

    expect(indexingArray.reduce((acc, e) => acc && e))
      .toBeTruthy();
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeGreaterThan(numberOfTests * 1.33);
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeLessThan(numberOfTests * 2.66);
  });

  it('positive test behaviour with random and advertiserId filtering', function () {
    beforeEach(function () {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 7,
        price: 0.10,
        country: 'Russia',
      },
      {
        advertiserId: 1,
        price: 0.5,
        country: 'Russia',
      },
      {
        advertiserId: 1,
        price: 0.6,
        country: 'Bulgaria',
      },
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.50,
      },
      {
        advertiserId: 3,
        price: 0.45,
        country: 'USA',
      },
      {
        advertiserId: 4,
        price: 0.4,
      },
      {
        advertiserId: 5,
        price: 0.4,
        country: '',
      },
      {
        advertiserId: 6,
        price: 0.4,
        country: 'Russia',
      },
    ];
    var numberOfTests = 1000;
    var winningSets = [];

    for (var i = numberOfTests; i--;) {
      winningSets[i] = auction(creatives, 3);
    }

    var subArrayOfWinners = [
      {
        advertiserId: 1,
        price: 0.6,
        country: 'Bulgaria',
      },
      {
        advertiserId: 3,
        price: 0.50,
      },
    ];

    var subArrayOfRandomWinners = [
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 4,
        price: 0.4,
      },
      {
        advertiserId: 5,
        price: 0.4,
        country: '',
      },
      {
        advertiserId: 6,
        price: 0.4,
        country: 'Russia',
      },
    ];

    var indexingArray = winningSets.map((winningSet) =>
      createSingleFromArray(subArrayOfRandomWinners).reduce((acc, single, i) =>{
        return  acc || (creativesEquality(winningSet, subArrayOfWinners.concat(single)) ? i + 1 : false);
      }, false)
    );

    expect(indexingArray.reduce((acc, e) => acc && e))
      .toBeTruthy();
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeGreaterThan(numberOfTests * 1.33);
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeLessThan(numberOfTests * 2.66);
  });

  it('positive test behaviour with random and advertiserId, country filtering', function () {
    beforeEach(function () {
      jasmine.addCustomEqualityTester(creativesEquality);
    });

    var creatives = [
      {
        advertiserId: 1,
        price: 0.45,
        country: '',
      },
      {
        advertiserId: 1,
        price: 0.5,
        country: 'Russia',
      },
      {
        advertiserId: 1,
        price: 0.6,
        country: 'Bulgaria',
      },
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.50,
      },
      {
        advertiserId: 3,
        price: 0.50,
        country: 'USA',
      },
      {
        advertiserId: 4,
        price: 0.4,
      },
      {
        advertiserId: 5,
        price: 0.4,
        country: '',
      },
      {
        advertiserId: 7,
        price: 0.10,
        country: 'Russia',
      },
      {
        advertiserId: 6,
        price: 0.4,
        country: 'Russia',
      },
    ];
    var numberOfTests = 1000;
    var winningSets = [];

    for (var i = numberOfTests; i--;) {
      winningSets[i] = auction(creatives, 4, 'Russia');
    }

    var subArrayOfWinners = [
      {
        advertiserId: 1,
        price: 0.5,
        country: 'Russia',
      },
      {
        advertiserId: 3,
        price: 0.50,
      },
    ];

    var subArrayOfRandomWinners = [
      {
        advertiserId: 2,
        price: 0.40,
        country: 'Russia',
      },
      {
        advertiserId: 4,
        price: 0.40,
      },
      {
        advertiserId: 5,
        price: 0.40,
        country: '',
      },
      {
        advertiserId: 6,
        price: 0.4,
        country: 'Russia',
      },
    ];

    var indexingArray = winningSets.map((winningSet) =>
      createPairsFromArray(subArrayOfRandomWinners).reduce((acc,pair, i) =>{
        return  acc || (creativesEquality(winningSet, subArrayOfWinners.concat(pair)) ? i + 1 : false);
      }, false)
    );

    expect(indexingArray.reduce((acc, e) => acc && e))
      .toBeTruthy();
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeGreaterThan(numberOfTests * 2.66);
    expect(indexingArray.reduce((acc, e) => acc + e))
      .toBeLessThan(numberOfTests * 5.32);
  });
});
