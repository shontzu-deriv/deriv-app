import { createContext } from 'react';
import type { TRootStore } from '../types';

const StoreContext = createContext<TRootStore | null>(null);

export default StoreContext;
