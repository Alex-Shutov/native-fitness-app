import React from 'react';

const useEffectOnce = (callback, when, workIf=true) => {
  const hasRunOnce = React.useRef(false);
  React.useEffect(() => {
    if (when && workIf && !hasRunOnce.current) {
      callback();
      hasRunOnce.current = true;
    }
  }, [when]);
};

export default useEffectOnce