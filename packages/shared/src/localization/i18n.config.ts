import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {en, al} from './translations';

export const supportedLanguages = [
  {code: 'en_US', label: 'English', translation: en},
  {code: 'sq_AL', label: 'Albanian', translation: al}
];

export const resources = supportedLanguages.reduce(
  (acc, lang) => {
    acc[lang.code] = {translation: lang.translation};

    return acc;
  },
  {} as {[key: string]: {translation: {[key: string]: string}}}
);

i18next.use(initReactI18next).init({
  debug: false,
  lng: 'en_US',
  compatibilityJSON: 'v3',
  fallbackLng: 'en_US',
  resources
});

export default i18next;
