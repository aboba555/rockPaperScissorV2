const FIGURY = {
    kamen:  { nazev: "Kámen",  porazi: ["nuzky"] },
    nuzky:  { nazev: "Nůžky",  porazi: ["papir"] },
    papir:  { nazev: "Papír",  porazi: ["kamen", "studna"] },
    studna: { nazev: "Studna", porazi: ["kamen", "nuzky"] }
};

const MAX_ZIVOTU = 5;
const CAS_NA_TAH = 5;

let zivotyHrace;
let zivotyPocitace;
let stitDostupny;
let stitZapnuty;
let pocetTahu;
let historie;
let kola;
let vyhry;
let casovac;
let zbyvaCas;

function novaHra() {
    zivotyHrace = MAX_ZIVOTU;
    zivotyPocitace = MAX_ZIVOTU;
    stitDostupny = true;
    stitZapnuty = false;
    pocetTahu = { kamen: 0, nuzky: 0, papir: 0, studna: 0 };
    historie = [];
    kola = 0;
    vyhry = 0;

    document.getElementById("vysledek").textContent = "Vyber si figuru";
    document.getElementById("vysledek").className = "";
    document.getElementById("znovu").hidden = true;

    vykresli();
    spustCasovac();
}

function vyhodnot(hrac, pocitac) {
    if (hrac === pocitac) return "remiza";
    if (FIGURY[hrac].porazi.includes(pocitac)) return "vyhra";
    return "prohra";
}

function nahodnaFigura() {
    const klice = Object.keys(FIGURY);
    return klice[Math.floor(Math.random() * klice.length)];
}

function nejcastejsiTah() {
    let nejcastejsi = "kamen";
    for (const klic in pocetTahu) {
        if (pocetTahu[klic] > pocetTahu[nejcastejsi]) {
            nejcastejsi = klic;
        }
    }
    return nejcastejsi;
}

function tahPocitace() {
    const chytry = document.getElementById("chytry").checked;

    if (!chytry || kola < 3 || Math.random() > 0.7) {
        return nahodnaFigura();
    }

    const oblibena = nejcastejsiTah();
    const protitahy = Object.keys(FIGURY).filter(klic => FIGURY[klic].porazi.includes(oblibena));
    return protitahy[Math.floor(Math.random() * protitahy.length)];
}

function odehrajKolo(volbaHrace) {
    if (zivotyHrace === 0 || zivotyPocitace === 0) return;
    clearInterval(casovac);

    const volbaPocitace = tahPocitace();
    let vysledek = "prohra";

    if (volbaHrace !== null) {
        pocetTahu[volbaHrace]++;
        vysledek = vyhodnot(volbaHrace, volbaPocitace);
    }

    if (stitZapnuty) {
        stitZapnuty = false;
        stitDostupny = false;
        if (vysledek === "prohra") vysledek = "remiza";
    }

    if (vysledek === "vyhra") {
        zivotyPocitace--;
        vyhry++;
    }
    if (vysledek === "prohra") {
        zivotyHrace--;
    }
    kola++;

    const hrac = volbaHrace ? FIGURY[volbaHrace].nazev : "Nic";
    const text = hrac + " vs " + FIGURY[volbaPocitace].nazev;
    historie.unshift({ text: text, vysledek: vysledek });
    if (historie.length > 10) historie.pop();

    const texty = { vyhra: "Vyhrál jsi kolo", prohra: "Prohrál jsi kolo", remiza: "Remíza" };
    const elVysledek = document.getElementById("vysledek");
    elVysledek.textContent = text + " - " + texty[vysledek];
    elVysledek.className = vysledek;

    if (zivotyHrace === 0 || zivotyPocitace === 0) {
        elVysledek.textContent = zivotyHrace === 0 ? "Prohrál jsi hru!" : "Vyhrál jsi hru!";
        document.getElementById("znovu").hidden = false;
        document.getElementById("cas").textContent = "";
    } else {
        spustCasovac();
    }

    vykresli();
}

function spustCasovac() {
    clearInterval(casovac);
    document.getElementById("cas").textContent = "";

    if (!document.getElementById("casovacZapnuty").checked) return;
    if (zivotyHrace === 0 || zivotyPocitace === 0) return;

    zbyvaCas = CAS_NA_TAH;
    document.getElementById("cas").textContent = "Zbývá: " + zbyvaCas + " s";

    casovac = setInterval(() => {
        zbyvaCas--;
        document.getElementById("cas").textContent = "Zbývá: " + zbyvaCas + " s";
        if (zbyvaCas === 0) {
            odehrajKolo(null);
        }
    }, 1000);
}

function vykresli() {
    document.getElementById("zivotyHrace").textContent = zivotyHrace;
    document.getElementById("zivotyPocitace").textContent = zivotyPocitace;

    const uspesnost = kola ? Math.round(vyhry / kola * 100) : 0;
    document.getElementById("statistiky").textContent =
        "Kola: " + kola + " | Výhry: " + vyhry + " | Úspěšnost: " + uspesnost + " %";

    const elHistorie = document.getElementById("historie");
    elHistorie.innerHTML = "";
    for (const kolo of historie) {
        const li = document.createElement("li");
        li.textContent = kolo.text;
        li.className = kolo.vysledek;
        elHistorie.appendChild(li);
    }

    const stit = document.getElementById("stit");
    stit.disabled = !stitDostupny;
    if (stitZapnuty) stit.textContent = "Štít zapnutý";
    else if (stitDostupny) stit.textContent = "Štít (1x)";
    else stit.textContent = "Štít použit";
}

document.querySelectorAll("#tlacitka button").forEach(tlacitko => {
    tlacitko.addEventListener("click", () => odehrajKolo(tlacitko.dataset.figura));
});

document.getElementById("stit").addEventListener("click", () => {
    stitZapnuty = !stitZapnuty;
    vykresli();
});

document.getElementById("casovacZapnuty").addEventListener("change", spustCasovac);
document.getElementById("znovu").addEventListener("click", novaHra);

novaHra();
