// fil-plus.js - version 1
// Ajoute dans le Fil : citations de saints, images sacrees pour prier, courtes prieres.
//
// Nombres a changer si tu veux :
var NB_CITATIONS_FIL = 4;
var NB_IMAGES_FIL = 3;
var NB_PRIERES_FIL = 2;

(function () {
  function g(id) { return document.getElementById(id); }

  var CITATIONS = [
    ["Tu nous as faits pour toi, Seigneur, et notre c\u0153ur est sans repos tant qu'il ne repose en toi.", "Saint Augustin"],
    ["Aime, et fais ce que tu veux.", "Saint Augustin"],
    ["Tard je t'ai aim\u00e9e, Beaut\u00e9 si ancienne et si nouvelle, tard je t'ai aim\u00e9e.", "Saint Augustin"],
    ["Que rien ne te trouble, que rien ne t'effraie. Tout passe, Dieu ne change pas. Dieu seul suffit.", "Sainte Th\u00e9r\u00e8se d'Avila"],
    ["Aimer, c'est tout donner, et se donner soi-m\u00eame.", "Sainte Th\u00e9r\u00e8se de Lisieux"],
    ["Ma vocation, c'est l'amour.", "Sainte Th\u00e9r\u00e8se de Lisieux"],
    ["Soyez ce que vous \u00eates, et soyez-le bien.", "Saint Fran\u00e7ois de Sales"],
    ["N'ayez pas peur ! Ouvrez, ouvrez toutes grandes les portes au Christ.", "Saint Jean-Paul II"],
    ["Si vous \u00eates ce que vous devez \u00eatre, vous mettrez le feu au monde entier.", "Sainte Catherine de Sienne"],
    ["Prie, esp\u00e8re et ne t'inqui\u00e8te pas.", "Saint Padre Pio"],
    ["Mon P\u00e8re, je m'abandonne \u00e0 toi, fais de moi ce qu'il te plaira.", "Saint Charles de Foucauld"],
    ["Au soir de la vie, nous serons jug\u00e9s sur l'amour.", "Saint Jean de la Croix"],
    ["Je l'avise, et il m'avise.", "Un paysan d'Ars, devant le tabernacle (rapport\u00e9 par le saint Cur\u00e9 d'Ars)"],
    ["La gloire de Dieu, c'est l'homme vivant ; et la vie de l'homme, c'est la vision de Dieu.", "Saint Ir\u00e9n\u00e9e de Lyon"],
    ["Tous naissent originaux, mais beaucoup meurent comme des photocopies.", "Saint Carlo Acutis"],
    ["L'Eucharistie est mon autoroute vers le ciel.", "Saint Carlo Acutis"],
    ["J\u00e9sus, j'ai confiance en toi.", "Sainte Faustine"],
    ["Seul l'amour cr\u00e9e.", "Saint Maximilien Kolbe"],
    ["Commence par faire le n\u00e9cessaire, puis ce qui est possible, et tu r\u00e9aliseras l'impossible sans t'en apercevoir.", "Saint Fran\u00e7ois d'Assise"],
    ["Si tu juges les gens, tu n'as pas le temps de les aimer.", "Sainte Teresa de Calcutta"],
    ["Dans le silence du c\u0153ur, Dieu parle.", "Sainte Teresa de Calcutta"],
    ["Ora et labora : prie et travaille.", "Saint Beno\u00eet"],
    ["Servez le Seigneur dans la joie.", "Saint Jean Bosco"],
    ["En tout, aimer et servir.", "Saint Ignace de Loyola"]
  ];

  var PRIERES = [
    ["Pri\u00e8re de J\u00e9sus", "Seigneur J\u00e9sus-Christ, Fils de Dieu, aie piti\u00e9 de moi, p\u00e9cheur.\n(\u00e0 r\u00e9p\u00e9ter lentement, au rythme de la respiration)"],
    ["Gloire au P\u00e8re", "Gloire au P\u00e8re, et au Fils, et au Saint-Esprit, comme il \u00e9tait au commencement, maintenant et toujours, et dans les si\u00e8cles des si\u00e8cles. Amen."],
    ["Viens, Esprit Saint", "Viens, Esprit Saint, remplis le c\u0153ur de tes fid\u00e8les et allume en eux le feu de ton amour."],
    ["\u00c2me du Christ", "\u00c2me du Christ, sanctifie-moi. Corps du Christ, sauve-moi. Sang du Christ, enivre-moi. Eau du c\u00f4t\u00e9 du Christ, lave-moi. Passion du Christ, fortifie-moi. \u00d4 bon J\u00e9sus, exauce-moi."],
    ["Pri\u00e8re de Fatima", "Mon Dieu, je crois, j'adore, j'esp\u00e8re et je vous aime. Je vous demande pardon pour ceux qui ne croient pas, n'adorent pas, n'esp\u00e8rent pas et ne vous aiment pas."],
    ["Sous ta protection", "Sous l'abri de ta mis\u00e9ricorde, nous nous r\u00e9fugions, Sainte M\u00e8re de Dieu. Ne m\u00e9prise pas nos pri\u00e8res quand nous sommes dans l'\u00e9preuve, mais de tous les dangers d\u00e9livre-nous toujours, Vierge glorieuse et b\u00e9nie."],


$$
"Instrument de ta paix", "Seigneur, fais de moi un instrument de ta paix. L\u00e0 o\u00f9 est la haine, que je mette l'amour. L\u00e0 o\u00f9 est l'offense, que je mette le pardon. L\u00e0 o\u00f9 est le d\u00e9sespoir, que je mette l'esp\u00e9rance."]
$$


  ];

  // [titre de la page Wikipedia (anglais), legende, question pour mediter]
  var IMAGES = [
    ["Christ Pantocrator (Sinai)", "Christ Pantocrator, ic\u00f4ne du Sina\u00ef (VIe si\u00e8cle)", "Regarde ses deux visages : le juge et le mis\u00e9ricordieux. Lequel te regarde aujourd'hui ?"],
    ["Trinity (Andrei Rublev)", "La Trinit\u00e9, Andre\u00ef Roublev (vers 1411)", "Une place est libre \u00e0 la table. Elle est pour toi."],
    ["Theotokos of Vladimir", "Vierge de Vladimir (XIIe si\u00e8cle)", "L'Enfant colle sa joue \u00e0 celle de sa M\u00e8re. Laisse-toi regarder comme cela."],
    ["The Return of the Prodigal Son (Rembrandt)", "Le Retour du fils prodigue, Rembrandt (vers 1668)", "Regarde les mains du P\u00e8re. Que lui dis-tu ?"],
    ["The Angelus (painting)", "L'Ang\u00e9lus, Jean-Fran\u00e7ois Millet (1859)", "S'arr\u00eater au milieu du travail pour prier : et toi, quand ?"],
    ["Divine Mercy image", "J\u00e9sus mis\u00e9ricordieux (vision de sainte Faustine)", "J\u00e9sus, j'ai confiance en toi. R\u00e9p\u00e8te-le trois fois."],
    ["Our Lady of Perpetual Help", "Notre-Dame du Perp\u00e9tuel Secours", "Confie-lui ce qui te p\u00e8se en ce moment."],
    ["Christ of Saint John of the Cross", "Le Christ de saint Jean de la Croix, Salvador Dal\u00ed (1951)", "Vu d'en haut, comme le P\u00e8re le voit. Que ressens-tu ?"],
    ["Piet\u00e0 (Michelangelo)", "La Piet\u00e0, Michel-Ange (1499)", "Marie porte le corps de son Fils. Porte-lui aussi tes blessures."],
    ["The Calling of St Matthew", "La Vocation de saint Matthieu, Le Caravage (1600)", "Le doigt du Christ te d\u00e9signe. Que r\u00e9ponds-tu ?"],
    ["Light of the World (painting)", "La Lumi\u00e8re du monde, William Holman Hunt (1853)", "La porte n'a pas de poign\u00e9e \u00e0 l'ext\u00e9rieur : c'est toi qui ouvres."],
    ["Sistine Madonna", "La Madone Sixtine, Rapha\u00ebl (1512)", "Marie s'avance vers toi avec l'Enfant. Accueille-les."],
    ["Our Lady of Guadalupe", "Notre-Dame de Guadalupe (1531)", "\u00ab Ne suis-je pas ici, moi qui suis ta M\u00e8re ? \u00bb"],
    ["Ecce Homo (Ciseri)", "Ecce Homo, Antonio Ciseri (vers 1871)", "\u00ab Voici l'homme. \u00bb Reste un instant devant lui."],
    ["Salvator Mundi (Leonardo)", "Salvator Mundi, L\u00e9onard de Vinci (vers 1500)", "Il tient le monde dans sa main : ton monde aussi."],
    ["Our Lady of Kazan", "Notre-Dame de Kazan (ic\u00f4ne)", "Elle montre son Fils. Suis son regard."],
    ["Ghent Altarpiece", "L'Agneau mystique, van Eyck (1432)", "L'Agneau immol\u00e9 et vivant. Adore en silence."],


$$
"The Last Supper (Leonardo)", "La C\u00e8ne, L\u00e9onard de Vinci (1498)", "\u00ab Faites ceci en m\u00e9moire de moi. \u00bb Quand est ta prochaine messe ?"
$$


  ];

  var style = document.createElement("style");
  style.textContent =
    "#fil-plus{margin:24px 0 40px;font-family:Georgia,'Times New Roman',serif}" +
    ".fp-titre{font-size:22px;color:#5a3e1b;margin:0 0 4px;text-align:center}" +
    ".fp-sous{font-size:14px;color:#6b6b6b;text-align:center;margin:0 0 16px;font-style:italic}" +
    ".fp-carte{background:#fffdf8;color:#2b2b2b;border:1px solid #e3d9c6;border-radius:14px;padding:16px;margin:12px 0;box-shadow:0 2px 8px rgba(0,0,0,.06)}" +
    ".fp-cit{font-size:19px;font-style:italic;line-height:1.5;margin:0}" +
    ".fp-auteur{text-align:right;color:#5a3e1b;margin:10px 0 0;font-size:14px}" +
    ".fp-img{width:100%;border-radius:10px;display:block;background:#eee;min-height:120px}" +
    ".fp-leg{font-size:13px;color:#6b6b6b;margin:8px 0 0}" +
    ".fp-q{font-size:16px;margin:8px 0 0;line-height:1.45}" +
    ".fp-ptitre{font-size:14px;color:#5a3e1b;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px}" +
    ".fp-ptexte{font-size:18px;line-height:1.5;margin:0;white-space:pre-line}" +
    ".fp-btn{display:block;width:100%;font-size:17px;padding:14px;border:0;border-radius:14px;background:#5a3e1b;color:#fff;font-family:inherit;cursor:pointer;margin-top:16px}" +
    "#fp-plein{position:fixed;top:0;left:0;right:0;bottom:0;z-index:99998;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px}" +
    "#fp-plein img{max-width:100%;max-height:80vh;border-radius:6px}" +
    "#fp-plein p{color:#ddd;font-size:14px;text-align:center;margin:12px 0 0;font-family:Georgia,serif}";
  document.head.appendChild(style);

  function creer(tag, classe, texte) {
    var e = document.createElement(tag);
    if (classe) e.className = classe;
    if (texte) e.textContent = texte;
    return e;
  }

  function jour() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function graine(txt) {
    var h = 2166136261;
    for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function alea(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function tirer(liste, n, rnd) {
    var copie = liste.slice(), res = [];
    while (res.length < n && copie.length) res.push(copie.splice(Math.floor(rnd() * copie.length), 1)[0]);
    return res;
  }

  function selection(texteGraine) {
    var rnd = alea(graine(texteGraine));
    var tout = [];
    tirer(IMAGES, NB_IMAGES_FIL, rnd).forEach(function (x) { tout.push(["image", x]); });
    tirer(CITATIONS, NB_CITATIONS_FIL, rnd).forEach(function (x) { tout.push(["citation", x]); });
    tirer(PRIERES, NB_PRIERES_FIL, rnd).forEach(function (x) { tout.push(["priere", x]); });
    return tirer(tout, tout.length, rnd);
  }

  var CACHE_CLE = "bj-fil-images";
  var cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_CLE) || "{}"); } catch (e) { cache = {}; }

  function urlImage(titre, cb) {
    if (cache[titre]) return cb(cache[titre]);
    var url = "https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&piprop=thumbnail&pithumbsize=800&redirects=1&format=json&origin=*&titles=" + encodeURIComponent(titre.replace(/ /g, "_"));
    fetch(url).then(function (r) { return r.json(); }).then(function (j) {
      var pages = (j.query && j.query.pages) || {};
      var u = null;
      for (var k in pages) { if (pages[k].thumbnail && pages[k].thumbnail.source) u = pages[k].thumbnail.source; }
      if (!u) return cb(null);
      cache[titre] = u;
      try { localStorage.setItem(CACHE_CLE, JSON.stringify(cache)); } catch (e) {}
      cb(u);
    }).catch(function () { cb(null); });
  }

  function pleinEcran(src, legende) {
    var f = creer("div", "", "");
    f.id = "fp-plein";
    var img = creer("img", "", "");
    img.src = src;
    f.appendChild(img);
    f.appendChild(creer("p", "", legende + " \u2014 touche pour fermer"));
    f.onclick = function () { f.parentNode.removeChild(f); };
    document.body.appendChild(f);
  }

  function carte(item) {
    var type = item[0], d = item[1];
    var c = creer("div", "fp-carte", "");
    if (type === "citation") {
      c.appendChild(creer("p", "fp-cit", "\u201C " + d[0] + " \u201D"));
      c.appendChild(creer("p", "fp-auteur", "\u2014 " + d[1]));
    } else if (type === "priere") {
      c.appendChild(creer("p", "fp-ptitre", d[0]));
      c.appendChild(creer("p", "fp-ptexte", d[1]));
    } else {
      var img = creer("img", "fp-img", "");
      img.alt = d[1];
      c.appendChild(img);
      c.appendChild(creer("p", "fp-leg", d[1]));
      c.appendChild(creer("p", "fp-q", d[2]));
      urlImage(d[0], function (u) {
        if (!u) { if (c.parentNode) c.parentNode.removeChild(c); return; }
        img.src = u;
        img.onerror = function () { if (c.parentNode) c.parentNode.removeChild(c); };
        img.onclick = function () { pleinEcran(u, d[1]); };
      });
    }
    return c;
  }

  var choixCourant = null;

  function construireBloc() {
    var bloc = creer("section", "", "");
    bloc.id = "fil-plus";
    bloc.appendChild(creer("h2", "fp-titre", "Pour nourrir ta pri\u00e8re"));
    bloc.appendChild(creer("p", "fp-sous", "Citations de saints, images et pri\u00e8res. Prends-en une, et reste avec elle."));
    if (!choixCourant) choixCourant = selection(jour());
    choixCourant.forEach(function (it) { bloc.appendChild(carte(it)); });
    var btn = creer("button", "fp-btn", "Voir d'autres");
    btn.onclick = function () {
      choixCourant = selection(String(Math.random()));
      var neuf = construireBloc();
      bloc.parentNode.replaceChild(neuf, bloc);
    };
    bloc.appendChild(btn);
    return bloc;
  }

  // --- Savoir si on est dans l'onglet Fil, et ou mettre le bloc ---
  var vueCourante = null;
  try {
    if (typeof vue === "function") {
      var vueSansFilPlus = vue;
      vue = function (nom) { vueCourante = nom; return vueSansFilPlus.apply(this, arguments); };
    }
  } catch (e) {}

  function filEnPause() {
    var v = localStorage.getItem("bj-fil-fin");
    if (!v) return false;
    var t = Number(v);
    if (isNaN(t)) t = Date.parse(v);
    return t > Date.now();
  }

  function dansLeFil() {
    try { if (typeof vueActive !== "undefined" && String(vueActive).toLowerCase() === "fil") return true; } catch (e) {}
    if (String(vueCourante).toLowerCase() === "fil") return true;
    var actif = document.querySelector(".onglet.actif, .onglet.active, .tab.actif, .tab.active, [aria-selected='true'], nav .actif, nav .active");
    if (actif && actif.textContent.toLowerCase().indexOf("fil") >= 0) return true;
    return false;
  }

  function conteneur() {
    var ids = ["vue-fil", "fil", "f-fil", "contenu-fil", "p-fil", "contenu", "vue", "vues", "page", "app", "main"];
    for (var i = 0; i < ids.length; i++) { if (g(ids[i])) return g(ids[i]); }
    return document.querySelector("main") || document.body;
  }

  setInterval(function () {
    var bloc = g("fil-plus");
    if (dansLeFil() && !filEnPause()) {
      if (!bloc) conteneur().appendChild(construireBloc());
    } else if (bloc) {
      bloc.parentNode.removeChild(bloc);
    }
  }, 400);
})();
