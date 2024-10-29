import readline from "readline-async";
import terminalLink from "terminal-link";
import querystring from "node:querystring";
import eBayApi from "ebay-api";

export const handleInit = async ({
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
    "https://api.ebay.com/oauth/api_scope/sell.marketing.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.marketing",
    "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.inventory",
    "https://api.ebay.com/oauth/api_scope/sell.account.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.account",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.fulfillment",
    "https://api.ebay.com/oauth/api_scope/sell.analytics.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.finances",
    "https://api.ebay.com/oauth/api_scope/sell.payment.dispute",
    "https://api.ebay.com/oauth/api_scope/commerce.identity.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.reputation",
    "https://api.ebay.com/oauth/api_scope/sell.reputation.readonly",
    "https://api.ebay.com/oauth/api_scope/commerce.notification.subscription",
    "https://api.ebay.com/oauth/api_scope/commerce.notification.subscription.readonly",
    "https://api.ebay.com/oauth/api_scope/sell.stores",
    "https://api.ebay.com/oauth/api_scope/sell.stores.readonly",
  ]);

  const authURL = ebayClient.OAuth2.generateAuthUrl();

  console.log(
    `Follow this ${terminalLink(
      "link",
      authURL
    )} and login with your eBay credentials`
  );
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
