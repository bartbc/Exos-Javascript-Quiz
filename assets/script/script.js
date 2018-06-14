function requestHttp(url) {// requete Http JSON
    const req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                contenuJson=this.responseText;
                console.log("Réponse reçue: %s", contenuJson);                
                //stateJson=true;//on valide l'état du json chargé
                parseJson(contenuJson, 0);//1ere question chargée par défaut au chargement de la page
                //return contenuJson;
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };
    req.open('GET', url, true);
    req.send(null);
} 

function parseJson(contenuJson, posQuestion) {
    var obj=JSON.parse(contenuJson);

    var el=document.getElementsByTagName('h2')[0];//titre question
    el.innerHTML='Question n° '+obj[posQuestion].id;
    
    el=document.getElementsByTagName('h3')[0];//question
    el.innerHTML=obj[posQuestion].question;

    el=document.getElementsByTagName('img')[0];//image
    el.src='./assets/img/'+obj[posQuestion].img;
    el.alt=obj[posQuestion].img;

    for (i=0; i<nbRep; i++) {// boucle pour obtenir les 4 propositions
        var propRep=document.getElementById('rep'+(i+1));
        propRep.innerHTML='Réponse '+(i+1)+' :<br>'+obj[posQuestion].propositions[i+1];
    };



    
    controlResp(obj[posQuestion].id);//on controle si la réponse a déja été soumise
    
    ctrl=localStorage.getItem(posQuestion+1);
    if (ctrl!==null) {
        if (ctrl==obj[posQuestion].repValide) {
            //reponse ok
            alert('ok');
            //mettre la réponse en vert + message
        } else {
            //reponse fausse
            alert('faux');
            //mettre réponse en vert et réponse user en rouge + message
        }  
    }



    

// ORGANISER LE VERIF REPONSE ET SON ORGANISATION





}
// gestion des réponses------------------------------------------------------------------------------------
function controlResp(numQuestion) {
    ctrl=localStorage.getItem(numQuestion);
    //alert(ctrl);
    if (ctrl!==null) {
        blocResponse(ctrl);
        return true;
    }
}

function blocResponse(rep){
    let elemnt=document.getElementById(rep);
    elemnt.classList.add('validated');
    //return true;
}

function validResponse(response) {
    let rep=confirm("Validez-vous votre réponse ?")
    if (rep) {
        //enregistrement réponse dans localstorage
        localStorage.setItem((cptPAge+1), response);
        blocResponse(response);
        ////////////////////////////verifReponse();
    } else {
        resetClickRep();
    }
}
//---Evenements-----------------------------------------------------
function resetClickRep() {//effacer la précédente selection
    var matches = document.querySelectorAll("p");
    for (i=0; i<matches.length; i++) {
        let ele=document.getElementById(matches[i].id);
        ele.classList.remove('selected');
        ele.classList.remove('validated');
        ele.classList.remove('correct');
        ele.classList.remove('error');
    };
}

function clickRep() {
var detectRepClic=this.id;

let ctrl=controlResp((cptPAge+1));///XXXXXXX
if (ctrl) {
    alert ('vous avez déjà validé votre réponse !');
    return;
} else {
    resetClickRep();
    let repClick=document.getElementById(detectRepClic);
    repClick.classList.add('selected');
    setTimeout(validResponse, 250, detectRepClic);//pause 0,25sec
    }
}

function ajoutEvent() { // gestion des évenements
    let matches = document.querySelectorAll("p");
    for (i=0; i<matches.length; i++) {
        let ele=document.getElementById(matches[i].id);
        ele.addEventListener('click', clickRep);
        //ele.addEventListener('over', )/ XXXxxxXXXXXvoir section bootstrap
    };
    matches = document.querySelectorAll("button");
    for (i=0; i<matches.length; i++) {
        let ele=document.getElementById(matches[i].id);
        ele.addEventListener('click', clickButton);
    };
}

//---------------------------------------------------------
function valProgressbar(page) {
    let el=document.getElementsByClassName('progress-bar')[0];
    valProgressBar=(page+1)*10;
    el.setAttribute('style','width: '+valProgressBar+'%');
    el.setAttribute('aria-valuenow',valProgressBar);
    el.innerHTML=(valProgressBar/10)+'/10';

}
// déplacements -----------------------------------------------------------
function clickButton() {
    if (this.id=='precedent') {
        if (cptPAge==0) {
             alert('vous êtes sur la première page'); // aremplacer par une modal ??
             return;// on sort de la fonction
        } else {
            cptPAge--;
        }
    } else {
        if (cptPAge==9) {
            alert('vous êtes sur la dernière page');// aremplacer par une modal ??
            return;// on sort de la fonction
       } else {
        cptPAge++;
       }
    }
    valProgressbar(cptPAge);
    resetClickRep();
    parseJson(contenuJson,cptPAge);;
}

// -----Principal----------------------------------------------------------------
var cheminJson='http://localhost/Exos-Javascript-Quiz/assets/json/jeu.json';
var cptPAge=0;
//var stateJson=false;
var nbRep=4;
//reset localstorage
localStorage.clear();

var contenuJson=requestHttp(cheminJson);// on charge le json complet // au chargement on charge la premiere page sera chargée par défaut

//ajout des events sur la page
ajoutEvent(); //pour chaque section de la page
