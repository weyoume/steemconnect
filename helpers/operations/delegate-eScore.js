const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const ezhelp.js = require('ezhelp.js');
const { formatter } = require('ezhelp.js');
const { isAsset, isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator'];

const parse = async (query) => {
  const cQuery = cloneDeep(query);
  const [amount, symbol] = cQuery.ESCOR.split(' ');
  const globalProps = await ezhelp.js.api.getDynamicGlobalPropertiesAsync();

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);

  if (symbol === 'ePOWER') {
    cQuery.ESCOR = join([
      (
        (parseFloat(amount) *
        parseFloat(globalProps.totalESCOR)) /
        parseFloat(globalProps.totalECOfundForESCOR)
      ).toFixed(6),
      'ESCOR',
    ], ' ');
  } else {
    cQuery.ESCOR = join([parseFloat(amount).toFixed(6), symbol], ' ');
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

  if (!isEmpty(query.ESCOR)) {
    if (!['ESCOR', 'ePOWER'].includes(query.ESCOR.split(' ')[1])) {
      errors.push({ field: 'ESCOR', error: 'error_ESCOR_symbol' });
    } else if (!isAsset(query.ESCOR)) {
      errors.push({ field: 'ESCOR', error: 'error_ESCOR_format' });
    }
  }
};

const normalize = async (query) => {
  const cQuery = cloneDeep(query);

  let sUsername = normalizeUsername(query.delegatee);
  let accounts = await ezhelp.js.api.getAccountsAsync([sUsername]);
  let account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
  if (account) {
    cQuery.toName = account.name;
    cQuery.toReputation = ezira.formatter.reputation(account.reputation);
  }

  if (query.delegator) {
    sUsername = normalizeUsername(query.delegator);
    accounts = await ezhelp.js.api.getAccountsAsync([sUsername]);
    account = accounts && accounts.length > 0 && accounts.find(a => a.name === sUsername);
    if (account) {
      cQuery.fromName = account.name;
      cQuery.fromReputation = ezira.formatter.reputation(account.reputation);
    }
  }

  const [amount, symbol] = cQuery.ESCOR.split(' ');
  if (amount && symbol === 'ESCOR') {
    const globalProps = await ezhelp.js.api.getDynamicGlobalPropertiesAsync();
    cQuery.amount = join(
      [
        formatter.ESCORinECOvalue(
          cQuery.ESCOR,
          globalProps.totalESCOR,
          globalProps.totalECOfundForESCOR
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
