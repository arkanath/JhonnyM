var x = 0;

var username;
var tablename;
var currentday;
var globaltask;
var globaltime;
var colortoggle;

username = getCookie('username');
tablename = getCookie('tablename');
currentday = getCookie('currentday');
globaltask = getCookie('task');
colortoggle = getCookie('colortoggle');
if(colortoggle==null) colortoggle=0;

if(username==null || tablename==null || globaltask==null || currentday==null) logout();
if(globaltask=='_firsttimeopen_' || globaltask=='_justopened_') globaltime = -2;
else globaltime = getCookie('starttime');

var urltrigger = 0;

function logout()
{
	setTimeout(function(){
		docCookies.removeItem('task');
		docCookies.removeItem('starttime');
		docCookies.removeItem('username');
		docCookies.removeItem('tablename');
		docCookies.removeItem('currentday');
		window.location.replace('index.html');
	},1);
}
function onGeneratedRow(rows)
{
	var ans = [];
	var i =0;
	for(i=0;i<rows.rows.length;i++)
	{
		var jsonData = {};
		jsonData['num'] = rows.rows.item(i)['type']+':';
		ans.push(jsonData);
	}
	var jsonData6 = {};
	jsonData6['num'] = 'App:Calendar';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'App:Statistics';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'App:Todoist';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'App:Digg';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'App:Any.Do';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'Google:';
	ans.push(jsonData6);
	jsonData6 = {};
	jsonData6['num'] = 'App:Flipboard';
	ans.push(jsonData6);
	var jsonData1 = {};
	jsonData1['num'] = 'Reading:Tech News This Week';
	ans.push(jsonData1);
	var jsonData2 = {};
	jsonData2['num'] = 'Reading:World News This Week';
	ans.push(jsonData2);
	var jsonData3 = {};
	jsonData3['num'] = 'Reading:Sports News This Week';
	ans.push(jsonData3);
	var jsonData4 = {};
	jsonData4['num'] = 'Sleeping';
	ans.push(jsonData4);
	var jsonData5 = {};
	jsonData5['num'] = 'Resting';
	ans.push(jsonData5);
	return ans;
}

$(document).on("dblclick", function (){
	$("#task").trigger("focus");
});

$('#rdigg').contents().delegate('digg-alerts-container', 'onload', function() {
	alert("loaded"); 
});

$('#lowerframe').load(function(){
	$('#loadinglower').hide();
	if(document.getElementById("lowerframe").src != "about:blank") 
	{
		$('#lowerframe').show();
	}
});

function setcolor(){
	if(colortoggle==0)
	{
		$('body').css("background", "white");
		$('body').css("color", "black");
		setTimeout(function(){
			$('#themetext').html('Switch to Night Theme');
		},3000);
	}
	else
	{
		$('body').css("background", "black");
		$('body').css("color", "white");
		setTimeout(function(){
			$('#themetext').html('Switch to Day Theme');
		},3000);
	}

}
$(document).ready(function(){ 
	
	setcolor();
	setTimeout(function(){
		$('body').css('transition', '3s ease-in');
		$('body').css('-moz-transition', '3s ease-in');
		$('body').css('-ms-transition', '3s ease-in');
		$('body').css('-o-transition', '3s ease-in');
		$('body').css('-webkit-transition', '3s ease-in');
	},1000);
	$('#clk').jsclock();
	$("#statcount").val(1);
	html5sql.openDatabase("users","Username Database",	1*1024*1024);
	
	html5sql.process(
		[
		"SELECT DISTINCT type FROM "+tablename+" WHERE time <> -1 AND type <> 'currentday'",
		],
		function(transaction, results){
			
			var jsonData = onGeneratedRow(results);
			var numbers = new Bloodhound({
				datumTokenizer: function(d) {
					return Bloodhound.tokenizers.whitespace(d.num);
				},
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: jsonData
			});
			numbers.initialize();

			$('.typeahead').typeahead(null, {
				minLength: 0,
				displayKey: 'num',
				items: 9999,
				source: numbers.ttAdapter()
			});
		},      
		function(error, statement){
			alert("Please report to developer following bug: " + error.message + " when processing " + statement);
		}    
		);

	
	
	setttime();sett(); 
	window.setInterval(setT, 1000);
	


	$("#task").keyup(function (e) {
		if (e.keyCode === 13)
		{
			parseinput(0);

		}
	});
	$("#calend").keyup(function (e) {
		if (e.keyCode === 13)
		{
			var calensrc = document.getElementById('calend').value.split("\"");
			if(calensrc.length<3)
			{
				alert('Something Wrong. If the problem persists, please report to the developer.');
			}
			else
			{
				var sst = calensrc[1].substr(calensrc[1].indexOf("src="),calensrc[1].length);
				sst = 'https://www.google.com/calendar/embed?'+sst;
				html5sql.process(
					[
					"INSERT INTO "+tablename+" VALUES ('"+sst+"',"+currentday+",-1)",
					],
					function(transaction, results){
						alert('Thank you. Your calendar is configured.')
						window.location.replace('loggedin.html');
					},      
					function(error, statement){
						alert("Please report to developer following bug: " + error.message + " when processing " + statement);
					}    
					);
			}
		}
	});
	
	
	$("#calcinput").keyup(function (e) {
		calculate();
	});
	$("#statcount").keyup(function (e) {
		if($("#statcount").val()>1)
		{
			$("#dday").html('Days');
		}
		else if($("#statcount").val()==0)
		{
			$("#dday").html('Day');
		}
		if (e.keyCode === 13)
		{
			showstats();
		}
	});
	$('#task').focusout(function(){
		focusgaya();
		setTimeout(function(){sett()},10)
	});
	$('#task').focusin(function(){
		focusaaya();		                          
	});

	document.getElementById('logoutdiv').onclick=function(){
		logout();
	}
	document.getElementById('themetext').onclick=function(){
		colortoggle = 1-colortoggle;
		setCookie("colortoggle",colortoggle,30);
		setcolor();
	}
	document.getElementById('appstats').onclick=function(){
		showDiv("",3);
		showstats();
	}
	document.getElementById('apptodoist').onclick=function(){
		showWebpage('todoist');
	}
	document.getElementById('appflipboard').onclick=function(){
		showWebpage('flipboard');
	}
	document.getElementById('appany.do').onclick=function(){
		showWebpage('any.do');
	}
	document.getElementById('appdigg').onclick=function(){
		showWebpage('digg');
	}
	document.getElementById('appcalendar').onclick=function(){
		showCalendar();
	}
	document.getElementById('appcalc').onclick=function(){
		showDiv("",4);
		$('#calcinput').focus();
		calculate();
	}
	document.getElementById('click1').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://duckduckgo.com/?q='+gggl);
		// showFrame('https://calendar.sunrise.am');
	}
	
	document.getElementById('click2').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://youtube.com/embed/?listType=search&list='+gggl);
	}
	document.getElementById('click3').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://www.oxforddictionaries.com/us/definition/american_english/'+gggl);
	}
	document.getElementById('click4').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		var ggl = (String)(gggl).toLowerCase();
		var ggl1 = (String)(ggl.split("how to ").join(""));
		var ggl2 = (String)(ggl1.split(" ").join("\-"));

		showFrame('http://www.wikihow.com/'+ggl2);
	}
	document.getElementById('click5').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://en.m.wikipedia.org/wiki/'+gggl);
	}
	document.getElementById('click7').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://www.bing.com/news/search?q='+gggl);
	}
	document.getElementById('click6').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://duckduckgo.com/?iax=1&ia=images&q='+gggl);
//		showFrame('http://www.metrolyrics.com/rockstar-lyrics-nickelback.html);
}
});
function setT(){
	setTimeout(function() {
		setttime();       // repeat
	}, 10);
}

function focusaaya()
{
	document.getElementById("uparwala").style.textAlign = "left";
	document.getElementById("lower").style.display = "none";
}
function focusgaya()
{
	document.getElementById("uparwala").style.textAlign = "center";
	document.getElementById("lower").style.display = "block";
}

function showstats()
{
	if($("#statcount").val()<1)
	{
		bounceagain('#statcount');
	}
	else
	{
		//stat append
		var frday = currentday-$("#statcount").val();
		var str = "";

		html5sql.process(
			[
			"select type,sum(time) as timesum from "+tablename+" WHERE day > "+frday+" AND type != 'currentday' AND type != 'App' AND type != 'URL' group by type  ORDER by sum(time) DESC"
			],
			function(transaction, results){
				var i;
				for(i=0;i<results.rows.length;i++)
				{
					if(results.rows.item(i)['timesum']>0)str += "<h3>"+results.rows.item(i)['type']+"</h3><p>"+getTimeString(results.rows.item(i)['timesum'])+"</p>";
				}		
				$('#stdata').html(str);
			},      
			function(error, statement){
				alert("Please report to developer following bug: " + error.message + " when processing " + statement);
			}    
			);
		
	}
}
function parseinput(flag)
{
	
	var tas = globaltask.split(':');
	globaltime = new Date().getTime() - getCookie('starttime');
	if(tas.length>1)
	{
		var categ = tas[0];
		html5sql.process(
			[
			"SELECT * FROM "+tablename+" WHERE type = '"+categ+"' AND day="+currentday,
			],
			function(transaction, results){

				if(results.rows.length==0)
				{
					html5sql.process(
						[
						"INSERT INTO "+tablename+" VALUES ('"+categ+"',"+currentday+","+globaltime+")",
						],
						function(transaction, results){
							afterparse();							
						},      
						function(error, statement){
							alert("Please report to developer following bug: " + error.message + " when processing " + statement);
						}    
						);
				}
				else
				{
					var pres = results.rows.item(0)['time'];
					pres+=globaltime;
					html5sql.process(
						[
						"UPDATE "+tablename+" SET time = "+pres+" WHERE type = '"+categ+"' AND day="+currentday,
						],
						function(transaction, results){
							afterparse();
						},      
						function(error, statement){
							alert("Please report to developer following bug: " + error.message + " when processing " + statement);
						}    
						);
				}
			},      
			function(error, statement){
				alert("Please report to developer following bug: " + error.message + " when processing " + statement);
			}
			);
	}
	else
	{
		afterparse();
	}

	if(flag==0 && document.getElementById("task").value=='Sleeping')
	{
		var r = confirm("This will reset your sleep cycle and increment the day count in you life by 1. Press Cancel if you would prefer resting instead.");
		if (r == true) {
			html5sql.process(
				[
				"UPDATE "+tablename+" SET time = time+1 WHERE type='currentday'",
				],
				function(transaction, results){
					currentday++;
					setCookie('currentday',currentday,30);
					afterparse();
					alert('Have a sound sleep.');
				},      
				function(error, statement){
					alert("Please report to developer following bug: " + error.message + " when processing " + statement);
				}    
				);
		}
		else
		{
			setTimeout(function() {
				document.getElementById("task").value='Resting';
				afterparse();
			},1000);
		}
	}
}

function afterparse(){
	deletecoin();
	globaltask = document.getElementById("task").value;
	if(globaltask=="") globaltask = "_justopened_";
	var tas = globaltask.split(':');
	if(tas.length==1 && globaltask!='Sleeping')
	{
		globaltime = -1;
	}
	else globaltime = new Date().getTime();
	setCookie('task',globaltask,30);
	setCookie('starttime',globaltime,30);
	setttime();
	sett();
	$('#task').blur();
	if(tas.length>1)
	{
		$('#taskmain').html(tas[0]+" ");
	}
	else{
		$('#taskmain').html("");	
	}
}

function sett()
{
	if(globaltime==-2 || globaltask=='_justopened_')
	{
		if(globaltask=='_firsttimeopen_')
		{
			document.getElementById("task").placeholder = 'Hello, '+username+'.';
		}
		else
		{
			document.getElementById("task").placeholder = 'What are you up to, '+username+'?';
		}
	}
	else document.getElementById("task").value = globaltask;
	
	setFrame();
	var tas = globaltask.split(':');
	if(tas.length>1)
	{
		$('#taskmain').html(tas[0]+" ");
	}
	else{
		$('#taskmain').html("");	
	}
}

function showFrame(str)
{
	$('#lowerdisplay').hide();
	$('#loadinglower').show();
	document.getElementById("lowerframe").src= str;
}

function showDiv(str,flag)
{
	$('#lowerdisplay').show();
	document.getElementById("lowerframe").src= "about:blank";
	$('#lowerframe').hide();	
	if(flag==1) 
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').hide();
		$('#sidebarstats').hide();
		$('#customhtml').show();
		$('#customhtml').html(str);
		$('#calculator').hide();
		$('#welcome').hide();
	}else if(flag==2) 
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').show();
		$('#customhtml').hide();
		$('#sidebarstats').hide();
		$('#calculator').hide();
		$('#welcome').hide();
	}
	else if(flag==3)
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').hide();
		$('#customhtml').hide();
		$('#sidebarstats').show();
		$('#calculator').hide();
		$('#welcome').hide();
	}
	else if(flag==4)
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').hide();
		$('#customhtml').hide();
		$('#sidebarstats').hide();
		$('#calculator').show();
		$('#welcome').hide();
	}
	else if(flag==5)
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').hide();
		$('#customhtml').hide();
		$('#sidebarstats').hide();
		$('#calculator').hide();
		$('#welcome').show();
	}
	else if(flag==0)
	{
		$('#normal').show();
		$('#calad').hide();	
		$('#abnormal').hide();
	}
}

function calculate(){
	var stt;
	try {
		stt = math.eval($('#calcinput').html());
		if(stt==undefined)
		{
			stt="Some error, see example inputs below.";
		}
	}
	catch(err) {
		stt = "Some error, see example inputs below.";
	}
	$('#calcans').html(stt);
}

function showCalendar(){
	html5sql.process(
		[
		"SELECT * FROM "+tablename+" WHERE time = -1",
		],
		function(transaction, results){
			if(results.rows.length==0)
			{
				showDiv('',2);
			}
			else
			{
				showFrame(results.rows.item(0)['type']);
			}
		},      
		function(error, statement){
			alert("Please report to developer following bug: " + error.message + " when processing " + statement);
		}    
		);
}

function showWebpage(inp)
{
	if(inp=='todoist')
	{
		showFrame('http://todoist.com');
	}
	else if(inp=='digg')
	{
		showFrame('http://digg.com');	
	}
	else if(inp=='any.do')
	{
		showFrame('https://web.any.do/');	
	}
	else if(inp=='flipboard')
	{
		showFrame('http://about.flipboard.com/magazines/');	
	}
}
function setFrame(){
	// alert('in');
	var tas = globaltask.split(':');
	if(tas.length==1)
	{
		if(tas[0]=='_firsttimeopen_' || tas[0]=='_justopened_' || tas[0]=='')
		{
			showDiv("",5);
		}
		else if(tas[0]=='Sleeping')
		{
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-eye-close');
		}
		else
		{
			$('#click1').html("Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click3').html("Define <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click6').html("Image Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click7').html("Bing News Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			showDiv("",0);
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-thumbs-up');
		}
	}
	else
	{
		if(tas[0]=='Youtube')
		{
			showFrame('http://youtube.com/embed/?listType=search&list='+tas[1]);
		}
		else if(tas[0]=='Calculate')
		{
			$('#calcinput').html(tas[1]);
			calculate();
			showDiv("",4);
		}
		else if(tas[0]=='Define')
		{
			showFrame('http://www.oxforddictionaries.com/us/definition/american_english/'+tas[1]);
		}
		else if(tas[0]=='Search')
		{
			showFrame('http://duckduckgo.com/?q='+tas[1]);
		}
		else if(tas[0]=='Search News')
		{
			showFrame('http://www.bing.com/news/search?q='+tas[1]);
		}
		else if(tas[0]=='Search Images')
		{
			showFrame('http://duckduckgo.com/?iax=1&ia=images&q='+tas[1]);
		}
		else if(tas[0]=='URL')
		{
			window.open('http://'+tas[1].split('http://').join('').split('https://').join(''),'_blank');
			document.getElementById("task").value = "Browsing";
			globaltask = "Browsing";
			globaltime = -1;
			setCookie('task',globaltask,30);
			setCookie('starttime',globaltime,30);
			$('#task').blur();
		}
		else if(tas[0]=='Google')
		{
			window.open('http://www.google.com/#safe=off&q='+tas[1],'_blank');
			document.getElementById("task").value = "Browsing";
			globaltask = "Browsing";
			globaltime = -1;
			setCookie('task',globaltask,30);
			setCookie('starttime',globaltime,30);
			$('#task').blur();
		}
		else if(tas[0]=='Reading')
		{
			if(tas[1]=='Tech News This Week')
			{
				showFrame('https://flipboard.com/section/techcrunch-weekly-b4J0jT?utm_source=fbcom&utm_medium=storepage&utm_content=category_techandscience&utm_campaign=magswelove'+tas[1]);
			}
			else if(tas[1]=='Sports News This Week')
			{
				showFrame('https://flipboard.com/section/sports-weekly--bnOnWH?utm_source=fbcom&utm_medium=storepage&utm_content=category_sports&utm_campaign=magswelove'+tas[1]);
			}
			else if(tas[1]=='World News This Week')
			{
				showFrame('https://flipboard.com/section/world-news-watch-bRBfJf?utm_source=fbcom&utm_medium=storepage&utm_content=category_news&utm_campaign=magswelove'+tas[1]);
			}
			else
			{
				$('#click1').html("Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click3').html("Define <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click6').html("Image Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click7').html("Bing News Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				showDiv("",0);
			}
		}
		else if(tas[0]=='App')
		{
			if(tas[1]=='Calendar')
			{
				showCalendar();
			}
			else if(tas[1]=='Statistics')
			{
				showDiv("",3);
				showstats();
			}
			else if(tas[1]=='Calculator')
			{
				showDiv("",4);
				$('#calcinput').focus();
				calculate();
			}
			else if(tas[1]=='Digg')
			{
				showWebpage('digg');
			}
			else if(tas[1]=='Todoist')
			{
				showWebpage('todoist');
			}
			else if(tas[1]=='Flipboard')
			{
				showWebpage('flipboard');
			}
			else if(tas[1]=='Any.Do')
			{
				showWebpage('any.do');
			}
		}
		else
		{
			
			$('#click1').html("Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click3').html("Define <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click6').html("Image Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click7').html("Bing News Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			showDiv("",0);
		}
	}
}
function getTimeString(t1)
{
	var hours = parseInt((t1/(60*60*1000)));
	var days = parseInt((t1/(24*60*60*1000)));
	var minutes = parseInt((t1/(60*1000)));
	var seconds = parseInt((t1/(1000)));

	var str = "";
	if(days>0)
	{
		str = str + days + " days, ";
		hours-= days*24;
		minutes-= days*24*60;
		seconds-= days*24*60*60;
	}
	if(hours>0)
	{   
		str = str + hours + " hours, ";
		minutes-=hours*60;
		seconds-=hours*60*60;
	}
	if(minutes>0)
	{
		str = str + minutes + " minutes, ";
		seconds-=minutes*60;
	}
	str = str + seconds + " seconds";
	return str;
}

function setttime()
{
	if(globaltime==-2)
	{
		if(globaltask=='_firsttimeopen_') $("#minn").html('Take some time to explore JhonnyM!');
		else $("#minn").html('Get Moving!');
		return;
	}
	var d1 = new Date();
	var t = globaltime;
	if((t==-1 || globaltask.split(':')[0]=='App') && globaltask!='Sleeping')
	{
		$("#minn").html('I count only when it counts');
		return;
	}
	var t1 = d1.getTime();
	var str = "";
	str = "for ";
	t1 = t1-t;
	var hours = parseInt((t1/(60*60*1000)));
	var days = parseInt((t1/(24*60*60*1000)));
	var minutes = parseInt((t1/(60*1000)));
	var seconds = parseInt((t1/(1000)));
	if(days>0)
	{
		str = str + days + " days, ";
		hours-= days*24;
		minutes-= days*24*60;
		seconds-= days*24*60*60;
	}
	if(hours>0)
	{   
		str = str + hours + " hours, ";
		minutes-=hours*60;
		seconds-=hours*60*60;
	}
	if(minutes>0)
	{
		str = str + minutes + " minutes, ";
		seconds-=minutes*60;
	}
	str = str + seconds + " seconds";
	$("#minn").html(str);
	
}

function typedata(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


function bounceagain(idd)
{
	setTimeout(function(){$(idd).addClass('animated wobble');},10);
	$(idd).removeClass('animated wobble');
	$(idd).val("");
}

function hingeagain(idd)
{
	setTimeout(function(){$(idd).addClass('animated hinge form-control');},10);
	$(idd).removeClass();
	$(idd).val("");
}
function hashcode(str){
	var hash = 0;
	if (str.length == 0) return hash;
	for (i = 0; i < str.length; i++) {
		char = str.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function setCookie(cname,cvalue,exdays) {
	docCookies.setItem(cname,cvalue,Infinity);
	// var d = new Date();
	// d.setTime(d.getTime() + (exdays*24*60*60*1000));
	// var expires = "expires=" + d.toGMTString();
	// document.cookie = cname+"="+cvalue+"; "+expires;
}

function deletecoin()
{
	docCookies.removeItem('task');
	docCookies.removeItem('starttime');
}

function getCookie(cname) {
	return docCookies.getItem(cname);
}
