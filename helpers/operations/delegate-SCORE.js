const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const wehelpjs = require('wehelpjs');
const { formatter } = require('wehelpjs');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator'];

const parse = async (query) => {
  const cQuery = cloneDeep(query);
  const [amount, symbol] = cQuery.SCORE.split(' ');
  const globalProps = await wehelpjs.api.getDynamicGlobalPropertiesAsync();

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);

  if (symbol === 'ePOWER') {
    cQuery.SCORE = join([
      (
        (parseFloat(amount) *
        parseFloat(globalProps.totalSCORE)) /
        parseFloat(globalProps.totalTMEfundForSCORE)
      ).toFixed(6),
      'SCORE',
    ], ' ');
  } else {
    cQuery.SCORE = join([parseFloat(amount).toFixed(6), symbol], ' ');
  }

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push({ field: 'delegatee', error: 'error_user_exist', values: { user: query.delegatee } });
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push({ field: 'delegator', error: 'error_user_exist', values: { user: query.delegator } });
  }

  if (!isEmpty(query.SCORE)) {
    if (!['SCORE', 'ePOWER'].includes(query.SCORE.split(' ')[1])) {
      errors.push({ field: 'SCORE', error: 'error_SCORE_symbol' });
    } else if (!isAsset(query.SCORE)) {
      errors.push({ field: 'SCORE', error: 'error_SCORE_format' });
    }
  }
};

const normalize = async (query) => {
  const cQuery = cloneDeep(query);

  let sUsername = normalizeUsername(query.delegatee);
  let accounts = await wehelpjs.api.getAccountsAsync([sUsername]);
  let account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
  if (account) {
    cQuery.toName = account.name;
    cQuery.toReputation = wehelpjs.formatter.reputation(account.reputation);
  }

  if (query.delegator) {
    sUsername = normalizeUsername(query.delegator);
    accounts = await wehelpjs.api.getAccountsAsync([sUsername]);
    account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
    if (account) {
      cQuery.fromName = account.name;
      cQuery.fromReputation = wehelpjs.formatter.reputation(account.reputation);
    }
  }

  const [amount, symbol] = cQuery.SCORE.split(' ');
  if (amount && symbol === 'SCORE') {
    const globalProps = await wehelpjs.api.getDynamicGlobalPropertiesAsync();
    cQuery.amount = join(
      [
        formatter.SCOREinTMEvalue(
          cQuery.SCORE,
          globalProps.totalSCORE,
          globalProps.totalTMEfundForSCORE
        ).toFixed(3),
        'ePOWER',
      ], ' ');
  } else if (amount && symbol === 'ePOWER') {
    cQuery.amount = join(
      [parseFloat(amount).toFixed(3), symbol],
      ' ');
  }
  return cQuery;
};

module.exports = {
  normalize,
  optionalFields,
  parse,
  validate,
};
