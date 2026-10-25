import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    images: [{ type: String }],
    category: { type: String, required: true },
    server: { type: String, default: '' },
    status: {
      type: String,
      enum: ['active', 'inactive', 'sold_out'],
      default: 'active',
    },
    featured: { type: Boolean, default: false },
    accountCode: { type: String, default: '' },
    accountType: { type: String, default: '' },
    level: { type: Number, default: null },
    rank: { type: String, default: '' },
    accountLogin: { type: String, default: '' },
    accountPassword: { type: String, default: '' },
    gameCoins: { type: Number, default: null },
    weaponSkins: [
      {
        weaponName: { type: String },
        skinName: { type: String },
        tier: { type: String },
        image: { type: String },
      },
    ],
    characterSkins: [
      {
        characterName: { type: String },
        rarity: { type: String },
        image: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Product = models.Product || mongoose.model('Product', ProductSchema);
export default Product;
