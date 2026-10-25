import mongoose, { Schema, models } from 'mongoose';
import Order from './Order';
import User from './User';

// A block of time a booster is available to work. Admins attach customer orders to it.
const ShiftSchema = new Schema(
  {
    boosterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    note: { type: String, default: '', maxlength: 500 },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    // Shared by the shifts created together as one weekly series.
    seriesId: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

ShiftSchema.index({ boosterId: 1, start: 1 });

const Shift = models.Shift || mongoose.model('Shift', ShiftSchema);
export default Shift;

// What a booster may see about the customers in their shift. Leaves out account credentials,
// which orders for account purchases also carry.
export const customerOrdersPopulate = {
  path: 'orders',
  model: Order,
  select: 'userId items.title items.quantity total status kind requestedStart requestedEnd description createdAt',
  populate: { path: 'userId', model: User, select: 'name avatar discordId' },
};
