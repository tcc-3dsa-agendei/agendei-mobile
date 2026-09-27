
import {View,Text,Pressable,StyleSheet,Image,TextInput,} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AgendarProps {
  onService?: () => void;
}

const logo = require('../../assets/images/logo.png');
const cornerShape = require('../../assets/images/form.png');
const background = require('../../assets/images/fundo.jpg');

const CORNER_STRIP_ASPECT = 578 / 250;
const CORNER_WIDTH = 110;
const CORNER_HEIGHT = CORNER_WIDTH / CORNER_STRIP_ASPECT;

export default function Agendar({ onService }: AgendarProps) {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <Image
        source={cornerShape}
        style={[styles.cornerTopRight, styles.flipHorizontal]}
        resizeMode="stretch"
      />

      <Image
        source={cornerShape}
        style={[styles.cornerBottomLeft, styles.flipHorizontal, styles.rotate180]}
        resizeMode="stretch"
      />

      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color="#153F35" />
      </Pressable>

      <View style={styles.backgroundArt}>
        <Image
          source={background}
          style={styles.backgroundImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={[
            '#F4F5F3',
            'rgba(244,245,243,0.9)',
            'rgba(244,245,243,0.35)',
            'rgba(244,245,243,0.05)',
          ]}
          locations={[0, 0.2, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View style={styles.container}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          <Text style={styles.brand}>Agendei</Text>
          <Text style={styles.brandLight}>.com!</Text>
        </Text>

        <Text style={styles.subtitle}>
          <Text style={styles.brand}>Agende seu horário</Text>
        </Text>

        <Text style={styles.description}>
          Cole o link da agenda da empresa que você recebeu e continue
        </Text>

        <View style={styles.actions}>
          <TextInput
            style={styles.linkInput}
            placeholder="Cole o link da agenda aqui"
            placeholderTextColor="#9CA3AF"
          />

          <Pressable
            style={styles.primaryButton}
            onPress={onService}
          >
            <Text style={styles.primaryButtonText}>
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F5F3',
  },

  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: CORNER_WIDTH,
    height: CORNER_HEIGHT,
    zIndex: 3,
  },

  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: CORNER_WIDTH,
    height: CORNER_HEIGHT,
    zIndex: 3,
  },

  flipHorizontal: {
    transform: [{ scaleX: -1 }],
  },

  backButton: {
    position: 'absolute',
    top: 45,
    left: 24,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },

  backgroundArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    zIndex: 1,
    overflow: 'hidden',
  },

  backgroundImage: {
    width: '100%',
    height: '100%',
  },

  container: {
    flex: 1,
    zIndex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 14,
    alignSelf: 'center',
  },

  title: {
    width: '100%',
    marginBottom: 32,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 30,
    color: '#153F35',
    textAlign: 'center',
  },

  subtitle: {
    marginBottom: 12,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 30,
    color: '#153F35',
    textAlign: 'left',
  },

  brand: {
    fontWeight: '700',
  },

  brandLight: {
    fontWeight: '600',
  },

  description: {
    marginBottom: 24,
    maxWidth: 300,
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    textAlign: 'left',
  },

  actions: {
    width: '100%',
    gap: 12,
  },

  linkInput: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    color: '#374151',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#153F35',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  rotate180: {
  transform: [{ rotate: '180deg' }],
},
});
