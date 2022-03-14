export const toPersianNumbers = (number) => {
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return number.toString().replace(/[0-9]/g, (w) => {
    return id[+w];
  });
};

export const toEnglishNumbers = (number) => {
  let tmp = '';
  for (let i = 0; i < number.length; i++) {
    if ((number[i] == '۰' || number[i] == '0') && number[i - 1] != '/')
      tmp += 0;
    if (number[i] == '۱') tmp += 1;
    if (number[i] == '۲') tmp += 2;
    if (number[i] == '۳') tmp += 3;
    if (number[i] == '۴') tmp += 4;
    if (number[i] == '۵') tmp += 5;
    if (number[i] == '۶') tmp += 6;
    if (number[i] == '۷') tmp += 7;
    if (number[i] == '۸') tmp += 8;
    if (number[i] == '۹') tmp += 9;
    if (number[i] == '/') tmp += '/';
    if (number[i] == ':') tmp += ':';
    if (number[i] == '-') tmp += '-';
  }
  return tmp;
};
export const compareDates = (date1, date2) => {
  // If The First Date if Bigger Than The Other One Return True
  const arrOne = date1.split('/'),
    arrTwo = date2.split('/');
  if (+arrOne[0] > +arrTwo[0]) return true;
  else if (+arrOne[0] < +arrTwo[0]) return false;
  else if (+arrOne[1] > +arrTwo[1]) return true;
  else if (+arrOne[1] < +arrTwo[1]) return false;
  else if (+arrOne[2] > +arrTwo[2]) return true;
  else if (+arrOne[2] < +arrTwo[2]) return false;
};

export const strToMins = (t) => {
  const s = t.split(':');
  return Number(s[0]) * 60 + Number(s[1]);
};

export const minsToStr = (t) => {
  return Math.trunc(t / 60) + ':' + ('00' + (t % 60)).slice(-2);
};

export const parseTime = (s) => {
  const c = s.split(':');
  return parseInt(c[1]) * 60 + parseInt(c[2]);
};

export const secondsToTimeString = (seconds) => {
  let minutes = 0;
  if (seconds / 60 > 0) {
    minutes = parseInt(seconds / 60, 10);
    seconds = seconds % 60;
  }
  if (minutes / 60 > 0) {
    minutes = minutes % 60;
  }
  return ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
};
