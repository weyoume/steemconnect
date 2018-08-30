const cloneDeep = require('lodash/cloneDeep');
const join = require('lodash/join');
const wehelpjs = require('wehelpjs');
const { isEmpty, userExists, normalizeUsername } = require('../validation-utils');

const optionalFields = ['delegator', 'ESCOR'];

const parse = async (query) => {
  const cQuery = cloneDeep(query);

  cQuery.delegatee = normalizeUsername(cQuery.delegatee);
  cQuery.delegator = normalizeUsername(cQuery.delegator);
  cQuery.ESCOR = join([parseFloat(0).toFixed(6), 'ESCOR'], ' ');

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.delegatee) && !await userExists(query.delegatee)) {
    errors.push({ field: 'delegatee', error: 'error_user_exist', values: { user: query.delegatee } });
  }
  if (!isEmpty(query.delegator) && !await userExists(query.delegator)) {
    errors.push({ field: 'delegator', error: 'error_user_exist', values: { user: query.delegator } });
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

  return cQuery;
};

module.exports = {
  normalize,
  optionalFields,
  parse,
  validate,
};
