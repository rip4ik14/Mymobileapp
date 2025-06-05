import { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Image } from 'expo-image';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';

export default function CatalogScreen() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<{
    id: number;
    title: string;
    image: string | null;
  }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, images')
        .order('id');

      if (!error && data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            title: p.title,
            image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
          }))
        );
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Animated.View entering={FadeIn.duration(300)} style={styles.item}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image} />
          ) : null}
          <ThemedText style={styles.title}>{item.title}</ThemedText>
        </Animated.View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  item: { marginBottom: 16, alignItems: 'center' },
  image: { width: 150, height: 150, borderRadius: 8, marginBottom: 8, backgroundColor: '#eee' },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
