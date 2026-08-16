/* ============================================================
   סלסלה 🎶 שכבת הנתונים
   שני מצבים:
   - ענן (Firebase/Firestore): סנכרון בזמן אמת בין המכשירים + אופליין מלא
   - מקומי (localStorage): כשאין קונפיג, האפליקציה עדיין עובדת על המכשיר
   ============================================================ */
import { firebaseConfig } from './config.js'

const LS_ITEMS = 'salsala-items'
const LS_META = 'salsala-meta'
const LS_HOUSE = 'salsala-house'

/* קוד הבית: נשמר על המכשיר, מגיע מהקישור הקסום או מהקלדה חד פעמית */
export function getHouseCode() { return localStorage.getItem(LS_HOUSE) || null }
export function setHouseCode(c) { localStorage.setItem(LS_HOUSE, (c || '').trim()) }
let HOUSEHOLD_ID = null

let mode = 'local'
let db = null
let myId = null
let onItemsCb = () => {}
let onMetaCb = () => {}
let onRemoteAddCb = () => {}
let localItems = []
let localMeta = { shopping: {} }
let knownIds = null /* לזיהוי פריטים חדשים שהגיעו מהצד השני */

export function getMode() { return mode }

/* ---------- אתחול ---------- */
export async function initStore(userId, { onItems, onMeta, onRemoteAdd }) {
  myId = userId
  onItemsCb = onItems
  onMetaCb = onMeta
  onRemoteAddCb = onRemoteAdd || (() => {})

  HOUSEHOLD_ID = getHouseCode()
  if (firebaseConfig && HOUSEHOLD_ID) {
    try {
      await initFirebase()
      mode = 'cloud'
      return mode
    } catch (e) {
      console.error('Firebase init failed, falling back to local:', e)
    }
  }
  initLocal()
  mode = 'local'
  return mode
}

/* ---------- מצב ענן ---------- */
let fb = null /* מודולים של Firestore, נטענים דינמית */

async function initFirebase() {
  const { initializeApp } = await import('firebase/app')
  const {
    initializeFirestore, persistentLocalCache, persistentMultipleTabManager,
    collection, doc, onSnapshot, setDoc, addDoc, updateDoc, deleteDoc,
    writeBatch, query, orderBy,
  } = await import('firebase/firestore')
  const { getAuth, signInAnonymously, onAuthStateChanged } = await import('firebase/auth')

  fb = { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, writeBatch, query, orderBy }

  const app = initializeApp(firebaseConfig)
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  })

  const auth = getAuth(app)
  await new Promise((resolve, reject) => {
    onAuthStateChanged(auth, user => { if (user) resolve(user) })
    signInAnonymously(auth).catch(reject)
    setTimeout(() => reject(new Error('auth timeout')), 15000)
  })

  /* האזנה חיה לרשימה */
  const itemsQ = query(itemsCol(), orderBy('addedAt', 'asc'))
  onSnapshot(itemsQ, snap => {
    const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    /* זיהוי תוספות מהצד השני, לטוסט ולהבהוב */
    if (knownIds) {
      for (const ch of snap.docChanges()) {
        const data = ch.doc.data()
        if (
          ch.type === 'added' && !knownIds.has(ch.doc.id) &&
          !snap.metadata.hasPendingWrites &&
          data.addedBy && data.addedBy !== myId &&
          Date.now() - (data.addedAt || 0) < 2 * 60 * 1000
        ) onRemoteAddCb({ id: ch.doc.id, ...data })
      }
    }
    knownIds = new Set(snap.docs.map(d => d.id))
    onItemsCb(items)
  }, err => console.error('items listener:', err))

  /* האזנה למטא (מי בסופר עכשיו) */
  onSnapshot(metaDoc(), snap => {
    onMetaCb(snap.exists() ? snap.data() : { shopping: {} })
  }, err => console.error('meta listener:', err))
}

const itemsCol = () => fb.collection(db, 'households', HOUSEHOLD_ID, 'items')
const metaDoc = () => fb.doc(db, 'households', HOUSEHOLD_ID, 'meta', 'profile')
const histCol = () => fb.collection(db, 'households', HOUSEHOLD_ID, 'history')

/* ---------- מצב מקומי ---------- */
function initLocal() {
  try { localItems = JSON.parse(localStorage.getItem(LS_ITEMS) || '[]') } catch { localItems = [] }
  try { localMeta = JSON.parse(localStorage.getItem(LS_META) || '{"shopping":{}}') } catch { localMeta = { shopping: {} } }
  queueMicrotask(() => { onItemsCb([...localItems]); onMetaCb({ ...localMeta }) })
}
function saveLocal() {
  localStorage.setItem(LS_ITEMS, JSON.stringify(localItems))
  onItemsCb([...localItems])
}
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/* ---------- API אחיד ---------- */
export async function addItem({ name, cat, note = '' }) {
  const item = {
    name, cat, note,
    status: 'open',
    addedBy: myId,
    addedAt: Date.now(),
  }
  if (mode === 'cloud') {
    const ref = await fb.addDoc(itemsCol(), item)
    logHistory({ name, cat, action: 'added' })
    return ref.id
  }
  item.id = uid()
  localItems.push(item)
  saveLocal()
  return item.id
}

export async function updateItem(id, patch) {
  if (mode === 'cloud') {
    await fb.updateDoc(fb.doc(db, 'households', HOUSEHOLD_ID, 'items', id), patch)
    return
  }
  const it = localItems.find(i => i.id === id)
  if (it) Object.assign(it, patch)
  saveLocal()
}

export async function setStatus(id, status) {
  const patch = { status }
  if (status === 'bought') { patch.boughtBy = myId; patch.boughtAt = Date.now() }
  if (status === 'later') { patch.laterAt = Date.now() }
  await updateItem(id, patch)
  if (mode === 'cloud' && status === 'bought') {
    logHistory({ id, action: 'bought' })
  }
}

export async function removeItem(id) {
  if (mode === 'cloud') {
    await fb.deleteDoc(fb.doc(db, 'households', HOUSEHOLD_ID, 'items', id))
    return
  }
  localItems = localItems.filter(i => i.id !== id)
  saveLocal()
}

export async function clearBought(items) {
  const bought = items.filter(i => i.status === 'bought')
  if (mode === 'cloud') {
    const batch = fb.writeBatch(db)
    for (const it of bought) batch.delete(fb.doc(db, 'households', HOUSEHOLD_ID, 'items', it.id))
    await batch.commit()
    return bought.length
  }
  localItems = localItems.filter(i => i.status !== 'bought')
  saveLocal()
  return bought.length
}

export async function setShopping(flag) {
  if (mode === 'cloud') {
    await fb.setDoc(metaDoc(), { shopping: { [myId]: flag } }, { merge: true })
    return
  }
  localMeta.shopping = { ...localMeta.shopping, [myId]: flag }
  localStorage.setItem(LS_META, JSON.stringify(localMeta))
  onMetaCb({ ...localMeta })
}

/* היסטוריה: הדלק של "ההצעות החכמות" בשלב הבא */
async function logHistory(event) {
  try {
    await fb.addDoc(histCol(), { ...event, by: myId, at: Date.now() })
  } catch (e) { console.warn('history log failed', e) }
}

/* ---------- פרופיל מקומי למכשיר ---------- */
export function getProfile() { return localStorage.getItem('salsala-user') || null }
export function setProfile(userId) { localStorage.setItem('salsala-user', userId) }
