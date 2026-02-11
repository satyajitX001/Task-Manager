import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
  createTransform,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { rootReducer } from './rootReducer';

const migrations = {
  1: (state: any) => {
    if (!state || typeof state !== 'object') {
      return state;
    }

    const rootState = state as Record<string, unknown>;
    const authState = rootState.auth;

    if (!authState || typeof authState !== 'object') {
      return {
        ...rootState,
        auth: {
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          errorMessage: null,
        },
      };
    }

    const currentAuth = authState as Record<string, unknown>;

    return {
      ...rootState,
      auth: {
        ...currentAuth,
        isAuthenticated: currentAuth.isAuthenticated === true,
        isLoading: currentAuth.isLoading === true,
        errorMessage:
          typeof currentAuth.errorMessage === 'string' || currentAuth.errorMessage === null
            ? currentAuth.errorMessage
            : null,
      },
    };
  },
} as const;

const authStateTransform = createTransform(
  (inboundState: any) => {
    if (!inboundState || typeof inboundState !== 'object') {
      return {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        errorMessage: null,
      };
    }

    return {
      ...inboundState,
      isAuthenticated: inboundState.isAuthenticated === true,
      isLoading: inboundState.isLoading === true,
      errorMessage:
        typeof inboundState.errorMessage === 'string' || inboundState.errorMessage === null
          ? inboundState.errorMessage
          : null,
    };
  },
  (outboundState: any) => {
    if (!outboundState || typeof outboundState !== 'object') {
      return {
        currentUser: null,
        isAuthenticated: false,
        isLoading: false,
        errorMessage: null,
      };
    }

    return {
      ...outboundState,
      isAuthenticated: outboundState.isAuthenticated === true,
      isLoading: outboundState.isLoading === true,
      errorMessage:
        typeof outboundState.errorMessage === 'string' || outboundState.errorMessage === null
          ? outboundState.errorMessage
          : null,
    };
  },
  { whitelist: ['auth'] },
);

const persistConfig = {
  key: 'task-manager-root-v2',
  storage: AsyncStorage,
  version: 1,
  migrate: createMigrate(migrations as any, { debug: false }),
  transforms: [authStateTransform],
  whitelist: ['auth', 'tasks'],
};

const persistedReducer = persistReducer(
  persistConfig as any,
  rootReducer as any,
) as unknown as typeof rootReducer;

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
