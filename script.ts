class Punto {// misure in cm
    x: number;
    y: number;
    /**
     * Due punti con cordinate dati in centimetri
     * @param x ascissa
     * @param y ordinata
     */
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    xMetri(): number {
        return this.x / 100;
    }
    yMetri(): number {
        return this.y / 100;
    }
}

let decimals = 3;

function itNETex(n: number): string {
    let ns: string = n.toExponential().toString();
    let split: Array<string> = ns.split("e");
    let base: string = split[0].substring(0, 2 + decimals).replace(".", ",");
    let expN: number = parseInt(split[1]);
    if (expN != 0) {
        return base + `\\cdot 10^{${expN}}`;
    }
    else return base;
}

const mu0 = 4 * Math.PI * 10 ** -7; // Costante di permeabilità del vuoto


class Raggio {
    p: Punto;
    /**
     * Calcola il raggio di una circonferenza con centro C(0,r) e passante per P
     * @param P Punto P
     * @returns il raggio della Circonferenza
     */
    constructor(P: Punto) {
        this.p = P;
    }
    calcola(): number {
        return (this.p.xMetri() ** 2 + this.p.yMetri() ** 2) / (2 * this.p.yMetri())
    }
    renderMath(): string {
        return `
        <h2>Calcolo del raggio</h2>
        Si calcola il raggio della circonferenza con centro $C(0cm,y_C)$ e passante per $P(${this.p.x}  cm,${this.p.y} cm)$<br />
        Per convenienza, convertiamo centrimetri in metri, quindi:<br />
        $C(0\\space m;0\\space m)$ e $P(${itNETex(this.p.xMetri())}  m;${itNETex(this.p.yMetri())}  m)$
        
        Partendo dall'equazione di una circonferenza di raggio $r$ e appurato che $y_C=r$ (e quindi $C(0,r)$)
        $$
        x^2+(y-y_C)^2=r^2
        $$
        $$
        x^2+(y-r)^2=r^2
        $$
        $$
        x^2+y^2-2yr+\\cancel{r^2}=\\cancel{r^2}
        $$
        $$
        r=\\frac{x^2+y^2}{2y}\
        $$
        Si impone quindi il passaggio per $P$
        $$
        r=\\frac{{${itNETex(this.p.xMetri())}}^2m+{${itNETex(this.p.yMetri())}}^2m}{2\\cdot${itNETex(this.p.yMetri())}m}=\\boxed{${itNETex(this.calcola())}m}
        $$
        `;
    }
}


class CampoMagnetico {
    N: number;
    I: number;
    L: number;
    /**
     * Calcola il campo magnetico di un solenoide 
     * Riguardo alle bobine di Helmholtz, è indifferente il numero di bobine considerate
     * siccome l'algoritmo risulterebbe nBobine mu0 * (nSpire * nBobine) * (I/ nBobine):
     * il numero di bobine moltiplicando il numero di spire e dividento l'intensità si può elidere
     * e si può considerare il tutto come un solenoide uniforme
     * @param N Numero di spire per una bobina
     * @param I Instensità di corrente
     * @param L Lunghezza complessiva del solenoide (distanza tra la prima e l'ultima bobina)
     * @returns Valore del campo magnetico
     */
    constructor(N: number, I: number, L: number) {
        this.N = N;
        this.I = I;
        this.L = L;
    }
    calcola(): number {
        return mu0 * this.N * this.I / this.L;
    }
    renderMath(): string {
        return `
        <h2>Calcolo del Campo magnetico</h2>
        Si calcola il campo magnetico del solenoide<br />
        $$
        B=\\mu_0\\frac{NI}L=4\\pi\\cdot 10^{-7}\\frac{${this.N}\\cdot ${itNETex(this.I)}A}{${itNETex(this.L)}}=\\\\
        \\boxed{${itNETex(this.calcola())}T}
        $$
        `;
    }
}



class Fattore {
    V: number;
    P2: Punto;
    d: number;
    /**
     *  Fattore f per cui v^2=e/m*f nel condensatore
     * @param V Differenza di potenziale
     * @param P2 Punto appartenente alla parabola generata dal condensatore
     * @param d distanza tra i poli del condensatore
     * @returns fattore f
     */
    constructor(V: number, P2: Punto, d: number) {
        this.V = V;
        this.P2 = P2;
        this.d = d;
    }
    calcola(): number {// d: distanza piastre cond
        return (this.V * this.P2.xMetri() ** 2) / (2 * this.P2.yMetri() * this.d);
    }
    renderMath(): string {
        return `
        <h2>Calcolo di $\\frac{e}m$ (Parte $1$)</h2>
        Si imposta il sistema di equazioni del moto parabolico
        $$
        \\begin{equation*}
        \\begin{cases}
        x=vt\\\\
        y=\\frac12at^2
        \\end{cases}
        \\end{equation*}
        $$
        $$
        \\begin{equation*}
        \\begin{cases}
        t=\\frac{x}v\\\\
        y_P=\\frac12\\frac{\\Delta V\\cdot e}{dm}\\frac{x_P^2}{v^2}
        \\end{cases}
        \\end{equation*}
        $$

        $$
        v=\\sqrt{\\frac{e\\Delta Vx_P^2}{2dmy_P}}=\\sqrt{\\frac{e\\cdot ${itNETex(this.V)} V \\cdot{(${itNETex(this.P2.xMetri())})}^2}{2m\\cdot${itNETex(this.d)} m \\cdot ${itNETex(this.P2.yMetri())} m}}=\\sqrt{\\frac{e}m${itNETex(this.calcola())}}
        $$

        Si assume $t =${itNETex(this.calcola())} $
        `;
    }

}

class EmRapporto {
    fattore: number;
    B: number;
    r: number;
    /**
     * Calcola il rapporto e/m 
     * @param fattore Il fattore f
     * @param B Campo magnetico del solenoide
     * @param r raggio della circonferenza
     * @returns e/m
     */
    constructor(fattore: number, B: number, r: number) {
        this.fattore = fattore;
        this.B = B;
        this.r = r;
    }
    calcola(): number {
        return (this.fattore / (this.B * this.r)) ** 2;
    }
    renderMath(): string {
        return `
        <h2>Calcolo di $\\frac{e}m$ (Parte $2$)</h2>
        

        $$
        F_{\\mathscr{L}}=e\\cdot v\\cdot b
        $$
       <center><i>Forza di Lorentz</i></center>

        $$
        F_C=m\\frac{v^2}r
        $$

        <center><i>Forza Centripeta</i></center>


        $$
        F_{\\mathscr{L}}= F_C
        $$

        $$
        e\\cdot \\cancel{v}\\cdot B = m\\frac{v^{\\cancel 2}}r
        $$

        $$
        \\frac{e}m = \\frac{v}{Br}
        $$

        $$
        \\frac{e}m = \\frac{\\sqrt{\\frac{e}m}t}{Br}
        $$

        $$
        \\sqrt{\\frac{e}m}=\\frac{t}{Br}
        $$
        `;
    }
}

/**
 * Esperimento di Thompson
 * @param P Punto appartenente alla circonferenza generata dal solenoide
 * @param P2 Punto appartenente alla parabola generata dal condensatore
 * @param I Intensità di corrente fornita al solenoide
 * @param V Differenza di potenziale della corrente fornita al condensatore
 * @param N Numero di spire di una bobina del solenoide
 * @param L Lunghezza del solenoide
 * @param d Distanza tra i poli del condensatore
 * @returns rapporto e/m
 */
function thomson(P: Punto, P2: Punto, I: number, V: number, N: number, L: number, d: number) {
    let html = ``;
    let B: CampoMagnetico = new CampoMagnetico(N, I, L);
    html += B.renderMath();
    let rc: Raggio = new Raggio(P);
    html += rc.renderMath();
    let r = rc.calcola();
    let f: Fattore = new Fattore(V, P2, d);
    html += f.renderMath();
    let em: EmRapporto = new EmRapporto(f.calcola() ** 0.5, B.calcola(), r);
    html += em.renderMath();
    html += `
    $$
    \\frac{ e } m =\\frac{${itNETex(f.calcola())} } { ${itNETex(B.calcola())} ${itNETex(r)} } = ${itNETex(em.calcola())}
    $$
    Abbiamo dimostrato l'esperienza di Thomson
    `;
    document.getElementById("results")!.innerHTML = html;
}


let P: Punto = new Punto(5, 2);
let P2: Punto = new Punto(7, 2);
let I = 0.89;//A
let V = 2500;//V
let N: number = 320;
let L: number = 0.1;//m
let d: number = 0.06; //m


let px: HTMLInputElement = document.getElementById("px") as HTMLInputElement;
let py: HTMLInputElement = document.getElementById("py") as HTMLInputElement;
let p2x: HTMLInputElement = document.getElementById("p2x") as HTMLInputElement;
let p2y: HTMLInputElement = document.getElementById("p2y") as HTMLInputElement;
let Ie: HTMLInputElement = document.getElementById("I") as HTMLInputElement;
let Ve: HTMLInputElement = document.getElementById("V") as HTMLInputElement;
let Ne: HTMLInputElement = document.getElementById("N") as HTMLInputElement;
let Le: HTMLInputElement = document.getElementById("L") as HTMLInputElement;
let de: HTMLInputElement = document.getElementById("d") as HTMLInputElement;

//DEfaults
px.value = P.x.toString();
py.value = P.y.toString();
p2x.value = P2.x.toString();
p2y.value = P2.y.toString();
Ie.value = I.toString();
Ve.value = V.toString();
Ne.value = N.toString();
Le.value = L.toString();
de.value = d.toString();

let calc: HTMLButtonElement = document.getElementById("calc") as HTMLButtonElement;
calc.addEventListener("click", function clicked(): void {
    thomson(new Punto(parseFloat(px.value), parseFloat(py.value)), new Punto(parseFloat(p2x.value), parseFloat(p2y.value)), parseFloat(Ie.value), parseFloat(Ve.value), parseFloat(Ne.value), parseFloat(Le.value), parseFloat(de.value));
});
