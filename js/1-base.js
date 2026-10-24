/* Bible journal v5.1 - fichier 1 sur 6 : outils, donnees, prieres */
"use strict";

/* ---------- Outils ---------- */
const $ = id => document.getElementById(id);

function el(tag, props, ...enfants) {
  const e = document.createElement(tag);
  if (props) {
    for (const k in props) {
      const v = props[k];
      if (v == null) continue;
      if (k === "style") e.style.cssText = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else if (k in e) e[k] = v;
      else e.setAttribute(k, v);
    }
  }
  for (const c of enfants.flat(Infinity)) {
    if (c == null || c === false) continue;
    e.append(c instanceof Node ? c : String(c));
  }
  return e;
}
function bouton(texte, action, classes) {
  return el("button", { type: "button", className: "btn " + (classes || ""), onclick: action }, texte);
}
function puce(texte, choisie, action) {
  const b = el("button", { type: "button", className: "puce" + (choisie ? " choisie" : "") }, texte);
  b.onclick = () => { b.classList.toggle("choisie"); if (action) action(b.classList.contains("choisie")); };
  return b;
}
function groupePuces(options, choisies) {
  return el("div", { className: "rangee" }, options.map(o => puce(o, choisies.has(o), on => { if (on) choisies.add(o); else choisies.delete(o); })));
}
function liste(x) { return Array.isArray(x) ? x : (x == null || x === "" ? [] : [x]); }
function toast(msg) {
  const t = el("div", { className: "toast" }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 2600);
}
async function copier(txt) {
  try { await navigator.clipboard.writeText(txt); toast("Copi\u00e9 \u2714"); }
  catch (e) { prompt("Copie ce texte :", txt); }
}
async function partager(titre, txt) {
  if (navigator.share) {
    try { await navigator.share({ title: titre, text: txt }); return; }
    catch (e) { if (e && e.name === "AbortError") return; }
  }
  copier(txt);
}
async function hacher(txt) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(txt)));
  return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, "0")).join("");
}
function nettoyerHTML(html) {
  const doc = new DOMParser().parseFromString("<div>" + (html || "") + "</div>", "text/html");
  const sortie = document.createDocumentFragment();
  const OK = ["P", "BR", "EM", "I", "STRONG", "B", "SUP"];
  function copie(n, parent) {
    for (const c of Array.from(n.childNodes)) {
      if (c.nodeType === 3) parent.append(c.textContent);
      else if (c.nodeType === 1) {
        if (OK.includes(c.tagName)) { const e = document.createElement(c.tagName.toLowerCase()); copie(c, e); parent.append(e); }
        else copie(c, parent);
      }
    }
  }
  if (doc.body.firstChild) copie(doc.body.firstChild, sortie);
  return sortie;
}

/* ---------- Dates ---------- */
const JOURS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
const MOIS = ["janvier", "f\u00e9vrier", "mars", "avril", "mai", "juin", "juillet", "ao\u00fbt", "septembre", "octobre", "novembre", "d\u00e9cembre"];
function iso(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function decaler(jour, n) { const [a, m, j] = jour.split("-").map(Number); return iso(new Date(a, m - 1, j + n)); }
function dateLongue(jour) {
  const [a, m, j] = jour.split("-").map(Number);
  const s = JOURS[new Date(a, m - 1, j).getDay()] + " " + j + " " + MOIS[m - 1] + " " + a;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function joursEntre(debut, fin) { return Math.max(0, Math.floor((fin - debut) / 86400000)); }

/* ---------- Preferences ---------- */
const prefs = { zone: "france", couvreFeu: true, taille: 19 };
try { Object.assign(prefs, JSON.parse(localStorage.getItem("bj-prefs") || "{}")); } catch (e) {}
function sauverPrefs() { try { localStorage.setItem("bj-prefs", JSON.stringify(prefs)); } catch (e) {} }

/* ---------- IndexedDB ---------- */
const NOM_BASE = "bible-journal-51";
let promesseBase = null;
function base() {
  if (!promesseBase) promesseBase = new Promise((ok, ko) => {
    const r = indexedDB.open(NOM_BASE, 1);
    r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains("kv")) r.result.createObjectStore("kv"); };
    r.onsuccess = () => ok(r.result);
    r.onerror = () => ko(r.error);
  });
  return promesseBase;
}
async function lire(cle) {
  const db = await base();
  return new Promise((ok, ko) => { const r = db.transaction("kv").objectStore("kv").get(cle); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
}
async function ecrire(cle, val) {
  const db = await base();
  return new Promise((ok, ko) => { const t = db.transaction("kv", "readwrite"); t.objectStore("kv").put(val, cle); t.oncomplete = () => ok(); t.onerror = () => ko(t.error); });
}
async function chercherAncienJournal() {
  if (!indexedDB.databases) return null;
  let bases = [];
  try { bases = await indexedDB.databases(); } catch (e) { return null; }
  for (const info of bases) {
    if (!info.name || info.name === NOM_BASE) continue;
    try {
      const db = await new Promise((ok, ko) => { const r = indexedDB.open(info.name); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); });
      for (const store of Array.from(db.objectStoreNames)) {
        const val = await new Promise(ok => {
          try { const r = db.transaction(store).objectStore(store).get("journal"); r.onsuccess = () => ok(r.result); r.onerror = () => ok(null); }
          catch (e) { ok(null); }
        });
        if (val && typeof val === "object" && (val.entrees || val.surlignages || val.combat)) { db.close(); return val; }
      }
      db.close();
    } catch (e) {}
  }
  return null;
}

/* ---------- Etat ---------- */
function etatVide() {
  return {
    surlignages: {}, entrees: [],
    combat: { debut: Date.now(), record: 0, chutes: [], tentations: [] },
    rituels: {},
    reglages: { lettre: "", contacts: [{ nom: "", tel: "" }, { nom: "", tel: "" }], pin: "" }
  };
}
function completer(e) {
  const v = etatVide();
  if (!e || typeof e !== "object") return v;
  if (!e.surlignages || typeof e.surlignages !== "object" || Array.isArray(e.surlignages)) e.surlignages = {};
  e.entrees = liste(e.entrees).filter(x => x && typeof x === "object");
  if (!e.combat || typeof e.combat !== "object") e.combat = v.combat;
  const d = new Date(e.combat.debut).getTime();
  e.combat.debut = isNaN(d) ? Date.now() : d;
  e.combat.record = Number(e.combat.record) || 0;
  e.combat.chutes = liste(e.combat.chutes).map(c => c && typeof c === "object" ? c : { quand: new Date(c).getTime() || 0 });
  e.combat.tentations = liste(e.combat.tentations || e.combat.notes).filter(x => x && typeof x === "object");
  for (const t of e.combat.tentations) { const q = new Date(t.quand || t.date || 0).getTime(); t.quand = isNaN(q) ? 0 : q; }
  if (!e.rituels || typeof e.rituels !== "object") e.rituels = {};
  if (!e.reglages || typeof e.reglages !== "object") e.reglages = v.reglages;
  const R = e.reglages;
  if (!R.pin && R.pinHash) R.pin = R.pinHash;
  R.pin = typeof R.pin === "string" ? R.pin : "";
  R.lettre = typeof R.lettre === "string" ? R.lettre : "";
  R.contacts = liste(R.contacts).map(c => c && typeof c === "object"
    ? { nom: String(c.nom || c.name || ""), tel: String(c.tel || c.telephone || c.numero || "") }
    : { nom: "", tel: String(c || "") });
  while (R.contacts.length < 2) R.contacts.push({ nom: "", tel: "" });
  return e;
}
let etat = etatVide();
let minuteurSauvegarde = null;
function sauver() {
  clearTimeout(minuteurSauvegarde);
  minuteurSauvegarde = setTimeout(() => { ecrire("journal", etat).catch(e => toast("Sauvegarde impossible : " + e.message)); }, 300);
}

/* ---------- Prieres ---------- */
const NOTRE_PERE = "Notre P\u00e8re, qui es aux cieux, que ton nom soit sanctifi\u00e9, que ton r\u00e8gne vienne, que ta volont\u00e9 soit faite sur la terre comme au ciel. Donne-nous aujourd'hui notre pain de ce jour. Pardonne-nous nos offenses, comme nous pardonnons aussi \u00e0 ceux qui nous ont offens\u00e9s. Et ne nous laisse pas entrer en tentation, mais d\u00e9livre-nous du Mal. Amen.";
const AVE = "Je vous salue, Marie, pleine de gr\u00e2ce ; le Seigneur est avec vous. Vous \u00eates b\u00e9nie entre toutes les femmes, et J\u00e9sus, le fruit de vos entrailles, est b\u00e9ni. Sainte Marie, M\u00e8re de Dieu, priez pour nous, pauvres p\u00e9cheurs, maintenant et \u00e0 l'heure de notre mort. Amen.";
const GLOIRE = "Gloire au P\u00e8re, et au Fils, et au Saint-Esprit, comme il \u00e9tait au commencement, maintenant et toujours, et dans les si\u00e8cles des si\u00e8cles. Amen.";
const SAINT_MICHEL = "Saint Michel Archange, d\u00e9fendez-nous dans le combat ; soyez notre secours contre la malice et les emb\u00fbches du d\u00e9mon. Que Dieu lui commande, nous vous en supplions ; et vous, Prince de la milice c\u00e9leste, par la force divine, repoussez en enfer Satan et les autres esprits mauvais qui r\u00f4dent dans le monde pour la perte des \u00e2mes. Amen.";
const ACTE_CONTRITION = "Mon Dieu, j'ai un tr\u00e8s grand regret de vous avoir offens\u00e9, parce que vous \u00eates infiniment bon, infiniment aimable, et que le p\u00e9ch\u00e9 vous d\u00e9pla\u00eet. Je prends la ferme r\u00e9solution, avec le secours de votre sainte gr\u00e2ce, de ne plus vous offenser et de faire p\u00e9nitence. Amen.";
const OFFRANDE = "C\u0153ur divin de J\u00e9sus, je vous offre, par le C\u0153ur immacul\u00e9 de Marie, les pri\u00e8res, les \u0153uvres et les souffrances de cette journ\u00e9e, en r\u00e9paration de nos offenses et \u00e0 toutes les intentions pour lesquelles vous vous immolez continuellement sur l'autel. Je vous les offre en particulier pour les intentions du Saint-P\u00e8re. Amen.";

(window.CHARGE = window.CHARGE || []).push("1");
