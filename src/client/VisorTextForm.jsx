import PropTypes from 'prop-types';
import Spinner from 'react-spinkit';
import React from 'react';

const VisorTextForm = (props) => {  
  const {
    waiting,
    text,
    onChange,
    onSubmit
  } = props;

  const wrappedOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(text);
  }
    
  return (
      <form onSubmit={wrappedOnSubmit}>
        <label htmlFor="text">Enter Visor Text</label>
        <textarea required onChange={onChange} name="visorText" value={text}></textarea>
        <button type="submit" disabled={waiting}>
          {!waiting && 'Preview text'}
          {waiting && <span>Loading <Spinner name="circle" color="graytext" /></span> }
        </button>
      </form>
  );
}

VisorTextForm.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  text: PropTypes.string,
  waiting: PropTypes.bool,
};

export default VisorTextForm;