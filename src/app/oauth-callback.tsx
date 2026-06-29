import * as WebBrowser from "expo-web-browser";

// Must be called at top level to complete the OAuth redirect
WebBrowser.maybeCompleteAuthSession();

/**
 * OAuth Callback Screen
 * Handles the redirect from OAuth providers (Google, Apple, Facebook).
 * This screen renders nothing — it only exists to complete the auth session.
 */
export default function OAuthCallback() {
  return null;
}
