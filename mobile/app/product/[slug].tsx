import { useEffect, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, interpolate, Extrapolate } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

interface Product {
  title: string;
  price: number;
  description: string | null;
  images: string[] | null;
}

const { width } = Dimensions.get('window');

export default function ProductSlugScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('title, price, description, images')
        .eq('slug', slug)
        .maybeSingle();
      if (error) {
        setError(error.message);
        setProduct(null);
      } else {
        setProduct(data as Product);
        setError(null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [slug]);

  const scrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.center}>
        <Text>{error || 'Product not found'}</Text>
      </View>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.title }} />
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {images.map((img, idx) => (
          <Image key={idx} source={{ uri: img }} style={styles.image} contentFit="cover" />
        ))}
      </Animated.ScrollView>
      <View style={styles.dots}>
        {images.map((_, i) => (
          <Dot key={i} index={i} scrollX={scrollX} />
        ))}
      </View>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.price} ₽</Text>
      {product.description ? <Text style={styles.desc}>{product.description}</Text> : null}
    </View>
  );
}

function Dot({ index, scrollX }: { index: number; scrollX: Animated.SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value / width, [index - 1, index, index + 1], [0.3, 1, 0.3], Extrapolate.CLAMP);
    const dotWidth = interpolate(scrollX.value / width, [index - 1, index, index + 1], [8, 16, 8], Extrapolate.CLAMP);
    return { width: dotWidth, opacity };
  });
  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  carousel: { width, height: width },
  image: { width, height: width },
  dots: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 4 },
  title: { fontSize: 24, fontWeight: 'bold', marginHorizontal: 16, marginTop: 16 },
  price: { fontSize: 20, marginHorizontal: 16, marginTop: 8 },
  desc: { fontSize: 16, marginHorizontal: 16, marginTop: 12 },
});

