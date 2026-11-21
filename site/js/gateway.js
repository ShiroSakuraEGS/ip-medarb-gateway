(function () {
  const state = {
    step: 0,
    mode: null,
    expert: null,
    partyA: false,
    partyB: false
  };

  const steps = ["選擇模式", "一鍵申請", "雙方確認", "專家配對", "程序銜接", "結果"];
  const modes = {
    A: { title: "模式 A｜仲裁前調解（Mediation First）", blurb: "爭議尚未正式進入仲裁前，先安排調解；若未能和解，才進入仲裁。" },
    B: { title: "模式 B｜仲裁中轉調解（Arbitration to Mediation）", blurb: "已進入仲裁程序，經雙方同意後申請暫停或調整，轉入調解。" },
    C: { title: "模式 C｜調解失敗回歸仲裁（Mediation to Arbitration）", blurb: "調解未能達成協議時，依照原有仲裁協議恢復仲裁，無須重新尋找渠道。" }
  };

  const experts = [
    { id: 1, name: "陳致遠（示範）", field: "著作權／數位內容", lang: "粵語、英語、普通話", zone: "香港" },
    { id: 2, name: "林雅婷（示範）", field: "專利／軟體授權", lang: "英語、普通話", zone: "香港／新加坡" },
    { id: 3, name: "A. Rahman（示範）", field: "商標／跨境品牌", lang: "英語、馬來語", zone: "香港／吉隆坡" }
  ];

  const root = document.getElementById("gw-app");
  if (!root) return;

  function renderSteps() {
    return `<div class="steps" aria-label="流程進度">${steps.map((s, i) => {
      const cls = i < state.step ? "done" : i === state.step ? "now" : "";
      return `<span class="${cls}">${i + 1}. ${s}</span>`;
    }).join("")}</div>`;
  }

  function go(step) {
    state.step = step;
    draw();
  }

  function draw() {
    root.innerHTML = renderSteps() + "<div class='panel'>" + view() + "</div>";
    bind();
  }

  function view() {
    switch (state.step) {
      case 0: return viewMode();
      case 1: return viewApply();
      case 2: return viewConsent();
      case 3: return viewMatch();
      case 4: return viewLink();
      case 5: return viewResult();
      default: return "";
    }
  }

  function viewMode() {
    return `
      <span class="badge badge-demo">示範介面｜非真實申請系統</span>
      <h2>選擇服務模式</h2>
      <p class="lede">「一鍵」代表操作流程簡化，不代表法律程序可以自動轉換。任何轉入調解都必須取得雙方同意。</p>
      <div class="modes" style="margin-top:16px">
        ${Object.keys(modes).map((k) => `
          <button type="button" class="mode ${state.mode === k ? "selected" : ""}" data-mode="${k}">
            <h3>${modes[k].title}</h3>
            <p class="small">${modes[k].blurb}</p>
          </button>`).join("")}
      </div>
      <div class="actions">
        <button type="button" class="btn" id="next" ${state.mode ? "" : "disabled"}>下一步：一鍵申請</button>
      </div>`;
  }

  function viewApply() {
    return `
      <span class="badge badge-demo">示範資料（虛構）</span>
      <h2>一鍵申請</h2>
      <p class="small muted">以下欄位已預填示範案件，僅供走流程之用。</p>
      <p class="small"><strong>已選模式：</strong>${modes[state.mode].title}</p>
      <div class="grid grid-2">
        <div>
          <label class="field">示範案件編號</label>
          <input type="text" value="DEMO-CI-2026-001-017" readonly>
          <label class="field">爭議類型</label>
          <input type="text" value="生成式 AI 訓練資料之著作權授權爭議（示範）" readonly>
          <label class="field">申請方（示範）</label>
          <input type="text" value="星灣創科有限公司（示範）" readonly>
        </div>
        <div>
          <label class="field">對方當事人（示範）</label>
          <input type="text" value="北辰內容平台（示範）" readonly>
          <label class="field">語言</label>
          <input type="text" value="中文、英文" readonly>
          <label class="field">現處階段</label>
          <input type="text" value="${state.mode === "A" ? "尚未進入仲裁（示範）" : state.mode === "B" ? "仲裁進行中｜HKIAC 示範編號 arb-0000" : "調解進行中，預先設定回歸仲裁條款（示範）"}" readonly>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="btn ghost" id="back">返回</button>
        <button type="button" class="btn" id="next">提交申請（示範）</button>
      </div>`;
  }

  function viewConsent() {
    return `
      <span class="badge badge-demo">必須雙方同意｜不可單方強制轉換</span>
      <h2>雙方確認</h2>
      <p class="lede">確認調解範圍、程序安排，以及（如適用）仲裁是否暫停、時限如何計算。單方按鍵不能改變原程序。</p>
      <div class="parties">
        <div class="party ${state.partyA ? "agreed" : ""}" id="pa">
          <h3>當事人 A（示範）</h3>
          <p class="small">星灣創科有限公司</p>
          <p class="small muted">調解範圍：訓練資料授權與過去使用之補償方案（示範）</p>
          <div class="actions">
            <button type="button" class="btn" data-party="A">${state.partyA ? "已同意（再按可取消）" : "示範：同意轉入調解"}</button>
          </div>
        </div>
        <div class="party ${state.partyB ? "agreed" : ""}" id="pb">
          <h3>當事人 B（示範）</h3>
          <p class="small">北辰內容平台</p>
          <p class="small muted">同一範圍；調解中的溝通不得在後續仲裁中作為對己不利的證據（示範隔離條款）</p>
          <div class="actions">
            <button type="button" class="btn" data-party="B">${state.partyB ? "已同意（再按可取消）" : "示範：同意轉入調解"}</button>
          </div>
        </div>
      </div>
      <div class="actions">
        <button type="button" class="btn ghost" id="back">返回</button>
        <button type="button" class="btn" id="next" ${state.partyA && state.partyB ? "" : "disabled"}>雙方已同意，進入專家配對</button>
        <button type="button" class="btn ghost" id="refuse">示範：對方不同意</button>
      </div>`;
  }

  function viewMatch() {
    return `
      <span class="badge badge-demo">示範配對｜非真實名冊</span>
      <h2>IP 專家配對</h2>
      <p class="small muted">依 IP 類型、語言、技術領域及司法管轄區配對調解員（示範結果）。調解員與仲裁員角色應分離。</p>
      <div class="experts">
        ${experts.map((e) => `
          <button type="button" class="expert ${state.expert === e.id ? "selected" : ""}" data-expert="${e.id}">
            <div>
              <strong>${e.name}</strong>
              <div class="small">${e.field}　｜　${e.lang}　｜　${e.zone}</div>
            </div>
            <span class="small">${state.expert === e.id ? "已選擇" : "選擇"}</span>
          </button>`).join("")}
      </div>
      <div class="actions">
        <button type="button" class="btn ghost" id="back">返回</button>
        <button type="button" class="btn" id="next" ${state.expert ? "" : "disabled"}>確認配對並進入程序銜接</button>
      </div>`;
  }

  function viewLink() {
    const byMode = {
      A: "本示範案件尚未進入仲裁。若調解成功，將簽訂和解協議；若未成功，當事人可依事先約定啟動仲裁。",
      B: "本示範假設仲裁程序將按約定暫停，期限計算方式須依適用規則或雙方協議處理。調解資料與仲裁證據應隔離。",
      C: "本示範假設調解已在進行，並已預先約定失敗時如何恢復仲裁，避免當事人重新尋找渠道。"
    };
    return `
      <span class="badge badge-demo">程序銜接（示範）</span>
      <h2>程序銜接</h2>
      <p>${byMode[state.mode]}</p>
      <div class="callout ok">法律保障（必須設計）：雙方同意；暫停與時限事先約定；調解保密溝通隔離；和解協議的效力與執行安排清楚。</div>
      <p class="small muted" style="margin-top:12px">以下兩個按鈕只為演示兩種結果，並非真實調解裁決。</p>
      <div class="actions">
        <button type="button" class="btn ghost" id="back">返回</button>
        <button type="button" class="btn" id="ok">示範：調解成功，簽訂和解</button>
        <button type="button" class="btn ghost" id="fail">示範：未能和解，恢復／進入仲裁</button>
      </div>`;
  }

  function viewResult() {
    if (state.outcome === "refused") {
      return `
        <span class="badge badge-demo">示範結果</span>
        <h2>繼續原程序</h2>
        <p>對方未同意轉入調解。系統<strong>不會</strong>單方改變原有爭議解決安排，案件按仲裁協議或既有程序繼續。</p>
        <p class="small muted">這正是「一鍵」的邊界：簡化申請與確認，而不是自動轉化法律程序。</p>
        <div class="actions"><button type="button" class="btn" id="restart">再走一次示範</button>
        <a class="btn ghost" href="index.html#10">返回簡報第 10 頁</a></div>`;
    }
    if (state.outcome === "success") {
      return `
        <span class="badge badge-demo">示範和解協議｜無法律效力</span>
        <h2>調解成功</h2>
        <p>雙方在示範流程中達成和解。正式環境須清楚安排和解協議的法律效力及執行方式（例如是否作成同意裁決或依適用法律執行）。</p>
        <ul class="clean small">
          <li>案件編號：DEMO-CI-2026-001-017</li>
          <li>模式：${modes[state.mode].title}</li>
          <li>調解員：${(experts.find((e) => e.id === state.expert) || {}).name || "—"}</li>
        </ul>
        <div class="actions"><button type="button" class="btn" id="restart">再走一次示範</button>
        <a class="btn ghost" href="index.html#12">返回簡報</a></div>`;
    }
    return `
      <span class="badge badge-demo">示範結果</span>
      <h2>調解未成功，依約恢復或進入仲裁</h2>
      <p>未能達成協議。系統按原有仲裁協議及程序安排，恢復或啟動仲裁，無須重新尋找爭議解決渠道。調解中的保密溝通不應不當影響後續裁決。</p>
      <div class="actions"><button type="button" class="btn" id="restart">再走一次示範</button>
      <a class="btn ghost" href="index.html#10">返回簡報第 10 頁</a></div>`;
  }

  function reset() {
    state.step = 0;
    state.mode = null;
    state.expert = null;
    state.partyA = false;
    state.partyB = false;
    state.outcome = null;
    draw();
  }

  function bind() {
    root.querySelectorAll("[data-mode]").forEach((el) => {
      el.addEventListener("click", () => { state.mode = el.getAttribute("data-mode"); draw(); });
    });
    root.querySelectorAll("[data-expert]").forEach((el) => {
      el.addEventListener("click", () => { state.expert = Number(el.getAttribute("data-expert")); draw(); });
    });
    root.querySelectorAll("[data-party]").forEach((el) => {
      el.addEventListener("click", () => {
        const p = el.getAttribute("data-party");
        if (p === "A") state.partyA = !state.partyA;
        if (p === "B") state.partyB = !state.partyB;
        draw();
      });
    });
    const next = root.querySelector("#next");
    const back = root.querySelector("#back");
    if (next) next.addEventListener("click", () => go(state.step + 1));
    if (back) back.addEventListener("click", () => go(state.step - 1));
    const refuse = root.querySelector("#refuse");
    if (refuse) refuse.addEventListener("click", () => { state.outcome = "refused"; state.step = 5; draw(); });
    const ok = root.querySelector("#ok");
    const fail = root.querySelector("#fail");
    if (ok) ok.addEventListener("click", () => { state.outcome = "success"; state.step = 5; draw(); });
    if (fail) fail.addEventListener("click", () => { state.outcome = "fail"; state.step = 5; draw(); });
    const restart = root.querySelector("#restart");
    if (restart) restart.addEventListener("click", reset);
  }

  draw();
})();
