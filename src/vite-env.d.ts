/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_SITENAME: string
  readonly VITE_APP_SITEURL: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_RECAPTCHA_SITE_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}