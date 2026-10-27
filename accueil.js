// accueil.js - version 2
// Page d'accueil : question "premiere connexion ?" puis priere obligatoire.
//
// Seul nombre a changer si tu veux :
var DUREE_PRIERE_SECONDES = 30;   // temps minimum de priere (en secondes)

(function () {
  var CLE_JOUR = "bj-accueil-jour";        // date du dernier passage
  var CLE_ENCOURS = "bj-accueil-encours";  // date si une priere a ete commencee

  function aujourdhui() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var j = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (j < 10 ? "0" : "") + j;
  }

  var JOUR = aujourdhui();
  if (localStorage.getItem(CLE_JOUR) === JOUR) return;   // deja passe aujourd'hui

  var PRIERE = [
    "\u271D Au nom du P\u00e8re, et du Fils, et du Saint-Esprit.",
    "Seigneur, avant d'ouvrir cet \u00e9cran, je me tourne vers toi.",
    "Tu m'as donn\u00e9 ce temps, ces yeux et ce c\u0153ur : qu'ils restent tourn\u00e9s vers toi.",
    "Garde-moi du d\u00e9filement sans fin, de la curiosit\u00e9 vaine et des images qui blessent.",
    "Donne-moi de chercher ce qui est vrai, ce qui est bon, ce qui \u00e9l\u00e8ve.",
    "Quand je serai tent\u00e9 de fuir dans l'\u00e9cran, rappelle-moi que tu es l\u00e0, et que ta Parole suffit.",
    "Que je sache m'arr\u00eater, poser le t\u00e9l\u00e9phone, et retrouver le silence o\u00f9 tu parles.",
    "Saint Isidore de S\u00e9ville, patron d'internet, prie pour moi.",
    "Marie, garde mon regard pur et mon c\u0153ur libre.",
    "Amen."
  ];

  function creer(tag, classe, texte) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte) e.textContent = texte;
    return e;
  }

  var style = document.createElement("style");
  style.textContent =
    "#accueil-priere{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;background:#f7f3ea;color:#2b2b2b;overflow:auto;padding:28px 20px 48px;font-family:Georgia,'Times New Roman',serif;-webkit-overflow-scrolling:touch}" +
    ".ap-boite{max-width:520px;margin:0 auto;text-align:center}" +
    ".ap-titre{font-size:26px;font-weight:bold;margin-bottom:6px;color:#5a3e1b}" +
    ".ap-sous{font-size:15px;color:#6b6b6b;margin:0 0 22px;font-style:italic}" +
    ".ap-texte{text-align:left;background:#fffdf8;border:1px solid #e3d9c6;border-radius:14px;padding:18px 18px 8px;box-shadow:0 2px 8px rgba(0,0,0,.06)}" +
    ".ap-texte p{font-size:18px;line-height:1.55;margin:0 0 12px}" +
    ".ap-compteur{font-size:48px;font-weight:bold;margin:26px 0 4px;color:#5a3e1b;font-variant-numeric:tabular-nums}" +
    ".ap-info{font-size:14px;color:#6b6b6b;margin:0 0 18px}" +
    ".ap-btn{display:block;width:100%;font-size:18px;padding:16px;border:0;border-radius:14px;background:#5a3e1b;color:#fff;font-family:inherit;cursor:pointer;margin-top:12px}" +
    ".ap-btn.ap-clair{background:#fffdf8;color:#5a3e1b;border:2px solid #5a3e1b}" +
    ".ap-question{font-size:22px;margin:40px 0 24px;line-height:1.4}";
  document.head.appendChild(style);

  var fond = creer("div", "", "");
  fond.id = "accueil-priere";
  var boite = creer("div", "ap-boite", "");
  fond.appendChild(boite);
  document.body.appendChild(fond);

  function fermer() {
    localStorage.setItem(CLE_JOUR, JOUR);
    localStorage.removeItem(CLE_ENCOURS);
    if (fond.parentNode) fond.parentNode.removeChild(fond);
  }

  function montrerQuestion() {
    boite.innerHTML = "";
    boite.appendChild(creer("div", "ap-titre", "Bonjour"));
    boite.appendChild(creer("p", "ap-question", "Est-ce ta premi\u00e8re connexion aujourd'hui ?"));

    var oui = creer("button", "ap-btn", "Oui, c'est la premi\u00e8re fois \u2014 je prie d'abord");
    oui.onclick = function () {
      localStorage.setItem(CLE_ENCOURS, JOUR);
      montrerPriere();
    };
    var non = creer("button", "ap-btn ap-clair", "Non, j'ai d\u00e9j\u00e0 pri\u00e9 aujourd'hui");
    non.onclick = fermer;

    boite.appendChild(oui);
    boite.appendChild(non);
    boite.appendChild(creer("p", "ap-info", "R\u00e9ponds en v\u00e9rit\u00e9, devant Dieu."));
  }

  function montrerPriere() {
    boite.innerHTML = "";
    window.scrollTo(0, 0);
    fond.scrollTop = 0;
    boite.appendChild(creer("div", "ap-titre", "Avant d'entrer"));
    boite.appendChild(creer("p", "ap-sous", "Prends un instant pour prier avant d'utiliser ton t\u00e9l\u00e9phone."));

    var texte = creer("div", "ap-texte", "");
    PRIERE.forEach(function (ligne) {
      texte.appendChild(creer("p", "", ligne));
    });
    boite.appendChild(texte);

    var compteur = creer("div", "ap-compteur", "");
    var info = creer("p", "ap-info", "Prie lentement. Le bouton appara\u00eetra quand le temps sera \u00e9coul\u00e9.");
    var btn = creer("button", "ap-btn", "Amen \u2014 entrer dans mon journal");
    btn.style.display = "none";
    btn.onclick = fermer;
    boite.appendChild(compteur);
    boite.appendChild(info);
    boite.appendChild(btn);

    var fin = Date.now() + DUREE_PRIERE_SECONDES * 1000;
    var horloge = null;

    function tic() {
      var reste = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      var m = Math.floor(reste / 60);
      var s = reste % 60;
      compteur.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      if (reste <= 0) {
        if (horloge) clearInterval(horloge);
        compteur.textContent = "\u271D";
        info.textContent = "Reste encore un instant en silence, puis entre quand tu es pr\u00eat.";
        btn.style.display = "block";
      }
    }

    tic();
    horloge = setInterval(tic, 500);
  }

  if (localStorage.getItem(CLE_ENCOURS) === JOUR) {
    montrerPriere();   // priere commencee puis page rechargee : pas d'echappatoire
  } else {
    montrerQuestion();
  }
})();
