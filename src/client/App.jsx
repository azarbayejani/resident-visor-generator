import React, { useState, useEffect } from 'react';
import { fetch } from "whatwg-fetch";
import retry from 'async-retry';

import PreviewText from './PreviewText';
import PrintfulClient from '../shared/printfulclient.js';
import ResidentAdvisorUrlForm from './ResidentAdvisorUrlForm';
import WizardState from './WizardState';
import Visor from './Visor';
import VisorTextForm from './VisorTextForm'

/*
Basically, this acts as a wizard.

States:
0 - shows the RaUrlForm.
1 - shows the VisorTextForm
2 - still shows VisorTextForm, but with preview of type
3 - Shows the visor and a "start over link"
*/
const App = () => {
  const [step, setStep] = useState(WizardState.URL_NEEDED);
  const [waiting, setWaiting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [visorText, setVisorText] = useState((new URLSearchParams(location.search)).get('visorText') || '');
  const [residentAdvisorUrl, setResidentAdvisorUrl] =
        useState((new URLSearchParams(location.search)).get('raUrl') || '');
  
  useEffect(() => {
    if (visorText) {
      fetchVisor();
    } else if (residentAdvisorUrl) {
      fetchArticleText();
    }
  }, []);
  
  const fetchVisor = async () => {
    setWaiting(true);
    setStep(WizardState.VISOR_GENERATED);
    
    const request = await fetch(`/submit-visor-request?text=${encodeURI(visorText)}`);
    const requestJson = await request.json();
    const taskKey = requestJson.task_key;
    
    let imageUrl = await retry(async (bail) => {
      const getTaskResponse = await fetch(`/get-task?task_key=${taskKey}`);
      const taskJson = await getTaskResponse.json();
      
      if (taskJson.status === 'completed') {
        return taskJson.mockups[0].mockup_url; 
      } else {
        throw "No image yet";
      }
    });
  
    setWaiting(false);
    setImageUrl(imageUrl);
  }
  
  const fetchArticleText = async () => {
    setWaiting(true);
    setStep(WizardState.PREVIEW_TEXT);
    const request = await fetch(`/get-resident-visor-text?url=${residentAdvisorUrl}`);
    const requestJson = await request.json();
    
    let text;
    if (requestJson.rating) {
      text = `${requestJson.title}\n${requestJson.rating}`;
    } else {
      text = requestJson.title;
    }
    setVisorText(text);
    setWaiting(false);
  }
  
  const onVisorTextChange = (e) => {
    setVisorText(e.target.value);
  }
  
  const onUrlChange = (e) => {
    setResidentAdvisorUrl(e.target.value);
  }
  
  const onSkip = (e) => {
    setStep(WizardState.VISOR_TEXT_NEEDED);
  }
  
  const onAcceptPreview = () => {
    fetchVisor();
  }
  
  return (
      <div className="form-container">
        {
          {
            [WizardState.URL_NEEDED]: 
              <ResidentAdvisorUrlForm
                onSubmit={fetchArticleText}
                onChange={onUrlChange}
                waiting={waiting}
                url={residentAdvisorUrl}
                onSkip={onSkip}
              />,
            [WizardState.VISOR_TEXT_NEEDED]:
              <VisorTextForm
                onSubmit={() => setStep(WizardState.PREVIEW_TEXT)}
                onChange={onVisorTextChange}
                text={visorText}
                waiting={waiting}
              />,
            [WizardState.PREVIEW_TEXT]:
              <PreviewText
                onAcceptPreview={fetchVisor}
                onCancelPreview={() => setStep(WizardState.VISOR_TEXT_NEEDED)}
                visorText={visorText}
                waiting={waiting}
              />,
            [WizardState.VISOR_GENERATED]:
              <Visor
                imageUrl={imageUrl}
                onClickEditText={onSkip}
                onStartOver={() => setStep(WizardState.URL_NEEDED)}
                waiting={waiting}
              />
          }[step]
        }
      </div>
    );
}

export default App;