import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
import en from '@/locales/en.json'
import pcm from '@/locales/pcm.json'
import yo from '@/locales/yo.json'
import ha from '@/locales/ha.json'
import ig from '@/locales/ig.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      pcm: { translation: pcm },
      yo: { translation: yo },
      ha: { translation: ha },
      ig: { translation: ig },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
