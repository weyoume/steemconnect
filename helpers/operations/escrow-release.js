const cloneDeep = require('lodash/cloneDeep');
const validator = require('validator');
const join = require('lodash/join');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.to = normalizeUsername(cQuery.to);
  cQuery.from = normalizeUsername(cQuery.from);
  cQuery.agent = normalizeUsername(cQuery.agent);
  cQuery.who = normalizeUsername(cQuery.who);
  cQuery.receiver = normalizeUsername(cQuery.receiver);
  cQuery.escrow_id = parseInt(cQuery.escrow_id, 0);

  let [amount, symbol] = cQuery.EUSDamount.split(' ');
  cQuery.EUSDamount = join([parseFloat(amount).toFixed(3), symbol], ' ');

  [amount, symbol] = cQuery.ECOamount.split(' ');
  cQuery.ECOamount = join([parseFloat(amount).toFixed(3), symbol], ' ');

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.to) && !await userExists(query.to)) {
    errors.push({ field: 'to', error: 'error_user_exist', values: { user: query.to } });
  }

  if (!isEmpty(query.from) && !await userExists(query.from)) {
    errors.push({ field: 'from', error: 'error_user_exist', values: { user: query.from } });
  }

  if (!isEmpty(query.agent) && !await userExists(query.agent)) {
    errors.push({ field: 'agent', error: 'error_user_exist', values: { user: query.agent } });
  }

  if (!isEmpty(query.who) && !await userExists(query.who)) {
    errors.push({ field: 'who', error: 'error_user_exist', values: { user: query.who } });
  }

  if (query.who !== query.from && query.who !== query.agent && query.who !== query.to) {
    errors.push({ field: 'who', error: 'error_user_equals', values: { field: 'who', users: [query.from, query.agent, query.to].join(', ') } });
  }

  if (!isEmpty(query.receiver) && !await userExists(query.receiver)) {
    errors.push({ field: 'receiver', error: 'error_user_exist', values: { user: query.receiver } });
  }

  if (query.receiver !== query.from && query.receiver !== query.to) {
    errors.push({ field: 'receiver', error: 'error_user_equals', values: { field: 'receiver', users: [query.from, query.to].join(', ') } });
  }

  if (!validator.isInt(query.escrow_id)) {
    errors.push({ field: 'escrow_id', error: 'error_integer_format' });
  }

  if (!isEmpty(query.EUSDamount) && query.EUSDamount.split(' ')[1] !== 'EUSD') {
    errors.push({ field: 'EUSDamount', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.EUSDamount) && !isAsset(query.EUSDamount)) {
    errors.push({ field: 'EUSDamount', error: 'error_amount_format' });
  }

  if (!isEmpty(query.ECOamount) && query.ECOamount.split(' ')[1] !== 'ECO') {
    errors.push({ field: 'ECOamount', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.ECOamount) && !isAsset(query.ECOamount)) {
    errors.push({ field: 'ECOamount', error: 'error_amount_format' });
  }
};

module.exports = {
  parse,
  validate,
};
