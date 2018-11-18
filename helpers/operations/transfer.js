const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const wehelpjs = require('wehelpjs');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['memo'];

const parse = (query) => {
  const cQuery = cloneDeep(query);
  const [amount, symbol] = cQuery.amount.split(' ');

  cQuery.to = normalizeUsername(cQuery.to);
  cQuery.amount = join([parseFloat(amount).toFixed(3), symbol], ' ');
  cQuery.memo = cQuery.memo || '';

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.to) && !await userExists(query.to)) {
    errors.push({ field: 'to', error: 'error_user_exist', values: { user: query.to } });
  }

  if (!isEmpty(query.from) && !await userExists(query.from)) {
    errors.push({ field: 'from', error: 'error_user_exist', values: { user: query.from } });
  }

  if (!isEmpty(query.amount) && !['TME', 'TSD'].includes(query.amount.split(' ')[1])) {
    errors.push({ field: 'amount', error: 'error_amount_symbol' });
  } else if (!isEmpty(query.amount) && !isAsset(query.amount)) {
    errors.push({ field: 'amount', error: 'error_amount_format' });
  }

  if (errors.length === 0) {
    const [amount, symbol] = query.amount.split(' ');
    // eslint-disable-next-line no-param-reassign
    query.amount = join([parseFloat(amount).toFixed(3), symbol], ' ');
  }
};

const normalize = async (query) => {
  const cQuery = cloneDeep(query);
  let sUsername = normalizeUsername(query.to);
  let accounts = await wehelpjs.api.getAccountsAsync([sUsername]);
  let account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
  if (account) {
    cQuery.toName = account.name;
    cQuery.toReputation = wehelpjs.formatter.reputation(account.reputation);
  }

  if (query.from) {
    sUsername = normalizeUsername(query.from);
    accounts = await wehelpjs.api.getAccountsAsync([sUsername]);
    account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
    if (account) {
      cQuery.fromName = account.name;
      cQuery.toReputation = wehelpjs.formatter.reputation(account.reputation);
    }
  }

  return cQuery;
};

module.exports = {
  normalize,
  optionalFields,
  parse,
  validate,
};
