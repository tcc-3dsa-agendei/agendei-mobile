import { useRouter } from 'expo-router';
import Inicio from './inicio';

export default function Index() {
  const router = useRouter();

  return (
    <Inicio
      onAgendar={() => router.push('/login')}
      onSaibaMais={() => router.push('/sobre')}
    />
  );
}
