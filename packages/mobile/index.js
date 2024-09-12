/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import '@src/localization/i18n.config';

AppRegistry.registerComponent(appName, () => App);
