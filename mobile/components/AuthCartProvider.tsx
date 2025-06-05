import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { LayoutAnimation } from 'react-native';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
}

interface AuthCartContextProps {
  session: Session | null;
  cart: CartItem[];
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
}

const AuthCartContext = createContext<AuthCartContextProps | undefined>(undefined);

export function AuthCartProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [session]);

  const fetchCart = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', session.user.id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCart(data || []);
  };

  const signIn = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const addToCart = async (productId: string, quantity = 1) => {
    if (!session?.user) return;
    await supabase.from('cart_items').insert({
      user_id: session.user.id,
      product_id: productId,
      quantity,
    });
    await fetchCart();
  };

  const removeFromCart = async (id: string) => {
    await supabase.from('cart_items').delete().eq('id', id);
    await fetchCart();
  };

  return (
    <AuthCartContext.Provider value={{ session, cart, signIn, signOut, addToCart, removeFromCart }}>
      {children}
    </AuthCartContext.Provider>
  );
}

export function useAuthCart() {
  const context = useContext(AuthCartContext);
  if (!context) throw new Error('useAuthCart must be used within AuthCartProvider');
  return context;
}

