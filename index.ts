import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';
import { enableFreeze, enableScreens } from 'react-native-screens';

import App from './App';

enableScreens(false);
enableFreeze(false);

registerRootComponent(App);
