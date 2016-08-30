// ==UserScript==
// @name         nova extractor
// @namespace    hfw.no/ns/nova_extractor
// @version      0.1
// @description  Extract info from NOVA publications
// @author       You
// @match        http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/*
// @match        http://localhost/~hanson/nova/*
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
	console.log("Start nova extractor - mine metadata for DOI submission");
	var url = window.location.href;
	var title = document.title;

	if(isNovaPublicationPage(url)){
		novaPublicationPage();
	} else if(isNovaExtractorMainPage(url)) {
		novaExtractorMainPage();
	} else {console.log('unknown page: ' + url);}

	function isNovaPublicationPage(url){
		if(url.indexOf('NOVA/Publikasjonar/') > -1) {
			return true;
		} else {
			return false;
		}
	}

	function isNovaExtractorMainPage(url){
		if(title.indexOf('NOVA extractor') > -1) {
			return true;
		} else {
			return false;
		}
	}

	function novaPublicationPage() {
		console.log('novaPublicationPage');

		function closePage(){
			var answer = confirm("Done mining metadata. Close this page?");
			if (answer == true) {
				window.close();
			}
		};

		// mine metadata
		var mainTitleElem = document.querySelector('.research_project h1');
		var mainTitle = (mainTitleElem !== null) ? mainTitleElem.textContent : "";
		var subTitleElem = document.querySelector('.research_project p.ingress');
		var subTitle = (subTitleElem !== null) ? subTitleElem.textContent : "";
		
		function getAuthorList () {
			return document.querySelectorAll('.research_project ul li');
		}
		
	    var dateEdition,
	        datePublished,
	        publicationType,
	        issn,
	        pages,
	        authors;

	        authors = (function () {
				var al = getAuthorList();
				var authorArray = [];
				for (var i = 0; i < al.length; i++) {
					authorArray.push(al[i].textContent);
				}
				return authorArray;
			})();

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

		closePage();

		/*
	    
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

		*/

	}

	function novaExtractorMainPage(){
		console.log('novaExtractorMainPage');

		var temahefteLenker = ["http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Ungdomskulturer-og-narkotikabruk",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Foreldrestoettende-tilbud-i-kommunene",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Dokumentasjon-Ung-i-Oslo-2006",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Forebyggende-arbeid-og-hjelpetiltak-i-barneverntjenesten",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Veiledning-og-veiledningsmodeller-i-barnevernets-foerstelinjetjeneste",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Naturen-i-Stor-Elvdal-ulven-og-det-sosiale-landskapet",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Fra-ide-til-virkelighet.-En-modell-for-koordinering-og-drift-av-det-forebyggende-barne-og-ungdomsarbeidet",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Kvalitetssatsing-i-norske-barnehager",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Hvordan-maalene-ble-naadd",
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/En-skandinavisk-boligmodell"];

	function openPages(pageLinks){
		window.open(pageLinks[0]);
	} // openPages(); 

	openPages(temahefteLenker);

	} // novaExtractorMainPage()

}()); // function nova()