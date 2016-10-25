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
		window.setTimeout(function(){display();}, 1);
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
		var ts = currentTimestamp();
		var container = document.createElement('container');
		var ns = "http://www.crossref.org/schema/4.3.4";
		var doi_batch = document.createElementNS(ns, 'doi_batch');
		doi_batch.setAttribute('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');
		doi_batch.setAttribute('xmlns:xsd','http://www.w3.org/2001/XMLSchema');
		doi_batch.setAttribute('version','4.3.4');
		doi_batch.setAttribute('xsi:schemaLocation','http://www.crossref.org/schema/4.3.4 http://www.crossref.org/schema/deposit/crossref4.3.4.xsd');
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

		doi_batch.appendChild(head);
	
		var rows = initializeJsonArray(db_json_rows);
		//rows.forEach(logTitle);

		document.body.appendChild(container);
	}
</script>