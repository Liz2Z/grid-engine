import React from 'react';

export const useTrackerScrollHandler = () => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const scrollHandler = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { currentTarget } = e;
    setScrollTop(currentTarget.scrollTop);
  }, []);

  return [scrollTop, scrollHandler] as const;
};
