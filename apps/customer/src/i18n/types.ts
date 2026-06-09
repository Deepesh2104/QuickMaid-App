export type AppLocale = 'en' | 'hi';

export interface TranslationTree {
  [key: string]: string | TranslationTree;
}
