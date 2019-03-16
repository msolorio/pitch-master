import React from 'react';
import {connect} from 'react-redux';
import {navButtonClick} from '../../actions';

function NavigationButton(props) {
  const handleButtonClick = () => {
    props.dispatch(navButtonClick(props.viewToShow));
  }

  return (
    <button onClick={handleButtonClick}>
      {props.content}
    </button>
  );
}

export default connect()(NavigationButton);