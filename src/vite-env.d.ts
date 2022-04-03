/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BLOCKCHAIN_RPC_SERVER_URL: string;
  readonly VITE_BLOCKCHAIN_CONTRACT_ADDRESS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
