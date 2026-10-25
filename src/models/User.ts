import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ['user', 'buyer', 'booster', 'admin'], default: 'user' },
    balance: { type: Number, default: 0 },
    avatar: { type: String, default: '' },
    provider: { type: String, default: 'discord' },
    discordId: { type: String, unique: true, sparse: true },
    // Role IDs the user held in the Discord server at the last sync.
    discordRoles: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model('User', UserSchema);
export default User;
