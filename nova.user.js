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

	var notat = ["Notat/Boligbehov-og-ubalanser-i-storbyer.-En-synteserapport.html", 
"Notat/Det-som-skjer-paa-nett-forblir-paa-nett.html", 
"Notat/Barnehagelaererne.html", 
"Notat/En-frigjoeringsleders-historie.html", 
"Notat/Et-velfungerende-leiemarked-Notat-4-14.html", 
"Notat/Husholdningenes-gjeld-og-formue-hoesten-2012.html", 
"Notat/Formell-og-uformell-omsorg.html", 
"Notat/Ung-i-Oslo-2012.html", 
"Notat/Subjektiv-fattigdom-i-et-velferdssamfunn.html", 
"Notat/Sarpsborg-kommune.html", 
"Notat/Eieretablering-blant-hushold-med-lave-inntekter.html", 
"Notat/Tiggerbander-og-kriminelle-bakmenn-eller-fattige-EU-borgere.html", 
"Notat/Universell-utforming-og-tilgjengelighet-i-norsk-boligpolitikk.html", 
"Notat/Boendemiljoe-bosaettning-och-integration.html", 
"Notat/Bostoette-Mobilitet-kontinuitet-og-endring.html", 
"Notat/Boforhold-blant-barnefamilier-med-lav-inntekt.html", 
"Notat/Framgangsrike-skoler-under-Kunnskapsloeftet.html", 
"Notat/Bedre-levekaar-i-Jevnaker.html", 
"Notat/Fremtidens-leiemarked-i-et-internasjonalt-arbeidsmarked.html", 
"Notat/Utilsiktet-flytting-fra-fosterhjem.html", 
"Notat/Skoleresultater-og-utdanningssituasjon-for-barn-i-barnevernet.html", 
"Notat/Snus-og-roeykeslutt-paa-stand-virker-det.html", 
"Notat/Unge-fra-innvandrerfamilier-og-sosial-kapital-for-utdanning.html", 
"Notat/Utdanningsforskjeller-i-helserelatert-atferd-like-store-over-hele-landet.html", 
"Notat/Boligsosiale-utfordringer-i-Asker-kommune.html", 
"Notat/Innsats-mot-utkastelser-fra-lovende-forsoek-til-effektiv-rutine.html", 
"Notat/Implementering-med-problemer.html", 
"Notat/Kunnskap-og-kontakt.html", 
"Notat/Psykiske-helseplager-blant-ungdom-tidstrender-og-samfunnsmessige-forklaringer.html", 
"Notat/Modeller-for-aa-sikre-medbestemmelse-og-medinnflytelse-blant-utsatte-ungdomsgrupper.html", 
"Notat/Suppe-saape-og-frelse-som-en-del-av-det-miljoeterapeutiske-arbeidet.html", 
"Notat/Tilgjengelighet-og-deltakelse.html", 
"Notat/Nordmenns-gjeld-og-formue-hoesten-2015.html", 
"Notat/Storby-stabilitet-og-endring-i-botetthet-og-flytting.html", 
"Notat/Barn-og-familie-i-mottak-samarbeid-mellom-asylmottak-og-kommunalt-barnevern.html", 
"Notat/Livskvalitet-blant-eldre-mennesker-med-epilepsi.html", 
"Notat/Klara-Klok-en-helsenettjeneste-for-ungdom.html", 
"Notat/Holdninger-til-funksjonshemmede-i-Norge-1999-2005.html", 
"Notat/Utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"Notat/Foerskolelaerere-og-barnehageansatte.html", 
"Notat/Seniorsentrene-i-innsparingenes-tid.html", 
"Notat/Unges-syn-paa-deltakelse-og-innflytelse-i-skolen-lokalpolitikken-og-sivilsamfunnet.html", 
"Notat/Hva-med-de-andre.html", 
"Notat/Evaluering-av-Aktiv-i-Re.html", 
"Notat/Funksjonshemmende-kollektivtransport.html", 
"Notat/Datakvalitet-i-Ung-i-Oslo-2006.html", 
"Notat/Bor-det-noen-gamle-her-a.html", 
"Notat/Boligsosiale-utfordringer-i-Kongsvinger-kommune-en-forstudie.html", 
"Notat/Foreldreringer-ringer-i-vann.html", 
"Notat/Barnevern-og-sosialhjelp.html", 
"Notat/Boligsosiale-utfordringer-og-loesninger.html", 
"Notat/Barnevern-i-de-nordiske-landene.html", 
"Notat/Parents-socioeconomic-status-and-children-s-academic-performance.html", 
"Notat/Gjennomgang-av-barneverntjenesten-i-Ringsaker-2009.html", 
"Notat/Integrering-av-flyktningbarn.html", 
"Notat/Utenfor-de-boligsosiale-ordningene.html", 
"Notat/Evaluering-av-telefonveiledningstjenesten-i-AKAN.html", 
"Notat/Hva-er-det-med-Arendal-og-AAlesund-og-Oslo.html", 
"Notat/AA-sende-bekymringsmelding-eller-la-det-vaere.html"];

var rapporter = ["Rapporter/Ungdata.-Nasjonale-resultater-2014.html", 
"Rapporter/Bruk-av-sykehus-og-spesialisthelsetjenester-blant-innbyggere-med-norsk-og-utenlandsk-bakgrunn.html", 
"Rapporter/Evaluering-av-proeveprosjektet-med-ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"Rapporter/Samarbeidsavtaler-mellom-helseforetak-og-kommune.html", 
"Rapporter/All-European-countries-are-not-the-same.html", 
"Rapporter/Skolers-arbeid-med-elevenes-psykososiale-miljoe.html", 
"Rapporter/Det-tenner-en-gnist.html", 
"Rapporter/Boligbehov-og-ubalanser-i-norske-storbyer.html", 
"Rapporter/Forebyggende-helsearbeid-i-kommunene.html", 
"Rapporter/Vanskeligstilte-paa-det-norske-boligmarkedet.html", 
"Rapporter/Evaluering-av-tiltaket-Maalrettet-stoette-og-veiledning-til-kommuner-og-deres-skoler-som-har-vedvarende-hoeye-mobbetall.html", 
"Rapporter/Resultatevaluering-av-Omsorgsplan-2015.html", 
"Rapporter/Kjoennsforskjeller-i-skoleprestasjoner.html", 
"Rapporter/Ungdata.-Nasjonale-resultater-2013.html", 
"Rapporter/Kontakt-paa-sosiale-medier-mellom-foreldre-og-barn-under-offentlig-omsorg.html", 
"Rapporter/Hjelp-eller-barrierer.html", 
"Rapporter/Barnevern-i-Norge-1990-2010.html", 
"Rapporter/Bemanning-og-kompetanse-i-hjemmesykepleien-og-sykehjem.html", 
"Rapporter/Felles-fokus.html", 
"Rapporter/Boliggjoering-av-eldreomsorgen.html", 
"Rapporter/Krisesentertilbudet-i-kommunene.html", 
"Rapporter/Tjenestetilbudet-til-voldsutsatte-personer-med-nedsatt-funksjonsevne.html", 
"Rapporter/Gateliv.html", 
"Rapporter/Evaluering-av-proeveprosjektet-med-Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Rapporter/Kommunale-avlastningstilbud.html", 
"Rapporter/Til-god-hjelp-for-mange.html", 
"Rapporter/Planer-for-et-aldrende-samfunn.html", 
"Rapporter/Kroppen-min.html", 
"Rapporter/Barn-i-asylsaker.html", 
"Rapporter/Hoer-paa-meg.html", 
"Rapporter/En-god-forberedelse-til-aa-bli-fosterforeldre.html", 
"Rapporter/Baerekraftig-omsorg.html", 
"Rapporter/Likestilling-hjemme.html", 
"Rapporter/Vennskap-utdanning-og-framtidsplaner.html", 
"Rapporter/Habilitering-som-koordinerende-tiltak.html", 
"Rapporter/AA-trene-trener-har-trent.html", 
"Rapporter/Barnehusevalueringen-2012-Delrapport-2.html", 
"Rapporter/Tegnspraakets-inkluderende-kraft.html", 
"Rapporter/Ny-kunnskap-om-aldring-og-arbeid.html", 
"Rapporter/Litt-vanskelig-at-alle-skal-med!.html", 
"Rapporter/Ett-aar-med-arbeidslivsfaget.html", 
"Rapporter/For-store-forventninger.html", 
"Rapporter/Bolig-og-levekaar-i-Norge-2012.html", 
"Rapporter/Ungdata-Nasjonale-resultater-2010-2012.html", 
"Rapporter/Oppfoelgingsprosjektet-i-Ny-GIV.html", 
"Rapporter/Kvalitet-i-barnehager.html", 
"Rapporter/Lesbiske-homofile-bifile-og-transpersoners-utsatthet-for-vold-i-naere-relasjoner.html", 
"Rapporter/Fosterhjem-for-barns-behov.html", 
"Rapporter/Evaluering-av-leksehjelptilbudet-1.-4.-trinn.html", 
"Rapporter/Forsoek-med-arbeidslivsfag-paa-ungdomstrinnet.html", 
"Rapporter/Vital-aldring-og-samhold-mellom-generasjoner.html", 
"Rapporter/AA-ha-foreldre-av-samme-kjoenn-hvordan-er-det-og-hvor-mange-gjelder-det.html", 
"Rapporter/Langt-igjen.html", 
"Rapporter/Kontroverser-om-biologisk-mangfold-i-norske-skoger.html", 
"Rapporter/Taushetsplikt-opplysningsrett-og-opplysningsplikt.html", 
"Rapporter/Pengespill-og-dataspill.html", 
"Rapporter/Samhandlingsreformen.html", 
"Rapporter/Voksne-i-grunnskole-og-videregaaende-opplaering.html", 
"Rapporter/The-Substitution-Issue.html", 
"Rapporter/Fastlegeordningen-og-pasienter-med-store-legebehov.html", 
"Rapporter/Funksjonshemmede-og-psykisk-helse.html", 
"Rapporter/Grenser-for-individualisering.html", 
"Rapporter/Innvandrere-og-kriminalitet.html", 
"Rapporter/Oppvekstvilkaar-og-rusmiddelbruk-blant-unge-paa-Romsaas.html", 
"Rapporter/Foreldreskap-i-smaabarnsfamilien.html", 
"Rapporter/Kompetanse-og-utdanningsbehov-innenfor-trygde-og-arbeidsmarkedsetaten.html", 
"Rapporter/Spor-etter-aar.html", 
"Rapporter/Barn-og-unges-levekaar-i-lavinntektsfamilier.html", 
"Rapporter/Sluttevaluering-av-utviklingsarbeidet-utsatte-unge-17-23-aar-i-overgangsfaser.html", 
"Rapporter/Virkninger-av-tilpasset-spraakopplaering-for-minoritetsspraaklige-elever.html", 
"Rapporter/Egenforsoergede-eneforsoergere.html", 
"Rapporter/Ung-i-Bodoe.html", 
"Rapporter/Integrering-av-pleie-og-omsorgstjenestene.html", 
"Rapporter/Fra-best-til-bedre.html", 
"Rapporter/Er-det-bare-eleven.html", 
"Rapporter/Gode-skoler-gode-for-alle.html", 
"Rapporter/Tiltak-for-eldre-innvandrere.html", 
"Rapporter/Aldersforskning-inn-i-aar-2000.html", 
"Rapporter/Ung-paa-Nesodden.html", 
"Rapporter/Husholdningenes-gjeld-og-formue-ved-inngangen-til-finanskrisen.html", 
"Rapporter/Sex-for-overlevelse-eller-skyggebilder-av-kjaerlighet.html", 
"Rapporter/Aktiv-paa-dagtid-i-Oslo.html", 
"Rapporter/Ung-i-Bergen.html", 
"Rapporter/Seniorer-i-arbeidslivet.html", 
"Rapporter/Med-ungdom-i-sentrum.-Bergensrapporten.html", 
"Rapporter/Omsorgsloenn-til-foreldre-med-funksjonshemmede-barn.html", 
"Rapporter/Samvaersfedrenes-situasjon.html", 
"Rapporter/Fremstillinger-av-barnevern-i-loessalgspressen.html", 
"Rapporter/For-aa-jobbe-her-maa-en-vaere-interessert-i-folka-som-bor-her.html", 
"Rapporter/Fattige-innvandrerbarn.html", 
"Rapporter/Evaluering-av-attfoeringsreformen-2-bind.html", 
"Rapporter/Helse-helseatferd-og-livsloep.html", 
"Rapporter/Problematferd-i-skolen.html", 
"Rapporter/Boligeie-blant-husholdninger-med-lave-inntekter.html", 
"Rapporter/To-aars-gratis-barnehagetilbud-for-familier-med-innvandrerbakgrunn-foerer-det-til-integrering.html", 
"Rapporter/Writing-Strategies-for-European-Social-Scientists.html", 
"Rapporter/Mangfoldig-omsorg.html", 
"Rapporter/Idealer-og-realiteter.html", 
"Rapporter/Tilfreds-med-uklarhet.html", 
"Rapporter/Eldre-med-innvandrerbakgrunn.html", 
"Rapporter/For-gammel.html", 
"Rapporter/Bedre-enn-sitt-rykte.html", 
"Rapporter/Ungdom-idrett-og-friluftsliv.html", 
"Rapporter/Ungdom-i-flyktningfamilier.html", 
"Rapporter/Likere-enn-vi-tror.html", 
"Rapporter/Ungdom-og-trening.html", 
"Rapporter/Kartlegging-av-opplaeringstilbudet-til-enslige-mindreaarige-asylsoekere-og-barn-av-asylsoekere.html", 
"Rapporter/Endring-i-lederes-holdninger-til-eldre-arbeidskraft.html", 
"Rapporter/Ett-aars-gratis-barnehage-hvilke-konsekvenser-har-det-for-overgangen-til-skolen.html", 
"Rapporter/Lesbiske-og-homofile-med-innvandrerbakgrunn.html", 
"Rapporter/Tilhoerighetens-balanse.html", 
"Rapporter/Verdier-paa-vandring.html", 
"Rapporter/Tracing-UMAs-families.html", 
"Rapporter/Nordiske-ungdommers-holdninger-til-likestilling.html", 
"Rapporter/Velferdsstat-og-velferdskommune.html", 
"Rapporter/Den-kommunale-utleiesektor.html", 
"Rapporter/Fritidsklubb-kvalifisering-og-rusforebygging.html", 
"Rapporter/En-vanskelig-pasient.html", 
"Rapporter/En-skole-to-verdener.html", 
"Rapporter/Morsmaalsundervisning-som-integrerende-tiltak.html", 
"Rapporter/Erfaringer-med-dialog-i-tvangsekteskapssaker.html", 
"Rapporter/Forvaltning-som-yrke.html", 
"Rapporter/Drinking-getting-stoned-or-staying-sober.html", 
"Rapporter/Underholdning-med-bismak.html", 
"Rapporter/Ungdom-og-vold-i-bildemediene.html", 
"Rapporter/Post-injury-lives.html", 
"Rapporter/Diabetes-og-livskvalitet.html", 
"Rapporter/Tiltak-rettet-mot-barn-og-ungdom.html", 
"Rapporter/Smerte-og-livsmot.html", 
"Rapporter/Leiemarkedet-og-leietakernes-rettsvern.html", 
"Rapporter/Norske-pensjonister-og-norske-kommuner-i-Spania.html", 
"Rapporter/Norsk-boligpolitikk-i-forandring-1970-2010.html", 
"Rapporter/Familieraad-som-metode-i-barnevernets-beslutningsprosess.html", 
"Rapporter/Prosjekt-Ungdomsboelge-En-evaluering.html", 
"Rapporter/Moeter-i-det-flerkulturelle.html", 
"Rapporter/Increasing-social-inequality-from-a-uniform-to-a-fragmented-social-policy.html", 
"Rapporter/Ufoerepensjonisters-materielle-levekaar-og-sosiale-tilknytning.html", 
"Rapporter/Betydningen-av-innvandrerbakgrunn-for-psykiske-vansker-blant-ungdom.html", 
"Rapporter/Kvinners-moete-med-helsetjenesten.html", 
"Rapporter/Trygd-og-omsorgsarbeid.html", 
"Rapporter/Kjaerlighetens-og-autoritetens-kulturelle-koder.html", 
"Rapporter/Den-som-har-skoen-paa.html", 
"Rapporter/Kvoteordninger-i-europeiske-land-for-personer-med-nedsatt-funksjonsevne.html", 
"Rapporter/Moedregrupper-et-tilbakeblikk.html", 
"Rapporter/Samarbeid-mellom-hjem-og-skole-en-kartleggingsundersoekelse.html", 
"Rapporter/Det-vanskelige-samarbeidet.html", 
"Rapporter/Omsorg-for-eldre-innvandrere.html", 
"Rapporter/Liv-og-leven-i-skolen.html", 
"Rapporter/Unge-funksjonshemmede.html", 
"Rapporter/Husleieindekser-og-husleiestatistikk.html", 
"Rapporter/I-verdens-rikeste-land.html", 
"Rapporter/Ung-i-Frogn-2009.html", 
"Rapporter/Prestasjonsforskjeller-i-Kunnskapsloeftets-foerste-aar.html", 
"Rapporter/Alenemoedre-og-overgangsstoenaden.html", 
"Rapporter/Minoritetsspraaklig-ungdom-i-skolen.html", 
"Rapporter/Storbyungdom-og-natur.html", 
"Rapporter/Ulikheter-paa-tvers.-Har-foreldres-utdanning-kjoenn-og-minoritetsstatus-like-stor-betydning-for-elevers-karakterer-paa-alle-skoler.html", 
"Rapporter/Barn-og-foreldre-som-sosiale-aktoerer-i-moete-med-hjelpetjenester.html", 
"Rapporter/Er-det-skolens-skyld-En-kunnskapsoversikt-om-skolens-bidrag-til-kjoennsforskjeller-i-skoleprestasjoner.html", 
"Rapporter/Aktiv-Oslo-ungdom.html", 
"Rapporter/Behovsstyrt-samarbeid-holder-det.html", 
"Rapporter/Organisering-og-planlegging-av-boligsosialt-arbeid-i-norske-kommuner.html", 
"Rapporter/Kort-vei-til-lykke-eller-ruin.html", 
"Rapporter/Naar-mor-og-far-moetes-i-retten-barnefordeling-og-samvaer.html", 
"Rapporter/Helgerud-er-en-oase!.html", 
"Rapporter/Barn-og-unges-haandtering-av-vanskelige-livsvilkaar.html", 
"Rapporter/gdomsundersoekelsen-i-Strand.html", 
"Rapporter/Opinionen-og-eldrepolitikken.html", 
"Rapporter/Forskning-om-familiegenerasjoner.html", 
"Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"Rapporter/Holdninger-til-ekstremisme.html", 
"Rapporter/Ungdomsenheten-og-det-tverretatlige-teamet-ved-Bjoergvin-fengsel.html", 
"Rapporter/Underbemanning-er-selvforsterkende.html", 
"Rapporter/Sosiale-forskjeller-i-unges-liv.html", 
"Rapporter/Ungdata-2016.-Nasjonale-resultater.html", 
"Rapporter/Ung-i-Oslo-2015.html", 
"Rapporter/Ungdoms-holdninger-til-seksuelle-krenkelser-og-overgrep.html", 
"Rapporter/Innvandrerungdom-integrasjon-og-marginalisering.html", 
"Rapporter/Medievold-avler-vold-reell-frykt-eller-moralsk-panikk.html", 
"Rapporter/Bolig-med-kommunens-bistand.html", 
"Rapporter/Eldre-innvandreres-bruk-av-pleie-og-omsorgstjenester.html", 
"Rapporter/Ung-i-Tromsoe.html", 
"Rapporter/Erfaringer-med-omsorgstjenester-for-eldre-innvandrere.html", 
"Rapporter/Kommunen-som-boligeier.html", 
"Rapporter/Social-inequalities-in-health-and-their-explanations.html", 
"Rapporter/Barns-levekaar.html", 
"Rapporter/Livet-foer-og-etter-Frambu.html", 
"Rapporter/Kontantstoetteordningens-konsekvenser-for-yrkesaktivitet-og-likestilling.html", 
"Rapporter/Tverrnasjonal-komparativ-barneforskning-Muligheter-og-utfordringer.html", 
"Rapporter/Kvalitetsstyring-og-kvalitetsstrev.html", 
"Rapporter/Medisinske-vikarbyraaer.html", 
"Rapporter/Problemer-har-ikke-kontortid.-Akuttberedskapen-i-barnevernet.html", 
"Rapporter/Ungdomskoleelevers-meninger-om-skolemotivasjon.html", 
"Rapporter/Boligetablering-i-Oslo-og-Akershus.html", 
"Rapporter/Tenaaringen-blir-pensjonist.html", 
"Rapporter/Married-Women-s-Employment-and-Public-Policies-in-an-International-Perspective.html", 
"Rapporter/Innstramming-i-rehabiliteringspenger.html", 
"Rapporter/Statlig-oppfoelging-av-IA-avtalen.html", 
"Rapporter/Hva-er-det-med-familieraad.html", 
"Rapporter/De-siste-aarene.html", 
"Rapporter/Selektive-virkemidler-i-lokale-boligmarkeder.html", 
"Rapporter/Bostoette-og-boutgifter.html", 
"Rapporter/Det-er-kunnskapene-mine-dere-trenger-ikke-spraaket-mitt.html", 
"Rapporter/Unge-sosialklienter-fra-ungdom-til-voksen-alder.html", 
"Rapporter/Brukerundersoekelse-i-barnevernsinstitusjonene.html", 
"Rapporter/Familieendring-helse-og-trygd.html", 
"Rapporter/Den-pressede-omsorgen.html", 
"Rapporter/Fragmentert-og-koordinert.html", 
"Rapporter/Hvem-lot-seg-paavirke.html", 
"Rapporter/Ansvar-i-grenseland.-16-aaringers-forstaaelse-av-seksuell-utnytting.html", 
"Rapporter/Kunnskapsstatus-1990-2010-.-Forskning-om-etnisk-diskriminering-av-barn-og-unge.html", 
"Rapporter/Hva-skjer-med-innvandrerfamiliers-bruk-av-barnehage-naar-et-gratis-tilbud-gaar-over-til-aa-koste-penger.html", 
"Rapporter/Bolig-og-levekaar-i-Norge-2007.html", 
"Rapporter/Aldersdemens-i-parforhold.html", 
"Rapporter/Ungdom-paa-tvang-i-aapen-institusjon.html", 
"Rapporter/Nordisk-barnevern.html", 
"Rapporter/Veiledning-som-forsterkningstiltak-i-fosterhjem.html", 
"Rapporter/Familie-velferdsstat-og-aldring.html", 
"Rapporter/Fra-totalreguleringsambisjoner-til-markedsstyring.html", 
"Rapporter/Moderne-urfolk-lokal-og-etnisk-tilhoerighet-blant-samisk-ungdom.html", 
"Rapporter/Den-store-utestengningen.html", 
"Rapporter/Midt-i-livet-og-midt-i-arbeidslivet.html", 
"Rapporter/Den-norske-bostoetten.html", 
"Rapporter/Familiepolitikkens-historie-1970-til-2000.html", 
"Rapporter/Eldresenter-paa-ukjent-vei.html", 
"Rapporter/Spraak-stimulans-og-laeringslyst-tidlig-innsats-og-tiltak-mot-frafall-i-videregaaende-opplaering-gjennom-hele-oppveksten.html", 
"Rapporter/Strategier-i-produksjon-av-boligsosiale-tjenester.html", 
"Rapporter/Partydop-og-ungdomskultur.html", 
"Rapporter/Eldre-aar-lokale-variasjoner.html", 
"Rapporter/Eldres-posisjon-i-arbeidslivet-ved-konjunkturomslag.html", 
"Rapporter/Gjeld-til-aa-baere.html", 
"Rapporter/Sykefravaer-og-rusmiddelbruk-blant-unge-i-arbeid.html", 
"Rapporter/Ungdomstiltak-i-stoerre-bysamfunn.html", 
"Rapporter/Hva-sier-loven-hva-tror-folk.html", 
"Rapporter/Kvalitet-og-innhold-i-norske-barnehager.html", 
"Rapporter/Jeg-gleder-meg-til-torsdag.html", 
"Rapporter/Kommunale-leieboeres-boligkarrierer-2001-2005.html", 
"Rapporter/Barnevern-og-ettervern.html", 
"Rapporter/Skoleprestasjoner-til-barn-med-saerboende-foreldre.html", 
"Rapporter/To-maa-man-vaere.html", 
"Rapporter/For-barnas-skyld.html", 
"Rapporter/Livsloep-i-velferdsstaten.html", 
"Rapporter/En-god-hjemmehjelpstjeneste-for-eldre.html", 
"Rapporter/Unge-ufoerepensjonister.html", 
"Rapporter/Paa-terskelen.-En-undersoekelse-av-funksjonshemmet-ungdoms-sosiale-tilhoerighet-selvbilde-og-livskvalitet.html", 
"Rapporter/Innvandrerungdom-marginalisering-og-utvikling-av-problematferd.html", 
"Rapporter/Livskvalitet-som-psykisk-velvaere.html", 
"Rapporter/Epilepsi-og-diabetes.html", 
"Rapporter/Voldsuttsatte-barn-og-unge-i-Oslo.html", 
"Rapporter/AA-leve-med-epilepsi.html", 
"Rapporter/og-imens-gaar-tida.-Barnevern-barnehage-og-kontantstoette.html", 
"Rapporter/Midt-i-mellom.-Drikker-12-aaringer-i-Baerum.html", 
"Rapporter/Skeive-dager-2003-en-rusundersoekelse.html", 
"Rapporter/Ansvarsfordeling-til-barns-beste.html", 
"Rapporter/Et-prosjekt-som-protesje.html", 
"Rapporter/Hinderloeype.html", 
"Rapporter/Mestring-og-tilkortkomming-i-skolen.html", 
"Rapporter/Vold-mot-lesbiske-og-homofile-tenaaringer.html", 
"Rapporter/Bytte-kjaerlighet-overgrep.html", 
"Rapporter/Funksjonsnedsettelse-oppvekst-og-habilitering.html", 
"Rapporter/Oppvekst-og-rusmiddelbruk-i-Furuset-bydel.html", 
"Rapporter/Antisosial-atferd-i-ungdomstiden.html", 
"Rapporter/Andre-lands-modeller-for-aa-fremme-sysselsetting-blant-personer-med-nedsatt-funksjonsevne.html", 
"Rapporter/Kartlegging-av-alvorlig-kombinert-sansetap-hos-eldre.html", 
"Rapporter/Ungdomstid-i-Fredrikstad.html", 
"Rapporter/Ungdomsskoleelever-i-Randaberg-kommune.html", 
"Rapporter/Lesbiskes-psykiske-helse.html", 
"Rapporter/Intensjonsavtalen-om-et-inkluderende-arbeidsliv-i-praksis.html", 
"Rapporter/Smaabarnsforeldres-yrkesdeltakelse-og-valg-av-barnetilsyn-foer-og-etter-kontantstoettens-innfoering.html", 
"Rapporter/Risikoutvikling-Tilknytning-omsorgssvikt-og-forebygging.html", 
"Rapporter/Virker-arbeidslinja-paa-de-langtidssykmeldte.html", 
"Rapporter/Graasonen-mellom-trygdeetat-og-arbeidsmarkedsetat.html", 
"Rapporter/Idrett-kjoenn-kropp-og-kultur.html", 
"Rapporter/Forskning-om-smaabarnsforeldres-dagligliv.html", 
"Rapporter/Eldreombud-og-omsorgsombud-i-kommuner.html", 
"Rapporter/Roeykeloven-og-gjester-ved-brune-serveringssteder.html", 
"Rapporter/Forlatte-barn-ankerbarn-betrodde-barn.html", 
"Rapporter/Ungdoms-digitale-hverdag.html", 
"Rapporter/En-normal-barndom.html", 
"Rapporter/AA-ha-aa-delta-aa-vaere-en-av-gjengen.html", 
"Rapporter/The-Baltic-Sea-Regional-Study-on-Adolescents-Sexuality.html", 
"Rapporter/Ungdomsundersoekelsen-i-Stavanger-2002.html", 
"Rapporter/Forskningskunnskap-om-ettervern.html", 
"Rapporter/Uskyldig-moro.html", 
"Rapporter/Husholdningenes-betalingspraksis.html", 
"Rapporter/AA-betale-for-sent.html", 
"Rapporter/Paa-rett-kjoel.-Ullersmoprosjektet-1992-1996.html", 
"Rapporter/Hjemmehjelp-brukere-og-kvalitet.html", 
"Rapporter/Evaluering-av-prosjektet-Sammen-for-barn-og-unge-bedre-samordning-av-tjenester-til-utsatte-barn-og-unge.html", 
"Rapporter/Risk-and-welfare.html", 
"Rapporter/En-digital-barndom.html", 
"Rapporter/Omsorgstjenester-til-personer-med-etnisk-minoritetsbakgrunn.html", 
"Rapporter/Brukerperspektiv-paa-skolen.html", 
"Rapporter/Evaluering-av-Prosjekt-rovdyrkunnskap-i-Stor-Elvdal-kommune.html", 
"Rapporter/Ung-i-Loerenskog-2009.html", 
"Rapporter/Organisering-for-velferd.html", 
"Rapporter/Seksuelle-krenkelser-via-nettet-hvor-stort-er-problemet.html", 
"Rapporter/Ungdom-som-lever-med-PC.html", 
"Rapporter/Natalie-Rogoff-Ramsoey.-En-pioner-i-norsk-og-internasjonal-sosiologi.html", 
"Rapporter/Helse-familie-og-omsorg-over-livsloepet.html", 
"Rapporter/A-Community-of-Differences.html", 
"Rapporter/Dette-er-jo-bare-en-husmorjobb.html", 
"Rapporter/Tid-for-troest.html", 
"Rapporter/Mindre-kjoennsulikheter-i-helse.html", 
"Rapporter/Familiefase-og-hverdagsliv.html", 
"Rapporter/Ung-i-Maalselv.html", 
"Rapporter/Kontantstoetteordningens-konsekvenser-for-barnehagesektoren.html", 
"Rapporter/Jo-mere-vi-er-sammen.html", 
"Rapporter/Levekaar-og-livskvalitet-blant-lesbiske-kvinner-og-homofile-menn.html", 
"Rapporter/Hva-er-nok.html", 
"Rapporter/Ungt-engasjement.html", 
"Rapporter/Institusjonsplassering-siste-utvei.html", 
"Rapporter/Family-Ideology-and-Social-Policy.html", 
"Rapporter/Boforhold-for-pensjonister-med-bostoette.html", 
"Rapporter/Oppvekst-i-Skien.html", 
"Rapporter/Barnehagen-fra-selektivt-til-universelt-velferdsgode.html", 
"Rapporter/Loeysingsfokusert-samtaleteknikk-LOEFT-i-fritidsklubber.html", 
"Rapporter/Ung-i-Notodden.html", 
"Rapporter/Sickness-Absence.html", 
"Rapporter/Fra-tradisjonell-regelforvaltning-til-effektiv-tjenesteproduksjon.html", 
"Rapporter/Bedre-tid.html", 
"Rapporter/Endringer-for-seniorer-i-arbeidslivet-fra-2003-til-2008.html", 
"Rapporter/Barn-med-varig-sykdom-og-funksjonshemning.html", 
"Rapporter/Arbeidstid-i-barneverninstitusjonene-og-behandlingstiltaket-MST.html", 
"Rapporter/REBUS-kommunedata-3.0.-Veileder-og-dokumentasjon.html", 
"Rapporter/Vold-og-overgrep-mot-barn-og-unge.html", 
"Rapporter/Kommunikasjon-ved-demens-en-arena-for-samarbeid.html", 
"Rapporter/Minoritetsperspektiver-paa-norsk-familievern.html", 
"Rapporter/Effects-of-Changing-Government-Policies-on-Sickness-Absence-Behaviour.html", 
"Rapporter/Gratis-barnehage-for-alle-femaaringer-i-bydel-Gamle-Oslo.html", 
"Rapporter/Ungdomsskoleelever.-Motivasjon-mestring-og-resultater.html", 
"Rapporter/Veien-til-makta-og-det-gode-liv.html", 
"Rapporter/Regionalisering-av-trygdetjenester-erfaringer-hos-brukere-og-ansatte.html", 
"Rapporter/Ung-i-Frogn.html", 
"Rapporter/Skal-jeg-bli-eller-skal-jeg-gaa.html", 
"Rapporter/Har-barnet-mitt-vaert-utsatt-for-seksuelle-overgrep.html", 
"Rapporter/Makt-og-avmakt-i-helse-og-omsorgstjenestene.html", 
"Rapporter/Youth-Unemployment-and-Marginalisation-in-Northern-Europe.html", 
"Rapporter/Det-skal-ikke-staa-paa-viljen-utdanningsplaner-og-yrkesoensker-blant-Osloungdom-med-innvandrerbakgrunn.html", 
"Rapporter/Education-and-Civic-Engagement-among-Norwegian-Youths.html", 
"Rapporter/Kvalitet-og-kvantitet.html", 
"Rapporter/Ung-i-Oslo.html", 
"Rapporter/Barns-levekaar.html", 
"Rapporter/Innvandrerkvinner-i-Groruddalen.html", 
"Rapporter/Barnevernsklienter-i-Norge-1990-2005.html", 
"Rapporter/Ung-i-Stavanger-2010.html", 
"Rapporter/Bolig-og-dagligliv-i-eldre-aar.html", 
"Rapporter/Innvandrerungdom-kultur-identitet-og-marginalisering.html", 
"Rapporter/Gjensidig-trivsel-glede-og-laering.html", 
"Rapporter/Unemployment-in-a-Segmented-Labour-Market.html", 
"Rapporter/Likestillingsprosjektets-barn.html", 
"Rapporter/Verdighetsforvaltning-i-liv-paa-grensen.html", 
"Rapporter/Ungdomstid-i-storbyen.html", 
"Rapporter/Barn-og-unges-levekaar-og-velferd.html", 
"Rapporter/Gutter-og-jenter-i-Asker-og-Baerum.-Ungdomsundersoekelsen-1996.html", 
"Rapporter/Eldresenteret-naa-og-framover.html", 
"Rapporter/Teenagers-become-pensioners.html", 
"Rapporter/Siste-skanse.html", 
"Rapporter/Omsorgstjenester-med-mangfold.html", 
"Rapporter/Valgmuligheter-i-ungdomsskolen.html", 
"Rapporter/Children-and-young-people-report-to-the-UN-on-their-rights.html", 
"Rapporter/Eldre-innvandrere-og-organisasjoner.html", 
"Rapporter/Sosial-kapital-og-andre-kapitaler-hos-barn-og-unge-i-Norge.html", 
"Rapporter/Paa-egne-ben.html", 
"Rapporter/Ungdom-og-rusmidler-paa-Nordstrand.html", 
"Rapporter/Kontantstoetteordningens-effekter-for-barnetilsyn-og-yrkesdeltakelse.html", 
"Rapporter/Ageing-intergenerational-relations-care-systems-and-quality-of-life-an-introduction-to-the-OASIS-project.html", 
"Rapporter/Forebygging-av-problematferd-blant-ungdom.html", 
"Rapporter/Alkoholforebygging-fra-ung-til-ung.html", 
"Rapporter/Minstepensjon-og-minstepensjonister.html", 
"Rapporter/Motstand-og-mestring.-Om-funksjonshemning-og-livsvilkaar.html", 
"Rapporter/Dealing-with-Difference-Two-classrooms-two-countries.html", 
"Rapporter/Den-komplekse-virkelighet.html", 
"Rapporter/Barn-og-unge-med-alvorlige-atferdsvansker.-Hvem-er-de-og-hvilken-hjelp-blir-de-tilbudt.html", 
"Rapporter/Avgangsalder-og-pensjoneringsmoenster-i-staten.html", 
"Rapporter/Ut-av-arbeidslivet-livsloep-mestring-og-identitet.html", 
"Rapporter/Osloungdom-og-rusmiddelbruk.html", 
"Rapporter/Vi-spiller-paa-lag.html", 
"Rapporter/Homo-Betydningen-av-seksuell-erfaring-tiltrekning-og-identitet-for-selvmordsforsoek-og-rusmiddelbruk-blant-ungdom.html", 
"Rapporter/Rett-fra-pikerommet-med-ransel-paa-ryggen.html", 
"Rapporter/Perspektiver-paa-enslige-forsoergere.html", 
"Rapporter/Biologisk-mangfold-som-politikk.html", 
"Rapporter/Barneverntjenestens-haandtering-av-saker-med-vold-og-seksuelle-overgrep.html", 
"Rapporter/Barn-og-unge-rapporterer-til-FN-om-rettighetene-sine.html", 
"Rapporter/Fra-samvaer-til-sjoelutvikling.html", 
"Rapporter/Laeringsmiljoe-og-pedagogisk-analyse.html", 
"Rapporter/15-aaringer-hvem-drikker.html", 
"Rapporter/Cultures-and-Natures.html", 
"Rapporter/Smaa-barns-hverdager-i-asylmottak.html", 
"Rapporter/Naar-hjemme-er-et-annet-sted.html", 
"Rapporter/Makt-og-avmakt-i-samarbeidet-mellom-hjem-og-skole.html", 
"Rapporter/Flytting-i-nytt-land.html", 
"Rapporter/Morgendagens-eldre.html", 
"Rapporter/Ny-start-med-Ny-GIV.html", 
"Rapporter/Levekaar-og-livskvalitet-hos-ufoerepensjonister-og-mottakere-av-avtalefestet-pensjon.html", 
"Rapporter/Kommunenes-bruk-av-omsorgsloenn.html", 
"Rapporter/Rettferdiggjoering-av-omsorgsovertakelse.html", 
"Rapporter/Tatere-og-Misjonen.-Mangfold-makt-og-motstand.html", 
"Rapporter/Bolig-og-levekaar-i-Norge-2004.html"];

var skriftserie = ["Skriftserie/Commitment-to-welfare-a-question-of-trust.html", 
"Skriftserie/Om-klager-paa-kommunen.html", 
"Skriftserie/Unge-ufoeres-avgang-fra-arbeidslivet.html", 
"Skriftserie/Etablering-generasjonsulikhet-og-generasjonsoverfoeringer-i-boligsektoren.html", 
"Skriftserie/Det-kommunale-leiemarkedet.html", 
"Skriftserie/Statens-og-Husbankens-rolle-i-en-markedsbasert-boligsektor.html", 
"Skriftserie/Two-technical-choices-with-critical-implications.html", 
"Skriftserie/Juvenile-Delinquency-in-Norway.html", 
"Skriftserie/Meaning-of-intergenerational-relations.html", 
"Skriftserie/Forebygging-av-bruk-av-fysisk-straff-i-oppdragelsen-Nett-og-telefontjenester.html", 
"Skriftserie/Pensjonister-i-arbeid.html", 
"Skriftserie/Gjeld-og-oekte-rentekostnader.html", 
"Skriftserie/Nordiske-surveyundersoekelser-av-barn-og-unges-levekaar-1970-2002.html", 
"Skriftserie/Opinionens-forventninger-til-velferdsstaten.html", 
"Skriftserie/Om-fattigdomsbegrepet-og-dets-implikasjoner-for-praktisk-politikk.html", 
"Skriftserie/Full-dekning-ogsaa-av-foerskolelaerere.html", 
"Skriftserie/Er-den-norske-opinionen-en-bremsekloss-mot-velferdspolitiske-reformer.html", 
"Skriftserie/Somaliere-i-eksil-i-Norge.html", 
"Skriftserie/Children-s-Right-Father-s-Duty-Mothers-Responsibility.html", 
"Skriftserie/Hva-kan-vi-laere-av-Danmark.html", 
"Skriftserie/Opplevelse.html", 
"Skriftserie/Recent-Developments-in-the-Norwegian-Health-Care-System-Pointing-in-What-Direction.html", 
"Skriftserie/Klage-over-ikke-aa-faa-nesten-universelle-goder.html", 
"Skriftserie/Regnbueprosjektet-en-evaluering.html", 
"Skriftserie/Penger-er-ikke-alt.html", 
"Skriftserie/Diskriminering-en-litteraturgjennomgang.html", 
"Skriftserie/Boligetablering-dokumentavgift-og-boligsparing-for-unge.html", 
"Skriftserie/Tilleggsrapport-Ung-i-Notodden.html", 
"Skriftserie/Tilrettelagte-boliger-omsorgsboliger.html", 
"Skriftserie/Ungdom-og-idrett-i-et-flerkulturelt-samfunn.html", 
"Skriftserie/Personer-som-begaar-seksuelle-overgrep-mot-barn.html", 
"Skriftserie/Preretirement-in-the-Nordic-countries-in-an-European-context.html", 
"Skriftserie/The-changing-balance-between-incentives-and-economic-security-in-the-Nordic-unemployment-benefit-schemes.html", 
"Skriftserie/Hjelp-til-barn-som-har-foreldre-med-psykiske-lidelser.html", 
"Skriftserie/Implementering-av-Nettungen.html", 
"Skriftserie/Livsform-livsloep-og-livstema-som-anvendte-forskningsbegreper.html", 
"Skriftserie/Transfers-and-Maintenance-Responsibility.html", 
"Skriftserie/The-Child-Home-Care-allowance-and-women-s-labour-force-participation-in-Finland-1985-1998.html", 
"Skriftserie/Noen-trekk-ved-barnevernets-utvikling-mellom-1954-og-1980.html", 
"Skriftserie/Old-age-is-not-for-sissies.html", 
"Skriftserie/Diabetes-og-livskvalitet.html", 
"Skriftserie/Samarbeid-mellom-hjem-og-skole-om-barn-med-funksjonshemninger.html", 
"Skriftserie/Social-protection-for-the-elderly-in-Norway.html", 
"Skriftserie/Early-retirement-and-social-citizenship.html", 
"Skriftserie/Familieraadslag.html", 
"Skriftserie/Gatemeglingsprosjektet-i-Oslo-Roede-Kors.html", 
"Skriftserie/Minstepensjonisten-rik-eller-fattig.html", 
"Skriftserie/Husholdningenes-boligfinansiering.html", 
"Skriftserie/Tilbudet-av-leide-boliger.html", 
"Skriftserie/Et-barnevern-med-lydhoerhet-for-barnet.html", 
"Skriftserie/Diskrimineringsproblematikk-og-offentlige-tiltak.html", 
"Skriftserie/Om-oekonomisk-verdsetting-av-ubetalt-arbeid.html", 
"Skriftserie/Bruk-av-khat-i-Norge.html", 
"Skriftserie/Globalisation-the-World-Bank-and-the-New-Welfare-State.html", 
"Skriftserie/Wealth-Distribution-between-Generations.html", 
"Skriftserie/De-frivillige-organisasjonenes-rolle-i-aktivisering-og-arbeidstrening-av-personer-med-marginal-eller-ingen-tilknytning-til-arbeidsmarkedet.html", 
"Skriftserie/Nordisk-barnevern-Likheter-i-lovgivning-forskjeller-i-praksis.html", 
"Skriftserie/Registerdatabase-for-forskning-om-boligspoersmaal.html", 
"Skriftserie/Parents-between-work-and-care.html", 
"Skriftserie/Barn-som-blir-plassert-utenfor-hjemmet-risiko-og-utvikling.html", 
"Skriftserie/Forskning-om-vanskeligstilte-paa-boligmarkedet.html", 
"Skriftserie/Lesbiske-og-homofile-arbeidstakere-en-pilotundersoekelse.html", 
"Skriftserie/Studying-Culture-through-Surveys-Getting-Thick-Descriptions-out-of-Paper-thin-Data.html", 
"Skriftserie/Moedre-med-barn-i-kontantstoettealder.html", 
"Skriftserie/Epilepsi-og-diabetes.html", 
"Skriftserie/Vurderingsgrunnlaget-i-alvorlige-barnevernssaker.html", 
"Skriftserie/Naar-rehabiliteringspengene-avsluttes.html", 
"Skriftserie/Life-course-Perspectives-in-Aging-Research.html", 
"Skriftserie/Barns-levekaar.-Teoretiske-perspektiver-paa-familieoekonomiens-betydning-for-barns-hverdag.html", 
"Skriftserie/Se-der-hacker-bestefar-eller-bestemor-paa-anbud.html", 
"Skriftserie/Spania-for-helsens-skyld.html", 
"Skriftserie/Hverdagslivets-sosiologi-i-norsk-tradisjon.html", 
"Skriftserie/Trygdefinansierte-kjoeretoey-for-funksjonshemmede.html", 
"Skriftserie/Evaluering-av-Foreldretelefonen.html"];

var temahefte = ["Temahefte/Ungdomskulturer-og-narkotikabruk.html", 
"Temahefte/Foreldrestoettende-tilbud-i-kommunene.html", 
"Temahefte/Dokumentasjon-Ung-i-Oslo-2006.html", 
"Temahefte/Forebyggende-arbeid-og-hjelpetiltak-i-barneverntjenesten.html", 
"Temahefte/Veiledning-og-veiledningsmodeller-i-barnevernets-foerstelinjetjeneste.html", 
"Temahefte/Naturen-i-Stor-Elvdal-ulven-og-det-sosiale-landskapet.html", 
"Temahefte/Fra-ide-til-virkelighet.-En-modell-for-koordinering-og-drift-av-det-forebyggende-barne-og-ungdomsarbeidet.html", 
"Temahefte/Kvalitetssatsing-i-norske-barnehager.html", 
"Temahefte/Hvordan-maalene-ble-naadd.html", 
"Temahefte/En-skandinavisk-boligmodell.html"];

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
            var delay_in_ms = 5000;
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
                    statusEl.innerHTML = statusEl.innerHTML + "success! " + return_data;
                } else {
                    statusEl.style.color = "red";
                    statusEl.innerHTLM = statusEl.innerHTML + "failure! " + return_data;
                }
                closePage();
            };
            xhr.send(post_data);
        	statusEl.innerHTML = statusEl.innerHTML + "</br>posted data: </br>" + post_data + "</br>";
        }
        
        // send the data to php now and wait for response to update the status div.
        
        var statusEl = document.createElement("aside");
        statusEl.id = "statusEl";
        statusEl.innerHTML="processing XHR...</br>";
        statusEl.style.cssText="position:fixed; top:0; right:0; bottom:0; width: 33%; margin-top: 3em; margin-bottom: 3em; opacity: 0.7; border: 3px solid red; color: black; background-color: #dddddd; font-family: sans-serif; white-space: pre; padding: 0.5em; font-size: 1.5em;";
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