//Codici per l'accesso all'API
const app_id = "9eade77e";
const app_key = "e09342358eaa3454f6f4cab68199a5b3";
const max_count = 10;

//Aggiunge l'event listener al form per il submit
const form = document.querySelector("#val_nutr form");
form.addEventListener('submit', cerca);

function cerca(event){
    //Non viene ricaricata la pagina
    event.preventDefault();
    
    //Salvo il valore dell'input
    const input = document.querySelector("#cerca_val_nutr");
    let ricetta = input.value;
    //Se non contiene la parola pizza la includo dallo script
    if(!ricetta.toLowerCase().includes("pizza")) {
        ricetta = encodeURIComponent("pizza " + input.value);
    }

    //Crea URL e lo utilizza nella fetch
    const url_string = "https://api.edamam.com/search?q=" + ricetta +"&app_id=" + app_id + "&app_key=" + app_key + "&to=" + max_count;
    fetch(url_string).then(onResponse).then(onJSON);    
}

function onResponse(response){
    return response.json();    
}

function onJSON(json){
    //Svuota la sezione precedentemente creata
    const b = document.querySelector('#nutr_cont');
    b.innerHTML = '';

    console.log(json);

    const pizze = json.hits;

    //Per ogni ricetta crea un elemento HTML
    for(ric of pizze) {
        const el = ric.recipe;
        crea_ricetta(el.image, el.label, el.calories.toFixed(0), 
            el.totalNutrients.CHOCDF.quantity.toFixed(1),
            el.totalNutrients.FAT.quantity.toFixed(1),
            el.totalNutrients.PROCNT.quantity.toFixed(1),
            el.ingredientLines,
            el.url);
    }
}

//Funzione per creare l'elemento HTML
function crea_ricetta(immagine, label, calorie, c, f, p, lista, url) {
    const cont = document.createElement('div');
    cont.classList.add('container');
    
    //Immagine
    const img = document.createElement('img');
    img.src = immagine;
    img.classList.add('img');
    cont.appendChild(img);
    
    //Titolo
    const tit = document.createElement('div');
    tit.classList.add('title');
    const lab = document.createElement('h1');
    //Crea e inserisce il riferimento alla pagina HTML della ricetta
    const link = document.createElement('a');
    link.href = url;
    link.textContent = label;
    lab.appendChild(link);
    tit.appendChild(lab);

    //kcal
    const cal = document.createElement('h3');
    cal.textContent = calorie + 'kcal';
    tit.appendChild(cal);
    cont.appendChild(tit);

    //Chiama la funzione per creare la tabella dei valori nutrizionali
    crea_tabella(c, f, p, cont);

    //Creazione della lista degli ingredienti, inizialmente nascosta
    const ls = document.createElement('ul');
    ls.classList.add('hidden');
    //Inserisce ogni ingrediente nella lista HTML (ul)
    for(ingr of lista){
        let i = document.createElement('li');
        i.textContent = ingr;
        ls.appendChild(i);
    }
    cont.appendChild(ls);

    //Freccia per mostrare gli ingredienti
    const arrow = document.createElement('img');
    arrow.src = "images/arrow_down.png";
    arrow.classList.add("arrow");
    //Aggiunge l'event listener
    arrow.addEventListener('click', mostraIngredienti)
    cont.appendChild(arrow);
    
    const sec = document.querySelector('#nutr_cont');
    sec.appendChild(cont);
}

//Funzione per creare la tabella dei valori nutrizionali e aggiungerla al blocco passato come parametro
function crea_tabella(carb, grassi, prot, blocco) {
    const tab = document.createElement('table');
    const r1 = document.createElement('tr');
    const c = document.createElement('th');
    c.textContent = 'Carb';
    const f = document.createElement('th');
    f.textContent = 'Grassi';
    const p = document.createElement('th');
    p.textContent = 'Prot';
    const r2 = document.createElement('tr');
    const c2 = document.createElement('td');
    c2.textContent = carb + 'g';
    const f2 = document.createElement('td');
    f2.textContent = grassi + 'g';
    const p2 = document.createElement('td');
    p2.textContent = prot + 'g';

    r1.appendChild(c);
    r1.appendChild(f);
    r1.appendChild(p);
    tab.appendChild(r1);
    r2.appendChild(c2);
    r2.appendChild(f2);
    r2.appendChild(p2);
    tab.appendChild(r2);
    blocco.appendChild(tab);
}

//Funzione per mostrare gli ingredienti, chiamata dall'event listener della freccia
function mostraIngredienti(event){
    const arrow = event.currentTarget;
    //Cambia l'orientamento della frecca
    arrow.src = "images/arrow_up.png";
    //Rimuove l'attuale event listener
    arrow.removeEventListener('click', mostraIngredienti);
    //Aggiunge l'event listener per nasconderli
    arrow.addEventListener('click', nascondiIngredienti);
    //Seleziona il blocco
    const blocco_padre = arrow.parentNode;
    const ingr = blocco_padre.childNodes[3];
    //E lo nasconde
    ingr.classList.remove('hidden');
}

//Funzione per nascondere gli ingredienti, chiamata dall'event listener della freccia
function nascondiIngredienti(event){
    const arrow = event.currentTarget;
    //Cambia l'orientamento della freccia
    arrow.src = "images/arrow_down.png";
    //Rimuove l'attuale event listener
    arrow.removeEventListener('click', nascondiIngredienti);
    //Aggiunge l'event listener per nasconderli
    arrow.addEventListener('click', mostraIngredienti);
    //Seleziona il blocco
    const blocco_padre = arrow.parentNode;
    const descr = blocco_padre.childNodes[3];
    //E lo nasconde
    descr.classList.add('hidden');
}

