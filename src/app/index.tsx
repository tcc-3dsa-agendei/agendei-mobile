import { useRouter } from 'expo-router';
import Inicio from './inicio';

export default function Index() {
  const router = useRouter();

  return (
    <Inicio
      onAgendar={() => router.push('/agendar')} // O botao agendar n vai pra pagina de agendamentos, essa parte é o Login, isso é só pra facilitar a visualização da pagina
      onSaibaMais={() => router.push('/sobre')}
    />
  );
}
