/* =====================================================================
   ป้ายกำกับตัวเลือก (ใช้ในผลลัพธ์ + ใบ Consult)
   ===================================================================== */
const PROC_LABELS = {
  emergency: "Emergency (ฉุกเฉิน)",
  urgency:   "Urgency (เร่งด่วน)",
  elective:  "Elective (นัดล่วงหน้า)"
};

/* คำอธิบายความเร่งด่วน — แสดงเป็น tooltip เมื่อชี้ที่ตัวเลือก */
const PROC_TOOLTIPS = {
  emergency: {
    head: "Emergency (ฉุกเฉิน)",
    body: `ภาวะเจ็บป่วยที่อาจก่อให้เกิดอันตรายต่อชีวิต และจำเป็นต้องได้รับการรักษาอย่างทันท่วงที ได้แก่:<ul>
      <li>เลือดออกภายในช่องปากที่ควบคุมไม่ได้</li>
      <li>การอักเสบติดเชื้อที่ทำให้เนื้อเยื่ออ่อนภายในหรือภายนอกช่องปากบวม จนอาจเป็นอันตรายต่อชีวิต</li>
      <li>อุบัติเหตุบริเวณใบหน้าที่อาจขัดขวางการหายใจ</li>
    </ul>`
  },
  urgency: {
    head: "Urgency (เร่งด่วน)",
    body: `คือภาวะเจ็บป่วยที่ควรได้รับการรักษาโดยไม่ล่าช้า เช่น:<ul>
      <li><b>อาการปวด:</b> ปวดฟัน, ปวดฟันคุด หรือปวดจากกระดูกเบ้าฟันอักเสบภายหลังถอนฟัน</li>
      <li><b>การติดเชื้อ:</b> การมีหนองภายในหรือภายนอกช่องปาก</li>
      <li><b>อุบัติเหตุเกี่ยวกับฟัน:</b> ฟันหัก, ฟันหลุด หรือฟันเคลื่อนจากอุบัติเหตุ</li>
      <li><b>ปัญหาจากงานที่อยู่ระหว่างรักษา:</b> วัสดุอุดฟันชั่วคราวหลุดระหว่างรักษาคลองรากฟัน, ครอบฟันชั่วคราวหลุด, ฟันเทียมหักหรือทำให้เจ็บ, อุปกรณ์จัดฟันผิดปกติจนเนื้อเยื่ออ่อนบาดเจ็บ</li>
      <li><b>การเตรียมช่องปากก่อนรักษาทางการแพทย์ที่รอไม่ได้:</b> เช่น ก่อนรักษามะเร็งศีรษะและลำคอ, การผ่าตัดเปลี่ยนอวัยวะ หรือการปลูกถ่ายไขกระดูก</li>
    </ul>`
  }
};

/* =====================================================================
   คำถามที่ใช้ร่วมกันหลาย Problem
   — แต่ละ Problem เรียงลำดับคำถามเองใน questions[] จะใส่หรือไม่ใส่
     คำถามเหล่านี้ก็ได้ และจะวางไว้ตำแหน่งใดก็ได้
   ===================================================================== */

/* คำถามความเร่งด่วนของหัตถการ */
const PROC_QUESTION = {
  id: "proc",
  label: "เลือกความเร่งด่วนของหัตถการ",
  type: "chipChoice",
  clears: "*",              /* เปลี่ยนความเร่งด่วน → ล้างคำตอบอื่นทั้งหมด */
  tooltips: PROC_TOOLTIPS,
  options: [
    { value: "emergency", dot: "🚑", text: "Emergency" },
    { value: "urgency",   dot: "⏱️", text: "Urgency" },
    { value: "elective",  dot: "🗓️", text: "Elective" }
  ]
};

/* คำถามเลือกหัตถการตามความเสี่ยงเลือดออก (Warfarin / CKD / Aspirin / DOACs) */
const BLEED_PROCEDURE_QUESTION = {
  id: "procedure",
  label: "เลือกหัตถการ",
  type: "chipChoice",
  chipStack: true,
  showIf: (a) => a.proc && a.proc !== "emergency",
  options: [
    {
      value: "noBleed", dot: "🪥",
      text: "หัตถการที่ไม่น่าจะทำให้เกิดเลือดออก (Unlikely to cause bleeding)",
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
      text: "หัตถการที่มีความเสี่ยงต่ำ (Low bleeding risk)",
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
      text: "หัตถการที่มีความเสี่ยงสูงขึ้น (Higher bleeding risk)",
      sub: [
        "การถอนฟันที่ซับซ้อน หรือถอนฟันติดกันหลายซี่ที่ทำให้เกิดแผลขนาดใหญ่",
        "หัตถการศัลยกรรมที่มีการเปิดแผ่นเนื้อเยื่อ (Flap raising procedures)",
        "ศัลยกรรมปริทันต์ (Periodontal surgery) และตัดแต่งขอบเหงือก",
        "การผ่าตัดเพื่อใส่รากฟันเทียม (Dental implant surgery)",
        "การตัดชิ้นเนื้อ (Biopsies) การผ่าตัดเพิ่มความยาวของตัวฟัน และศัลยกรรมปลายรากฟัน"
      ]
    }
  ]
};

/* =====================================================================
   โครงสร้าง Problem List
   ===================================================================== */
const PROBLEMS = {
  /* ---------- ความดันโลหิตสูง ---------- */
  ht: {
    label: "ความดันโลหิตสูง",
    HT_PROC_LABEL: {
      simple:  "หัตถการไม่ซับซ้อน เจ็บน้อย ผู้ป่วยมีความกลัวต่ำ",
      painful: "หัตถการที่มีความเจ็บปวด ผู้ป่วยมีความกลัวมาก"
    },
    questions: [
      PROC_QUESTION,
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
        return { status: "green", title: "ให้การรักษาทันที", message: "คำแนะนำ\n• วัดความดันโลหิตทุก 15 นาทีระหว่างทำหัตถการ\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการตลอดหัตถการ เช่น ปวดหัวรุนแรง แน่นหน้าอก ตามัว แขนขาอ่อนแรง\n• พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด และพิจารณา Admit เป็นผู้ป่วยใน" };
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
    questions: [
      PROC_QUESTION,
      BLEED_PROCEDURE_QUESTION,
      {
        id: "inr",
        label: "มีผล INR ภายใน 72 ชั่วโมงหรือไม่?",
        type: "choice",
        clears: ["inrLevel"],
        options: [
          { value: "yes", text: "✅ มีผล INR" },
          { value: "no",  text: "❌ ไม่มีผล INR" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure && a.procedure !== "noBleed"
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
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure && a.procedure !== "noBleed" && a.inr === "yes"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่หยุดยา Warfarin\n• ห้ามเลือดด้วย local hemostatic agent อย่างเข้มงวด\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกอย่างใกล้ชิดระหว่างและหลังทำหัตถการ\n• พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด และพิจารณา Admit เป็นผู้ป่วยใน"
        };
      }

      if (!ctx.procedure) return { status: null };

      if (ctx.procedure === "noBleed") {
        return { status: "green", title: "ให้การรักษาได้ตามปกติ", message: "หัตถการประเภทนี้ไม่น่าจะทำให้เกิดเลือดออก สามารถให้การรักษาได้โดยไม่จำเป็นต้องตรวจผล INR\n• ไม่จำเป็นต้องหยุดยา Warfarin" };
      }

      if (!a.inr) return { status: null };

      if (a.inr === "no") {
        if (ctx.proc === "urgency") return { status: "red",   title: "ต้องตรวจ INR ก่อนทำหัตถการ", message: "ผู้ป่วยไม่มีผล INR ภายใน 72 ชั่วโมง ให้ส่งตรวจ INR ก่อน แล้วประเมินซ้ำตามผลที่ได้" };
        if (ctx.proc === "elective") return { status: "amber", title: "แนะนำตรวจ INR ก่อนนัดทำหัตถการ", message: "ผู้ป่วยไม่มีผล INR ภายใน 72 ชั่วโมง แนะนำให้ตรวจ INR ก่อน แล้วนัดทำหัตถการใหม่" };
      }

      if (!a.inrLevel) return { status: null };

      const hemostasisMsg = "• ไม่จำเป็นต้องหยุดยา Warfarin\n• ระมัดระวังการห้ามเลือดระหว่างและหลังทำหัตถการ\n• พิจารณาเย็บแผลปิดหลังทำหัตถการ\n• พิจารณาใช้สารห้ามเลือด เช่น Gelfoam, Surgicel\n• นัดติดตามอาการหลังทำหัตถการ";

      if (ctx.proc === "urgency") {
        if (a.inrLevel === "leq3") {
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
          if (ctx.procedure === "midBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
        } else {
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง หรือ ส่ง Consult นัดมารับการรักษาภายใน 7 วัน", message: "INR > 3.0\nตัวเลือกที่ 1: ให้การรักษาอย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่\n" + hemostasisMsg + "\nตัวเลือกที่ 2: ส่ง Consult และนัดมารับการรักษาภายใน 7 วัน", consultBody: true };
          if (ctx.procedure === "midBleed") return { status: "red",   title: "ส่ง Consult นัดมารับการรักษาภายใน 7 วัน", message: "INR > 3.0\nต้องส่งปรึกษาและนัดมารับการรักษาภายใน 7 วัน", consultBody: true };
        }
      }

      if (ctx.proc === "elective") {
        if (a.inrLevel === "leq3") {
          if (ctx.procedure === "lowBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
          if (ctx.procedure === "midBleed") return { status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่", message: "INR ≤ 3.0\nคำแนะนำ\n" + hemostasisMsg };
        } else {
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
    questions: [
      PROC_QUESTION,
      BLEED_PROCEDURE_QUESTION,
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
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure
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
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure && a.stage === "g5"
      },
      {
        id: "hdDay",
        label: "ล้างไตครั้งล่าสุดเมื่อไหร่?",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "yesterday", text: "✅ ล้างไตมาเมื่อวาน",       sub: "เวลาที่เหมาะที่สุด — heparin หมดฤทธิ์แล้ว" },
          { value: "other",     text: "⏳ วันอื่น (วันนี้ หรือนานกว่า 1 วันแล้ว)", sub: "แนะนำเลื่อนมาวันหลังจากล้างไต 1 วัน" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure && a.stage === "g5" && a.dialysisType === "hd"
      }
    ],
    evaluate(a, ctx) {
      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่คำนึงถึง stage CKD\n• ห้ามเลือดด้วย local hemostatic agents อย่างเข้มงวด\n• งด NSAIDs ทุกกรณี ใช้ Paracetamol แทน\n• ระวัง AV fistula — ห้ามวัด BP หรือแทงเส้นเลือดที่แขนข้าง fistula\n• ผู้ป่วย HD ที่ล้างไตมาวันเดียวกัน: ระวัง heparin effect ใช้ hemostasis เข้มข้นยิ่งขึ้น\n• เตรียม emergency kit พร้อม · monitor ตลอดหัตถการ\n• พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด และพิจารณา Admit เป็นผู้ป่วยใน"
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
        g12: "\n\nยาแก้ปวด: Paracetamol ขนาดปกติ (≤4g/วัน) เป็นอันดับแรก\n• NSAIDs: หลีกเลี่ยง — ถ้าจำเป็นใช้ได้ระยะสั้น (≤3 วัน) ขนาดต่ำสุด",
        g3:  "\n\nยาแก้ปวด: Paracetamol ขนาดปกติ (≤4g/วัน) งด NSAIDs\nยาปฏิชีวนะ: ใช้ได้ตามขนาดปกติ",
        g4:  "\n\nยาแก้ปวด: Paracetamol ขนาดปกติ (≤4g/วัน) งด NSAIDs และ Tramadol\nยาปฏิชีวนะ: เลือก Clindamycin 300mg q6–8h (ไม่ต้องปรับขนาด)\n  หรือ Amoxicillin 500mg q12h (ลดจาก q8h)",
        g5:  "\n\nยาแก้ปวด: Paracetamol ขนาดปกติได้ แต่ยืดช่วงห่างเป็น q8h (≤3g/วัน) งด NSAIDs และ Tramadol\nยาปฏิชีวนะ: เลือก Clindamycin หรือ Doxycycline (ไม่ต้องปรับขนาด)\n  หลีกเลี่ยง Amoxicillin — ถ้าจำเป็น: 500mg q24h"
      }[stage];

      const isHD = stage === "g5" && a.dialysisType === "hd";

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
        if (!a.dialysisType) return { status: null };
        if (a.dialysisType === "hd" && !a.hdDay) return { status: null };

        /* noBleed: ไม่มีเลือดออก → HD timing ไม่เกี่ยว ทำได้ทุกวัน */
        if (proc === "noBleed") return {
          status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง",
          message: "คำแนะนำ\n• ปรับขนาดยาทุกตัวตามระดับ eGFR" +
            (isHD ? "\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula\n• ทำได้ทุกวัน ไม่ต้องรอวันหลัง HD (หัตถการไม่มีเลือดออก)" : "") +
            drugMsg
        };

        /* lowBleed */
        if (proc === "lowBleed") {
          /* ล้างไตมาเมื่อวาน → optimal window → รักษาได้ */
          if (isHD && a.hdDay === "yesterday") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
            message: "คำแนะนำ\n✅ ล้างไตมาเมื่อวาน: เวลาที่เหมาะที่สุดสำหรับทำหัตถการ\n• heparin หมดฤทธิ์แล้ว · platelet function ดีที่สุดหลัง HD\n" + hemostasisFull + "\n• ระวัง AV fistula — ห้ามวัด BP ที่แขนข้าง fistula" + drugMsg
          };
          /* HD วันอื่น (วันนี้ หรือนานกว่า 1 วัน) → เลื่อนมาวันหลัง HD */
          if (isHD && a.hdDay === "other") return {
            status: "red", title: "แนะนำให้มารับการรักษาวันหลังจากล้างไต 1 วัน",
            message: "• แนะนำให้ผู้ป่วยมารับการรักษาในวันถัดจากวัน HD ครั้งต่อไป\n  (วันนั้น heparin หมดฤทธิ์แล้ว + platelet function ดีที่สุด)\n• ระหว่างรอ: ให้ยาแก้ปวด / ยาปฏิชีวนะตามอาการได้" + drugMsg
          };
          /* PD + lowBleed → รักษาได้ทุกวัน ไม่มี heparin concern */
          if (a.dialysisType === "pd") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวัง ร่วมกับการห้ามเลือดเฉพาะที่",
            message: "คำแนะนำ\n• ไม่มีข้อจำกัดด้านวันนัด (PD ไม่ใช้ heparin)\n" + hemostasisFull + drugMsg
          };
          /* ยังไม่ได้ล้างไต → Urgency รักษาได้, Elective ส่ง Consult */
          if (ctx.proc === "urgency") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก (Urgency — ไม่รอ Consult)",
            message: "คำแนะนำ (รักษาได้เลย เนื่องจากเร่งด่วน)\n• Platelet dysfunction มีนัยสำคัญ ห้ามเลือดเข้มข้น\n" + hemostasisFull + drugMsg
          };
          return {
            status: "red", title: "ส่งปรึกษาอายุรกรรมก่อนทำหัตถการ",
            message: "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• ประเมิน platelet function" + drugMsg,
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
          /* HD วันอื่น (วันนี้ หรือนานกว่า 1 วัน) → เลื่อนมาวันหลัง HD */
          if (isHD && a.hdDay === "other") return {
            status: "red", title: "แนะนำให้มารับการรักษาวันหลังจากล้างไต 1 วัน",
            message: "• แนะนำให้ผู้ป่วยมารับการรักษาในวันถัดจากวัน HD ครั้งต่อไป\n  (วันนั้น heparin หมดฤทธิ์แล้ว + platelet function ดีที่สุด)\n• ระหว่างรอ: ให้ยาแก้ปวด / ยาปฏิชีวนะตามอาการได้" + drugMsg
          };
          /* PD + midBleed → รักษาได้ทุกวัน (ไม่มี heparin) + พิจารณา ATB prophylaxis */
          if (a.dialysisType === "pd") return {
            status: "amber", title: "ให้การรักษาได้อย่างระมัดระวังมาก",
            message: "คำแนะนำ\n• ใช้ hemostatic protocol เต็มรูปแบบ\n" + hemostasisFull +
              "\n• พิจารณา ATB prophylaxis ก่อนทำหัตถการ เพื่อป้องกัน peritonitis\n" +
              "  — Amoxicillin 2g PO 1 ชม. ก่อนทำ\n" +
              "  — ถ้าแพ้ Penicillin: Clindamycin 600mg PO 1 ชม. ก่อนทำ\n" +
              "• ไม่มีข้อจำกัดด้านวันนัด (PD ไม่ใช้ heparin)" + drugMsg
          };
          /* G5 ยังไม่ได้ล้างไต (dialysisType === "none") → Consult */
          let msg = "ต้องส่งปรึกษาอายุรกรรมก่อนทำหัตถการ\n• อาจต้องทำ dialysis ก่อนเพื่อ optimize platelet function\n• พิจารณา Desmopressin (DDAVP) + Tranexamic acid protocol\n• Hemostatic protocol เต็มรูปแบบ";
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
    questions: [
      PROC_QUESTION,
      BLEED_PROCEDURE_QUESTION,
      {
        id: "dose",
        label: "ขนาดยา / ประเภทการใช้ Aspirin",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "low",  text: "Aspirin 81 มก./วัน" },
          { value: "high", text: "Aspirin 325 มก./วัน หรือ Dual antiplatelet therapy", sub: "เช่น Aspirin + Clopidogrel" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.procedure
      }
    ],
    evaluate(a, ctx) {
      if (!a.dose) return { status: null };

      if (ctx.proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันทีโดยไม่หยุดยา\n• ห้ามเลือดด้วย local hemostatic agent\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกหลังทำหัตถการ\n• พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด และพิจารณา Admit เป็นผู้ป่วยใน"
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
    questions: [
      PROC_QUESTION,
      BLEED_PROCEDURE_QUESTION,
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
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันที โดยไม่หยุดยา DOACs\n• ห้ามเลือดด้วย local hemostatic agent อย่างเข้มงวด\n  – ใส่ฟองน้ำห้ามเลือด (Gelfoam® หรือ Surgicel®) ในเบ้าฟัน\n  – เย็บแผลปิดให้แน่น\n  – พิจารณาใช้น้ำยาบ้วนปาก Tranexamic acid 5%\n• เตรียม emergency kit และยาฉุกเฉินให้พร้อม\n• สังเกตอาการเลือดออกอย่างใกล้ชิดระหว่างและหลังทำหัตถการ\n• พิจารณาให้การรักษาที่ห้องฉุกเฉินหรือห้องผ่าตัด และพิจารณา Admit เป็นผู้ป่วยใน"
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
  },

  /* ---------- MRONJ (Medication-Related Osteonecrosis of the Jaw) ---------- */
  mronj: {
    label: "ผู้ป่วยเสี่ยง MRONJ",
    DRUG_LABELS: {
      oralBP:          "Bisphosphonate ชนิดรับประทาน (รักษาโรคกระดูกพรุน)",
      ivBP_osteo:      "Zoledronate ฉีดเข้าหลอดเลือด ปีละครั้ง (รักษาโรคกระดูกพรุน)",
      denosumab_osteo: "Denosumab (Prolia®) ฉีดทุก 6 เดือน (รักษาโรคกระดูกพรุน)",
      highdose:        "ยาต้านการสลายกระดูก/ยับยั้งการสร้างหลอดเลือด ขนาดสูงสำหรับผู้ป่วยมะเร็ง"
    },
    STAGE_LABELS: {
      s0: "Stage 0 (มีอาการ แต่ยังไม่มีกระดูกตายโผล่)",
      s1: "Stage 1 (กระดูกตายโผล่ ไม่มีอาการ ไม่ติดเชื้อ)",
      s2: "Stage 2 (กระดูกตายโผล่ ร่วมกับปวด/ติดเชื้อ)",
      s3: "Stage 3 (กระดูกตายลุกลามเกินเบ้ารากฟัน / กระดูกหัก / ทะลุไซนัส-ใบหน้า)"
    },
    questions: [
      PROC_QUESTION,
      {
        id: "mronjStatus",
        label: "สถานะของผู้ป่วย",
        type: "chipChoice",
        chipStack: true,
        clears: ["stage", "procedure", "drugType", "oralDuration", "denoTiming"],
        options: [
          {
            value: "established", dot: "🦴",
            text: "มีภาวะ MRONJ อยู่แล้ว หรือสงสัย",
            sub: "พบกระดูกตายโผล่ในช่องปาก / หยั่ง probe ถึงกระดูกผ่านรูทะลุ / มีรูทะลุออกนอกใบหน้า"
          },
          {
            value: "atrisk", dot: "⚠️",
            text: "ยังไม่มีกระดูกตาย แต่มีความเสี่ยง",
            sub: "ได้รับ (หรือเคยได้รับ) ยาต้านการสลายกระดูก / ยับยั้งการสร้างหลอดเลือด แต่ยังไม่พบรอยโรค"
          }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency"
      },
      {
        id: "stage",
        label: "ระยะของโรค (AAOMS Staging)",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "s0", text: "Stage 0", sub: "ปวดฟัน/ปวดกรามอธิบายไม่ได้ ฟันโยกโดยไม่มีปริทันต์ ชาริมฝีปาก — ยังไม่มีกระดูกตายโผล่" },
          { value: "s1", text: "Stage 1", sub: "กระดูกตายโผล่ หรือ probe ถึงกระดูกได้ · ไม่ปวด · ไม่ติดเชื้อ" },
          { value: "s2", text: "Stage 2", sub: "กระดูกตายโผล่ ร่วมกับปวด บวม แดง มีหนอง (ติดเชื้อ)" },
          { value: "s3", text: "Stage 3", sub: "ลุกลามเกินเบ้ารากฟัน · กระดูกหักทางพยาธิ · รูทะลุนอกใบหน้า · ทะลุไซนัส/โพรงจมูก" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && a.mronjStatus === "established"
      },
      {
        id: "procedure",
        label: "เลือกประเภทหัตถการ",
        type: "chipChoice",
        chipStack: true,
        clears: ["drugType", "oralDuration", "denoTiming"],
        options: [
          {
            value: "nonInvasive", dot: "🪥",
            text: "หัตถการที่ไม่รุกล้ำกระดูก (Non-invasive)",
            sub: [
              "การตรวจ อุดฟัน และงานบูรณะฟันเหนือขอบเหงือก",
              "การขูดหินปูนและเกลารากฟัน",
              "การรักษาคลองรากฟัน (Root canal treatment)",
              "การพิมพ์ปาก ใส่ฟันเทียม และการปรับเครื่องมือจัดฟัน"
            ]
          },
          {
            value: "invasive", dot: "🔪",
            text: "หัตถการรุกล้ำกระดูก (Invasive / Dentoalveolar surgery)",
            sub: [
              "การถอนฟัน (รวมถอนฟันผ่าตัด)",
              "การผ่าตัดฝังรากฟันเทียม (Dental implant)",
              "ศัลยกรรมปริทันต์/ศัลยกรรมกระดูกที่เปิดถึงกระดูก",
              "การตัดชิ้นเนื้อ และศัลยกรรมปลายรากฟัน"
            ]
          }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && a.mronjStatus === "atrisk"
      },
      {
        id: "drugType",
        label: "กลุ่มยาที่ผู้ป่วยได้รับ (Drug-centered risk)",
        type: "chipChoice",
        chipStack: true,
        clears: ["oralDuration", "denoTiming"],
        options: [
          { value: "oralBP",          text: "Bisphosphonate ชนิดรับประทาน",           sub: "เช่น Alendronate 70 mg/สัปดาห์ (รักษาโรคกระดูกพรุน)" },
          { value: "ivBP_osteo",      text: "Zoledronate ฉีด IV ปีละครั้ง",           sub: "Zoledronate 5 mg/ปี (รักษาโรคกระดูกพรุน)" },
          { value: "denosumab_osteo", text: "Denosumab (Prolia®) ฉีดทุก 6 เดือน",     sub: "Denosumab 60 mg SC q6 เดือน (รักษาโรคกระดูกพรุน)" },
          { value: "highdose",        text: "ยาขนาดสูงสำหรับผู้ป่วยมะเร็ง",           sub: "Zoledronate 4 mg q3–4 สัปดาห์ · Denosumab 120 mg q4 สัปดาห์ · ยา Antiangiogenic (เช่น Bevacizumab)" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && a.mronjStatus === "atrisk" && a.procedure === "invasive"
      },
      {
        id: "oralDuration",
        label: "ระยะเวลาที่ใช้ยา และปัจจัยเสี่ยงร่วม",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "lt4", text: "ใช้ยา ≤ 4 ปี และไม่มีปัจจัยเสี่ยงร่วม", sub: "ความเสี่ยงต่ำมาก (~0.04%)" },
          { value: "ge4", text: "ใช้ยา > 4 ปี หรือมีปัจจัยเสี่ยงร่วม",  sub: "เช่น สเตียรอยด์ทางระบบ, เบาหวานคุมไม่ได้, สูบบุหรี่, ได้ยาเคมีบำบัด" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && a.mronjStatus === "atrisk" && a.procedure === "invasive" && a.drugType === "oralBP"
      },
      {
        id: "denoTiming",
        label: "ฉีด Denosumab เข็มล่าสุดมากี่เดือนแล้ว?",
        type: "chipChoice",
        chipStack: true,
        options: [
          { value: "m34",    text: "เดือนที่ 3–4 หลังฉีดเข็มล่าสุด", sub: "✅ ช่วงเวลาที่เหมาะสมที่สุด (ฤทธิ์ยาอ่อนลง มีเวลา 6–8 สัปดาห์ให้แผลหายก่อนเข็มถัดไป)" },
          { value: "other",  text: "เดือนที่ 1–2 หรือ 5–6",         sub: "ยังใกล้เข็มล่าสุด หรือใกล้เข็มถัดไป" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && a.mronjStatus === "atrisk" && a.procedure === "invasive" && a.drugType === "denosumab_osteo"
      }
    ],
    evaluate(a, ctx) {
      const proc = ctx.proc;
      if (!proc) return { status: null };

      /* ---------- Emergency: รักษาก่อน ---------- */
      if (proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาฉุกเฉินทันที",
          message: "คำแนะนำ\n• ให้การรักษาฉุกเฉินทันที (ระบายหนอง/ห้ามเลือด/บรรเทาปวด)\n• หากต้องถอนฟัน ให้ทำแบบ atraumatic บอบช้ำน้อยที่สุด และเย็บปิดแผลให้ขอบชิดกัน (primary closure)\n• จ่าย Chlorhexidine 0.12% บ้วนปาก และยาปฏิชีวนะเมื่อมีการติดเชื้อ\n• ห้ามสั่งหยุดยาต้านการสลายกระดูกเองในภาวะฉุกเฉิน\n• นัดติดตามแผลใกล้ชิด และส่งต่อศัลยกรรมช่องปากหากสงสัยกระดูกตาย"
        };
      }

      const status = a.mronjStatus;
      if (!status) return { status: null };

      const atraumatic =
        "• ถอนฟัน/ทำหัตถการด้วยเทคนิค atraumatic ให้บอบช้ำน้อยที่สุด\n" +
        "• กรอลบขอบกระดูกที่คม และเย็บปิดแผลให้ขอบชิดกัน (primary closure)\n" +
        "• จ่าย Chlorhexidine 0.12% บ้วนปากก่อน–หลังทำหัตถการ\n" +
        "• จ่ายยาปฏิชีวนะเฉพาะเมื่อมีข้อบ่งชี้การติดเชื้อ (ไม่จ่ายเหวี่ยงแหทุกเคส)\n" +
        "• นัดติดตามแผล 1–2 สัปดาห์ จนเยื่อบุปิดสมบูรณ์";
      const infectionNote =
        "\n\n⚠️ ฟันที่ติดเชื้อรุนแรงและบูรณะไม่ได้ ควรถอนออก — การปล่อยฟันติดเชื้อไว้เป็นภัยต่อกระดูกขากรรไกร มากกว่าการถอนอย่างถูกวิธี";
      const noSelfStop =
        "\n\n❗ ทันตแพทย์ห้ามสั่งหยุดยาต้านการสลายกระดูกเอง — ต้องปรึกษาแพทย์เจ้าของไข้ก่อนเสมอ";

      /* ---------- มี MRONJ อยู่แล้ว (Established) ---------- */
      if (status === "established") {
        const s = a.stage;
        if (!s) return { status: null };

        if (s === "s0") {
          return {
            status: "amber",
            title: "รักษาแบบอนุรักษ์ + ติดตามใกล้ชิด (Stage 0)",
            message: "Stage 0 — มีอาการแต่ยังไม่มีกระดูกตายโผล่\nคำแนะนำ\n• รักษาแบบอนุรักษ์: ควบคุมอาการปวด จัดการฟันต้นเหตุ/การติดเชื้อ\n• Chlorhexidine 0.12% บ้วนปาก และดูแลสุขอนามัยช่องปากเข้มงวด\n• เฝ้าระวังใกล้ชิด (~50% อาจดำเนินเข้าสู่ Stage 1)\n• ปรึกษา/ส่งต่อศัลยกรรมช่องปากและแม็กซิลโลเฟเชียลเพื่อร่วมประเมิน",
            consultBody: true
          };
        }
        if (s === "s1") {
          return {
            status: "red",
            title: "ส่งต่อศัลยกรรมช่องปาก (Stage 1)",
            message: "Stage 1 — กระดูกตายโผล่ ไม่ปวด ไม่ติดเชื้อ\nคำแนะนำ\n• รักษาแบบอนุรักษ์: Chlorhexidine 0.12% บ้วนปาก · ดูแลสุขอนามัยช่องปาก · กรอลบขอบกระดูกที่คมซึ่งเสียดสีเนื้อเยื่อ\n• ประเมินขอบเขตกระดูกตายด้วย CBCT (แม่นยำกว่าฟิล์ม panoramic)\n• ส่งต่อศัลยกรรมช่องปากฯ เพื่อพิจารณาการผ่าตัดตัดกระดูกตายตั้งแต่ระยะแรก",
            consultBody: true
          };
        }
        if (s === "s2") {
          return {
            status: "red",
            title: "ให้ยาปฏิชีวนะ + ส่งต่อศัลยกรรมช่องปาก (Stage 2)",
            message: "Stage 2 — กระดูกตายโผล่ ร่วมกับปวดและติดเชื้อ\nคำแนะนำ\n• เริ่มยาปฏิชีวนะทางระบบ: Amoxicillin-clavulanate หรือ Clindamycin หรือ Metronidazole\n• Chlorhexidine 0.12% บ้วนปาก · ควบคุมอาการปวด\n• ประเมินขอบเขตด้วย CBCT และพิจารณา PENTO protocol ประคับประคองก่อนผ่าตัด\n• ส่งต่อศัลยกรรมช่องปากฯ เพื่อผ่าตัดตัดกระดูกตาย (sequestrectomy/resection) + เย็บปิดแบบ tension-free",
            consultBody: true
          };
        }
        return {
          status: "red",
          title: "ส่งต่อศัลยกรรมช่องปากด่วน (Stage 3)",
          message: "Stage 3 — กระดูกตายลุกลามเกินเบ้ารากฟัน (กระดูกหัก / รูทะลุนอกใบหน้า / ทะลุไซนัส)\nคำแนะนำ\n• เริ่มยาปฏิชีวนะทางระบบ และควบคุมอาการปวด/การติดเชื้อ\n• ประเมินด้วย CBCT/CT scan\n• ส่งต่อศัลยกรรมช่องปากและแม็กซิลโลเฟเชียลโดยด่วน เพื่อผ่าตัดใหญ่ (resection) และวางแผนบูรณะ",
          consultBody: true
        };
      }

      /* ---------- ยังไม่มีกระดูกตาย แต่เสี่ยง (At-risk) ---------- */
      const procedure = ctx.procedure;
      if (!procedure) return { status: null };

      if (procedure === "nonInvasive") {
        return {
          status: "green",
          title: "ให้การรักษาได้ตามปกติ",
          message: "หัตถการที่ไม่รุกล้ำกระดูก ไม่เพิ่มความเสี่ยง MRONJ\nสามารถให้การรักษาได้ตามปกติ ไม่ต้องหยุดยาหรือปรึกษาแพทย์\n• เน้นดูแลสุขอนามัยช่องปาก ป้องกันการติดเชื้อ/การอักเสบ\n• ใช้ยาสีฟันฟลูออไรด์ และควบคุมโรคปริทันต์"
        };
      }

      /* invasive */
      const drug = a.drugType;
      if (!drug) return { status: null };

      /* ยาขนาดสูงสำหรับมะเร็ง → ความเสี่ยงสูงมาก */
      if (drug === "highdose") {
        return {
          status: "red",
          title: "ส่งปรึกษา/ส่งต่อก่อนทำหัตถการ (ความเสี่ยงสูง)",
          message: "ผู้ป่วยได้รับยาต้านการสลายกระดูกขนาดสูง (มะเร็ง) — ความเสี่ยง MRONJ สูงมาก (สูงถึง ~1–18%)\nคำแนะนำ\n• ห้ามทำหัตถการรุกล้ำกระดูกโดยไม่ประเมินก่อน\n• ประสานแพทย์เจ้าของไข้ (oncologist) และส่งต่อ/ปรึกษาศัลยกรรมช่องปากฯ\n• พิจารณา CBCT ก่อนวางแผน · หากเลี่ยงการถอนได้ให้เลือกวิธีอนุรักษ์ (เช่น รักษาราก)\n• หากจำเป็นต้องถอน: ทำแบบ atraumatic + primary closure ภายใต้การดูแลของทีมสหวิชาชีพ" + infectionNote + noSelfStop,
          consultBody: true
        };
      }

      /* Zoledronate IV ปีละครั้ง (osteoporosis) → ความเสี่ยงต่ำ */
      if (drug === "ivBP_osteo") {
        return {
          status: "amber",
          title: "ทำหัตถการได้ ร่วมกับมาตรการป้องกัน",
          message: "Zoledronate ฉีดปีละครั้ง (โรคกระดูกพรุน) — ความเสี่ยงต่ำ (~0.017–0.03%)\nสามารถทำหัตถการรุกล้ำได้ โดยไม่ต้องหยุดยา\nคำแนะนำ\n" + atraumatic + infectionNote,
        };
      }

      /* Bisphosphonate รับประทาน → ขึ้นกับระยะเวลา/ปัจจัยเสี่ยง */
      if (drug === "oralBP") {
        const d = a.oralDuration;
        if (!d) return { status: null };
        if (d === "lt4") {
          return {
            status: "amber",
            title: "ทำหัตถการได้ ร่วมกับมาตรการป้องกัน",
            message: "Bisphosphonate รับประทาน ≤ 4 ปี ไม่มีปัจจัยเสี่ยงร่วม — ความเสี่ยงต่ำมาก\nสามารถทำหัตถการรุกล้ำได้ โดยไม่ต้องหยุดยาและไม่ต้องส่งปรึกษา\nคำแนะนำ\n" + atraumatic + infectionNote
          };
        }
        return {
          status: "amber",
          title: "ทำหัตถการได้ ร่วมกับมาตรการป้องกัน + ส่งปรึกษาแพทย์เรื่องหยุดยา",
          message: "Bisphosphonate รับประทาน > 4 ปี หรือมีปัจจัยเสี่ยงร่วม — ความเสี่ยงสูงขึ้น\nคำแนะนำ\n" + atraumatic +
            "\n\nเรื่องการหยุดยา (Drug holiday):\n• ส่งปรึกษาแพทย์เจ้าของไข้ — หากประเมินว่าหยุดยาได้ปลอดภัย อาจพิจารณา drug holiday 2 เดือนก่อนถอนฟัน\n• หากหยุดยาไม่ได้ ให้ทำหัตถการแบบ atraumatic + primary closure โดยไม่ต้องหยุดยา" + infectionNote + noSelfStop,
          consultBody: true
        };
      }

      /* Denosumab (Prolia) osteoporosis → ใช้จังหวะเวลา (window เดือน 3–4) */
      if (drug === "denosumab_osteo") {
        const t = a.denoTiming;
        if (!t) return { status: null };
        if (t === "m34") {
          return {
            status: "green",
            title: "ช่วงเวลาที่เหมาะสม — ทำหัตถการได้",
            message: "Denosumab เดือนที่ 3–4 หลังฉีดเข็มล่าสุด — เป็นช่วงที่ฤทธิ์ยาอ่อนลง เหมาะที่สุดสำหรับหัตถการรุกล้ำ\nคำแนะนำ\n" + atraumatic +
              "\n• ให้แผลหายภายใน 6–8 สัปดาห์ก่อนถึงกำหนดฉีดเข็มถัดไป (เดือนที่ 6)\n• ไม่ต้องหยุดยา — ห้ามเลื่อน/งดเข็มถัดไปเอง (เสี่ยง rebound fracture)" + infectionNote
          };
        }
        return {
          status: "amber",
          title: "แนะนำจัดนัดให้อยู่ในเดือนที่ 3–4 หลังฉีด",
          message: "Denosumab อยู่ในเดือนที่ 1–2 หรือ 5–6 หลังฉีดเข็มล่าสุด\nคำแนะนำ\n" +
            (proc === "urgency"
              ? "• เร่งด่วน: ทำหัตถการได้เลยแบบ atraumatic + primary closure ไม่ต้องรอ\n" + atraumatic
              : "• นัดล่วงหน้า: แนะนำเลื่อนมาทำในเดือนที่ 3–4 หลังฉีดเข็มล่าสุด (window of opportunity)\n• ประสานแพทย์เจ้าของไข้เพื่อจัดจังหวะนัด ห้ามงด/เลื่อนเข็ม Denosumab เอง") +
            infectionNote,
          consultBody: proc !== "urgency"
        };
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      if (a.mronjStatus === "established") {
        const stageTxt = this.STAGE_LABELS[a.stage] || "";
        return "ผู้ป่วยมีภาวะกระดูกขากรรไกรตายจากการใช้ยา (MRONJ) " + stageTxt +
          " ทางกลุ่มงานทันตกรรมขอส่งปรึกษา/ส่งต่อศัลยกรรมช่องปากและแม็กซิลโลเฟเชียล เพื่อร่วมประเมินและวางแผนการรักษา และขอความอนุเคราะห์ประสานแพทย์เจ้าของไข้เรื่องยาต้านการสลายกระดูก";
      }

      const drugTxt = this.DRUG_LABELS[a.drugType] || "ยาต้านการสลายกระดูก";
      const procTxt = ctx.procedureLabel && ctx.procedureLabel !== "-" ? ctx.procedureLabel : "หัตถการรุกล้ำกระดูก";

      if (a.drugType === "highdose") {
        return "ผู้ป่วยได้รับ " + drugTxt + " และมีความจำเป็นต้องทำ " + procTxt + " (" + PROC_LABELS[ctx.proc] + ") ซึ่งมีความเสี่ยงต่อภาวะ MRONJ สูง ทางกลุ่มงานทันตกรรมขอส่งปรึกษาศัลยกรรมช่องปากฯ และขอความอนุเคราะห์แพทย์เจ้าของไข้ (oncologist) ร่วมประเมินความเสี่ยงและจังหวะการทำหัตถการ";
      }

      if (a.drugType === "denosumab_osteo") {
        return "ผู้ป่วยได้รับ " + drugTxt + " และมีความจำเป็นต้องทำ " + procTxt + " (" + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์แพทย์เจ้าของไข้ประสานจังหวะการทำหัตถการให้อยู่ในเดือนที่ 3–4 หลังฉีดยาเข็มล่าสุด (โดยไม่งด/เลื่อนเข็มถัดไป เพื่อป้องกัน rebound fracture)";
      }

      /* oralBP > 4 ปี / มีปัจจัยเสี่ยง */
      return "ผู้ป่วยได้รับ " + drugTxt + " (ใช้ยานานกว่า 4 ปี หรือมีปัจจัยเสี่ยงร่วม) และมีความจำเป็นต้องทำ " + procTxt + " (" + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์แพทย์เจ้าของไข้ประเมินความเสี่ยงกระดูกหักจากโรคกระดูกพรุน และพิจารณาความเป็นไปได้ในการหยุดยา (drug holiday) ประมาณ 2 เดือนก่อนทำหัตถการ";
    }
  },

  /* ---------- โรคเบาหวาน (Diabetes Mellitus) ---------- */
  dm: {
    label: "โรคเบาหวาน (DM)",
    HBA1C_LABELS: {
      l1: "คุมได้ดีมาก (HbA1c ≤ 7.0% · eAG ≤ 154 mg/dL)",
      l2: "คุมได้ปานกลาง (HbA1c 7.1–8.9% · eAG 155–211 mg/dL)",
      l3: "คุมได้ไม่ดี (HbA1c 9.0–9.9% · eAG 212–239 mg/dL)",
      l4: "คุมไม่ได้/วิกฤต (HbA1c ≥ 10.0% · eAG ≥ 240 mg/dL)"
    },
    PROC_LABEL: {
      nonSurg: "งานทันตกรรมที่ไม่ใช่การผ่าตัด (Non-surgical)",
      surgery: "งานศัลยกรรมช่องปาก (Oral surgery)",
      implant: "รากฟันเทียม / ปลูกกระดูก (Implant / Bone graft)"
    },
    questions: [
      PROC_QUESTION,
      {
        id: "hba1c",
        label: "ระดับการควบคุมเบาหวาน (HbA1c / eAG)",
        type: "chipChoice",
        chipStack: true,
        clears: ["procedure"],
        tooltips: {
          l1: { head: "การแปลงค่า HbA1c → eAG", body: "eAG (mg/dL) = (28.7 × HbA1c) − 46.7<br>ค่า HbA1c สะท้อนระดับน้ำตาลเฉลี่ยในช่วง 2–3 เดือนที่ผ่านมา ซึ่งบ่งบอกคุณภาพการหายของแผลและภูมิคุ้มกัน" },
          l4: { head: "สัญญาณ Diabetic Ketoacidosis (DKA)", body: "กระหายน้ำรุนแรง · ปัสสาวะบ่อย · ผิวหนังแห้ง · <b>ลมหายใจกลิ่นผลไม้</b> · สับสน<br>หากพบ → <b>งดทำทันตกรรมทุกชนิด</b> และส่งระบบการแพทย์ฉุกเฉินทันที" }
        },
        options: [
          { value: "l1", dot: "✅", text: "HbA1c ≤ 7.0%", sub: "eAG ≤ 154 mg/dL — Well controlled · ไม่มีข้อห้ามในการรักษา" },
          { value: "l2", dot: "🟢", text: "HbA1c 7.1–8.9%", sub: "eAG 155–211 mg/dL — Moderate · ทำได้ แต่ต้องเฝ้าระวังน้ำตาลใกล้ชิด" },
          { value: "l3", dot: "🟠", text: "HbA1c 9.0–9.9%", sub: "eAG 212–239 mg/dL — Poorly controlled · ระวังสูง ชะลองาน elective" },
          { value: "l4", dot: "⛔", text: "HbA1c ≥ 10.0%", sub: "eAG ≥ 240 mg/dL — Severe · งดหัตถการ (เว้นช่วยชีวิต)" }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency"
      },
      {
        id: "procedure",
        label: "เลือกประเภทหัตถการ",
        type: "chipChoice",
        chipStack: true,
        options: [
          {
            value: "nonSurg", dot: "🪥",
            text: "งานทันตกรรมที่ไม่ใช่การผ่าตัด (Non-surgical)",
            sub: [
              "การตรวจ อุดฟัน และงานบูรณะเหนือขอบเหงือก",
              "การขูดหินปูนและเกลารากฟัน (Scaling / SRP)",
              "การรักษาคลองรากฟัน (Root canal treatment)",
              "การพิมพ์ปาก ใส่ฟันเทียม และการปรับเครื่องมือจัดฟัน"
            ]
          },
          {
            value: "surgery", dot: "🔪",
            text: "งานศัลยกรรมช่องปาก (Oral surgery)",
            sub: [
              "การถอนฟันปกติและถอนฟันผ่าตัด (Simple / Surgical extraction)",
              "การเจาะระบายหนอง (Incision & drainage)",
              "ศัลยกรรมปริทันต์ / การเปิดแผ่นเหงือก (Flap / Periodontal surgery)",
              "การตัดชิ้นเนื้อ และศัลยกรรมปลายรากฟัน"
            ]
          },
          {
            value: "implant", dot: "🦴",
            text: "รากฟันเทียม / ปลูกกระดูก (Implant / Bone graft)",
            sub: [
              "การผ่าตัดฝังรากฟันเทียม (Dental implant surgery)",
              "การปลูกถ่ายกระดูก / เสริมสันกระดูก (Bone graft / augmentation)",
              "หัตถการที่ต้องอาศัยการสร้างกระดูกใหม่ (Osseointegration)"
            ]
          }
        ],
        showIf: (a) => a.proc && a.proc !== "emergency" && !!a.hba1c && a.hba1c !== "l4"
      }
    ],
    evaluate(a, ctx) {
      const proc = ctx.proc;
      if (!proc) return { status: null };

      /* คำแนะนำร่วม */
      const generalCare =
        "\n\nข้อควรปฏิบัติทุกราย:\n" +
        "• นัดช่วงเช้า (คอร์ติซอลสูง ลดโอกาสน้ำตาลต่ำ) และยืนยันว่าผู้ป่วยกินอาหารเช้า + กินยา/ฉีดอินซูลินตามปกติแล้ว\n" +
        "• เจาะน้ำตาลปลายนิ้ว (POC glucose) ก่อนทำหัตถการ\n" +
        "• Stress reduction protocol · ระงับความรู้สึกให้เพียงพอ\n" +
        "• ยาชา 2% Lidocaine + Epinephrine 1:100,000 ได้ 1–2 หลอด ปลอดภัย (เลี่ยง 1:50,000 และ retraction cord ชุบ epinephrine)";
      const hypoNote =
        "\n\n⚠️ เฝ้าระวังน้ำตาลต่ำ (Hypoglycemia): ใจสั่น เหงื่อออก ตัวเย็น มือสั่น หิว สับสน\n" +
        "• หากรู้สึกตัว + BG < 70 mg/dL → กฎ 15 กรัม: น้ำผลไม้ 120–180 mL หรือกลูโคสอัดเม็ด 3–4 เม็ด แล้วเจาะซ้ำใน 15 นาที\n" +
        "• หากหมดสติ → ห้ามป้อนทางปาก · เรียก 1669 · 50% Dextrose 20–50 mL IV หรือ Glucagon 1 mg IM";
      const surgicalCare =
        "• เทคนิค atraumatic · ควบคุมการติดเชื้อเข้มงวด (rubber dam เมื่อเหมาะสม) · ล้างมือ/hand hygiene\n" +
        "• พิจารณาเย็บปิดแผล และนัดติดตามการหายของแผล\n" +
        "• จ่ายยาปฏิชีวนะแบบรักษา 5–7 วัน เฉพาะเมื่อมีแผลติดเชื้อ/แผลหายช้า (ไม่จ่ายเหวี่ยงแหในผู้ป่วยที่คุมน้ำตาลได้ดี)";
      const apNote =
        "\n\nยาปฏิชีวนะป้องกัน (Prophylaxis) — พิจารณาในหัตถการที่เปิดกระดูกกว้าง/คุมน้ำตาลไม่ดี:\n" +
        "• Amoxicillin 2 g PO 1 ชม. ก่อนทำ (เด็ก 50 mg/kg)\n" +
        "• แพ้ Penicillin: Clindamycin 600 mg PO 1 ชม. ก่อนทำ";

      /* ---------- Emergency ---------- */
      if (proc === "emergency") {
        return {
          status: "green",
          title: "ให้การรักษาฉุกเฉินทันที",
          message:
            "ให้การรักษาฉุกเฉินได้ทันทีโดยไม่ต้องรอผล HbA1c\n" +
            "• เจาะน้ำตาลปลายนิ้วก่อนลงมือ · ควบคุมการติดเชื้อ/ห้ามเลือด/บรรเทาปวด\n" +
            "• จ่ายยาปฏิชีวนะเมื่อมีการติดเชื้อ · พิจารณา I&D / ถอนฟันต้นเหตุ\n" +
            "❗ หากพบสัญญาณ DKA (กระหายน้ำมาก ปัสสาวะบ่อย ลมหายใจกลิ่นผลไม้ สับสน) → งดทันตกรรม ส่งระบบการแพทย์ฉุกเฉินทันที\n" +
            "• หากคุมน้ำตาลไม่ได้และต้องรักษาภาวะคุกคามชีวิต ให้ทำในโรงพยาบาลที่พร้อมกู้ชีพ" +
            hypoNote
        };
      }

      const lv = a.hba1c;
      if (!lv) return { status: null };

      /* ---------- HbA1c ≥ 10% : งดทุกหัตถการ ---------- */
      if (lv === "l4") {
        return {
          status: "red",
          title: "งดหัตถการ — ส่งควบคุมเบาหวานก่อน (Severe uncontrolled)",
          message:
            "HbA1c ≥ 10.0% (eAG ≥ 240 mg/dL) — เสี่ยงสูงต่อ DKA แผลไม่หาย และการติดเชื้อลุกลาม\n" +
            "• งดหัตถการทางทันตกรรมทุกชนิด จนกว่าจะควบคุมน้ำตาลได้\n" +
            "• ส่งปรึกษาอายุรแพทย์/แพทย์เจ้าของไข้เพื่อควบคุมเบาหวานก่อน แล้วนัดกลับมาประเมินใหม่\n" +
            "• หากมีการติดเชื้อรุนแรง: จ่ายยาปฏิชีวนะแบบรักษา และพิจารณาส่ง ER/Admit เพื่อรักษาร่วมกับอายุรแพทย์" +
            hypoNote,
          consultBody: true
        };
      }

      if (!ctx.procedure) return { status: null };
      const pr = ctx.procedure;

      /* ---------- HbA1c ≤ 7% : Well controlled ---------- */
      if (lv === "l1") {
        if (pr === "nonSurg" || pr === "surgery") {
          return {
            status: "green",
            title: "ให้การรักษาได้ตามปกติ",
            message:
              "HbA1c ≤ 7.0% — คุมได้ดีมาก ไม่มีข้อห้ามในการรักษา ทำหัตถการได้ทุกประเภทเทียบเท่าคนปกติ\n" +
              (pr === "surgery" ? "คำแนะนำสำหรับงานศัลยกรรม:\n" + surgicalCare + "\n(ไม่จำเป็นต้องให้ยาปฏิชีวนะป้องกันในผู้ป่วยที่คุมน้ำตาลได้ดี)" : "เน้นดูแลสุขอนามัยช่องปากและควบคุมโรคปริทันต์") +
              generalCare
          };
        }
        /* implant */
        return {
          status: "green",
          title: "ทำรากฟันเทียมได้ (ความเสี่ยงใกล้เคียงคนปกติ)",
          message:
            "HbA1c ≤ 7.0% (Good control 6–8% ตาม DGI/DGZMK) — ความเสี่ยง osseointegration ล้มเหลวใกล้เคียงประชากรทั่วไป\n" +
            "• ผ่าตัดฝังรากเทียม/ปลูกกระดูกได้\n" +
            surgicalCare +
            "\n• ตรวจ POC glucose ซ้ำในวันผ่าตัด · เฝ้าระวังการหายของแผลรอบรากเทียม" +
            generalCare
        };
      }

      /* ---------- HbA1c 7.1–8.9% : Moderate ---------- */
      if (lv === "l2") {
        if (pr === "nonSurg") {
          return {
            status: "green",
            title: "ให้การรักษาได้ (เฝ้าระวังน้ำตาลใกล้ชิด)",
            message:
              "HbA1c 7.1–8.9% — ทำงานทันตกรรมที่ไม่ใช่การผ่าตัดได้ แต่ต้องเฝ้าระวังระดับน้ำตาลใกล้ชิด หากมีอาการผิดปกติให้หยุดทันที" +
              generalCare + hypoNote
          };
        }
        if (pr === "surgery") {
          return {
            status: "amber",
            title: "ทำได้อย่างระมัดระวัง + เฝ้าระวังน้ำตาล/การติดเชื้อ",
            message:
              "HbA1c 7.1–8.9% — ทำงานศัลยกรรมได้ โดยไม่ต้องหยุด/รอ แต่ระบบภูมิคุ้มกันและการหายของแผลด้อยลง\n" +
              surgicalCare + apNote + generalCare + hypoNote
          };
        }
        /* implant — moderate risk zone (DGI/DGZMK 8–10%) */
        if (proc === "elective") {
          return {
            status: "amber",
            title: "แนะนำ optimize น้ำตาลก่อน (Elective implant)",
            message:
              "HbA1c 7.1–8.9% (Moderate 8–10% ตาม DGI/DGZMK) — เสี่ยงระดับกลางถึงสูงต่อ crestal bone loss และ peri-implantitis\n" +
              "• เป็นงาน elective — แนะนำประสานแพทย์ควบคุมน้ำตาลให้ < 8% (ยิ่งใกล้ ≤ 7% ยิ่งดี) ก่อนผ่าตัดฝังรากเทียม\n" +
              "• หากผู้ป่วยยืนยันทำ: แจ้งความเสี่ยง ขอ informed consent · ตรวจ POC glucose วันผ่าตัด · ให้ยาปฏิชีวนะป้องกัน · นัดติดตามใกล้ชิด\n" +
              surgicalCare + generalCare,
            consultBody: true
          };
        }
        return {
          status: "amber",
          title: "ทำได้อย่างระมัดระวัง (แจ้งความเสี่ยง)",
          message:
            "HbA1c 7.1–8.9% — เสี่ยงระดับกลางต่อการหายของกระดูกรอบรากเทียม\n" +
            "• แจ้งความเสี่ยงและขอ informed consent · ตรวจ POC glucose วันผ่าตัด · ให้ยาปฏิชีวนะป้องกัน\n" +
            surgicalCare + generalCare
        };
      }

      /* ---------- HbA1c 9.0–9.9% : Poorly controlled ---------- */
      if (lv === "l3") {
        if (pr === "nonSurg") {
          return {
            status: "amber",
            title: "ทำงานพื้นฐานได้ ระวังสูง",
            message:
              "HbA1c 9.0–9.9% — เข้าสู่โซนคุมไม่ดี ทำงานทันตกรรมพื้นฐาน (ไม่ผ่าตัด) ได้ แต่ต้องระวังสูงและเฝ้าระวังน้ำตาลใกล้ชิด\n" +
              "• แนะนำให้ผู้ป่วยไปพบแพทย์เพื่อปรับการควบคุมน้ำตาล" +
              generalCare + hypoNote
          };
        }
        /* surgery / implant */
        if (pr === "surgery") {
          if (proc === "urgency") {
            return {
              status: "amber",
              title: "เร่งด่วน — ทำได้ภายใต้การควบคุมเข้มงวด (ไม่รอ Consult)",
              message:
                "HbA1c 9.0–9.9% + เร่งด่วน (เช่น ติดเชื้อ/ปวดรุนแรง) — ให้การรักษาแบบประคับประคอง/ถอนฟัน/ระบายหนองได้\n" +
                surgicalCare +
                "\n• จ่ายยาปฏิชีวนะแบบรักษา · ควบคุมการติดเชื้ออย่างเข้มงวด\n" +
                "• ประสาน/ส่งปรึกษาแพทย์เจ้าของไข้อย่างทันท่วงที" +
                apNote + generalCare + hypoNote,
              consultBody: true
            };
          }
          return {
            status: "red",
            title: "ชะลองาน Elective — ส่งควบคุมน้ำตาลก่อน",
            message:
              "HbA1c 9.0–9.9% — งานศัลยกรรมแบบนัดหมาย (โดยเฉพาะการเปิดแผ่นเหงือก/กระดูกปริทันต์) ควรชะลอไว้ก่อน\n" +
              "• ส่งปรึกษาแพทย์เพื่อควบคุมน้ำตาล แล้วนัดทำหัตถการใหม่เมื่อ HbA1c ดีขึ้น",
            consultBody: true
          };
        }
        /* implant — poorly controlled */
        return {
          status: "red",
          title: "เลื่อนการฝังรากเทียม — ควบคุมน้ำตาลก่อน",
          message:
            "HbA1c 9.0–9.9% — ไม่แนะนำผ่าตัดฝังรากเทียม/ปลูกกระดูกในภาวะนี้ (osseointegration ล้มเหลวสูง)\n" +
            "• เลื่อนหัตถการออกไป · ส่งปรึกษาแพทย์เพื่อควบคุมน้ำตาลให้ < 8% (ควรใกล้ ≤ 7%) ก่อนวางแผนฝังรากเทียม",
          consultBody: true
        };
      }

      return { status: null };
    },
    buildConsult(a, ctx) {
      const lvTxt = this.HBA1C_LABELS[a.hba1c] || "";
      const prTxt = (a.procedure && this.PROC_LABEL[a.procedure]) ? this.PROC_LABEL[a.procedure] : "หัตถการทางทันตกรรม";
      if (a.hba1c === "l4") {
        return "ผู้ป่วยโรคเบาหวานที่ควบคุมน้ำตาลไม่ได้ " + lvTxt + " ทางกลุ่มงานทันตกรรมของดการทำหัตถการไว้ก่อน และขอความอนุเคราะห์อายุรแพทย์/แพทย์เจ้าของไข้ประเมินและควบคุมระดับน้ำตาลให้อยู่ในเกณฑ์ปลอดภัยก่อนนัดผู้ป่วยกลับมารับการรักษาทางทันตกรรม";
      }
      return "ผู้ป่วยโรคเบาหวาน " + lvTxt + " มีความจำเป็นต้องทำ " + prTxt + " (ประเภทหัตถการ: " + PROC_LABELS[ctx.proc] + ") ทางกลุ่มงานทันตกรรมขอความอนุเคราะห์อายุรแพทย์/แพทย์เจ้าของไข้ประเมินและปรับการควบคุมระดับน้ำตาลในเลือดก่อนทำหัตถการ เพื่อลดความเสี่ยงต่อการติดเชื้อและภาวะแผลหายช้า";
    }
  }
};
