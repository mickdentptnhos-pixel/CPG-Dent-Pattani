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
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง หรือ ส่ง Consult นัดทำหัตถการใหม่", message: "INR > 3.0\nตัวเลือกที่ 1: ให้การรักษาอย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่\n" + hemostasisMsg + "\nตัวเลือกที่ 2: ส่ง Consult และนัดทำหัตถการใหม่ภายใน 2-3 วันทำการ", consultBody: true };
          if (ctx.procedure === "midBleed") return { status: "red",   title: "ส่ง Consult นัดทำหัตถการใหม่ภายใน 2-3 วันทำการ", message: "INR > 3.0\nต้องส่งปรึกษาและนัดทำหัตถการใหม่ภายใน 2-3 วันทำการ", consultBody: true };
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
      { value: "noBleed",  dot: "🪥", label: "ไม่มีเลือดออก / เลือดออกน้อยมาก", sub: "เช่น อุดฟัน, รักษาคลองรากฟัน, ขูดหินปูน" },
      { value: "lowBleed", dot: "🦷", label: "เสี่ยงเลือดออกน้อย", sub: "เช่น ถอนฟัน ≤ 2 ซี่, ขูดหินปูนใต้เหงือก" },
      { value: "midBleed", dot: "🔪", label: "เสี่ยงเลือดออกปานกลาง", sub: "เช่น ถอนฟัน > 2 ซี่, การผ่าฟันคุด, ผ่าตัดเล็กในช่องปาก" }
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
        label: "วันนี้เป็นวันล้างไต (HD) หรือไม่?",
        type: "chipChoice",
        chipStack: false,
        options: [
          { value: "yes", text: "✅ วันนี้เป็นวัน HD / เพิ่งล้างไตมาวันนี้" },
          { value: "no",  text: "❌ วันนี้ไม่ใช่วัน HD" }
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
        ? (a.hdDay === "yes"
            ? "\n⚠️ ล้างไตมาวันนี้: heparin ยังออกฤทธิ์ ระวังเลือดออกมากกว่าปกติ"
            : "\n✅ วันนี้ไม่ใช่วัน HD: เหมาะสำหรับทำหัตถการ")
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
        if (proc === "noBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "คำแนะนำ\n• ปรับขนาดยาทุกตัวตามระดับ eGFR\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg + hdNote
        };
        if (proc === "lowBleed") {
          if (ctx.proc === "urgency") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก (Urgency — ไม่รอ Consult)",
            message: "คำแนะนำ (รักษาได้เลย เนื่องจากเร่งด่วน)\n• Platelet dysfunction มีนัยสำคัญ ห้ามเลือดเข้มข้น\n" + hemostasisFull + "\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg + hdNote
          };
          return {
            status: "red", title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• ประเมิน platelet function\n• ประสาน HD team เพื่อนัดทำในวันถัดจากวัน HD\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg,
            consultBody: true
          };
        }
        if (proc === "midBleed") {
          let msg = "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• อาจต้องทำ dialysis ก่อนเพื่อ optimize platelet function\n• พิจารณา Desmopressin (DDAVP) + Tranexamic acid protocol\n• Hemostatic protocol เต็มรูปแบบ";
          if (a.dialysisType === "hd") msg += "\n• นัดทำในวันถัดจากวัน HD เท่านั้น (ไม่ใช่วัน HD)";
          if (ctx.proc === "urgency") msg += "\n• ถ้ารอ Consult ไม่ได้: พิจารณาส่ง ER เพื่อรักษาร่วมกับอายุรแพทย์";
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
  }
};