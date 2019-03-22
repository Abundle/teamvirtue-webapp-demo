import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import registerServiceWorker from './registerServiceWorker';

// Local import
import { AppContainer } from './containers/AppContainer';
import reducers from './reducers'

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

ReactDOM.render(
	<Provider store={ store }>
		<MuiPickersUtilsProvider utils={ MomentUtils }>
			<AppContainer />
		</MuiPickersUtilsProvider>
	</Provider>,
	document.getElementById('root')
);

registerServiceWorker();
