/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** 遠端內容 API 的網址（結尾含 /）。未設定時使用同網域的 /content-api/。 */
  readonly VITE_CONTENT_BASE_URL?: string;
}
