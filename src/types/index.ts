export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'buyer' | 'booster' | 'admin';
  balance: number;
  avatar?: string;
  provider?: string;
  discordId?: string;
  discordRoles?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWeaponSkin {
  weaponName: string;
  skinName: string;
  tier: string;
  image?: string;
}

export interface ICharacterSkin {
  characterName: string;
  rarity?: string;
  image?: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  cost: number;
  discount: number;
  stock: number;
  sold: number;
  images: string[];
  category: string;
  server: string;
  status: 'active' | 'inactive' | 'sold_out';
  featured: boolean;
  accountCode?: string;
  accountType?: string;
  accountLogin?: string;
  accountPassword?: string;
  level?: number;
  rank?: string;
  gameCoins?: number;
  weaponSkins?: IWeaponSkin[];
  characterSkins?: ICharacterSkin[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  productId: string;
  product?: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
}

export interface IOrderItem {
  productId: string;
  product?: IProduct;
  title: string;
  price: number;
  quantity: number;
  accountLogin?: string;
  accountPassword?: string;
}

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentMethod: string;
  kind?: 'purchase' | 'session';
  requestedStart?: string;
  requestedEnd?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// A customer order as a booster sees it inside a shift (no account credentials).
export interface IShiftOrder {
  _id: string;
  userId?: { _id: string; name: string; avatar?: string; discordId?: string } | null;
  items: { title: string; quantity: number }[];
  total: number;
  status: IOrder['status'];
  kind?: IOrder['kind'];
  requestedStart?: string;
  requestedEnd?: string;
  description?: string;
  createdAt: string;
}

// An order as the admin Orders page lists it, with the booster shifts it is assigned to.
// An open order in the admin shift schedule; `assigned` when it already sits in a shift.
export interface IOpenOrder extends IShiftOrder {
  assigned: boolean;
}

export interface IAdminOrder extends IShiftOrder {
  paymentMethod: string;
  shifts: { _id: string; start: string; end: string; booster: string }[];
  // Session requests only: shifts overlapping the requested time that the order could be assigned to.
  candidates?: IShiftCandidate[];
}

export interface IShiftCandidate {
  _id: string;
  start: string;
  end: string;
  booster: string;
  customers: number;
  // Whether the shift covers the whole requested time.
  covers: boolean;
}

export interface IShift {
  _id: string;
  boosterId: string | { _id: string; name: string; avatar?: string; discordId?: string };
  start: string;
  end: string;
  note: string;
  orders: IShiftOrder[];
  seriesId?: string;
}
