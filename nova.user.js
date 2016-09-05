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
			if (answer === true) {
				window.close();
			}
		}

		function saveData(stringifiedJsonOBJ) {
			console.log("GM_setValue");
			GM_setValue("http://a.test.com", stringifiedJsonOBJ);
		}

		function retrieveData() {
			console.log("GM_getValue, parsing into a JSON object.");
			console.log(JSON.parse(GM_getValue('http://a.test.com')));
		}

		// mine metadata
		var mainTitleElem = document.querySelector('.research_project h1');
		var mainTitle = (mainTitleElem !== null) ? mainTitleElem.textContent : undefined;
		var subTitleElem = document.querySelector('.research_project p.ingress');
		var subTitle = (subTitleElem !== null) ? subTitleElem.textContent : undefined;
		
		function getAuthorList () {
			return document.querySelectorAll('.research_project ul li');
		}
		
	    var dateEdition,
	        datePublished,
	        publicationType,
	        issn,
	        isbn,
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
				case 'ISBN:':
					isbn = possibleMetaEms[j].nextElementSibling.textContent.trim();
				break;
	            case 'Antall sider:':
					pages = possibleMetaEms[j].nextElementSibling.textContent.trim();
				break;
	            default:
	            	if(possibleMetaEms[j].textContent.trim().indexOf('Temahefte') > -1) {
	            		publicationType = possibleMetaEms[j].textContent.trim();
	            	}
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
	        isbn: isbn,
	        pages: pages
	    };

	    var stringified = JSON.stringify(publicationData);
	    console.log(stringified);

	    saveData(stringified);

	    retrieveData();

		closePage();

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
		console.log("already stored?");
		console.log(GM_getValue(pageLinks[0]));
		console.log("opening window: " + pageLinks[0]);
		var win = window.open(pageLinks[0]);
		/*win.addEventListener('unload', function(event) {
        	console.log("Window closed: " + pageLinks[0]);
        	console.log("Data collected for this url: ");
        	console.log(GM_getValue(pageLinks[0]));
      	});*/

      	win.onunload = function() {
  		if (window.opener && typeof(window.opener.onPopupClosed) == 'function') {
    		window.opener.onPopupClosed();
  			}

  		console.log("Window closed: " + pageLinks[0]);
        	console.log("Data collected for this url: ");
        	console.log(GM_getValue(pageLinks[0]));

		};

		window.onPopupClosed = function() {
  			console.log("You closed the pop up!");
		};

	} // openPages(); 

	openPages(temahefteLenker);

	} // novaExtractorMainPage()

}()); // function nova()