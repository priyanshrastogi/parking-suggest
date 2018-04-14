import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';
import reducers from './reducers';
import Home from './components/home';
import AuthSuccess from './components/authsuccess';
import SignOut from './components/signout';
import { SIGNIN_USER } from './actions';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);

const token = localStorage.getItem('token');

if(token) {
    store.dispatch({ type: SIGNIN_USER });
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/authsuccess" component={AuthSuccess} />
                    <Route exact path="/signout" component={SignOut}/>
                </Switch>
            </div>
        </BrowserRouter>
    </Provider>
    , document.getElementById('root'));
registerServiceWorker();
