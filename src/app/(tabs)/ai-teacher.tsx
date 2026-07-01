import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/tw';

export default function AITeacherTab() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.emoji}>🤖</Text>
        <Text style={styles.title}>AI Teacher</Text>
        <Text style={styles.subtitle}>Your AI video lessons will appear here</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emoji: { fontSize: 48, marginBottom: 8 },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 24,
    color: '#0D132B',
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});
