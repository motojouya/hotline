'use strict';

const colorNumberBase = 7,
      colorNumberRange = 8;

const calcColorElement = (number) => {
  switch (number) {
  case 7:
    return 'e';
  case 6:
    return 'd';
  case 5:
    return 'c';
  case 4:
    return 'b';
  case 3:
    return 'a';
  default :
    return number + colorNumberBase;
  }
};

module.exports = (colorNumber) => {

  if (!colorNumber || isNaN(colorNumber) || colorNumber.length > 2 || colorNumber.length < 1 || colorNumber < 0 || colorNumber > 23) {
    return '77e';
  }

  var colorInt = parseInt(colorNumber),
      area = Math.floor(colorInt / colorNumberRange),
      value = colorInt % colorNumberRange;

  switch (area) {
  case 0:
    return colorNumberBase + '' + calcColorElement(value) + '' + calcColorElement(colorNumberRange - (1 + value));
  case 1:
    return calcColorElement(value) + '' + calcColorElement(colorNumberRange - (1 + value)) + '' + colorNumberBase;
  case 2:
    return calcColorElement(colorNumberRange - (1 + value)) + '' + colorNumberBase + '' + calcColorElement(value);
  default:
    return '77e';
  }
};

