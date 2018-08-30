const changeCase = require('change-case');
const { userExists, isEmpty, normalizeUsername } = require('../validation-utils');
const customOperations = require('./custom-operations');
const wehelpjs = require('wehelpjs');

const parse = async (query) => {
  const username = normalizeUsername(query.account);
  const accounts = await wehelpjs.api.getAccountsAsync([username]);
  const account = accounts.find(a => a.name === username);
  let json = {};

  if (account.json) {
    json = JSON.parse(account.json);
  }
  if (!json.profile) {
    json.profile = {};
  }

  const op = customOperations.find(o => o.type === 'accountUpdate');
  const keys = Object.keys(query);
  for (let i = 0; i < keys.length; i += 1) {
    if (!op.params.includes(keys[i])) {
      json.profile[changeCase.snakeCase(keys[i])] = query[keys[i]];
    }
  }

  const cQuery = {
    account: username,
    memoKey: account.memoKey,
    json: JSON.stringify(json),
  };

  return cQuery;
};

const validate = async (query, errors) => {
  if (!isEmpty(query.account) && !await userExists(query.account)) {
    errors.push({ field: 'account', error: 'error_user_exist', values: { user: query.account } });
  }
};

module.exports = {
  parse,
  validate,
};
