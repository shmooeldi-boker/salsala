/* ============================================================
   סלסלה 🎶 האפליקציה
   ============================================================ */
import './style.css'
import { CATS, catById, DICT, FREQ_DEFAULT, USERS, COPY, gauge, normalize, guessCat } from './catalog.js'
import * as store from './store.js'
import { firebaseConfig } from './config.js'

/* ---------- לוגו SVG (משמש גם באונבורדינג וגם בכותרת, id ייחודי לכל מופע) ---------- */
const LOGO_SVG = (uid) => `
<svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lg-${uid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FF8A3D"/><stop offset="1" stop-color="#E23E8F"/>
    </linearGradient>
  </defs>
  <rect width="96" height="96" rx="24" fill="url(#lg-${uid})"/>
  <path d="M24 44 L72 44 L66 74 Q65.4 78 61 78 L35 78 Q30.6 78 30 74 Z" fill="#fff"/>
  <path d="M36 44 Q36 28 48 28 Q60 28 60 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
  <line x1="39" y1="52" x2="41" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
  <line x1="48" y1="52" x2="48" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
  <line x1="57" y1="52" x2="55" y2="70" stroke="#FF8A3D" stroke-width="3.4" stroke-linecap="round" opacity=".55"/>
  <g transform="translate(64 14) rotate(12)">
    <circle cx="3.4" cy="15.4" r="4.4" fill="#fff"/>
    <rect x="6.4" y="0" width="3.2" height="16" rx="1.6" fill="#fff"/>
    <path d="M6.4 0 Q13.4 2 15 7 Q11 5.4 6.4 5.2 Z" fill="#fff"/>
  </g>
</svg>`

/* ---------- מצב האפליקציה ---------- */
const state = {
  user: null,
  mode: 'list',
  items: [],
  meta: { shopping: {} },
  storeMode: 'local',
  toastTimer: null,
  addIdx: 0, chkIdx: 0,
  celebrated: false,
}

const $ = id => document.getElementById(id)
const esc = s => (s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))
const me = () => USERS[state.user]
const partner = () => USERS[me().partner]
const genderedAdd = u => u.g === 'f' ? 'הוסיפה' : 'הוסיף'

/* ============================================================
   רינדור
   ============================================================ */
function render() {
  const u = me()
  if (!u) return
  $('avatar').textContent = u.initial
  $('avatar').className = 'avatar ' + u.cls
  $('greet').textContent = COPY.greeting(u)

  const open = state.items.filter(i => i.status === 'open')
  const bought = state.items.filter(i => i.status === 'bought')
  const later = state.items.filter(i => i.status === 'later')

  /* שורת סטטוס */
  const last = [...state.items].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0))[0]
  $('statusline').textContent = open.length
    ? `${open.length} בסלסלה` + (last ? ` • ${USERS[last.addedBy]?.name || ''} ${genderedAdd(USERS[last.addedBy] || u)} ${last.name}` : '')
    : 'הרשימה נקייה ומחכה לסלסול הבא'

  /* מד מצב הבית (רק במצב רשימה) */
  const g = gauge(open)
  const showGauge = state.mode === 'list'
  $('gauge').hidden = !showGauge
  if (showGauge) {
    $('gauge').className = 'gauge ' + g.tone
    $('gaugeLabel').textContent = g.label
    $('gaugeMarker').style.right = `calc(${g.pct}% )`
  }

  /* באנר "בסופר עכשיו" */
  const p = partner()
  const partnerShopping = !!state.meta?.shopping?.[p.id]
  $('liveBanner').hidden = !partnerShopping
  if (partnerShopping) $('liveBanner').textContent = COPY.shoppingBanner(p)

  /* מתג ומצב סופר */
  document.body.classList.toggle('shopmode', state.mode === 'shop')
  $('segList').classList.toggle('on', state.mode === 'list')
  $('segShop').classList.toggle('on', state.mode === 'shop')
  const inShopWithItems = state.mode === 'shop' && (open.length + bought.length) > 0
  $('progress').hidden = !inShopWithItems
  if (inShopWithItems) {
    const total = open.length + bought.length
    $('progText').textContent = `${bought.length} מתוך ${total} בעגלה`
    $('progPct').textContent = Math.round(bought.length / total * 100) + '%'
    $('progFill').style.width = (bought.length / total * 100) + '%'
  }

  /* מצב ריק */
  const isEmpty = open.length + bought.length === 0
  $('empty').hidden = !isEmpty
  if (isEmpty) {
    const c = state.mode === 'shop' ? COPY.emptyShop : COPY.emptyList
    $('emptyEmoji').textContent = state.mode === 'shop' ? '🛒' : '🧺'
    $('emptyTitle').textContent = c.title
    $('emptyText').innerHTML = c.text
    $('coupleLine').textContent = COPY.coupleLines[new Date().getDate() % COPY.coupleLines.length]
  }

  /* הרשימה: קטגוריות בסדר הליכה בסופר */
  let html = ''
  for (const c of CATS) {
    const rows = open.filter(i => i.cat === c.id)
    if (!rows.length) continue
    html += `<div class="cat-head">${c.emoji} ${c.name} <span class="cnt" style="background:${c.color}">${rows.length}</span></div>`
    for (const it of rows) html += itemRow(it)
  }
  if (bought.length) {
    html += `<div class="group-head"><span>✓ בעגלה (${bought.length})</span>
             <button class="clear" data-act="clear">נקה את מה שנקנה</button></div>`
    for (const it of bought) html += itemRow(it)
  }
  if (later.length && state.mode === 'list') {
    html += `<div class="group-head"><span>😴 לפעם אחרת (${later.length})</span></div>`
    for (const it of later) html += itemRow(it, true)
  }
  $('list').innerHTML = html
  renderChips()
}

function itemRow(it, isLater = false) {
  const done = it.status === 'bought'
  const cat = catById(it.cat)
  const who = USERS[it.addedBy]
  return `<div class="item ${done ? 'done' : ''} ${isLater ? 'later-item' : ''} ${it._fresh ? 'fresh' : ''}"
       id="it-${it.id}" data-id="${it.id}" style="border-inline-start-color:${done || isLater ? '' : cat.color}">
    ${isLater
      ? `<button class="later-back" data-back="${it.id}">החזר ➕</button>`
      : `<button class="check" data-check="${it.id}" aria-label="סימון">${done ? '✓' : ''}</button>`}
    <div class="body" data-open="${it.id}">
      <div class="name">${esc(it.name)}</div>
      ${it.note ? `<div class="note">${esc(it.note)}</div>` : ''}
    </div>
    ${who ? `<span class="who ${who.cls}" title="${who.name}">${who.initial}</span>` : ''}
  </div>`
}

/* ============================================================
   טוסטים
   ============================================================ */
function toast(msg, undoFn) {
  $('toastMsg').textContent = msg
  const u = $('toastUndo')
  u.hidden = !undoFn
  u.onclick = () => { undoFn && undoFn(); hideToast() }
  $('toast').classList.add('on')
  clearTimeout(state.toastTimer)
  state.toastTimer = setTimeout(hideToast, undoFn ? 3500 : 2300)
}
const hideToast = () => $('toast').classList.remove('on')

/* ============================================================
   הוספה
   ============================================================ */
async function addItem(raw) {
  const name = normalize(raw)
  if (!name) return
  const dup = state.items.find(i => i.status === 'open' && normalize(i.name) === name)
  if (dup) {
    toast(COPY.dupToast)
    const el = $('it-' + dup.id)
    if (el) { el.classList.add('pulse'); el.scrollIntoView({ block: 'center' }) }
    return
  }
  /* אם המוצר קיים כ"לפעם אחרת" או כבר בעגלה, מחזירים אותו לרשימה במקום ליצור כפול */
  const existing = state.items.find(i => (i.status === 'later' || i.status === 'bought') && normalize(i.name) === name)
  if (existing) { await store.setStatus(existing.id, 'open'); toast(COPY.restoreToast); markFresh(existing.id); return }

  const fn = COPY.addToasts[state.addIdx++ % COPY.addToasts.length]
  toast(fn(name, partner()))
  const id = await store.addItem({ name, cat: guessCat(name), note: '' })
  markFresh(id)
}

function markFresh(id) {
  const it = state.items.find(i => i.id === id)
  if (it) {
    it._fresh = true
    render()
    setTimeout(() => { delete it._fresh; const el = $('it-' + id); el && el.classList.remove('fresh') }, 1800)
  }
}

function addFromInput() {
  const inp = $('addInput')
  addItem(inp.value)
  inp.value = ''
  inp.focus()
  renderChips()
}

/* ---------- צ'יפים והשלמות ---------- */
function renderChips() {
  const v = normalize($('addInput').value)
  const box = $('chips')
  let chips = [], lead = ''
  if (!v) {
    lead = COPY.freqLead
    chips = FREQ_DEFAULT.filter(f => !state.items.some(i => i.status === 'open' && normalize(i.name) === f))
  } else {
    chips = Object.keys(DICT).filter(k => k.includes(v) && k !== v).slice(0, 6)
  }
  box.innerHTML = (lead && chips.length ? `<span class="lead">${lead}</span>` : '') +
    chips.map(c => `<button class="chip" data-chip="${esc(c)}">${esc(c)} +</button>`).join('')
}

/* ============================================================
   סימון, לפעם אחרת, מחיקה
   ============================================================ */
async function checkItem(id) {
  const it = state.items.find(i => i.id === id)
  if (!it) return
  if (it.status === 'open') {
    const left = state.items.filter(i => i.status === 'open').length - 1
    await store.setStatus(id, 'bought')
    if (state.mode === 'shop' && left === 0) { celebrate(); return }
    const fn = COPY.checkToasts[state.chkIdx++ % COPY.checkToasts.length]
    toast(fn(it.name, left), async () => { await store.setStatus(id, 'open'); toast(COPY.restoreToast) })
  } else {
    await store.setStatus(id, 'open')
    toast(COPY.restoreToast)
  }
}

async function clearBought() {
  const n = await store.clearBought(state.items)
  if (n) toast(COPY.clearToast(n))
}

/* ============================================================
   חגיגה 🎉
   ============================================================ */
function celebrate() {
  const n = state.items.filter(i => i.status === 'bought').length
  $('partyTitle').textContent = COPY.celebrate.title
  $('partySub').textContent = COPY.celebrate.sub(n)
  $('partyLine').textContent = COPY.coupleLines[Math.floor(Math.random() * COPY.coupleLines.length)]
  $('partyClear').textContent = COPY.celebrate.clear
  $('partyMore').textContent = COPY.celebrate.more
  $('party').hidden = false
  confetti()
}
function hideParty() { $('party').hidden = true }

function confetti() {
  const cv = $('confetti'), ctx = cv.getContext('2d')
  const shell = $('shell')
  cv.hidden = false
  cv.width = shell.clientWidth; cv.height = shell.clientHeight
  const colors = ['#FF8A3D', '#E23E8F', '#FFC94D', '#0FA3A3', '#3DA35D', '#7C5CBF']
  const ps = Array.from({ length: 140 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5,
    w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
    vy: 2 + Math.random() * 3.5, vx: (Math.random() - .5) * 2.2,
    rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .25,
    c: colors[Math.floor(Math.random() * colors.length)],
  }))
  let frames = 0
  ;(function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height)
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot)
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore()
    }
    if (++frames < 180) requestAnimationFrame(tick)
    else { ctx.clearRect(0, 0, cv.width, cv.height); cv.hidden = true }
  })()
}

/* ============================================================
   גיליון פעולות על מוצר
   ============================================================ */
let sheetId = null
function openSheet(id) {
  const it = state.items.find(i => i.id === id)
  if (!it) return
  sheetId = id
  const who = USERS[it.addedBy]
  $('sheetName').textContent = it.name
  $('sheetMeta').textContent = who ? `${who.name} ${genderedAdd(who)} • ${catById(it.cat).emoji} ${catById(it.cat).name}` : ''
  $('sheetNote').value = it.note || ''

  const acts = []
  if (it.status === 'open') {
    acts.push(`<button class="act cart" data-sheetact="bought"><span class="ico">🛒</span>לעגלה</button>`)
    acts.push(`<button class="act later" data-sheetact="later"><span class="ico">😴</span>לפעם אחרת</button>`)
  } else {
    acts.push(`<button class="act restore" data-sheetact="open"><span class="ico">↩️</span>החזרה לרשימה</button>`)
  }
  acts.push(`<button class="act del" data-sheetact="delete"><span class="ico">🗑</span>למחוק</button>`)
  $('actions3').innerHTML = acts.join('')
  $('actions3').style.gridTemplateColumns = `repeat(${acts.length},1fr)`

  $('sheetCats').innerHTML = CATS.map(c =>
    `<button class="chip ${c.id === it.cat ? 'on' : ''}" data-cat="${c.id}">${c.emoji} ${c.name}</button>`).join('')

  $('scrim').hidden = false
  $('sheet').classList.add('on')
}
function closeSheets() {
  $('scrim').hidden = true
  $('sheet').classList.remove('on')
  $('profileSheet').classList.remove('on')
}
async function sheetAction(act) {
  const it = state.items.find(i => i.id === sheetId)
  if (!it) return closeSheets()
  closeSheets()
  if (act === 'delete') {
    const copy = { ...it }
    await store.removeItem(it.id)
    toast(COPY.deleteToast(it.name), async () => {
      const id = await store.addItem({ name: copy.name, cat: copy.cat, note: copy.note })
      if (copy.status !== 'open') await store.setStatus(id, copy.status)
    })
  } else if (act === 'later') {
    await store.setStatus(it.id, 'later')
    toast(COPY.laterToast(it.name), async () => { await store.setStatus(it.id, 'open'); toast(COPY.restoreToast) })
  } else if (act === 'bought') {
    await checkItem(it.id)
  } else if (act === 'open') {
    await store.setStatus(it.id, 'open')
    toast(COPY.restoreToast)
  }
}
async function saveSheet() {
  const it = state.items.find(i => i.id === sheetId)
  if (it) {
    const note = normalize($('sheetNote').value)
    const cat = $('sheetCats').querySelector('.chip.on')?.dataset.cat || it.cat
    await store.updateItem(it.id, { note, cat })
  }
  closeSheets()
}

/* ---------- גיליון פרופיל ---------- */
function openProfile() {
  const u = me()
  $('profTitle').textContent = `מחוברים בתור ${u.name} ${u.g === 'f' ? '👑' : '👑'}`
  $('profMode').textContent = state.storeMode === 'cloud'
    ? 'מסונכרן בענן: כל שינוי מגיע מיד לצד השני ☁️'
    : 'מצב מקומי: עובד על המכשיר הזה בלבד (עוד לא חובר לענן)'
  $('profSwitch').textContent = `אני בעצם ${partner().name}, החלף`
  $('scrim').hidden = false
  $('profileSheet').classList.add('on')
}

/* ============================================================
   מצבים ומשתמש
   ============================================================ */
function setMode(m) {
  if (state.mode === m) return
  state.mode = m
  store.setShopping(m === 'shop').catch(() => {})
  state.celebrated = false
  render()
}

async function chooseUser(uidKey) {
  store.setProfile(uidKey)
  state.user = uidKey
  /* אם האפליקציה מחוברת לענן אבל למכשיר אין עדיין קוד בית, מבקשים אותו פעם אחת */
  if (firebaseConfig && !store.getHouseCode()) {
    document.querySelectorAll('.pick').forEach(b => b.hidden = true)
    $('onboardFoot').hidden = true
    $('codeStep').hidden = false
    return
  }
  finishOnboard()
}

function finishOnboard() {
  $('onboard').hidden = true
  toast(COPY.welcome(USERS[state.user]))
  boot()
}

/* ============================================================
   אתחול
   ============================================================ */
async function boot() {
  state.storeMode = await store.initStore(state.user, {
    onItems: items => { state.items = items; render() },
    onMeta: meta => { state.meta = meta; render() },
    onRemoteAdd: it => {
      const who = USERS[it.addedBy]
      if (who) toast(COPY.remoteAdd(who, it.name))
      const el = $('it-' + it.id)
      if (el) el.classList.add('pulse')
    },
  })
  render()
}

/* ---------- אירועים ---------- */
$('addBtn').addEventListener('click', addFromInput)
$('addInput').addEventListener('input', renderChips)
$('addInput').addEventListener('focus', renderChips)
$('addInput').addEventListener('keydown', e => { if (e.key === 'Enter') addFromInput() })
$('segList').addEventListener('click', () => setMode('list'))
$('segShop').addEventListener('click', () => setMode('shop'))
$('avatar').addEventListener('click', openProfile)
$('scrim').addEventListener('click', closeSheets)
$('sheetSave').addEventListener('click', saveSheet)
$('partyClear').addEventListener('click', async () => { hideParty(); await clearBought() })
$('partyMore').addEventListener('click', hideParty)
$('profClose').addEventListener('click', closeSheets)
$('profSwitch').addEventListener('click', () => {
  const other = partner().id
  store.setProfile(other)
  location.reload()
})

/* אצילת אירועים לרשימה ולגיליון */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-check],[data-open],[data-back],[data-chip],[data-act],[data-sheetact],[data-cat],[data-pick]')
  if (!t) return
  if (t.dataset.check) checkItem(t.dataset.check)
  else if (t.dataset.open) openSheet(t.dataset.open)
  else if (t.dataset.back) { store.setStatus(t.dataset.back, 'open'); toast(COPY.restoreToast) }
  else if (t.dataset.chip) { addItem(t.dataset.chip); $('addInput').value = ''; renderChips() }
  else if (t.dataset.act === 'clear') clearBought()
  else if (t.dataset.sheetact) sheetAction(t.dataset.sheetact)
  else if (t.dataset.cat) {
    $('sheetCats').querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c.dataset.cat === t.dataset.cat))
  }
  else if (t.dataset.pick) chooseUser(t.dataset.pick)
})

/* אופליין */
function updateOnline() {
  $('offlineBar').hidden = navigator.onLine
  $('offlineBar').textContent = COPY.offline
}
window.addEventListener('online', updateOnline)
window.addEventListener('offline', updateOnline)

/* יציאה ממצב סופר כשסוגרים את האפליקציה */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden' && state.mode === 'shop') store.setShopping(false).catch(() => {})
})

/* ---------- כניסה ---------- */
;(function init() {
  $('onboardLogo').innerHTML = LOGO_SVG('a')
  $('brandLogo').innerHTML = LOGO_SVG('b')
  $('addInput').placeholder = COPY.addPlaceholder
  updateOnline()

  /* קישור קסום: #c=קוד-הבית נקלט פעם אחת ונשמר על המכשיר */
  const hashCode = new URLSearchParams(location.hash.replace(/^#/, '')).get('c')
    || new URLSearchParams(location.search).get('c')
  if (hashCode) {
    store.setHouseCode(hashCode)
    history.replaceState(null, '', location.pathname)
  }

  $('codeGo').addEventListener('click', () => {
    const v = normalize($('codeInput').value)
    if (!v) { $('codeInput').focus(); return }
    store.setHouseCode(v)
    finishOnboard()
  })

  /* פרמטרים לבדיקות וצילומי מסך בלבד */
  const q = new URLSearchParams(location.search)
  const as = q.get('as'), demo = q.get('demo'), mode = q.get('mode')

  const saved = store.getProfile()
  const userId = (as && USERS[as]) ? as : saved

  if (demo) prepDemo(demo)
  if (mode === 'shop') state.mode = 'shop'

  if (userId) {
    state.user = userId
    $('onboard').hidden = true
    boot()
  } else {
    $('onboard').hidden = false
  }
})()

/* נתוני דמו לצילומי מסך (רק עם ?demo=) */
function prepDemo(kind) {
  localStorage.removeItem('salsala-items')
  if (kind === 'empty') return
  const mk = (name, by, note = '', status = 'open') =>
    ({ id: 'd' + Math.random().toString(36).slice(2, 8), name, cat: guessCat(name), note, addedBy: by, addedAt: Date.now(), status })
  const seed = [
    mk('עגבניות', 'talia'), mk('מלפפונים', 'shmuel', 'רק אם יפים'), mk('חלב', 'shmuel', '3%'),
    mk('קוטג\'', 'talia'), mk('פיתות', 'talia'), mk('שמן זית', 'shmuel', 'כתית מעולה'),
    mk('טחינה גולמית', 'talia'), mk('במבה', 'shmuel', 'לשבת'), mk('קפה שחור', 'shmuel'),
    mk('מגבונים', 'talia'), mk('אורז בסמטי', 'talia'), mk('לחם', 'shmuel', '', 'bought'),
    mk('שוקולד מריר', 'talia', '', 'later'),
  ]
  if (kind === 'done') seed.forEach(i => { if (i.status !== 'later') { i.status = 'bought'; i.boughtAt = Date.now() } })
  if (kind === 'urgent') {
    seed.push(mk('ביצים', 'shmuel'), mk('סוכר', 'talia'), mk('נייר טואלט', 'shmuel'),
      mk('אבקת כביסה', 'talia'), mk('שמפו', 'shmuel'), mk('פסטה', 'talia'), mk('בצל', 'shmuel'))
  }
  localStorage.setItem('salsala-items', JSON.stringify(seed))
}
