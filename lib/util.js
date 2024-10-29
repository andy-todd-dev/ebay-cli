import { eBayApi } from "ebay-api";

export const createEbayClient = async (config) => {
  const authConfig = config.get("auth");

  const ebayClient = new eBayApi({
    appId: authConfig.clientId,
    certId: authConfig.certificateId,
    sandbox: false,
    ruName: authConfig.redirectUrlName,
    signature: authConfig.signature,
  });
  // Set refresh token
  ebayClient.OAuth2.setCredentials(authConfig.oAuth2Credentials);
  // Get and set a user token
  const newTokenData = await ebayClient.OAuth2.refreshToken();
  ebayClient.OAuth2.setCredentials(newTokenData);
  config.set("auth", {
    ...authConfig,
    oAuth2Credentials: {
      refresh_token: newTokenData.refresh_token,
      refresh_token_expires_in: newTokenData.refresh_token_expires_in,
    },
  });
  return ebayClient;
};
