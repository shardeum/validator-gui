import { httpOrHttps } from './is-dev';

export function useGlobals() {
  return {
    apiBase: `${httpOrHttps()}://${globalThis.window?.location.host}`,
    versionUpdateRepositoryUrl: process.env.VERSION_UPDATE_REPOSTORY_URL || "https://github.com/shardeum/validator-dashboard",
    faucetClaimUrl: process.env.FAUCET_CLAIM_URL || "https://api.shardeum.org/api/transfer",
    validatorGuiDocsUrl: process.env.VALIDATOR_GUI_DOCS_URL || "https://docs.shardeum.org/node/run/validator",
    validatorGuiFaqsUrl: process.env.VALIDATOR_GUI_FAQS_URL || "https://docs.shardeum.org/faqs/general",
    accountInfoUrl: process.env.ACCOUNT_INFO_URL || "https://explorer-sphinx.shardeum.org/api/account",
  }
}
