var vid = document.getElementById("bgvid");
var pauseButton = document.querySelector("#polina button");
var enterButton = document.querySelector("#polina #enter");

function vidFade() {
	vid.classList.add("stopfade");
}

vid.addEventListener('ended', function() {
	// only functional if "loop" is removed
	vid.pause();
	// to capture IE10
	vidFade();
});

pauseButton.addEventListener("click", function() {
	vid.classList.toggle("stopfade");
	if (vid.paused) {
		vid.play();
		pauseButton.innerHTML = "Pause";
	} else {
		vid.pause();
		pauseButton.innerHTML = "Paused";
	}
})

enterButton.addEventListener("click", function() {
	vid.classList.toggle("stopfade");
	vid.pause();
	window.location.href = "main_guest.html";

})
