/* Bible journal - dessin pour le bible journaling */
"use strict";

const COULEURS_DESSIN = ["#2b2420", "#b3261e", "#e65100", "#e0a800", "#2e7d32", "#1565c0", "#7b1fa2", "#e91e63", "#7d7068"];
const FOND_DESSIN = "#fffdf7";

function texteSurCanvas(ctx, ref, texte, largeur) {
  ctx.fillStyle = "#6b5f57";
  ctx.font = "italic 15px Georgia, serif";
  const mots = String(texte || "").split(/\s+/);
  let ligne = "", y = 30;
  for (const m of mots) {
    const essai = ligne ? ligne + " " + m : m;
    if (ctx.measureText(essai).width > largeur - 32 && ligne) {
      ctx.fillText(ligne, 16, y); y += 21; ligne = m;
      if (y > 170) { ligne += "\u2026"; break; }
    } else ligne = essai;
  }
  if (ligne) { ctx.fillText(ligne, 16, y); y += 21; }
  if (ref) { ctx.font = "bold 13px Georgia, serif"; ctx.fillText("\u2014 " + ref, 16, y); }
}

function ouvrirDessin(opt) {
  opt = opt || {};
  const L = Math.max(240, Math.min(window.innerWidth - 60, 560));
  const H = Math.round(L * 1.25);
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const canvas = el("canvas", { width: Math.round(L * ratio), height: Math.round(H * ratio) });
  canvas.style.cssText = "width:" + L + "px;height:" + H + "px;display:block;margin:8px auto;border:1px solid var(--bord);border-radius:10px;touch-action:none;background:" + FOND_DESSIN;
  const ctx = canvas.getContext("2d");
  ctx.scale(ratio, ratio);
  ctx.lineCap = "round"; ctx.lineJoin = "round";
  function fond(avecImage) {
    ctx.fillStyle = FOND_DESSIN; ctx.fillRect(0, 0, L, H);
    if (avecImage && opt.image) { const im = new Image(); im.onload = () => ctx.drawImage(im, 0, 0, L, H); im.src = opt.image; }
    else if (opt.verset) texteSurCanvas(ctx, opt.ref, opt.verset, L);
  }
  fond(true);
  let couleur = COULEURS_DESSIN[0], epaisseur = 4, gomme = false, enCours = false, dernier = null;
  const pile = [];
  function pos(e) { const r = canvas.getBoundingClientRect(); return { x: (e.clientX - r.left) * L / r.width, y: (e.clientY - r.top) * H / r.height }; }
  function trait(a, b) {
    ctx.strokeStyle = gomme ? FOND_DESSIN : couleur;
    ctx.lineWidth = gomme ? epaisseur * 4 : epaisseur;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x + 0.01, b.y + 0.01); ctx.stroke();
  }
  canvas.addEventListener("pointerdown", e => {
    e.preventDefault();
    try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
    pile.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    if (pile.length > 8) pile.shift();
    enCours = true; dernier = pos(e); trait(dernier, dernier);
  });
  canvas.addEventListener("pointermove", e => { if (!enCours) return; e.preventDefault(); const p = pos(e); trait(dernier, p); dernier = p; });
  canvas.addEventListener("pointerup", () => { enCours = false; });
  canvas.addEventListener("pointercancel", () => { enCours = false; });
  const palette = el("div", { className: "rangee", style: "justify-content:center" });
  const tailles = el("div", { className: "rangee", style: "justify-content:center" });
  function majOutils() {
    palette.replaceChildren(
            ...COULEURS_DESSIN.map(c => el("button", { type: "button", className: "pastille", "aria-label": c,
         style: "background:" + c + ";border:" + (c === couleur && !gomme ? "3px solid var(--accent)" : "1px solid var(--bord)"),
        onclick: () => { couleur = c; gomme = false; majOutils(); } })),
      el("button", { type: "button", className: "puce" + (gomme ? " choisie" : ""), onclick: () => { gomme = !gomme; majOutils(); } }, "Gomme"));
        tailles.replaceChildren(...[[2, "Fin"], [4, "Moyen"], [8, "Gros"], [14, "Marqueur"]].map(t =>
      el("button", { type: "button", className: "puce" + (t[0] === epaisseur ? " choisie" : ""), onclick: () => { epaisseur = t[0]; majOutils(); } }, t[1])));
  }
  majOutils();
  const champRef = opt.ref ? null : el("input", { placeholder: "R\u00e9f\u00e9rence ou titre (facultatif)" });
  const legende = el("textarea", { placeholder: "Ce que ce dessin veut dire pour moi\u2026 (facultatif)", value: opt.entree ? (opt.entree.texte || "") : "", style: "min-height:60px" });
  const actions = el("div", { className: "rangee", style: "justify-content:center" },
    bouton("\u21A9 Annuler", () => { const s = pile.pop(); if (s) ctx.putImageData(s, 0, 0); }, "petit secondaire"),
    bouton("Tout effacer", () => { if (confirm("Effacer tout le dessin ?")) { pile.length = 0; fond(false); } }, "petit secondaire"));
  ouvrirModale(
    el("h3", null, opt.ref ? "Dessiner \u2014 " + opt.ref : "Mon dessin"),
    champRef, palette, tailles, canvas, actions, legende,
    bouton("Enregistrer", () => {
      const url = canvas.toDataURL("image/jpeg", 0.85);
      const ref = opt.ref || (champRef ? champRef.value.trim() : "");
      if (opt.entree) { opt.entree.dessin = url; opt.entree.texte = legende.value.trim(); }
      else etat.entrees.unshift({ id: Date.now(), date: Date.now(), ref, verset: opt.verset || "", texte: legende.value.trim(), dessin: url });
      sauver(); fermerModale(); toast("Dessin enregistr\u00e9 \u{1F3A8}"); rendreJournal();
    }));
}

function imageEntree(e) {
  const x = e.dessin || e.image || e.img || e.croquis;
  return typeof x === "string" && x.startsWith("data:image") ? x : "";
}

rendreJournal = function () {
  const z = $("p-journal");
  if (!z) return;
  const ents = etat.entrees.slice(0, 30);
  if (!ents.length) { z.replaceChildren(el("p", { className: "doux" }, "Ton journal est vide. Touche un verset, \u00ab M\u00e9diter \u00bb ou \u00ab Dessiner \u00bb pour commencer.")); return; }
  z.replaceChildren(...ents.map(e => {
    const img = imageEntree(e);
    return el("div", { className: "carte" },
      el("p", { className: "doux" }, new Date(e.date || e.quand || 0).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }) + (e.ref ? " \u00b7 " + e.ref : "")),
      img ? el("img", { src: img, alt: "Dessin", style: "width:100%;border-radius:10px;border:1px solid var(--bord)" }) : null,
      e.verset && !img ? el("p", { className: "texte-bible doux", style: "font-size:16px" }, e.verset) : null,
      (e.texte || e.text) ? el("p", { style: "white-space:pre-wrap" }, String(e.texte || e.text)) : null,
      el("div", { className: "rangee" },
        img ? bouton("Continuer le dessin", () => ouvrirDessin({ ref: e.ref, verset: e.verset, image: img, entree: e }), "petit secondaire") : null,
        bouton("Supprimer", () => { if (confirm("Supprimer cette note ?")) { etat.entrees.splice(etat.entrees.indexOf(e), 1); sauver(); rendreJournal(); } }, "petit secondaire")));
  }));
};

function ajouterBoutonDessin() {
  const z = $("p-journal");
  if (!z || $("btn-dessin")) return;
  z.parentNode.insertBefore(bouton("\u{1F3A8} Dessiner", () => ouvrirDessin({}), "secondaire"), z);
  z.previousSibling.id = "btn-dessin";
}
const construireParoleSansDessin = construireParole;
construireParole = function () { construireParoleSansDessin(); ajouterBoutonDessin(); };

const menuVersetSansDessin = menuVerset;
menuVerset = function (nomLivre, c, v, t) {
  menuVersetSansDessin(nomLivre, c, v, t);
  const boite = document.querySelector("#modale .boite");
  if (boite) boite.append(el("div", { className: "rangee" },
    bouton("\u{1F3A8} Dessiner autour de ce verset", () => ouvrirDessin({ ref: nomLivre + " " + c + ", " + v, verset: t }), "secondaire")));
};

if ($("p-journal")) ajouterBoutonDessin();
