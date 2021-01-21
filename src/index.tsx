import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';

import Todos from 'containers/Todos';

// Import main styles for this application
import 'antd/dist/antd.css';
import './scss/main.scss';


const render = () => {
  ReactDOM.render(
    <Provider store={store}>      
        <Todos />
    </Provider>,
    document.getElementById('root')
  );
};

render();
