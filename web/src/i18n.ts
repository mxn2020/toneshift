// i18n configuration for ToneShift
const translations = {
    en: { appName: 'ToneShift', description: 'Rewrite messages into 12 different tones' },
    de: { appName: 'ToneShift', description: 'Rewrite messages into 12 different tones (DE)' },
} as const

export type Locale = keyof typeof translations
export const defaultLocale: Locale = 'en'
export const supportedLocales = Object.keys(translations) as Locale[]

export function t(key: keyof typeof translations.en, locale: Locale = defaultLocale): string {
    return translations[locale]?.[key] ?? translations.en[key] ?? key
}

export default translations
