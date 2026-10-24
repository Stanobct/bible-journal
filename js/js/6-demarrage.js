/* Bible journal v5.1 - fichier 6 sur 6 : navigation, fenetre, reglages, demarrage */
"use strict";

/* ---------- Navigation ---------- */
const VUES = ["parole", "fil", "liberte", "rituels"];
let vueActive = "parole";
let deverrouille = false;
function vue(nom) {
  if (vueActive === "liberte" && nom !== "liberte") deverrouille = false;
  vueActive = nom;
  for (const v of VUES) { $("vue-" + v).hidden = v !== nom; $("nav-" + v).classList.toggle("actif", v === nom); }
  if (nom === "fil") rendreFil();
  if (nom === "liberte") rendreLiberte();
  if (nom === "rituels") rendreRituels();
  window.scrollTo(0, 0);
}

/* ---------- Fenetre modale ---------- */
let nettoyageModale = null;
function ouvrirModale(...contenu) {
  if (nettoyageModale) { nettoyageModale(); nettoyageModale = null; }
  $("modale").replaceChildren(el("div", { className: "boite" }, bouton("\u2715", fermerModale, "secondaire petit fermer"), ...contenu));
  $("modale").hidden = false;
  $("modale").scrollTop = 0;
}
function fermerModale() {
  if (nettoyageModale) { nettoyageModale(); nettoyageModale = null; }
  $("modale").hidden = true;
  $("modale").replaceChildren();
}

/* ---------- Reglages generaux ---------- */
function exporter() {
  const txt = JSON.stringify(etat, null, 1);
  const nom = "bible-journal-" + iso() + ".json";
  try {
    const f = new File([txt], nom, { type: "application/json" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: nom }).catch(() => {}); return; }
  } catch (e) {}
  const a = el("a", { href: URL.createObjectURL(new Blob([txt], { type: "application/json" })), download: nom });
  document.body.append(a); a.click(); a.remove();
}
async function recupererAncien() {
  const j = await chercherAncienJournal();
  if (!j) { alert("Aucune donn\u00e9e d'une ancienne version trouv\u00e9e sur ce t\u00e9l\u00e9phone."); return; }
  if (!confirm("Donn\u00e9es trouv\u00e9es (" + liste(j.entrees).length + " notes de journal). Les r\u00e9cup\u00e9rer ? Cela remplace les donn\u00e9es actuelles.")) return;
  etat = completer(j);
  await ecrire("journal", etat);
  location.reload();
}
function ouvrirReglages() {
  const zones = [["france", "France"], ["belgique", "Belgique"], ["canada", "Canada"], ["afrique", "Afrique"], ["romain", "Calendrier romain"]];
  const zone = el("select", null, zones.map(([v, t]) => el("option", { value: v }, t)));
  zone.value = prefs.zone;
  zone.onchange = () => { prefs.zone = zone.value; sauverPrefs(); rendreLectures(); };
  const fichier = el("input", { type: "file", accept: ".json,application/json" });
  fichier.onchange = async () => {
    const f = fichier.files[0];
    if (!f) return;
    try {
      const j = JSON.parse(await f.text());
      if (!confirm("Remplacer toutes tes donn\u00e9es actuelles par cette sauvegarde ?")) return;
      etat = completer(j);
      await ecrire("journal", etat);
      location.reload();
    } catch (e) { alert("Fichier illisible : " + e.message); }
  };
  ouvrirModale(
    el("h2", null, "R\u00e9glages"),
    el("h3", null, "Calendrier des lectures (AELF)"), zone,
    el("h3", null, "Taille du texte biblique"),
    el("div", { className: "rangee" }, bouton("A\u2212", () => changerTaille(-1), "petit secondaire"), bouton("A+", () => changerTaille(1), "petit secondaire")),
    el("h3", null, "Sauvegarde"),
    el("p", { className: "doux" }, "Tes donn\u00e9es restent sur ce t\u00e9l\u00e9phone. Fais une sauvegarde de temps en temps."),
    bouton("Exporter mes donn\u00e9es", exporter, "petit"),
    el("p", { className: "doux" }, "Restaurer une sauvegarde :"), fichier,
    el("h3", null, "Ancienne version"),
    bouton("R\u00e9cup\u00e9rer les donn\u00e9es de la version 5", recupererAncien, "petit secondaire"),
    el("h3", null, "Bible"),
    bouton("Ret\u00e9l\u00e9charger la Bible", async () => {
      await ecrire("bible-crampon", null); BIBLE = null; promesseBible = null; fermerModale(); rendreLecteur();
    }, "petit secondaire"));
}

/* ---------- Demarrage ---------- */
const FICHIERS = { "1": "js/1-base.js", "2": "js/2-bible.js", "3": "js/3-sos.js", "4": "js/4-liberte.js", "5": "js/5-fil-rituels.js" };
async function demarrer() {
  window.CHARGE = window.CHARGE || [];
  const manquants = Object.keys(FICHIERS).filter(n => window.CHARGE.indexOf(n) < 0);
  if (manquants.length) {
    window.onerror("Fichier manquant ou incomplet : " + manquants.map(n => FICHIERS[n]).join(", ") + ". Recr\u00e9e ce fichier.", "", 0, 0);
    return;
  }
  window.DEMARRE = true;
  for (const v of VUES) $("nav-" + v).onclick = () => vue(v);
  $("btn-sos").onclick = ouvrirSOS;
  $("btn-reglages").onclick = ouvrirReglages;
  let j = null;
  try {
    j = await lire("journal");
    if (!j) {
      j = await chercherAncienJournal();
      if (j) toast("Donn\u00e9es de la version 5 r\u00e9cup\u00e9r\u00e9es \u2714");
    }
  } catch (e) { toast("Base de donn\u00e9es : " + e.message); }
  etat = completer(j);
  sauver();
  construireParole();
  vue("parole");
  rendreParole();
  verifierCouvreFeu();
  setInterval(verifierCouvreFeu, 60000);
}

(window.CHARGE = window.CHARGE || []).push("6");
demarrer();
