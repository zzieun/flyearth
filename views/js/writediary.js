var refreshIntervalId;

var diaryModule = angular.module("writeDiary", [ 'ui.bootstrap', 'ngRoute',
		'angularFileUpload' ]);
var entryPanoId = null;

var x = document.getElementById("demo");
var today_fm = "";
var streetview = false;
var panorama;
var marker3;
// $('#iframe_streetview').hide();
click_marker = function(lat, lang) {
	get_streetview(lat, lang);

	streetview = !streetview;
	if (streetview)
		$('#map-canvas').show();
	else
		$('#map-canvas').hide();

}
diaryModule
		.controller(
				"earth_controller",
				function($scope, $route, $http, $window, $upload) {
					$scope.is_first_access = true;
					$scope.search_citylist = new Array();
					$scope.stop_flag = false;
					$scope.lat = "";
					$scope.lang = "";
					$scope.weather_set = "";
					geocoder = new google.maps.Geocoder();
					$scope.getid = getURLParameter('user_id');
					function getURLParameter(name) {
						return decodeURIComponent((new RegExp('[?|&]' + name
								+ '=' + '([^&;]+?)(&|#|;|$)')
								.exec(location.search) || [ , "" ])[1].replace(
								/\+/g, '%20'))
								|| null
					}
					$scope.upload_files = function(travel_id) {
						if ($scope.selectedFiles != null) {
							for (var i = 0; i < $scope.selectedFiles.length; i++) {
								var file = $scope.selectedFiles[i];
								$scope.upload = $upload
										.upload({
											url : '/upload/' + travel_id, // upload.php
											// script, node.js
											// route, or servlet
											// url
											// method: 'POST' or 'PUT',
											// headers: {'header-key':
											// 'header-value'},
											// withCredentials: true,
											data : {
												myObj : $scope.myModelObj
											},
											file : file, // or list of files
										// ($files)
										// for
										// html5 only
										// fileName: 'doc.jpg' or ['1.jpg',
										// '2.jpg',
										// ...] //
										// to modify the name of the file(s)
										// customize file formData name
										// ('Content-Disposition'), server side
										// file
										// variable name.
										// fileFormDataName: myFile, //or a list
										// of
										// names
										// for multiple files (html5). Default
										// is 'file'
										// customize how data is added to
										// formData. See
										// #40#issuecomment-28612000 for sample
										// code
										// formDataAppender: function(formData,
										// key,
										// val){}
										})
										.progress(
												function(evt) {
													console
															.log('percent: '
																	+ parseInt(100.0
																			* evt.loaded
																			/ evt.total));
													if (parseInt(100.0
															* evt.loaded
															/ evt.total) == 100) // upload완료
													{
														$window.location.href = "main_user.html?user_id="
																+ $scope.getid;
													}
												})
										.success(
												function(data, status, headers,
														config) {
													// file is uploaded
													// successfully
													console
															.log("파일업로드되도 success로 안넘어옴");

												});
								// .error(...)
								// .then(success, error, progress);
								// access or attach event listeners to the
								// underlying XMLHttpRequest.
								// .xhr(function(xhr){xhr.upload.addEventListener(...)})
							}
						} else {
							$window.location.href = "main_user.html?user_id="
									+ $scope.getid;
						}
					}
					$scope.onFileSelect = function($files) {
						// $files: an array of files selected, each file has
						// name, size, and type.
						$scope.selectedFiles = [];
						$scope.progress = [];

						if ($scope.upload && $scope.upload.length > 0) {
							for (var i = 0; i < $scope.upload.length; i++) {
								if ($scope.upload[i] != null) {
									$scope.upload[i].abort();
								}
							}
						}
						$scope.upload = [];
						$scope.uploadResult = [];
						$scope.selectedFiles = $files;
						$scope.dataUrls = [];

					};
					$scope.abort = function(index) {
						// $scope.upload[index].abort();
						$scope.upload[index] = null;
						$scope.selectedFiles.splice(index, 1);
					};
					$scope.write_save = function() {
						console.log("view:" + $scope.user_email);
						var lats;
						var langs;
						var obj = JSON.stringify($scope.search_citylist);
						// for (var int = 0; int <
						// $scope.search_citylist.length; int++) {
						// lats = lats + $scope.search_citylist[int].lat + "_";
						// langs = langs + $scope.search_citylist[int].lang
						// + "_";
						// }
						$http.post("/write_save", {
							'user_id' : $scope.getid,
							'travel_date' : $scope.format_dt(),
							'title' : $scope.title,
							'memo' : $scope.memo,
							'lat' : lats,
							'lang' : langs,
							data : obj,
							weather_set : $scope.weather_set
						}).success(function(data, status, headers, config) {

							alert("작성 완료");
							console.log("inserted Successfully ");
							$scope.upload_files(encodeURIComponent(data));

						});

					};
					$scope.gomain = function() {
						$window.location.href = "main_user.html?user_id="
								+ $scope.getid;
					}
					// var earth = new WE.map('earth_div');
					var options = {
						sky : false,
						atmosphere : false,
						dragging : true,
						tilting : true,
						zooming : true,
						center : [ 46.8011, 8.2266 ],
						zoom : 2
					};
					$scope.nation = "";
					$scope.earth = new WE.map('earth_div', options);
					WE
							.tileLayer(
									'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
							.addTo($scope.earth);
					$scope.set_all_marker = function() {

						// var earth = new WE.map('earth_div');
						// Sets the map on all markers in the array.
						for (var i = 0; i < $scope.search_citylist.length; i++) {
							var marker = WE.marker(
									[ $scope.set_all_marker.lat,
											$scope.set_all_marker.lang ])
									.addTo($scope.earth);
							$scope.$apply();
						}

					}
					$scope.set_all_marker();

					$scope.getLocation1 = function() {

						if (navigator.geolocation) {
							navigator.geolocation
									.getCurrentPosition(showPosition);
						} else {
							x.innerHTML = "Geolocation is not supported by this browser.";
						}
					}

					showPosition = function(position) {
						x.innerHTML = "Latitude: " + position.coords.latitude
								+ "<br>Longitude: " + position.coords.longitude;
						$scope.lat = position.coords.latitude;
						$scope.lang = position.coords.longitude;
						// codeLatLng($scope.lat, $scope.lang);
						$scope.setmarker($scope.lat, $scope.lang);

					}

					codeLatLng = function(get_lat, get_lng) {
						var formatted_address = "";
						var latlng = new google.maps.LatLng(get_lat, get_lng);
						$scope.g_lat = get_lat;
						$scope.g_lng = get_lng;
						geocoder
								.geocode(
										{
											'latLng' : latlng,

										},
										function(results, status) {
											if (status == google.maps.GeocoderStatus.OK) {
												console.log(results)
												if (results[1]) {
													// formatted address
													// alert(results[0].formatted_address)
													// find country name
													for (var i = 0; i < results[0].address_components.length; i++) {
														for (var b = 0; b < results[0].address_components[i].types.length; b++) {

															// there are
															// different types
															// that might hold a
															// city
															// admin_area_lvl_1
															// usually does in
															// come cases
															// looking for
															// sublocality type
															// will be more
															// appropriate
															if (results[0].address_components[i].types[b] == "country") {
																// this is the
																// object you
																// are looking
																// for
																$scope.nation = results[0].address_components[i].long_name;

															} else if (results[0].address_components[i].types[b] == "locality"
																	|| results[0].address_components[i].types[b] == "administrative_area_level_1") {
																$scope.city = results[0].address_components[i].long_name;

															}
															$scope.formatted_address = results[0].formatted_address;
														}
													}
													var poptext = $scope.formatted_address;
													$scope.setMarkPop(get_lat,
															get_lng, poptext)
													var city = {
														lat : $scope.g_lat,
														lang : $scope.g_lng,
														city : $scope.city,
														nation : $scope.nation,
														address : $scope.nation
																+ $scope.city,
														formatted_address : $scope.formatted_address
													};
													//													

													console.log(city.address);
													for (i = 0; i < $scope.search_citylist.length; i++) {
														if ($scope.search_citylist[i].lat == (city.lat))
															if ($scope.search_citylist[i].lang == (city.lang)) {
																alert("이미 등록되어 있습니다. same here");
																return;
															}
													}

													$scope.addRow(city);
													// db에서 repeat으로 쓸땐 스코프
													// 부분지우고 파라미터값 연결시켜줌
													// controller->controller니까
													// 괜찮
													console.log($scope.g_lat
															+ " "
															+ $scope.g_lng);

												} else {
													alert("No results found");
												}
											} else {
												alert("Geocoder failed due to: "
														+ status);
											}

										});

					}
					$scope.getCurrentWeather = function(lat, lang) {

						$http.get(
								'http://api.openweathermap.org/data/2.5/weather?lat='
										+ lat + '&lon=' + lang)
								.success(
										function(result) {
											console.log("날ㅆ:"
													+ result.weather[0].main);
											$scope.weather_set = result;

										});

					}
					$scope.setmarker = function(get_lat, get_lang) {
						// lat = $scope.lat;
						// lang = $scope.lang;
						if (get_lat == null || get_lang == null) {
							alert("찾을 수 없는 위치 입니다.not found marker");
							return;
						} else if (get_lat == -1) {
							get_lat = $scope.lat;
							get_lang = $scope.lang;
						}

						codeLatLng(get_lat, get_lang);
						$scope.getCurrentWeather(get_lat, get_lang);
					}
					$scope.setMarkPop = function(get_lat, get_lang, poptext) {
						var marker3 = WE.marker([ get_lat, get_lang ]).addTo(
								$scope.earth);
						marker3.bindPopup(
								"<button type='button' onclick='click_marker("
										+ get_lat + "," + get_lang + ")'>"
										+ "StreetView" + "</button>" + "<p>"
										+ poptext + "<p/>", {
									maxWidth : 150,
									closeButton : false

								}).openPopup();
						$scope.earth.setView([ get_lat, get_lang ], 2); // 처음
					}

					$scope.$watch('search_citylist', function() {
						// if (!$scope.is_first_access)
						// $scope.apply();
						console.log("counter watche");
					}, true);

					get_streetview = function(m_lat, m_lang) {

						google.maps.event.addDomListener(window, 'load',
								initialize(m_lat, m_lang));

					}
					function initialize(m_lat, m_lang) {
						var fenway = new google.maps.LatLng(m_lat, m_lang);

						// Note: constructed panorama objects have visible: true
						// set by default.
						var panoOptions = {
							position : fenway,
							addressControlOptions : {
								position : google.maps.ControlPosition.BOTTOM_CENTER
							},
							linksControl : false,
							panControl : false,
							zoomControlOptions : {
								style : google.maps.ZoomControlStyle.SMALL
							},
							enableCloseButton : false
						};

						var panorama = new google.maps.StreetViewPanorama(
								document.getElementById('map-canvas'),
								panoOptions);
					}

					// --------------------------------address 검색해서 위경도받기 ->
					// 마커메소드 호출

					// $scope.$watch('status_api',function()
					// {$scope.setmarker($scope.ad_lat, $scope.ad_lng);});
					// $scope.$watch('ad_lng',function()
					// {$scope.codeAddress();});
					$scope.$watch('ad_lat', function() {
						if (!$scope.is_first_access)
							$scope.setmarker($scope.ad_lat, $scope.ad_lng);

					});
					$scope.codeAddress = function() {
						console.log($scope.input_address);

						// var address =
						// document.getElementById("address").value;
						var geocoder = new google.maps.Geocoder();

						geocoder.geocode({
							'address' : $scope.input_address
						}, function(results, status) {
							$scope.is_first_access = false;
							console.log(status + "");
							if (status == google.maps.GeocoderStatus.OK) {

								// alert(results[0].geometry.location.lng());

								$scope.ad_lat = results[0].geometry.location
										.lat();

								$scope.ad_lng = results[0].geometry.location
										.lng();
								$scope.$apply();
								// $scope.setmarker($scope.ad_lat,
								// $scope.ad_lng);

							} else {
								alert("해당 위치를 찾을 수 없습니다. not found");

								// alert($scope.tezt
								// + "Geocode was not successful for the
								// following reason: "
								// + status);

							}

						});

					}
					$scope.reloadRoute = function() {

						var json = JSON.stringify($scope.search_citylist);

						// $window.location.href="write_diary.html?user_id="+encodeURIComponent($scope.getid)+"&"+data;
						$window.location.reload(false);
						// $http
						// .post("write_diary.html?user_id="+$scope.getid, {
						// data : json
						// })
						// .success(
						// function(data, status, headers, config) {
						//
						// alert("리로드 완료");
						//					
						// $window.location.reload(false);
						// });

					}

					$scope.addRow = function(city) {
						$scope.search_citylist.push(city);
						$scope.counter++;
						console.log("addrow" + $scope.search_citylist.length);
						$scope.$apply();
					}
					$scope.removePostion = function(index) {
						$scope.search_citylist.splice(index, 1);
						$scope.reloadRoute();

					};

					// ---------------------------------datepicker
					// grab today and inject into field
					$scope.today = function() {
						$scope.today_dt = new Date();
						today_fm = $scope.today_dt;
						$scope.dt = new Date();
					};

					// run today() function
					$scope.today();

					// setup clear
					$scope.clear = function() {
						$scope.dt = null;
					};

					// open min-cal
					$scope.open = function($event) {
						$event.preventDefault();
						$event.stopPropagation();

						$scope.opened = true;
					};

					// handle formats
					$scope.formats = [ 'dd-MMMM-yyyy', 'yyyy/MM/dd',
							'dd.MM.yyyy', 'shortDate' ];

					// assign custom format
					$scope.format = $scope.formats[1];

					dateformat = function(dt) {
						return dt.getFullYear() + "/" + (dt.getMonth() + 1)
								+ "/" + dt.getDate();

					}
					$scope.format_dt = function() {
						return dateformat($scope.dt);
					}

				});
