import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as never, params as never);
  }
}

export function resetToLogin() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' as never }],
    });
  } else {
    const timer = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(timer);
        navigationRef.reset({
          index: 0,
          routes: [{ name: 'LoginScreen' as never }],
        });
      }
    }, 100);
    setTimeout(() => clearInterval(timer), 3000);
  }
}

