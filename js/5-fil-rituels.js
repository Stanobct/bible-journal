/* Bible journal v5.1 - fichier 5 sur 6 : Fil et Rituels */
"use strict";

/* ---------- Fil ---------- */
const FIL_MAX = 10;
let filCompte = 0;
function carteVerset(titre, nomLivre, c, v, texte) {
  const ref = nomLivre + " " + c + ", " + v;
  const cle = nomLivre + "|" + c + "|" + v;
  const garder = bouton(etat.surlignages[cle] ? "\u2B50 Gard\u00e9" : "\u2B50 Garder", () => {
    if (!etat.surlignages[cle]) etat.surlignages[cle] = "jaune";
    sauver(); garder.textContent = "\u2B50 Gard\u00e9";
  }, "petit secondaire");
  return el("div", { className: "carte" },
    el("p", { className: "doux" }, titre),
    el("p", { className: "texte-bible" }, texte),
    el("p", { className: "doux" }, "\u2014 " + ref),
    el("div", { className: "rangee" },
      garder,
      bouton("\u270D\uFE0F M\u00e9diter", () => ecrireEntree({ ref, verset: texte }), "petit secondaire"),
      bouton("\u{1F4D6} Ouvrir", () => { vue("parole"); allerA(ref); }, "petit secondaire")));
}
function carteFil() {
  const choix = [];
  choix.push(() => { const x = versetHasard(); return x && carteVerset("\u{1F525} Une parole de force", x.livre, x.c, x.v, x.texte); });
  choix.push(() => {
    const evs = ["Matthieu", "Marc", "Luc", "Jean"].map(trouverLivre).filter(Boolean);
    if (!evs.length) return null;
    const l = evs[Math.floor(Math.random() * evs.length)];
    const ch = l.chapitres[Math.floor(Math.random() * l.chapitres.length)];
    const vs = ch.versets[Math.floor(Math.random() * ch.versets.length)];
    return carteVerset("\u{1F4D6} Une parole de l'\u00c9vangile", l.nom, ch.n, vs[0], vs[1]);
  });
  const cles = Object.keys(etat.surlignages);
  if (cles.length) choix.push(() => {
    const [l, c, v] = cles[Math.floor(Math.random() * cles.length)].split("|");
    const t = texteVerset(l, Number(c), Number(v));
    return t && carteVerset("\u2B50 Un verset que tu as gard\u00e9", trouverLivre(l).nom, c, v, t);
  });
  const ents = etat.entrees.filter(e => e.texte || e.text);
  if (ents.length) choix.push(() => {
    const e = ents[Math.floor(Math.random() * ents.length)];
    return el("div", { className: "carte" },
      el("p", { className: "doux" }, "\u{1F4D3} Le " + new Date(e.date || e.quand || Date.now()).toLocaleDateString("fr-FR") + ", tu as \u00e9crit" + (e.ref ? " sur " + e.ref : "") + " :"),
      el("p", { className: "lecture-texte", style: "white-space:pre-wrap" }, String(e.texte || e.text)),
      el("p", { className: "doux" }, "Qu'est-ce que Dieu a fait depuis ?"),
      bouton("\u270D\uFE0F R\u00e9pondre", () => ecrireEntree({ ref: e.ref || "" }), "petit secondaire"));
  });
  for (let i = 0; i < 8; i++) { const c = choix[Math.floor(Math.random() * choix.length)](); if (c) return c; }
  return el("p", { className: "doux" }, "Pas de carte disponible pour l'instant.");
}
function rendreFil() {
  const v = $("vue-fil");
  const fin = Number(localStorage.getItem("bj-fil-fin") || 0);
  if (Date.now() < fin) {
    v.replaceChildren(el("div", { className: "carte centre" },
      el("p", { style: "font-size:40px;margin:0" }, "\u{1F54A}\uFE0F"),
      el("h2", null, "Le fil se repose"),
      el("p", null, "Tu as m\u00e9dit\u00e9 " + FIL_MAX + " cartes. Laisse la Parole descendre dans ton c\u0153ur."),
      el("p", { className: "doux" }, "Retour dans " + Math.ceil((fin - Date.now()) / 60000) + " min."),
      bouton("Aller aux Rituels", () => vue("rituels"))));
    return;
  }
  if (!BIBLE) {
    v.replaceChildren(el("p", { className: "doux" }, "Chargement de la Bible\u2026"));
    chargerBible().then(() => { if (vueActive === "fil") rendreFil(); }).catch(e => v.replaceChildren(el("p", null, "Bible indisponible : " + e.message)));
    return;
  }
  v.replaceChildren(
    el("p", { className: "doux centre" }, "Carte " + (filCompte + 1) + " / " + FIL_MAX),
    carteFil(),
    el("div", { className: "rangee", style: "justify-content:center" },
      bouton("Carte suivante \u2192", () => {
        filCompte++;
        if (filCompte >= FIL_MAX) { filCompte = 0; localStorage.setItem("bj-fil-fin", String(Date.now() + 30 * 60000)); }
        rendreFil(); window.scrollTo(0, 0);
      })));
}

/* ---------- Rituels ---------- */
const MYSTERES = {
  joyeux: ["L'Annonciation", "La Visitation", "La Nativit\u00e9", "La Pr\u00e9sentation au Temple", "Le Recouvrement au Temple"],
  lumineux: ["Le Bapt\u00eame de J\u00e9sus", "Les noces de Cana", "L'annonce du Royaume", "La Transfiguration", "L'institution de l'Eucharistie"],
  douloureux: ["L'agonie \u00e0 Geths\u00e9mani", "La flagellation", "Le couronnement d'\u00e9pines", "Le portement de croix", "La crucifixion"],
  glorieux: ["La R\u00e9surrection", "L'Ascension", "La Pentec\u00f4te", "L'Assomption", "Le couronnement de Marie"]
};
const SERIE_JOUR = ["glorieux", "joyeux", "douloureux", "glorieux", "lumineux", "douloureux", "joyeux"];
const ETAPES_EXAMEN = [
  ["merci", "1. Merci", "Pour quoi rends-tu gr\u00e2ce aujourd'hui ?"],
  ["lumiere", "2. Lumi\u00e8re", "Esprit Saint, montre-moi ma journ\u00e9e comme tu la vois."],
  ["relecture", "3. Relecture", "O\u00f9 as-tu senti Dieu proche ? O\u00f9 t'es-tu \u00e9loign\u00e9 de lui ?"],
  ["pardon", "4. Pardon", "Demande pardon simplement, avec confiance."],


$$
"demain", "5. Demain", "Quelle gr\u00e2ce demandes-tu pour demain ?"
$$


];
let examenOuvert = false;
let dizaine = 0;
function jourRituel() {
  const k = iso();
  if (!etat.rituels[k] || typeof etat.rituels[k] !== "object") etat.rituels[k] = {};
  return etat.rituels[k];
}
function carteOffrande(r) {
  if (r.offrande != null) return el("div", { className: "carte" },
    el("p", null, "\u2705 Journ\u00e9e offerte" + (r.offrande ? " \u2014 intention : " + r.offrande : "")),
    bouton("Relire la pri\u00e8re", () => ouvrirModale(el("h3", null, "Offrande du matin"), el("p", { className: "lecture-texte" }, OFFRANDE)), "petit secondaire"));
  const intention = el("input", { placeholder: "Mon intention pour aujourd'hui (facultatif)" });
  return el("div", { className: "carte" },
    el("p", { className: "lecture-texte" }, OFFRANDE),
    intention,
    bouton("J'offre ma journ\u00e9e", () => { jourRituel().offrande = intention.value.trim(); sauver(); rendreRituels(); toast("Que ta journ\u00e9e soit b\u00e9nie \u{1F64F}"); }));
}
function carteExamen(r) {
  const ex = r.examen && typeof r.examen === "object" ? r.examen : null;
  if (ex && !examenOuvert) return el("div", { className: "carte" },
    el("p", null, "\u2705 Examen fait."),
    ex.merci ? el("p", { className: "doux" }, "Merci : " + ex.merci) : null,
    bouton("Modifier", () => { examenOuvert = true; rendreRituels(); }, "petit secondaire"));
  const champs = {};
  const carte = el("div", { className: "carte" }, el("p", { className: "doux" }, "Quelques minutes avec Dieu pour relire ta journ\u00e9e, avec saint Ignace."));
  for (const [k, titre, q] of ETAPES_EXAMEN) {
    champs[k] = el("textarea", { placeholder: q, value: (ex && ex[k]) || "", style: "min-height:60px" });
    carte.append(el("h3", null, titre), champs[k]);
  }
  carte.append(bouton("Terminer par un Notre P\u00e8re \u{1F64F}", () => {
    const o = { quand: Date.now() };
    for (const k in champs) o[k] = champs[k].value.trim();
    jourRituel().examen = o; examenOuvert = false; sauver();
    ouvrirModale(el("h3", null, "Notre P\u00e8re"), el("p", { className: "lecture-texte" }, NOTRE_PERE), bouton("Amen", () => { fermerModale(); rendreRituels(); }));
  }));
  return carte;
}
function blocDizaine() {
  const zone = el("div");
  const d = new Date();
  const serie = SERIE_JOUR[d.getDay()];
  const mystere = MYSTERES[serie][d.getDate() % 5];
  const etapes = [["Notre P\u00e8re", NOTRE_PERE]];
  for (let i = 1; i <= 10; i++) etapes.push(["Je vous salue Marie (" + i + "/10)", AVE]);
  etapes.push(["Gloire au P\u00e8re", GLOIRE]);
  function maj() {
    if (dizaine >= etapes.length) {
      zone.replaceChildren(el("div", { className: "carte centre" }, el("p", null, "\u2705 Dizaine pri\u00e9e. Marie te garde."), bouton("Recommencer", () => { dizaine = 0; maj(); }, "petit secondaire")));
      return;
    }
    const [titre, texte] = etapes[dizaine];
    zone.replaceChildren(el("div", { className: "carte" },
      el("p", null, el("strong", null, "Myst\u00e8res " + serie + " : "), mystere),
      el("div", { className: "perles" }, Array.from({ length: 10 }, (_, i) => el("i", { className: dizaine > i + 1 ? "faite" : "" }))),
      el("h3", null, titre),
      el("p", { className: "lecture-texte" }, texte),
      bouton(dizaine === etapes.length - 1 ? "Amen" : "Suivant", () => {
        dizaine++;
        if (dizaine >= etapes.length) { jourRituel().dizaine = true; sauver(); }
        maj();
      })));
  }
  maj();
  return zone;
}
function carteCouvreFeu() {
  const cb = el("input", { type: "checkbox", checked: !!prefs.couvreFeu, style: "width:auto;margin-right:10px" });
  cb.onchange = () => { prefs.couvreFeu = cb.checked; sauverPrefs(); };
  return el("div", { className: "carte" },
    el("label", null, cb, "Activer le couvre-feu de 23 h \u00e0 6 h"),
    el("p", { className: "doux" }, "La nuit, l'appli t'invite \u00e0 poser ton t\u00e9l\u00e9phone. Astuce : recharge-le hors de ta chambre."));
}
function semaineRituels() {
  const lignes = [];
  for (let i = 6; i >= 0; i--) {
    const k = decaler(iso(), -i);
    const r = etat.rituels[k] || {};
    const [a, m, j] = k.split("-").map(Number);
    lignes.push(el("div", { className: "rangee", style: "justify-content:space-between" },
      el("span", null, JOURS[new Date(a, m - 1, j).getDay()].slice(0, 3) + " " + j),
      el("span", null, (r.offrande != null ? "\u2600\uFE0F" : "\u00b7") + "  " + (r.examen ? "\u{1F319}" : "\u00b7") + "  " + (r.dizaine ? "\u{1F4FF}" : "\u00b7"))));
  }
  return el("div", { className: "carte" }, lignes, el("p", { className: "doux" }, "\u2600\uFE0F offrande \u00b7 \u{1F319} examen \u00b7 \u{1F4FF} dizaine"));
}
function rendreRituels() {
  const r = etat.rituels[iso()] || {};
  $("vue-rituels").replaceChildren(
    el("h2", null, "\u2600\uFE0F Offrande du matin"), carteOffrande(r),
    el("h2", null, "\u{1F319} Examen du soir"), carteExamen(r),
    el("h2", null, "\u{1F4FF} Une dizaine"), blocDizaine(),
    el("h2", null, "\u{1F6CC} Couvre-feu num\u00e9rique"), carteCouvreFeu(),
    el("h2", null, "Ma semaine"), semaineRituels());
}

/* ---------- Couvre-feu ---------- */
function enCouvreFeu() {
  if (!prefs.couvreFeu) return false;
  if (Date.now() < (Number(prefs.couvreFeuPause) || 0)) return false;
  const h = new Date().getHours();
  return h >= 23 || h < 6;
}
function verifierCouvreFeu() {
  const c = $("couvre-feu");
  if (!enCouvreFeu()) { c.hidden = true; return; }
  if (!c.hidden) return;
  const pause = min => { prefs.couvreFeuPause = Date.now() + min * 60000; sauverPrefs(); c.hidden = true; };
  c.className = "couvre-feu";
  c.replaceChildren(
    el("div", { style: "font-size:48px" }, "\u{1F319}"),
    el("h2", { style: "color:#e0b48a" }, "C'est l'heure du repos"),
    el("p", null, "Couvre-feu de 23 h \u00e0 6 h. Pose ton t\u00e9l\u00e9phone loin de ton lit et remets ta nuit \u00e0 Dieu."),
    el("p", { style: "font-style:italic" }, "\u00ab Entre tes mains, Seigneur, je remets mon esprit. \u00bb"),
    bouton("Faire mon examen du soir", () => { pause(15); vue("rituels"); }),
    bouton("\u{1F198} J'ai besoin d'aide", () => { pause(20); ouvrirSOS(); }, "danger"),
    bouton("Continuer 5 minutes", () => pause(5), "secondaire"));
  c.hidden = false;
}

(window.CHARGE = window.CHARGE || []).push("5");
