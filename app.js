(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 신호 카드 (보건복지부·아동권리보장원 안내를 바탕으로 정리) ---------- */
  const CATS = { body:"몸", mind:"마음", life:"생활", words:"말" };
  const CARDS = [
    { id:"injury", cat:"body", em:"🩹", voice:"넘어져서 다친 거예요", short:"설명과 맞지 않는 상처",
      mean:"설명과 맞지 않는 상처나 멍은 신체 학대의 신호일 수 있어요.",
      look:"팔 안쪽, 등, 얼굴처럼 잘 다치지 않는 곳인지, 나은 상처와 새 상처가 함께 있는지, 설명이 자꾸 바뀌는지 살펴봐요.", urgent:true },
    { id:"clothes", cat:"body", em:"🧥", voice:"저 안 추워요", short:"계절에 맞지 않는 옷",
      mean:"계절에 맞지 않는 옷이나 오래 씻지 못한 모습은 방임의 신호일 수 있어요.",
      look:"며칠째 같은 옷을 입는지, 몸이나 옷에서 냄새가 나는지 살펴봐요." },
    { id:"hungry", cat:"body", em:"🍞", voice:"급식 더 먹어도 돼요?", short:"늘 배고파 보임",
      mean:"늘 배고파하거나 음식을 숨기고 허겁지겁 먹는다면 끼니를 챙기지 못하는 방임일 수 있어요.",
      look:"주말이나 방학이 지난 뒤 더 야위어 보이는지, 나이에 비해 많이 마르지 않았는지 살펴봐요." },
    { id:"sick", cat:"body", em:"🤒", voice:"아파도 병원은 안 가요", short:"아파도 치료받지 못함",
      mean:"아프거나 다쳐도 치료를 받지 못하는 것은 의료 방임의 신호일 수 있어요.",
      look:"충치나 상처가 오래 방치되어 있는지, 아파도 결석만 하고 병원에 가지 않는지 살펴봐요." },
    { id:"sorry", cat:"mind", em:"😶", voice:"제가 잘못했어요, 죄송해요", short:"지나치게 사과하고 눈치 봄",
      mean:"작은 실수에도 지나치게 사과하고 어른의 눈치를 본다면 정서 학대의 신호일 수 있어요.",
      look:"꾸중을 들을 상황이 아닌데도 몸을 움츠리는지, 칭찬에도 불안해하는지 살펴봐요." },
    { id:"home", cat:"mind", em:"🏠", voice:"집에 가기 싫어요", short:"집에 가기 싫어함",
      mean:"하교 시간이 되면 불안해하거나 집에 가기 싫어한다면 집이 안전하지 않다는 신호일 수 있어요.",
      look:"늦게까지 밖에 머무르려 하는지, 특정 가족이 집에 있는 날 더 불안해하는지 살펴봐요." },
    { id:"changed", cat:"mind", em:"🌧️", voice:"…", short:"갑자기 달라진 모습",
      mean:"밝던 아이가 갑자기 말이 없어지거나 공격적으로 변한다면 무언가 힘든 일을 겪고 있다는 신호일 수 있어요.",
      look:"아기처럼 행동하는 퇴행, 잠을 못 자거나 악몽을 꾸는 모습, 친구를 피하는 모습이 함께 보이는지 살펴봐요." },
    { id:"afraid", cat:"mind", em:"😨", voice:"엄마한테 말하지 마세요", short:"특정 어른을 몹시 두려워함",
      mean:"부모나 특정 어른에게 알려지는 것을 몹시 두려워한다면 그 어른이 무서운 존재일 수 있어요.",
      look:"그 어른이 데리러 왔을 때 표정이 굳는지, 혼날까 봐 지나치게 걱정하는지 살펴봐요." },
    { id:"noise", cat:"life", em:"🔊", voice:"(밤마다 들리는 울음소리)", short:"반복되는 고함과 울음",
      mean:"밤마다 반복되는 고함, 물건 깨지는 소리, 아이 울음은 이웃이 가장 먼저 알아차리는 신호예요.",
      look:"얼마나 자주, 언제, 얼마 동안 들리는지 날짜와 시간을 함께 적어 두세요." },
    { id:"alone", cat:"life", em:"🚪", voice:"오늘도 혼자 있어요", short:"어린 아이가 오래 혼자 있음",
      mean:"어린 아이가 오랜 시간 혼자 지내거나 밤늦게까지 보호자 없이 밖에 있다면 방임의 신호일 수 있어요.",
      look:"아이의 나이, 혼자 있는 시간, 식사를 챙기는 사람이 있는지 살펴봐요." },
    { id:"absent", cat:"life", em:"📚", voice:"학교 못 갔어요", short:"이유 없는 잦은 결석",
      mean:"특별한 이유 없이 결석이나 지각이 잦다면 교육 방임이거나 상처를 숨기려는 것일 수 있어요.",
      look:"결석 뒤에 상처가 보이는지, 결석 이유에 대한 설명이 자주 바뀌는지 살펴봐요." },
    { id:"secret", cat:"words", em:"🤫", voice:"이건 우리 둘만의 비밀이래요", short:"어른이 비밀을 강요함",
      mean:"어른이 아이에게 비밀을 지키라고 강요한다면 성적 학대나 길들이기의 신호일 수 있어요.",
      look:"특정 어른과 단둘이 있는 것을 피하는지, 나이에 맞지 않는 신체 접촉 이야기를 하는지 살펴봐요.", urgent:true },
    { id:"told", cat:"words", em:"💬", voice:"아빠가 때렸어요", short:"아이가 직접 털어놓음",
      mean:"아이가 직접 털어놓았다면 그 말을 믿어 주세요. 아이가 용기를 낸 순간이에요.",
      look:"캐묻지 말고 들은 말을 그대로 기록해 두세요. 다시 말하게 하지 않아도 돼요.", urgent:true }
  ];

  const picked = new Set();
  const state = { role:null, cat:"all" };

  /* ---------- 카드 그리기 ---------- */
  const deck = $("#deck");
  deck.innerHTML = CARDS.map(c => `
    <article class="card" data-id="${c.id}" data-cat="${c.cat}">
      <div class="card-in">
        <button class="face front" type="button" aria-label="${c.short} 카드, 눌러서 뜻 보기">
          <span class="cat ${c.cat}">${CATS[c.cat]}</span>
          <span class="em" aria-hidden="true">${c.em}</span>
          <span class="voice">${/^[(…]/.test(c.voice) ? c.voice : `"${c.voice}"`}</span>
          <span class="hint"><span>${c.short}</span><span>뒤집기 ↻</span></span>
        </button>
        <div class="face back">
          <h4>${CATS[c.cat]}의 신호 · ${c.short}</h4>
          <p class="mean">${c.mean}</p>
          <p class="look">${c.look}</p>
          ${c.urgent ? `<p class="urgent">이 신호가 보이면 빠르게 112에 알려 주세요</p>` : ""}
          <div class="back-actions">
            <button class="pick" type="button" aria-pressed="false">내가 본 신호로 담기</button>
            <button class="turn" type="button" aria-label="앞면으로 돌리기">↻</button>
          </div>
        </div>
      </div>
    </article>`).join("");

  function setBackFocusable(card, on){
    card.querySelectorAll(".back button").forEach(b => b.tabIndex = on ? 0 : -1);
    card.querySelector(".front").tabIndex = on ? -1 : 0;
  }
  $$(".card").forEach(card => {
    setBackFocusable(card, false);
    card.querySelector(".front").addEventListener("click", () => { card.classList.add("flipped"); setBackFocusable(card, true); setTimeout(() => card.querySelector(".pick").focus({ preventScroll:true }), 300); });
    card.querySelector(".turn").addEventListener("click", () => { card.classList.remove("flipped"); setBackFocusable(card, false); card.querySelector(".front").focus({ preventScroll:true }); });
    card.querySelector(".pick").addEventListener("click", () => togglePick(card.dataset.id));
  });

  // 종류 필터
  $$(".filter").forEach(f => f.addEventListener("click", () => {
    state.cat = f.dataset.cat;
    $$(".filter").forEach(x => x.setAttribute("aria-selected", String(x === f)));
    $$(".card").forEach(c => c.hidden = state.cat !== "all" && c.dataset.cat !== state.cat);
  }));

  /* ---------- 담기 ---------- */
  function togglePick(id){
    picked.has(id) ? picked.delete(id) : picked.add(id);
    syncPicked();
    toast(picked.has(id) ? `신호를 담았어요 (${picked.size}개)` : "담은 신호에서 뺐어요");
  }
  function syncPicked(){
    $$(".card").forEach(c => {
      const on = picked.has(c.dataset.id);
      c.classList.toggle("picked", on);
      const b = c.querySelector(".pick"); b.setAttribute("aria-pressed", String(on)); b.textContent = on ? "담음 ✓ (빼기)" : "내가 본 신호로 담기";
    });
    const pc = $("#pickedCount"); pc.textContent = `담은 신호 ${picked.size}개`; pc.classList.remove("bump"); void pc.offsetWidth; pc.classList.add("bump");
    const tray = $("#tray");
    tray.innerHTML = picked.size
      ? CARDS.filter(c => picked.has(c.id)).map(c => `<span class="chipx">${c.em} ${c.short}<button type="button" data-remove="${c.id}" aria-label="${c.short} 빼기">✕</button></span>`).join("")
      : `<p class="tray-empty">위의 카드에서 <b>담기</b>를 누르면 여기에 모여요.</p>`;
    if (picked.size) $("#q-picked").classList.remove("missing");
    if ($("#planOut").classList.contains("on")) renderPlan();
    updateErr();
  }
  $("#tray").addEventListener("click", e => { const b = e.target.closest("[data-remove]"); if (b){ picked.delete(b.dataset.remove); syncPicked(); } });

  /* ---------- 관계 ---------- */
  $$(".role").forEach(r => r.addEventListener("click", () => {
    state.role = r.dataset.role;
    $$(".role").forEach(x => x.setAttribute("aria-pressed", String(x === r)));
    $("#q-role").classList.remove("missing");
    if ($("#planOut").classList.contains("on")) renderPlan();
    updateErr();
  }));

  const missing = () => [!picked.size && ["#q-picked","내가 본 신호"], !state.role && ["#q-role","아이와의 관계"]].filter(Boolean);
  const errText = m => `${m.map(x => x[1]).join("와 ")}를 먼저 골라 주세요.`;
  function updateErr(){ if (!$("#err").textContent) return; const m = missing(); $("#err").textContent = m.length ? errText(m) : ""; }

  /* ---------- 나의 지킴 계획 ---------- */
  const CALL = `<a class="call" href="tel:112">112에 전화하기</a>`;
  const PLANS = {
    urgent:{ tag:"빠른 확인이 필요해요", title:"망설이지 말고, 지금 알려 주세요", steps:[
      { now:true, b:"지금 112에 신고해 주세요", s:"아이가 직접 털어놓았거나, 설명하기 어려운 상처나 비밀 강요가 보였다면 빠른 확인이 필요해요. 확실하지 않아도 괜찮아요. 판단은 전문가가 해요.", call:true },
      { b:"본 것을 사실대로 정리해요", s:"언제, 어디서, 무엇을 보고 들었는지 아래 기록 기능에 적어 두면 신고할 때 그대로 말할 수 있어요." },
      { b:"아이 곁을 지켜 주세요", s:"아이가 혼자가 아니라고 느끼도록 곁에 있어 주세요. 캐묻거나 같은 이야기를 반복해서 시키지 않아요." }]},
    consult:{ tag:"전문가와 함께 살펴볼 때", title:"혼자 고민하지 말고 전문가에게 맡겨요", steps:[
      { b:"여러 신호가 겹쳐 보여요", s:"신호가 여러 개 함께 보인다면 혼자 판단하지 마세요. 의심만으로도 112에 신고할 수 있고, 학대인지는 전문가가 조사해서 판단해요.", call:true },
      { b:"본 것을 기록해 두세요", s:"날짜와 시간, 본 것과 들은 것을 사실대로 적어 두면 신고와 상담에 큰 도움이 돼요." },
      { b:"아이에게 안전한 어른이 되어 주세요", s:"다정한 인사와 작은 관심이 아이에게 '말해도 되는 어른'이 있다는 믿음을 줘요." }]},
    watch:{ tag:"관심을 갖고 지켜볼 때", title:"아이 곁에서 조금 더 지켜봐 주세요", steps:[
      { b:"신호가 반복되는지 살펴봐요", s:"신호 하나만으로 학대라고 단정할 수는 없어요. 비슷한 모습이 반복되거나 다른 신호가 함께 보이는지 관심을 갖고 지켜봐 주세요." },
      { b:"본 것을 기록해 두세요", s:"작은 기록이 쌓이면 나중에 아이를 지키는 중요한 근거가 돼요." },
      { b:"신호가 늘어나면 112에 알려 주세요", s:"걱정이 커지거나 신호가 늘어나면 망설이지 말고 신고해 주세요. 의심만으로도 충분해요.", call:true }]}
  };
  const TIPS = {
    neighbor:["이웃이라면","반복되는 고함이나 울음소리는 날짜와 시간을 적어 두세요. 직접 찾아가 따지기보다 112에 알리는 것이 아이와 나 모두에게 안전해요."],
    teacher:["선생님·강사라면","교직원과 학원 강사는 아동학대 신고의무자예요. 직무 중 학대를 알게 되거나 의심이 들면 바로 신고해야 해요. 아이의 말과 모습을 있는 그대로 기록해 두세요."],
    family:["친척이라면","가족이라서 더 말하기 어려울 수 있어요. 하지만 신고는 가족을 벌주는 것이 아니라 아이와 가정이 도움을 받는 시작이에요."],
    parent:["친구의 부모라면","우리 집에 놀러 온 아이가 이야기를 꺼내면 끝까지 들어 주세요. 그 아이의 부모에게 직접 확인하려 하기보다 112에 알려 주세요."]
  };
  function level(){
    const list = CARDS.filter(c => picked.has(c.id));
    if (list.some(c => c.urgent)) return "urgent";
    if (list.length >= 3 || list.some(c => c.id === "afraid" || c.id === "home")) return "consult";
    return "watch";
  }
  function renderPlan(){
    if (!picked.size || !state.role) return;
    const lv = level(), p = PLANS[lv], list = CARDS.filter(c => picked.has(c.id));
    const tag = $("#resTag"); tag.className = `res-tag ${lv}`; tag.textContent = p.tag;
    $("#resTitle").textContent = p.title;
    $("#resLead").textContent = `담은 신호 ${list.length}개: ${list.map(c => c.short).join(", ")}`;
    $("#path").innerHTML = p.steps.map(s => `<li class="${s.now ? "now" : ""}"><div><b>${s.b}</b><span>${s.s}</span>${s.call ? CALL : ""}</div></li>`).join("");
    const [h, t] = TIPS[state.role]; $("#roleTip").innerHTML = `<b>${h}</b>${t}`;
  }
  $("#makePlan").addEventListener("click", () => {
    const m = missing();
    if (m.length){ m.forEach(([s]) => $(s).classList.add("missing")); $("#err").textContent = errText(m); return; }
    $("#err").textContent = "";
    renderPlan();
    const out = $("#planOut"); out.classList.remove("on"); void out.offsetWidth; out.classList.add("on");
    if (innerWidth < 1000) out.scrollIntoView({ behavior:"smooth", block:"start" });
  });

  /* ---------- 기록 (이 기기에만 저장) ---------- */
  const KEY = "little-signals-records";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
  const save = list => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {} };
  let records = load();
  const fmt = v => { const d = new Date(v); return isNaN(d) ? v : `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; };
  const esc = s => s.replace(/[&<>"']/g, ch => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[ch]));
  function drawRecords(){
    $("#records").innerHTML = records.length
      ? records.map((r, i) => `<li><time>${fmt(r.when)}</time><span>${esc(r.what)}</span><button type="button" data-del="${i}" aria-label="이 기록 지우기">지우기</button></li>`).join("")
      : `<li class="none">아직 기록이 없어요.</li>`;
  }
  (function setNow(){ const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); $("#recWhen").value = d.toISOString().slice(0, 16); })();
  $("#recordForm").addEventListener("submit", e => {
    e.preventDefault();
    const what = $("#recWhat").value.trim(); if (!what) return;
    records.push({ when:$("#recWhen").value, what }); records.sort((a, b) => a.when.localeCompare(b.when));
    save(records); drawRecords(); $("#recWhat").value = ""; toast("기록을 추가했어요");
  });
  $("#records").addEventListener("click", e => { const b = e.target.closest("[data-del]"); if (b){ records.splice(+b.dataset.del, 1); save(records); drawRecords(); } });
  $("#clearRec").addEventListener("click", () => { if (!records.length) return; if (confirm("이 기기에 저장된 기록을 모두 지울까요? 되돌릴 수 없어요.")){ records = []; save(records); drawRecords(); toast("기록을 모두 지웠어요"); } });
  $("#copyRec").addEventListener("click", async () => {
    if (!records.length){ toast("먼저 기록을 추가해 주세요"); return; }
    const sig = CARDS.filter(c => picked.has(c.id)).map(c => c.short);
    const text = ["[아동학대 의심 상황 기록]", ...records.map(r => `- ${fmt(r.when)} ${r.what}`), sig.length ? `- 함께 본 신호: ${sig.join(", ")}` : ""].filter(Boolean).join("\n");
    try { await navigator.clipboard.writeText(text); toast("복사했어요. 신고할 때 그대로 읽어 주세요"); } catch { toast("복사하지 못했어요. 기록을 직접 읽어 주세요"); }
  });
  drawRecords();

  /* ---------- 배너 슬라이드 ---------- */
  (function carousel(){
    const slides = $$(".slide"), bar = $("#heroBar"), now = $("#heroNow"), pauseBtn = $("#pauseSlide");
    const DUR = 6500; let i = 0, t0 = performance.now(), paused = calm, hover = false, raf;
    function show(k){
      i = (k + slides.length) % slides.length;
      slides.forEach((s, n) => { s.classList.toggle("on", n === i); s.setAttribute("aria-hidden", String(n !== i)); });
      now.textContent = i + 1; t0 = performance.now(); bar.style.width = "0%";
    }
    function tick(ts){
      if (!paused && !hover){
        const p = Math.min(1, (ts - t0) / DUR); bar.style.width = (p * 100) + "%";
        if (p >= 1) show(i + 1);
      } else t0 = ts - (parseFloat(bar.style.width) || 0) / 100 * DUR;
      raf = requestAnimationFrame(tick);
    }
    $("#prevSlide").addEventListener("click", () => show(i - 1));
    $("#nextSlide").addEventListener("click", () => show(i + 1));
    pauseBtn.addEventListener("click", () => { paused = !paused; pauseBtn.textContent = paused ? "▶" : "❚❚"; pauseBtn.setAttribute("aria-label", paused ? "자동 넘김 다시 시작" : "자동 넘김 멈추기"); });
    if (calm){ pauseBtn.textContent = "▶"; pauseBtn.setAttribute("aria-label", "자동 넘김 다시 시작"); }
    const hero = $(".hero");
    hero.addEventListener("mouseenter", () => hover = true); hero.addEventListener("mouseleave", () => hover = false);
    hero.addEventListener("focusin", () => hover = true); hero.addEventListener("focusout", () => hover = false);
    show(0); raf = requestAnimationFrame(tick);
  })();

  /* ---------- 상황 연습 ---------- */
  const SCENES = [
    { id:"night", who:"🏘️ 이웃이라면", tab:"밤마다 들리는 소리",
      text:"밤 11시, 옆집에서 아이 우는 소리와 어른의 고함이 30분째 들려요. 지난주에도 비슷한 소리를 들었어요.",
      q:"이럴 때 나는 어떻게 할까요?",
      choices:[
        { t:"남의 집 일이니 모른 척한다.", ok:false, fb:"가해자의 대부분이 부모라서, 집 밖의 이웃이 알리지 않으면 아무도 모를 수 있어요. 신고는 '참견'이 아니라 아이를 지키는 일이에요." },
        { t:"직접 찾아가 문을 두드리고 따진다.", ok:false, fb:"마음은 이해되지만, 직접 맞서면 나도 위험하고 아이에게 더 큰 화가 미칠 수 있어요. 확인과 개입은 경찰과 전문가에게 맡겨요." },
        { t:"들린 시간과 내용을 적고, 112에 알린다.", ok:true, fb:"가장 좋은 방법이에요. 반복되는 소리는 날짜와 시간을 적어 두면 큰 도움이 돼요. 의심만으로도 신고할 수 있어요." }]},
    { id:"bruise", who:"🧑‍🏫 학원 강사라면", tab:"팔에 보인 멍",
      text:"수업 중 한 아이의 팔 안쪽에 멍이 보여요. 괜찮냐고 묻자 '넘어졌어요'라며 얼른 소매를 내려요.",
      q:"이럴 때 나는 어떻게 할까요?",
      choices:[
        { t:"부모에게 전화해서 무슨 일인지 물어본다.", ok:false, fb:"보호자가 가해자일 수 있어서, 먼저 연락하면 아이가 더 위험해지거나 증거가 사라질 수 있어요." },
        { t:"아이를 따로 불러 누가 그랬는지 자세히 캐묻는다.", ok:false, fb:"캐묻는 질문은 아이를 힘들게 하고, 이후 조사에도 영향을 줄 수 있어요. 아이가 먼저 말하면 믿고 들어 주세요." },
        { t:"본 것을 기록하고, 신고의무자로서 112에 신고한다.", ok:true, fb:"맞아요. 학원 강사와 교직원은 아동학대 신고의무자예요. 직무 중 학대가 의심되면 바로 신고해야 해요." }]},
    { id:"friend", who:"🤝 친구의 부모라면", tab:"집에 가기 싫은 아이",
      text:"딸과 놀러 온 친구가 저녁이 되자 '집에 가기 싫어요. 아빠한테 또 혼나요'라고 작게 말해요.",
      q:"이럴 때 나는 어떻게 할까요?",
      choices:[
        { t:"\"그래도 집에는 가야지\" 하고 바로 돌려보낸다.", ok:false, fb:"아이는 용기를 내서 신호를 보냈어요. 그냥 넘기면 아이는 다시는 말하지 않을 수도 있어요." },
        { t:"\"말해 줘서 고마워\" 하고 들어 준 뒤, 걱정되면 112에 알린다.", ok:true, fb:"좋아요. 아이의 말을 믿고 들어 주는 것이 먼저예요. 들은 말을 그대로 기록하고, 걱정된다면 112에 상담하듯 알려 주세요." },
        { t:"그 아이의 아빠에게 연락해서 따진다.", ok:false, fb:"직접 따지면 아이가 집에서 더 힘든 상황에 놓일 수 있어요. 판단과 개입은 전문가에게 맡겨요." }]}
  ];
  const sceneDone = {}; let sceneIdx = 0;
  function drawSceneTabs(){
    $("#sceneTabs").innerHTML = SCENES.map((s, k) => `<button class="scene-tab" role="tab" aria-selected="${k === sceneIdx}" data-k="${k}">${s.tab}${sceneDone[s.id] !== undefined ? ` <span class="done">${sceneDone[s.id] ? "정답" : "완료"}</span>` : ""}</button>`).join("");
  }
  function drawScene(){
    const s = SCENES[sceneIdx];
    $("#scene").innerHTML = `<span class="scene-who">${s.who}</span><p class="scene-text">${s.text}</p><p class="scene-q">${s.q}</p>
      <div class="choices">${s.choices.map((c, k) => `<button class="choice" type="button" data-k="${k}"><span class="key">${"ABC"[k]}</span><span>${c.t}</span></button>`).join("")}</div><div id="fbBox"></div>`;
    drawSceneTabs();
  }
  $("#sceneTabs").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b){ sceneIdx = +b.dataset.k; drawScene(); } });
  $("#scene").addEventListener("click", e => {
    const b = e.target.closest(".choice"); if (!b || b.disabled) return;
    const s = SCENES[sceneIdx], k = +b.dataset.k, c = s.choices[k];
    $$("#scene .choice").forEach((x, n) => { x.disabled = true; if (s.choices[n].ok) x.classList.add("best"); });
    if (!c.ok) b.classList.add("wrong");
    const best = s.choices.find(x => x.ok);
    $("#fbBox").innerHTML = `<div class="feedback ${c.ok ? "good" : "soso"}"><b>${c.ok ? "좋은 선택이에요!" : "이렇게 하면 더 좋아요"}</b>${c.fb}${c.ok ? "" : `<br><br><b>더 좋은 방법</b>${best.fb}`}</div>
      <div class="scene-next">${sceneIdx < SCENES.length - 1 ? `<button class="btn green" type="button" id="nextScene">다음 상황 보기</button>` : `<a class="btn green" href="#cards">신호 카드 다시 보기</a>`}</div>`;
    if (sceneDone[s.id] === undefined) sceneDone[s.id] = c.ok;
    drawSceneTabs();
    const n = Object.keys(sceneDone).length, right = Object.values(sceneDone).filter(Boolean).length;
    $("#sceneScore").textContent = n === SCENES.length ? `세 가지 상황 중 ${right}개를 가장 좋은 방법으로 골랐어요. ${right === 3 ? "이미 든든한 지킴이예요! 🌱" : "이제 망설이지 않을 수 있어요."}` : `${n} / ${SCENES.length} 상황 완료`;
    const next = $("#nextScene"); if (next) next.addEventListener("click", () => { sceneIdx++; drawScene(); $("#scene").scrollIntoView({ behavior:"smooth", block:"center" }); });
  });
  drawScene();

  /* ---------- 지킴이 카드 ---------- */
  async function makeKeeperCard(name){
    try { await Promise.all([document.fonts.load('700 40px "Pretendard"'), document.fonts.load('700 40px "Gaegu"')]); } catch {}
    const W = 1080, H = 1350, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const c = cv.getContext("2d");
    const rr = (x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); };
    const F = '"Pretendard","Malgun Gothic",sans-serif', HAND = '"Gaegu","Pretendard",cursive';
    c.fillStyle = "#F1F4F9"; c.fillRect(0, 0, W, H);
    c.save(); c.shadowColor = "rgba(0,0,0,.12)"; c.shadowBlur = 50; c.shadowOffsetY = 20; c.fillStyle = "#fff"; rr(80, 80, W - 160, H - 160, 56); c.fill(); c.restore();
    c.fillStyle = "#89A230"; c.beginPath(); c.arc(W / 2, 290, 110, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#fff"; c.lineWidth = 12; c.lineCap = "round"; c.beginPath(); c.arc(W / 2, 280, 52, Math.PI * .15, Math.PI * .85); c.stroke();
    c.fillStyle = "#fff"; c.beginPath(); c.arc(W / 2 - 34, 262, 12, 0, Math.PI * 2); c.arc(W / 2 + 34, 262, 12, 0, Math.PI * 2); c.fill();
    c.fillStyle = "#F6CD55"; c.beginPath(); c.arc(W / 2 + 92, 200, 26, 0, Math.PI * 2); c.fill();
    c.textAlign = "center";
    c.fillStyle = "#89A230"; c.font = `700 36px ${F}`; c.fillText("우리 동네 아이 지킴이", W / 2, 480);
    c.fillStyle = "#1C1B1B"; c.font = `800 84px ${F}`; c.fillText(`${name} 님`, W / 2, 590);
    c.fillStyle = "#564F49"; c.font = `700 46px ${HAND}`;
    ["아이의 작은 신호를", "지나치지 않는 좋은 이웃이", "되기로 약속했어요"].forEach((l, k) => c.fillText(l, W / 2, 720 + k * 72));
    c.fillStyle = "#F1F4F9"; rr(200, 960, W - 400, 120, 60); c.fill();
    c.fillStyle = "#D14B35"; c.font = `800 44px ${F}`; c.fillText("위급하면 112", W / 2, 1036);
    const d = new Date(); c.fillStyle = "#8F8581"; c.font = `600 30px ${F}`;
    c.fillText(`${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}  ·  ryu-min-ji.github.io/little-signals`, W / 2, 1170);
    const blob = await new Promise(r => cv.toBlob(r, "image/png"));
    const file = new File([blob], "아이지킴이카드.png", { type:"image/png" });
    try { if (navigator.canShare && navigator.canShare({ files:[file] })){ await navigator.share({ files:[file], title:"우리 동네 아이 지킴이" }); return; } } catch (e){ if (e && e.name === "AbortError") return; }
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "아이지킴이카드.png"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast("지킴이 카드를 저장했어요");
  }
  $("#pledgeForm").addEventListener("submit", e => { e.preventDefault(); makeKeeperCard($("#pledgeName").value.trim().slice(0, 12) || "나"); });

  /* ---------- 공유 ---------- */
  function toast(m){ const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2400); }
  $("#share").addEventListener("click", async () => {
    const data = { title:"아이의 작은 신호", text:"아이들은 말 대신 작은 신호를 보내요. 주변 어른을 위한 알아차림 안내서", url:location.href.split("#")[0] };
    try { if (navigator.share){ await navigator.share(data); return; } await navigator.clipboard.writeText(`${data.text}\n${data.url}`); toast("링크를 복사했어요"); }
    catch (e){ if (e && e.name !== "AbortError") toast("복사하지 못했어요. 주소창의 링크를 공유해 주세요"); }
  });

  /* ---------- 화면 효과 ---------- */
  const nav = $("#nav"); addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive:true });
  const links = $$(".menu a");
  const secObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin:"-45% 0px -50% 0px" });
  ["why","cards","practice","plan","faq"].forEach(id => secObs.observe(document.getElementById(id)));

  function countUp(el){
    const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length, t0 = performance.now(), dur = 1300;
    const step = now => { const p = Math.min(1, (now - t0) / dur), v = end * (1 - Math.pow(1 - p, 3)); el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString("ko-KR"); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }
  $$(".sec-head, .stats, .loss, .deck, .scene, .plan-grid, .record, .qa, .gn-grid").forEach(el => el.classList.add("reveal"));
  const rev = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); rev.unobserve(e.target);
    if (e.target.matches(".stats") && !calm) e.target.querySelectorAll("[data-count]").forEach(countUp);
  }), { threshold:.12 });
  $$(".reveal").forEach(el => rev.observe(el));
})();
