/* ===================== State & DOM ===================== */
const state = { problem: "", answers: {} };
let pendingFocus = null;
const el = (id) => document.getElementById(id);

const currentProblem = () => PROBLEMS[state.problem];
const findQuestion = (id) => currentProblem()?.questions.find(q => q.id === id);
const optionLabel = (qid, val) => findQuestion(qid)?.options?.find(o => o.value === val)?.text || "-";

/* ctx สำหรับ evaluate / buildConsult / showIf — สร้างจากคำตอบล้วนๆ */
const buildCtx = () => ({
  proc: state.answers.proc,
  procedure: state.answers.procedure,
  procedureLabel: optionLabel("procedure", state.answers.procedure)
});

/* ===================== เลือก Problem ===================== */
el("problemChips").addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  if (state.problem !== chip.dataset.problem) state.answers = {};
  state.problem = chip.dataset.problem;
  el("problemChips").querySelectorAll(".chip").forEach(c => {
    c.classList.toggle("active", c.dataset.problem === state.problem);
  });
  renderQuestions();
});

/* ===================== ตอบคำถาม (event delegation) ===================== */
el("questionsArea").addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-q]");
  if (!btn) return;
  const q = findQuestion(btn.dataset.q);
  if (!q) return;
  if (q.clears === "*") state.answers = {};
  else if (q.clears) q.clears.forEach(k => delete state.answers[k]);
  state.answers[q.id] = btn.dataset.val;
  renderQuestions();
});

el("questionsArea").addEventListener("input", (e) => {
  const inp = e.target.closest("input[data-q]");
  if (!inp) return;
  state.answers[inp.dataset.q] = inp.value;
  pendingFocus = inp.dataset.q;
  renderQuestions();
});

/* ===================== Render คำถามทั้งหมดของ Problem ===================== */
function renderQuestions() {
  const p = currentProblem();
  if (!p) {
    el("questionsArea").innerHTML = "";
    el("resultCard").style.display = "none";
    el("patientCard").style.display = "none";
    return;
  }
  const ctx = buildCtx();

  el("questionsArea").innerHTML = p.questions.map(q => {
    if (q.showIf && !q.showIf(state.answers, ctx)) return "";

    let body = "";
    if (q.type === "chipChoice" || q.type === "choice") {
      const isChip = q.type === "chipChoice";
      const wrapCls = isChip ? `chips ${q.chipStack ? "stack" : ""}` : "choices";
      const btnCls = isChip ? "chip" : "choice";
      body = `<div class="${wrapCls}">` + q.options.map(opt => `
        <button type="button" class="${btnCls} ${state.answers[q.id] === opt.value ? "active" : ""}" data-q="${q.id}" data-val="${opt.value}">
          ${opt.dot ? `<span class="dot">${opt.dot}</span>` : ""}
          <span>${opt.text}
            ${opt.sub ? (Array.isArray(opt.sub) ? `<ul class="sub-list"><li>${opt.sub.join("</li><li>")}</li></ul>` : `<span class="sub">${opt.sub}</span>`) : ""}
          </span>
        </button>`).join("") + `</div>`;
    } else if (q.type === "number") {
      body = `<div class="inline-input">
        <input type="number" data-q="${q.id}" id="q_${q.id}" step="any" placeholder="${q.placeholder || ""}" value="${state.answers[q.id] || ""}">
      </div>`;
    }

    return `<section class="card"><h2>${q.label.replace(/\n/g, "<br>")}</h2>${body}</section>`;
  }).join("");

  evaluate();

  if (pendingFocus) {
    const f = el("q_" + pendingFocus);
    if (f) { f.focus(); const v = f.value; f.value = ""; f.value = v; }
    pendingFocus = null;
  }
}

/* ===================== Evaluate & Print ===================== */
function evaluate() {
  const p = currentProblem();
  el("resultBox").className = "result";
  el("resultCard").style.display = "none";
  el("patientCard").style.display = "none";

  if (!p) return;
  const r = p.evaluate(state.answers, buildCtx());
  if (!r || !r.status) return;

  const icons = { green: "✅", red: "⛔", amber: "⚠️" };
  el("resultCard").style.display = "block";
  el("resultBox").className = "result show " + r.status;
  el("resultBox").querySelector(".ico").textContent = icons[r.status] || "";
  el("resultBox").querySelector(".r-head").textContent = r.title;
  el("resultBox").querySelector(".r-body").textContent = r.message;

  if (r.consultBody) el("patientCard").style.display = "block";
}

function formatThaiDate(d) {
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  return d.getDate() + " " + months[d.getMonth()] + " พ.ศ. " + (d.getFullYear() + 543);
}

el("printBtn").onclick = () => {
  el("dName").textContent = el("ptName").value.trim() || "________________________";
  el("dAge").textContent  = el("ptAge").value.trim()  || "____";
  el("dHN").textContent   = el("ptHN").value.trim()   || "____________";
  el("dDate").textContent = formatThaiDate(new Date());
  el("dProc").textContent = PROC_LABELS[state.answers.proc] || "-";

  const p = currentProblem();
  const htProcLabel = (state.problem === "ht" && state.answers.htProcedure) ? p.HT_PROC_LABEL[state.answers.htProcedure] : null;
  el("dProcedure").textContent = htProcLabel || (state.answers.procedure ? optionLabel("procedure", state.answers.procedure) : "-");

  el("dConsultBody").textContent = p.buildConsult(state.answers, buildCtx());

  el("app").style.display = "none";
  el("consultDoc").style.display = "block";
  window.scrollTo(0, 0);
};

el("backBtn").onclick = () => {
  el("consultDoc").style.display = "none";
  el("app").style.display = "block";
};
el("doPrintBtn").onclick = () => window.print();

/* ===================== Tooltips (จาก q.tooltips ใน guidelines.js) ===================== */
(function setupTooltips() {
  const tooltip = el("procTooltip");
  const ttHead = tooltip.querySelector(".tt-head");
  const ttBody = tooltip.querySelector(".tt-body");
  const area = el("questionsArea");

  function positionTooltip(mx, my) {
    const ox = 14, oy = 14;
    tooltip.style.top  = (my + oy) + "px";
    tooltip.style.left = (mx + ox) + "px";
    requestAnimationFrame(() => {
      const tr = tooltip.getBoundingClientRect();
      if (tr.right  > window.innerWidth  - 8) tooltip.style.left = (mx - tr.width  - ox) + "px";
      if (tr.bottom > window.innerHeight - 8) tooltip.style.top  = (my - tr.height - oy) + "px";
    });
  }

  area.addEventListener("mouseover", (e) => {
    const btn = e.target.closest("button[data-q]");
    const data = btn && findQuestion(btn.dataset.q)?.tooltips?.[btn.dataset.val];
    if (!data) { tooltip.classList.remove("show"); return; }
    ttHead.textContent = data.head;
    ttBody.innerHTML = data.body;
    tooltip.classList.add("show");
    positionTooltip(e.clientX, e.clientY);
  });
  area.addEventListener("mousemove", (e) => {
    if (tooltip.classList.contains("show")) positionTooltip(e.clientX, e.clientY);
  });
  area.addEventListener("mouseleave", () => tooltip.classList.remove("show"));
})();
