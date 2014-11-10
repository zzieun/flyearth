/**
 * 
 */
function initialize() {
        var options = {
          sky: true,
          atmosphere: true,
          dragging: false,
          tilting: false,
          zooming: false,
          center: [46.8011, 8.2266],
          zoom: 1
        };
     // Start a simple rotation animation
		setInterval(function() {
			var c = earth.getPosition();
			earth.setCenter([ c[0], c[1] + 0.1 ]);
		}, 30);
        earth = new WE.map('earth_div', options);
        var natural = WE.tileLayer('http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg', {
          tileSize: 256,
          tms: true
        });
        natural.addTo(earth);

        var toner = WE.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: ' ',
          opacity: 0.6
        });
        
        toner.addTo(earth);
      }