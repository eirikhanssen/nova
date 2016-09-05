<?php 
require 'db_login.php';

	$site_url = $_POST['site_url'];
	$json_data = $_POST['json_data'];
	/*echo "<p>Received data from " . $site_url . "</p>";
	echo "<p>Received data: </p>";
	echo "<pre>" . $json_data . "</pre>";
	echo "<p>Trying to store data...</p>";*/
	// create connection
	$conn = new mysqli($db_servername, $db_username, $db_password, $db_database);
	// check connection
	if($conn->connect_error) {
		die("Connection failed: " .  $conn->connect_error); 
	}

	$sql = "INSERT INTO jsons (url, json)";
	$sql .= "VALUES ('$site_url', '$json_data');";

	if($conn->multi_query($sql) === TRUE) {
		echo "Success!";
	} else {
		echo "Error! </br>" . $sql . "</br>" . $conn->error;
	}

	$conn->close();
?>