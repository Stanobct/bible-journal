/* Bible journal v5.1 - fichier 4 sur 6 : espace Liberte */
"use strict";

const ETAPES = [
  [1, "Saint Augustin", "Il a lutt\u00e9 des ann\u00e9es avant de se donner \u00e0 Dieu. Un premier jour, c'est d\u00e9j\u00e0 une victoire."],
  [3, "Sainte Marie-Madeleine", "Relev\u00e9e par J\u00e9sus, elle est devenue le premier t\u00e9moin de la R\u00e9surrection."],
  [7, "Saint Pierre", "Il est tomb\u00e9, il a pleur\u00e9, et J\u00e9sus lui a confi\u00e9 son \u00c9glise."],
  [14, "Sainte Marie l'\u00c9gyptienne", "Apr\u00e8s une vie de d\u00e9sordre, elle a trouv\u00e9 la paix au d\u00e9sert, port\u00e9e par Marie."],
  [30, "Saint Fran\u00e7ois d'Assise", "Il a choisi la libert\u00e9 des enfants de Dieu plut\u00f4t que les plaisirs de sa jeunesse."],
  [60, "Saint Beno\u00eet", "Selon la tradition, il s'est jet\u00e9 dans les ronces pour vaincre une tentation."],
  [90, "Saint Charles de Foucauld", "Longtemps loin de Dieu, il a fini par tout lui donner."],
  [180, "Saint Jean-Paul II", "Il a enseign\u00e9 la beaut\u00e9 de l'amour vrai dans la th\u00e9ologie du corps."],


$$
365, "Saint Joseph", "Chaste \u00e9poux de Marie, gardien du R\u00e9dempteur. Un an : rends gr\u00e2ce !"
$$


];
const EMOTIONS = ["Solitude", "Fatigue", "Stress", "Ennui", "Tristesse", "Col\u00e8re", "Anxi\u00e9t\u00e9", "Rejet", "Excitation"];
const LIEUX = ["Lit", "Chambre", "Salle de bain", "Canap\u00e9", "Bureau", "Transports", "Dehors"];
const DECLENCHEURS = ["T\u00e9l\u00e9phone au lit", "R\u00e9seaux sociaux", "Insomnie", "Seul \u00e0 la maison", "Conflit", "Alcool", "\u00c9chec", "Image vue par hasard", "Film / s\u00e9rie"];
const CONSEILS = {
  "T\u00e9l\u00e9phone au lit": "Recharge ton t\u00e9l\u00e9phone hors de ta chambre et active le couvre-feu.",
  "R\u00e9seaux sociaux": "Limite les applis qui te font d\u00e9filer sans fin, surtout le soir.",
  "Insomnie": "Si tu ne dors pas, l\u00e8ve-toi, lis un psaume ou prie une dizaine, sans \u00e9cran.",
  "Seul \u00e0 la maison": "Pr\u00e9vois une activit\u00e9 ou un appel quand tu sais que tu seras seul.",
  "Solitude": "La solitude est un appel \u00e0 la relation : appelle un ami, rejoins un groupe de ta paroisse.",
  "Fatigue": "Fatigu\u00e9, on est plus vuln\u00e9rable : couche-toi plus t\u00f4t.",
  "Stress": "Le stress cherche une soupape : sport, marche, pri\u00e8re. Choisis-en une \u00e0 l'avance.",
  "Ennui": "L'ennui ouvre la porte : pr\u00e9pare une liste de choses \u00e0 faire quand il arrive."
};

function noterTentation(opt) {
  opt = opt || {};
  const emo = new Set(), lieux = new Set(), decl = new Set();
  let issue = opt.issue || "tenu";
  const intens = el("input", { type: "range", min: 1, max: 5, value: 3 });
  const note = el("textarea", { placeholder: "Ce qui s'est pass\u00e9, ce que j'ai ressenti\u2026 (facultatif)" });
  const choixIssue = el("div", { className: "rangee" });
  function majIssue() {
    choixIssue.replaceChildren(
      el("button", { type: "button", className: "puce" + (issue === "tenu" ? " choisie" : ""), onclick: () => { issue = "tenu"; majIssue(); } }, "J'ai tenu"),
      el("button", { type: "button", className: "puce" + (issue === "tombe" ? " choisie" : ""), onclick: () => { issue = "tombe"; majIssue(); } }, "Je suis tomb\u00e9"));
  }
  majIssue();
  ouvrirModale(
    el("h3", null, "Noter une tentation"),
    el("p", { className: "doux" }, "Sans te juger : c'est pour mieux te conna\u00eetre."),
    el("p", null, "Intensit\u00e9 (1 \u00e0 5)"), intens,
    el("p", null, "Ce que je ressentais"), groupePuces(EMOTIONS, emo),
    el("p", null, "O\u00f9 j'\u00e9tais"), groupePuces(LIEUX, lieux),
    el("p", null, "Ce qui a d\u00e9clench\u00e9"), groupePuces(DECLENCHEURS, decl),
    el("p", null, "Issue"), choixIssue,
    note,
    bouton("Enregistrer", () => {
      etat.combat.tentations.unshift({ quand: Date.now(), intensite: Number(intens.value), emotions: [...emo], lieux: [...lieux], declencheurs: [...decl], issue, note: note.value.trim() });
      sauver(); fermerModale();
      if (issue === "tombe") pageChute(true);
      else { toast("Bravo ! Rends gr\u00e2ce \u00e0 Dieu \u{1F64F}"); if (vueActive === "liberte") rendreLiberte(); }
    }));
}

function pageChute(dejaNote) {
  ouvrirModale(
    el("h2", null, "Rel\u00e8ve-toi, tu es aim\u00e9"),
    el("p", null, "Une chute n'efface pas le chemin parcouru. Le d\u00e9couragement ne vient pas de Dieu : il ne se lasse jamais de pardonner. Comme Pierre, laisse-toi regarder par J\u00e9sus."),
    el("div", { className: "carte" }, el("h3", null, "1. Ne te cache pas"), el("p", null, "La honte isole, la v\u00e9rit\u00e9 lib\u00e8re. Parle \u00e0 J\u00e9sus maintenant, simplement.")),
    el("div", { className: "carte" }, el("h3", null, "2. Acte de contrition"), el("p", { className: "lecture-texte" }, ACTE_CONTRITION)),
    el("div", { className: "carte" }, el("h3", null, "3. Va te confesser"), el("p", null, "D\u00e8s que possible. Le sacrement de r\u00e9conciliation est la main que J\u00e9sus te tend. Rep\u00e8re les horaires de confession de ta paroisse.")),
    dejaNote ? null : el("div", { className: "carte" }, el("h3", null, "4. Comprends ce qui s'est pass\u00e9"), el("p", null, "Fatigue, solitude, \u00e9cran au lit ?"), bouton("Noter cette chute", () => noterTentation({ issue: "tombe" }), "petit")),
    el("div", { className: "carte" }, el("h3", null, (dejaNote ? "4" : "5") + ". Repars"), el("p", null, "Ton record reste. Le compteur repart avec toi."),
      bouton("Recommencer le compteur", () => {
        const c = etat.combat;
        const j = joursEntre(c.debut, Date.now());
        c.record = Math.max(c.record || 0, j);
        c.chutes.push({ quand: Date.now(), jours: j });
        c.debut = Date.now();
        sauver(); fermerModale(); toast("Nouveau d\u00e9part. Courage ! \u{1F4AA}");
        if (vueActive === "liberte") rendreLiberte();
      })));
}

function schemas() {
  const t = etat.combat.tentations;
  if (t.length < 3) return el("p", { className: "doux" }, "Note au moins 3 tentations pour voir appara\u00eetre tes sch\u00e9mas.");
  const compter = f => { const c = {}; for (const x of t) for (const k of f(x)) c[k] = (c[k] || 0) + 1; return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 4); };
  const tranche = h => h < 6 ? "Nuit (0 h - 6 h)" : h < 12 ? "Matin" : h < 18 ? "Apr\u00e8s-midi" : h < 22 ? "Soir\u00e9e" : "Tard (22 h - minuit)";
  const groupes = [];
  groupes.push(["\u{1F49B} \u00c9motions", compter(x => liste(x.emotions))]);
  groupes.push(["\u{1F4CD} Lieux", compter(x => liste(x.lieux))]);
  groupes.push(["\u26A1 D\u00e9clencheurs", compter(x => liste(x.declencheurs))]);
  groupes.push(["\u{1F552} Moments", compter(x => x.quand ? [tranche(new Date(x.quand).getHours())] : [])]);
  groupes.push(["\u{1F4C5} Jours", compter(x => x.quand ? [JOURS[new Date(x.quand).getDay()]] : [])]);
  const tenues = t.filter(x => x.issue === "tenu").length;
  const tops = compter(x => liste(x.emotions).concat(liste(x.declencheurs))).map(e => e[0]).filter(k => CONSEILS[k]).slice(0, 2);
  return el("div", null,
    el("p", null, "Victoires : " + tenues + " sur " + t.length + " tentations not\u00e9es."),
    groupes.filter(g => g[1].length).map(([titre, lignes]) => {
      const max = lignes[0][1];
      return el("div", { className: "carte" }, el("h3", null, titre), lignes.map(([k, n]) => el("div", null,
        el("div", { className: "rangee", style: "justify-content:space-between" }, el("span", null, k), el("span", { className: "doux" }, String(n))),
        el("div", { className: "barre" }, el("i", { style: "width:" + Math.round(n / max * 100) + "%" })))));
    }),
    tops.length ? el("div", { className: "carte" }, el("h3", null, "\u{1F4A1} Pistes"), tops.map(k => el("p", null, CONSEILS[k]))) : null);
}

function bilanSemaine() {
  const depuis = Date.now() - 7 * 86400000;
  const t = etat.combat.tentations.filter(x => x.quand >= depuis);
  const tenues = t.filter(x => x.issue === "tenu").length;
  const chutes = etat.combat.chutes.filter(x => (x.quand || 0) >= depuis).length;
  let priere = 0;
  for (let i = 0; i < 7; i++) { const r = etat.rituels[decaler(iso(), -i)]; if (r && (r.offrande != null || r.examen)) priere++; }
  return ["Mon bilan de la semaine",
    "Jours de libert\u00e9 : " + joursEntre(etat.combat.debut, Date.now()),
    "Tentations not\u00e9es : " + t.length + " (tenu : " + tenues + ")",
    "Chutes : " + chutes,
    "Jours avec pri\u00e8re (offrande ou examen) : " + priere + "/7",
    "", "Merci de prier pour moi \u{1F64F}"].join("\n");
}

function historique() {
  const t = etat.combat.tentations.slice(0, 10);
  if (!t.length) return el("p", { className: "doux" }, "Aucune note pour l'instant.");
  return el("div", null, t.map(x => el("div", { className: "carte" },
    el("p", { className: "doux" }, (x.issue === "tombe" ? "\u{1F49B} Chute" : "\u2705 Victoire")
      + (x.quand ? " \u00b7 " + new Date(x.quand).toLocaleString("fr-FR", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "")
      + (x.intensite ? " \u00b7 intensit\u00e9 " + x.intensite + "/5" : "")),
    el("p", null, liste(x.emotions).concat(liste(x.lieux), liste(x.declencheurs)).join(", ")),
    x.note ? el("p", { style: "white-space:pre-wrap" }, x.note) : null,
    bouton("Supprimer", () => { if (confirm("Supprimer cette note ?")) { etat.combat.tentations.splice(etat.combat.tentations.indexOf(x), 1); sauver(); rendreLiberte(); } }, "petit secondaire"))));
}

function changerDebut() {
  const r = prompt("Date de d\u00e9part (AAAA-MM-JJ) :", iso(new Date(etat.combat.debut)));
  if (!r) return;
  const [a, m, j] = r.split("-").map(Number);
  const d = new Date(a, m - 1, j).getTime();
  if (isNaN(d) || d > Date.now()) { alert("Date invalide."); return; }
  etat.combat.debut = d; sauver(); rendreLiberte();
}

function reglagesLiberte() {
  const R = etat.reglages;
  const lettre = el("textarea", { placeholder: "\u00c9cris \u00e0 ton futur toi tent\u00e9 : pourquoi tu te bats, qui tu veux devenir, ce que Dieu t'a d\u00e9j\u00e0 donn\u00e9\u2026", value: R.lettre });
  lettre.oninput = () => { R.lettre = lettre.value; sauver(); };
  const contacts = R.contacts.slice(0, 2).map((c, i) => {
    const nom = el("input", { placeholder: "Pr\u00e9nom (accompagnateur, ami, pr\u00eatre\u2026)", value: c.nom });
    const tel = el("input", { type: "tel", placeholder: "Num\u00e9ro de t\u00e9l\u00e9phone", value: c.tel });
    nom.oninput = () => { c.nom = nom.value; sauver(); };
    tel.oninput = () => { c.tel = tel.value.trim(); sauver(); };
    return el("div", null, el("p", { className: "doux" }, "Contact " + (i + 1)), nom, tel);
  });
  const pin = el("input", { type: "password", inputMode: "numeric", placeholder: "Nouveau code (4 chiffres ou plus)" });
  return el("div", { className: "carte" },
    el("h3", null, "Lettre \u00e0 moi-m\u00eame"), el("p", { className: "doux" }, "Elle s'affiche dans le bouton SOS."), lettre,
    el("h3", null, "Mes 2 contacts de confiance"), contacts,
    el("h3", null, "Code secret"),
    el("p", { className: "doux" }, R.pin ? "Un code prot\u00e8ge cet espace." : "Aucun code pour l'instant."),
    pin,
    el("div", { className: "rangee" },
      bouton(R.pin ? "Changer le code" : "Activer le code", async () => {
        if (pin.value.length < 4) { toast("4 chiffres minimum"); return; }
        R.pin = await hacher(pin.value); sauver(); toast("Code enregistr\u00e9"); rendreLiberte();
      }, "petit"),
      R.pin ? bouton("Retirer le code", () => { R.pin = ""; sauver(); rendreLiberte(); }, "petit secondaire") : null),
    el("h3", null, "Date de d\u00e9part"),
    bouton("Changer la date de d\u00e9part", changerDebut, "petit secondaire"));
}

function ecranPin() {
  const champ = el("input", { type: "password", inputMode: "numeric", placeholder: "Code" });
  const msg = el("p", { className: "doux" });
  const ouvrir = async () => {
    if (await hacher(champ.value) === etat.reglages.pin) { deverrouille = true; rendreLiberte(); }
    else { msg.textContent = "Code incorrect."; champ.value = ""; }
  };
  champ.onkeydown = e => { if (e.key === "Enter") ouvrir(); };
  return el("div", { className: "carte centre" },
    el("p", { style: "font-size:40px;margin:0" }, "\u{1F512}"),
    el("p", null, "Espace prot\u00e9g\u00e9"),
    champ, bouton("Ouvrir", ouvrir), msg,
    bouton("Code oubli\u00e9 ?", () => {
      const r = prompt("\u00c9cris EFFACER pour retirer le code (tes notes restent intactes) :");
      if (r && r.trim().toUpperCase() === "EFFACER") { etat.reglages.pin = ""; sauver(); rendreLiberte(); }
    }, "petit secondaire"));
}

function rendreLiberte() {
  const v = $("vue-liberte");
  if (etat.reglages.pin && !deverrouille) { v.replaceChildren(ecranPin()); return; }
  const c = etat.combat;
  const jours = joursEntre(c.debut, Date.now());
  if (jours > (c.record || 0)) { c.record = jours; sauver(); }
  const atteinte = ETAPES.filter(e => e[0] <= jours).pop();
  const prochaine = ETAPES.find(e => e[0] > jours);
  const prec = atteinte ? atteinte[0] : 0;
  v.replaceChildren(
    el("div", { className: "carte centre" },
      el("div", { className: "grand" }, String(jours)),
      el("p", { style: "margin:0" }, jours > 1 ? "jours de libert\u00e9" : "jour de libert\u00e9"),
      el("p", { className: "doux" }, "Record : " + c.record + " j \u00b7 depuis le " + new Date(c.debut).toLocaleDateString("fr-FR")),
      prochaine
        ? el("div", null, el("p", { className: "doux" }, "Prochaine \u00e9tape : " + prochaine[0] + " jours"), el("div", { className: "barre" }, el("i", { style: "width:" + Math.round((jours - prec) / (prochaine[0] - prec) * 100) + "%" })))
        : el("p", null, "Un an et plus : gloire \u00e0 Dieu !"),
      atteinte
        ? el("p", null, el("strong", null, atteinte[1]), " \u2014 " + atteinte[2])
        : el("p", { className: "doux" }, "Chaque jour compte. J\u00e9sus marche avec toi.")),
    el("div", { className: "rangee" },
      bouton("\u{1F4DD} Noter une tentation", () => noterTentation()),
      bouton("Je suis tomb\u00e9", () => pageChute(false), "secondaire")),
    el("h2", null, "Ce que je d\u00e9couvre de moi"),
    schemas(),
    el("h2", null, "Bilan de la semaine"),
    el("div", { className: "carte" },
      el("p", { style: "white-space:pre-wrap" }, bilanSemaine()),
      bouton("Partager \u00e0 mon accompagnateur", () => partager("Mon bilan", bilanSemaine()), "petit")),
    el("h2", null, "Mes derni\u00e8res notes"),
    historique(),
    el("h2", null, "Mon espace"),
    reglagesLiberte());
}

(window.CHARGE = window.CHARGE || []).push("4");
