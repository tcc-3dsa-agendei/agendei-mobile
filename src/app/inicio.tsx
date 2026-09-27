import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface InicioProps {
  onAgendar?: () => void;
  onSaibaMais?: () => void;
}


const logo = require('../../assets/images/logo.png');
const cornerShape = require('../../assets/images/form.png');
const background = require('../../assets/images/fundo.jpg');

const CORNER_STRIP_ASPECT = 578 / 250;
const CORNER_WIDTH = 110;
const CORNER_HEIGHT = CORNER_WIDTH / CORNER_STRIP_ASPECT;

export default function Inicio({ onAgendar, onSaibaMais }: InicioProps) {
  return (
    <View style={styles.screen}>
      <Image source={cornerShape} style={styles.cornerTopLeft} resizeMode="stretch" />
      <Image
        source={cornerShape}
        style={[styles.cornerBottomRight, styles.rotate180]}
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

      <View style={styles.content}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />

        <Text style={styles.title}>
          Bem vindo ao{'\n'}
          <Text style={styles.brand}>Agendei</Text>
          <Text style={styles.brandLight}>.com!</Text>
        </Text>

        <Text style={styles.description}>
          O Agendei.com é uma plataforma completa para gerenciar clientes, serviços e
          horários em um só lugar, facilitando o dia a dia da sua empresa
        </Text>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={onAgendar}>
            <Text style={styles.primaryButtonText}>Agendar</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onSaibaMais}>
            <Text style={styles.secondaryButtonText}>Saiba mais</Text>
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
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CORNER_WIDTH,
    height: CORNER_HEIGHT,
    zIndex: 3,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CORNER_WIDTH,
    height: CORNER_HEIGHT,
    zIndex: 3,
  },
  rotate180: {
    transform: [{ rotate: '180deg' }],
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
  content: {
    flex: 1,
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 30,
    color: '#153F35',
    textAlign: 'center',
  },
  brand: { fontWeight: '700' },
  brandLight: { fontWeight: '600' },
  description: {
    marginBottom: 28,
    maxWidth: 300,
    fontSize: 16,
    lineHeight: 24,
    color: '#6B7280',
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    marginTop: 8,
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#153F35',
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  secondaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#153F35',
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#153F35', fontSize: 15, fontWeight: '600' },
});
