// O sobre não ta pronto, é só a base dele
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Sobre() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o Agendei.com</Text>
      <Text style={styles.text}>Aqui vai o conteúdo explicando a plataforma.</Text>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#153F35',
  },
  backButtonText: {
    color: '#153F35',
    fontWeight: '600',
  },
});
