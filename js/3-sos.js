/* Bible journal v5.1 - fichier 3 sur 6 : bouton SOS */
"use strict";

function ouvrirSOS() {
  const fin = Date.now() + 15 * 60000;
  const chrono = el("div", { className: "grand" }, "15:00");
  const cercle = el("div", { className: "souffle" });
  const consigne = el("p", { className: "centre" }, "Inspire\u2026");
  const PHASES = [["Inspire\u2026 J\u00e9sus,", 4, true], ["Retiens\u2026", 4, true], ["Expire\u2026 aie piti\u00e9 de moi.", 6, false]];
  let phase = 0, reste = 0;
  function tic() {
    const ms = Math.max(0, fin - Date.now());
    chrono.textContent = Math.floor(ms / 60000) + ":" + String(Math.floor(ms % 60000 / 1000)).padStart(2, "0");
    if (ms === 0) { consigne.textContent = "Tu as tenu 15 minutes. La vague est pass\u00e9e : rends gr\u00e2ce !"; cercle.classList.remove("inspire"); return; }
    if (reste <= 0) {
      const p = PHASES[phase];
      consigne.textContent = p[0];
      cercle.style.transitionDuration = p[1] + "s";
      cercle.classList.toggle("inspire", p[2]);
      reste = p[1];
      phase = (phase + 1) % PHASES.length;
    }
    reste--;
  }
  const R = etat.reglages;
  const verset = versetHasard();
  const sep = /iPhone|iPad|iPod/.test(navigator.userAgent) ? "&body=" : "?body=";
  const message = encodeURIComponent("Je traverse un moment difficile. Tu peux prier pour moi ?");
  const contacts = liste(R.contacts).filter(c => c && c.tel).map(c => el("div", { className: "rangee" },
    el("a", { className: "btn", href: "tel:" + c.tel }, "\u{1F4DE} " + (c.nom || c.tel)),
    el("a", { className: "btn secondaire", href: "sms:" + c.tel + sep + message }, "\u{1F4AC} SMS")));
  const actions = ["Pose ton t\u00e9l\u00e9phone dans une autre pi\u00e8ce", "Sors marcher 10 minutes", "Bois un grand verre d'eau",
    "Fais 20 pompes ou 30 squats", "Prends une douche fra\u00eeche", "Va l\u00e0 o\u00f9 il y a du monde", "Allume la lumi\u00e8re, ouvre une fen\u00eatre"];
  ouvrirModale(
    el("h2", null, "Tu n'es pas seul"),
    el("p", null, "Une tentation monte, culmine puis redescend. Tiens 15 minutes avec J\u00e9sus : la vague va passer."),
    chrono, cercle, consigne,
    el("details", { className: "carte" }, el("summary", null, "\u{1F64F} Prier"),
      el("p", null, el("strong", null, "J\u00e9sus, Fils de David, aie piti\u00e9 de moi, p\u00e9cheur.")),
      el("p", { className: "lecture-texte" }, AVE),
      el("p", { className: "lecture-texte" }, SAINT_MICHEL)),
    verset
      ? el("div", { className: "carte" }, el("p", { className: "texte-bible" }, verset.texte), el("p", { className: "doux" }, "\u2014 " + verset.livre + " " + verset.c + ", " + verset.v))
      : el("div", { className: "carte" }, el("p", { className: "texte-bible" }, "Dieu est fid\u00e8le : il ne permettra pas que tu sois tent\u00e9 au-del\u00e0 de tes forces."), el("p", { className: "doux" }, "\u2014 d'apr\u00e8s 1 Corinthiens 10, 13")),
    el("details", { className: "carte" }, el("summary", null, "\u{1F3C3} Agir maintenant"), el("ul", null, actions.map(a => el("li", null, a)))),
    R.lettre ? el("details", { className: "carte", open: true }, el("summary", null, "\u{1F48C} Ta lettre"), el("p", { style: "white-space:pre-wrap" }, R.lettre)) : null,
    contacts.length
      ? el("div", { className: "carte" }, el("h3", null, "Appelle quelqu'un"), contacts)
      : el("p", { className: "doux" }, "Astuce : ajoute 2 contacts de confiance dans l'onglet Libert\u00e9."),
    el("div", { className: "rangee" },
      bouton("\u{1F64C} J'ai tenu !", () => noterTentation({ issue: "tenu" })),
      bouton("Je suis tomb\u00e9", () => pageChute(false), "secondaire")));
  setTimeout(tic, 60);
  const minuteur = setInterval(tic, 1000);
  nettoyageModale = () => clearInterval(minuteur);
}

(window.CHARGE = window.CHARGE || []).push("3");
