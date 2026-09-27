import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logo = require('../../assets/images/logo.png');
const cornerShape = require('../../assets/images/form.png');
const background = require('../../assets/images/fundo.jpg');

const CORNER_STRIP_ASPECT = 578 / 250;
const CORNER_WIDTH = 110;
const CORNER_HEIGHT = CORNER_WIDTH / CORNER_STRIP_ASPECT;

function FormField({
  label,
  hint,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: {
  label: string;
  hint?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.labelLine} />
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}

export default function Cadastro() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  }
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleClear() {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  }

  function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }

    register(name, email, password);
    router.replace('/login');
  }

  return (
    <View style={styles.screen}>
      <Image
        source={cornerShape}
        style={[styles.cornerTopRight, styles.flipX]}
        resizeMode="stretch"
      />
      <Image
        source={cornerShape}
        style={[styles.cornerBottomLeft, styles.flipY]}
        resizeMode="stretch"
      />

      <View style={styles.backgroundArt}>
        <Image source={background} style={styles.backgroundImage} resizeMode="cover" />
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

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.brand}>Agendei.com</Text>

          <View style={styles.card}>
            <FormField
              label="Digite seu nome"
              placeholder="Ex: João Silva"
              value={name}
              onChangeText={setName}
            />
            <FormField
              label="Digite seu e-mail"
              hint="Mínimo 6 caracteres"
              placeholder="Ex: teste@agendei.com"
              value={email}
              onChangeText={setEmail}
            />
            <FormField
              label="Digite sua senha"
              hint="Mínimo 9 caracteres"
              placeholder="Ex: senha1234"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Pressable style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpar</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.signupCard}>
            <Text style={styles.signupTitle}>Já possui uma conta?</Text>
            <View style={styles.signupUnderline} />
            <Text style={styles.signupText}>
              Entre na sua conta já existente e dê o próximo passo conosco
            </Text>
            <Pressable style={styles.signupButton} onPress={() => router.push('/login')}>
              <Text style={styles.signupButtonText}>Fazer login</Text>
            </Pressable>
          </View>

          <Pressable style={styles.loginButton} onPress={handleRegister}>
            <Text style={styles.loginButtonText}>Cadastrar</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <Pressable
        style={[styles.voltarButton, { top: insets.top + 12 }]}
        onPress={handleBack}
      >
        <Text style={styles.voltarButtonText}>Voltar</Text>
      </Pressable>
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
  flex: { flex: 1 },
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
  flipX: { transform: [{ scaleX: -1 }] },
  flipY: { transform: [{ scaleY: -1 }] },
  backgroundArt: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '42%',
    zIndex: 0,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
    zIndex: 2,
  },
  logo: {
    width: 56,
    height: 56,
    marginBottom: 8,
  },
  brand: {
    fontSize: 20,
    fontWeight: '700',
    color: '#153F35',
    marginBottom: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginBottom: 16,
  },
  field: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#153F35',
    marginRight: 8,
  },
  labelLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#153F35',
    opacity: 0.35,
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#EEF0EE',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#374151',
  },
  clearButton: {
    borderWidth: 1.5,
    borderColor: '#153F35',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  clearButtonText: {
    color: '#153F35',
    fontWeight: '700',
    fontSize: 15,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 12,
  },
  signupCard: {
    width: '100%',
    backgroundColor: '#153F35',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  signupTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
  },
  signupUnderline: {
    width: 50,
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginTop: 6,
    marginBottom: 10,
  },
  signupText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  signupButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loginButtonText: {
    color: '#153F35',
    fontWeight: '700',
    fontSize: 16,
  },
});
