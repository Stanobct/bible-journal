// accueil.js - version 1
// Page d'accueil : priere avant d'utiliser l'application.
//
// Les deux nombres ci-dessous sont les seuls a changer si tu veux :
var DUREE_PRIERE_SECONDES = 30;        // temps minimum de priere (en secondes)
var PAUSE_ENTRE_PRIERES_MINUTES = 10;  // si tu as deja prie il y a moins de X minutes, la page ne revient pas (mets 0 pour l'avoir a chaque fois)

(function () {
  var CLE = "bj-accueil-derniere";
  var derniere = parseInt(localStorage.getItem(CLE) || "0", 10);
  if (Date.now() - derniere < PAUSE_ENTRE_PRIERES_MINUTES * 60000) return;

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
    ".ap-btn{display:none;width:100%;font-size:18px;padding:16px;border:0;border-radius:14px;background:#5a3e1b;color:#fff;font-family:inherit;cursor:pointer}";
  document.head.appendChild(style);

  var fond = creer("div", "", "");
  fond.id = "accueil-priere";
  var boite = creer("div", "ap-boite", "");
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
  btn.onclick = function () {
    localStorage.setItem(CLE, String(Date.now()));
    fond.parentNode.removeChild(fond);
  };
  boite.appendChild(compteur);
  boite.appendChild(info);
  boite.appendChild(btn);
  fond.appendChild(boite);
  document.body.appendChild(fond);

  var fin = Date.now() + DUREE_PRIERE_SECONDES * 1000;
  var horloge = null;

  function tic() {
    var reste = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
    var m = Math.floor(reste / 15);
    var s = reste % 15;
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
})();
