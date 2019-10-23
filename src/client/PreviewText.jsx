import PropTypes from 'prop-types';
import React from 'react';
import Loading from './Loading';

const PreviewText = (props) => {
  const {
    waiting,
    visorText,
    onAcceptPreview,
    onCancelPreview,
  } = props;

  return (
    <div>
      { waiting && <div className="img-placeholder"><Loading /></div> }
      { !waiting && <div className="img-placeholder"><img src={`/generate-text-image?q=${encodeURIComponent(visorText)}`} /></div> }
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={onCancelPreview}>Edit text ✏️</button>
        <button onClick={onAcceptPreview}>Accept text spacing 👍</button>
      </div>
    </div>
  );
};

PreviewText.propTypes = {
  onAcceptPreview: PropTypes.func,
  onCancelPreview: PropTypes.func,
  visorText: PropTypes.string,
  waiting: PropTypes.bool,
};

export default PreviewText;