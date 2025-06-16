import { useEffect, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';

import { supabase } from '@/lib/supabase';
import { ThemedText } from './ThemedText';
import { Colors } from '@/constants/Colors';

interface PromoBlock {
  id: number;
  title: string;
  image_url: string;
  href: string | null;
}

export default function PromoGrid() {
  const [blocks, setBlocks] = useState<PromoBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('promo_blocks')
        .select('id, title, image_url, href')
        .order('order_index');
      if (data) setBlocks(data as PromoBlock[]);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <ThemedText>Loading...</ThemedText>;
  }

  return (
    <FlatList
      data={blocks}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.item}>
          <Image source={{ uri: item.image_url }} style={styles.image} contentFit="cover" />
          <View style={styles.overlay}>
            <ThemedText style={styles.title}>{item.title}</ThemedText>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { marginVertical: 16 },
  item: {
    width: 300,
    height: 180,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { color: Colors.light.background, fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});
