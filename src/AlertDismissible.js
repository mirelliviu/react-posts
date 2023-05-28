import React, { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function simulateNetworkRequest() {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const LoadingButton = () => {
  const [isLoading, setLoading] = useState(false);
  const [variant, setVariant] = useState('outline-primary');
  // const [loaded, setLoaded] = useState(false);
  const [buttonText, setButtonText] = useState('Click to load');

  useEffect(() => {
    if (isLoading) {
      setVariant('outline-danger');
      setButtonText('Loading...')
      simulateNetworkRequest().then(() => {
        setLoading(false);
        setVariant('outline-success')
        setTimeout(() => {
          setVariant('outline-primary')
        },2000)
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  return (
    <Button
      variant={variant}
      disabled={isLoading}
      onClick={!isLoading ? handleClick : null}
    >
      {buttonText}
    </Button>
  );
}

export default LoadingButton