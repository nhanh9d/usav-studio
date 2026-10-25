// Language-independent facts about the studio. Copy that needs translating lives in dictionaries.ts.

export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const contact = {
  representative: "Vũ Đức Toàn",
  phone: "+84901372694",
  phoneDisplay: "+84 901 372 694",
  email: "toanvu@usavstudio.com",
  facebook: "https://www.facebook.com/usavstudio",
  facebookDisplay: "facebook.com/usavstudio",
  liveHandle: "USAVSTUDIO",
};

export const team = [
  { name: "Vũ Đức Toàn", role: "founder" },
  { name: "Đặng Nhật Anh", role: "producer" },
  { name: "Minh Cao", role: "caster" },
  { name: "Quang giáo sư", role: "editor" },
  { name: "Trung Bùi", role: "operations" },
] as const;

// Delta Force Dream HEAT, from the tournament poster.
export const heat = {
  name: "Delta Force Dream",
  edition: "HEAT",
  registration: "03.10 – 10.10",
  matches: "15.10 – 17.10",
  year: "2026",
  prize: "5.000.000 VNĐ",
  prizeExtra: "Delta Ticket",
  // Served from /public; the detail page shows the viewer once this file exists.
  rulebook: "/docs/delta-force-dream-heat-rulebook.pdf",
};

// Final results of Delta Force Dream HEAT, from the broadcast result cards.
export const heatResults = {
  champion: { team: "Bách Quỷ Dạ Hành", tag: "BQ", players: ["ChuTG", "Bin2k4", "Ting2k5"] },
  fmvp: { player: "Zippo", tag: "OOP", kills: 9, assists: 4 },
  standingsRound: "Round 3 – Brakesh",
  standings: [
    { team: "Bách Quỷ Dạ Hành", mandel: 25, kills: 17, assets: 19, total: 61 },
    { team: "Only Operation", mandel: 0, kills: 11, assets: 7, total: 18 },
    { team: "Hội Người Già", mandel: 0, kills: 6, assets: 6, total: 12 },
    { team: "Clown 10", mandel: 0, kills: 3, assets: 8, total: 11 },
    { team: "Infinity", mandel: 0, kills: 1, assets: 3, total: 4 },
    { team: "USAV Esport", mandel: 0, kills: 0, assets: 2, total: 2 },
  ],
};

// USAV offline meetup held on 3 October 2026, from the invitation card.
export const event = {
  name: "Làm ly cho vui",
  date: "03.10.2026",
  time: "18:00",
  address: "68 Phan Kế Bính, Ba Đình, Hà Nội",
  host: "Pikachill",
};

// Weapon usage across the DFUT group stage, from the studio's own match tracking.
export const weaponMeta = {
  total: 261,
  classes: [
    { name: "Rifle", picks: 211 },
    { name: "SMG", picks: 32 },
    { name: "MR", picks: 10 },
    { name: "LMG", picks: 8 },
  ],
  topWeapon: { name: "AS-VAL", picks: 58 },
};
