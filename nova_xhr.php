<?php 
require 'db_login.php';
ini_set('default_charset', 'UTF-8');
	
	$filename = $_POST['filename'];
	$series = $_POST['series'];
	$json_data = $_POST['json_data'];
	$len = $_POST['len'];
	$year = $_POST['year'];

	/*echo "<p>Received data from " . $site_url . "</p>";
	echo "<p>Received data: </p>";
	echo "<pre>" . $json_data . "</pre>";
	echo "<p>Trying to store data...</p>";*/
	// create connection
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_database);
	$json_data = $conn->real_escape_string($json_data);
	mysqli_set_charset($conn, 'utf8');
	// check connection
	if($conn->connect_error) {
		die("Connection failed: " .  $conn->connect_error); 
	}

	$sql = "INSERT INTO $db_table (filename, series, len, JSON, year)";
	$sql .= "VALUES ('$filename', '$series', '$len', '$json_data', '$year');";



	if($conn->query($sql) === TRUE) {
		echo "</br><strong>Success!</strong></br></br><strong>json data:</strong></br></br>" . $json_data;
	} else {
		echo "<div style='color:red' class='error'></br><strong>Error!</strong></br></br>" . "<strong>json data:</strong></br></br>" . $json_data . "</br><strong>sql:</strong></br>" . $sql . "</br></br>" . "<strong>Error:</strong> </br></br>" . $conn->error . "</div>"; 
	}

	$conn->close();
?>