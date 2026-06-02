/// <reference types="vite/client" />

declare module "@fontsource-variable/*";

interface ImportMetaEnv {
  readonly VITE_APP_URL?: string;
  readonly VITE_CHROME_EXTENSION_ID?: string;
  readonly VITE_DEFAULT_BILLING_CYCLE?: string;
  readonly VITE_POLAR_DISCOUNT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
