import { View, Text, StyleSheet } from 'react-native';
import AnimatedSection from '@/components/AnimatedSection';

export default function CatalogScreen() {
  return (
    <AnimatedSection animation="fadeIn">
      <View style={styles.container}>
        <Text style={styles.text}>Catalog Screen</Text>
      </View>
    </AnimatedSection>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 20 },
});
