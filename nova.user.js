// ==UserScript==
// @name         nova extractor
// @namespace    hfw.no/ns/nova_extractor
// @version      0.1
// @description  Extract info from NOVA publications
// @author       You
// @match        http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Eirik Hanssen, Oslo and Akershus University College of Applied Sciences (2014)

// Dette scriptet skal kjøre på NOVA sine publikasjoner

/*
	En side har et script som har list(ene) som inneholder lenkene til alle sidene som skal åpnes.
	Denne sidene åpner etter tur en og en side.
	Når siden lukkes, så åpnes neste.
	Dette scriptet må enten oppdage at siden den åpnet ble lukket, eller den må 
	gjøre det selv ved å lese en verdi fra GM_getValue.
*/

/* Ett script skal kjøres automatisk på hver side som åpnes 
	Det skal hente ut relevant info og lagre det i gm-databasen.
	Kanskje som et JSON-object per side?
	// lagre denne strengen med GM_setValue:
	var stringified = JSON.stringify(json);
	var jsonObject = JSON.parse(stringified);

	Når data er lagret, så lukker siden seg selv, 
	Hvis dette ikke er mulig, gir beskjed via å sette et flagg med GM_setValue slik at scripet som kjører på den andre siden lukker det.
*/

(function nova(){

	console.log("running nova_extractor");

    var url = window.location.href;
	var mainTitle = document.querySelector('.research_project h1').textContent;
	var subTitle = document.querySelector('.research_project p.ingress').textContent;
	var authorsList = document.querySelectorAll('.research_project ul li');
    var dateEdition,
        datePublished,
        publicationType,
        issn,
        pages,
        authors;
    
    function getAuthors(authorsList){
		var authorArray = [];
		for (var i = 0; i < authorsList.length; i++) {
			authorArray.push(authorsList[i].textContent);
		}
		return authorArray;
        
	};
    
    authors = getAuthors(authorsList);

    var possibleMetaEms = document.querySelectorAll('div > em');
	for (var j = 0; j < possibleMetaEms.length; j++) {
		switch (possibleMetaEms[j].textContent) {
			case 'Utgivelsesår:':
				dateEdition = possibleMetaEms[j].nextElementSibling.textContent.trim();
			break;
            case 'Publisert:':
				datePublished = possibleMetaEms[j].nextElementSibling.textContent.trim();
			break;
            case 'Publikasjonstype:':
				publicationType = possibleMetaEms[j].nextElementSibling.textContent.trim();
			break;
            case 'ISSN:':
				issn = possibleMetaEms[j].nextElementSibling.textContent.trim();
			break;
            case 'Antall sider:':
				pages = possibleMetaEms[j].nextElementSibling.textContent.trim();
			break;
            default:
            break;
		}
	}

	var publicationData = {
        url: url,
		mainTitle: mainTitle,
		subTitle: subTitle,
		authors: authors,
		dateEdition: dateEdition,
		datePublished: datePublished,
        publicationType: publicationType,
        issn: issn,
        pages: pages
    };

    var stringified = JSON.stringify(publicationData);
    console.log(stringified);
  
}());