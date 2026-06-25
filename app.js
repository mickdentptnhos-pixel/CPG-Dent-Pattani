/* ===================== State & DOM ===================== */
const state = { proc: "", procedure: "", problem: "", answers: {} };
let pendingFocus = null; 
const el = (id) => document.getElementById(id);

// ฟังก์ชันหา Label
const currentProcedures = () => (PROBLEMS[state.problem]?.procedures) || DEFAULT_PROCEDURES;
const getProcedureLabel = (val) => currentProcedures().find(p => p.value === val)?.label || "-";

// Helper: อัปเดต CSS ของปุ่มที่ถูกเลือก
const updateActiveChip = (containerId, activeVal, dataKey) => {
  el(containerId).querySelectorAll('.chip').forEach(c => {
    c.classList.toggle('active', c.dataset[dataKey] === activeVal);
  });
};

/* ===================== Event Listeners ===================== */
el("problemChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  if (state.problem !== chip.dataset.problem) {
    state.proc = ""; state.procedure = ""; state.answers = {};
    updateActiveChip("procChips", "", "proc");
  }
  state.problem = chip.dataset.problem;
  updateActiveChip("problemChips", state.problem, "problem");
  updateFlow();
});

el("procChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.proc = chip.dataset.proc; state.procedure = "";
  updateActiveChip("procChips", state.proc, "proc");
  updateFlow();
});

el("procedureChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  state.procedure = chip.dataset.procedure;
  updateActiveChip("procedureChips", state.procedure, "procedure");
  updateFlow();
});

/* ===================== ควบคุม Flow ===================== */
function updateFlow() {
  el("procCard").style.display = state.problem ? "block" : "none";
  
  if (!state.problem || !state.proc) {
    el("procedureCard").style.display = "none";
    el("decisionCard").style.display = "none";
    el("resultCard").style.display = "none";
    return;
  }

  if (state.proc === "emergency" || state.problem === "ht") {
    el("procedureCard").style.display = "none";
    renderDecision();
    return;
  }

  // Render Procedure Chips ด้วย Template Literals (สั้นและคลีนกว่าเดิม)
  el("procedureChips").innerHTML = currentProcedures().map(proc => `
    <button class="chip ${state.procedure === proc.value ? 'active' : ''}" type="button" data-procedure="${proc.value}">
      ${proc.dot ? `<span class="dot">${proc.dot}</span>` : ''}
      <span>${proc.label} ${proc.sub ? `<span class="sub">${proc.sub}</span>` : ''}</span>
    </button>
  `).join('');
  
  el("procedureCard").style.display = "block";
  state.procedure ? renderDecision() : (el("decisionCard").style.display = "none", el("resultCard").style.display = "none");
}

/* ===================== Render Decision (ยุบรวมโค้ดให้สั้นลง) ===================== */
// ฟังก์ชันรับค่าจากปุ่มที่กด (เขียนแทรกใน HTML)
window.handleAnswer = (id, val, clears) => {
  state.answers[id] = val;
  if (clears) clears.split(',').forEach(k => delete state.answers[k]);
  renderDecision();
};

window.handleInput = (id, val) => {
  state.answers[id] = val;
  pendingFocus = id;
  renderDecision();
};

function renderDecision() {
  const p = PROBLEMS[state.problem];
  if (!p) { evaluate(); return; }
  const ctx = { proc: state.proc, procedure: state.procedure, procedureLabel: getProcedureLabel(state.procedure) };

  let html = '';
  p.questions.forEach(q => {
    if (q.showIf && !q.showIf(state.answers, ctx)) return;
    
    html += `<div class="sub-block"><div class="q-label">${q.label}</div>`;
    
    if (q.type === "chipChoice" || q.type === "choice") {
      const isChip = q.type === "chipChoice";
      const wrapCls = isChip ? `chips ${q.chipStack ? 'stack' : ''}` : 'choices';
      const btnCls = isChip ? 'chip' : 'choice';

      html += `<div class="${wrapCls}">` + q.options.map(opt => `
        <button type="button" class="${btnCls} ${state.answers[q.id] === opt.value ? 'active' : ''}" 
                onclick="handleAnswer('${q.id}', '${opt.value}', '${q.clears ? q.clears.join(',') : ''}')">
          <span>${opt.text} 
            ${opt.sub ? (Array.isArray(opt.sub) ? `<ul class="sub-list"><li>${opt.sub.join('</li><li>')}</li></ul>` : `<span class="sub">${opt.sub}</span>`) : ''}
          </span>
        </button>
      `).join('') + `</div>`;
      
    } else if (q.type === "number") {
      html += `<div class="inline-input">
        <input type="number" id="q_${q.id}" step="any" placeholder="${q.placeholder || ''}" 
               value="${state.answers[q.id] || ''}" oninput="handleInput('${q.id}', this.value)">
      </div>`;
    }
    html += `</div>`;
  });

  el("decisionArea").innerHTML = html;
  el("decisionCard").style.display = html ? "block" : "none";
  evaluate();

  if (pendingFocus) {
    const f = el("q_" + pendingFocus);
    if (f) { f.focus(); const v = f.value; f.value = ""; f.value = v; }
    pendingFocus = null;
  }
}

/* ===================== Evaluate & Print (ก๊อปปี้ของเดิมมาได้เลย) ===================== */
// นำฟังก์ชัน evaluate(), ฟังก์ชัน printBtn.onclick, backBtn.onclick, doPrintBtn.onclick 
// และ formatThaiDate ของเดิมมาวางต่อท้ายตรงนี้ได้เลยครับ
