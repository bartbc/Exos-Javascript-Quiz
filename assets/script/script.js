function requestHttp(url) {// requete Http JSON
    const req = new XMLHttpRequest();
    
    req.onreadystatechange = function() {
        // XMLHttpRequest.DONE === 4
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                contenuJson=this.responseText;
                console.log("Réponse reçue: %s", contenuJson);                
                //stateJson=true;//on valide l'état du json chargé
                parseJson(contenuJson, 0);//parseJson(contenuJson, posQuestion) 1ere question chargée par défaut au chargement de la page
                //return contenuJson;
            } else {
                console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
            }
        }
    };
    req.open('GET', url, true);
    req.send(null);
} 

function parseJson(contenuJson, posQuestion) {//appel avce contenuJson et posquestion (index) 
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
    controlResp(parseInt(obj[posQuestion].id));//controlResp(numQuestion) on controle si la réponse a déja été soumise
}
// gestion des réponses------------------------------------------------------------------------------------
function controlResp(numQuestion) {
    ctrl=localStorage.getItem(numQuestion);
    var obj=JSON.parse(contenuJson);
    let msg='', p='';

    //p = document.createElement('p')
    if (ctrl!==null) {
        let elemnt=document.getElementById(obj[numQuestion-1].repValide);       
        if (ctrl==obj[numQuestion-1].repValide) {
            //reponse ok
            elemnt.classList.add('correct');      
            // msg='Bravo, vous avez trouvé la bonne réponse !';
            // elemnt.appendChild(p).innerHTML=msg;                      
        } else {
            //reponse fausse             //mettre réponse en vert et réponse user en rouge + message
            elemnt.classList.add('correct');
            elemnt=document.getElementById(ctrl); 
            elemnt.classList.add('error');
            // msg='Malheureusement, vous vous êtes trompé (la bonne réponse est en vert) !';
            // elemnt.appendChild(p).innerHTML=msg;  
        }
        return true;// renvoi vers  clickRep pour bloquer clic sur question terminée 
    }
}

function validResponse(repUser) {
    let rep=confirm("Validez-vous votre réponse ?")
    if (rep) {
        //enregistrement réponse dans localstorage
        localStorage.setItem((cptPAge), repUser);
        controlResp(cptPAge) //controlResp(numQuestion)

    } else {
        resetClickRep();
    }
}

function clickRep() {
    var detectRepClic=this.id;
    
    let ctrl=controlResp((cptPAge));///controlResp(numQuestion)
    if (ctrl) {
        alert ('vous avez déjà validé votre réponse !');
        return;
    } else {
        resetClickRep();
        let repClick=document.getElementById(detectRepClic);
        repClick.classList.add('selected');
        setTimeout(validResponse, 250, detectRepClic);//pause 0,25sec // validResponse(repUser)
        }
}

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
    
//---Evenements-----------------------------------------------------

function ajoutEvent() { // gestion des évenements
    let matches = document.querySelectorAll("p");// ajout event sur p
    for (i=0; i<matches.length; i++) {
        let ele=document.getElementById(matches[i].id);
        ele.addEventListener('click', clickRep);
        ele.addEventListener('mouseover', (event) => {
            event.target.style.color='blue';
        });
        ele.addEventListener('mouseout', (event) => {
            event.target.style.color='inherit';
        })
        
    };
    matches = document.querySelectorAll("button");// ajout event sur boutons
    for (i=0; i<matches.length; i++) {
        let ele=document.getElementById(matches[i].id);
        ele.addEventListener('click', clickButton);
    };
}


//---------------------------------------------------------
function valProgressbar(page) {
    let el=document.getElementsByClassName('progress-bar')[0];
    valProgressBar=(page)*10;
    el.setAttribute('style','width: '+valProgressBar+'%');
    el.setAttribute('aria-valuenow',valProgressBar);
    el.innerHTML=(valProgressBar/10)+'/10';

}
// déplacements -----------------------------------------------------------
function clickButton() {
    if (this.id=='precedent') {
        if (cptPAge==1) {
             alert('vous êtes sur la première page'); // aremplacer par une modal ??
             return;// on sort de la fonction
        } else {
            cptPAge--;
        }
    } else {
        if (cptPAge==10) {
            alert('vous êtes sur la dernière page');// aremplacer par une modal ??
            return;// on sort de la fonction
       } else {
        cptPAge++;
       }
    }
    valProgressbar(cptPAge);// VAALEUR A VERIFIER //valProgressbar(page)
    resetClickRep();
    parseJson(contenuJson,cptPAge-1);//parseJson(contenuJson, posQuestion) appel avec contenuJson et posquestion (index) 
}

// -----Principal----------------------------------------------------------------
var cheminJson='http://localhost/Exos-Javascript-Quiz/assets/json/jeu.json';
var cptPAge=1;
//var stateJson=false;
var nbRep=4;
//reset localstorage
localStorage.clear();//vide le local storage au demmarrage

requestHttp(cheminJson);// on charge le json complet // au chargement on charge la premiere page sera chargée par défaut

//ajout des events sur la page
ajoutEvent(); //pour chaque section de la page

