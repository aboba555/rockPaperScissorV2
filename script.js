const FIGURY = {
    kamen:  { nazev: "Kámen",  porazi: ["nuzky"] },
    nuzky:  { nazev: "Nůžky",  porazi: ["papir"] },
    papir:  { nazev: "Papír",  porazi: ["kamen", "studna"] },
    studna: { nazev: "Studna", porazi: ["kamen", "nuzky"] }
};

const MAX_ZIVOTU = 5;

let zivotyHrace;
let zivotyPocitace;

function novaHra() {
    zivotyHrace = MAX_ZIVOTU;
    zivotyPocitace = MAX_ZIVOTU;

    document.getElementById("vysledek").textContent = "Vyber si figuru";
    document.getElementById("vysledek").className = "";
    document.getElementById("znovu").hidden = true;

    vykresli();
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

function odehrajKolo(volbaHrace) {
    if (zivotyHrace === 0 || zivotyPocitace === 0) return;

    const volbaPocitace = nahodnaFigura();
    const vysledek = vyhodnot(volbaHrace, volbaPocitace);

    if (vysledek === "vyhra") zivotyPocitace--;
    if (vysledek === "prohra") zivotyHrace--;

    const text = FIGURY[volbaHrace].nazev + " vs " + FIGURY[volbaPocitace].nazev;
    const texty = { vyhra: "Vyhrál jsi kolo", prohra: "Prohrál jsi kolo", remiza: "Remíza" };
    const elVysledek = document.getElementById("vysledek");
    elVysledek.textContent = text + " - " + texty[vysledek];
    elVysledek.className = vysledek;

    if (zivotyHrace === 0 || zivotyPocitace === 0) {
        elVysledek.textContent = zivotyHrace === 0 ? "Prohrál jsi hru!" : "Vyhrál jsi hru!";
        document.getElementById("znovu").hidden = false;
    }

    vykresli();
}

function vykresli() {
    document.getElementById("zivotyHrace").textContent = zivotyHrace;
    document.getElementById("zivotyPocitace").textContent = zivotyPocitace;
}

document.querySelectorAll("#tlacitka button").forEach(tlacitko => {
    tlacitko.addEventListener("click", () => odehrajKolo(tlacitko.dataset.figura));
});

document.getElementById("znovu").addEventListener("click", novaHra);

novaHra();
