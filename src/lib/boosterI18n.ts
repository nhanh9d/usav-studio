// Vietnamese and English text for the Account Booster pages. Unlike the studio site, /booster has no language in
// its URL: the visitor's choice is kept in a cookie and the header's VI/EN switch changes it.

import { defaultLocale, isLocale, type Locale } from '@/content/site';
import { MAX_BOOKING_HOURS, MAX_DESCRIPTION, MIN_DESCRIPTION } from './bookings';
import { MAX_SHIFT_HOURS } from './shifts';

export const LANG_COOKIE = 'usav-lang';

export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}

// Locale for Intl date formatting.
export const intlLocale: Record<Locale, string> = { en: 'en-US', vi: 'vi-VN' };

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const en = {
  meta: {
    title: 'USAV Account Booster',
    description: 'Book boosting and coaching sessions with USAV boosters.',
  },
  common: {
    signOut: 'Sign out',
    language: 'Language',
    deletedUser: 'Deleted user',
    messageOnDiscord: 'Message on Discord',
    cancel: 'Cancel',
    sessionRequest: 'Session request',
    purchase: 'Purchase',
    customers: (n: number) => plural(n, 'customer', 'customers'),
    // Admin and booster wording for order statuses.
    status: { pending: 'Pending', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' },
  },
  nav: { myShifts: 'My Shifts', book: 'Book a Session', admin: 'Admin' },
  footer: { terms: 'Terms of Service', privacy: 'Privacy Policy' },
  signIn: {
    welcome: 'Welcome',
    intro: 'Account Booster is for members of the USAV Discord. Sign in with Discord to continue.',
    continue: 'Continue with Discord',
    errors: {
      NotInGuild: 'You need to join the USAV Discord server before you can use Account Booster.',
      AccessDenied: 'Discord sign-in was denied.',
      OAuthCallback: 'Discord sign-in was cancelled or failed. Please try again.',
    } as Record<string, string>,
    failed: 'Sign-in failed. Please try again.',
  },
  noAccess: {
    title: 'No access yet',
    body: "Your Discord account doesn't have a buyer or booster role in the USAV server yet. Ask an admin to give you one, then sign in again. Role changes can take up to 10 minutes to show here.",
    questions: 'Questions? Email',
  },
  book: {
    title: 'Book a Session',
    intro: "Pick when you want to play and tell us what you need. We'll assign a booster and contact you on Discord.",
    from: 'From',
    to: 'To',
    hoursHint: `Up to ${MAX_BOOKING_HOURS} hours per request, in your local time.`,
    need: 'What do you need?',
    placeholder:
      'e.g. Boost from Gold to Platinum in Operations, or coaching for Warfare. Your in-game name and server help too.',
    sent: "Request sent. You'll see its status below.",
    sending: 'Sending…',
    send: 'Send request',
    sendFailed: 'Could not send your request. Please try again.',
    myRequests: 'My requests',
    none: 'No requests yet.',
    session: 'Session',
    // Buyer-facing wording for order statuses.
    status: { pending: 'Received', processing: 'In progress', completed: 'Completed', cancelled: 'Cancelled' },
  },
  shifts: {
    title: 'My Shifts',
    welcome: (name?: string | null) => `Welcome back${name ? `, ${name}` : ''}. Click an empty slot to add a shift.`,
    add: 'Add Shift',
    edit: 'Edit Shift',
    details: 'Shift Details',
    statShifts: 'Shifts this week',
    statHours: 'Hours',
    statCustomers: 'Customers',
    ends: (day: string) => ` (ends ${day})`,
    assignedCustomers: (n: number) => `Assigned customers (${n})`,
    confirmDelete: 'Delete this shift?',
    yesDelete: 'Yes, delete',
    deleteButton: 'Delete',
    editButton: 'Edit',
    saveFailed: 'Could not save the shift',
    deleteFailed: 'Could not delete the shift',
    created: (created: number, skipped: number) =>
      `Added ${plural(created, 'shift', 'shifts')}.` +
      (skipped ? ` Skipped ${skipped} that overlap your existing shifts.` : ''),
    deletedSeries: (deleted: number, kept: number) =>
      `Deleted ${plural(deleted, 'shift', 'shifts')}.` + (kept ? ` Kept ${kept} that have customers assigned.` : ''),
    repeats: 'Repeats weekly',
    deleteOnly: 'Only this shift',
    deleteFollowing: 'This and following shifts',
  },
  shiftForm: {
    start: 'Start',
    end: 'End',
    note: 'Note (optional)',
    notePlaceholder: 'e.g. Ranked only, available on voice',
    saving: 'Saving…',
    save: 'Save Changes',
    add: 'Add Shift',
    repeat: 'Repeat weekly',
    repeatOn: 'On',
    repeatFor: 'For',
    // Follows the number of weeks input, e.g. 'For [1] week'.
    weeksUnit: (n: number): string => (n === 1 ? 'week' : 'weeks'),
    addMany: (n: number) => `Add ${plural(n, 'shift', 'shifts')}`,
  },
  week: { previous: 'Previous week', today: 'Today', next: 'Next week' },
  customers: { none: 'No customers assigned yet.', remove: 'Remove customer from shift' },
  admin: {
    orders: 'Orders',
    shifts: 'Shifts',
    bookingScreen: 'Booking Screen',
  },
  adminOrders: {
    title: 'Orders',
    intro: "Store purchases and buyers' session requests. Assign sessions to a booster in",
    shiftsLink: 'Shifts',
    all: 'All',
    sessions: 'Session requests',
    purchases: 'Purchases',
    anyStatus: 'Any status',
    noMatch: 'No orders match these filters.',
    placed: (date: string) => `Placed ${date}`,
    assignedTo: (booster: string, slot: string) => `Assigned to ${booster} · ${slot}`,
    notAssigned: 'Not assigned to a shift',
    statusLabel: 'Order status',
    updateFailed: 'Could not update the order',
    available: 'On shift at this time',
    partly: 'partly covers',
    noCandidates: 'No booster has a shift at this time yet.',
    assign: 'Assign',
    unassign: 'Remove from this shift',
    assignFailed: 'Could not assign the order',
  },
  adminShifts: {
    title: 'Booster Shifts',
    intro: 'See who works when. Drag a waiting request onto a shift to assign it, or click a shift to manage its customers.',
    none: 'No boosters yet. They show up here once they sign in with the booster role.',
    waiting: (n: number) => `Waiting for a booster (${n})`,
    noWaiting: 'No requests are waiting. New ones show up here.',
    dragHint: 'Drag a request onto a shift to assign it, or click it to highlight the shifts that fit.',
    showingFor: (name: string) => `Highlighting shifts for ${name}'s request.`,
    clear: 'Clear',
    booster: 'Booster',
    hours: (h: number) => `${h}h this week`,
    legendCustomers: 'Has customers',
    legendEmpty: 'No customers yet',
    legendCovers: 'Covers the whole request',
    legendPartly: 'Covers part of it',
    shift: 'Shift',
    unknownBooster: 'Unknown booster',
    customers: (n: number) => plural(n, 'customer', 'customers'),
    choose: 'Choose an order…',
    noOpen: 'No open orders to assign',
    assign: 'Assign',
    session: 'Session',
    fits: 'Requested during this shift',
    others: 'Other open orders',
  },
  // Keyed by the `code` the booster APIs return (see src/lib/bookings.ts, src/lib/shifts.ts).
  errors: {
    invalidTimes: 'Pick a start and end time',
    pastStart: 'The time slot must be in the future',
    endBeforeStart: 'The session must end after it starts',
    bookingTooLong: `A session can last at most ${MAX_BOOKING_HOURS} hours`,
    descriptionShort: `Describe what you need in at least ${MIN_DESCRIPTION} characters`,
    descriptionLong: `The description can be at most ${MAX_DESCRIPTION} characters`,
    shiftTimesRequired: 'Start and end times are required',
    shiftEndBeforeStart: 'The shift must end after it starts',
    shiftTooLong: `A shift can last at most ${MAX_SHIFT_HOURS} hours`,
    shiftOverlap: 'This shift overlaps another of your shifts',
    shiftHasCustomers: 'This shift has customers assigned. Ask an admin to reassign them before deleting it.',
  },
};

export type BoosterDict = typeof en;
export type ErrorCode = keyof BoosterDict['errors'];

const vi: BoosterDict = {
  meta: {
    title: 'USAV Account Booster',
    description: 'Đặt lịch cày thuê và coaching cùng booster của USAV.',
  },
  common: {
    signOut: 'Đăng xuất',
    language: 'Ngôn ngữ',
    deletedUser: 'Người dùng đã xóa',
    messageOnDiscord: 'Nhắn tin trên Discord',
    cancel: 'Hủy',
    sessionRequest: 'Yêu cầu đặt lịch',
    purchase: 'Đơn mua',
    customers: (n: number) => `${n} khách hàng`,
    status: { pending: 'Chờ xử lý', processing: 'Đang xử lý', completed: 'Hoàn thành', cancelled: 'Đã hủy' },
  },
  nav: { myShifts: 'Ca của tôi', book: 'Đặt lịch', admin: 'Quản trị' },
  footer: { terms: 'Điều khoản dịch vụ', privacy: 'Chính sách bảo mật' },
  signIn: {
    welcome: 'Chào mừng',
    intro: 'Account Booster dành cho thành viên Discord của USAV. Đăng nhập bằng Discord để tiếp tục.',
    continue: 'Tiếp tục với Discord',
    errors: {
      NotInGuild: 'Bạn cần tham gia server Discord của USAV trước khi dùng Account Booster.',
      AccessDenied: 'Đăng nhập Discord đã bị từ chối.',
      OAuthCallback: 'Đăng nhập Discord đã bị hủy hoặc thất bại. Vui lòng thử lại.',
    },
    failed: 'Đăng nhập thất bại. Vui lòng thử lại.',
  },
  noAccess: {
    title: 'Chưa có quyền truy cập',
    body: 'Tài khoản Discord của bạn chưa có vai trò buyer hoặc booster trong server USAV. Hãy nhờ admin cấp vai trò rồi đăng nhập lại. Thay đổi vai trò có thể mất tới 10 phút để cập nhật.',
    questions: 'Cần hỗ trợ? Email',
  },
  book: {
    title: 'Đặt lịch',
    intro: 'Chọn thời gian bạn muốn chơi và cho chúng tôi biết bạn cần gì. Chúng tôi sẽ sắp xếp booster và liên hệ bạn qua Discord.',
    from: 'Từ',
    to: 'Đến',
    hoursHint: `Tối đa ${MAX_BOOKING_HOURS} giờ mỗi yêu cầu, theo giờ địa phương của bạn.`,
    need: 'Bạn cần gì?',
    placeholder:
      'VD: Cày rank từ Vàng lên Bạch Kim ở Operations, hoặc coaching Warfare. Ghi thêm tên trong game và server sẽ giúp ích.',
    sent: 'Đã gửi yêu cầu. Bạn có thể theo dõi trạng thái bên dưới.',
    sending: 'Đang gửi…',
    send: 'Gửi yêu cầu',
    sendFailed: 'Không gửi được yêu cầu. Vui lòng thử lại.',
    myRequests: 'Yêu cầu của tôi',
    none: 'Chưa có yêu cầu nào.',
    session: 'Buổi chơi',
    status: { pending: 'Đã nhận', processing: 'Đang thực hiện', completed: 'Hoàn thành', cancelled: 'Đã hủy' },
  },
  shifts: {
    title: 'Ca của tôi',
    welcome: (name?: string | null) => `Chào mừng trở lại${name ? `, ${name}` : ''}. Bấm vào ô trống để thêm ca.`,
    add: 'Thêm ca',
    edit: 'Sửa ca',
    details: 'Chi tiết ca',
    statShifts: 'Ca tuần này',
    statHours: 'Giờ',
    statCustomers: 'Khách hàng',
    ends: (day: string) => ` (kết thúc ${day})`,
    assignedCustomers: (n: number) => `Khách hàng được giao (${n})`,
    confirmDelete: 'Xóa ca này?',
    yesDelete: 'Xóa',
    deleteButton: 'Xóa',
    editButton: 'Sửa',
    saveFailed: 'Không lưu được ca',
    deleteFailed: 'Không xóa được ca',
    created: (created: number, skipped: number) =>
      `Đã thêm ${created} ca.` + (skipped ? ` Bỏ qua ${skipped} ca bị trùng với ca bạn đã có.` : ''),
    deletedSeries: (deleted: number, kept: number) =>
      `Đã xóa ${deleted} ca.` + (kept ? ` Giữ lại ${kept} ca đã có khách hàng.` : ''),
    repeats: 'Lặp lại hằng tuần',
    deleteOnly: 'Chỉ ca này',
    deleteFollowing: 'Ca này và các ca sau',
  },
  shiftForm: {
    start: 'Bắt đầu',
    end: 'Kết thúc',
    note: 'Ghi chú (không bắt buộc)',
    notePlaceholder: 'VD: Chỉ chơi rank, có thể voice',
    saving: 'Đang lưu…',
    save: 'Lưu thay đổi',
    add: 'Thêm ca',
    repeat: 'Lặp lại hằng tuần',
    repeatOn: 'Vào',
    repeatFor: 'Trong',
    weeksUnit: () => 'tuần',
    addMany: (n: number) => `Thêm ${n} ca`,
  },
  week: { previous: 'Tuần trước', today: 'Hôm nay', next: 'Tuần sau' },
  customers: { none: 'Chưa có khách hàng nào được giao.', remove: 'Gỡ khách hàng khỏi ca' },
  admin: {
    orders: 'Đơn hàng',
    shifts: 'Ca làm',
    bookingScreen: 'Màn hình đặt lịch',
  },
  adminOrders: {
    title: 'Đơn hàng',
    intro: 'Đơn mua và yêu cầu đặt lịch của khách. Giao yêu cầu cho booster ở trang',
    shiftsLink: 'Ca làm',
    all: 'Tất cả',
    sessions: 'Yêu cầu đặt lịch',
    purchases: 'Đơn mua',
    anyStatus: 'Mọi trạng thái',
    noMatch: 'Không có đơn nào khớp bộ lọc.',
    placed: (date: string) => `Đặt lúc ${date}`,
    assignedTo: (booster: string, slot: string) => `Đã giao cho ${booster} · ${slot}`,
    notAssigned: 'Chưa giao vào ca nào',
    statusLabel: 'Trạng thái đơn',
    updateFailed: 'Không cập nhật được đơn hàng',
    available: 'Đang có ca vào thời gian này',
    partly: 'trùng một phần',
    noCandidates: 'Chưa có booster nào có ca vào thời gian này.',
    assign: 'Giao',
    unassign: 'Gỡ khỏi ca này',
    assignFailed: 'Không giao được đơn',
  },
  adminShifts: {
    title: 'Ca của booster',
    intro: 'Xem ai làm lúc nào. Kéo yêu cầu đang chờ vào một ca để giao, hoặc bấm vào ca để quản lý khách hàng.',
    none: 'Chưa có booster nào. Booster sẽ hiện ở đây sau khi đăng nhập với vai trò booster.',
    waiting: (n: number) => `Đang chờ booster (${n})`,
    noWaiting: 'Không có yêu cầu nào đang chờ. Yêu cầu mới sẽ hiện ở đây.',
    dragHint: 'Kéo yêu cầu vào một ca để giao, hoặc bấm vào yêu cầu để làm nổi bật các ca phù hợp.',
    showingFor: (name: string) => `Đang làm nổi bật các ca cho yêu cầu của ${name}.`,
    clear: 'Bỏ chọn',
    booster: 'Booster',
    hours: (h: number) => `${h} giờ tuần này`,
    legendCustomers: 'Đã có khách',
    legendEmpty: 'Chưa có khách',
    legendCovers: 'Phủ toàn bộ yêu cầu',
    legendPartly: 'Phủ một phần',
    shift: 'Ca làm',
    unknownBooster: 'Booster không xác định',
    customers: (n: number) => `${n} khách hàng`,
    choose: 'Chọn đơn…',
    noOpen: 'Không có đơn nào để giao',
    assign: 'Giao',
    session: 'Buổi chơi',
    fits: 'Đặt trong thời gian ca này',
    others: 'Đơn khác đang chờ',
  },
  errors: {
    invalidTimes: 'Hãy chọn thời gian bắt đầu và kết thúc',
    pastStart: 'Thời gian phải ở tương lai',
    endBeforeStart: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    bookingTooLong: `Mỗi buổi tối đa ${MAX_BOOKING_HOURS} giờ`,
    descriptionShort: `Hãy mô tả nhu cầu của bạn ít nhất ${MIN_DESCRIPTION} ký tự`,
    descriptionLong: `Mô tả tối đa ${MAX_DESCRIPTION} ký tự`,
    shiftTimesRequired: 'Cần có thời gian bắt đầu và kết thúc',
    shiftEndBeforeStart: 'Ca phải kết thúc sau khi bắt đầu',
    shiftTooLong: `Mỗi ca tối đa ${MAX_SHIFT_HOURS} giờ`,
    shiftOverlap: 'Ca này trùng với một ca khác của bạn',
    shiftHasCustomers: 'Ca này đã có khách hàng. Hãy nhờ admin chuyển khách sang ca khác trước khi xóa.',
  },
};

export const boosterDictionaries: Record<Locale, BoosterDict> = { en, vi };

// For API responses: the English message for a code, alongside the code the pages translate.
export const apiError = (code: ErrorCode) => ({ error: en.errors[code], code });

// The message to show for a failed API call: the translated code when there is one, else `fallback`.
export function errorMessage(t: BoosterDict, data: { code?: string }, fallback: string) {
  return (data.code && t.errors[data.code as ErrorCode]) || fallback;
}
