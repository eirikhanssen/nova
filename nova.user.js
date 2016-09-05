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

	// pages to investigate BEGIN

	var notat = ["http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2015/Boligbehov-og-ubalanser-i-storbyer.-En-synteserapport", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2015/Det-som-skjer-paa-nett-forblir-paa-nett", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2015/Barnehagelaererne", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2014/En-frigjoeringsleders-historie", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2014/Et-velfungerende-leiemarked-Notat-4-14", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2014/Husholdningenes-gjeld-og-formue-hoesten-2012", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2014/Formell-og-uformell-omsorg", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Ung-i-Oslo-2012", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Subjektiv-fattigdom-i-et-velferdssamfunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Sarpsborg-kommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Eieretablering-blant-hushold-med-lave-inntekter", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Tiggerbander-og-kriminelle-bakmenn-eller-fattige-EU-borgere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Universell-utforming-og-tilgjengelighet-i-norsk-boligpolitikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Boendemiljoe-bosaettning-och-integration", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Bostoette-Mobilitet-kontinuitet-og-endring", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Boforhold-blant-barnefamilier-med-lav-inntekt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2012/Framgangsrike-skoler-under-Kunnskapsloeftet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2013/Bedre-levekaar-i-Jevnaker", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2013/Fremtidens-leiemarked-i-et-internasjonalt-arbeidsmarked", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2013/Utilsiktet-flytting-fra-fosterhjem", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2013/Skoleresultater-og-utdanningssituasjon-for-barn-i-barnevernet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Snus-og-roeykeslutt-paa-stand-virker-det", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Unge-fra-innvandrerfamilier-og-sosial-kapital-for-utdanning", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Utdanningsforskjeller-i-helserelatert-atferd-like-store-over-hele-landet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Boligsosiale-utfordringer-i-Asker-kommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Innsats-mot-utkastelser-fra-lovende-forsoek-til-effektiv-rutine", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Implementering-med-problemer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Kunnskap-og-kontakt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2016/Psykiske-helseplager-blant-ungdom-tidstrender-og-samfunnsmessige-forklaringer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Modeller-for-aa-sikre-medbestemmelse-og-medinnflytelse-blant-utsatte-ungdomsgrupper", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Suppe-saape-og-frelse-som-en-del-av-det-miljoeterapeutiske-arbeidet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Tilgjengelighet-og-deltakelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2016/Nordmenns-gjeld-og-formue-hoesten-2015", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2016/Storby-stabilitet-og-endring-i-botetthet-og-flytting", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2016/Barn-og-familie-i-mottak-samarbeid-mellom-asylmottak-og-kommunalt-barnevern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Livskvalitet-blant-eldre-mennesker-med-epilepsi", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Klara-Klok-en-helsenettjeneste-for-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Holdninger-til-funksjonshemmede-i-Norge-1999-2005", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Utsatte-unge-17-23-aar-i-overgangsfaser", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Foerskolelaerere-og-barnehageansatte", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Seniorsentrene-i-innsparingenes-tid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Unges-syn-paa-deltakelse-og-innflytelse-i-skolen-lokalpolitikken-og-sivilsamfunnet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Hva-med-de-andre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Evaluering-av-Aktiv-i-Re", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Funksjonshemmende-kollektivtransport", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Datakvalitet-i-Ung-i-Oslo-2006", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Bor-det-noen-gamle-her-a", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Boligsosiale-utfordringer-i-Kongsvinger-kommune-en-forstudie", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Foreldreringer-ringer-i-vann", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Barnevern-og-sosialhjelp", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Boligsosiale-utfordringer-og-loesninger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Barnevern-i-de-nordiske-landene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Parents-socioeconomic-status-and-children-s-academic-performance", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2010/Gjennomgang-av-barneverntjenesten-i-Ringsaker-2009", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Integrering-av-flyktningbarn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/Utenfor-de-boligsosiale-ordningene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2008/Evaluering-av-telefonveiledningstjenesten-i-AKAN", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2011/Hva-er-det-med-Arendal-og-AAlesund-og-Oslo", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Notat/2009/AA-sende-bekymringsmelding-eller-la-det-vaere"];

var rapporter = ["http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Ungdata.-Nasjonale-resultater-2014", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Bruk-av-sykehus-og-spesialisthelsetjenester-blant-innbyggere-med-norsk-og-utenlandsk-bakgrunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Evaluering-av-proeveprosjektet-med-ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Oppfoelgingsprosjektet-i-Ny-GIV", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Samarbeidsavtaler-mellom-helseforetak-og-kommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/All-European-countries-are-not-the-same", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Skolers-arbeid-med-elevenes-psykososiale-miljoe", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Det-tenner-en-gnist", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Boligbehov-og-ubalanser-i-norske-storbyer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Forebyggende-helsearbeid-i-kommunene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Vanskeligstilte-paa-det-norske-boligmarkedet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Evaluering-av-tiltaket-Maalrettet-stoette-og-veiledning-til-kommuner-og-deres-skoler-som-har-vedvarende-hoeye-mobbetall", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Resultatevaluering-av-Omsorgsplan-2015", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Kjoennsforskjeller-i-skoleprestasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Ungdata.-Nasjonale-resultater-2013", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Kontakt-paa-sosiale-medier-mellom-foreldre-og-barn-under-offentlig-omsorg", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Hjelp-eller-barrierer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Barnevern-i-Norge-1990-2010", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Bemanning-og-kompetanse-i-hjemmesykepleien-og-sykehjem", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Felles-fokus", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Boliggjoering-av-eldreomsorgen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Krisesentertilbudet-i-kommunene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Tjenestetilbudet-til-voldsutsatte-personer-med-nedsatt-funksjonsevne", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Gateliv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Evaluering-av-proeveprosjektet-med-Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Kommunale-avlastningstilbud", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Til-god-hjelp-for-mange", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Planer-for-et-aldrende-samfunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Kroppen-min", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Barn-i-asylsaker", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/Hoer-paa-meg", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2014/En-god-forberedelse-til-aa-bli-fosterforeldre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Baerekraftig-omsorg", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Likestilling-hjemme", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Vennskap-utdanning-og-framtidsplaner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Habilitering-som-koordinerende-tiltak", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/AA-trene-trener-har-trent", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Barnehusevalueringen-2012-Delrapport-2", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Tegnspraakets-inkluderende-kraft", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Ny-kunnskap-om-aldring-og-arbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Litt-vanskelig-at-alle-skal-med!", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/Ett-aar-med-arbeidslivsfaget", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2012/For-store-forventninger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Bolig-og-levekaar-i-Norge-2012", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Ungdata-Nasjonale-resultater-2010-2012", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Oppfoelgingsprosjektet-i-Ny-GIV", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Kvalitet-i-barnehager", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Lesbiske-homofile-bifile-og-transpersoners-utsatthet-for-vold-i-naere-relasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Fosterhjem-for-barns-behov", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Evaluering-av-leksehjelptilbudet-1.-4.-trinn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Forsoek-med-arbeidslivsfag-paa-ungdomstrinnet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Vital-aldring-og-samhold-mellom-generasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/AA-ha-foreldre-av-samme-kjoenn-hvordan-er-det-og-hvor-mange-gjelder-det", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Langt-igjen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Kontroverser-om-biologisk-mangfold-i-norske-skoger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Taushetsplikt-opplysningsrett-og-opplysningsplikt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Pengespill-og-dataspill", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Samhandlingsreformen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2013/Voksne-i-grunnskole-og-videregaaende-opplaering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/The-Substitution-Issue", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Fastlegeordningen-og-pasienter-med-store-legebehov", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Funksjonshemmede-og-psykisk-helse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Grenser-for-individualisering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Innvandrere-og-kriminalitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Oppvekstvilkaar-og-rusmiddelbruk-blant-unge-paa-Romsaas", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Foreldreskap-i-smaabarnsfamilien", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Kompetanse-og-utdanningsbehov-innenfor-trygde-og-arbeidsmarkedsetaten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Spor-etter-aar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Barn-og-unges-levekaar-i-lavinntektsfamilier", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Sluttevaluering-av-utviklingsarbeidet-utsatte-unge-17-23-aar-i-overgangsfaser", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Virkninger-av-tilpasset-spraakopplaering-for-minoritetsspraaklige-elever", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Egenforsoergede-eneforsoergere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Ung-i-Bodoe", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Integrering-av-pleie-og-omsorgstjenestene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Fra-best-til-bedre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Er-det-bare-eleven", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Gode-skoler-gode-for-alle", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Tiltak-for-eldre-innvandrere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Aldersforskning-inn-i-aar-2000", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Ung-paa-Nesodden", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Husholdningenes-gjeld-og-formue-ved-inngangen-til-finanskrisen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Sex-for-overlevelse-eller-skyggebilder-av-kjaerlighet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Aktiv-paa-dagtid-i-Oslo", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Ung-i-Bergen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Seniorer-i-arbeidslivet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Med-ungdom-i-sentrum.-Bergensrapporten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Omsorgsloenn-til-foreldre-med-funksjonshemmede-barn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Samvaersfedrenes-situasjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Fremstillinger-av-barnevern-i-loessalgspressen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/For-aa-jobbe-her-maa-en-vaere-interessert-i-folka-som-bor-her", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Fattige-innvandrerbarn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Evaluering-av-attfoeringsreformen-2-bind", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Helse-helseatferd-og-livsloep", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Problematferd-i-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Boligeie-blant-husholdninger-med-lave-inntekter", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/To-aars-gratis-barnehagetilbud-for-familier-med-innvandrerbakgrunn-foerer-det-til-integrering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Writing-Strategies-for-European-Social-Scientists", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Mangfoldig-omsorg", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Idealer-og-realiteter", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Tilfreds-med-uklarhet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Eldre-med-innvandrerbakgrunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/For-gammel", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Bedre-enn-sitt-rykte", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Ungdom-idrett-og-friluftsliv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Ungdom-i-flyktningfamilier", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Likere-enn-vi-tror", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ungdom-og-trening", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Kartlegging-av-opplaeringstilbudet-til-enslige-mindreaarige-asylsoekere-og-barn-av-asylsoekere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Endring-i-lederes-holdninger-til-eldre-arbeidskraft", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Ett-aars-gratis-barnehage-hvilke-konsekvenser-har-det-for-overgangen-til-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Lesbiske-og-homofile-med-innvandrerbakgrunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Tilhoerighetens-balanse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Verdier-paa-vandring", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Tracing-UMAs-families", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Nordiske-ungdommers-holdninger-til-likestilling", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Velferdsstat-og-velferdskommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Den-kommunale-utleiesektor", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Fritidsklubb-kvalifisering-og-rusforebygging", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/En-vanskelig-pasient", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/En-skole-to-verdener", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Morsmaalsundervisning-som-integrerende-tiltak", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Erfaringer-med-dialog-i-tvangsekteskapssaker", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Forvaltning-som-yrke", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Drinking-getting-stoned-or-staying-sober", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Underholdning-med-bismak", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Ungdom-og-vold-i-bildemediene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Post-injury-lives", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Diabetes-og-livskvalitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Tiltak-rettet-mot-barn-og-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Smerte-og-livsmot", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Leiemarkedet-og-leietakernes-rettsvern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Norske-pensjonister-og-norske-kommuner-i-Spania", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Norsk-boligpolitikk-i-forandring-1970-2010", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Familieraad-som-metode-i-barnevernets-beslutningsprosess", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Prosjekt-Ungdomsboelge-En-evaluering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Moeter-i-det-flerkulturelle", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Increasing-social-inequality-from-a-uniform-to-a-fragmented-social-policy", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Ufoerepensjonisters-materielle-levekaar-og-sosiale-tilknytning", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Betydningen-av-innvandrerbakgrunn-for-psykiske-vansker-blant-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Kvinners-moete-med-helsetjenesten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Trygd-og-omsorgsarbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Kjaerlighetens-og-autoritetens-kulturelle-koder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Den-som-har-skoen-paa", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Kvoteordninger-i-europeiske-land-for-personer-med-nedsatt-funksjonsevne", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Moedregrupper-et-tilbakeblikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Samarbeid-mellom-hjem-og-skole-en-kartleggingsundersoekelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Det-vanskelige-samarbeidet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Omsorg-for-eldre-innvandrere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Liv-og-leven-i-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Unge-funksjonshemmede", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Husleieindekser-og-husleiestatistikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/I-verdens-rikeste-land", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Ung-i-Frogn-2009", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Prestasjonsforskjeller-i-Kunnskapsloeftets-foerste-aar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Alenemoedre-og-overgangsstoenaden", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Minoritetsspraaklig-ungdom-i-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Storbyungdom-og-natur", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Ulikheter-paa-tvers.-Har-foreldres-utdanning-kjoenn-og-minoritetsstatus-like-stor-betydning-for-elevers-karakterer-paa-alle-skoler", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Barn-og-foreldre-som-sosiale-aktoerer-i-moete-med-hjelpetjenester", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Er-det-skolens-skyld-En-kunnskapsoversikt-om-skolens-bidrag-til-kjoennsforskjeller-i-skoleprestasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Aktiv-Oslo-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Behovsstyrt-samarbeid-holder-det", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Organisering-og-planlegging-av-boligsosialt-arbeid-i-norske-kommuner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Kort-vei-til-lykke-eller-ruin", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Naar-mor-og-far-moetes-i-retten-barnefordeling-og-samvaer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Helgerud-er-en-oase!", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Barn-og-unges-haandtering-av-vanskelige-livsvilkaar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/gdomsundersoekelsen-i-Strand", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Opinionen-og-eldrepolitikken", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Forskning-om-familiegenerasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Vold-og-overgrep-mot-barn-og-unge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Holdninger-til-ekstremisme", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Underbemanning-er-selvforsterkende", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Sosiale-forskjeller-i-unges-liv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2016/Ungdata-2016.-Nasjonale-resultater", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2015/Ung-i-Oslo-2015", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Ungdoms-holdninger-til-seksuelle-krenkelser-og-overgrep", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Innvandrerungdom-integrasjon-og-marginalisering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Medievold-avler-vold-reell-frykt-eller-moralsk-panikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Bolig-med-kommunens-bistand", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Eldre-innvandreres-bruk-av-pleie-og-omsorgstjenester", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Ung-i-Tromsoe", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Erfaringer-med-omsorgstjenester-for-eldre-innvandrere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Kommunen-som-boligeier", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Social-inequalities-in-health-and-their-explanations", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Barns-levekaar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Livet-foer-og-etter-Frambu", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Kontantstoetteordningens-konsekvenser-for-yrkesaktivitet-og-likestilling", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Tverrnasjonal-komparativ-barneforskning-Muligheter-og-utfordringer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Kvalitetsstyring-og-kvalitetsstrev", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Medisinske-vikarbyraaer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Problemer-har-ikke-kontortid.-Akuttberedskapen-i-barnevernet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ungdomskoleelevers-meninger-om-skolemotivasjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Boligetablering-i-Oslo-og-Akershus", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Tenaaringen-blir-pensjonist", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Married-Women-s-Employment-and-Public-Policies-in-an-International-Perspective", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Innstramming-i-rehabiliteringspenger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Statlig-oppfoelging-av-IA-avtalen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Hva-er-det-med-familieraad", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/De-siste-aarene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Selektive-virkemidler-i-lokale-boligmarkeder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Bostoette-og-boutgifter", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Det-er-kunnskapene-mine-dere-trenger-ikke-spraaket-mitt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Unge-sosialklienter-fra-ungdom-til-voksen-alder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Brukerundersoekelse-i-barnevernsinstitusjonene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Familieendring-helse-og-trygd", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Den-pressede-omsorgen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Fragmentert-og-koordinert", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Hvem-lot-seg-paavirke", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Ansvar-i-grenseland.-16-aaringers-forstaaelse-av-seksuell-utnytting", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Kunnskapsstatus-1990-2010-.-Forskning-om-etnisk-diskriminering-av-barn-og-unge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Hva-skjer-med-innvandrerfamiliers-bruk-av-barnehage-naar-et-gratis-tilbud-gaar-over-til-aa-koste-penger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Bolig-og-levekaar-i-Norge-2007", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Aldersdemens-i-parforhold", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Ungdom-paa-tvang-i-aapen-institusjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Nordisk-barnevern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Veiledning-som-forsterkningstiltak-i-fosterhjem", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Familie-velferdsstat-og-aldring", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Fra-totalreguleringsambisjoner-til-markedsstyring", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Moderne-urfolk-lokal-og-etnisk-tilhoerighet-blant-samisk-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Den-store-utestengningen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Midt-i-livet-og-midt-i-arbeidslivet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Den-norske-bostoetten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Familiepolitikkens-historie-1970-til-2000", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Eldresenter-paa-ukjent-vei", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Spraak-stimulans-og-laeringslyst-tidlig-innsats-og-tiltak-mot-frafall-i-videregaaende-opplaering-gjennom-hele-oppveksten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Strategier-i-produksjon-av-boligsosiale-tjenester", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Partydop-og-ungdomskultur", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Eldre-aar-lokale-variasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Eldres-posisjon-i-arbeidslivet-ved-konjunkturomslag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Gjeld-til-aa-baere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Sykefravaer-og-rusmiddelbruk-blant-unge-i-arbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Ungdomstiltak-i-stoerre-bysamfunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Hva-sier-loven-hva-tror-folk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Kvalitet-og-innhold-i-norske-barnehager", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Jeg-gleder-meg-til-torsdag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Kommunale-leieboeres-boligkarrierer-2001-2005", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Barnevern-og-ettervern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Skoleprestasjoner-til-barn-med-saerboende-foreldre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/To-maa-man-vaere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/For-barnas-skyld", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Livsloep-i-velferdsstaten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/En-god-hjemmehjelpstjeneste-for-eldre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Unge-ufoerepensjonister", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Paa-terskelen.-En-undersoekelse-av-funksjonshemmet-ungdoms-sosiale-tilhoerighet-selvbilde-og-livskvalitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Innvandrerungdom-marginalisering-og-utvikling-av-problematferd", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Livskvalitet-som-psykisk-velvaere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Epilepsi-og-diabetes", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Voldsuttsatte-barn-og-unge-i-Oslo", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/AA-leve-med-epilepsi", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/og-imens-gaar-tida.-Barnevern-barnehage-og-kontantstoette", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Midt-i-mellom.-Drikker-12-aaringer-i-Baerum", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Skeive-dager-2003-en-rusundersoekelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ansvarsfordeling-til-barns-beste", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Et-prosjekt-som-protesje", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Hinderloeype", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Mestring-og-tilkortkomming-i-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Vold-mot-lesbiske-og-homofile-tenaaringer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Bytte-kjaerlighet-overgrep", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Funksjonsnedsettelse-oppvekst-og-habilitering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Oppvekst-og-rusmiddelbruk-i-Furuset-bydel", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Antisosial-atferd-i-ungdomstiden", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Andre-lands-modeller-for-aa-fremme-sysselsetting-blant-personer-med-nedsatt-funksjonsevne", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Kartlegging-av-alvorlig-kombinert-sansetap-hos-eldre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Ungdomstid-i-Fredrikstad", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Ungdomsskoleelever-i-Randaberg-kommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Lesbiskes-psykiske-helse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Intensjonsavtalen-om-et-inkluderende-arbeidsliv-i-praksis", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Smaabarnsforeldres-yrkesdeltakelse-og-valg-av-barnetilsyn-foer-og-etter-kontantstoettens-innfoering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Risikoutvikling-Tilknytning-omsorgssvikt-og-forebygging", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Virker-arbeidslinja-paa-de-langtidssykmeldte", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Graasonen-mellom-trygdeetat-og-arbeidsmarkedsetat", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Idrett-kjoenn-kropp-og-kultur", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Forskning-om-smaabarnsforeldres-dagligliv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Eldreombud-og-omsorgsombud-i-kommuner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Roeykeloven-og-gjester-ved-brune-serveringssteder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Forlatte-barn-ankerbarn-betrodde-barn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Ungdoms-digitale-hverdag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/En-normal-barndom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/AA-ha-aa-delta-aa-vaere-en-av-gjengen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/The-Baltic-Sea-Regional-Study-on-Adolescents-Sexuality", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Ungdomsundersoekelsen-i-Stavanger-2002", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Forskningskunnskap-om-ettervern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Uskyldig-moro", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Husholdningenes-betalingspraksis", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/AA-betale-for-sent", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Paa-rett-kjoel.-Ullersmoprosjektet-1992-1996", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Hjemmehjelp-brukere-og-kvalitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Evaluering-av-prosjektet-Sammen-for-barn-og-unge-bedre-samordning-av-tjenester-til-utsatte-barn-og-unge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Risk-and-welfare", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/En-digital-barndom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Omsorgstjenester-til-personer-med-etnisk-minoritetsbakgrunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Brukerperspektiv-paa-skolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Evaluering-av-Prosjekt-rovdyrkunnskap-i-Stor-Elvdal-kommune", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Ung-i-Loerenskog-2009", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Organisering-for-velferd", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Seksuelle-krenkelser-via-nettet-hvor-stort-er-problemet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Ungdom-som-lever-med-PC", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Natalie-Rogoff-Ramsoey.-En-pioner-i-norsk-og-internasjonal-sosiologi", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Helse-familie-og-omsorg-over-livsloepet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/A-Community-of-Differences", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Dette-er-jo-bare-en-husmorjobb", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Tid-for-troest", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Mindre-kjoennsulikheter-i-helse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Familiefase-og-hverdagsliv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Ung-i-Maalselv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Kontantstoetteordningens-konsekvenser-for-barnehagesektoren", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Jo-mere-vi-er-sammen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Levekaar-og-livskvalitet-blant-lesbiske-kvinner-og-homofile-menn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Hva-er-nok", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Ungt-engasjement", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Institusjonsplassering-siste-utvei", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Family-Ideology-and-Social-Policy", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Boforhold-for-pensjonister-med-bostoette", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Oppvekst-i-Skien", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Barnehagen-fra-selektivt-til-universelt-velferdsgode", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Loeysingsfokusert-samtaleteknikk-LOEFT-i-fritidsklubber", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Ung-i-Notodden", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Sickness-Absence", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Fra-tradisjonell-regelforvaltning-til-effektiv-tjenesteproduksjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Bedre-tid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Endringer-for-seniorer-i-arbeidslivet-fra-2003-til-2008", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Barn-med-varig-sykdom-og-funksjonshemning", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Arbeidstid-i-barneverninstitusjonene-og-behandlingstiltaket-MST", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/REBUS-kommunedata-3.0.-Veileder-og-dokumentasjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Vold-og-overgrep-mot-barn-og-unge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Kommunikasjon-ved-demens-en-arena-for-samarbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Minoritetsperspektiver-paa-norsk-familievern", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Effects-of-Changing-Government-Policies-on-Sickness-Absence-Behaviour", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Gratis-barnehage-for-alle-femaaringer-i-bydel-Gamle-Oslo", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ungdomsskoleelever.-Motivasjon-mestring-og-resultater", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Veien-til-makta-og-det-gode-liv", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Regionalisering-av-trygdetjenester-erfaringer-hos-brukere-og-ansatte", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Ung-i-Frogn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Skal-jeg-bli-eller-skal-jeg-gaa", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Har-barnet-mitt-vaert-utsatt-for-seksuelle-overgrep", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Makt-og-avmakt-i-helse-og-omsorgstjenestene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Youth-Unemployment-and-Marginalisation-in-Northern-Europe", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Det-skal-ikke-staa-paa-viljen-utdanningsplaner-og-yrkesoensker-blant-Osloungdom-med-innvandrerbakgrunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Education-and-Civic-Engagement-among-Norwegian-Youths", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Kvalitet-og-kvantitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Ung-i-Oslo", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Barns-levekaar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2004/Innvandrerkvinner-i-Groruddalen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Barnevernsklienter-i-Norge-1990-2005", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ung-i-Stavanger-2010", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Bolig-og-dagligliv-i-eldre-aar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Innvandrerungdom-kultur-identitet-og-marginalisering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Gjensidig-trivsel-glede-og-laering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Unemployment-in-a-Segmented-Labour-Market", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Likestillingsprosjektets-barn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Verdighetsforvaltning-i-liv-paa-grensen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Ungdomstid-i-storbyen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Barn-og-unges-levekaar-og-velferd", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Gutter-og-jenter-i-Asker-og-Baerum.-Ungdomsundersoekelsen-1996", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Eldresenteret-naa-og-framover", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Teenagers-become-pensioners", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Siste-skanse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Omsorgstjenester-med-mangfold", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Valgmuligheter-i-ungdomsskolen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Children-and-young-people-report-to-the-UN-on-their-rights", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Eldre-innvandrere-og-organisasjoner", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/Sosial-kapital-og-andre-kapitaler-hos-barn-og-unge-i-Norge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Paa-egne-ben", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Ungdom-og-rusmidler-paa-Nordstrand", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Kontantstoetteordningens-effekter-for-barnetilsyn-og-yrkesdeltakelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Ageing-intergenerational-relations-care-systems-and-quality-of-life-an-introduction-to-the-OASIS-project", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1998/Forebygging-av-problematferd-blant-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Alkoholforebygging-fra-ung-til-ung", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Minstepensjon-og-minstepensjonister", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Motstand-og-mestring.-Om-funksjonshemning-og-livsvilkaar", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Dealing-with-Difference-Two-classrooms-two-countries", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Den-komplekse-virkelighet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Barn-og-unge-med-alvorlige-atferdsvansker.-Hvem-er-de-og-hvilken-hjelp-blir-de-tilbudt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Avgangsalder-og-pensjoneringsmoenster-i-staten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Ut-av-arbeidslivet-livsloep-mestring-og-identitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Osloungdom-og-rusmiddelbruk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2000/Vi-spiller-paa-lag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2007/Homo-Betydningen-av-seksuell-erfaring-tiltrekning-og-identitet-for-selvmordsforsoek-og-rusmiddelbruk-blant-ungdom", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Rett-fra-pikerommet-med-ransel-paa-ryggen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Perspektiver-paa-enslige-forsoergere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Biologisk-mangfold-som-politikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Barneverntjenestens-haandtering-av-saker-med-vold-og-seksuelle-overgrep", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Barn-og-unge-rapporterer-til-FN-om-rettighetene-sine", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Fra-samvaer-til-sjoelutvikling", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Laeringsmiljoe-og-pedagogisk-analyse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2010/15-aaringer-hvem-drikker", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1999/Cultures-and-Natures", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2009/Smaa-barns-hverdager-i-asylmottak", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2002/Naar-hjemme-er-et-annet-sted", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2003/Makt-og-avmakt-i-samarbeidet-mellom-hjem-og-skole", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2008/Flytting-i-nytt-land", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Morgendagens-eldre", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2011/Ny-start-med-Ny-GIV", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Levekaar-og-livskvalitet-hos-ufoerepensjonister-og-mottakere-av-avtalefestet-pensjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/1997/Kommunenes-bruk-av-omsorgsloenn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2001/Rettferdiggjoering-av-omsorgsovertakelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2005/Tatere-og-Misjonen.-Mangfold-makt-og-motstand", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Rapporter/2006/Bolig-og-levekaar-i-Norge-2004"];

var skriftserie = ["http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Commitment-to-welfare-a-question-of-trust", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Om-klager-paa-kommunen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Unge-ufoeres-avgang-fra-arbeidslivet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Etablering-generasjonsulikhet-og-generasjonsoverfoeringer-i-boligsektoren", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2006/Det-kommunale-leiemarkedet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Statens-og-Husbankens-rolle-i-en-markedsbasert-boligsektor", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Two-technical-choices-with-critical-implications", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Juvenile-Delinquency-in-Norway", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Meaning-of-intergenerational-relations", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Forebygging-av-bruk-av-fysisk-straff-i-oppdragelsen-Nett-og-telefontjenester", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Pensjonister-i-arbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Gjeld-og-oekte-rentekostnader", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Nordiske-surveyundersoekelser-av-barn-og-unges-levekaar-1970-2002", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Opinionens-forventninger-til-velferdsstaten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2002/Om-fattigdomsbegrepet-og-dets-implikasjoner-for-praktisk-politikk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Full-dekning-ogsaa-av-foerskolelaerere", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Er-den-norske-opinionen-en-bremsekloss-mot-velferdspolitiske-reformer", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2004/Somaliere-i-eksil-i-Norge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Children-s-Right-Father-s-Duty-Mothers-Responsibility", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2004/Hva-kan-vi-laere-av-Danmark", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Opplevelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Recent-Developments-in-the-Norwegian-Health-Care-System-Pointing-in-What-Direction", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Klage-over-ikke-aa-faa-nesten-universelle-goder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Regnbueprosjektet-en-evaluering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Penger-er-ikke-alt", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Diskriminering-en-litteraturgjennomgang", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Boligetablering-dokumentavgift-og-boligsparing-for-unge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Tilleggsrapport-Ung-i-Notodden", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Tilrettelagte-boliger-omsorgsboliger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Ungdom-og-idrett-i-et-flerkulturelt-samfunn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Personer-som-begaar-seksuelle-overgrep-mot-barn", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Preretirement-in-the-Nordic-countries-in-an-European-context", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/The-changing-balance-between-incentives-and-economic-security-in-the-Nordic-unemployment-benefit-schemes", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Hjelp-til-barn-som-har-foreldre-med-psykiske-lidelser", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2006/Implementering-av-Nettungen", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Livsform-livsloep-og-livstema-som-anvendte-forskningsbegreper", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Transfers-and-Maintenance-Responsibility", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/The-Child-Home-Care-allowance-and-women-s-labour-force-participation-in-Finland-1985-1998", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2002/Noen-trekk-ved-barnevernets-utvikling-mellom-1954-og-1980", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Old-age-is-not-for-sissies", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Diabetes-og-livskvalitet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Samarbeid-mellom-hjem-og-skole-om-barn-med-funksjonshemninger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Social-protection-for-the-elderly-in-Norway", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2002/Early-retirement-and-social-citizenship", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Familieraadslag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Gatemeglingsprosjektet-i-Oslo-Roede-Kors", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Minstepensjonisten-rik-eller-fattig", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Husholdningenes-boligfinansiering", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Tilbudet-av-leide-boliger", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Et-barnevern-med-lydhoerhet-for-barnet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1999/Diskrimineringsproblematikk-og-offentlige-tiltak", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Om-oekonomisk-verdsetting-av-ubetalt-arbeid", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2006/Bruk-av-khat-i-Norge", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Globalisation-the-World-Bank-and-the-New-Welfare-State", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Wealth-Distribution-between-Generations", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/De-frivillige-organisasjonenes-rolle-i-aktivisering-og-arbeidstrening-av-personer-med-marginal-eller-ingen-tilknytning-til-arbeidsmarkedet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Nordisk-barnevern-Likheter-i-lovgivning-forskjeller-i-praksis", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2007/Registerdatabase-for-forskning-om-boligspoersmaal", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Parents-between-work-and-care", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Barn-som-blir-plassert-utenfor-hjemmet-risiko-og-utvikling", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2004/Forskning-om-vanskeligstilte-paa-boligmarkedet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Lesbiske-og-homofile-arbeidstakere-en-pilotundersoekelse", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Studying-Culture-through-Surveys-Getting-Thick-Descriptions-out-of-Paper-thin-Data", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2004/Moedre-med-barn-i-kontantstoettealder", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1998/Epilepsi-og-diabetes", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2002/Vurderingsgrunnlaget-i-alvorlige-barnevernssaker", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/1997/Naar-rehabiliteringspengene-avsluttes", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2002/Life-course-Perspectives-in-Aging-Research", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2003/Barns-levekaar.-Teoretiske-perspektiver-paa-familieoekonomiens-betydning-for-barns-hverdag", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2004/Se-der-hacker-bestefar-eller-bestemor-paa-anbud", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Spania-for-helsens-skyld", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2001/Hverdagslivets-sosiologi-i-norsk-tradisjon", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2000/Trygdefinansierte-kjoeretoey-for-funksjonshemmede", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/NOVAs-skriftserie/2005/Evaluering-av-Foreldretelefonen"];

var temahefte = ["http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Ungdomskulturer-og-narkotikabruk", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Foreldrestoettende-tilbud-i-kommunene", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Dokumentasjon-Ung-i-Oslo-2006", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Forebyggende-arbeid-og-hjelpetiltak-i-barneverntjenesten", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Veiledning-og-veiledningsmodeller-i-barnevernets-foerstelinjetjeneste", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Naturen-i-Stor-Elvdal-ulven-og-det-sosiale-landskapet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Fra-ide-til-virkelighet.-En-modell-for-koordinering-og-drift-av-det-forebyggende-barne-og-ungdomsarbeidet", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Kvalitetssatsing-i-norske-barnehager", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/Hvordan-maalene-ble-naadd", 
"http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/Temahefte/En-skandinavisk-boligmodell"];

var alle_serier = {
    notat: notat,
    rapporter: rapporter,
    skriftserie: skriftserie,
    temahefte: temahefte
}


	// pages to investigate END
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