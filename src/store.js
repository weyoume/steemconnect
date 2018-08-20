import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ezira from 'ezhelp.js';
import auth from './reducers/auth';
import appLocale from './reducers/appLocale';

const reducers = combineReducers({
  auth,
  appLocale,
});

if (process.env.EZNODE_URL) {
  ezhelp.js.api.setOptions({ url: process.env.EZNODE_URL });
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

export default store;
