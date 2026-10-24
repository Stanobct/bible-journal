/* Bible journal v5.1 - fichier 2 sur 6 : Bible, lectures AELF, journal */
"use strict";

/* ---------- Livres : [nom, abreviations, noms anglais] ---------- */
const LIVRES = [
  ["Gen\u00e8se", "gn,gen", "genesis"], ["Exode", "ex,exo", "exodus"], ["L\u00e9vitique", "lv,lev", "leviticus"],
  ["Nombres", "nb,nom", "numbers"], ["Deut\u00e9ronome", "dt,deut", "deuteronomy"], ["Josu\u00e9", "jos", "joshua"],
  ["Juges", "jg,jug", "judges"], ["Ruth", "rt,ru", "ruth"], ["1 Samuel", "1s,1sam", "1samuel"],
  ["2 Samuel", "2s,2sam", "2samuel"], ["1 Rois", "1r,1ro", "1kings"], ["2 Rois", "2r,2ro", "2kings"],
  ["1 Chroniques", "1ch,1chr", "1chronicles"], ["2 Chroniques", "2ch,2chr", "2chronicles"], ["Esdras", "esd", "ezra"],
  ["N\u00e9h\u00e9mie", "ne,neh", "nehemiah"], ["Tobie", "tb,tob", "tobit,tobias"], ["Judith", "jdt", "judith"],
  ["Esther", "est", "esther"], ["1 Maccab\u00e9es", "1m,1mac", "1maccabees"], ["2 Maccab\u00e9es", "2m,2mac", "2maccabees"],
  ["Job", "jb", "job"], ["Psaumes", "ps", "psalms,psalm"], ["Proverbes", "pr,prov", "proverbs"],
  ["Eccl\u00e9siaste", "qo,qoh,ecc,qohelet", "ecclesiastes"], ["Cantique des cantiques", "ct,cant,cantique", "songofsolomon,songofsongs,canticles"],
  ["Sagesse", "sg,sag", "wisdom,wisdomofsolomon"], ["Eccl\u00e9siastique", "si,sir,siracide", "sirach,ecclesiasticus"],
  ["Isa\u00efe", "is", "isaiah"], ["J\u00e9r\u00e9mie", "jr,jer", "jeremiah"], ["Lamentations", "lm,lam", "lamentations"],
  ["Baruch", "ba,bar", "baruch"], ["\u00c9z\u00e9chiel", "ez,ezk", "ezekiel"], ["Daniel", "dn,dan", "daniel"],
  ["Os\u00e9e", "os", "hosea"], ["Jo\u00ebl", "jl", "joel"], ["Amos", "am", "amos"], ["Abdias", "ab,abd", "obadiah"],
  ["Jonas", "jon", "jonah"], ["Mich\u00e9e", "mi", "micah"], ["Nahum", "na", "nahum"], ["Habacuc", "ha,hab", "habakkuk"],
  ["Sophonie", "so,soph", "zephaniah"], ["Agg\u00e9e", "ag", "haggai"], ["Zacharie", "za,zac", "zechariah"],
  ["Malachie", "ml,mal", "malachi"], ["Matthieu", "mt", "matthew"], ["Marc", "mc", "mark"], ["Luc", "lc", "luke"],
  ["Jean", "jn", "john"], ["Actes des Ap\u00f4tres", "ac,act,actes", "acts,actsoftheapostles"], ["Romains", "rm,rom", "romans"],
  ["1 Corinthiens", "1co,1cor", "1corinthians"], ["2 Corinthiens", "2co,2cor", "2corinthians"], ["Galates", "ga,gal", "galatians"],
  ["\u00c9ph\u00e9siens", "ep,eph", "ephesians"], ["Philippiens", "ph,phil", "philippians"], ["Colossiens", "col", "colossians"],
  ["1 Thessaloniciens", "1th", "1thessalonians"], ["2 Thessaloniciens", "2th", "2thessalonians"],
  ["1 Timoth\u00e9e", "1tm,1tim", "1timothy"], ["2 Timoth\u00e9e", "2tm,2tim", "2timothy"], ["Tite", "tt,tit", "titus"],
  ["Phil\u00e9mon", "phm", "philemon"], ["H\u00e9breux", "he,heb", "hebrews"], ["Jacques", "jc,jac", "james"],
  ["1 Pierre", "1p,1pi", "1peter"], ["2 Pierre", "2p,2pi", "2peter"], ["1 Jean", "1jn", "1john"],
  ["2 Jean", "2jn", "2john"], ["3 Jean", "3jn", "3john"], ["Jude", "jude", "jude"],
  ["Apocalypse", "ap,apoc", "revelation,revelationofjohn"]
];
function cleNom(s) {
  return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/^(iii|ii|i)\s+/, m => ({ iii: "3", ii: "2", i: "1" })[m.trim()])
    .replace(/[^a-z0-9]/g, "");
}
const INDEX_LIVRES = {};
LIVRES.forEach((l, i) => {
  [l[0]].concat(l[1].split(","), l[2].split(",")).forEach(k => { if (k) INDEX_LIVRES[cleNom(k)] = i; });
});
const VERSETS_FORCE = ["1 Corinthiens|10|13", "Philippiens|4|13", "Romains|8|1", "2 Corinthiens|12|9", "Hebreux|4|15",
  "Hebreux|4|16", "Jacques|4|7", "Galates|5|1", "Jean|8|36", "1 Jean|1|9", "Romains|12|21", "Matthieu|11|28",
  "Isaie|41|10", "Jean|16|33", "1 Pierre|5|7", "Romains|5|20", "Matthieu|5|8", "Ezechiel|36|26", "2 Timothee|1|7",
  "Jacques|1|12", "Romains|8|28", "Luc|15|20", "Jean|15|5", "Matthieu|26|41", "1 Thessaloniciens|4|3"];

/* ---------- Chargement de la Bible Crampon ---------- */
let BIBLE = null;
let promesseBible = null;
const SOURCES_BIBLE = [
  "crampon.json",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/FreCrampon.json",
  "https://cdn.jsdelivr.net/gh/scrollmapper/bible_databases@master/formats/json/FreCrampon.json",
  "https://raw.githubusercontent.com/scrollmapper/bible_databases/master/json/FreCrampon.json"
];
function analyserBible(json) {
  const bruts = Array.isArray(json) ? json : (json.books || json.Books || []);
  const livres = [];
  for (const b of bruts) {
    if (!b) continue;
    const nomBrut = String(b.name || b.book || b.title || b.abbrev || "");
    const idx = INDEX_LIVRES[cleNom(nomBrut)];
    const chapitres = liste(b.chapters).map((c, ci) => {
      if (Array.isArray(c)) return { n: ci + 1, versets: c.map((t, vi) => [vi + 1, String(t).trim()]) };
      return { n: Number(c.chapter || c.number || ci + 1), versets: liste(c.verses).map((v, vi) => typeof v === "string" ? [vi + 1, v.trim()] : [Number(v.verse || v.number || vi + 1), String(v.text || "").trim()]) };
    }).filter(c => c.versets.length);
    if (chapitres.length) livres.push({ idx: idx == null ? 999 : idx, nom: idx == null ? nomBrut : LIVRES[idx][0], chapitres });
  }
  livres.sort((a, b) => a.idx - b.idx);
  return { livres };
}
async function telechargerBible() {
  try { const c = await lire("bible-crampon"); if (c && c.livres && c.livres.length) { BIBLE = c; return c; } } catch (e) {}
  let pb = "";
  for (const url of SOURCES_BIBLE) {
    try {
      const r = await fetch(url);
      if (!r.ok) { pb = "erreur " + r.status; continue; }
      const b = analyserBible(await r.json());
      if (!b.livres.length) { pb = "fichier vide"; continue; }
      BIBLE = b;
      ecrire("bible-crampon", b).catch(() => {});
      return b;
    } catch (e) { pb = e.message; }
  }
  throw new Error(pb || "aucune source");
}
function chargerBible() {
  if (BIBLE) return Promise.resolve(BIBLE);
  if (!promesseBible) promesseBible = telechargerBible().catch(e => { promesseBible = null; throw e; });
  return promesseBible;
}
function trouverLivre(nom) {
  if (!BIBLE) return null;
  const c = cleNom(nom);
  const i = INDEX_LIVRES[c];
  if (i != null) { const l = BIBLE.livres.find(x => x.idx === i); if (l) return l; }
  return BIBLE.livres.find(x => cleNom(x.nom) === c) || null;
}
function chapitre(livre, n) { return livre.chapitres.find(c => c.n === n) || null; }
function texteVerset(nom, c, v) {
  const l = trouverLivre(nom);
  const ch = l && chapitre(l, c);
  const x = ch && ch.versets.find(y => y[0] === v);
  return x ? x[1] : null;
}
function versetHasard() {
  if (!BIBLE) return null;
  for (let i = 0; i < 12; i++) {
    const [l, c, v] = VERSETS_FORCE[Math.floor(Math.random() * VERSETS_FORCE.length)].split("|");
    const t = texteVerset(l, Number(c), Number(v));
    if (t) return { livre: trouverLivre(l).nom, c: Number(c), v: Number(v), texte: t };
  }
  return null;
}
function analyserRef(ref) {
  const s = String(ref || "").replace(/\u00a0/g, " ").replace(/^\s*cf\.?\s*/i, "").trim();
  const m = s.match(/^((?:[1-3]\s*)?[A-Za-z\u00c0-\u00ff][A-Za-z\u00c0-\u00ff'\s]*?)\.?\s*(\d+)\s*(?:$(\d+)$)?\s*(?:[,.:]\s*(\d+))?/);
  if (!m) return null;
  return { livre: m[1].trim(), chapitres: m[3] ? [Number(m[3]), Number(m[2])] : [Number(m[2])], verset: m[4] ? Number(m[4]) : 0 };
}

/* ---------- Lecteur ---------- */
const lecteur = { nom: "", chap: 1, cible: 0 };
if (prefs.lecteur && typeof prefs.lecteur === "object") { lecteur.nom = String(prefs.lecteur.nom || ""); lecteur.chap = Number(prefs.lecteur.chap) || 1; }
function sauverLecteur() { prefs.lecteur = { nom: lecteur.nom, chap: lecteur.chap }; sauverPrefs(); }
function changerTaille(d) { prefs.taille = Math.min(28, Math.max(14, (Number(prefs.taille) || 19) + d)); sauverPrefs(); rendreLecteur(); }

async function allerA(ref) {
  const r = analyserRef(ref);
  if (!r) return "r\u00e9f\u00e9rence illisible";
  try { await chargerBible(); } catch (e) { return "Bible pas encore charg\u00e9e"; }
  const livre = trouverLivre(r.livre);
  if (!livre) return "livre introuvable : " + r.livre;
  for (const c of r.chapitres) {
    if (chapitre(livre, c)) {
      lecteur.nom = livre.nom; lecteur.chap = c; lecteur.cible = r.verset || -1;
      sauverLecteur(); rendreLecteur();
      return "";
    }
  }
  return "chapitre introuvable";
}

function rendreLecteur() {
  const zone = $("p-lecteur");
  if (!zone) return;
  if (!BIBLE) {
    zone.replaceChildren(el("p", { className: "doux" }, "Chargement de la Bible Crampon\u2026 (la premi\u00e8re fois, cela peut prendre une minute)"));
    chargerBible().then(() => rendreLecteur()).catch(e => zone.replaceChildren(
      el("p", { className: "doux" }, "Impossible de charger la Bible : " + e.message),
      bouton("R\u00e9essayer", rendreLecteur, "petit")));
    return;
  }
  const livre = trouverLivre(lecteur.nom) || trouverLivre("Jean") || BIBLE.livres[0];
  const ch = chapitre(livre, lecteur.chap) || livre.chapitres[0];
  lecteur.nom = livre.nom; lecteur.chap = ch.n;
  const iLivre = BIBLE.livres.indexOf(livre);
  const iChap = livre.chapitres.indexOf(ch);
  function aller(li, ci) {
    const l = BIBLE.livres[li]; if (!l) return;
    const c = l.chapitres[ci < 0 ? l.chapitres.length - 1 : ci]; if (!c) return;
    lecteur.nom = l.nom; lecteur.chap = c.n; lecteur.cible = -1;
    sauverLecteur(); rendreLecteur();
  }
  const prec = () => { if (iChap > 0) aller(iLivre, iChap - 1); else aller(iLivre - 1, -1); };
  const suiv = () => { if (iChap < livre.chapitres.length - 1) aller(iLivre, iChap + 1); else aller(iLivre + 1, 0); };
  const selLivre = el("select", null, BIBLE.livres.map((l, i) => el("option", { value: String(i) }, l.nom)));
  selLivre.value = String(iLivre);
  selLivre.onchange = () => aller(Number(selLivre.value), 0);
  const selChap = el("select", null, livre.chapitres.map((c, i) => el("option", { value: String(i) }, String(c.n))));
  selChap.value = String(iChap);
  selChap.onchange = () => aller(iLivre, Number(selChap.value));
  const texte = el("div", { className: "texte-bible", style: "font-size:" + (Number(prefs.taille) || 19) + "px" });
  for (const [n, t] of ch.versets) {
    const coul = etat.surlignages[livre.nom + "|" + ch.n + "|" + n];
    texte.append(el("span", { className: "verset" + (coul ? " c-" + coul : ""), id: "v-" + n, onclick: () => menuVerset(livre.nom, ch.n, n, t) }, el("sup", null, String(n)), t), " ");
  }
  zone.replaceChildren(
    el("div", { className: "rangee" }, selLivre, selChap, bouton("A\u2212", () => changerTaille(-1), "petit secondaire"), bouton("A+", () => changerTaille(1), "petit secondaire")),
    el("h3", null, livre.nom + " " + ch.n),
    texte,
    el("div", { className: "rangee", style: "justify-content:space-between;margin-top:12px" },
      bouton("\u25C0 Pr\u00e9c\u00e9dent", prec, "petit secondaire"), bouton("Suivant \u25B6", suiv, "petit secondaire")));
  if (lecteur.cible) {
    const versetCible = lecteur.cible > 0 ? $("v-" + lecteur.cible) : null;
    const cible = versetCible || zone;
    if (versetCible) versetCible.classList.add("choisi");
    lecteur.cible = 0;
    setTimeout(() => cible.scrollIntoView({ behavior: "smooth", block: versetCible ? "center" : "start" }), 60);
  }
}

function menuVerset(nomLivre, c, v, t) {
  const ref = nomLivre + " " + c + ", " + v;
  const cle = nomLivre + "|" + c + "|" + v;
  const majCouleur = co => { if (co) etat.surlignages[cle] = co; else delete etat.surlignages[cle]; sauver(); fermerModale(); rendreLecteur(); };
  ouvrirModale(
    el("h3", null, ref),
    el("p", { className: "texte-bible" }, t),
    el("p", { className: "doux" }, "Surligner :"),
    el("div", { className: "rangee" },
      ["jaune", "vert", "bleu", "rose"].map(co => el("button", { type: "button", className: "pastille c-" + co, "aria-label": co, onclick: () => majCouleur(co) })),
      bouton("Effacer", () => majCouleur(null), "petit secondaire")),
    el("div", { className: "rangee" },
      bouton("\u270D\uFE0F \u00c9crire une note", () => ecrireEntree({ ref, verset: t })),
      bouton("Copier", () => copier(t + " (" + ref + ")"), "secondaire")));
}

/* ---------- Lectures AELF ---------- */
let jourAffiche = iso();
const TYPES_LECTURE = { lecture_1: "Premi\u00e8re lecture", lecture_2: "Deuxi\u00e8me lecture", lecture_3: "Troisi\u00e8me lecture", psaume: "Psaume", cantique: "Cantique", sequence: "S\u00e9quence", epitre: "\u00c9p\u00eetre", evangile: "\u00c9vangile" };
function depot() {
  const h = location.hostname;
  if (!h.endsWith(".github.io")) return null;
  const p = location.pathname.split("/").filter(Boolean);
  return { user: h.replace(".github.io", ""), repo: p[0] || h };
}
async function aelf(type, date, zone) {
  const nom = "aelf/" + type + "-" + date + "-" + zone + ".json";
  const d = depot();
  const urls = [nom];
  if (d) {
    urls.push("https://raw.githubusercontent.com/" + d.user + "/" + d.repo + "/main/" + nom);
    urls.push("https://raw.githubusercontent.com/" + d.user + "/" + d.repo + "/master/" + nom);
    urls.push("https://cdn.jsdelivr.net/gh/" + d.user + "/" + d.repo + "@main/" + nom);
  }
  urls.push("https://api.aelf.org/v1/" + type + "/" + date + "/" + zone);
  for (const u of urls) {
    try { const r = await fetch(u); if (r.ok) return await r.json(); } catch (e) {}
  }
  throw new Error("lectures indisponibles");
}
function carteLecture(l) {
  const titre = TYPES_LECTURE[l.type] || String(l.type || "Lecture").replace(/_/g, " ");
  const details = el("div", { className: "lecture-texte", hidden: true });
  if (l.intro_lue) details.append(el("p", null, el("em", null, nettoyerHTML(l.intro_lue))));
  if (l.refrain_psalmique) details.append(el("p", null, el("strong", null, nettoyerHTML(l.refrain_psalmique))));
  details.append(nettoyerHTML(l.contenu));
  const msg = el("span", { className: "doux" });
  const btnLire = bouton("Lire", () => { details.hidden = !details.hidden; btnLire.textContent = details.hidden ? "Lire" : "Masquer"; }, "petit secondaire");
  return el("div", { className: "carte" },
    el("h3", null, titre + (l.ref ? " \u2014 " + l.ref : "")),
    l.titre ? el("p", { className: "doux" }, nettoyerHTML(l.titre)) : null,
    el("div", { className: "rangee" },
      btnLire,
      l.ref ? bouton("Ouvre ta Bible \u00e0 ce passage", async () => { msg.textContent = "\u2026"; const pb = await allerA(l.ref); msg.textContent = pb ? "(" + pb + ")" : ""; }, "petit") : null,
      bouton("M\u00e9diter", () => ecrireEntree({ ref: l.ref || titre }), "petit secondaire"),
      msg),
    details);
}
async function rendreLectures() {
  const boite = $("p-lectures");
  const date = jourAffiche;
  boite.replaceChildren(el("p", { className: "doux" }, "Chargement des lectures\u2026"));
  try {
    const info = await aelf("informations", date, prefs.zone).catch(() => null);
    if (date !== jourAffiche) return;
    const i = info && (info.informations || info);
    $("p-liturgie").textContent = i ? [i.jour_liturgique_nom || i.ligne1 || "", i.fete && i.fete !== i.jour_liturgique_nom ? i.fete : "", i.couleur ? "(" + i.couleur + ")" : ""].filter(Boolean).join(" \u2014 ") : "";
    const m = await aelf("messes", date, prefs.zone);
    if (date !== jourAffiche) return;
    const messes = liste(m.messes);
    if (!messes.length) throw new Error("aucune messe");
    const zoneMesse = el("div");
    const montrer = n => zoneMesse.replaceChildren(...liste(messes[n].lectures).map(carteLecture));
    const choix = messes.length > 1 ? el("div", { className: "rangee" }, messes.map((ms, n) => bouton(ms.nom || ("Messe " + (n + 1)), () => montrer(n), "petit secondaire"))) : null;
    boite.replaceChildren(...[choix, zoneMesse].filter(Boolean));
    montrer(0);
  } catch (e) {
    boite.replaceChildren(el("p", { className: "doux" }, "Lectures indisponibles (" + e.message + "). V\u00e9rifie ta connexion."));
  }
}

/* ---------- Journal ---------- */
function ecrireEntree(opt) {
  opt = opt || {};
  const zone = el("textarea", { placeholder: "Qu'est-ce que le Seigneur te dit \u00e0 travers ce passage ?", style: "min-height:140px" });
  ouvrirModale(
    el("h3", null, opt.ref ? "M\u00e9ditation \u2014 " + opt.ref : "Mon journal"),
    opt.verset ? el("p", { className: "texte-bible doux" }, opt.verset) : null,
    el("p", { className: "doux" }, "Pistes : Qu'est-ce qui me touche ? Qu'est-ce que Dieu me demande ? Quelle gr\u00e2ce je demande ?"),
    zone,
    bouton("Enregistrer", () => {
      const txt = zone.value.trim();
      if (!txt) return;
      etat.entrees.unshift({ id: Date.now(), date: Date.now(), ref: opt.ref || "", verset: opt.verset || "", texte: txt });
      sauver(); fermerModale(); toast("Enregistr\u00e9 \u{1F64F}"); rendreJournal();
    }));
  setTimeout(() => zone.focus(), 150);
}
function rendreJournal() {
  const z = $("p-journal");
  if (!z) return;
  const ents = etat.entrees.slice(0, 30);
  if (!ents.length) { z.replaceChildren(el("p", { className: "doux" }, "Ton journal est vide. Touche un verset ou \u00ab M\u00e9diter \u00bb sous une lecture pour commencer.")); return; }
  z.replaceChildren(...ents.map(e => el("div", { className: "carte" },
    el("p", { className: "doux" }, new Date(e.date || e.quand || 0).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + (e.ref ? " \u00b7 " + e.ref : "")),
    e.verset ? el("p", { className: "texte-bible doux", style: "font-size:16px" }, e.verset) : null,
    el("p", { style: "white-space:pre-wrap" }, String(e.texte || e.text || "")),
    bouton("Supprimer", () => { if (confirm("Supprimer cette note ?")) { etat.entrees.splice(etat.entrees.indexOf(e), 1); sauver(); rendreJournal(); } }, "petit secondaire"))));
}

/* ---------- Onglet Parole ---------- */
function construireParole() {
  $("vue-parole").replaceChildren(
    el("div", { className: "carte centre" },
      el("div", { className: "rangee", style: "justify-content:space-between" },
        bouton("\u25C0", () => changerJour(-1), "petit secondaire"), el("strong", { id: "p-date" }), bouton("\u25B6", () => changerJour(1), "petit secondaire")),
      el("div", { id: "p-liturgie", className: "doux" }),
      el("div", { id: "p-intention", className: "doux" })),
    el("h2", null, "Lectures du jour"),
    el("div", { id: "p-lectures" }),
    el("h2", null, "La Bible (Crampon 1923)"),
    el("div", { id: "p-lecteur", className: "carte" }),
    el("h2", null, "Mon journal"),
    bouton("\u270D\uFE0F \u00c9crire", () => ecrireEntree({})),
    el("div", { id: "p-journal" }));
}
function changerJour(d) { jourAffiche = decaler(jourAffiche, d); $("p-date").textContent = dateLongue(jourAffiche); $("p-liturgie").textContent = ""; rendreLectures(); }
function rendreParole() {
  $("p-date").textContent = dateLongue(jourAffiche);
  const r = etat.rituels[iso()];
  $("p-intention").textContent = r && r.offrande ? "\u{1F64F} Intention du jour : " + r.offrande : "";
  rendreLectures(); rendreLecteur(); rendreJournal();
}

(window.CHARGE = window.CHARGE || []).push("2");
