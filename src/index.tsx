import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import PianoApp from './Components/PianoApp';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

const store = configureStore([]);

ReactDOM.render(<Provider store={store}><PianoApp /></Provider>, document.getElementById('root'));