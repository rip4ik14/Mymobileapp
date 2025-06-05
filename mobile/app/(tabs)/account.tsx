import { useState } from 'react';
import { Text, TextInput, Button, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthCart } from '@/components/AuthCartProvider';

export default function AccountScreen() {
  const { session, signIn, signOut } = useAuthCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (session) {
    return (
      <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
        <Text style={styles.text}>Signed in as {session.user.email}</Text>
        <Button title="Sign Out" onPress={signOut} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Sign In" onPress={() => signIn(email, password)} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontSize: 18 },
  input: {
    borderWidth: 1,
    padding: 8,
    width: '80%',
    borderRadius: 4,
  },
});
