import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import WizardState from './WizardState';

const Visor = (props) => {
  const {
    imageUrl,
    onClickEditText,
    onStartOver,
    waiting,
  } = props;

  return (
    <div>
      { waiting && <div className="img-placeholder"><Loading /></div> }
      { !waiting && <div className="img-placeholder"><img src={imageUrl} /></div> }
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={onStartOver}>Start over 🔁</button>
        <button onClick={onClickEditText}>Edit text ✏️</button>
      </div>
    </div>
  );
};

Visor.propTypes = {
  imageUrl: PropTypes.string,
  onSkip: PropTypes.func,
  onStartOver: PropTypes.func,
  waiting: PropTypes.bool,
};

export default Visor;