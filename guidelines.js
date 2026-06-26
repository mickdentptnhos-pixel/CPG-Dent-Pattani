/* =====================================================================
   ป้ายกำกับตัวเลือก (ใช้ในผลลัพธ์ + ใบ Consult)
   ===================================================================== */
const PROC_LABELS = {
  emergency: "Emergency (ฉุกเฉิน)",
  urgency:   "Urgency (เร่งด่วน)",
  elective:  "Elective (นัดล่วงหน้า)"
};

/* ตัวเลือกหัตถการเริ่มต้น */
const DEFAULT_PROCEDURES = [
  { value: "minor", dot: "🪥", label: "หัตถการเจ็บน้อย เลือดออกน้อย ผู้ป่วยกลัวต่ำ", sub: "เช่น อุดฟัน, ขูดหินปูน" },
  { value: "ext2",  dot: "🦷", label: "ถอนฟันไม่เกิน 2 ซี่" },
  { value: "surg",  dot: "🔪", label: "ถอนฟันมากกว่า 2 ซี่ / ผ่าตัดเล็กในช่องปาก" }
];

/* =====================================================================
   โครงสร้าง Problem List
   ===================================================================== */
const PROBLEMS = {
  /* ---------- ความดันโลหิตสูง ---------- */
  ht: {
    label: "ความดันโลหิตสูง",
    procedures: [
      { value: "simple",  dot: "🪥", label: "หัตถการไม่ซับซ้อน เจ็บน้อย ผู้ป่วยกลัวต่ำ" },
      { value: "painful", dot: "⚡", label: "หัตถการที่มีความเจ็บปวด ผู้ป่วยกลัวมาก" }
    ],
    HT_PROC_LABEL: {
      simple:  "หัตถการไม่ซับซ้อน เจ็บน้อย ผู้ป่วยมีความกลัวต่ำ",
      painful: "หัตถการที่มีความเจ็บปวด ผู้ป่วยมีความกลัวมาก"
    },
    questions: [
      {
        id: "group", label: "ระดับความดันโลหิต", type: "chipChoice", chipStack: false, clears: ["htProcedure", "atod"],
        options: [
          { value: "1", text: "ต่ำกว่า 140/90 mmHg", sub: ["SBP ต่ำกว่า 140 mmHg และ", "DBP ต่ำกว่า 90 mmHg"] },
          { value: "2", text: "140–159 / 90–99 mmHg", sub: ["SBP 140–159 mmHg หรือ", "DBP 90–99 mmHg"] },
          { value: "3", text: "160–179 / 100–109 mmHg", sub: ["SBP 160–179 mmHg หรือ", "DBP 100–109 mmHg"] },
          { value: "4", text: "180/110 mmHg ขึ้นไป", sub: ["SBP ≥ 180 mmHg หรือ", "DBP ≥ 110 mmHg"] }
        ],
        showIf: (a, ctx) => ctx.proc === "urgency" || ctx.proc === "elective"
      },
      {
        id: "htProcedure", label: "เลือกประเภทหัตถการที่จะทำ", type: "chipChoice", chipStack: true,
        options: [
          { value: "simple",  text: "หัตถการไม่ซับซ้อน เจ็บน้อย ผู้ป่วยมีความกลัวต่ำ", sub: "เช่น อุดฟัน, ขูดหินปูน" },
          { value: "painful", text: "หัตถการที่มีความเจ็บปวด ผู้ป่วยมีความกลัวมาก", sub: "เช่น ถอนฟัน, ผ่าตัดในช่องปาก" }
        ],
        showIf: (a, ctx) => ctx.proc === "urgency" && a.group === "3"
      },
      {
        id: "atod", label: "มีอาการ Acute target organ damage หรือไม่?\n(เช่น ปวดศีรษะรุนแรง แน่นหน้าอก เจ็บหน้าอก ตามัว แขนขาอ่อนแรง)", type: "chipChoice", chipStack: false,
        options: [
          { value: "yes", text: "⛔ มีอาการ", sub: "Hypertensive emergency" },
          { value: "no",  text: "✅ ไม่มีอาการ" }
        ],
        showIf: (a, ctx) => (ctx.proc === "urgency" || ctx.proc === "elective") && a.group === "4"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return { status: "green", title: "ให้การรักษาทันที", message: "คำแนะนำ\n• วัดความดันโลหิตทุก 15 นาทีระหว่างทำหัตถการ\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการตลอดหัตถการ เช่น ปวดหัวรุนแรง แน่นหน้าอก ตามัว แขนขาอ่อนแรง\n• หรือ พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด" };
      }
      if (ctx.proc === "urgency") {
        const g = a.group;
        if (!g) return { status: null };
        if (g === "1") return { status: "green", title: "ให้การรักษาตามปกติ", message: "สามารถให้การรักษาทางทันตกรรมได้ตามปกติ" };
        if (g === "2") return { status: "green", title: "ให้การรักษาตามปกติ", message: "สามารถให้การรักษาทางทันตกรรมได้ตามปกติ แนะนำให้ผู้ป่วยไปพบแพทย์เพื่อรักษา/ควบคุมความดัน" };
        if (g === "3") {
          if (!a.htProcedure) return { status: null };
          if (a.htProcedure === "simple") return { status: "amber", title: "พิจารณาให้การรักษาร่วมกับการ Monitor อย่างใกล้ชิด", message: "คำแนะนำ\n• วัดความดันโลหิตทุก 15 นาทีระหว่างทำหัตถการ\n• พิจารณาใช้ยาชาที่มี adrenaline ไม่เกิน 2 cartridges\n• สังเกตอาการตลอดหัตถการ" };
          return { status: "red", title: "ส่งปรึกษาอายุรกรรม", message: "ต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและควบคุมความดันก่อนทำหัตถการ และนัดมารับบริการภายใน 7 วัน", consultBody: true };
        }
        if (g === "4") {
          if (!a.atod) return { status: null };
          if (a.atod === "yes") return { status: "red", title: "ส่งห้องฉุกเฉินทันที (Hypertensive emergency)", message: "งดทำหัตถการ และนำส่งห้องฉุกเฉินทันที" };
          return { status: "red", title: "ส่งปรึกษาอายุรกรรม", message: "ต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและควบคุมความดันก่อนทำหัตถการ และนัดมารับบริการภายใน 7 วัน", consultBody: true };
        }
      }
      if (ctx.proc === "elective") {
        const g = a.group;
        if (!g) return { status: null };
        if (g === "1" || g === "2") return { status: "green", title: "ให้การรักษาตามปกติ", message: "สามารถให้การรักษาทางทันตกรรมได้ตามปกติ" };
        if (g === "3") return { status: "amber", title: "แนะนำรักษาความดันก่อนทำหัตถการ", message: "แนะนำให้ผู้ป่วยไปพบแพทย์เพื่อรักษาความดันก่อน แล้วนัดทำหัตถการใหม่" };
        if (g === "4") {
          if (!a.atod) return { status: null };
          if (a.atod === "yes") return { status: "red", title: "ส่งห้องฉุกเฉินทันที", message: "งดทำหัตถการทันที และนำส่งห้องฉุกเฉิน" };
          return { status: "red", title: "ส่งปรึกษาอายุรกรรม", message: "งดทำหัตถการ ส่งปรึกษาอายุรกรรมก่อนนัดทำหัตถการ", consultBody: true };
        }
      }
      return { status: null };
    },
    buildConsult(a, ctx) {
      const procTxt = a.htProcedure ? this.HT_PROC_LABEL[a.htProcedure] : "";
      return "ผู้ป่วยมีภาวะความดันโลหิตสูง" + (procTxt ? " ต้องการทำ" + procTxt : "") + " (ประเภทหัตถการ: " + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์ประเมินและควบคุมความดันโลหิตก่อนทำหัตถการ";
    }
  },

  /* ---------- Warfarin ---------- */
  warfarin: {
    label: "Warfarin",
    procedures: [
      {
        value: "noBleed", dot: "🪥",
        label: "หัตถการที่ไม่น่าจะทำให้เกิดเลือดออก (Unlikely to cause bleeding)",
        sub: [
          "การตรวจประเมินสภาพช่องปากและรังสีวินิจฉัย",
          "การฉีดยาชาเฉพาะที่แบบ Infiltration, Intraligamentary หรือ Nerve block",
          "การบูรณะฟัน (อุดฟัน) ที่ขอบวัสดุอยู่เหนือขอบเหงือก",
          "การพิมพ์ปากสำหรับการทำฟันเทียม",
          "การปรับแต่งเครื่องมือจัดฟัน และการใส่ฟันเทียมถอดได้หรือติดแน่น"
        ]
      },
      {
        value: "lowBleed", dot: "🦷",
        label: "หัตถการที่มีความเสี่ยงต่ำ (Low bleeding risk)",
        sub: [
          "การถอนฟันแบบปกติ 1–3 ซี่ ที่คาดว่าจะมีแผลขนาดจำกัด (Simple extractions)",
          "การเจาะระบายหนองภายในช่องปาก (Incision & drainage)",
          "การขูดหินปูนและเกลารากฟัน (Root surface debridement: RSD)",
          "การบูรณะฟันที่มีขอบของวัสดุอยู่ใต้ขอบเหงือก",
          "การตรวจปริทันต์แบบละเอียด (Detailed six-point full periodontal examination)"
        ]
      },
      {
        value: "midBleed", dot: "🔪",
        label: "หัตถการที่มีความเสี่ยงสูงขึ้น (Higher bleeding risk)",
        sub: [
          "การถอนฟันที่ซับซ้อน หรือถอนฟันติดกันหลายซี่ที่ทำให้เกิดแผลขนาดใหญ่",
          "หัตถการศัลยกรรมที่มีการเปิดแผ่นเนื้อเยื่อ (Flap raising procedures)",
          "ศัลยกรรมปริทันต์ (Periodontal surgery) และตัดแต่งขอบเหงือก",
          "การผ่าตัดเพื่อใส่รากฟันเทียม (Dental implant surgery)",
          "การตัดชิ้นเนื้อ (Biopsies) การผ่าตัดเพิ่มความยาวของตัวฟัน และศัลยกรรมปลายรากฟัน"
        ]
      }
    ],
    questions: [
      {
        id: "inr",
        label: "มีผล INR ภายใน 72 ชั่วโมงหรือไม่?",
        type: "choice",
        clears: ["inrLevel"],
        options: [
          { value: "yes", text: "✅ มีผล INR" },
          { value: "no",  text: "❌ ไม่มีผล INR" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency"
      },
      {
        id: "inrLevel",
        label: "ระดับ INR",
        type: "chipChoice",
        chipStack: false,
        options: [
          { value: "leq3", text: "INR ≤ 3.0" },
          { value: "gt3",  text: "INR > 3.0" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && a.inr === "yes"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่หยุดยา Warfarin\n• ห้ามเลือดด้วย local hemostatic agent อย่างเข้มงวด\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกอย่างใกล้ชิดระหว่างและหลังทำหัตถการ"
        };
      }

      if (!a.inr) return { status: null };

      if (!ctx.procedure) return { status: null };

      if (a.inr === "no") {
        if (ctx.procedure === "noBleed") return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "หัตถการประเภทนี้ไม่น่าจะทำให้เกิดเลือดออก สามารถให้การรักษาได้โดยไม่จำเป็นต้องมีผล INR\n• ไม่จำเป็นต้องหยุดยา Warfarin" };
        if (ctx.proc === "urgency") return { status: "red",   title: "ต้องตรวจ INR ก่อนทำหัตถการ", message: "ผู้ป่วยไม่มีผล INR ภายใน 72 ชั่วโมง ให้ส่งตรวจ INR ก่อน แล้วประเมินซ้ำตามผลที่ได้" };
        if (ctx.proc === "elective") return { status: "amber", title: "แนะนำตรวจ INR ก่อนนัดทำหัตถการ", message: "ผู้ป่วยไม่มีผล INR ภายใน 72 ชั่วโมง แนะนำให้ตรวจ INR ก่อน แล้วนัดทำหัตถการใหม่" };
      }

      if (!a.inrLevel) return { status: null };

      const hemostasisMsg = "• ไม่จำเป็นต้องหยุดยา Warfarin\n• ระมัดระวังการห้ามเลือดระหว่างและหลังทำหัตถการ\n• พิจารณาเย็บแผลปิดหลังทำหัตถการ\n• พิจารณาใช้สารห้ามเลือด เช่น Gelfoam, Surgicel\n• นัดติดตามอาการหลังทำหัตถการ";

      if (ctx.proc === "urgency") {
        if (a.inrLevel === "leq3") {
          if (ctx.procedure === "noBleed")  return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "INR ≤ 3.0\nสามารถทำหัตถการได้ตามปกติ ไม่จำเป็นต้องหยุดยา Warfarin" };
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
          if (ctx.procedure === "midBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
        } else {
          if (ctx.procedure === "noBleed")  return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "INR > 3.0\nหัตถการประเภทนี้ไม่มีเลือดออก สามารถทำได้ตามปกติ" };
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง หรือ ส่ง Consult นัดมารับการรักษาภายใน 7 วัน", message: "INR > 3.0\nตัวเลือกที่ 1: ให้การรักษาอย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่\n" + hemostasisMsg + "\nตัวเลือกที่ 2: ส่ง Consult และนัดมารับการรักษาภายใน 7 วัน", consultBody: true };
          if (ctx.procedure === "midBleed") return { status: "red",   title: "ส่ง Consult นัดมารับการรักษาภายใน 7 วัน", message: "INR > 3.0\nต้องส่งปรึกษาและนัดมารับการรักษาภายใน 7 วัน", consultBody: true };
        }
      }

      if (ctx.proc === "elective") {
        if (a.inrLevel === "leq3") {
          if (ctx.procedure === "noBleed")  return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "INR ≤ 3.0\nสามารถทำหัตถการได้ตามปกติ ไม่จำเป็นต้องหยุดยา Warfarin" };
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
          if (ctx.procedure === "midBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
        } else {
          if (ctx.procedure === "noBleed")  return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "INR > 3.0\nหัตถการประเภทนี้ไม่มีเลือดออก สามารถทำได้ตามปกติ" };
          if (ctx.procedure === "lowBleed") return { status: "red",   title: "ส่ง Consult", message: "INR > 3.0\nต้องส่งปรึกษาก่อนทำหัตถการ", consultBody: true };
          if (ctx.procedure === "midBleed") return { status: "red",   title: "ส่ง Consult", message: "INR > 3.0\nต้องส่งปรึกษาก่อนทำหัตถการ", consultBody: true };
        }
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      const inrTxt = (a.inr === "yes" && a.inrLevel) ? "INR " + (a.inrLevel === "leq3" ? "≤ 3.0" : "> 3.0") : "ยังไม่มีผล INR ภายใน 72 ชั่วโมง";
      return "ผู้ป่วยรับประทานยา Warfarin (" + inrTxt + ") ต้องการทำหัตถการ " + ctx.procedureLabel + " (ประเภทหัตถการ: " + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์ประเมินและพิจารณาปรับยา เพื่อให้ทำหัตถการได้อย่างปลอดภัย";
    }
  },

  /* ---------- โรคไตเรื้อรัง (CKD) ---------- */
  ckd: {
    label: "โรคไตเรื้อรัง (CKD)",
    procedures: [
      {
        value: "noBleed", dot: "🪥",
        label: "หัตถการที่ไม่น่าจะทำให้เกิดเลือดออก (Unlikely to cause bleeding)",
        sub: [
          "การตรวจประเมินสภาพช่องปากและรังสีวินิจฉัย",
          "การฉีดยาชาเฉพาะที่แบบ Infiltration, Intraligamentary หรือ Nerve block",
          "การบูรณะฟัน (อุดฟัน) ที่ขอบวัสดุอยู่เหนือขอบเหงือก",
          "การพิมพ์ปากสำหรับการทำฟันเทียม",
          "การปรับแต่งเครื่องมือจัดฟัน และการใส่ฟันเทียมถอดได้หรือติดแน่น"
        ]
      },
      {
        value: "lowBleed", dot: "🦷",
        label: "หัตถการที่มีความเสี่ยงต่ำ (Low bleeding risk)",
        sub: [
          "การถอนฟันแบบปกติ 1–3 ซี่ ที่คาดว่าจะมีแผลขนาดจำกัด (Simple extractions)",
          "การเจาะระบายหนองภายในช่องปาก (Incision & drainage)",
          "การขูดหินปูนและเกลารากฟัน (Root surface debridement: RSD)",
          "การบูรณะฟันที่มีขอบของวัสดุอยู่ใต้ขอบเหงือก",
          "การตรวจปริทันต์แบบละเอียด (Detailed six-point full periodontal examination)"
        ]
      },
      {
        value: "midBleed", dot: "🔪",
        label: "หัตถการที่มีความเสี่ยงสูงขึ้น (Higher bleeding risk)",
        sub: [
          "การถอนฟันที่ซับซ้อน หรือถอนฟันติดกันหลายซี่ที่ทำให้เกิดแผลขนาดใหญ่",
          "หัตถการศัลยกรรมที่มีการเปิดแผ่นเนื้อเยื่อ (Flap raising procedures)",
          "ศัลยกรรมปริทันต์ (Periodontal surgery) และตัดแต่งขอบเหงือก",
          "การผ่าตัดเพื่อใส่รากฟันเทียม (Dental implant surgery)",
          "การตัดชิ้นเนื้อ (Biopsies) การผ่าตัดเพิ่มความยาวของตัวฟัน และศัลยกรรมปลายรากฟัน"
        ]
      }
    ],
    questions: [
      {
        id: "stage",
        label: "ระดับการทำงานของไต (CKD Stage)",
        type: "chipChoice",
        chipStack: true,
        clears: ["dialysisType", "hdDay"],
        options: [
          { value: "g12", text: "G1–G2 · eGFR ≥ 60 mL/min",       sub: "ไตปกติถึงลดลงเล็กน้อย" },
          { value: "g3",  text: "G3 · eGFR 30–59 mL/min",         sub: "ลดลงปานกลาง" },
          { value: "g4",  text: "G4 · eGFR 15–29 mL/min",         sub: "ลดลงมาก" },
          { value: "g5",  text: "G5 / ล้างไต · eGFR < 15 mL/min", sub: "ไตวาย · Hemodialysis · Peritoneal dialysis" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency"
      },
      {
        id: "dialysisType",
        label: "ชนิดการล้างไต",
        type: "chipChoice",
        chipStack: false,
        clears: ["hdDay"],
        options: [
          { value: "hd",   text: "🔄 Hemodialysis (HD)" },
          { value: "pd",   text: "🟡 Peritoneal Dialysis (PD)" },
          { value: "none", text: "❌ ยังไม่ได้ล้างไต" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && a.stage === "g5"
      },
      {
        id: "hdDay",
        label: "ล้างไตครั้งล่าสุดเมื่อไหร่?",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "today",     text: "🔄 วันนี้เป็นวัน HD / เพิ่งล้างไตมาวันนี้", sub: "heparin ยังออกฤทธิ์อยู่" },
          { value: "yesterday", text: "✅ ล้างไตมาเมื่อวาน",                         sub: "เวลาที่เหมาะที่สุด — heparin หมดฤทธิ์แล้ว" },
          { value: "before",    text: "⏳ ล้างไตมานานกว่า 1 วัน",                    sub: "uremia เพิ่มขึ้น platelet dysfunction มากขึ้น" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && a.stage === "g5" && a.dialysisType === "hd"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่คำนึงถึง stage CKD\n• ห้ามเลือดด้วย local hemostatic agents อย่างเข้มงวด\n• งด NSAIDs ทุกกรณี ใช้ Paracetamol แทน\n• ระวัง AV fistula — ห้ามวัด BP หรือแทงเส้นเลือดที่แขนข้าง fistula\n• ผู้ป่วย HD ที่ล้างไตมาวันเดียวกัน: ระวัง heparin effect ใช้ hemostasis เข้มข้นยิ่งขึ้น\n• เตรียม emergency kit พร้อม · monitor ตลอดหัตถการ"
        };
      }

      const stage = a.stage;
      if (!stage) return { status: null };
      if (!ctx.procedure) return { status: null };

      const proc = ctx.procedure;

      const hemostasisBasic =
        "• พิจารณาเย็บแผลปิดหลังถอนฟัน\n" +
        "• พิจารณาใช้สารห้ามเลือด เช่น Gelfoam, Surgicel\n" +
        "• นัดติดตามอาการ 24–48 ชั่วโมงหลังทำหัตถการ";
      const hemostasisFull =
        "• เย็บแผลปิดหลังถอนฟันทุกครั้ง\n" +
        "• ใช้สารห้ามเลือด Gelfoam + Surgicel\n" +
        "• พิจารณา Tranexamic acid mouthwash\n" +
        "• นัดติดตามอาการ 24 ชั่วโมง";

      const drugMsg = {
        g12: "\n\nยาแก้ปวด: Paracetamol เป็นอันดับแรก\n• NSAIDs: หลีกเลี่ยง — ถ้าจำเป็นใช้ได้ระยะสั้น (≤3 วัน) ขนาดต่ำสุด",
        g3:  "\n\nยาแก้ปวด: Paracetamol ≤4g/วัน เท่านั้น งด NSAIDs\nยาปฏิชีวนะ: ใช้ได้ตามขนาดปกติ",
        g4:  "\n\nยาแก้ปวด: Paracetamol ≤3g/วัน งด NSAIDs และ Tramadol\nยาปฏิชีวนะ: เลือก Clindamycin 300mg q6–8h (ไม่ต้องปรับขนาด)\n  หรือ Amoxicillin 500mg q12h (ลดจาก q8h)",
        g5:  "\n\nยาแก้ปวด: Paracetamol ≤2g/วัน ห่างกัน ≥8 ชม. งด NSAIDs และ Tramadol\nยาปฏิชีวนะ: เลือก Clindamycin หรือ Doxycycline (ไม่ต้องปรับขนาด)\n  หลีกเลี่ยง Amoxicillin — ถ้าจำเป็น: 500mg q24h"
      }[stage];

      const isHD = stage === "g5" && a.dialysisType === "hd";
      const hdNote = isHD
        ? ({ today:     "\n⚠️ ล้างไตมาวันนี้: heparin ยังออกฤทธิ์ ระวังเลือดออกมากกว่าปกติ",
             yesterday: "\n✅ ล้างไตมาเมื่อวาน: เหมาะที่สุดสำหรับทำหัตถการ heparin หมดฤทธิ์แล้ว",
             before:    "\n⚠️ ล้างไตมานานกว่า 1 วัน: uremia เพิ่มขึ้น platelet dysfunction มากขึ้น" }[a.hdDay] || "")
        : "";

      /* G1–G2 */
      if (stage === "g12") {
        return {
          status: "green",
          title: "ให้การรักษาได้ตามปกติ",
          message: "สามารถให้การรักษาทางทันตกรรมได้ตามปกติ" + drugMsg
        };
      }

      /* G3 */
      if (stage === "g3") {
        if (proc === "noBleed") return {
          status: "green", title: "ให้การรักษาได้ตามปกติ",
          message: "สามารถให้การรักษาทางทันตกรรมได้ตามปกติ" + drugMsg
        };
        if (proc === "lowBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "คำแนะนำ\n• Platelet function ลดลงปานกลาง ระวังเลือดออก\n" + hemostasisBasic + drugMsg
        };
        if (proc === "midBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
          message: "คำแนะนำ\n• ห้ามเลือดเฉพาะที่อย่างเข้มงวด\n" + hemostasisBasic + drugMsg
        };
      }

      /* G4 */
      if (stage === "g4") {
        if (proc === "noBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "คำแนะนำ\n• ปรับขนาดยาตามระดับ eGFR ก่อนทำหัตถการ" + drugMsg
        };
        if (proc === "lowBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
          message: "คำแนะนำ\n• Platelet dysfunction มีนัยสำคัญ ห้ามเลือดเข้มข้น\n" + hemostasisFull + drugMsg
        };
        if (proc === "midBleed") {
          if (ctx.proc === "urgency") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก (Urgency — ไม่รอ Consult)",
            message: "คำแนะนำ (รักษาได้เลย เนื่องจากเร่งด่วน)\n• ใช้ hemostatic protocol เต็มรูปแบบ\n" + hemostasisFull + "\n• แจ้งอายุรแพทย์ที่ดูแลให้รับทราบ\n• แนะนำให้ผู้ป่วยกลับมาทันทีหากเลือดออกไม่หยุด" + drugMsg
          };
          return {
            status: "red", title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• ประเมิน platelet function และภาวะเลือดออก\n• อายุรแพทย์อาจพิจารณา Desmopressin (DDAVP) ก่อนทำ\n• นัดทำหัตถการหลังได้รับการประเมินแล้ว" + drugMsg,
            consultBody: true
          };
        }
      }

      /* G5 / Dialysis */
      if (stage === "g5") {
        /* noBleed: รักษาได้เสมอ + note ตาม HD timing */
        if (proc === "noBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "คำแนะนำ\n• ปรับขนาดยาทุกตัวตามระดับ eGFR\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg + hdNote
        };

        /* lowBleed */
        if (proc === "lowBleed") {
          /* ล้างไตมาเมื่อวาน → optimal window → รักษาได้ */
          if (isHD && a.hdDay === "yesterday") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
            message: "คำแนะนำ\n✅ ล้างไตมาเมื่อวาน: เวลาที่เหมาะที่สุดสำหรับทำหัตถการ\n• heparin หมดฤทธิ์แล้ว · platelet function ดีที่สุดหลัง HD\n" + hemostasisFull + "\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg
          };
          /* ล้างไตวันนี้ → heparin active → เลื่อนถ้าทำได้ */
          if (isHD && a.hdDay === "today") {
            if (ctx.proc === "urgency") return {
              status: "amber", title: "ระมัดระวังมาก — heparin ยังออกฤทธิ์ (ถ้าเลื่อนได้ นัดพรุ่งนี้)",
              message: "คำแนะนำ (Urgency)\n⚠️ ล้างไตมาวันนี้ — heparin ยังออกฤทธิ์ เสี่ยงเลือดออกมากกว่าปกติ\n• ถ้าเลื่อนได้: นัดวันพรุ่งนี้จะดีกว่า\n• ถ้าทำทันที: ใช้ hemostasis เข้มข้นเป็นพิเศษ\n" + hemostasisFull + "\n• ระวัง AV fistula" + drugMsg
            };
            return {
              status: "red", title: "แนะนำเลื่อนนัดเป็นวันพรุ่งนี้ (หลัง HD)",
              message: "ควรเลื่อนหัตถการไปวันพรุ่งนี้\n• Heparin ยังออกฤทธิ์ เสี่ยงเลือดออกสูง\n• วันพรุ่งนี้: heparin หมดฤทธิ์ + platelet function ดีที่สุด" + drugMsg
            };
          }
          /* HD other / PD / ยังไม่ได้ล้างไต → Urgency รักษาได้, Elective ส่ง Consult */
          if (ctx.proc === "urgency") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก (Urgency — ไม่รอ Consult)",
            message: "คำแนะนำ (รักษาได้เลย เนื่องจากเร่งด่วน)\n• Platelet dysfunction มีนัยสำคัญ ห้ามเลือดเข้มข้น\n" + hemostasisFull + "\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg + hdNote
          };
          return {
            status: "red", title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• ประเมิน platelet function\n" + (isHD ? "• ประสาน HD team เพื่อนัดทำในวันถัดจากวัน HD\n" : "") + "• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg,
            consultBody: true
          };
        }

        /* midBleed */
        if (proc === "midBleed") {
          /* ล้างไตมาเมื่อวาน → รักษาได้ด้วย full protocol + แจ้งแพทย์ */
          if (isHD && a.hdDay === "yesterday") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก",
            message: "คำแนะนำ\n✅ ล้างไตมาเมื่อวาน: เวลาที่เหมาะที่สุดสำหรับทำหัตถการ\n• ใช้ hemostatic protocol เต็มรูปแบบ\n" + hemostasisFull + "\n• แจ้งอายุรแพทย์ที่ดูแลผู้ป่วยให้รับทราบก่อนทำ\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg
          };
          /* ล้างไตวันนี้ → ไม่เหมาะ */
          if (isHD && a.hdDay === "today") {
            if (ctx.proc === "urgency") return {
              status: "red", title: "พิจารณาส่ง ER / Consult อายุรกรรม",
              message: "HD วันนี้ — heparin ยังออกฤทธิ์ ไม่เหมาะสำหรับหัตถการที่มีเลือดออกมาก\n• ถ้าเลื่อนได้: นัดวันพรุ่งนี้ (หลัง HD)\n• ถ้ารอไม่ได้: ส่ง ER เพื่อรักษาร่วมกับอายุรแพทย์" + drugMsg, consultBody: true
            };
            return {
              status: "red", title: "แนะนำเลื่อนนัดเป็นวันพรุ่งนี้ (หลัง HD)",
              message: "ควรเลื่อนหัตถการไปวันพรุ่งนี้\n• Heparin ยังออกฤทธิ์ ไม่ปลอดภัยสำหรับหัตถการที่มีเลือดออกมาก\n• วันพรุ่งนี้: heparin หมดฤทธิ์ + platelet function ดีที่สุด" + drugMsg
            };
          }
          /* other / PD / ยังไม่ได้ล้างไต → Consult */
          let msg = "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• อาจต้องทำ dialysis ก่อนเพื่อ optimize platelet function\n• พิจารณา Desmopressin (DDAVP) + Tranexamic acid protocol\n• Hemostatic protocol เต็มรูปแบบ";
          if (isHD) msg += "\n• นัดทำในวันถัดจากวัน HD เท่านั้น";
          if (ctx.proc === "urgency") msg += "\n• ถ้ารอ Consult ไม่ได้: พิจารณาส่ง ER เพื่อรักษาร่วมกับอายุรแพทย์\n• นัดมารับการรักษาภายใน 7 วัน";
          return { status: "red", title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ", message: msg + drugMsg, consultBody: true };
        }
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      const stageLabels = {
        g12: "G1–G2 (eGFR ≥ 60 mL/min)",
        g3:  "G3 (eGFR 30–59 mL/min)",
        g4:  "G4 (eGFR 15–29 mL/min)",
        g5:  "G5 / ไตวายระยะสุดท้าย (eGFR < 15 mL/min)"
      };
      const dialysisLabels = { hd: " อยู่ระหว่าง Hemodialysis", pd: " อยู่ระหว่าง Peritoneal dialysis", none: "" };
      const stageTxt = stageLabels[a.stage] || "";
      const dialysisTxt = (a.stage === "g5" && a.dialysisType) ? (dialysisLabels[a.dialysisType] || "") : "";
      return "ผู้ป่วยมีภาวะโรคไตเรื้อรัง CKD " + stageTxt + dialysisTxt + " ต้องการทำหัตถการ " + ctx.procedureLabel + " (ประเภทหัตถการ: " + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์ประเมินภาวะเลือดออกและพิจารณาปรับยาก่อนทำหัตถการ";
    }
  },

  /* ---------- Aspirin ---------- */
  aspirin: {
    label: "Aspirin",
    procedures: [
      {
        value: "noBleed", dot: "🪥",
        label: "หัตถการที่ไม่น่าจะทำให้เกิดเลือดออก (Unlikely to cause bleeding)",
        sub: [
          "การตรวจประเมินสภาพช่องปากและรังสีวินิจฉัย",
          "การฉีดยาชาเฉพาะที่แบบ Infiltration, Intraligamentary หรือ Nerve block",
          "การบูรณะฟัน (อุดฟัน) ที่ขอบวัสดุอยู่เหนือขอบเหงือก",
          "การพิมพ์ปากสำหรับการทำฟันเทียม",
          "การปรับแต่งเครื่องมือจัดฟัน และการใส่ฟันเทียมถอดได้หรือติดแน่น"
        ]
      },
      {
        value: "lowBleed", dot: "🦷",
        label: "หัตถการที่มีความเสี่ยงต่ำ (Low bleeding risk)",
        sub: [
          "การถอนฟันแบบปกติ 1–3 ซี่ ที่คาดว่าจะมีแผลขนาดจำกัด (Simple extractions)",
          "การเจาะระบายหนองภายในช่องปาก (Incision & drainage)",
          "การขูดหินปูนและเกลารากฟัน (Root surface debridement: RSD)",
          "การบูรณะฟันที่มีขอบของวัสดุอยู่ใต้ขอบเหงือก",
          "การตรวจปริทันต์แบบละเอียด (Detailed six-point full periodontal examination)"
        ]
      },
      {
        value: "midBleed", dot: "🔪",
        label: "หัตถการที่มีความเสี่ยงสูงขึ้น (Higher bleeding risk)",
        sub: [
          "การถอนฟันที่ซับซ้อน หรือถอนฟันติดกันหลายซี่ที่ทำให้เกิดแผลขนาดใหญ่",
          "หัตถการศัลยกรรมที่มีการเปิดแผ่นเนื้อเยื่อ (Flap raising procedures)",
          "ศัลยกรรมปริทันต์ (Periodontal surgery) และตัดแต่งขอบเหงือก",
          "การผ่าตัดเพื่อใส่รากฟันเทียม (Dental implant surgery)",
          "การตัดชิ้นเนื้อ (Biopsies) การผ่าตัดเพิ่มความยาวของตัวฟัน และศัลยกรรมปลายรากฟัน"
        ]
      }
    ],
    questions: [
      {
        id: "dose",
        label: "ขนาดยา / ประเภทการใช้ Aspirin",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "low",  text: "Aspirin 81 มก./วัน" },
          { value: "high", text: "Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy", sub: "เช่น Aspirin + Clopidogrel" }
        ]
      }
    ],
    evaluate(a, ctx) {
      if (!a.dose) return { status: null };

      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่หยุดยา\n• ห้ามเลือดด้วย local hemostatic agent\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกหลังทำหัตถการ"
        };
      }

      if (!ctx.procedure) return { status: null };

      if (a.dose === "low") {
        if (ctx.procedure === "noBleed") return {
          status: "green",
          title: "ให้การรักษาได้ตามปกติ",
          message: "ผู้ป่วยรับประทาน Aspirin 81 มก./วัน\nสามารถทำหัตถการได้ตามปกติ ไม่จำเป็นต้องหยุดยา"
        };
        if (ctx.procedure === "lowBleed") return {
          status: "amber",
          title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "ผู้ป่วยรับประทาน Aspirin 81 มก./วัน\nคำแนะนำ\n• ไม่จำเป็นต้องหยุดยา\n• ระมัดระวังการห้ามเลือดระหว่างและหลังทำหัตถการ\n• ใช้ local hemostatic agent เช่น การกัดผ้าก๊อซ"
        };
        if (ctx.procedure === "midBleed") return {
          status: "amber",
          title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
          message: "ผู้ป่วยรับประทาน Aspirin 81 มก./วัน\nคำแนะนำ\n• ไม่จำเป็นต้องหยุดยา\n• พิจารณาเย็บแผลปิดหลังถอนฟัน\n• พิจารณาใช้สารห้ามเลือด เช่น Gelfoam, Surgicel\n• นัดติดตามอาการหลังทำหัตถการ"
        };
      }

      if (a.dose === "high") {
        if (ctx.procedure === "noBleed") return {
          status: "green",
          title: "ให้การรักษาได้ตามปกติ",
          message: "ผู้ป่วยรับประทาน Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy\nสามารถทำหัตถการได้ตามปกติ ไม่จำเป็นต้องหยุดยา"
        };
        if (ctx.procedure === "lowBleed") return {
          status: "amber",
          title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
          message: "ผู้ป่วยรับประทาน Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy\nคำแนะนำ\n• ไม่จำเป็นต้องหยุดยา\n• พิจารณาเย็บแผลปิดหลังถอนฟัน\n• พิจารณาใช้สารห้ามเลือด เช่น Gelfoam, Surgicel"
        };
        if (ctx.procedure === "midBleed") {
          if (ctx.proc === "elective") return {
            status: "amber",
            title: "เลื่อนการรักษาออกไปก่อน",
            message: "ผู้ป่วยรับประทาน Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy\nแนะนำเลื่อนหัตถการออกไปก่อน จนกว่าแพทย์จะปรับยาเหลือ 81 มก./วัน หรือ antiplatelet ตัวเดียว\n• ประสานแพทย์ผู้รักษาเพื่อพิจารณาปรับยา\n• นัดทำหัตถการใหม่หลังปรับยาแล้ว"
          };
          return {
            status: "red",
            title: "ส่งปรึกษาอายุรกรรม และนัดรับบริการภายใน 7 วัน",
            message: "ผู้ป่วยรับประทาน Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy\nต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและพิจารณาปรับยาก่อนทำหัตถการ\n• นัดผู้ป่วยมารับบริการภายใน 7 วัน",
            consultBody: true
          };
        }
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      const doseTxt = a.dose === "low"
        ? "Aspirin 81 มก./วัน"
        : "Aspirin 325 มก./วัน / Dual antiplatelet therapy";
      return "ผู้ป่วยรับประทานยา " + doseTxt + " ต้องการทำหัตถการ " + ctx.procedureLabel + " (ประเภทหัตถการ: " + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์ประเมินและพิจารณาปรับยาก่อนทำหัตถการ";
    }
  },

  /* ---------- DOACs / NOACs ---------- */
  doac: {
    label: "DOACs / NOACs",
    procedures: [
      { value: "noBleed",  dot: "🪥", label: "ไม่มีเลือดออก / เลือดออกน้อยมาก",     sub: "เช่น อุดฟัน, รักษาคลองรากฟัน" },
      { value: "lowBleed", dot: "🦷", label: "เสี่ยงเลือดออกน้อย",                   sub: "เช่น ขูดหินปูน, ถอนฟัน 1–3 ซี่, ผ่าระบายหนอง" },
      { value: "midBleed", dot: "🔪", label: "เสี่ยงเลือดออกสูงขึ้น",                sub: "เช่น ถอนฟัน > 3 ซี่, ผ่าฟันคุด, รากฟันเทียม, ศัลยกรรมปริทันต์" }
    ],
    questions: [
      {
        id: "drug",
        label: "ชนิดยา DOACs ที่ผู้ป่วยใช้",
        type: "chipChoice",
        chipStack: true,
        clears: ["renal", "doseTiming"],
        options: [
          { value: "dabigatran",  text: "Dabigatran (Pradaxa®)",   sub: "วันละ 2 ครั้ง" },
          { value: "apixaban",    text: "Apixaban (Eliquis®)",     sub: "วันละ 2 ครั้ง" },
          { value: "rivaroxaban", text: "Rivaroxaban (Xarelto®)",  sub: "วันละ 1 ครั้ง" },
          { value: "edoxaban",    text: "Edoxaban (Lixiana®)",     sub: "วันละ 1 ครั้ง" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && ctx.procedure === "midBleed"
      },
      {
        id: "renal",
        label: "ผู้ป่วยมีประวัติโรคไตเรื้อรัง หรือทราบว่า CrCl < 50 ml/min หรือไม่?",
        type: "chipChoice",
        chipStack: false,
        options: [
          { value: "yes", text: "⚠️ มี / CrCl < 50 ml/min", sub: "โรคไตเรื้อรัง หรือค่าไตบกพร่อง" },
          { value: "no",  text: "✅ ไม่มี / ไม่ทราบ" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && a.drug === "dabigatran" && ctx.procedure === "midBleed"
      },
      {
        id: "doseTiming",
        label: "ผู้ป่วยรับประทานยา DOACs มื้อใด?",
        type: "chipChoice",
        chipStack: false,
        options: [
          { value: "morning", text: "🌅 มื้อเช้า" },
          { value: "evening", text: "🌙 มื้อเย็น" }
        ],
        showIf: (a, ctx) => ctx.proc !== "emergency" && (a.drug === "rivaroxaban" || a.drug === "edoxaban") && ctx.procedure === "midBleed"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันที โดยไม่หยุดยา DOACs\n• ห้ามเลือดด้วย local hemostatic agent อย่างเข้มงวด\n  – ใส่ฟองน้ำห้ามเลือด (Gelfoam® หรือ Surgicel®) ในเบ้าฟัน\n  – เย็บแผลปิดให้แน่น\n  – พิจารณาใช้น้ำยาบ้วนปาก Tranexamic acid 5%\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกอย่างใกล้ชิดระหว่างและหลังทำหัตถการ"
        };
      }

      if (!ctx.procedure) return { status: null };

      const hemostasisMsg = "การห้ามเลือดเฉพาะที่\n• ใส่ฟองน้ำห้ามเลือด (Gelfoam® หรือ Surgicel®) ในเบ้าฟัน\n• เย็บแผลปิดหลังทำหัตถการ\n• พิจารณาใช้น้ำยาบ้วนปาก Tranexamic acid 5% วันละ 4 ครั้ง นาน 2–7 วัน\n• นัดติดตามอาการ 1–2 วัน";

      if (ctx.procedure === "noBleed") {
        return {
          status: "green",
          title: "ให้การรักษาได้ตามปกติ ไม่ต้องปรับยา",
          message: "หัตถการประเภทนี้ไม่มีความเสี่ยงเลือดออกที่มีนัยสำคัญ\nสามารถให้การรักษาได้ตามปกติ ไม่จำเป็นต้องหยุดหรือปรับยา DOACs"
        };
      }

      if (ctx.procedure === "lowBleed") {
        return {
          status: "amber",
          title: "ให้การรักษาได้ ไม่ต้องปรับยา DOACs",
          message: "ไม่จำเป็นต้องหยุดหรือปรับยา DOACs\nคำแนะนำ\n" + hemostasisMsg
        };
      }

      if (ctx.procedure === "midBleed") {
        if (!a.drug) return { status: null };

        if (a.drug === "dabigatran") {
          if (!a.renal) return { status: null };
          if (a.renal === "yes") {
            return {
              status: "red",
              title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
              message: "ผู้ป่วยใช้ยา Dabigatran และมีภาวะการทำงานของไตบกพร่อง (CrCl < 50 ml/min)\nยาอาจคั่งในร่างกายนานกว่าปกติ ต้องให้อายุรแพทย์ประเมินและกำหนดแผนการปรับยาก่อนนัดทำหัตถการ",
              consultBody: true
            };
          }
          return {
            status: "red",
            title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ผู้ป่วยใช้ยา Dabigatran (วันละ 2 ครั้ง)\nต้องการงดยามื้อเช้าในวันทำหัตถการ แต่ทันตแพทย์ไม่สามารถสั่งปรับยาเองได้\nกรุณาส่งปรึกษาแพทย์ผู้ดูแลเพื่อขออนุมัติก่อน\n\nแผนที่จะขอความเห็นชอบ\n• งดยา Dabigatran มื้อเช้าวันทำหัตถการ\n• นัดทำหัตถการตอนเช้า\n• รับประทานยามื้อเย็นตามปกติหลังเลือดหยุดสนิทแล้วอย่างน้อย 4 ชั่วโมง\n  (ไม่ต้องรับประทานมื้อเช้าที่ข้ามไปชดเชย)",
            consultBody: true
          };
        }

        if (a.drug === "apixaban") {
          return {
            status: "red",
            title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ผู้ป่วยใช้ยา Apixaban (วันละ 2 ครั้ง)\nต้องการงดยามื้อเช้าในวันทำหัตถการ แต่ทันตแพทย์ไม่สามารถสั่งปรับยาเองได้\nกรุณาส่งปรึกษาแพทย์ผู้ดูแลเพื่อขออนุมัติก่อน\n\nแผนที่จะขอความเห็นชอบ\n• งดยา Apixaban มื้อเช้าวันทำหัตถการ\n• นัดทำหัตถการตอนเช้า\n• รับประทานยามื้อเย็นตามปกติหลังเลือดหยุดสนิทแล้วอย่างน้อย 4 ชั่วโมง\n  (ไม่ต้องรับประทานมื้อเช้าที่ข้ามไปชดเชย)",
            consultBody: true
          };
        }

        if (a.drug === "rivaroxaban" || a.drug === "edoxaban") {
          if (!a.doseTiming) return { status: null };
          const drugName = a.drug === "rivaroxaban" ? "Rivaroxaban" : "Edoxaban";
          if (a.doseTiming === "morning") {
            return {
              status: "red",
              title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
              message: "ผู้ป่วยใช้ยา " + drugName + " (วันละ 1 ครั้ง มื้อเช้า)\nต้องการเลื่อนยามื้อเช้าออกไปหลังทำหัตถการ แต่ทันตแพทย์ไม่สามารถสั่งปรับยาเองได้\nกรุณาส่งปรึกษาแพทย์ผู้ดูแลเพื่อขออนุมัติก่อน\n\nแผนที่จะขอความเห็นชอบ\n• เลื่อนยา " + drugName + " มื้อเช้าออกไปก่อน\n• นัดทำหัตถการตอนเช้า\n• รับประทานยามื้อนั้นหลังเลือดหยุดสนิทแล้วอย่างน้อย 4 ชั่วโมง",
              consultBody: true
            };
          }
          return {
            status: "amber",
            title: "ไม่ต้องปรับยา " + drugName + " นัดทำหัตถการตอนเช้า",
            message: "ผู้ป่วยใช้ยา " + drugName + " (วันละ 1 ครั้ง มื้อเย็น)\nไม่จำเป็นต้องปรับเปลี่ยนตารางยาใดๆ\nคำแนะนำ\n• นัดทำหัตถการตอนเช้า ซึ่งเป็นช่วงที่ระดับยาในเลือดต่ำสุด (Trough level)\n• ให้ผู้ป่วยรับประทานยามื้อเย็นตามปกติ\n" + hemostasisMsg
          };
        }
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      const drugNames = {
        dabigatran:  "Dabigatran (Pradaxa®)",
        apixaban:    "Apixaban (Eliquis®)",
        rivaroxaban: "Rivaroxaban (Xarelto®)",
        edoxaban:    "Edoxaban (Lixiana®)"
      };
      const drugTxt = drugNames[a.drug] || "DOACs";

      if (a.drug === "dabigatran" && a.renal === "yes") {
        return "ผู้ป่วยรับประทานยา " + drugTxt + " และมีภาวะการทำงานของไตบกพร่อง (CrCl < 50 ml/min) ต้องการทำหัตถการ " + ctx.procedureLabel + " (" + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์ประเมินและให้คำแนะนำการบริหารยาก่อนนัดทำหัตถการ";
      }

      const isBD = a.drug === "dabigatran" || a.drug === "apixaban";
      if (isBD) {
        return "ผู้ป่วยรับประทานยา " + drugTxt + " (วันละ 2 ครั้ง) ต้องการทำหัตถการ " + ctx.procedureLabel + " (" + PROC_LABELS[ctx.proc] + ") ซึ่งมีความเสี่ยงเลือดออกสูงขึ้น ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์พิจารณาอนุมัติการงดยามื้อเช้าในวันทำหัตถการ และให้กลับมารับประทานยามื้อเย็นหลังเลือดหยุดสนิทแล้วอย่างน้อย 4 ชั่วโมง";
      }

      const drugName = a.drug === "rivaroxaban" ? "Rivaroxaban" : "Edoxaban";
      return "ผู้ป่วยรับประทานยา " + drugTxt + " (วันละ 1 ครั้ง มื้อเช้า) ต้องการทำหัตถการ " + ctx.procedureLabel + " (" + PROC_LABELS[ctx.proc] + ") ซึ่งมีความเสี่ยงเลือดออกสูงขึ้น ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์พิจารณาอนุมัติการเลื่อนยา " + drugName + " มื้อเช้าออกไปรับประทานหลังเลือดหยุดสนิทแล้วอย่างน้อย 4 ชั่วโมง";
    }
  }
};