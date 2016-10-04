<?php 
require 'db_login.php';
ini_set('default_charset', 'UTF-8');
	
	$year = $_POST['year'];
	$series = $_POST['series'];
	$publisherItem = $_POST['publisherItem'];
	$filename = $_POST['filename'];
	$title = $_POST['title'];
	$subtitle = $_POST['subtitle'];
	$len = $_POST['len'];
	$issn = $_POST['issn'];
	$isbn = $_POST['isbn'];
	$json = $_POST['json_data'];
	
	/*echo "<p>Received data from " . $site_url . "</p>";
	echo "<p>Received data: </p>";
	echo "<pre>" . $json_data . "</pre>";
	echo "<p>Trying to store data...</p>";*/
	// create connection
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_database);
	$json = $conn->real_escape_string($json);
	mysqli_set_charset($conn, 'utf8');
	// check connection
	if($conn->connect_error) {
		die("Connection failed: " .  $conn->connect_error); 
	}

	$sql = "INSERT INTO $db_table (year, series, publisherItem, filename, title, subtitle, len, issn, isbn, json)";
	$sql .= "VALUES ('$year', '$series', '$publisherItem', '$filename', '$title', '$subtitle' ,'$len', '$issn','$isbn' ,'$json');";



	if($conn->query($sql) === TRUE) {
		echo "</br><strong>Success!</strong></br></br><strong>json data:</strong></br></br>" . $json;
	} else {
		echo "<div style='color:red' class='error'></br><strong>Error!</strong></br></br>" . "<strong>json data:</strong></br></br>" . $json . "</br><strong>sql:</strong></br>" . $sql . "</br></br>" . "<strong>Error:</strong> </br></br>" . $conn->error . "</div>"; 
	}

	$conn->close();
?>