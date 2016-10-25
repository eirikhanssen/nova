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
	db_json_rows = <?php echo json_encode($rows); ?>;

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

	function display() {
		var container = document.createElement('container');
		var doi_batch = document.createElementNS('http://www.crossref.org/schema/4.3.4', 'doi_batch');
		doi_batch.setAttribute('xmlns:xsi','http://www.w3.org/2001/XMLSchema-instance');
		doi_batch.setAttribute('xmlns:xsd','http://www.w3.org/2001/XMLSchema');
		doi_batch.setAttribute('version','4.3.4');
		doi_batch.setAttribute('xsi:schemaLocation','http://www.crossref.org/schema/4.3.4 http://www.crossref.org/schema/deposit/crossref4.3.4.xsd');
		container.appendChild(doi_batch);
	
		var rows = initializeJsonArray(db_json_rows);
		//rows.forEach(logTitle);

		document.body.appendChild(container);
	}
</script>