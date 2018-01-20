'use strict';

const isAllASCII = (str) => {
  if (!str) {
    return true;
  }
  if(('' + str).match(/^[\x20-\x7e]*$/)){
    return true;
  }
  return false;
};

const isNumber = (number) => {
  return number === 0 || (!!number && !isNaN(number));
};

const RANDOM_STRING_CANDIDATE = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ramdomString = (length) => {

  const candidateLen = RANDOM_STRING_CANDIDATE.length;
  var result = '',
      i = 0,
      position;
  for(; i < length; i++){
    position = Math.floor(Math.random() * candidateLen);
    result += RANDOM_STRING_CANDIDATE[position];
  }
  return result;
};

module.exports = {
  isAllASCII: isAllASCII,
  isNumber: isNumber,
  ramdomString: ramdomString,
}

