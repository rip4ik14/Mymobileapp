import { Text, StyleSheet, FlatList, TouchableOpacity, LayoutAnimation } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthCart } from '@/components/AuthCartProvider';

export default function CartScreen() {
  const { cart, removeFromCart } = useAuthCart();

  const handleRemove = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await removeFromCart(id);
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn} exiting={FadeOut}>
      {cart.length === 0 ? (
        <Text style={styles.text}>Your cart is empty</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Animated.View
              style={styles.item}
              entering={FadeIn}
              exiting={FadeOut}
            >
              <Text style={styles.itemText}>{item.product_id}</Text>
              <TouchableOpacity onPress={() => handleRemove(item.id)}>
                <Text style={styles.remove}>Remove</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  text: { fontSize: 20, textAlign: 'center', marginTop: 40 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: { fontSize: 16 },
  remove: { color: 'red' },
});
