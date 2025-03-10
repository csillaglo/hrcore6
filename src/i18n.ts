import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
            welcome: 'Welcome to the HR Management App',
            loggedInMessage: 'You are logged in as {{email}}',
            pleaseLogin: 'Please log in to continue.',
            login: 'Login',
            email: 'Email',
            password: 'Password',
            loggingIn: 'Logging in...',
            home: "Home",
            profile: "Profile",
            signOut: "Sign Out",
            notLoggedIn: "You are not logged in.",
            pageNotFound: "Page Not Found",
            pageNotFoundDesc: "The page you are looking for does not exist.",
            dashboard: "Dashboard",
            employeeList: "Employee List",
            firstName: "First Name",
            lastName: "Last Name",
            role: "Role",
            loading: "Loading...",
            noEmployeesFound: "No employees found."
        }
      },
      hu: {
        translation: {
            welcome: 'Üdvözöljük a HR Management Alkalmazásban',
            loggedInMessage: 'Bejelentkezve mint {{email}}',
            pleaseLogin: 'Kérjük, jelentkezzen be a folytatáshoz.',
            login: 'Bejelentkezés',
            email: 'Email',
            password: 'Jelszó',
            loggingIn: 'Bejelentkezés...',
            home: "Főoldal",
            profile: "Profil",
            signOut: "Kijelentkezés",
            notLoggedIn: "Nincs bejelentkezve.",
            pageNotFound: "Az oldal nem található",
            pageNotFoundDesc: "A keresett oldal nem létezik.",
            dashboard: "Irányítópult",
            employeeList: "Dolgozók Listája",
            firstName: "Keresztnév",
            lastName: "Vezetéknév",
            role: "Szerepkör",
            loading: "Betöltés...",
            noEmployeesFound: "Nincsenek dolgozók."
        }
      }
    }
  });

export default i18n;
