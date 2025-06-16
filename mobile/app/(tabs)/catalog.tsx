import { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import PromoGrid from '@/components/PromoGrid';
import ProductCard, { Product } from '@/components/ProductCard';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { supabase } from '@/lib/supabase';
import AnimatedSection from '@/components/AnimatedSection';


export default function CatalogScreen() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, images')
        .order('id');

      if (!error && data) {
        setProducts(data as Product[]);
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
    <>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<PromoGrid />}
        renderItem={({ item }) => (
          <Animated.View entering={FadeIn.duration(300)} style={styles.item}>
            <ProductCard product={item} />
          </Animated.View>
        )}
      />
      <AnimatedSection animation="fadeIn">
        <View style={styles.container}>
          <Text style={styles.text}>Catalog Screen</Text>
        </View>
      </AnimatedSection>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 16 },
  item: { marginBottom: 16, alignItems: 'center' },
});
