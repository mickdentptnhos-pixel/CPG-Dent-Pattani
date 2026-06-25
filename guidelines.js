// ข้อมูล Label พื้นฐาน
const PROC_LABELS = {
  emergency: "Emergency (ฉุกเฉิน)",
  urgency:   "Urgency (เร่งด่วน)",
  elective:  "Elective (นัดล่วงหน้า)"
};

const DEFAULT_PROCEDURES = [
  { value: "minor", dot: "🪥", label: "หัตถการเจ็บน้อย เลือดออกน้อย ผู้ป่วยกลัวต่ำ", sub: "เช่น อุดฟัน, ขูดหินปูน" },
  { value: "ext2",  dot: "🦷", label: "ถอนฟันไม่เกิน 2 ซี่" },
  { value: "surg",  dot: "🔪", label: "ถอนฟันมากกว่า 2 ซี่ / ผ่าตัดเล็กในช่องปาก" }
];

// ข้อมูล CPG แยกตามโรค (นำโค้ด const PROBLEMS = { ... } ของเดิมมาวางตรงนี้ทั้งหมด)
const PROBLEMS = {
  ht: { ... },
  warfarin: { ... },
  aspirin: { ... }
};
