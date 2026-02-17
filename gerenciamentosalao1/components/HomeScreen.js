import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Utils';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Gerenciamento de Salão</Text>
    </View>
  );
}
