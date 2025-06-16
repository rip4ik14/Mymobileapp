import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { useAuthCart } from './AuthCartProvider';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[] | null;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useAuthCart();
  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
  const handleAdd = () => addToCart(product.id.toString());

  return (
    <View style={styles.card}>
      {image && <Image source={{ uri: image }} style={styles.image} contentFit="cover" />}
      <ThemedText style={styles.title}>{product.title}</ThemedText>
      <ThemedText style={styles.price}>{product.price} ₽</ThemedText>
      <TouchableOpacity style={styles.button} onPress={handleAdd}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: 150, height: 150, borderRadius: 8, marginBottom: 8, backgroundColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center', color: Colors.light.text },
  price: { fontSize: 14, color: Colors.light.text, marginVertical: 4 },
  button: {
    backgroundColor: Colors.light.text,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginTop: 8,
  },
  buttonText: { color: Colors.light.background, fontWeight: 'bold' },
});
