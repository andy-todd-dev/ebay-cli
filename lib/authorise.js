import readline from "readline-async";
import terminalLink from "terminal-link";
import querystring from "node:querystring";
import eBayApi from "ebay-api";

export const handleAuthorise = async ({
  clientId,
  certificateId,
  redirectUrlName,
  config,
}) => {
  const ebayClient = new eBayApi({
    appId: clientId,
    certId: certificateId,
    sandbox: false,
    ruName: redirectUrlName,
  });
  ebayClient.OAuth2.setScope([
    "https://api.ebay.com/oauth/api_scope",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
  ]);

  const authURL = ebayClient.OAuth2.generateAuthUrl();

  const linkText = terminalLink.isSupported
    ? terminalLink("link", authURL)
    : authURL;

  console.log(`Follow this ${linkText} and login with your eBay credentials`);
  console.log("Now paste the url your browser was redirected to here: ");
  const rawUrl = await readline();
  const code = querystring.parse(
    rawUrl.substring(rawUrl.indexOf("?") + 1)
  ).code;
  const tokenData = await ebayClient.OAuth2.getToken(code);
  ebayClient.OAuth2.setCredentials(tokenData);

  const keyData = await ebayClient.developer.keyManagement.createSigningKey();
  config.set("auth", {
    clientId,
    certificateId,
    redirectUrlName,
    signature: {
      jwe: keyData.jwe,
      privateKey: keyData.privateKey,
    },
    oAuth2Credentials: {
      refresh_token: tokenData.refresh_token,
      refresh_token_expires_in: tokenData.refresh_token_expires_in,
    },
  });
};
