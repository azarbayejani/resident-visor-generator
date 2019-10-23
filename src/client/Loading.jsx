import React, { useState, useRef } from 'react';

const Loading = () => {
  const [count, setCount] = useState(0);
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []); // Pass in empty array to run effect only once!

  
  return (<h1>{`Loading${'.'.repeat(count%4)}`}</h1>);
}

export default Loading;