import { combineReducers } from 'redux';
import piano from './pianoReducer';

const rootReducer = combineReducers({
    piano
});

export default rootReducer