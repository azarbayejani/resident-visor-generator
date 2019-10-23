import Spinner from 'react-spinkit';
import React from 'react';
import PropTypes from 'prop-types';

const ResidentAdvisorUrlForm = (props) => {
  const {
    waiting,
    url,
    onChange,
    onSkip,
    onSubmit
  } = props;

  const wrappedOnSubmit = (e) => {
    e.preventDefault();
    onSubmit(url);
  }

  return (
      <form onSubmit={wrappedOnSubmit}>
        <label htmlFor="text">Enter a Resident Advisor URL</label>
        <input required onChange={onChange} name="residentAdvisorUrl" type="text" value={url} />
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <button type="submit" disabled={waiting}>
            {!waiting && 'Get title'}
            {waiting && <span>Loading <Spinner name="circle" color="graytext" /></span> }
          </button>

          {<div style={{marginTop: '3px'}}><a onClick={onSkip}>Skip ></a></div>}
        </div>
      </form>
  );
}

ResidentAdvisorUrlForm.propTypes = {
  onChange: PropTypes.func,
  onSkip: PropTypes.func,
  onSubmit: PropTypes.func,
  waiting: PropTypes.bool,
  url: PropTypes.string,
}

export default ResidentAdvisorUrlForm;