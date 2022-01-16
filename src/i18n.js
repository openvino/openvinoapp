import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        Login: "Login",
        Register: "Register",
        "You Drink it, You Own it!": "You Drink it, You Own it!",
        Email: "Email",
        Password: "Password",
        "Forgot Password?": "Forgot Password?",
        "This field is required!": "This field is required!",
        "Register to continue!": "Register to continue!",
        "Fist Name": "Fist Name",
        "Last Name": "Last Name",
        "Mailing Address": "Mailing Address",
        Birthdate: "Birthdate",
        "Telgram ID": "Telegram ID",
        "DNI/Password": "DNI/Passport",
        Nationality: "Nationality",
        "Select a country": "Select a country",
        Email: "Email",
        Password: "Password",
        "Scan your qr code": "Scan your qr code",
        "First, you have to scan the QR Code that is in the reverse of your wine bottle.":
          "First, you have to scan the QR Code that is in the reverse of your wine bottle.",
        Tastings: "Tastings",
        "New Tasting": "New Tasting",
        Date: "Date",
        Token: "Token",
        "Token ID": "Token ID",
        Actions: "Actions",
        "Mint NFT": "Mint NFT",
        "NFT Minted Succesfully!": "NFT Minted Succesfully!",
        Profile: "Profile",
        "Edit Profile": "Edit Profile",
        Update: "Update",
        "Back to Profile": "Back to Profile",
      },
    },
    es: {
      translations: {
        Login: "Iniciar Sesion",
        Register: "Registro",
        "You Drink it, You Own it!": "You Drink it, You Own it!",
        Email: "Correo Electrónico",
        Password: "Contraseña",
        "Forgot Password?": "Perdiste tu contraseña?",
        "This field is required!": "Este campo es requerido",
        "Register to continue!": "Registrate para continuar!",
        "Fist Name": "Nombre",
        "Last Name": "Apellido",
        "Mailing Address": "Domicilio donde reside",
        Birthdate: "Cumpleaños",
        "Telgram ID": "ID de Telegram",
        "DNI/Password": "DNI/Pasaporte",
        Nationality: "Nacionalidad",
        "Select a country": "Seleccionar País",
        Email: "Correo Electrónico",
        Password: "Contraseña",
      },
    },
  },
  fallbackLng: "en",
  debug: true,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ",",
  },

  react: {
    wait: true,
  },
});

export default i18n;
