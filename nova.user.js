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

	var notat = ["Publikasjoner/Notat/Boligbehov-og-ubalanser-i-storbyer.-En-synteserapport.html", 
"Publikasjoner/Notat/Det-som-skjer-paa-nett-forblir-paa-nett.html", 
"Publikasjoner/Notat/Barnehagelaererne.html", 
"Publikasjoner/Notat/En-frigjoeringsleders-historie.html", 
"Publikasjoner/Notat/Et-velfungerende-leiemarked-Notat-4-14.html", 
"Publikasjoner/Notat/Husholdningenes-gjeld-og-formue-hoesten-2012.html", 
"Publikasjoner/Notat/Formell-og-uformell-omsorg.html", 
"Publikasjoner/Notat/Ung-i-Oslo-2012.html", 
"Publikasjoner/Notat/Subjektiv-fattigdom-i-et-velferdssamfunn.html", 
"Publikasjoner/Notat/Sarpsborg-kommune.html", 
"Publikasjoner/Notat/Eieretablering-blant-hushold-med-lave-inntekter.html", 
"Publikasjoner/Notat/Tiggerbander-og-kriminelle-bakmenn-eller-fattige-EU-borgere.html", 
"Publikasjoner/Notat/Universell-utforming-og-tilgjengelighet-i-norsk-boligpolitikk.html", 
"Publikasjoner/Notat/Boendemiljoe-bosaettning-och-integration.html", 
"Publikasjoner/Notat/Bostoette-Mobilitet-kontinuitet-og-endring.html", 
"Publikasjoner/Notat/Boforhold-blant-barnefamilier-med-lav-inntekt.html", 
"Publikasjoner/Notat/Framgangsrike-skoler-under-Kunnskapsloeftet.html", 
"Publikasjoner/Notat/Bedre-levekaar-i-Jevnaker.html", 
"Publikasjoner/Notat/Fremtidens-leiemarked-i-et-internasjonalt-arbeidsmarked.html", 
"Publikasjoner/Notat/Utilsiktet-flytting-fra-fosterhjem.html", 
"Publikasjoner/Notat/Skoleresultater-og-utdanningssituasjon-for-barn-i-barnevernet.html", 
"Publikasjoner/Notat/Snus-og-roeykeslutt-paa-stand-virker-det.html", 
"Publikasjoner/Notat/Unge-fra-innvandrerfamilier-og-sosial-kapital-for-utdanning.html", 
"Publikasjoner/Notat/Utdanningsforskjeller-i-helserelatert-atferd-like-store-over-hele-landet.html", 
"Publikasjoner/Notat/Boligsosiale-utfordringer-i-Asker-kommune.html", 
"Publikasjoner/Notat/Innsats-mot-utkastelser-fra-lovende-forsoek-til-effektiv-rutine.html", 
"Publikasjoner/Notat/Implementering-med-problemer.html", 
"Publikasjoner/Notat/Kunnskap-og-kontakt.html", 
"Publikasjoner/Notat/Psykiske-helseplager-blant-ungdom-tidstrender-og-samfunnsmessige-forklaringer.html", 
"Publikasjoner/Notat/Modeller-for-aa-sikre-medbestemmelse-og-medinnflytelse-blant-utsatte-ungdomsgrupper.html", 
"Publikasjoner/Notat/Suppe-saape-og-frelse-som-en-del-av-det-miljoeterapeutiske-arbeidet.html", 
"Publikasjoner/Notat/Tilgjengelighet-og-deltakelse.html", 
"Publikasjoner/Notat/Nordmenns-gjeld-og-formue-hoesten-2015.html", 
"Publikasjoner/Notat/Storby-stabilitet-og-endring-i-botetthet-og-flytting.html", 
"Publikasjoner/Notat/Barn-og-familie-i-mottak-samarbeid-mellom-asylmottak-og-kommunalt-barnevern.html", 
"Publikasjoner/Notat/Livskvalitet-blant-eldre-mennesker-med-epilepsi.html", 
"Publikasjoner/Notat/Klara-Klok-en-helsenettjeneste-for-ungdom.html", 
"Publikasjoner/Notat/Holdninger-til-funksjonshemmede-i-Norge-1999-2005.html", 
"Publikasjoner/Notat/Utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"Publikasjoner/Notat/Foerskolelaerere-og-barnehageansatte.html", 
"Publikasjoner/Notat/Seniorsentrene-i-innsparingenes-tid.html", 
"Publikasjoner/Notat/Unges-syn-paa-deltakelse-og-innflytelse-i-skolen-lokalpolitikken-og-sivilsamfunnet.html", 
"Publikasjoner/Notat/Hva-med-de-andre.html", 
"Publikasjoner/Notat/Evaluering-av-Aktiv-i-Re.html", 
"Publikasjoner/Notat/Funksjonshemmende-kollektivtransport.html", 
"Publikasjoner/Notat/Datakvalitet-i-Ung-i-Oslo-2006.html", 
"Publikasjoner/Notat/Bor-det-noen-gamle-her-a.html", 
"Publikasjoner/Notat/Boligsosiale-utfordringer-i-Kongsvinger-kommune-en-forstudie.html", 
"Publikasjoner/Notat/Foreldreringer-ringer-i-vann.html", 
"Publikasjoner/Notat/Barnevern-og-sosialhjelp.html", 
"Publikasjoner/Notat/Boligsosiale-utfordringer-og-loesninger.html", 
"Publikasjoner/Notat/Barnevern-i-de-nordiske-landene.html", 
"Publikasjoner/Notat/Parents-socioeconomic-status-and-children-s-academic-performance.html", 
"Publikasjoner/Notat/Gjennomgang-av-barneverntjenesten-i-Ringsaker-2009.html", 
"Publikasjoner/Notat/Integrering-av-flyktningbarn.html", 
"Publikasjoner/Notat/Utenfor-de-boligsosiale-ordningene.html", 
"Publikasjoner/Notat/Evaluering-av-telefonveiledningstjenesten-i-AKAN.html", 
"Publikasjoner/Notat/Hva-er-det-med-Arendal-og-AAlesund-og-Oslo.html", 
"Publikasjoner/Notat/AA-sende-bekymringsmelding-eller-la-det-vaere.html"];

var rapporter = ["Publikasjoner/Rapporter/Ungdata.-Nasjonale-resultater-2014.html", 
"Publikasjoner/Rapporter/Bruk-av-sykehus-og-spesialisthelsetjenester-blant-innbyggere-med-norsk-og-utenlandsk-bakgrunn.html", 
"Publikasjoner/Rapporter/Evaluering-av-proeveprosjektet-med-ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Publikasjoner/Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"Publikasjoner/Rapporter/Samarbeidsavtaler-mellom-helseforetak-og-kommune.html", 
"Publikasjoner/Rapporter/All-European-countries-are-not-the-same.html", 
"Publikasjoner/Rapporter/Skolers-arbeid-med-elevenes-psykososiale-miljoe.html", 
"Publikasjoner/Rapporter/Det-tenner-en-gnist.html", 
"Publikasjoner/Rapporter/Boligbehov-og-ubalanser-i-norske-storbyer.html", 
"Publikasjoner/Rapporter/Forebyggende-helsearbeid-i-kommunene.html", 
"Publikasjoner/Rapporter/Vanskeligstilte-paa-det-norske-boligmarkedet.html", 
"Publikasjoner/Rapporter/Evaluering-av-tiltaket-Maalrettet-stoette-og-veiledning-til-kommuner-og-deres-skoler-som-har-vedvarende-hoeye-mobbetall.html", 
"Publikasjoner/Rapporter/Resultatevaluering-av-Omsorgsplan-2015.html", 
"Publikasjoner/Rapporter/Kjoennsforskjeller-i-skoleprestasjoner.html", 
"Publikasjoner/Rapporter/Ungdata.-Nasjonale-resultater-2013.html", 
"Publikasjoner/Rapporter/Kontakt-paa-sosiale-medier-mellom-foreldre-og-barn-under-offentlig-omsorg.html", 
"Publikasjoner/Rapporter/Hjelp-eller-barrierer.html", 
"Publikasjoner/Rapporter/Barnevern-i-Norge-1990-2010.html", 
"Publikasjoner/Rapporter/Bemanning-og-kompetanse-i-hjemmesykepleien-og-sykehjem.html", 
"Publikasjoner/Rapporter/Felles-fokus.html", 
"Publikasjoner/Rapporter/Boliggjoering-av-eldreomsorgen.html", 
"Publikasjoner/Rapporter/Krisesentertilbudet-i-kommunene.html", 
"Publikasjoner/Rapporter/Tjenestetilbudet-til-voldsutsatte-personer-med-nedsatt-funksjonsevne.html", 
"Publikasjoner/Rapporter/Gateliv.html", 
"Publikasjoner/Rapporter/Evaluering-av-proeveprosjektet-med-Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Publikasjoner/Rapporter/Kommunale-avlastningstilbud.html", 
"Publikasjoner/Rapporter/Til-god-hjelp-for-mange.html", 
"Publikasjoner/Rapporter/Planer-for-et-aldrende-samfunn.html", 
"Publikasjoner/Rapporter/Kroppen-min.html", 
"Publikasjoner/Rapporter/Barn-i-asylsaker.html", 
"Publikasjoner/Rapporter/Hoer-paa-meg.html", 
"Publikasjoner/Rapporter/En-god-forberedelse-til-aa-bli-fosterforeldre.html", 
"Publikasjoner/Rapporter/Baerekraftig-omsorg.html", 
"Publikasjoner/Rapporter/Likestilling-hjemme.html", 
"Publikasjoner/Rapporter/Vennskap-utdanning-og-framtidsplaner.html", 
"Publikasjoner/Rapporter/Habilitering-som-koordinerende-tiltak.html", 
"Publikasjoner/Rapporter/AA-trene-trener-har-trent.html", 
"Publikasjoner/Rapporter/Barnehusevalueringen-2012-Delrapport-2.html", 
"Publikasjoner/Rapporter/Tegnspraakets-inkluderende-kraft.html", 
"Publikasjoner/Rapporter/Ny-kunnskap-om-aldring-og-arbeid.html", 
"Publikasjoner/Rapporter/Litt-vanskelig-at-alle-skal-med!.html", 
"Publikasjoner/Rapporter/Ett-aar-med-arbeidslivsfaget.html", 
"Publikasjoner/Rapporter/For-store-forventninger.html", 
"Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2012.html", 
"Publikasjoner/Rapporter/Ungdata-Nasjonale-resultater-2010-2012.html", 
"Publikasjoner/Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"Publikasjoner/Rapporter/Kvalitet-i-barnehager.html", 
"Publikasjoner/Rapporter/Lesbiske-homofile-bifile-og-transpersoners-utsatthet-for-vold-i-naere-relasjoner.html", 
"Publikasjoner/Rapporter/Fosterhjem-for-barns-behov.html", 
"Publikasjoner/Rapporter/Evaluering-av-leksehjelptilbudet-1.-4.-trinn.html", 
"Publikasjoner/Rapporter/Forsoek-med-arbeidslivsfag-paa-ungdomstrinnet.html", 
"Publikasjoner/Rapporter/Vital-aldring-og-samhold-mellom-generasjoner.html", 
"Publikasjoner/Rapporter/AA-ha-foreldre-av-samme-kjoenn-hvordan-er-det-og-hvor-mange-gjelder-det.html", 
"Publikasjoner/Rapporter/Langt-igjen.html", 
"Publikasjoner/Rapporter/Kontroverser-om-biologisk-mangfold-i-norske-skoger.html", 
"Publikasjoner/Rapporter/Taushetsplikt-opplysningsrett-og-opplysningsplikt.html", 
"Publikasjoner/Rapporter/Pengespill-og-dataspill.html", 
"Publikasjoner/Rapporter/Samhandlingsreformen.html", 
"Publikasjoner/Rapporter/Voksne-i-grunnskole-og-videregaaende-opplaering.html", 
"Publikasjoner/Rapporter/The-Substitution-Issue.html", 
"Publikasjoner/Rapporter/Fastlegeordningen-og-pasienter-med-store-legebehov.html", 
"Publikasjoner/Rapporter/Funksjonshemmede-og-psykisk-helse.html", 
"Publikasjoner/Rapporter/Grenser-for-individualisering.html", 
"Publikasjoner/Rapporter/Innvandrere-og-kriminalitet.html", 
"Publikasjoner/Rapporter/Oppvekstvilkaar-og-rusmiddelbruk-blant-unge-paa-Romsaas.html", 
"Publikasjoner/Rapporter/Foreldreskap-i-smaabarnsfamilien.html", 
"Publikasjoner/Rapporter/Kompetanse-og-utdanningsbehov-innenfor-trygde-og-arbeidsmarkedsetaten.html", 
"Publikasjoner/Rapporter/Spor-etter-aar.html", 
"Publikasjoner/Rapporter/Barn-og-unges-levekaar-i-lavinntektsfamilier.html", 
"Publikasjoner/Rapporter/Sluttevaluering-av-utviklingsarbeidet-utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"Publikasjoner/Rapporter/Virkninger-av-tilpasset-spraakopplaering-for-minoritetsspraaklige-elever.html", 
"Publikasjoner/Rapporter/Egenforsoergede-eneforsoergere.html", 
"Publikasjoner/Rapporter/Ung-i-Bodoe.html", 
"Publikasjoner/Rapporter/Integrering-av-pleie-og-omsorgstjenestene.html", 
"Publikasjoner/Rapporter/Fra-best-til-bedre.html", 
"Publikasjoner/Rapporter/Er-det-bare-eleven.html", 
"Publikasjoner/Rapporter/Gode-skoler-gode-for-alle.html", 
"Publikasjoner/Rapporter/Tiltak-for-eldre-innvandrere.html", 
"Publikasjoner/Rapporter/Aldersforskning-inn-i-aar-2000.html", 
"Publikasjoner/Rapporter/Ung-paa-Nesodden.html", 
"Publikasjoner/Rapporter/Husholdningenes-gjeld-og-formue-ved-inngangen-til-finanskrisen.html", 
"Publikasjoner/Rapporter/Sex-for-overlevelse-eller-skyggebilder-av-kjaerlighet.html", 
"Publikasjoner/Rapporter/Aktiv-paa-dagtid-i-Oslo.html", 
"Publikasjoner/Rapporter/Ung-i-Bergen.html", 
"Publikasjoner/Rapporter/Seniorer-i-arbeidslivet.html", 
"Publikasjoner/Rapporter/Med-ungdom-i-sentrum.-Bergensrapporten.html", 
"Publikasjoner/Rapporter/Omsorgsloenn-til-foreldre-med-funksjonshemmede-barn.html", 
"Publikasjoner/Rapporter/Samvaersfedrenes-situasjon.html", 
"Publikasjoner/Rapporter/Fremstillinger-av-barnevern-i-loessalgspressen.html", 
"Publikasjoner/Rapporter/For-aa-jobbe-her-maa-en-vaere-interessert-i-folka-som-bor-her.html", 
"Publikasjoner/Rapporter/Fattige-innvandrerbarn.html", 
"Publikasjoner/Rapporter/Evaluering-av-attfoeringsreformen-2-bind.html", 
"Publikasjoner/Rapporter/Helse-helseatferd-og-livsloep.html", 
"Publikasjoner/Rapporter/Problematferd-i-skolen.html", 
"Publikasjoner/Rapporter/Boligeie-blant-husholdninger-med-lave-inntekter.html", 
"Publikasjoner/Rapporter/To-aars-gratis-barnehagetilbud-for-familier-med-innvandrerbakgrunn-foerer-det-til-integrering.html", 
"Publikasjoner/Rapporter/Writing-Strategies-for-European-Social-Scientists.html", 
"Publikasjoner/Rapporter/Mangfoldig-omsorg.html", 
"Publikasjoner/Rapporter/Idealer-og-realiteter.html", 
"Publikasjoner/Rapporter/Tilfreds-med-uklarhet.html", 
"Publikasjoner/Rapporter/Eldre-med-innvandrerbakgrunn.html", 
"Publikasjoner/Rapporter/For-gammel.html", 
"Publikasjoner/Rapporter/Bedre-enn-sitt-rykte.html", 
"Publikasjoner/Rapporter/Ungdom-idrett-og-friluftsliv.html", 
"Publikasjoner/Rapporter/Ungdom-i-flyktningfamilier.html", 
"Publikasjoner/Rapporter/Likere-enn-vi-tror.html", 
"Publikasjoner/Rapporter/Ungdom-og-trening.html", 
"Publikasjoner/Rapporter/Kartlegging-av-opplaeringstilbudet-til-enslige-mindreaarige-asylsoekere-og-barn-av-asylsoekere.html", 
"Publikasjoner/Rapporter/Endring-i-lederes-holdninger-til-eldre-arbeidskraft.html", 
"Publikasjoner/Rapporter/Ett-aars-gratis-barnehage-hvilke-konsekvenser-har-det-for-overgangen-til-skolen.html", 
"Publikasjoner/Rapporter/Lesbiske-og-homofile-med-innvandrerbakgrunn.html", 
"Publikasjoner/Rapporter/Tilhoerighetens-balanse.html", 
"Publikasjoner/Rapporter/Verdier-paa-vandring.html", 
"Publikasjoner/Rapporter/Tracing-UMAs-families.html", 
"Publikasjoner/Rapporter/Nordiske-ungdommers-holdninger-til-likestilling.html", 
"Publikasjoner/Rapporter/Velferdsstat-og-velferdskommune.html", 
"Publikasjoner/Rapporter/Den-kommunale-utleiesektor.html", 
"Publikasjoner/Rapporter/Fritidsklubb-kvalifisering-og-rusforebygging.html", 
"Publikasjoner/Rapporter/En-vanskelig-pasient.html", 
"Publikasjoner/Rapporter/En-skole-to-verdener.html", 
"Publikasjoner/Rapporter/Morsmaalsundervisning-som-integrerende-tiltak.html", 
"Publikasjoner/Rapporter/Erfaringer-med-dialog-i-tvangsekteskapssaker.html", 
"Publikasjoner/Rapporter/Forvaltning-som-yrke.html", 
"Publikasjoner/Rapporter/Drinking-getting-stoned-or-staying-sober.html", 
"Publikasjoner/Rapporter/Underholdning-med-bismak.html", 
"Publikasjoner/Rapporter/Ungdom-og-vold-i-bildemediene.html", 
"Publikasjoner/Rapporter/Post-injury-lives.html", 
"Publikasjoner/Rapporter/Diabetes-og-livskvalitet.html", 
"Publikasjoner/Rapporter/Tiltak-rettet-mot-barn-og-ungdom.html", 
"Publikasjoner/Rapporter/Smerte-og-livsmot.html", 
"Publikasjoner/Rapporter/Leiemarkedet-og-leietakernes-rettsvern.html", 
"Publikasjoner/Rapporter/Norske-pensjonister-og-norske-kommuner-i-Spania.html", 
"Publikasjoner/Rapporter/Norsk-boligpolitikk-i-forandring-1970-2010.html", 
"Publikasjoner/Rapporter/Familieraad-som-metode-i-barnevernets-beslutningsprosess.html", 
"Publikasjoner/Rapporter/Prosjekt-Ungdomsboelge-En-evaluering.html", 
"Publikasjoner/Rapporter/Moeter-i-det-flerkulturelle.html", 
"Publikasjoner/Rapporter/Increasing-social-inequality-from-a-uniform-to-a-fragmented-social-policy.html", 
"Publikasjoner/Rapporter/Ufoerepensjonisters-materielle-levekaar-og-sosiale-tilknytning.html", 
"Publikasjoner/Rapporter/Betydningen-av-innvandrerbakgrunn-for-psykiske-vansker-blant-ungdom.html", 
"Publikasjoner/Rapporter/Kvinners-moete-med-helsetjenesten.html", 
"Publikasjoner/Rapporter/Trygd-og-omsorgsarbeid.html", 
"Publikasjoner/Rapporter/Kjaerlighetens-og-autoritetens-kulturelle-koder.html", 
"Publikasjoner/Rapporter/Den-som-har-skoen-paa.html", 
"Publikasjoner/Rapporter/Kvoteordninger-i-europeiske-land-for-personer-med-nedsatt-funksjonsevne.html", 
"Publikasjoner/Rapporter/Moedregrupper-et-tilbakeblikk.html", 
"Publikasjoner/Rapporter/Samarbeid-mellom-hjem-og-skole-en-kartleggingsundersoekelse.html", 
"Publikasjoner/Rapporter/Det-vanskelige-samarbeidet.html", 
"Publikasjoner/Rapporter/Omsorg-for-eldre-innvandrere.html", 
"Publikasjoner/Rapporter/Liv-og-leven-i-skolen.html", 
"Publikasjoner/Rapporter/Unge-funksjonshemmede.html", 
"Publikasjoner/Rapporter/Husleieindekser-og-husleiestatistikk.html", 
"Publikasjoner/Rapporter/I-verdens-rikeste-land.html", 
"Publikasjoner/Rapporter/Ung-i-Frogn-2009.html", 
"Publikasjoner/Rapporter/Prestasjonsforskjeller-i-Kunnskapsloeftets-foerste-aar.html", 
"Publikasjoner/Rapporter/Alenemoedre-og-overgangsstoenaden.html", 
"Publikasjoner/Rapporter/Minoritetsspraaklig-ungdom-i-skolen.html", 
"Publikasjoner/Rapporter/Storbyungdom-og-natur.html", 
"Publikasjoner/Rapporter/Ulikheter-paa-tvers.-Har-foreldres-utdanning-kjoenn-og-minoritetsstatus-like-stor-betydning-for-elevers-karakterer-paa-alle-skoler.html", 
"Publikasjoner/Rapporter/Barn-og-foreldre-som-sosiale-aktoerer-i-moete-med-hjelpetjenester.html", 
"Publikasjoner/Rapporter/Er-det-skolens-skyld-En-kunnskapsoversikt-om-skolens-bidrag-til-kjoennsforskjeller-i-skoleprestasjoner.html", 
"Publikasjoner/Rapporter/Aktiv-Oslo-ungdom.html", 
"Publikasjoner/Rapporter/Behovsstyrt-samarbeid-holder-det.html", 
"Publikasjoner/Rapporter/Organisering-og-planlegging-av-boligsosialt-arbeid-i-norske-kommuner.html", 
"Publikasjoner/Rapporter/Kort-vei-til-lykke-eller-ruin.html", 
"Publikasjoner/Rapporter/Naar-mor-og-far-moetes-i-retten-barnefordeling-og-samvaer.html", 
"Publikasjoner/Rapporter/Helgerud-er-en-oase!.html", 
"Publikasjoner/Rapporter/Barn-og-unges-haandtering-av-vanskelige-livsvilkaar.html", 
"Publikasjoner/Rapporter/gdomsundersoekelsen-i-Strand.html", 
"Publikasjoner/Rapporter/Opinionen-og-eldrepolitikken.html", 
"Publikasjoner/Rapporter/Forskning-om-familiegenerasjoner.html", 
"Publikasjoner/Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"Publikasjoner/Rapporter/Holdninger-til-ekstremisme.html", 
"Publikasjoner/Rapporter/Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Publikasjoner/Rapporter/Underbemanning-er-selvforsterkende.html", 
"Publikasjoner/Rapporter/Sosiale-forskjeller-i-unges-liv.html", 
"Publikasjoner/Rapporter/Ungdata-2016.-Nasjonale-resultater.html", 
"Publikasjoner/Rapporter/Ung-i-Oslo-2015.html", 
"Publikasjoner/Rapporter/Ungdoms-holdninger-til-seksuelle-krenkelser-og-overgrep.html", 
"Publikasjoner/Rapporter/Innvandrerungdom-integrasjon-og-marginalisering.html", 
"Publikasjoner/Rapporter/Medievold-avler-vold-reell-frykt-eller-moralsk-panikk.html", 
"Publikasjoner/Rapporter/Bolig-med-kommunens-bistand.html", 
"Publikasjoner/Rapporter/Eldre-innvandreres-bruk-av-pleie-og-omsorgstjenester.html", 
"Publikasjoner/Rapporter/Ung-i-Tromsoe.html", 
"Publikasjoner/Rapporter/Erfaringer-med-omsorgstjenester-for-eldre-innvandrere.html", 
"Publikasjoner/Rapporter/Kommunen-som-boligeier.html", 
"Publikasjoner/Rapporter/Social-inequalities-in-health-and-their-explanations.html", 
"Publikasjoner/Rapporter/Barns-levekaar.html", 
"Publikasjoner/Rapporter/Livet-foer-og-etter-Frambu.html", 
"Publikasjoner/Rapporter/Kontantstoetteordningens-konsekvenser-for-yrkesaktivitet-og-likestilling.html", 
"Publikasjoner/Rapporter/Tverrnasjonal-komparativ-barneforskning-Muligheter-og-utfordringer.html", 
"Publikasjoner/Rapporter/Kvalitetsstyring-og-kvalitetsstrev.html", 
"Publikasjoner/Rapporter/Medisinske-vikarbyraaer.html", 
"Publikasjoner/Rapporter/Problemer-har-ikke-kontortid.-Akuttberedskapen-i-barnevernet.html", 
"Publikasjoner/Rapporter/Ungdomskoleelevers-meninger-om-skolemotivasjon.html", 
"Publikasjoner/Rapporter/Boligetablering-i-Oslo-og-Akershus.html", 
"Publikasjoner/Rapporter/Tenaaringen-blir-pensjonist.html", 
"Publikasjoner/Rapporter/Married-Women-s-Employment-and-Public-Policies-in-an-International-Perspective.html", 
"Publikasjoner/Rapporter/Innstramming-i-rehabiliteringspenger.html", 
"Publikasjoner/Rapporter/Statlig-oppfoelging-av-IA-avtalen.html", 
"Publikasjoner/Rapporter/Hva-er-det-med-familieraad.html", 
"Publikasjoner/Rapporter/De-siste-aarene.html", 
"Publikasjoner/Rapporter/Selektive-virkemidler-i-lokale-boligmarkeder.html", 
"Publikasjoner/Rapporter/Bostoette-og-boutgifter.html", 
"Publikasjoner/Rapporter/Det-er-kunnskapene-mine-dere-trenger-ikke-spraaket-mitt.html", 
"Publikasjoner/Rapporter/Unge-sosialklienter-fra-ungdom-til-voksen-alder.html", 
"Publikasjoner/Rapporter/Brukerundersoekelse-i-barnevernsinstitusjonene.html", 
"Publikasjoner/Rapporter/Familieendring-helse-og-trygd.html", 
"Publikasjoner/Rapporter/Den-pressede-omsorgen.html", 
"Publikasjoner/Rapporter/Fragmentert-og-koordinert.html", 
"Publikasjoner/Rapporter/Hvem-lot-seg-paavirke.html", 
"Publikasjoner/Rapporter/Ansvar-i-grenseland.-16-aaringers-forstaaelse-av-seksuell-utnytting.html", 
"Publikasjoner/Rapporter/Kunnskapsstatus-1990-2010-.-Forskning-om-etnisk-diskriminering-av-barn-og-unge.html", 
"Publikasjoner/Rapporter/Hva-skjer-med-innvandrerfamiliers-bruk-av-barnehage-naar-et-gratis-tilbud-gaar-over-til-aa-koste-penger.html", 
"Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2007.html", 
"Publikasjoner/Rapporter/Aldersdemens-i-parforhold.html", 
"Publikasjoner/Rapporter/Ungdom-paa-tvang-i-aapen-institusjon.html", 
"Publikasjoner/Rapporter/Nordisk-barnevern.html", 
"Publikasjoner/Rapporter/Veiledning-som-forsterkningstiltak-i-fosterhjem.html", 
"Publikasjoner/Rapporter/Familie-velferdsstat-og-aldring.html", 
"Publikasjoner/Rapporter/Fra-totalreguleringsambisjoner-til-markedsstyring.html", 
"Publikasjoner/Rapporter/Moderne-urfolk-lokal-og-etnisk-tilhoerighet-blant-samisk-ungdom.html", 
"Publikasjoner/Rapporter/Den-store-utestengningen.html", 
"Publikasjoner/Rapporter/Midt-i-livet-og-midt-i-arbeidslivet.html", 
"Publikasjoner/Rapporter/Den-norske-bostoetten.html", 
"Publikasjoner/Rapporter/Familiepolitikkens-historie-1970-til-2000.html", 
"Publikasjoner/Rapporter/Eldresenter-paa-ukjent-vei.html", 
"Publikasjoner/Rapporter/Spraak-stimulans-og-laeringslyst-tidlig-innsats-og-tiltak-mot-frafall-i-videregaaende-opplaering-gjennom-hele-oppveksten.html", 
"Publikasjoner/Rapporter/Strategier-i-produksjon-av-boligsosiale-tjenester.html", 
"Publikasjoner/Rapporter/Partydop-og-ungdomskultur.html", 
"Publikasjoner/Rapporter/Eldre-aar-lokale-variasjoner.html", 
"Publikasjoner/Rapporter/Eldres-posisjon-i-arbeidslivet-ved-konjunkturomslag.html", 
"Publikasjoner/Rapporter/Gjeld-til-aa-baere.html", 
"Publikasjoner/Rapporter/Sykefravaer-og-rusmiddelbruk-blant-unge-i-arbeid.html", 
"Publikasjoner/Rapporter/Ungdomstiltak-i-stoerre-bysamfunn.html", 
"Publikasjoner/Rapporter/Hva-sier-loven-hva-tror-folk.html", 
"Publikasjoner/Rapporter/Kvalitet-og-innhold-i-norske-barnehager.html", 
"Publikasjoner/Rapporter/Jeg-gleder-meg-til-torsdag.html", 
"Publikasjoner/Rapporter/Kommunale-leieboeres-boligkarrierer-2001-2005.html", 
"Publikasjoner/Rapporter/Barnevern-og-ettervern.html", 
"Publikasjoner/Rapporter/Skoleprestasjoner-til-barn-med-saerboende-foreldre.html", 
"Publikasjoner/Rapporter/To-maa-man-vaere.html", 
"Publikasjoner/Rapporter/For-barnas-skyld.html", 
"Publikasjoner/Rapporter/Livsloep-i-velferdsstaten.html", 
"Publikasjoner/Rapporter/En-god-hjemmehjelpstjeneste-for-eldre.html", 
"Publikasjoner/Rapporter/Unge-ufoerepensjonister.html", 
"Publikasjoner/Rapporter/Paa-terskelen.-En-undersoekelse-av-funksjonshemmet-ungdoms-sosiale-tilhoerighet-selvbilde-og-livskvalitet.html", 
"Publikasjoner/Rapporter/Innvandrerungdom-marginalisering-og-utvikling-av-problematferd.html", 
"Publikasjoner/Rapporter/Livskvalitet-som-psykisk-velvaere.html", 
"Publikasjoner/Rapporter/Epilepsi-og-diabetes.html", 
"Publikasjoner/Rapporter/Voldsuttsatte-barn-og-unge-i-Oslo.html", 
"Publikasjoner/Rapporter/AA-leve-med-epilepsi.html", 
"Publikasjoner/Rapporter/og-imens-gaar-tida.-Barnevern-barnehage-og-kontantstoette.html", 
"Publikasjoner/Rapporter/Midt-i-mellom.-Drikker-12-aaringer-i-Baerum.html", 
"Publikasjoner/Rapporter/Skeive-dager-2003-en-rusundersoekelse.html", 
"Publikasjoner/Rapporter/Ansvarsfordeling-til-barns-beste.html", 
"Publikasjoner/Rapporter/Et-prosjekt-som-protesje.html", 
"Publikasjoner/Rapporter/Hinderloeype.html", 
"Publikasjoner/Rapporter/Mestring-og-tilkortkomming-i-skolen.html", 
"Publikasjoner/Rapporter/Vold-mot-lesbiske-og-homofile-tenaaringer.html", 
"Publikasjoner/Rapporter/Bytte-kjaerlighet-overgrep.html", 
"Publikasjoner/Rapporter/Funksjonsnedsettelse-oppvekst-og-habilitering.html", 
"Publikasjoner/Rapporter/Oppvekst-og-rusmiddelbruk-i-Furuset-bydel.html", 
"Publikasjoner/Rapporter/Antisosial-atferd-i-ungdomstiden.html", 
"Publikasjoner/Rapporter/Andre-lands-modeller-for-aa-fremme-sysselsetting-blant-personer-med-nedsatt-funksjonsevne.html", 
"Publikasjoner/Rapporter/Kartlegging-av-alvorlig-kombinert-sansetap-hos-eldre.html", 
"Publikasjoner/Rapporter/Ungdomstid-i-Fredrikstad.html", 
"Publikasjoner/Rapporter/Ungdomsskoleelever-i-Randaberg-kommune.html", 
"Publikasjoner/Rapporter/Lesbiskes-psykiske-helse.html", 
"Publikasjoner/Rapporter/Intensjonsavtalen-om-et-inkluderende-arbeidsliv-i-praksis.html", 
"Publikasjoner/Rapporter/Smaabarnsforeldres-yrkesdeltakelse-og-valg-av-barnetilsyn-foer-og-etter-kontantstoettens-innfoering.html", 
"Publikasjoner/Rapporter/Risikoutvikling-Tilknytning-omsorgssvikt-og-forebygging.html", 
"Publikasjoner/Rapporter/Virker-arbeidslinja-paa-de-langtidssykmeldte.html", 
"Publikasjoner/Rapporter/Graasonen-mellom-trygdeetat-og-arbeidsmarkedsetat.html", 
"Publikasjoner/Rapporter/Idrett-kjoenn-kropp-og-kultur.html", 
"Publikasjoner/Rapporter/Forskning-om-smaabarnsforeldres-dagligliv.html", 
"Publikasjoner/Rapporter/Eldreombud-og-omsorgsombud-i-kommuner.html", 
"Publikasjoner/Rapporter/Roeykeloven-og-gjester-ved-brune-serveringssteder.html", 
"Publikasjoner/Rapporter/Forlatte-barn-ankerbarn-betrodde-barn.html", 
"Publikasjoner/Rapporter/Ungdoms-digitale-hverdag.html", 
"Publikasjoner/Rapporter/En-normal-barndom.html", 
"Publikasjoner/Rapporter/AA-ha-aa-delta-aa-vaere-en-av-gjengen.html", 
"Publikasjoner/Rapporter/The-Baltic-Sea-Regional-Study-on-Adolescents-Sexuality.html", 
"Publikasjoner/Rapporter/Ungdomsundersoekelsen-i-Stavanger-2002.html", 
"Publikasjoner/Rapporter/Forskningskunnskap-om-ettervern.html", 
"Publikasjoner/Rapporter/Uskyldig-moro.html", 
"Publikasjoner/Rapporter/Husholdningenes-betalingspraksis.html", 
"Publikasjoner/Rapporter/AA-betale-for-sent.html", 
"Publikasjoner/Rapporter/Paa-rett-kjoel.-Ullersmoprosjektet-1992-1996.html", 
"Publikasjoner/Rapporter/Hjemmehjelp-brukere-og-kvalitet.html", 
"Publikasjoner/Rapporter/Evaluering-av-prosjektet-Sammen-for-barn-og-unge-bedre-samordning-av-tjenester-til-utsatte-barn-og-unge.html", 
"Publikasjoner/Rapporter/Risk-and-welfare.html", 
"Publikasjoner/Rapporter/En-digital-barndom.html", 
"Publikasjoner/Rapporter/Omsorgstjenester-til-personer-med-etnisk-minoritetsbakgrunn.html", 
"Publikasjoner/Rapporter/Brukerperspektiv-paa-skolen.html", 
"Publikasjoner/Rapporter/Evaluering-av-Prosjekt-rovdyrkunnskap-i-Stor-Elvdal-kommune.html", 
"Publikasjoner/Rapporter/Ung-i-Loerenskog-2009.html", 
"Publikasjoner/Rapporter/Organisering-for-velferd.html", 
"Publikasjoner/Rapporter/Seksuelle-krenkelser-via-nettet-hvor-stort-er-problemet.html", 
"Publikasjoner/Rapporter/Ungdom-som-lever-med-PC.html", 
"Publikasjoner/Rapporter/Natalie-Rogoff-Ramsoey.-En-pioner-i-norsk-og-internasjonal-sosiologi.html", 
"Publikasjoner/Rapporter/Helse-familie-og-omsorg-over-livsloepet.html", 
"Publikasjoner/Rapporter/A-Community-of-Differences.html", 
"Publikasjoner/Rapporter/Dette-er-jo-bare-en-husmorjobb.html", 
"Publikasjoner/Rapporter/Tid-for-troest.html", 
"Publikasjoner/Rapporter/Mindre-kjoennsulikheter-i-helse.html", 
"Publikasjoner/Rapporter/Familiefase-og-hverdagsliv.html", 
"Publikasjoner/Rapporter/Ung-i-Maalselv.html", 
"Publikasjoner/Rapporter/Kontantstoetteordningens-konsekvenser-for-barnehagesektoren.html", 
"Publikasjoner/Rapporter/Jo-mere-vi-er-sammen.html", 
"Publikasjoner/Rapporter/Levekaar-og-livskvalitet-blant-lesbiske-kvinner-og-homofile-menn.html", 
"Publikasjoner/Rapporter/Hva-er-nok.html", 
"Publikasjoner/Rapporter/Ungt-engasjement.html", 
"Publikasjoner/Rapporter/Institusjonsplassering-siste-utvei.html", 
"Publikasjoner/Rapporter/Family-Ideology-and-Social-Policy.html", 
"Publikasjoner/Rapporter/Boforhold-for-pensjonister-med-bostoette.html", 
"Publikasjoner/Rapporter/Oppvekst-i-Skien.html", 
"Publikasjoner/Rapporter/Barnehagen-fra-selektivt-til-universelt-velferdsgode.html", 
"Publikasjoner/Rapporter/Loeysingsfokusert-samtaleteknikk-LOEFT-i-fritidsklubber.html", 
"Publikasjoner/Rapporter/Ung-i-Notodden.html", 
"Publikasjoner/Rapporter/Sickness-Absence.html", 
"Publikasjoner/Rapporter/Fra-tradisjonell-regelforvaltning-til-effektiv-tjenesteproduksjon.html", 
"Publikasjoner/Rapporter/Bedre-tid.html", 
"Publikasjoner/Rapporter/Endringer-for-seniorer-i-arbeidslivet-fra-2003-til-2008.html", 
"Publikasjoner/Rapporter/Barn-med-varig-sykdom-og-funksjonshemning.html", 
"Publikasjoner/Rapporter/Arbeidstid-i-barneverninstitusjonene-og-behandlingstiltaket-MST.html", 
"Publikasjoner/Rapporter/REBUS-kommunedata-3.0.-Veileder-og-dokumentasjon.html", 
"Publikasjoner/Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"Publikasjoner/Rapporter/Kommunikasjon-ved-demens-en-arena-for-samarbeid.html", 
"Publikasjoner/Rapporter/Minoritetsperspektiver-paa-norsk-familievern.html", 
"Publikasjoner/Rapporter/Effects-of-Changing-Government-Policies-on-Sickness-Absence-Behaviour.html", 
"Publikasjoner/Rapporter/Gratis-barnehage-for-alle-femaaringer-i-bydel-Gamle-Oslo.html", 
"Publikasjoner/Rapporter/Ungdomsskoleelever.-Motivasjon-mestring-og-resultater.html", 
"Publikasjoner/Rapporter/Veien-til-makta-og-det-gode-liv.html", 
"Publikasjoner/Rapporter/Regionalisering-av-trygdetjenester-erfaringer-hos-brukere-og-ansatte.html", 
"Publikasjoner/Rapporter/Ung-i-Frogn.html", 
"Publikasjoner/Rapporter/Skal-jeg-bli-eller-skal-jeg-gaa.html", 
"Publikasjoner/Rapporter/Har-barnet-mitt-vaert-utsatt-for-seksuelle-overgrep.html", 
"Publikasjoner/Rapporter/Makt-og-avmakt-i-helse-og-omsorgstjenestene.html", 
"Publikasjoner/Rapporter/Youth-Unemployment-and-Marginalisation-in-Northern-Europe.html", 
"Publikasjoner/Rapporter/Det-skal-ikke-staa-paa-viljen-utdanningsplaner-og-yrkesoensker-blant-Osloungdom-med-innvandrerbakgrunn.html", 
"Publikasjoner/Rapporter/Education-and-Civic-Engagement-among-Norwegian-Youths.html", 
"Publikasjoner/Rapporter/Kvalitet-og-kvantitet.html", 
"Publikasjoner/Rapporter/Ung-i-Oslo.html", 
"Publikasjoner/Rapporter/Barns-levekaar.html", 
"Publikasjoner/Rapporter/Innvandrerkvinner-i-Groruddalen.html", 
"Publikasjoner/Rapporter/Barnevernsklienter-i-Norge-1990-2005.html", 
"Publikasjoner/Rapporter/Ung-i-Stavanger-2010.html", 
"Publikasjoner/Rapporter/Bolig-og-dagligliv-i-eldre-aar.html", 
"Publikasjoner/Rapporter/Innvandrerungdom-kultur-identitet-og-marginalisering.html", 
"Publikasjoner/Rapporter/Gjensidig-trivsel-glede-og-laering.html", 
"Publikasjoner/Rapporter/Unemployment-in-a-Segmented-Labour-Market.html", 
"Publikasjoner/Rapporter/Likestillingsprosjektets-barn.html", 
"Publikasjoner/Rapporter/Verdighetsforvaltning-i-liv-paa-grensen.html", 
"Publikasjoner/Rapporter/Ungdomstid-i-storbyen.html", 
"Publikasjoner/Rapporter/Barn-og-unges-levekaar-og-velferd.html", 
"Publikasjoner/Rapporter/Gutter-og-jenter-i-Asker-og-Baerum.-Ungdomsundersoekelsen-1996.html", 
"Publikasjoner/Rapporter/Eldresenteret-naa-og-framover.html", 
"Publikasjoner/Rapporter/Teenagers-become-pensioners.html", 
"Publikasjoner/Rapporter/Siste-skanse.html", 
"Publikasjoner/Rapporter/Omsorgstjenester-med-mangfold.html", 
"Publikasjoner/Rapporter/Valgmuligheter-i-ungdomsskolen.html", 
"Publikasjoner/Rapporter/Children-and-young-people-report-to-the-UN-on-their-rights.html", 
"Publikasjoner/Rapporter/Eldre-innvandrere-og-organisasjoner.html", 
"Publikasjoner/Rapporter/Sosial-kapital-og-andre-kapitaler-hos-barn-og-unge-i-Norge.html", 
"Publikasjoner/Rapporter/Paa-egne-ben.html", 
"Publikasjoner/Rapporter/Ungdom-og-rusmidler-paa-Nordstrand.html", 
"Publikasjoner/Rapporter/Kontantstoetteordningens-effekter-for-barnetilsyn-og-yrkesdeltakelse.html", 
"Publikasjoner/Rapporter/Ageing-intergenerational-relations-care-systems-and-quality-of-life-an-introduction-to-the-OASIS-project.html", 
"Publikasjoner/Rapporter/Forebygging-av-problematferd-blant-ungdom.html", 
"Publikasjoner/Rapporter/Alkoholforebygging-fra-ung-til-ung.html", 
"Publikasjoner/Rapporter/Minstepensjon-og-minstepensjonister.html", 
"Publikasjoner/Rapporter/Motstand-og-mestring.-Om-funksjonshemning-og-livsvilkaar.html", 
"Publikasjoner/Rapporter/Dealing-with-Difference-Two-classrooms-two-countries.html", 
"Publikasjoner/Rapporter/Den-komplekse-virkelighet.html", 
"Publikasjoner/Rapporter/Barn-og-unge-med-alvorlige-atferdsvansker.-Hvem-er-de-og-hvilken-hjelp-blir-de-tilbudt.html", 
"Publikasjoner/Rapporter/Avgangsalder-og-pensjoneringsmoenster-i-staten.html", 
"Publikasjoner/Rapporter/Ut-av-arbeidslivet-livsloep-mestring-og-identitet.html", 
"Publikasjoner/Rapporter/Osloungdom-og-rusmiddelbruk.html", 
"Publikasjoner/Rapporter/Vi-spiller-paa-lag.html", 
"Publikasjoner/Rapporter/Homo-Betydningen-av-seksuell-erfaring-tiltrekning-og-identitet-for-selvmordsforsoek-og-rusmiddelbruk-blant-ungdom.html", 
"Publikasjoner/Rapporter/Rett-fra-pikerommet-med-ransel-paa-ryggen.html", 
"Publikasjoner/Rapporter/Perspektiver-paa-enslige-forsoergere.html", 
"Publikasjoner/Rapporter/Biologisk-mangfold-som-politikk.html", 
"Publikasjoner/Rapporter/Barneverntjenestens-haandtering-av-saker-med-vold-og-seksuelle-overgrep.html", 
"Publikasjoner/Rapporter/Barn-og-unge-rapporterer-til-FN-om-rettighetene-sine.html", 
"Publikasjoner/Rapporter/Fra-samvaer-til-sjoelutvikling.html", 
"Publikasjoner/Rapporter/Laeringsmiljoe-og-pedagogisk-analyse.html", 
"Publikasjoner/Rapporter/15-aaringer-hvem-drikker.html", 
"Publikasjoner/Rapporter/Cultures-and-Natures.html", 
"Publikasjoner/Rapporter/Smaa-barns-hverdager-i-asylmottak.html", 
"Publikasjoner/Rapporter/Naar-hjemme-er-et-annet-sted.html", 
"Publikasjoner/Rapporter/Makt-og-avmakt-i-samarbeidet-mellom-hjem-og-skole.html", 
"Publikasjoner/Rapporter/Flytting-i-nytt-land.html", 
"Publikasjoner/Rapporter/Morgendagens-eldre.html", 
"Publikasjoner/Rapporter/Ny-start-med-Ny-GIV.html", 
"Publikasjoner/Rapporter/Levekaar-og-livskvalitet-hos-ufoerepensjonister-og-mottakere-av-avtalefestet-pensjon.html", 
"Publikasjoner/Rapporter/Kommunenes-bruk-av-omsorgsloenn.html", 
"Publikasjoner/Rapporter/Rettferdiggjoering-av-omsorgsovertakelse.html", 
"Publikasjoner/Rapporter/Tatere-og-Misjonen.-Mangfold-makt-og-motstand.html", 
"Publikasjoner/Rapporter/Bolig-og-levekaar-i-Norge-2004.html"];

var skriftserie = ["Publikasjoner/Skriftserie/Commitment-to-welfare-a-question-of-trust.html", 
"Publikasjoner/Skriftserie/Om-klager-paa-kommunen.html", 
"Publikasjoner/Skriftserie/Unge-ufoeres-avgang-fra-arbeidslivet.html", 
"Publikasjoner/Skriftserie/Etablering-generasjonsulikhet-og-generasjonsoverfoeringer-i-boligsektoren.html", 
"Publikasjoner/Skriftserie/Det-kommunale-leiemarkedet.html", 
"Publikasjoner/Skriftserie/Statens-og-Husbankens-rolle-i-en-markedsbasert-boligsektor.html", 
"Publikasjoner/Skriftserie/Two-technical-choices-with-critical-implications.html", 
"Publikasjoner/Skriftserie/Juvenile-Delinquency-in-Norway.html", 
"Publikasjoner/Skriftserie/Meaning-of-intergenerational-relations.html", 
"Publikasjoner/Skriftserie/Forebygging-av-bruk-av-fysisk-straff-i-oppdragelsen-Nett-og-telefontjenester.html", 
"Publikasjoner/Skriftserie/Pensjonister-i-arbeid.html", 
"Publikasjoner/Skriftserie/Gjeld-og-oekte-rentekostnader.html", 
"Publikasjoner/Skriftserie/Nordiske-surveyundersoekelser-av-barn-og-unges-levekaar-1970-2002.html", 
"Publikasjoner/Skriftserie/Opinionens-forventninger-til-velferdsstaten.html", 
"Publikasjoner/Skriftserie/Om-fattigdomsbegrepet-og-dets-implikasjoner-for-praktisk-politikk.html", 
"Publikasjoner/Skriftserie/Full-dekning-ogsaa-av-foerskolelaerere.html", 
"Publikasjoner/Skriftserie/Er-den-norske-opinionen-en-bremsekloss-mot-velferdspolitiske-reformer.html", 
"Publikasjoner/Skriftserie/Somaliere-i-eksil-i-Norge.html", 
"Publikasjoner/Skriftserie/Children-s-Right-Father-s-Duty-Mothers-Responsibility.html", 
"Publikasjoner/Skriftserie/Hva-kan-vi-laere-av-Danmark.html", 
"Publikasjoner/Skriftserie/Opplevelse.html", 
"Publikasjoner/Skriftserie/Recent-Developments-in-the-Norwegian-Health-Care-System-Pointing-in-What-Direction.html", 
"Publikasjoner/Skriftserie/Klage-over-ikke-aa-faa-nesten-universelle-goder.html", 
"Publikasjoner/Skriftserie/Regnbueprosjektet-en-evaluering.html", 
"Publikasjoner/Skriftserie/Penger-er-ikke-alt.html", 
"Publikasjoner/Skriftserie/Diskriminering-en-litteraturgjennomgang.html", 
"Publikasjoner/Skriftserie/Boligetablering-dokumentavgift-og-boligsparing-for-unge.html", 
"Publikasjoner/Skriftserie/Tilleggsrapport-Ung-i-Notodden.html", 
"Publikasjoner/Skriftserie/Tilrettelagte-boliger-omsorgsboliger.html", 
"Publikasjoner/Skriftserie/Ungdom-og-idrett-i-et-flerkulturelt-samfunn.html", 
"Publikasjoner/Skriftserie/Personer-som-begaar-seksuelle-overgrep-mot-barn.html", 
"Publikasjoner/Skriftserie/Preretirement-in-the-Nordic-countries-in-an-European-context.html", 
"Publikasjoner/Skriftserie/The-changing-balance-between-incentives-and-economic-security-in-the-Nordic-unemployment-benefit-schemes.html", 
"Publikasjoner/Skriftserie/Hjelp-til-barn-som-har-foreldre-med-psykiske-lidelser.html", 
"Publikasjoner/Skriftserie/Implementering-av-Nettungen.html", 
"Publikasjoner/Skriftserie/Livsform-livsloep-og-livstema-som-anvendte-forskningsbegreper.html", 
"Publikasjoner/Skriftserie/Transfers-and-Maintenance-Responsibility.html", 
"Publikasjoner/Skriftserie/The-Child-Home-Care-allowance-and-women-s-labour-force-participation-in-Finland-1985-1998.html", 
"Publikasjoner/Skriftserie/Noen-trekk-ved-barnevernets-utvikling-mellom-1954-og-1980.html", 
"Publikasjoner/Skriftserie/Old-age-is-not-for-sissies.html", 
"Publikasjoner/Skriftserie/Diabetes-og-livskvalitet.html", 
"Publikasjoner/Skriftserie/Samarbeid-mellom-hjem-og-skole-om-barn-med-funksjonshemninger.html", 
"Publikasjoner/Skriftserie/Social-protection-for-the-elderly-in-Norway.html", 
"Publikasjoner/Skriftserie/Early-retirement-and-social-citizenship.html", 
"Publikasjoner/Skriftserie/Familieraadslag.html", 
"Publikasjoner/Skriftserie/Gatemeglingsprosjektet-i-Oslo-Roede-Kors.html", 
"Publikasjoner/Skriftserie/Minstepensjonisten-rik-eller-fattig.html", 
"Publikasjoner/Skriftserie/Husholdningenes-boligfinansiering.html", 
"Publikasjoner/Skriftserie/Tilbudet-av-leide-boliger.html", 
"Publikasjoner/Skriftserie/Et-barnevern-med-lydhoerhet-for-barnet.html", 
"Publikasjoner/Skriftserie/Diskrimineringsproblematikk-og-offentlige-tiltak.html", 
"Publikasjoner/Skriftserie/Om-oekonomisk-verdsetting-av-ubetalt-arbeid.html", 
"Publikasjoner/Skriftserie/Bruk-av-khat-i-Norge.html", 
"Publikasjoner/Skriftserie/Globalisation-the-World-Bank-and-the-New-Welfare-State.html", 
"Publikasjoner/Skriftserie/Wealth-Distribution-between-Generations.html", 
"Publikasjoner/Skriftserie/De-frivillige-organisasjonenes-rolle-i-aktivisering-og-arbeidstrening-av-personer-med-marginal-eller-ingen-tilknytning-til-arbeidsmarkedet.html", 
"Publikasjoner/Skriftserie/Nordisk-barnevern-Likheter-i-lovgivning-forskjeller-i-praksis.html", 
"Publikasjoner/Skriftserie/Registerdatabase-for-forskning-om-boligspoersmaal.html", 
"Publikasjoner/Skriftserie/Parents-between-work-and-care.html", 
"Publikasjoner/Skriftserie/Barn-som-blir-plassert-utenfor-hjemmet-risiko-og-utvikling.html", 
"Publikasjoner/Skriftserie/Forskning-om-vanskeligstilte-paa-boligmarkedet.html", 
"Publikasjoner/Skriftserie/Lesbiske-og-homofile-arbeidstakere-en-pilotundersoekelse.html", 
"Publikasjoner/Skriftserie/Studying-Culture-through-Surveys-Getting-Thick-Descriptions-out-of-Paper-thin-Data.html", 
"Publikasjoner/Skriftserie/Moedre-med-barn-i-kontantstoettealder.html", 
"Publikasjoner/Skriftserie/Epilepsi-og-diabetes.html", 
"Publikasjoner/Skriftserie/Vurderingsgrunnlaget-i-alvorlige-barnevernssaker.html", 
"Publikasjoner/Skriftserie/Naar-rehabiliteringspengene-avsluttes.html", 
"Publikasjoner/Skriftserie/Life-course-Perspectives-in-Aging-Research.html", 
"Publikasjoner/Skriftserie/Barns-levekaar.-Teoretiske-perspektiver-paa-familieoekonomiens-betydning-for-barns-hverdag.html", 
"Publikasjoner/Skriftserie/Se-der-hacker-bestefar-eller-bestemor-paa-anbud.html", 
"Publikasjoner/Skriftserie/Spania-for-helsens-skyld.html", 
"Publikasjoner/Skriftserie/Hverdagslivets-sosiologi-i-norsk-tradisjon.html", 
"Publikasjoner/Skriftserie/Trygdefinansierte-kjoeretoey-for-funksjonshemmede.html", 
"Publikasjoner/Skriftserie/Evaluering-av-Foreldretelefonen.html"];

var temahefte = ["Publikasjoner/Temahefte/Ungdomskulturer-og-narkotikabruk.html", 
"Publikasjoner/Temahefte/Foreldrestoettende-tilbud-i-kommunene.html", 
"Publikasjoner/Temahefte/Dokumentasjon-Ung-i-Oslo-2006.html", 
"Publikasjoner/Temahefte/Forebyggende-arbeid-og-hjelpetiltak-i-barneverntjenesten.html", 
"Publikasjoner/Temahefte/Veiledning-og-veiledningsmodeller-i-barnevernets-foerstelinjetjeneste.html", 
"Publikasjoner/Temahefte/Naturen-i-Stor-Elvdal-ulven-og-det-sosiale-landskapet.html", 
"Publikasjoner/Temahefte/Fra-ide-til-virkelighet.-En-modell-for-koordinering-og-drift-av-det-forebyggende-barne-og-ungdomsarbeidet.html", 
"Publikasjoner/Temahefte/Kvalitetssatsing-i-norske-barnehager.html", 
"Publikasjoner/Temahefte/Hvordan-maalene-ble-naadd.html", 
"Publikasjoner/Temahefte/En-skandinavisk-boligmodell.html"];

var alle_serier = {
    notat: notat,
    rapporter: rapporter,
    skriftserie: skriftserie,
    temahefte: temahefte
};


	// pages to investigate END
	var url = window.location.href;
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
            var delay_in_ms = 10000;
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
            var site_url = window.location.href;
            var post_data = "site_url="+site_url+"&json_data="+json_data_string;
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

		var temahefteLenker = alle_serier.temahefte;

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

    console.log(alle_serier.temahefte);
	openPages(temahefteLenker, 0);

	} // novaExtractorMainPage()

}()); // function nova()