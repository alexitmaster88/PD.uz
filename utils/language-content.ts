import { ReactNode, createElement, Fragment } from 'react';
import { useLanguage } from '../path-to-your-language-hook'; // Adjust as needed

type LanguageContent<T> = {
  [key: string]: T;
};

export function LanguageContentComponent({
  content,
}: {
  content: LanguageContent<ReactNode>;
}): ReactNode | null {
  const { language } = useLanguage();
  return createElement(Fragment, null, content[language]);
}