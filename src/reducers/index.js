import * as actions from '../actions';

const initialState = {
  currentView: 'recordVideo'
};

export default function appReducer(state=initialState, action) {
  switch(action.type) {
    case actions.NAV_BUTTON_CLICK:
      return Object.assign({}, state, {
        currentView: action.viewToShow
      });

    default:
      console.log("action type not registered");
  }

  return state;
}