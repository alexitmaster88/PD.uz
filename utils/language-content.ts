import { ReactNode, createElement, Fragment } from 'react';
import { useLanguage } from '../translations';
import { EnvironmentUtils } from 'aws-cdk-lib/cx-api';
import translations from '../translations';

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