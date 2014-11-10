var refreshIntervalId;

var mainuser_app = angular.module("mainUserEarth", [ 'ui.bootstrap' ]);
var entryPanoId = null;
var streetview = false;

var panorama;
var marker3;
var postArr;

mainuser_app
		.controller(
				"main_user_controller",

				function($scope, $http, $location, $window) {
					$scope.is_first_access = true;
					$scope.stop_flag = false;
					$scope.ispicivew_open = false;
					// var earth = new WE.map('earth_div');
					var options = {
						sky : true,
						atmosphere : true,
						dragging : true,
						tilting : true,
						zooming : true,
						center : [ 46.8011, 8.2266 ],
						zoom : 2
					};

					$scope.getid = getURLParameter('user_id');
					function getURLParameter(name) {
						return decodeURIComponent((new RegExp('[?|&]' + name
								+ '=' + '([^&;]+?)(&|#|;|$)')
								.exec(location.search) || [ , "" ])[1].replace(
								/\+/g, '%20'))
								|| null
					}

					$http.post("/user_info", {
						'id_user' : $scope.getid

					}).success(function(response) {
						console.log(response);
						$scope.user_email = response[0].email_id;
						$scope.user_name = response[0].name;
					});
					$scope.go_wirtediary = function() {
						$window.location.href = "write_diary.html?user_id="
								+ encodeURIComponent($scope.getid);

					}

					$http.post("/travel_list", {
						'user_id' : $scope.getid

					}).success(function(response) {
						console.log(response);
						$scope.postArr = response;
						$scope.setmarker_addarr($scope.postArr);
						postArr = $scope.postArr;
					});

					// -----------Start a simple rotation animation
					refreshIntervalId = setInterval(function() {
						$scope.stop_flag = false;
						var c = $scope.earth.getPosition();
						$scope.earth.setCenter([ c[0], c[1] + 0.1 ]);
					}, 30);

					$scope.earth = new WE.map('earth_div', options);
					var natural = WE
							.tileLayer(
									'http://data.webglearth.com/natural-earth-color/{z}/{x}/{y}.jpg',
									{
										tileSize : 256,
										tms : true
									});
					natural.addTo($scope.earth);

					var toner = WE.tileLayer(
							'http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
								attribution : ' ',
								opacity : 0.5
							});

					toner.addTo($scope.earth);

					$scope.setmarker_addarr = function(loc_arr) {
						for (var i = 0; i < loc_arr.length; i++)
							setmarker(loc_arr[i]);
					}
					// Date 관련

					Date.prototype.toFormatString = function(format) {

						var year = this.getFullYear();

						var month = this.getMonth() + 1;

						var day = this.getDate();

						var hour = this.getHours();

						var minute = this.getMinutes();

						var second = this.getSeconds();

						if (format == null)
							format = "yyyy-MM-dd";

						format = format.replace("yyyy", year);

						format = (month < 10) ? format.replace("MM", "0"
								+ month) : format.replace("MM", month);

						format = format.replace("M", month);

						format = (day < 10) ? format.replace("dd", "0" + day)
								: format.replace("dd", day);

						format = format.replace("d", day);

						format = (hour < 10) ? format.replace("HH", "0" + hour)
								: format.replace("HH", hour);

						format = (minute < 10) ? format.replace("mm", "0"
								+ minute) : format.replace("mm", minute);

						format = (second < 10) ? format.replace("ss", "0"
								+ second) : format.replace("ss", second);

						return format;

					}
					$scope.map_hide = function() {

						$('#map').hide();
					}
					$scope.hidepic = function() {

						$('.a-diary').hide();
					}

					get_streetview = function(m_lat, m_lang) {
						streetview = true;
						// if (streetview) {
						$('#map').show();
						google.maps.event.addDomListener(window, 'load',
								initialize(m_lat, m_lang));
						// }

					}
					$scope.logout_open=function(){
											
						
						var answer = confirm ("로그아웃 하시겠습니까?")
						if (answer)
							$window.location.href = "main_guest.html";
						
					}
					

					/**
					 * function initialize(m_lat, m_lang) { var fenway = new
					 * google.maps.LatLng(m_lat, m_lang); // Note: constructed
					 * panorama objects have // visible: true // set by default.
					 * var panoOptions = { position : fenway,
					 * addressControlOptions : { position :
					 * google.maps.ControlPosition.BOTTOM_CENTER }, linksControl :
					 * false, panControl : false, zoomControlOptions : { style :
					 * google.maps.ZoomControlStyle.SMALL }, enableCloseButton :
					 * true }; var panorama = new
					 * google.maps.StreetViewPanorama(
					 * document.getElementById('map-canvas'), panoOptions); }
					 */
					function initialize(m_lat, m_lang) {
						streetview = true;
						var fenway = new google.maps.LatLng(m_lat, m_lang);
						var mapOptions = {
							center : fenway,
							zoom : 14
						};
						var map = new google.maps.Map(document
								.getElementById('map-canvas'), mapOptions);
						var panoramaOptions = {
							position : fenway,
							pov : {
								heading : 34,
								pitch : 10
							}
						};
						var panorama = new google.maps.StreetViewPanorama(
								document.getElementById('pano'),
								panoramaOptions);
						console.log("pno:" + panorama);
						map.setStreetView(panorama);
					}
					setmarker = function(loc) {
						// lat = $scope.lat;
						// lang = $scope.lang;
						var get_lat = loc.lat;
						var get_lang = loc.lang;
						if (get_lat == null || get_lang == null) {
							alert("찾을 수 없는 위치 입니다.not found marker");
							return;
						}
						if (loc.subaddress == null)
							loc.subaddress = "";
						if (loc.memo == null)
							loc.memo = "";

						var tdate = new Date(loc.travel_date);

						var marker = WE.marker([ get_lat, get_lang ]).addTo(
								$scope.earth);
var weather_html="";
if(loc.weather_icon!=null){
	weather_html="<img src='http://openweathermap.org/img/w/"+loc.weather_icon +".png' style='margin:auto;'>"

}
						marker
								.bindPopup(
										"<span style='font-size:13px; font-weight:bold;'>"
												+ loc.title
												+ "</span> <hr/>"
												+ "<strong>nation: </strong>"
												+ loc.nation
												+ "<br /> <strong>city: </strong>"
												+ loc.city
												+ "<br />"
												+ loc.sub_address
												+ "<hr/> " 
											//	+"<strong>memo: </strong>"
												+ loc.memo
												+ "<br /><span style='font-size:10px;color:#999; '>"
												+ tdate
														.toFormatString("yyyy/MM/dd")
														
												+weather_html
												+"</span>"
												
//												+ "<hr/>"
//												+ "<button width:'100%'; type='button' onclick='get_streetview( "
//												+ loc.lat
//												+ ","
//												+ loc.lang
//												+ " )'></b><span style='font-size:10px;color:#999; '>Go Streetview</span></button> <br/>"
												,
										{
											maxWidth : 150,
											closeButton : false

										}).closePopup();
						$scope.earth.setView([ get_lat, get_lang ], 2); // 처음

					}
					$scope.set_earth = function(loc) {
						stop_animation();
						get_streetview(loc.lat, loc.lang);
						streeview_modal_open(loc);
						$scope.earth.setView([ loc.lat, loc.lang ], 5);
					}

					// -------------------------animaiton stop/start 버튼
					$scope.stop = function() {

						if (!$scope.stop_flag)
							stop_animation();
						else
							restart_anmation();

					}
					stop_animation = function() {
						$scope.stop_flag = true;
						/* later */
						clearInterval(refreshIntervalId);
						refreshIntervalId = null;
					}

					restart_anmation = function() {
						if (refreshIntervalId == null) {
							$scope.stop_flag = false;

							refreshIntervalId = setInterval(function() {
								var c = $scope.earth.getPosition();
								$scope.earth.setCenter([ c[0], c[1] + 0.1 ]);
							}, 30);
						}
					}

					$scope.go = function(path) {
						console
								.log($location.absUrl() + "  "
										+ $location.url());
						// getPath(path);
						$location.path(path);
						$location.replace();
					};

					function getPath(fullUrl) {
						var baseLen = $location.absUrl().length
								- $location.url().length;
						console.log(fullUrl.substring(baseLen) + "");

						return fullUrl.substring(baseLen);
					}
					get_piclist = function(getid) {
						$http.post("/piclist/" + getid, {

						}).success(function(response) {
							$scope.slides = $scope.piclist = response;
							console.log($scope.slides);

						});
					}

					streeview_modal_open = function(travel_diary) {
						$('.a-diary').show();
						$scope.travel_id = travel_diary.id_travel;

						$scope.travel_title = travel_diary.title;
						$scope.travel_memo = travel_diary.memo;
						$scope.travel_writedate = travel_diary.write_date;
						$scope.travel_traveldate = travel_diary.travel_date;
						$scope.travel_adr = travel_diary.nation + " "
								+ travel_diary.city;
						$scope.formatted_address = travel_diary.sub_address;
						$scope.myInterval = 2500;
						get_piclist($scope.travel_id);

					};
				});
// mainuser_app.controller('ModalDemoCtrl', function($scope, $modal, $log) {
// setInstModal = function() {
// $scope.items = $scope.postArr;
//
// $scope.open = function(size) {
//
// var modalInstance = $modal.open({
// templateUrl : 'myModalContent.html',
// controller : 'ModalInstanceCtrl',
// size : size,
// resolve : { // modalctrl에 넘겨줄 값,function 보내기
// items : function() {
// return $scope.items;
// },
// earth : function() {
// return $scope.earth;
// }
//
// }
// });
//
// modalInstance.result.then(function(selectedItem) {
// $scope.selected = selectedItem;
// }, function() {
// $log.info('Modal dismissed at: ' + new Date());
// });
// };
// }
// if ($scope.postArr == null) {
// console.log("modal이 먼저받음 $scope.postArr null");
// setInterval(function() {
// setInstModal();
// }, 500);
//
// } else
// setInstModal();
//
// streeview_modal_open = function(travel) {
// $scope.travel_id = travel.id_travel;
// var modalStreetview = $modal.open({
// templateUrl : 'myModalStreetViewContent.html',
// controller : 'ModalStreetViewCtrl',
// size : 'lg',
// resolve : {
// getid : function() {
// return $scope.travel_id;
// },
// travel_diary : function() {
// return travel;
// }
//
// }
// });
// modalStreetview.result.then(function(selectedItem) {
// $scope.selected = selectedItem;
//
// }, function() {
//
// $log.info('Modal dismissed at: ' + new Date());
// });
//
// };
//
// $scope.logout_modal_open = function() {
//
// var modalLogOut = $modal.open({
// templateUrl : 'myModalLogOutContent.html',
// controller : 'ModalLogOutCtrl',
// size : 'lg',
// resolve : {
//
// }
// });
//
// };
//
// });
//
// // Please note that $modalInstance represents a modal window (instance)
// // dependency.
// // It is not the same as the $modal service used above.
//
// mainuser_app.controller('ModalInstanceCtrl', function($scope, $modalInstance,
// items, earth) {
//
// $scope.items = items;
// $scope.selected = {
// item : $scope.items[0]
// };
//
// $scope.ok = function() {
//
// $modalInstance.close($scope.selected.item);
//
// earth.setView([ $scope.selected.item.lat, $scope.selected.item.lang ],
// 4);
//
// };
//
// $scope.cancel = function() {
// $modalInstance.dismiss('cancel');
// };
// });
//
// mainuser_app.controller('ModalStreetViewCtrl', function($scope,
// $modalInstance,
// getid, travel_diary, $http) {
// $scope.travel_title = travel_diary.title;
// $scope.travel_memo = travel_diary.memo;
// $scope.travel_writedate = travel_diary.write_date;
// $scope.travel_traveldate = travel_diary.travel_date;
// $scope.travel_adr = travel_diary.nation + " " + travel_diary.city;
// $scope.formatted_address = travel_diary.sub_address;
// $scope.myInterval = 2500;
// console.log(getid);
// get_piclist = function() {
// $http.post("/piclist/" + getid, {
//
// }).success(function(response) {
// $scope.slides = $scope.piclist = response;
// console.log($scope.slides);
//
// });
// }
// get_piclist();
// // $scope.slides = $scope.piclist;
//
// // $scope.addSlide = function() {
// // var newWidth = 600 + slides.length;
// // slides
// // .push({
// // image : 'http://placekitten.com/'
// // + newWidth + '/300',
// // text : [ 'More', 'Extra', 'Lots of',
// // 'Surplus' ][slides.length % 4]
// // + ' '
// // + [ 'Cats', 'Kittys', 'Felines',
// // 'Cutes' ][slides.length % 4]
// // });
// // };
// // for (var i = 0; i < 4; i++) {
// // $scope.addSlide();
// // }
//
// $scope.ok = function() {
//
// $modalInstance.close($scope.selected.item);
// };
//
// $scope.cancel = function() {
// $modalInstance.dismiss('cancel');
// };
// });
//
// mainuser_app.controller('ModalLogOutCtrl', function($scope, $modalInstance,
// $window) {
//
// $scope.ok = function() {
//
// $modalInstance.close();
// $window.location.href = "main_guest.html";
//
// };
//
// $scope.cancel = function() {
// $modalInstance.dismiss('cancel');
// };
// });
