import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{t('pageNotFound')}</h1>
      <p>{t('pageNotFoundDesc')}</p>
    </div>
  );
}

export default NotFound;
