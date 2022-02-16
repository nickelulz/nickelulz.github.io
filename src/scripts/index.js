function lainButtonPressed() {
	window.location.href = "secret.html";
}

const welcomes = [
	"WELCOME",
	"HELLO",
	"WILKOMMEN",
	"BIENVENIDOS",
	"WELKOM",
	"BIENVENU",
	"KONNICHIWA",
	"BONJOUR",
	"KAMUSTA"
];

const motds = [
	"the birds work for the bourgeoisie",
	"prank em\', john",
	"nam sucks",
	"nobody likes namathan le"
];

const videos = [
	// prank em john
	"https://www.youtube.com/embed/h4RbrDxtFmg",

	// clash royale king laugh
	"https://www.youtube.com/embed/suwRxhXQRek",

	// hotline bling android quality
	"https://www.youtube.com/embed/pcI0aFIzZfE",

	// buffcorrell - duvet
	"https://www.youtube.com/embed/VGWVokNaanU",

	// buffcorrell - cant get over you
	"https://www.youtube.com/embed/TepmnO9rvz8",

	// navi play track 44
	"https://www.youtube.com/embed/M0PY3a3q43k",

	// water gun fight
	"https://www.youtube.com/embed/pys0n-aqgKg"
];

const pictures = [
	// cringe
	"watergunfight2.png",

	// cheeseburger baby
	"cheeseburger.png",

	// bruce young
	"brucey.JPG",

	// no bitches aot meme
	"no_bitches_aot.jpg"
];

window.onload = function () {
	document.getElementById("welcome").innerHTML = welcomes[Math.floor(Math.random()*welcomes.length)] + "!";
	document.getElementById("motd").innerHTML = motds[Math.floor(Math.random()*motds.length)];
	document.getElementById('player').innerHTML = `<iframe width="560" height="315" src="${videos[Math.floor(Math.random()*videos.length)]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
	document.getElementById('frame').setAttribute('src', `res/images/frames/${pictures[Math.floor(Math.random()*pictures.length)]}`);
}