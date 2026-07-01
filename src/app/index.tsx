import { Redirect } from 'expo-router';

/**
 * Root index — redirects to the (tabs) home screen.
 * The actual home UI lives in app/(tabs)/index.tsx.
 */
export default function RootIndex() {
  return <Redirect href="/(tabs)" />;
}
