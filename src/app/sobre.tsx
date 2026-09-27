import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Sobre() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.voltarButton, { top: insets.top + 12 }]}
        onPress={handleBack}
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </Pressable>

      <Text style={styles.title}>Sobre o Agendei.com</Text>
      <Text style={styles.text}>Aqui vai o conteúdo explicando a plataforma.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  voltarButton: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#153F35',
  },
  voltarButtonText: {
    color: '#153F35',
    fontWeight: '600',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F4F5F3',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#153F35',
    marginBottom: 12,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});
