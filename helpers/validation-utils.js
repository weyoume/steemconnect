const wehelpjs = require('wehelpjs');
const moment = require('moment');

const isEmpty = value => value === undefined || value === null || value === '';

const allowedSymbols = [
  { symbol: 'TSD', precision: 3 },
  { symbol: 'TME', precision: 3 },
  { symbol: 'ePOWER', precision: 3 },
  { symbol: 'TME', precision: 3 },
  { symbol: 'SCORE', precision: 6 },
];

const isAsset = (value) => {
  if (!/^[0-9]+\.?[0-9]* [A-Za-z0-9]+$/.test(value)) {
    return false;
  }

  const [amount, symbol] = value.split(' ');
  const symbolInfo = allowedSymbols.find(s => s.symbol === symbol);

  if (!symbolInfo) {
    return false;
  }

  const dot = amount.indexOf('.');
  const p = dot === -1 ? 0 : amount.length - dot - 1;

  if (p > symbolInfo.precision) {
    return false;
  }

  return true;
};

const normalizeAsset = (value) => {
  const [amount, symbol] = value.split(' ');
  const symbolInfo = allowedSymbols.find(s => s.symbol === symbol);
  return `${parseFloat(amount).toFixed(symbolInfo.precision)} ${symbol}`;
};

const normalizeUsername = username => ((username && username.charAt(0) === '@') ? username.substr(1) : username);

const userExists = async (username) => {
  const nUsername = normalizeUsername(username);
  const accounts = await wehelpjs.api.getAccountsAsync([nUsername]);
  return accounts && accounts.length > 0 && accounts.find(a => a.name === nUsername);
};

const contentExists = async (auhtor, permlink) => {
  const content = await wehelpjs.api.getContentAsync(auhtor, permlink);
  return content && parseInt(content.id, 10) !== 0;
};

const isDate = date => moment(date).isValid();
const isPassedDate = date => moment().isAfter(date);
const isDateBeforeDate = (dateA, dateB) => moment(dateA).isBefore(dateB);

module.exports = {
  contentExists,
  isAsset,
  isEmpty,
  normalizeAsset,
  normalizeUsername,
  userExists,
  isDate,
  isPassedDate,
  isDateBeforeDate,
};
