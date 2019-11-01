//carregar pelo cookie o css desejado

function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    console.log(v);
    return v ? v[2] : null;
}


function deleteCookie(name) { setCookie(name, '', -1); }
//deleteCookie("style");

function changeCSS(cssFile, cssLinkIndex) {

	if(cssFile[cssFile.length - 1] == "1"){
		otherStyle = "style_2";
		document.getElementById("estilo_atual").innerHTML = "Estilo: Estilo 1";
	} else {
		otherStyle = "style_1";
		document.getElementById("estilo_atual").innerHTML = "Estilo: Estilo 2";
	}
	setCookie("style", cssFile, 10);
	console.log("Setado!");

	var newFunction = "changeCSS('"+ otherStyle +"','"+ cssFile +"')";
	document.getElementById("estilo").setAttribute('onclick', newFunction);
	cssFile = "css/"+ cssFile + ".css";
	cssLinkIndex = "css/"+ cssLinkIndex + ".css";
  var oldlink = document.getElementsByTagName("link").item(cssLinkIndex);

  var newlink = document.createElement("link");
  newlink.setAttribute("rel", "stylesheet");
  newlink.setAttribute("type", "text/css");
  newlink.setAttribute("href", cssFile);

  document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
}
		

		function alterar(id, valor){
			document.getElementById(id).innerHTML = valor;
		}

		
