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
          return { status: "red", title: "ส่งปรึกษาอายุรกรรม", message: "ต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและควบคุมความดันก่อนทำหัตถการ", consultBody: true };
        }
        if (g === "4") {
          if (!a.atod) return { status: null };
          if (a.atod === "yes") return { status: "red", title: "ส่งห้องฉุกเฉินทันที (Hypertensive emergency)", message: "งดทำหัตถการ และนำส่งห้องฉุกเฉินทันที" };
          return { status: "red", title: "ส่งปรึกษาอายุรกรรม", message: "ต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและควบคุมความดันก่อนทำหัตถการ", consultBody: true };
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
    questions: [
      { id: "inr", label: "มีผล INR ภายใน 72 ชั่วโมงหรือไม่?", type: "choice", clears: ["inrValue"], options: [ { value: "yes", text: "✅ มีผล INR" }, { value: "no",  text: "❌ ไม่มีผล INR" } ] },
      { id: "inrValue", label: "ค่าผล INR ล่าสุด", type: "number", placeholder: "เช่น 2.5", showIf: (a) => a.inr === "yes" }
    ],
    evaluate(a) {
      if (!a.inr) return { status: null };
      if (a.inr === "no") return { status: "red", title: "ต้องส่ง Consult", message: "ไม่มีผล INR ภายใน 72 ชั่วโมง ต้องส่งปรึกษาเพื่อประเมินและตรวจ INR ก่อนทำหัตถการ", consultBody: true };
      const v = a.inrValue;
      if (v === undefined || v === null || v === "") return { status: null };
      const inr = parseFloat(v);
      if (isNaN(inr)) return { status: null };
      if (inr <= 3.0) return { status: "green", title: "สามารถทำหัตถการได้", message: "ผล INR = " + inr.toFixed(1) + " (≤ 3.0) สามารถทำหัตถการได้ตามปกติ ห้ามเลือดด้วย Local hemostatic agent" };
      return { status: "red", title: "ต้องส่ง Consult", message: "ผล INR = " + inr.toFixed(1) + " (> 3.0) ต้องส่งปรึกษาเพื่อประเมินและปรับยาก่อนทำหัตถการ", consultBody: true };
    },
    buildConsult(a, ctx) {
      const inrTxt = (a.inr === "yes" && a.inrValue) ? "ผล INR ล่าสุด = " + parseFloat(a.inrValue).toFixed(1) : "ยังไม่มีผล INR ภายใน 72 ชั่วโมง";
      return "ผู้ป่วยรับประทานยา Warfarin (" + inrTxt + ") ต้องการทำหัตถการ " + ctx.procedureLabel + " ขอความอนุเคราะห์ประเมินและพิจารณาปรับยา เพื่อให้ทำหัตถการได้อย่างปลอดภัย";
    }
  },

  /* ---------- Aspirin ---------- */
  aspirin: {
    label: "Aspirin",
    procedures: [
      { value: "noBleed",  dot: "🪥", label: "ไม่มีเลือดออก / เลือดออกน้อยมาก", sub: "เช่น อุดฟัน, รักษาคลองรากฟัน" },
      { value: "lowBleed", dot: "🦷", label: "เสี่ยงเลือดออกน้อย", sub: "เช่น ขูดหินปูนเหนือเหงือก, ถอนฟัน ≤ 2 ซี่" },
      { value: "midBleed", dot: "🔪", label: "เสี่ยงเลือดออกปานกลาง", sub: "เช่น ถอนฟัน > 2 ซี่, การผ่าฟันคุด" }
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
        if (ctx.procedure === "midBleed") return {
          status: "red",
          title: "ส่งปรึกษาอายุรกรรม",
          message: "ผู้ป่วยรับประทาน Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy\nต้องส่งปรึกษาอายุรกรรมเพื่อประเมินและพิจารณาปรับยาก่อนทำหัตถการ",
          consultBody: true
        };
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