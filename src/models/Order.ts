import mongoose, { Schema, models } from 'mongoose';

const OrderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  accountLogin: { type: String },
  accountPassword: { type: String },
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, default: 'bank_transfer' },
    // 'session' orders are booking requests from buyers: a time slot and a description, no cart items.
    // Admin assigns them to a booster's shift; the price is settled outside the store.
    kind: { type: String, enum: ['purchase', 'session'], default: 'purchase' },
    requestedStart: { type: Date },
    requestedEnd: { type: Date },
    description: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

const Order = models.Order || mongoose.model('Order', OrderSchema);
export default Order;
