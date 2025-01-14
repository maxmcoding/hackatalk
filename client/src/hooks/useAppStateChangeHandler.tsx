import {AppState, AppStateStatus} from 'react-native';

import {useEffect} from 'react';

type AppStateChangeHandler = (state: AppStateStatus) => void;

/**
 * Custom hook for adding app state change event handler.
 * @param handler Callback function to handle app state change.
 */
export default function useAppStateChangeHandler(
  handler: AppStateChangeHandler,
): void {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handler);

    return (): void => {
      subscription.remove();
    };
  }, [handler]);
}
