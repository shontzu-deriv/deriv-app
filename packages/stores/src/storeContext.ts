import { createContext } from 'react';
import type { TCoreStores } from '../types';

const StoreContext = createContext<TCoreStores | null>(null);

export default StoreContext;
