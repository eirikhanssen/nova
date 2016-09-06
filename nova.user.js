// ==UserScript==
// @name         nova extractor
// @namespace    hfw.no/ns/nova_extractor
// @version      0.5
// @description  Extract info from NOVA publications
// @author       You
// @match        http://www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/*
// @match        http://localhost/~hanson/nova/*
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

	var notat = ["http://localhost/~hanson/nova/Publikasjoner/Notat/Boligbehov-og-ubalanser-i-storbyer.-En-synteserapport.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Det-som-skjer-paa-nett-forblir-paa-nett.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Barnehagelaererne.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/En-frigjoeringsleders-historie.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Et-velfungerende-leiemarked-Notat-4-14.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Husholdningenes-gjeld-og-formue-hoesten-2012.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Formell-og-uformell-omsorg.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Ung-i-Oslo-2012.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Subjektiv-fattigdom-i-et-velferdssamfunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Sarpsborg-kommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Eieretablering-blant-hushold-med-lave-inntekter.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Tiggerbander-og-kriminelle-bakmenn-eller-fattige-EU-borgere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Universell-utforming-og-tilgjengelighet-i-norsk-boligpolitikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Boendemiljoe-bosaettning-och-integration.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Bostoette-Mobilitet-kontinuitet-og-endring.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Boforhold-blant-barnefamilier-med-lav-inntekt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Framgangsrike-skoler-under-Kunnskapsloeftet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Bedre-levekaar-i-Jevnaker.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Fremtidens-leiemarked-i-et-internasjonalt-arbeidsmarked.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Utilsiktet-flytting-fra-fosterhjem.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Skoleresultater-og-utdanningssituasjon-for-barn-i-barnevernet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Snus-og-roeykeslutt-paa-stand-virker-det.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Unge-fra-innvandrerfamilier-og-sosial-kapital-for-utdanning.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Utdanningsforskjeller-i-helserelatert-atferd-like-store-over-hele-landet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Boligsosiale-utfordringer-i-Asker-kommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Innsats-mot-utkastelser-fra-lovende-forsoek-til-effektiv-rutine.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Implementering-med-problemer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Kunnskap-og-kontakt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Psykiske-helseplager-blant-ungdom-tidstrender-og-samfunnsmessige-forklaringer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Modeller-for-aa-sikre-medbestemmelse-og-medinnflytelse-blant-utsatte-ungdomsgrupper.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Suppe-saape-og-frelse-som-en-del-av-det-miljoeterapeutiske-arbeidet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Tilgjengelighet-og-deltakelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Nordmenns-gjeld-og-formue-hoesten-2015.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Storby-stabilitet-og-endring-i-botetthet-og-flytting.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Barn-og-familie-i-mottak-samarbeid-mellom-asylmottak-og-kommunalt-barnevern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Livskvalitet-blant-eldre-mennesker-med-epilepsi.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Klara-Klok-en-helsenettjeneste-for-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Holdninger-til-funksjonshemmede-i-Norge-1999-2005.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Foerskolelaerere-og-barnehageansatte.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Seniorsentrene-i-innsparingenes-tid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Unges-syn-paa-deltakelse-og-innflytelse-i-skolen-lokalpolitikken-og-sivilsamfunnet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Hva-med-de-andre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Evaluering-av-Aktiv-i-Re.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Funksjonshemmende-kollektivtransport.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Datakvalitet-i-Ung-i-Oslo-2006.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Bor-det-noen-gamle-her-a.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Boligsosiale-utfordringer-i-Kongsvinger-kommune-en-forstudie.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Foreldreringer-ringer-i-vann.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Barnevern-og-sosialhjelp.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Boligsosiale-utfordringer-og-loesninger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Barnevern-i-de-nordiske-landene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Parents-socioeconomic-status-and-children-s-academic-performance.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Gjennomgang-av-barneverntjenesten-i-Ringsaker-2009.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Integrering-av-flyktningbarn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Utenfor-de-boligsosiale-ordningene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Evaluering-av-telefonveiledningstjenesten-i-AKAN.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/Hva-er-det-med-Arendal-og-AAlesund-og-Oslo.html", 
"http://localhost/~hanson/nova/Publikasjoner/Notat/AA-sende-bekymringsmelding-eller-la-det-vaere.html"];

var rapporter = ["http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdata.-Nasjonale-resultater-2014.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bruk-av-sykehus-og-spesialisthelsetjenester-blant-innbyggere-med-norsk-og-utenlandsk-bakgrunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-proeveprosjektet-med-ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Samarbeidsavtaler-mellom-helseforetak-og-kommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/All-European-countries-are-not-the-same.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Skolers-arbeid-med-elevenes-psykososiale-miljoe.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Det-tenner-en-gnist.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Boligbehov-og-ubalanser-i-norske-storbyer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forebyggende-helsearbeid-i-kommunene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vanskeligstilte-paa-det-norske-boligmarkedet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-tiltaket-Maalrettet-stoette-og-veiledning-til-kommuner-og-deres-skoler-som-har-vedvarende-hoeye-mobbetall.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Resultatevaluering-av-Omsorgsplan-2015.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kjoennsforskjeller-i-skoleprestasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdata.-Nasjonale-resultater-2013.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kontakt-paa-sosiale-medier-mellom-foreldre-og-barn-under-offentlig-omsorg.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hjelp-eller-barrierer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barnevern-i-Norge-1990-2010.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bemanning-og-kompetanse-i-hjemmesykepleien-og-sykehjem.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Felles-fokus.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Boliggjoering-av-eldreomsorgen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Krisesentertilbudet-i-kommunene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tjenestetilbudet-til-voldsutsatte-personer-med-nedsatt-funksjonsevne.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gateliv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-proeveprosjektet-med-Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kommunale-avlastningstilbud.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Til-god-hjelp-for-mange.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Planer-for-et-aldrende-samfunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kroppen-min.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-i-asylsaker.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hoer-paa-meg.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-god-forberedelse-til-aa-bli-fosterforeldre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Baerekraftig-omsorg.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Likestilling-hjemme.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vennskap-utdanning-og-framtidsplaner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Habilitering-som-koordinerende-tiltak.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/AA-trene-trener-har-trent.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barnehusevalueringen-2012-Delrapport-2.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tegnspraakets-inkluderende-kraft.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ny-kunnskap-om-aldring-og-arbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Litt-vanskelig-at-alle-skal-med!.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ett-aar-med-arbeidslivsfaget.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/For-store-forventninger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2012.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdata-Nasjonale-resultater-2010-2012.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvalitet-i-barnehager.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Lesbiske-homofile-bifile-og-transpersoners-utsatthet-for-vold-i-naere-relasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fosterhjem-for-barns-behov.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-leksehjelptilbudet-1.-4.-trinn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forsoek-med-arbeidslivsfag-paa-ungdomstrinnet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vital-aldring-og-samhold-mellom-generasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/AA-ha-foreldre-av-samme-kjoenn-hvordan-er-det-og-hvor-mange-gjelder-det.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Langt-igjen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kontroverser-om-biologisk-mangfold-i-norske-skoger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Taushetsplikt-opplysningsrett-og-opplysningsplikt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Pengespill-og-dataspill.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Samhandlingsreformen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Voksne-i-grunnskole-og-videregaaende-opplaering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/The-Substitution-Issue.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fastlegeordningen-og-pasienter-med-store-legebehov.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Funksjonshemmede-og-psykisk-helse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Grenser-for-individualisering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innvandrere-og-kriminalitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Oppvekstvilkaar-og-rusmiddelbruk-blant-unge-paa-Romsaas.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Foreldreskap-i-smaabarnsfamilien.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kompetanse-og-utdanningsbehov-innenfor-trygde-og-arbeidsmarkedsetaten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Spor-etter-aar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-unges-levekaar-i-lavinntektsfamilier.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sluttevaluering-av-utviklingsarbeidet-utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Virkninger-av-tilpasset-spraakopplaering-for-minoritetsspraaklige-elever.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Egenforsoergede-eneforsoergere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Bodoe.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Integrering-av-pleie-og-omsorgstjenestene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fra-best-til-bedre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Er-det-bare-eleven.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gode-skoler-gode-for-alle.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tiltak-for-eldre-innvandrere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Aldersforskning-inn-i-aar-2000.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-paa-Nesodden.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Husholdningenes-gjeld-og-formue-ved-inngangen-til-finanskrisen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sex-for-overlevelse-eller-skyggebilder-av-kjaerlighet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Aktiv-paa-dagtid-i-Oslo.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Bergen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Seniorer-i-arbeidslivet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Med-ungdom-i-sentrum.-Bergensrapporten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Omsorgsloenn-til-foreldre-med-funksjonshemmede-barn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Samvaersfedrenes-situasjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fremstillinger-av-barnevern-i-loessalgspressen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/For-aa-jobbe-her-maa-en-vaere-interessert-i-folka-som-bor-her.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fattige-innvandrerbarn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-attfoeringsreformen-2-bind.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Helse-helseatferd-og-livsloep.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Problematferd-i-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Boligeie-blant-husholdninger-med-lave-inntekter.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/To-aars-gratis-barnehagetilbud-for-familier-med-innvandrerbakgrunn-foerer-det-til-integrering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Writing-Strategies-for-European-Social-Scientists.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Mangfoldig-omsorg.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Idealer-og-realiteter.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tilfreds-med-uklarhet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldre-med-innvandrerbakgrunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/For-gammel.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bedre-enn-sitt-rykte.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-idrett-og-friluftsliv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-i-flyktningfamilier.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Likere-enn-vi-tror.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-og-trening.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kartlegging-av-opplaeringstilbudet-til-enslige-mindreaarige-asylsoekere-og-barn-av-asylsoekere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Endring-i-lederes-holdninger-til-eldre-arbeidskraft.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ett-aars-gratis-barnehage-hvilke-konsekvenser-har-det-for-overgangen-til-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Lesbiske-og-homofile-med-innvandrerbakgrunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tilhoerighetens-balanse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Verdier-paa-vandring.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tracing-UMAs-families.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Nordiske-ungdommers-holdninger-til-likestilling.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Velferdsstat-og-velferdskommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-kommunale-utleiesektor.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fritidsklubb-kvalifisering-og-rusforebygging.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-vanskelig-pasient.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-skole-to-verdener.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Morsmaalsundervisning-som-integrerende-tiltak.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Erfaringer-med-dialog-i-tvangsekteskapssaker.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forvaltning-som-yrke.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Drinking-getting-stoned-or-staying-sober.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Underholdning-med-bismak.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-og-vold-i-bildemediene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Post-injury-lives.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Diabetes-og-livskvalitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tiltak-rettet-mot-barn-og-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Smerte-og-livsmot.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Leiemarkedet-og-leietakernes-rettsvern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Norske-pensjonister-og-norske-kommuner-i-Spania.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Norsk-boligpolitikk-i-forandring-1970-2010.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Familieraad-som-metode-i-barnevernets-beslutningsprosess.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Prosjekt-Ungdomsboelge-En-evaluering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Moeter-i-det-flerkulturelle.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Increasing-social-inequality-from-a-uniform-to-a-fragmented-social-policy.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ufoerepensjonisters-materielle-levekaar-og-sosiale-tilknytning.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Betydningen-av-innvandrerbakgrunn-for-psykiske-vansker-blant-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvinners-moete-med-helsetjenesten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Trygd-og-omsorgsarbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kjaerlighetens-og-autoritetens-kulturelle-koder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-som-har-skoen-paa.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvoteordninger-i-europeiske-land-for-personer-med-nedsatt-funksjonsevne.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Moedregrupper-et-tilbakeblikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Samarbeid-mellom-hjem-og-skole-en-kartleggingsundersoekelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Det-vanskelige-samarbeidet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Omsorg-for-eldre-innvandrere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Liv-og-leven-i-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Unge-funksjonshemmede.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Husleieindekser-og-husleiestatistikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/I-verdens-rikeste-land.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Frogn-2009.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Prestasjonsforskjeller-i-Kunnskapsloeftets-foerste-aar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Alenemoedre-og-overgangsstoenaden.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Minoritetsspraaklig-ungdom-i-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Storbyungdom-og-natur.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ulikheter-paa-tvers.-Har-foreldres-utdanning-kjoenn-og-minoritetsstatus-like-stor-betydning-for-elevers-karakterer-paa-alle-skoler.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-foreldre-som-sosiale-aktoerer-i-moete-med-hjelpetjenester.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Er-det-skolens-skyld-En-kunnskapsoversikt-om-skolens-bidrag-til-kjoennsforskjeller-i-skoleprestasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Aktiv-Oslo-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Behovsstyrt-samarbeid-holder-det.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Organisering-og-planlegging-av-boligsosialt-arbeid-i-norske-kommuner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kort-vei-til-lykke-eller-ruin.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Naar-mor-og-far-moetes-i-retten-barnefordeling-og-samvaer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Helgerud-er-en-oase!.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-unges-haandtering-av-vanskelige-livsvilkaar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/gdomsundersoekelsen-i-Strand.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Opinionen-og-eldrepolitikken.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forskning-om-familiegenerasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Holdninger-til-ekstremisme.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Underbemanning-er-selvforsterkende.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sosiale-forskjeller-i-unges-liv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdata-2016.-Nasjonale-resultater.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Oslo-2015.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdoms-holdninger-til-seksuelle-krenkelser-og-overgrep.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innvandrerungdom-integrasjon-og-marginalisering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Medievold-avler-vold-reell-frykt-eller-moralsk-panikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bolig-med-kommunens-bistand.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldre-innvandreres-bruk-av-pleie-og-omsorgstjenester.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Tromsoe.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Erfaringer-med-omsorgstjenester-for-eldre-innvandrere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kommunen-som-boligeier.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Social-inequalities-in-health-and-their-explanations.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barns-levekaar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Livet-foer-og-etter-Frambu.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kontantstoetteordningens-konsekvenser-for-yrkesaktivitet-og-likestilling.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tverrnasjonal-komparativ-barneforskning-Muligheter-og-utfordringer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvalitetsstyring-og-kvalitetsstrev.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Medisinske-vikarbyraaer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Problemer-har-ikke-kontortid.-Akuttberedskapen-i-barnevernet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomskoleelevers-meninger-om-skolemotivasjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Boligetablering-i-Oslo-og-Akershus.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tenaaringen-blir-pensjonist.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Married-Women-s-Employment-and-Public-Policies-in-an-International-Perspective.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innstramming-i-rehabiliteringspenger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Statlig-oppfoelging-av-IA-avtalen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hva-er-det-med-familieraad.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/De-siste-aarene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Selektive-virkemidler-i-lokale-boligmarkeder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bostoette-og-boutgifter.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Det-er-kunnskapene-mine-dere-trenger-ikke-spraaket-mitt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Unge-sosialklienter-fra-ungdom-til-voksen-alder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Brukerundersoekelse-i-barnevernsinstitusjonene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Familieendring-helse-og-trygd.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-pressede-omsorgen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fragmentert-og-koordinert.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hvem-lot-seg-paavirke.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ansvar-i-grenseland.-16-aaringers-forstaaelse-av-seksuell-utnytting.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kunnskapsstatus-1990-2010-.-Forskning-om-etnisk-diskriminering-av-barn-og-unge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hva-skjer-med-innvandrerfamiliers-bruk-av-barnehage-naar-et-gratis-tilbud-gaar-over-til-aa-koste-penger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2007.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Aldersdemens-i-parforhold.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-paa-tvang-i-aapen-institusjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Nordisk-barnevern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Veiledning-som-forsterkningstiltak-i-fosterhjem.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Familie-velferdsstat-og-aldring.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fra-totalreguleringsambisjoner-til-markedsstyring.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Moderne-urfolk-lokal-og-etnisk-tilhoerighet-blant-samisk-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-store-utestengningen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Midt-i-livet-og-midt-i-arbeidslivet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-norske-bostoetten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Familiepolitikkens-historie-1970-til-2000.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldresenter-paa-ukjent-vei.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Spraak-stimulans-og-laeringslyst-tidlig-innsats-og-tiltak-mot-frafall-i-videregaaende-opplaering-gjennom-hele-oppveksten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Strategier-i-produksjon-av-boligsosiale-tjenester.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Partydop-og-ungdomskultur.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldre-aar-lokale-variasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldres-posisjon-i-arbeidslivet-ved-konjunkturomslag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gjeld-til-aa-baere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sykefravaer-og-rusmiddelbruk-blant-unge-i-arbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomstiltak-i-stoerre-bysamfunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hva-sier-loven-hva-tror-folk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvalitet-og-innhold-i-norske-barnehager.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Jeg-gleder-meg-til-torsdag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kommunale-leieboeres-boligkarrierer-2001-2005.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barnevern-og-ettervern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Skoleprestasjoner-til-barn-med-saerboende-foreldre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/To-maa-man-vaere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/For-barnas-skyld.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Livsloep-i-velferdsstaten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-god-hjemmehjelpstjeneste-for-eldre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Unge-ufoerepensjonister.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Paa-terskelen.-En-undersoekelse-av-funksjonshemmet-ungdoms-sosiale-tilhoerighet-selvbilde-og-livskvalitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innvandrerungdom-marginalisering-og-utvikling-av-problematferd.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Livskvalitet-som-psykisk-velvaere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Epilepsi-og-diabetes.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Voldsuttsatte-barn-og-unge-i-Oslo.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/AA-leve-med-epilepsi.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/og-imens-gaar-tida.-Barnevern-barnehage-og-kontantstoette.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Midt-i-mellom.-Drikker-12-aaringer-i-Baerum.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Skeive-dager-2003-en-rusundersoekelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ansvarsfordeling-til-barns-beste.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Et-prosjekt-som-protesje.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hinderloeype.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Mestring-og-tilkortkomming-i-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vold-mot-lesbiske-og-homofile-tenaaringer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bytte-kjaerlighet-overgrep.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Funksjonsnedsettelse-oppvekst-og-habilitering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Oppvekst-og-rusmiddelbruk-i-Furuset-bydel.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Antisosial-atferd-i-ungdomstiden.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Andre-lands-modeller-for-aa-fremme-sysselsetting-blant-personer-med-nedsatt-funksjonsevne.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kartlegging-av-alvorlig-kombinert-sansetap-hos-eldre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomstid-i-Fredrikstad.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomsskoleelever-i-Randaberg-kommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Lesbiskes-psykiske-helse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Intensjonsavtalen-om-et-inkluderende-arbeidsliv-i-praksis.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Smaabarnsforeldres-yrkesdeltakelse-og-valg-av-barnetilsyn-foer-og-etter-kontantstoettens-innfoering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Risikoutvikling-Tilknytning-omsorgssvikt-og-forebygging.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Virker-arbeidslinja-paa-de-langtidssykmeldte.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Graasonen-mellom-trygdeetat-og-arbeidsmarkedsetat.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Idrett-kjoenn-kropp-og-kultur.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forskning-om-smaabarnsforeldres-dagligliv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldreombud-og-omsorgsombud-i-kommuner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Roeykeloven-og-gjester-ved-brune-serveringssteder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forlatte-barn-ankerbarn-betrodde-barn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdoms-digitale-hverdag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-normal-barndom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/AA-ha-aa-delta-aa-vaere-en-av-gjengen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/The-Baltic-Sea-Regional-Study-on-Adolescents-Sexuality.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomsundersoekelsen-i-Stavanger-2002.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forskningskunnskap-om-ettervern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Uskyldig-moro.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Husholdningenes-betalingspraksis.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/AA-betale-for-sent.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Paa-rett-kjoel.-Ullersmoprosjektet-1992-1996.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hjemmehjelp-brukere-og-kvalitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-prosjektet-Sammen-for-barn-og-unge-bedre-samordning-av-tjenester-til-utsatte-barn-og-unge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Risk-and-welfare.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/En-digital-barndom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Omsorgstjenester-til-personer-med-etnisk-minoritetsbakgrunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Brukerperspektiv-paa-skolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Evaluering-av-Prosjekt-rovdyrkunnskap-i-Stor-Elvdal-kommune.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Loerenskog-2009.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Organisering-for-velferd.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Seksuelle-krenkelser-via-nettet-hvor-stort-er-problemet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-som-lever-med-PC.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Natalie-Rogoff-Ramsoey.-En-pioner-i-norsk-og-internasjonal-sosiologi.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Helse-familie-og-omsorg-over-livsloepet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/A-Community-of-Differences.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Dette-er-jo-bare-en-husmorjobb.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tid-for-troest.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Mindre-kjoennsulikheter-i-helse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Familiefase-og-hverdagsliv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Maalselv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kontantstoetteordningens-konsekvenser-for-barnehagesektoren.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Jo-mere-vi-er-sammen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Levekaar-og-livskvalitet-blant-lesbiske-kvinner-og-homofile-menn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Hva-er-nok.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungt-engasjement.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Institusjonsplassering-siste-utvei.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Family-Ideology-and-Social-Policy.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Boforhold-for-pensjonister-med-bostoette.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Oppvekst-i-Skien.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barnehagen-fra-selektivt-til-universelt-velferdsgode.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Loeysingsfokusert-samtaleteknikk-LOEFT-i-fritidsklubber.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Notodden.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sickness-Absence.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fra-tradisjonell-regelforvaltning-til-effektiv-tjenesteproduksjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bedre-tid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Endringer-for-seniorer-i-arbeidslivet-fra-2003-til-2008.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-med-varig-sykdom-og-funksjonshemning.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Arbeidstid-i-barneverninstitusjonene-og-behandlingstiltaket-MST.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/REBUS-kommunedata-3.0.-Veileder-og-dokumentasjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kommunikasjon-ved-demens-en-arena-for-samarbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Minoritetsperspektiver-paa-norsk-familievern.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Effects-of-Changing-Government-Policies-on-Sickness-Absence-Behaviour.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gratis-barnehage-for-alle-femaaringer-i-bydel-Gamle-Oslo.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomsskoleelever.-Motivasjon-mestring-og-resultater.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Veien-til-makta-og-det-gode-liv.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Regionalisering-av-trygdetjenester-erfaringer-hos-brukere-og-ansatte.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Frogn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Skal-jeg-bli-eller-skal-jeg-gaa.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Har-barnet-mitt-vaert-utsatt-for-seksuelle-overgrep.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Makt-og-avmakt-i-helse-og-omsorgstjenestene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Youth-Unemployment-and-Marginalisation-in-Northern-Europe.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Det-skal-ikke-staa-paa-viljen-utdanningsplaner-og-yrkesoensker-blant-Osloungdom-med-innvandrerbakgrunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Education-and-Civic-Engagement-among-Norwegian-Youths.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kvalitet-og-kvantitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Oslo.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barns-levekaar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innvandrerkvinner-i-Groruddalen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barnevernsklienter-i-Norge-1990-2005.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ung-i-Stavanger-2010.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bolig-og-dagligliv-i-eldre-aar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Innvandrerungdom-kultur-identitet-og-marginalisering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gjensidig-trivsel-glede-og-laering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Unemployment-in-a-Segmented-Labour-Market.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Likestillingsprosjektets-barn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Verdighetsforvaltning-i-liv-paa-grensen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdomstid-i-storbyen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-unges-levekaar-og-velferd.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Gutter-og-jenter-i-Asker-og-Baerum.-Ungdomsundersoekelsen-1996.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldresenteret-naa-og-framover.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Teenagers-become-pensioners.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Siste-skanse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Omsorgstjenester-med-mangfold.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Valgmuligheter-i-ungdomsskolen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Children-and-young-people-report-to-the-UN-on-their-rights.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Eldre-innvandrere-og-organisasjoner.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Sosial-kapital-og-andre-kapitaler-hos-barn-og-unge-i-Norge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Paa-egne-ben.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ungdom-og-rusmidler-paa-Nordstrand.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kontantstoetteordningens-effekter-for-barnetilsyn-og-yrkesdeltakelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ageing-intergenerational-relations-care-systems-and-quality-of-life-an-introduction-to-the-OASIS-project.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Forebygging-av-problematferd-blant-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Alkoholforebygging-fra-ung-til-ung.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Minstepensjon-og-minstepensjonister.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Motstand-og-mestring.-Om-funksjonshemning-og-livsvilkaar.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Dealing-with-Difference-Two-classrooms-two-countries.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Den-komplekse-virkelighet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-unge-med-alvorlige-atferdsvansker.-Hvem-er-de-og-hvilken-hjelp-blir-de-tilbudt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Avgangsalder-og-pensjoneringsmoenster-i-staten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ut-av-arbeidslivet-livsloep-mestring-og-identitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Osloungdom-og-rusmiddelbruk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Vi-spiller-paa-lag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Homo-Betydningen-av-seksuell-erfaring-tiltrekning-og-identitet-for-selvmordsforsoek-og-rusmiddelbruk-blant-ungdom.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Rett-fra-pikerommet-med-ransel-paa-ryggen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Perspektiver-paa-enslige-forsoergere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Biologisk-mangfold-som-politikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barneverntjenestens-haandtering-av-saker-med-vold-og-seksuelle-overgrep.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Barn-og-unge-rapporterer-til-FN-om-rettighetene-sine.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Fra-samvaer-til-sjoelutvikling.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Laeringsmiljoe-og-pedagogisk-analyse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/15-aaringer-hvem-drikker.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Cultures-and-Natures.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Smaa-barns-hverdager-i-asylmottak.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Naar-hjemme-er-et-annet-sted.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Makt-og-avmakt-i-samarbeidet-mellom-hjem-og-skole.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Flytting-i-nytt-land.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Morgendagens-eldre.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Ny-start-med-Ny-GIV.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Levekaar-og-livskvalitet-hos-ufoerepensjonister-og-mottakere-av-avtalefestet-pensjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Kommunenes-bruk-av-omsorgsloenn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Rettferdiggjoering-av-omsorgsovertakelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Tatere-og-Misjonen.-Mangfold-makt-og-motstand.html", 
"http://localhost/~hanson/nova/Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2004.html"];

var skriftserie = ["http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Commitment-to-welfare-a-question-of-trust.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Om-klager-paa-kommunen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Unge-ufoeres-avgang-fra-arbeidslivet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Etablering-generasjonsulikhet-og-generasjonsoverfoeringer-i-boligsektoren.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Det-kommunale-leiemarkedet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Statens-og-Husbankens-rolle-i-en-markedsbasert-boligsektor.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Two-technical-choices-with-critical-implications.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Juvenile-Delinquency-in-Norway.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Meaning-of-intergenerational-relations.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Forebygging-av-bruk-av-fysisk-straff-i-oppdragelsen-Nett-og-telefontjenester.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Pensjonister-i-arbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Gjeld-og-oekte-rentekostnader.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Nordiske-surveyundersoekelser-av-barn-og-unges-levekaar-1970-2002.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Opinionens-forventninger-til-velferdsstaten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Om-fattigdomsbegrepet-og-dets-implikasjoner-for-praktisk-politikk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Full-dekning-ogsaa-av-foerskolelaerere.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Er-den-norske-opinionen-en-bremsekloss-mot-velferdspolitiske-reformer.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Somaliere-i-eksil-i-Norge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Children-s-Right-Father-s-Duty-Mothers-Responsibility.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Hva-kan-vi-laere-av-Danmark.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Opplevelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Recent-Developments-in-the-Norwegian-Health-Care-System-Pointing-in-What-Direction.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Klage-over-ikke-aa-faa-nesten-universelle-goder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Regnbueprosjektet-en-evaluering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Penger-er-ikke-alt.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Diskriminering-en-litteraturgjennomgang.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Boligetablering-dokumentavgift-og-boligsparing-for-unge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Tilleggsrapport-Ung-i-Notodden.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Tilrettelagte-boliger-omsorgsboliger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Ungdom-og-idrett-i-et-flerkulturelt-samfunn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Personer-som-begaar-seksuelle-overgrep-mot-barn.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Preretirement-in-the-Nordic-countries-in-an-European-context.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/The-changing-balance-between-incentives-and-economic-security-in-the-Nordic-unemployment-benefit-schemes.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Hjelp-til-barn-som-har-foreldre-med-psykiske-lidelser.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Implementering-av-Nettungen.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Livsform-livsloep-og-livstema-som-anvendte-forskningsbegreper.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Transfers-and-Maintenance-Responsibility.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/The-Child-Home-Care-allowance-and-women-s-labour-force-participation-in-Finland-1985-1998.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Noen-trekk-ved-barnevernets-utvikling-mellom-1954-og-1980.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Old-age-is-not-for-sissies.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Diabetes-og-livskvalitet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Samarbeid-mellom-hjem-og-skole-om-barn-med-funksjonshemninger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Social-protection-for-the-elderly-in-Norway.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Early-retirement-and-social-citizenship.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Familieraadslag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Gatemeglingsprosjektet-i-Oslo-Roede-Kors.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Minstepensjonisten-rik-eller-fattig.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Husholdningenes-boligfinansiering.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Tilbudet-av-leide-boliger.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Et-barnevern-med-lydhoerhet-for-barnet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Diskrimineringsproblematikk-og-offentlige-tiltak.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Om-oekonomisk-verdsetting-av-ubetalt-arbeid.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Bruk-av-khat-i-Norge.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Globalisation-the-World-Bank-and-the-New-Welfare-State.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Wealth-Distribution-between-Generations.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/De-frivillige-organisasjonenes-rolle-i-aktivisering-og-arbeidstrening-av-personer-med-marginal-eller-ingen-tilknytning-til-arbeidsmarkedet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Nordisk-barnevern-Likheter-i-lovgivning-forskjeller-i-praksis.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Registerdatabase-for-forskning-om-boligspoersmaal.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Parents-between-work-and-care.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Barn-som-blir-plassert-utenfor-hjemmet-risiko-og-utvikling.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Forskning-om-vanskeligstilte-paa-boligmarkedet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Lesbiske-og-homofile-arbeidstakere-en-pilotundersoekelse.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Studying-Culture-through-Surveys-Getting-Thick-Descriptions-out-of-Paper-thin-Data.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Moedre-med-barn-i-kontantstoettealder.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Epilepsi-og-diabetes.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Vurderingsgrunnlaget-i-alvorlige-barnevernssaker.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Naar-rehabiliteringspengene-avsluttes.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Life-course-Perspectives-in-Aging-Research.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Barns-levekaar.-Teoretiske-perspektiver-paa-familieoekonomiens-betydning-for-barns-hverdag.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Se-der-hacker-bestefar-eller-bestemor-paa-anbud.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Spania-for-helsens-skyld.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Hverdagslivets-sosiologi-i-norsk-tradisjon.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Trygdefinansierte-kjoeretoey-for-funksjonshemmede.html", 
"http://localhost/~hanson/nova/Publikasjoner/Skriftserie/Evaluering-av-Foreldretelefonen.html"];

var temahefte = ["http://localhost/~hanson/nova/Publikasjoner/Temahefte/Ungdomskulturer-og-narkotikabruk.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Foreldrestoettende-tilbud-i-kommunene.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Dokumentasjon-Ung-i-Oslo-2006.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Forebyggende-arbeid-og-hjelpetiltak-i-barneverntjenesten.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Veiledning-og-veiledningsmodeller-i-barnevernets-foerstelinjetjeneste.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Naturen-i-Stor-Elvdal-ulven-og-det-sosiale-landskapet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Fra-ide-til-virkelighet.-En-modell-for-koordinering-og-drift-av-det-forebyggende-barne-og-ungdomsarbeidet.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Kvalitetssatsing-i-norske-barnehager.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/Hvordan-maalene-ble-naadd.html", 
"http://localhost/~hanson/nova/Publikasjoner/Temahefte/En-skandinavisk-boligmodell.html"];

var alle_serier = {
    notat: notat,
    rapporter: rapporter,
    skriftserie: skriftserie,
    temahefte: temahefte
};

	function getBaseFilenameFromUrl(inputString) {
		return inputString.replace(/\//g,"|").replace(/^.+?([^|]+)$/g, "$1").replace(/^(.+?)[.][^.]+/g, "$1").toLowerCase();
	}
	// pages to investigate END
	var url = window.location.href;
	var filename = getBaseFilenameFromUrl(url);
	var title = document.title;

	if(isNovaPublicationPage(url)){
		novaPublicationPage();
	} else if(isNovaExtractorMainPage(url)) {
		novaExtractorMainPage();
	} else {console.log('unknown page: ' + url);}

	function isNovaPublicationPage(url){
		if(url.indexOf('nova/Publikasjoner/') > -1) {
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
            // sleep
            var delay_in_ms = 4000;
            setTimeout(function(){
                window.close();
            }, delay_in_ms);
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
        
        function ajax_post(json_data_string){
            console.log("json_data_string: " + json_data_string);
            var statusEl = document.querySelector("#statusEl");
            var xhr = new XMLHttpRequest();
            var post_url = "http://localhost/~hanson/nova/nova_xhr.php";
            var post_data = "filename="+filename+"&json_data="+json_data_string;
            xhr.open("POST",post_url,true);
            // set the content type header info for sending url encoded vars in the request
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // access the onreadystatechenge event for the XMLHttpRequest object
            xhr.onreadystatechange = function(){
                var return_data = xhr.responseText;
                if(xhr.readyState == 4 && xhr.status == 200) {
                    statusEl.style.color = "green";
                    statusEl.innerHTML = statusEl.innerHTML + return_data;
                } else {
                    statusEl.style.color = "red";
                    statusEl.innerHTLM = statusEl.innerHTML + return_data;
                }
                closePage();
            };
            xhr.send(post_data);
        	statusEl.innerHTML = statusEl.innerHTML + "</br></br><strong>posted data sendt to server: </strong></br></br>" + post_data + "</br>";
        }
        
        // send the data to php now and wait for response to update the status div.
        
        var statusEl = document.createElement("aside");
        statusEl.id = "statusEl";
        statusEl.innerHTML="processing XHR...</br>";
        statusEl.style.cssText="position:fixed; top:0; right:0; bottom:0; width: 98%; margin-top: 3em; margin-bottom: 3em; margin-right: auto; margin-left: auto; opacity: 0.9; border: 3px solid red; color: black; background-color: #dddddd; font-family: sans-serif; padding: 0.5em; font-size: 1.1em; box-shadow: 0 0 5px black;";
        document.querySelector("body").appendChild(statusEl);

        console.log("posting: ");
	    console.log(stringified);
        ajax_post(stringified);

	}

	function novaExtractorMainPage(){
		console.log('novaExtractorMainPage');

		var temahefteLenker = alle_serier.notat;

	function openPages(linkList, index){
        var len = linkList.length;
		var currentLink = linkList[index]
        console.log("opening: " + currentLink);
		var win = window.open(currentLink);
        var counter = 0;
		var checkIfWinStillOpenLoop = requestAnimationFrame(function(){
            if(win.closed) {
                // ready for next iteration...
                cancelAnimationFrame(checkIfWinStillOpenLoop);
				console.log("closed: " + currentLink);
                if(index < (len - 1)) {
                    openPages(linkList, (index + 1));
                } else {
                    console.log("all done with: " + len + " entries");
                }
            }
		});
        

	} // openPages();

    //console.log(temahefteLenker);
	openPages(temahefteLenker, 0);

	} // novaExtractorMainPage()

}()); // function nova()