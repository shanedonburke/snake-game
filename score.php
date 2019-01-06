<!DOCTYPE html>
<html>
<body>

<?php
// Add name and score to scoreboard if name has been entered
if (isset($_GET['name'])) {
	// Get name and score
	$name = $_GET['name'];
	$score = $_GET['score'];
	// Load scoreboard file
	$file = 'score.txt';
	$current = file_get_contents($file);
	// Append name and score to scoreboard. Create equal spacing for all scores
	if ($score > 999) {
		$current .= '       ' . $score . '              ' . $name . "\n";
	} else if ($score > 99) {
		$current .= '       ' . $score . '               ' . $name . "\n";
	} else if (score > 9) {
		$current .= '       ' . $score . '               ' . $name . "\n";
	} else {
		$current .= '       ' . $score . '                ' . $name . "\n";
	}
	file_put_contents($file, $current);
	// Sort data (ascending), then reverse to create descending scoreboard
	$data = file($file);
	natsort($data);
	$data = array_reverse($data);
	// Limit scoreboard to 20 entries
	while (count($data) > 20) {
		array_pop($data);
	}
	// Write scoreboard back into file
	file_put_contents($file, implode("\n", $data));
}
?>

<script>
	// Redirect back to game page
	window.location.href = "index.html";
</script>


</body>
</html>
