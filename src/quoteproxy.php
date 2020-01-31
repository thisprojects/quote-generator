<?php

$response = file_get_contents("http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en");

echo $response;

?>
