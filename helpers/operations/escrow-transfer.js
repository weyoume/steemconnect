const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const validator = require('validator');
const { isAsset, isDate, isPassedDate, isDateBeforeDate, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.to = normalizeUsername(cQuery.to);
  cQuery.from = normalizeUsername(cQuery.from);
  cQuery.agent = normalizeUsername(cQuery.agent);
  cQuery.escrow_id = parseInt(cQuery.escrow_id, 0);

  let [amount, symbol] = cQuery.TSDamount.split(' ');
  cQuery.TSDamount = join([parseFloat(amount).toFixed(3), symbol], ' ');

  [amount, symbol] = cQuery.TMEamount.split(' ');
  cQuery.TMEamount = join([parseFloat(amount).toFixed(3), symbol], ' ');

  [amount, symbol] = cQuery.fee.split(' ');
  cQuery.fee = join([parseFloat(amount).toFixed(3), symbol], ' ');

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

  if (!isEmpty(query.TSDamount) && query.TSDamount.split(' ')[1] !== 'TSD') {
    errors.push({ field: 'TSDamount', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.TSDamount) && !isAsset(query.TSDamount)) {
    errors.push({ field: 'TSDamount', error: 'error_amount_format' });
  }

  if (!isEmpty(query.TMEamount) && query.TMEamount.split(' ')[1] !== 'TME') {
    errors.push({ field: 'TMEamount', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.TMEamount) && !isAsset(query.TMEamount)) {
    errors.push({ field: 'TMEamount', error: 'error_amount_format' });
  }

  if (!isEmpty(query.fee) && !['TME', 'TSD'].includes(query.fee.split(' ')[1])) {
    errors.push({ field: 'fee', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.fee) && !isAsset(query.fee)) {
    errors.push({ field: 'fee', error: 'error_amount_format' });
  }

  if (!validator.isInt(query.escrow_id)) {
    errors.push({ field: 'escrow_id', error: 'error_integer_format' });
  }

  if (!isDate(query.ratification_deadline)) {
    errors.push({ field: 'ratification_deadline', error: 'error_date_format' });
  } else if (isPassedDate(query.ratification_deadline)) {
    errors.push({ field: 'ratification_deadline', error: 'error_date_passed' });
  }

  if (!isDate(query.escrow_expiration)) {
    errors.push({ field: 'escrow_expiration', error: 'error_date_format' });
  } else if (isPassedDate(query.escrow_expiration)) {
    errors.push({ field: 'escrow_expiration', error: 'error_date_passed' });
  }

  if (isDateBeforeDate(query.escrow_expiration, query.ratification_deadline)) {
    errors.push({ field: 'escrow_expiration', error: 'error_date_before_date', values: { dateA: 'ratification_deadline', dateB: 'escrow_expiration' } });
  }

  try {
    JSON.parse(query.json);
  } catch (err) {
    errors.push({ field: 'json', error: 'error_json_valid', values: { field: 'json' } });
  }
};

module.exports = {
  parse,
  validate,
};
