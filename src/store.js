import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import wehelpjs from 'wehelpjs';
import auth from './reducers/auth';
import appLocale from './reducers/appLocale';

if(window && wehelpjs){
	window.wehelpjs = wehelpjs
}

const reducers = combineReducers({
  auth,
  appLocale,
});

if (process.env.NODE_API_URL) {
  wehelpjs.api.setOptions({ url: process.env.NODE_API_URL });
}

const store = createStore(
  reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunk),
);

export default store;
