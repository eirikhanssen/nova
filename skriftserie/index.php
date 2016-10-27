<?php
require '../db_login.php';
ini_set('default_charset', 'UTF-8');

$conn = new mysqli($db_servername, $db_username, $db_password, $db_database);
	//$json = $conn->real_escape_string($json);
	mysqli_set_charset($conn, 'utf8');
	// check connection
	if($conn->connect_error) {
		die("Connection failed: " .  $conn->connect_error); 
	}

	$sql = "select json from novapub_new where series = 'Skriftserie'";

	$result = $conn->query($sql) or die (mysqli_error());

	$conn->close();

/*
	if($conn->query($sql) === TRUE) {

		echo "</br><strong>Success!</strong></br></br><strong>json data:</strong></br></br>" . $json;
	} else {
		echo "<div style='color:red' class='error'></br><strong>Error!</strong></br></br>" . "<strong>json data:</strong></br></br>" . $json . "</br><strong>sql:</strong></br>" . $sql . "</br></br>" . "<strong>Error:</strong> </br></br>" . $conn->error . "</div>"; 
	}
*/
	
	$rows = array();
	while($row = mysqli_fetch_array($result)) {
		array_push($rows, $row);
	}

	//print_r($rows);



?>

<script>
	var doi_submitter = "Eirik Hanssen";
	var doi_submit_email = "ojs@hioa.no";

	db_json_rows = <?php echo json_encode($rows); ?>;
	
	window.addEventListener('load', init, false);

	function init() {
		console.log('init');
		// change the timeout in ms if needed
		window.setTimeout(function(){display();}, 10);
	}

	function initializeJsonArray(inputArray) {
		var a = [];
		for (var i = 0; i < inputArray.length; i++) {
			a.push(JSON.parse(inputArray[i]['json']));
		}
		return a;
	}

	function logTitle(element, index, array){
		console.log(element.title);
	};

	function pad(num, size) {
		var s = '00' + num;
		return s.substr(s.length-size);
	}

	function currentTimestamp() {
		var d = new Date();
		var timestamp = d.getFullYear().toString() + pad(d.getMonth()+1,2) + pad(d.getDate(),2) + pad(d.getHours(),2) + pad(d.getMinutes(),2) + pad(d.getSeconds(),2);
		return timestamp;
	}

	function display() {
		var rows = initializeJsonArray(db_json_rows);
		console.log(rows.length + " rows in result");
		var ts = currentTimestamp();
		var container = document.createElement('container');
		var ns = "http:/"+"/www.crossref.org/schema/4.3.7";
		var doi_batch = document.createElementNS(ns, 'doi_batch');
		doi_batch.setAttribute('xmlns',ns);
		doi_batch.setAttribute('xmlns:xsi','http:/'+'/www.w3.org/2001/XMLSchema-instance');
		doi_batch.setAttribute('version','4.3.7');
		//doi_batch.setAttribute('xmlns:xsd','http://www.w3.org/2001/XMLSchema');
		doi_batch.setAttribute('xsi:schemaLocation','http:/'+'/www.crossref.org/schema/4.3.7 http:/'+'/www.crossref.org/schema/deposit/crossref4.3.7.xsd');
		container.appendChild(doi_batch);

		
		/*
			==========================================
			 Create Doi Batch Header
			==========================================
		*/
		var head = document.createElementNS(ns,'head');
		var doi_batch_id = document.createElementNS(ns,'doi_batch_id');
		doi_batch_id.innerHTML = "hioa_" + ts;
		var timestamp = document.createElementNS(ns,'timestamp');
		timestamp.innerHTML=ts;
		var depositor = document.createElementNS(ns,'depositor');
		var depositor_name = document.createElementNS(ns,'depositor_name');
		depositor_name.innerHTML = doi_submitter;
		var email_address = document.createElementNS(ns,'email_address');
		email_address.innerHTML = doi_submit_email;
		depositor.appendChild(depositor_name);
		depositor.appendChild(email_address);
		var registrant = document.createElementNS(ns,'registrant');
		registrant.innerHTML = "HiOA";

		head.appendChild(doi_batch_id);
		head.appendChild(timestamp);
		head.appendChild(depositor);
		head.appendChild(registrant);


		/*
			==========================================
			 Create Doi Batch Body
			==========================================
		*/
			// get a person_name
			function getPublisherInfo(row) {
				/*
NOVA changed name sometime in 2014.

Skriftserie (tom 2007), publisher:
Norsk institutt for forskning om oppvekst,
velferd og aldring (NOVA)

Notat tom: Notat 2/2014:
Norsk institutt for forskning om
oppvekst, velferd og aldring (NOVA)

Notat fom: Notat 3/14
Velferdsforskningsinstituttet NOVA

Rapport tom: Rapport 13/2014
Norsk institutt for forskning om
oppvekst, velferd og aldring (NOVA)

Rapport fom: Rapport 14/2014
Velferdsforskningsinstituttet NOVA

Temahefte (eldre enn 2014):
Norsk institutt for forskning om
oppvekst, velferd og aldring (NOVA)*/

			var pre2014NovaPubName = "Norsk institutt for forskning om oppvekst, velferd og aldring (NOVA)";
			var new2014NovaPubName = "Velferdsforskningsinstituttet NOVA";
			var publisherName = new2014NovaPubName;
			var publisher = document.createElementNS(ns, 'publisher');
			var publisher_name = document.createElementNS(ns, 'publisher_name');
			var publisher_place = document.createElementNS(ns, 'publisher_place');
			
			publisher_place.innerHTML = "Oslo";
			if(row.year < 2014) {
				publisherName = pre2014NovaPubName;
			} else if (row.year == 2014) {
				if(row.series == "Notat") {
					// Notat 1/14 and Notat 2/14 uses pre2014NovaPubName
					if(row.publisherItem.match(/Notat\s+[1-2][/]\d+/g) !== null) {
						publisherName = pre2014NovaPubName;
					}
				} else if (row.series == "Rapport") {
					// Rapport 1/14...Rapport 13/14 uses pre2014NovaPubName
					if (row.publisherItem.match(/Rapport\s+\d[0-3]?[/]\d+/g) !== null) {
						publisherName = pre2014NovaPubName;
					}
				}
			}
			publisher_name.innerHTML = publisherName;
			publisher.appendChild(publisher_name);
			publisher.appendChild(publisher_place);
			return publisher;
			}
	
			function getCurrentPersonName(person,seq) {
				var role = "author";
				person_name = document.createElementNS(ns, 'person_name');
				if(person.role === "editor") {
					role = "editor";
				}
				person_name.setAttribute("contributor_role",role);
				person_name.setAttribute("sequence",seq);

				given_name = document.createElementNS(ns, 'given_name');
				surname = document.createElementNS(ns, 'surname');

				given_name.innerHTML = person.fn;
				surname.innerHTML = person.ln;

				person_name.appendChild(given_name);
				person_name.appendChild(surname);

				return person_name;
				
			}


			// get all contributors
			function getContributors(current_row) {
			// contributors
			// what about editors!! currently no editors in json! FIXME!!
			var contributors = document.createElementNS(ns, 'contributors');
			for(var k = 0; k < current_row.authors.length; k++) {
				var seq = "first";
				if (k>0) {
					seq = "additional";
				}
				contributors.appendChild(getCurrentPersonName(current_row.authors[k], seq));

				}
				return contributors;

			}

		function getTitles(row) {
			var titles = document.createElementNS(ns, 'titles');
			var title = document.createElementNS(ns, 'title');
			title.innerHTML = row.title;
			titles.appendChild(title);

			// check if subtitle is present and not empty string
			if(row.subtitle !== undefined && row.subtitle !== "") {
				var subtitle = document.createElementNS(ns, 'subtitle');
				subtitle.innerHTML = row.subtitle;
				titles.appendChild(subtitle);
			}
			return titles;
		}

		function getSeriesTitles(row) {
			var series = row.series;
			var series_title = "";
			switch (series) {
				case "Skriftserie":
				series_title = "NOVA Skriftserie";
				break;
				case "Notat":
				series_title = "NOVA Notat";
				break;
				case "Rapporter":
				series_title = "NOVA Rapport";
				break;
				case "Temahefte":
				series_title = "Temahefte";
				break;
			}

			//WIP!
			var titles = document.createElementNS(ns, 'titles');
			var title = document.createElementNS(ns, 'title');
			title.innerHTML = series_title;
			titles.appendChild(title);
			return titles;
		}

		function getSeriesMetadata(row){
			var series_metadata = document.createElementNS(ns, 'series_metadata');
			series_metadata.appendChild(getSeriesTitles(row));
			var issn = document.createElementNS(ns, 'issn');
			issn.innerHTML = row.issn;
			series_metadata.appendChild(issn);
			return series_metadata;
		}

		function getMediaType(row) {
			// TODO this one needs to be either online or print, but how to decide?
			
			if (row.series == "Skriftserie") {
				return "print";
			} else {
				return "online";
			}
		}

		function getPubDate(row) {
			var publication_date = document.createElementNS(ns, 'publication_date');
			publication_date.setAttribute("media_type",getMediaType(row));
			var year = document.createElementNS(ns, 'year');
			year.innerHTML = row.year;
			publication_date.appendChild(year);
			return publication_date;
		}

		function getIssueFromPublisherItem(row) {
			return row.publisherItem.replace(/[^0-9]+(\d+)[/]\d+/,"$1") || "00";
		}

		function genDOIfromJSON(row) {
			var doi_base = "10.7577/nova/";
			var series = row.series.toLocaleLowerCase();
			var year = row.year;
			var issue_in_publisherItem = getIssueFromPublisherItem(row);
			var doi = doi_base + series + "/" + year + "/" + issue_in_publisherItem;
			return doi;
		}

		function genResourceFromJSON(row) {
			var series = "";
			switch (row.series) {
				case "Skriftserie":
					series="skriftserie";
				break;
				case "Notat":
					series="notat";
				break;
				case "Rapport":
					series="rapport";
				break;
				case "Temahefte":
					series="temahefte";
				break;
				default:
					series="unknownSeries"; 
				break;
			}
	
			var url_base = "http:/" + "/www.hioa.no/Om-HiOA/Senter-for-velferds-og-arbeidslivsforskning/NOVA/Publikasjonar/";
			var series_url_fragment = row.series;
			if(series_url_fragment == "Skriftserie") {
				series_url_fragment = "NOVAs-skriftserie";
			}
			series_url_fragment = series_url_fragment + "/";
			var year_fragment = row.year + "/";
			var filename = row.filename || "unknown-file";
			var resource_url = url_base + series_url_fragment + "/"; 
			if(series_url_fragment == "Temahefte") {
				year_fragment = "";
			}
			var resource_url =  url_base + series_url_fragment + year_fragment + filename; 
			
			return resource_url;
		}

		function getDoiData(row) {
			var doi_data = document.createElementNS(ns, 'doi_data');
			var doi = document.createElementNS(ns, 'doi');
			var resource = document.createElementNS(ns, 'resource');
			doi.innerHTML = genDOIfromJSON(row);
			resource.innerHTML = genResourceFromJSON(row);
			doi_data.appendChild(doi);
			doi_data.appendChild(resource);

			return doi_data;
		}

		function reportPaperFromJSON(row){
			//console.log(row);

			var report_paper = document.createElementNS(ns, 'report-paper');
			
			var report_paper_series_metadata = document.createElementNS(ns, 'report-paper_series_metadata');
			report_paper_series_metadata.setAttribute("language", "no");

			report_paper_series_metadata.appendChild(getSeriesMetadata(row));

			report_paper_series_metadata.appendChild(getContributors(row));

			report_paper_series_metadata.appendChild(getTitles(row));

			report_paper_series_metadata.appendChild(getPubDate(row));

			report_paper_series_metadata.appendChild(getPublisherInfo(row));

			report_paper_series_metadata.appendChild(getDoiData(row));

			report_paper.appendChild(report_paper_series_metadata);

			return report_paper;
		}

		var doi_batch_body = document.createElementNS(ns,'body');
		
		for(var j = 0; j< rows.length; j++) {
			doi_batch_body.appendChild(reportPaperFromJSON(rows[j]));
		}

		

		/*rows.forEach(function(){
			//doi_batch_body.appendChild(reportPaperFromJSON());
			reportPaperFromJSON();
		});*/


		/*
			==========================================
			 Finalize Doi Batch
			==========================================
		*/

		doi_batch.appendChild(head);
		doi_batch.appendChild(doi_batch_body);


		// why is this line here?
		var rows = initializeJsonArray(db_json_rows);
		//rows.forEach(logTitle);

		document.body.appendChild(container);
	}
</script>
