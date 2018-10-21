chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);

			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading
			// console.log(window.AvailSeries);
			// console.log(window.AvailSeries);
			// console.log(window.seriesCounts);
			// ----------------------------------------------------------
			exec(() => {




				getRegisteredRacers();

				/* Loop at 10 sec interval*/
				function timeout() {
					setTimeout(function () {
						$(".footerSection.rps_table").remove();
						getRegisteredRacers();
					}, 10000);
				}
				timeout();


				function getRegisteredRacers() {
					$.post("/membersite/member/GetTotalSessionJoinedCountsBySeason").done(function( data ) {
						/*Eval the js objects*/
						var seriesCounts = eval(data);

						/* Get the season listings */
						seasons = window.SeasonListing;
						res = seriesCounts.map(x => Object.assign(x, seasons.find(y => y.seasonid == x.seasonid)));

						sorted = res.sort(function(a, b) {
							if (a.registered < b.registered) {
		    					return 1;
							}
							if (a.registered > b.registered) {
		    					return -1;
							}
							return 0;
						});

						/* Get the current season quarter */
						function getQuarter(d) {
							d = d || new Date();
							var m = Math.floor(d.getMonth()/3) + 2;
							return m > 4? m - 4 : m;
						}

						current_quarter = getQuarter();

						var list_of_series = '';

						/* Example js function fire: javascript:selectSeries(2196,4); */

						for (i = 0; i < sorted.length; i++) { 
							if(!sorted[i]['seriesname']) {continue;}
							fixed_class = sorted[i]['isFixedSetupg'] ? 'rps_fixed' : '';
							multi_class = (sorted[i]['isFixedSetup'] ? 'rps_multiclass' : '');
							list_of_series += '<tr class="rpc_series">' 
								+ '<td class="bg_white"><img class="rpc_image '+fixed_class+' '+multi_class+'" src="/'+sorted[i]['whatshotimg']+'"></td>'
								+ '<td>&nbsp;&nbsp;&nbsp;</td>'
								+ '<td><a class="rpc_select" href="#col_'+sorted[i]['seasonid']+'">'+sorted[i]['seriesname']+'</a></td>'
								+ '<td>&nbsp;&nbsp;&nbsp;</td>'
								+ '<td>'+sorted[i]['registered']+'</td>'
								+ '<td><a class="rpc_select" href="javascript:selectSeries('+sorted[i]['seasonid']+','+current_quarter+');">Select</a></td>'
								+ "</tr>";
						}

						console.log(sorted);

						$(".footerSection.iracersOnline").before(
							'<td class="footerSection rps_table" style="width: 140px;">'
								+'<div id="racersPerSeriesContainer"><h3>Racers Per Series</h3>'
								+ '<table><tr class="rpc_series"><th>&nbsp</th><th>&nbsp</th><th>Series Name</th><th>&nbsp</th><th>Registered</th><th></th></tr>'
								+list_of_series
								+ '</table>'
								+'</div>'
								+'<div id="myracers_count_spacer" style="width: 140px; height: 12px;"></div>'
								+'<div class="myRacersCount" id="rps_count">Racers Per Series</div>'
							+'</td>'
							+'<td class="footerSeparator"></td>'
						);
					});
				}
			    
			});
		}
	}, 10);
});

