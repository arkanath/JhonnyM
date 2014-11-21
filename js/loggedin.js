var x = 0;

var username;
var tablename;
var currentday;
var globaltask;
var globaltime;

var urltrigger = 0;
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

var loaded1 = 0;
var loaded2 = 0;
$('#rdigg').load(function(){
	$("#loading").hide();
  	$("#rdigg").show();
  	$("#didnot1").hide();
	loaded1 = 1;
  	
  	
  	$("#rdigg").contents().find("#digg-alerts-container").hide();
  	setTimeout(function(){
  			$("#rdigg").contents().find("#digg-header").hide();
  			setTimeout(function(){
  				$("#rdigg").contents().find("#digg-header").show();
  			},1000);
		},5000);

});
$('#todoframe').load(function(){
	
  	$("#loading2").hide();
  	$("#didnot2").hide();
  	$("#todoframe").show();
  	loaded2 = 1;

});
$(document).ready(function(){ 

	
	setTimeout(function(){
		if(loaded2==0) $('#didnot2').show();
	},10000);
	setTimeout(function(){
		if(loaded1==0) $('#didnot1').show();
	},10000);
	$('#clk').jsclock();
	$("#statcount").val(1);
	username = getCookie('username');
	tablename = getCookie('tablename');
	currentday = getCookie('currentday');
	globaltask = getCookie('task');
	if(globaltask=='_firsttimeopen_' || globaltask=='_justopened_') globaltime = -2;
	else globaltime = getCookie('starttime');

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
			if($("#statcount").val()<1)
			{
				bounceagain('#statcount');
			}
			else
			{
				//stat append
				showstats(currentday-$("#statcount").val());
				
			}
                     
		}
	});
	$('#task').focusout(function(){
		focusgaya();
		setTimeout(function(){sett()},10)
	});
	$('#task').focusin(function(){
		focusaaya();
				                          
	});
	document.getElementById('buttonstats').onclick = function()
	{
		if($('#buttonstats').html()=='Show Stats')
		{
			$("#sidebartasks").hide();
			$("#sidebarstats").show();
			showstats(currentday-$("#statcount").val());
			$('#buttonstats').html('Show Tasks');
		}else
		{
			$("#sidebarstats").hide();
			$("#sidebartasks").show();
			$('#buttonstats').html('Show Stats');
		
		}
	}
	document.getElementById('logoutbutton').onclick = function()
	{
		parseinput(1);
		$('#boddy').addClass('animated zoomOutDown');
		setTimeout(function(){
			document.cookie = "task=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			document.cookie = "starttime=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			document.cookie = "tablename=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
			document.cookie = "currentday=; expires=Thu, 01 Jan 1970 00:00:00 UTC";	
			window.location.replace('index.html');
		},1000);
		
	}
	
	document.getElementById('click1').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://www.bing.com/search?q='+gggl);
	}
	
	document.getElementById('click2').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://youtube.com/embed/?listType=search&list='+gggl);
	}
	document.getElementById('click3').onclick=function(){
		var gggl = 	globaltask;
		if(globaltask.split(':').length>1) gggl = globaltask.split(':')[1];
		showFrame('http://dictionary.reference.com/browse/'+gggl);
		$('#lower').hide();
		$('iframe').load(function() {
		    $('#lower').show();
		});
		
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
		showFrame('http://www.bing.com/images/search?q='+gggl);
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
	document.getElementById("linee").style.display = "none";
	document.getElementById("minn").style.display = "none";
	document.getElementById("iccon").style.display = "none";
        
}
function focusgaya()
{
	document.getElementById("uparwala").style.textAlign = "center";
	document.getElementById("lower").style.display = "block";
	document.getElementById("linee").style.display = "block";
	document.getElementById("minn").style.display = "block";
	document.getElementById("iccon").style.display = "block";

}

function showstats(frday)
{
	
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
	
	// repeat

	
}
function parseinput(flag)
{
	
	var tas = globaltask.split(':');
	globaltime = new Date().getTime() - globaltime;
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
}

function sett()
{
	if(globaltime==-2)
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
}

function showFrame(str)
{
	$('#lowerdisplay').hide();
	$('#lowerframe').show();
	document.getElementById("lowerframe").src= str;
}

function showDiv(str,flag)
{
	$('#lowerdisplay').show();
	$('#lowerframe').hide();
	document.getElementById("lowerframe").src= "";
	if(flag==1) 
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').hide();
		$('#abnormal').html(str);
	}else if(flag==2) 
	{
		$('#normal').hide();
		$('#abnormal').show();
		$('#calad').show();		
	}
	else if(flag==0)
	{
		$('#normal').show();
		$('#calad').hide();	
		$('#abnormal').hide();
	}
}
function setFrame(){
	var tas = globaltask.split(':');
	if(tas.length==1)
	{
		if(tas[0]=='_firsttimeopen_' || tas[0]=='_justopened_' || tas[0]=='')
		{
			showDiv("<h1>About JhonnyM</h1><hr style='width:50%;'><h2>Meet JhonnyM, your dumb assistant.<br></h2><h4 style='font-weght:200; text-align:justify; margin:10px;'>Just tell him what you are doing and he will try his best to serve you. He is <em>always</em> there to keep track of what you are up to. You can see the statistics and improve with time. For categorizing your processes, JhonnyM just picks the thing behind the first colon in your current task (We told you! He is dumb). E.g. 'Meeting: With John' would be categorized as Meeting. If no colon is present, he assumes you don't want him to count.<br>Your day count is maintained according to your sleep cycles. So whenever you inform JhonnyM that you are sleeping, he increments your day count.<br><br>Start by reading some tech news this week.</h4><h6>This app has been developed by <a href='http://cse.iitkgp.ac.in/~arkanath/'>Arkanath</a>.Report to him for bugs, or fix them on GitHub :)</h6></span>",1);
		}
		else if(tas[0]=='Sleeping')
		{
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-eye-close');
		}
		else
		{
			$('#click1').html("Bing Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click3').html("Define <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[0]+"</span>");
			$('#click6').html("Bing Image Search for <span style='font-weight:500;'>"+tas[0]+"</span>");
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
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-play-circle');
		}
		else if(tas[0]=='Search')
		{
			showFrame('http://www.bing.com/search?q='+tas[1]);
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-search');
		}
		else if(tas[0]=='Search News')
		{
			showFrame('http://www.bing.com/news/search?q='+tas[1]);
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-font');
		}
		else if(tas[0]=='Search Images')
		{
			showFrame('http://www.bing.com/images/search?q='+tas[1]);
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-picture');
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
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-globe');
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
				$('#click1').html("Bing Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click3').html("Define <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click6').html("Bing Image Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				$('#click7').html("Bing News Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
				showDiv("",0);
			}
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-book');
		}
		else if(tas[0]=='App')
		{
			if(tas[1]=='Calendar')
			{
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
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-calendar');
		}
		else
		{
			$('#iccon').removeClass();
			$('#iccon').addClass('animated zoomIn glyphicon glyphicon-thumbs-up');
			$('#click1').html("Bing Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click2').html("YouTube Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click3').html("Define <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click4').html("WikiHow Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click5').html("Wikipedia Results for <span style='font-weight:500;'>"+tas[1]+"</span>");
			$('#click6').html("Bing Image Search for <span style='font-weight:500;'>"+tas[1]+"</span>");
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

function taskupdate()
{
	var stryou = "http://youtube.com/embed/?listType"+'='+"search&list"+'=';
	stryou = stryou +""+ document.getElementById("task").value;
	document.getElementById("lowerframe").src=stryou;
	if(t3.indexOf("interested in tech")>-1)
	{
		document.getElementById("lowerframe").src='https://flipboard.com/section/the-verge-weekender%3A-best-of-the-week-b6O2hB?utm_source=fbcom&utm_medium=storepage&utm_content=category_techandscience&utm_campaign=magswelove';
		document.getElementById("lowerframe").style.backgroundImage="url('load.gif')";
	}
	else
	{
		//document.getElementById("lowerframe").src="";
		document.getElementById("lowerframe").style.backgroundImage="";
	}
    
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
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function deletecoin()
{
	document.cookie = "task=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.cookie = "starttime=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) != -1) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
