var regtoggle = 0;
window.onload = initload;
var x = 0;
function getZoom(x)
{
	var xx = ((600-x)*(800-x))/50001.0;
	return xx;
}
function initload(){ 
	if(getCookie('username')!='') window.location.replace('loggedin.html');
	else $('#boddy').css('display','block');
	html5sql.openDatabase("users","Username Database",	1*1024*1024);
	html5sql.process(
		[
		"CREATE TABLE IF NOT EXISTS users (name varchar(255), pass varchar(255))",
		],
		function(transaction, results){
		},      
		function(error, statement){
			alert("Error: " + error.message + " when processing " + statement);
		}    
	);
	var rowsize;
	html5sql.process(
		[
		"SELECT * from users;",
		],
		function(transaction, results){
			rowsize = results.rows.length;
			if(rowsize==0)
			{
				register();
			}
			else
			{
				login();
			}
		},      
		function(error, statement){
			alert("Error: " + error.message + " when processing " + statement);
		}    
	);
	$("#pass").keyup(function (e) {                         
		if (e.keyCode === 13) {
			decide();
		}
	});
	$("#pass2").keyup(function (e) {                         
		if (e.keyCode === 13) {
			decide();
		}
	});
	$("#username").keyup(function (e1) {
                                   
		if (e1.keyCode === 13) {
			decide();
		}
	});
	$( "#hhh" ).click(function() {
		register();
	});
}


function typedata(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function login(){
	regtoggle = 0;
	$('#conf').hide();
	$('#hhh').show();
	document.getElementById('logtoggle').innerHTML ='Log In';
}

function register(){
	regtoggle = 1;
	$('#hhh').hide();
	document.getElementById('logtoggle').innerHTML = "Register";
	$('#conf').show();
}

var pressed;

function gotolog()
{
	alert('You have successfully logged in!');
	window.location.replace('loggedin.html');
}

function decide(){
	if(regtoggle == 0)
	{
		html5sql.process(
			[
			"SELECT * from users WHERE name = '"+$("#username").val()+"'",
			],
			function(transaction, results){
				results.rows.length;
				if(results.rows.length==0)
				{
					bounceagain('#username');
				}
				else if(results.rows.item(0)['pass']!=hashcode($("#pass").val()))
				{
					bounceagain('#pass');
				}
				else {
					
					var tablename = "table_"+results.rows.item(0)['name']+"_"+results.rows.item(0)['pass'];
					html5sql.process(
						[
						"CREATE TABLE IF NOT EXISTS "+tablename+" (type varchar(255), day bigint, time bigint)",
						],
						function(transaction, results){
							
							html5sql.process(
								[
								"SELECT * from "+tablename,
								],
								function(transaction, results){
									rowsize = results.rows.length;
									if(rowsize==0)
									{
										html5sql.process(
											[
											"INSERT INTO "+tablename+" VALUES ('currentday',0,1);",
											"INSERT INTO "+tablename+" VALUES ('Search',0,0);",
											"INSERT INTO "+tablename+" VALUES ('Youtube',0,0);",
											"INSERT INTO "+tablename+" VALUES ('Search Images',0,0);",
											"INSERT INTO "+tablename+" VALUES ('Search News',0,0);",
											"INSERT INTO "+tablename+" VALUES ('URL',0,0);",
											"INSERT INTO "+tablename+" VALUES ('Calculate',0,0);",						
											"INSERT INTO "+tablename+" VALUES ('Define',0,0);",																						
											],
											function(transaction, results){
												setCookie('username',$("#username").val(),30);
												setCookie('tablename',tablename,30);
												setCookie('currentday',1,30);
												setCookie('task','_firsttimeopen_',30);
												$('#mirror').addClass('animated hinge');
												$('#mirror').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', gotolog());
											},      
											function(error, statement){
												alert("Please report to developer following bug: " + error.message + " when processing " + statement);
											}    
										);
									}
									else
									{
										html5sql.process(
											[
											"SELECT * FROM "+tablename+" WHERE type = 'currentday'",
											],
											function(transaction, results){
												
												setCookie('username',$("#username").val(),30);
												setCookie('tablename',tablename,30);
												setCookie('currentday',results.rows.item(0)['time'],30);
												setCookie('task','_justopened_',30);
												$('#mirror').addClass('animated hinge');
												$('#mirror').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', gotolog());
											},      
											function(error, statement){
												alert("Please report to developer following bug: " + error.message + " when processing " + statement);
											}    
										);
									}
								},      
								function(error, statement){
									alert("Error: " + error.message + " when processing " + statement);
								}    
							);
							
						},      
						function(error, statement){
							alert("Error: " + error.message + " when processing " + statement);
						}    
					);
					
				}
			},      
			function(error, statement){
				alert("Error: " + error.message + " when processing " + statement);
			}    
		);
	}
	else{
		html5sql.process(
			[
			"SELECT * from users WHERE name = '"+$("#username").val()+"'",
			],
			function(transaction, results){
				results.rows.length;
				if(results.rows.length==0)
				{
					if($("#username").val()=="")
					{
						bounceagain('#username');
					}
					else if($("#pass").val()=="")
					{
						bounceagain('#pass');
					}else if($("#pass2").val()!=$("#pass").val())
					{
						bounceagain('#pass2');
					}else
					{
						html5sql.process(
							[
							"INSERT INTO users VALUES ('"+$('#username').val()+"',"+hashcode($("#pass").val())+")",
							],
							function(transaction, results){
								login();
							},      
							function(error, statement){
								alert("Please report to developer following bug: " + error.message + " when processing " + statement);
							}    
						);
					}
				}
				else
				{
					bounceagain('#username');
				}
			},
			function(error, statement){
				alert("Error: " + error.message + " when processing " + statement);
			}    
		);
	}
}

function bounceagain(idd)
{
	setTimeout(function(){$(idd).addClass('animated wobble form-control');},10);
	$(idd).removeClass();
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
	return Math.abs(hash);
}

function setCookie(cname,cvalue,exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires=" + d.toGMTString();
	document.cookie = cname+"="+cvalue+"; "+expires;
}

function deleteco()
{
	document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.cookie = "tablename=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
	document.cookie = "currentday=; expires=Thu, 01 Jan 1970 00:00:00 UTC";	
	
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
