
const isAllASCII = (str) => {
  if (!str) {
    return true;
  }
  if(str.match(/^[\x20-\x7e]*$/)){
    return true;
  }
  return false;
};

const isNumber = (number) => {
  return !isNaN(number);
};

export dafault {
  isAllASCII,
  isNumber,
}

