import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

// import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      // const product = await AsyncStorage.getItem('@product:item');

      // if (product) {
      //   const prod = JSON.parse(product);
      //   setProducts([...products, prod]);
      // }

      setProducts([]);
    }

    loadProducts();
  }, [products]);

  const addToCart = useCallback(
    async (product: Product): Promise<void> => {
      // TODO ADD A NEW ITEM TO THE CART
      const prodfiltr = products.filter(prod => prod.id === product.id);

      const productExists = prodfiltr[0];

      if (!productExists) {
        const novoProd = {
          ...product,
          quantity: 1,
        };
        setProducts([...products, novoProd]);
      }
      const prodIndex = products.findIndex(produ => produ.id === product.id);

      products[prodIndex].quantity += 1;
      setProducts(products.map(prod => prod));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const index = products.findIndex(product => product.id === id);

      const productfilt = products[index];

      productfilt.quantity += 1;

      products.indexOf(productfilt, index);

      setProducts(
        products.map(product => ({
          ...product,
        })),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const index = products.findIndex(product => product.id === id);

      const productfilt = products[index];

      productfilt.quantity -= 1;

      if (productfilt.quantity === 0) {
        const productRemuvie = products.filter(product => product.id !== id);

        setProducts(productRemuvie);
      }

      products.indexOf(productfilt, index);

      setProducts(
        products.map(product => ({
          ...product,
        })),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
