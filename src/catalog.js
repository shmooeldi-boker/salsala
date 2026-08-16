/* ============================================================
   סלסלה 🎶 קטלוג: קטגוריות, מילון מוצרים, בסיסיים, וכל הקופי
   ============================================================ */

export const CATS = [
  { id: 'veg',    emoji: '🥬', name: 'פירות וירקות',            color: '#3DA35D' },
  { id: 'bread',  emoji: '🍞', name: 'לחם ומאפים',              color: '#C98B3D' },
  { id: 'dairy',  emoji: '🥛', name: 'חלב, גבינות וביצים',      color: '#4D9DE0' },
  { id: 'meat',   emoji: '🥩', name: 'בשר ודגים',               color: '#D64550' },
  { id: 'dry',    emoji: '🌾', name: 'קטניות, אורז ויבשים',     color: '#A67C52' },
  { id: 'pantry', emoji: '🥫', name: 'שימורים, רטבים ותבלינים', color: '#E1793D' },
  { id: 'frozen', emoji: '🧊', name: 'קפואים',                  color: '#5BC0EB' },
  { id: 'snacks', emoji: '🍫', name: 'חטיפים ומתוקים',          color: '#C05299' },
  { id: 'drinks', emoji: '🧃', name: 'משקאות',                  color: '#F29E4C' },
  { id: 'disp',   emoji: '🍽️', name: 'חד״פ וכלי מטבח',          color: '#8D99AE' },
  { id: 'baby',   emoji: '👶', name: 'תינוקות',                 color: '#E779A9' },
  { id: 'clean',  emoji: '🧼', name: 'ניקיון והיגיינה',         color: '#48B8D0' },
  { id: 'misc',   emoji: '📦', name: 'שונות',                   color: '#9B9B7A' },
]
export const catById = id => CATS.find(c => c.id === id) || CATS[CATS.length - 1]

/* מילון שיוך אוטומטי: שם מוצר ← קטגוריה */
export const DICT = {
  /* פירות וירקות */
  'עגבניות':'veg','עגבניה':'veg','עגבניות שרי':'veg','מלפפון':'veg','מלפפונים':'veg','בצל':'veg','בצל סגול':'veg',
  'שום':'veg','גזר':'veg','תפוחי אדמה':'veg','תפוח אדמה':'veg','בטטה':'veg','פלפל':'veg','פלפל אדום':'veg',
  'חסה':'veg','כרוב':'veg','כרובית':'veg','ברוקולי':'veg','קישוא':'veg','קישואים':'veg','חציל':'veg','חצילים':'veg',
  'אבוקדו':'veg','בננות':'veg','תפוחים':'veg','תפוח':'veg','אגסים':'veg','לימון':'veg','לימונים':'veg','תפוזים':'veg',
  'קלמנטינות':'veg','ענבים':'veg','אבטיח':'veg','מלון':'veg','תות':'veg','תותים':'veg','אננס':'veg','מנגו':'veg',
  'פטריות':'veg','פטרוזיליה':'veg','כוסברה':'veg','שמיר':'veg','נענע':'veg','בזיליקום':'veg','תרד':'veg',
  'סלרי':'veg','צנונית':'veg','סלק':'veg','דלעת':'veg','שומר':'veg','כרישה':'veg','עירית':'veg','רימון':'veg',
  'אפרסק':'veg','שזיף':'veg','נקטרינה':'veg','קיווי':'veg','זנגביל':'veg',

  /* לחם ומאפים */
  'לחם':'bread','לחם מלא':'bread','לחם אחיד':'bread','פיתות':'bread','חלה':'bread','חלות':'bread','לחמניות':'bread',
  'בגט':'bread','טורטיה':'bread','טורטיות':'bread','לאפה':'bread','לאפות':'bread','קרואסון':'bread','פוקצ׳ה':'bread',
  'לחם קל':'bread','בייגלה טרי':'bread',

  /* חלב, גבינות וביצים */
  'חלב':'dairy','חלב 3%':'dairy','חלב 1%':'dairy','חלב שקדים':'dairy','חלב שיבולת שועל':'dairy','חלב סויה':'dairy',
  'קוטג\'':'dairy','קוטג':'dairy','גבינה לבנה':'dairy','גבינה צהובה':'dairy','גבינה בולגרית':'dairy','בולגרית':'dairy',
  'גבינת שמנת':'dairy','גבינה מלוחה':'dairy','מוצרלה':'dairy','פרמזן':'dairy','צפתית':'dairy','לאבנה':'dairy',
  'ביצים':'dairy','חמאה':'dairy','יוגורט':'dairy','יוגורטים':'dairy','שמנת':'dairy','שמנת מתוקה':'dairy',
  'שמנת חמוצה':'dairy','מעדן':'dairy','מעדנים':'dairy','לבן':'dairy','אשל':'dairy','גיל':'dairy','מילקי':'dairy',
  'קפיר':'dairy','ריקוטה':'dairy',

  /* בשר ודגים */
  'עוף':'meat','חזה עוף':'meat','שוקיים':'meat','כרעיים':'meat','פרגית':'meat','פרגיות':'meat','הודו':'meat',
  'שניצל':'meat','בשר טחון':'meat','טחון':'meat','אנטריקוט':'meat','צלעות':'meat','כבד':'meat','קבב':'meat',
  'נקניקיות':'meat','נקניק':'meat','פסטרמה':'meat','סלמון':'meat','דניס':'meat','אמנון':'meat','טונה טרייה':'meat',
  'דג':'meat','דגים':'meat',

  /* קטניות, אורז ויבשים */
  'אורז':'dry','אורז בסמטי':'dry','אורז מלא':'dry','פסטה':'dry','ספגטי':'dry','פתיתים':'dry','קוסקוס':'dry',
  'בורגול':'dry','קינואה':'dry','עדשים':'dry','עדשים כתומות':'dry','חומוס יבש':'dry','שעועית לבנה':'dry',
  'אפונה יבשה':'dry','גריסים':'dry','קמח':'dry','קמח מלא':'dry','סוכר':'dry','סוכר חום':'dry','שיבולת שועל':'dry',
  'גרנולה':'dry','פריכיות':'dry','אטריות':'dry','נודלס':'dry','סולת':'dry','צימוקים':'dry','אגוזים':'dry',
  'שקדים':'dry','קשיו':'dry','בוטנים':'dry','גרעינים':'dry','זרעי צ׳יה':'dry','פירורי לחם':'dry',

  /* שימורים, רטבים ותבלינים */
  'שמן':'pantry','שמן זית':'pantry','שמן קנולה':'pantry','שמן קוקוס':'pantry','חומץ':'pantry','חומץ בלסמי':'pantry',
  'טחינה':'pantry','טחינה גולמית':'pantry','חומוס':'pantry','מטבוחה':'pantry','חמוצים':'pantry','זיתים':'pantry',
  'טונה':'pantry','טונה בשמן':'pantry','תירס':'pantry','רסק עגבניות':'pantry','עגבניות מרוסקות':'pantry',
  'קטשופ':'pantry','מיונז':'pantry','חרדל':'pantry','סויה':'pantry','רוטב סויה':'pantry','צ׳ילי מתוק':'pantry',
  'סחוג':'pantry','עמבה':'pantry','מלח':'pantry','פלפל שחור':'pantry','פפריקה':'pantry','כמון':'pantry',
  'כורכום':'pantry','קינמון':'pantry','אבקת מרק':'pantry','אבקת אפייה':'pantry','שמרים':'pantry','וניל':'pantry',
  'דבש':'pantry','סילאן':'pantry','ריבה':'pantry','חמאת בוטנים':'pantry','שוקולד למריחה':'pantry','קורנפלור':'pantry',

  /* קפואים */
  'שניצל תירס':'frozen','שניצל קפוא':'frozen','ירקות קפואים':'frozen','אפונה קפואה':'frozen','תירס קפוא':'frozen',
  'שעועית קפואה':'frozen','גלידה':'frozen','ארטיקים':'frozen','בצק עלים':'frozen','בצק פילו':'frozen',
  'מלאווח':'frozen','ג׳חנון':'frozen','בורקס קפוא':'frozen','פיצה קפואה':'frozen','אדממה':'frozen',

  /* חטיפים ומתוקים */
  'במבה':'snacks','ביסלי':'snacks','שוקולד':'snacks','שוקולד מריר':'snacks','עוגיות':'snacks','וופלים':'snacks',
  'חטיף':'snacks','חטיפים':'snacks','צ׳יפס':'snacks','תפוצ׳יפס':'snacks','פופקורן':'snacks','בייגלה':'snacks',
  'קרקרים':'snacks','מרשמלו':'snacks','סוכריות':'snacks','מסטיק':'snacks','חטיף אנרגיה':'snacks','עוגה':'snacks',
  'קליק':'snacks','פרה':'snacks',

  /* משקאות */
  'קפה':'drinks','קפה שחור':'drinks','קפה נמס':'drinks','קפסולות קפה':'drinks','תה':'drinks','תה ירוק':'drinks',
  'חליטה':'drinks','מיץ':'drinks','מיץ תפוזים':'drinks','סודה':'drinks','קולה':'drinks','ספרייט':'drinks',
  'מים':'drinks','מים מינרלים':'drinks','בירה':'drinks','יין':'drinks','יין אדום':'drinks','יין לבן':'drinks',
  'שוקו':'drinks','לימונדה':'drinks','פטל':'drinks',

  /* חד״פ וכלי מטבח */
  'כוסות חד פעמי':'disp','צלחות חד פעמי':'disp','סכו״ם חד פעמי':'disp','מפיות':'disp','נייר אפייה':'disp',
  'נייר כסף':'disp','ניילון נצמד':'disp','שקיות אוכל':'disp','שקיות סנדוויץ':'disp','שקיות זבל':'disp',
  'שקיות אשפה':'disp','קשיות':'disp','גפרורים':'disp','נרות':'disp','נרות שבת':'disp',

  /* תינוקות */
  'חיתולים':'baby','טיטולים':'baby','מגבונים':'baby','דייסה':'baby','מטרנה':'baby','סימילאק':'baby',
  'בקבוק':'baby','מוצץ':'baby','משחת החתלה':'baby','שמפו לתינוק':'baby',

  /* ניקיון והיגיינה */
  'סבון כלים':'clean','נוזל כלים':'clean','אקונומיקה':'clean','נייר טואלט':'clean','מגבת נייר':'clean',
  'נייר סופג':'clean','אבקת כביסה':'clean','ג׳ל כביסה':'clean','מרכך כביסה':'clean','מרכך':'clean',
  'שמפו':'clean','מרכך שיער':'clean','סבון':'clean','סבון גוף':'clean','משחת שיניים':'clean','מברשת שיניים':'clean',
  'דאודורנט':'clean','ספוגים':'clean','סקוץ׳':'clean','מטליות':'clean','נוזל רצפות':'clean','מסיר שומנים':'clean',
  'תרסיס ניקוי':'clean','כפפות':'clean','קרם ידיים':'clean','תחבושות':'clean','אקמול':'clean',
}

/* מוצרי בסיס: כשהם חסרים, מד המצב קופץ מהר יותר */
export const BASICS = new Set([
  'חלב','לחם','ביצים','עגבניות','מלפפונים','בצל','תפוחי אדמה','קפה','סוכר','מלח','קמח',
  'שמן','שמן זית','אורז','פסטה','גבינה לבנה','קוטג\'','חמאה','נייר טואלט','סבון כלים',
  'אבקת כביסה','שמפו','משחת שיניים','מגבונים','חיתולים',
])

export const FREQ_DEFAULT = ['חלב', 'לחם', 'ביצים', 'עגבניות', 'מלפפונים', 'קפה']

/* ============ המשתמשים ============ */
export const USERS = {
  shmuel: { id: 'shmuel', name: 'שמואל', initial: 'ש', g: 'm', cls: 'shmuel', partner: 'talia' },
  talia:  { id: 'talia',  name: 'טליה',  initial: 'ט', g: 'f', cls: 'talia',  partner: 'shmuel' },
}

/* ============ קופי: ממוגדר, שמח, עם סלסול ============ */
const M = s => s /* עוזר קריאות בלבד */

export const COPY = {
  greeting(user) {
    const h = new Date().getHours()
    const royal = user.g === 'm' ? 'יא מלך' : 'יא מלכה'
    if (h >= 22 || h < 5) return `עוד ערים? גם הסלסלה 🌙`
    if (h < 12) return `בוקר טוב ${royal} ☀️`
    if (h < 17) return `צהריים טובים, נשמה 🌞`
    return `ערב טוב יא עיני 🌙`
  },

  coupleLines: [
    'שני לבבות, עגלה אחת 🎶',
    'את ואני וסל מלא, זה כל השיר 🎶',
    'לב אחד, רשימה אחת 🎶',
    'קניות ביחד זו אהבה בתכל׳ס 🎶',
    'הבית שלנו מתחיל בסלסלה 🎶',
  ],

  addToasts: [
    (item) => `${item} נכנס לסלסלה 🎶`,
    (item, partner) => `נרשם! ${partner.name} ${partner.g === 'f' ? 'רואה' : 'רואה'} את זה עכשיו`,
    () => `יאללה, עוד אחד בפנים 🧺`,
    (item) => `${item} סולסל פנימה 🎵`,
  ],

  checkToasts: [
    (item, left) => `יש! נשארו ${left}`,
    (item) => `${item} בעגלה 🛒`,
    () => `עוד צעד לניצחון 💪`,
  ],

  laterToast: item => `${item} שמור לפעם אחרת 😴`,
  deleteToast: item => `${item} נמחק 🗑`,
  restoreToast: 'חזר לרשימה ↩️',
  dupToast: 'כבר בסלסלה 😉',
  clearToast: n => `נוקו ${n} מוצרים. מוכנים לסיבוב הבא 🧺`,

  remoteAdd: (partner, item) =>
    `🎶 ${partner.name} ${partner.g === 'f' ? 'הוסיפה' : 'הוסיף'} עכשיו: ${item}`,
  shoppingBanner: partner =>
    `🛒 ${partner.name} עכשיו בסופר! ${partner.g === 'f' ? 'נזכרת' : 'נזכרתם'} במשהו? זה הרגע`,

  celebrate: {
    title: 'מברוק! 🎉',
    sub: n => `סגרתם את כל הרשימה. ${n} מוצרים, אפס פספוסים.`,
    clear: 'נקה והתחל רשימה חדשה',
    more: 'רגע, עוד משהו...',
  },

  welcome: user =>
    `אהלן ${user.name}! מהיום הרשימה שרה איתכם 🎶`,

  emptyList: {
    title: 'הסלסלה ריקה (בינתיים)',
    text: 'כל מה שנגמר בבית, זורקים לפה.<br>בסופר זה יחכה לכם, מסודר לפי מדפים.',
  },
  emptyShop: {
    title: 'אין מה לקנות?!',
    text: 'תתחדשו על רגע נדיר 🙂<br>אם נזכרתם במשהו, הוא במרחק הקלדה.',
  },

  offline: 'אין קליטה 📶 הכל נשמר ויסתנכרן ברגע שתחזרו לאוויר',

  addPlaceholder: 'מה נגמר? חלב, מלפפון, שוקולד...',
  freqLead: 'הקבועים שלכם:',
}

/* ============ מד מצב הבית ============ */
export function gauge(openItems) {
  const basics = openItems.filter(i => BASICS.has(i.name.trim())).length
  const score = openItems.length + basics * 1.5
  const pct = Math.min(Math.min(score / 22, 1) * 100, 97)
  if (score === 0)  return { pct: 2,   label: 'הבית מלא, הלב מלא 💚', tone: 'calm' }
  if (score <= 4)   return { pct, label: 'רגוע, הכל בשליטה 😌',        tone: 'calm' }
  if (score <= 9)   return { pct, label: 'מתחיל להצטבר 📝',            tone: 'mid' }
  if (score <= 16)  return { pct, label: 'שווה לתכנן קנייה 🛒',        tone: 'warm' }
  return { pct, label: 'דחוף דחוף לעשות קניות! 🚨', tone: 'urgent' }
}

/* ============ עזרים ============ */
export function normalize(s) { return (s || '').trim().replace(/\s+/g, ' ') }

export function guessCat(name) {
  const n = normalize(name)
  if (DICT[n]) return DICT[n]
  for (const k in DICT) if (n.includes(k)) return DICT[k]
  return 'misc'
}
