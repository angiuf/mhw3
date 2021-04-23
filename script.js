//Variabile per contare i contenuti e assegnarli l'indice
let count=0

//Funzione che crea una pizzeria e la inserisce all'interno di section
function creaContenuto(titolo, immagine, descrizione, sezione) {
    //Creazione del blocco di contenuto
    blocco = document.createElement('div');
    blocco.classList.add('content');
    
    //Aggiunge l'indice per identificarlo successivamente
    blocco.dataset.index = count;
    count++;
    h1 = document.createElement('h1');
    tit = document.createElement('a');
    tit.textContent = titolo;
    imm = document.createElement('img');
    imm.src = immagine;
    blocco_imm = document.createElement('div');
    blocco_imm.classList.add('blocco_imm');
    descr = document.createElement('p');
    descr.textContent = descrizione;
    //Nasconde inizialmente la descrizione
    descr.classList.add('hidden');

    //Freccia per espandere la descrizione
    arrow = document.createElement('img');
    arrow.src = "images/arrow_down.png";
    arrow.classList.add("arrow");
    arrow.addEventListener('click', espandiDescrizione);
    favorite_icon = document.createElement('img');
    favorite_icon.src = "images/favorite_icon_add.png";
    favorite_icon.classList.add("favorite_icon");
    favorite_icon.addEventListener('click', aggiungiPreferiti);

    const section = document.querySelector(sezione);

    //Aggiunge il blocco alla section in HTML
    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco_imm.appendChild(favorite_icon);
    blocco.appendChild(h1);
    h1.appendChild(tit);    
    blocco.appendChild(descr);
    blocco.appendChild(arrow);
    section.appendChild(blocco);

}

//Funzione per espandere la descrizione; Attivata da arrow nel contenuto
function espandiDescrizione(event) {
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_up.png";
    arrow.removeEventListener('click', espandiDescrizione);
    arrow.addEventListener('click', riduciDescrizione);
    const blocco_padre = arrow.parentNode;
    const descr = blocco_padre.childNodes[2];
    descr.classList.remove('hidden');
}

//Nasconde la descrizione
function riduciDescrizione(event) {
    const arrow = event.currentTarget;
    arrow.src = "images/arrow_down.png";
    arrow.removeEventListener('click', riduciDescrizione);
    arrow.addEventListener('click', espandiDescrizione);
    const blocco_padre = arrow.parentNode;
    const descr = blocco_padre.childNodes[2]
    descr.classList.add('hidden');
}


//Funzione per aggiungere un preferito
function aggiungiPreferiti(event) {
    const favorite_icon = event.currentTarget;
    //Modifica l'icona del preferito
    favorite_icon.src = "images/favorite_icon_remove.png";
    favorite_icon.removeEventListener('click', aggiungiPreferiti);
    favorite_icon.addEventListener('click', rimuoviPreferiti);

    //Identifica l'indice e il contenuto che ha attivato l'evento
    const index = (favorite_icon.parentNode.parentNode).dataset.index;
    //Oggetto corrispondente all'interno della lista contenuti (in content.js)
    const ogg = contenuti[index];
    //Crea un duplicato dell'oggetto
    const nuovo_preferito = {
        titolo: ogg.titolo,
        immagine: ogg.immagine,
        id: index
    }
    //Aggiunge l'oggetto alla lista dei preferiti
    lista_preferiti.push(nuovo_preferito);
    //Costruisce la lista dei preferiti
    visualizzaPreferiti();
}

function rimuoviPreferiti(event) {
    let favorite_icon = event.currentTarget;
    //Identifica il blocco padre dell'icona che ha scatenato l'evento
    const blocco_padre = (favorite_icon.parentNode.parentNode);
    let id;

    //Distingue se abbiamo cliccato l'icona sul blocco nei preferiti o in tutte le pizzerie
    if(blocco_padre.classList.contains('favorite')){
        //Seleziona il blocco corrispondente nella lista di tutte le pizzerie
        id = blocco_padre.dataset.id;
        const pizzerie = document.querySelectorAll('#lista_pizzerie .content');
        const blocco_pizzeria = pizzerie[id];
        //Riassegna favorite icon
        favorite_icon = blocco_pizzeria.childNodes[0].childNodes[1];     
    } else {
        id = blocco_padre.dataset.index;
    }

    //Modifica l'immagine e l'event listener dell'icona
    favorite_icon.src = "images/favorite_icon_add.png";
    favorite_icon.removeEventListener('click', rimuoviPreferiti);
    favorite_icon.addEventListener('click', aggiungiPreferiti);

    //Rimuove l'oggetto dalla lista dei preferiti e ricrea la sezione HTML dei preferit
    rimuoviContenuto(id);
    visualizzaPreferiti();
}

//Funzione per creare un elemento preferito simile a creaContenuto
function creaPreferito(titolo, immagine, sezione, id) {
    blocco = document.createElement('div');
    blocco.classList.add('content');
    blocco.classList.add('favorite');
    blocco.dataset.id = id;
    h1 = document.createElement('h1');
    tit = document.createElement('a');
    tit.textContent = titolo;
    imm = document.createElement('img');
    imm.src = immagine;
    blocco_imm = document.createElement('div');
    blocco_imm.classList.add('blocco_imm');
    favorite_icon = document.createElement('img');
    favorite_icon.src = "images/favorite_icon_remove.png";
    favorite_icon.classList.add("favorite_icon");
    favorite_icon.addEventListener('click', rimuoviPreferiti);

    const section = document.querySelector(sezione);

    blocco.appendChild(blocco_imm);
    blocco_imm.appendChild(imm);
    blocco_imm.appendChild(favorite_icon);
    blocco.appendChild(h1);
    h1.appendChild(tit);    
    section.appendChild(blocco);
}

//Funzione che ricrea la sezione con gli elementi preferiti a partire dalla lista dei preferiti
function visualizzaPreferiti() {
    pref = document.querySelector('#lista_preferiti');
    div = document.querySelector('#lista_preferiti div');
    div.innerHTML = '';
    
    if(lista_preferiti.length == 0) {
        pref.classList.add('hidden');
    }else {
        pref.classList.remove('hidden');
        for(contenuto of lista_preferiti){
            creaPreferito(contenuto.titolo, contenuto.immagine, '#lista_preferiti div', contenuto.id);
        }
    }
}

//Funzione per rimuovere un oggetto dalla lista dei preferiti
function rimuoviContenuto(id) {
    const id_int = parseInt(id);
    let indexToRemove;
    
    for(contenuto of lista_preferiti) {
        if(contenuto.id == id_int){
            indexToRemove = lista_preferiti.indexOf(contenuto);
        }
    }
    lista_preferiti.splice(indexToRemove, 1);
}

//Ricerca testuale

//Aggiunge l'event listener alla barra di ricerca
const search_bar = document.querySelector('header input');
search_bar.addEventListener('keyup', ricerca);

//Funzione per la ricerca dei contenuti sulla base del titolo o della descrizione
function ricerca(){
    //La ricera non è case sensitive
    const value = search_bar.value.toLowerCase();
    listap = document.querySelectorAll('#lista_pizzerie .content');
    pref = document.querySelector('#lista_preferiti');

    //Verifica se la barra di ricerca è vuota e mostra tutti i contenuti
    if(value === '') {
        for(c of listap){
            c.classList.remove('hidden');
        }

        if(lista_preferiti.length !== 0){
            pref.classList.remove('hidden');
        }
    } else {
        for(c of listap){
            c.classList.add('hidden');
        }
        pref.classList.add('hidden');

        for(contenuto of contenuti) {
            if(contenuto.titolo.toLowerCase().includes(value) || contenuto.descrizione.toLowerCase().includes(value)) {
                const indexOfSearch = contenuti.indexOf(contenuto);
                listap[indexOfSearch].classList.remove('hidden');
            }
        }
    } 
}

//MAIN
//Crea tutti gli elementi
for(contenuto of contenuti){
    creaContenuto(contenuto.titolo, contenuto.immagine, contenuto.descrizione, '#lista_pizzerie');
}





