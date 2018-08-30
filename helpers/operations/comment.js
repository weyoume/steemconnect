const cloneDeep = require('lodash/cloneDeep');
const { formatter } = require('wehelpjs');
const changeCase = require('change-case');
const diacritics = require('diacritics');

const optionalFields = ['parent_author', 'parent_permlink', 'title', 'json'];

const parse = (query) => {
  const cQuery = cloneDeep(query);
  cQuery.parent_author = cQuery.parent_author || '';
  cQuery.parent_permlink = cQuery.parent_permlink || '';
  cQuery.title = cQuery.title || '';
  if (cQuery.parent_author && cQuery.parent_permlink) {
    cQuery.permlink = cQuery.permlink
      || formatter.commentPermlink(cQuery.parent_author, cQuery.parent_permlink).toLowerCase();
  } else {
    cQuery.title = cQuery.title || cQuery.body.slice(0, 255);
    cQuery.permlink = cQuery.permlink
      || changeCase.paramCase(diacritics.remove(cQuery.title)).slice(0, 255);
  }
  let json = {};
  try {
    json = JSON.parse(decodeURIComponent(cQuery.json));
  } catch (e) {
    json = {};
  }
  cQuery.json = json;
  return cQuery;
};

module.exports = {
  optionalFields,
  parse,
};
