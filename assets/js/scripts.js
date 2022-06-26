let contentCards = document.getElementById('rowCata');
let botonAnterior = document.getElementById('botonAnterior');
let botonSiguiente = document.getElementById('botonSiguiente');
let selectOrderBy = document.getElementById("orderBy");
let selectFilterByLenguage = document.getElementById("filterByLanguage");
var query = db.collection('catas');
var orderField = "precio";
var directionDataBtnNext = "asc";
var directionDataBtnPrevious = "desc";
var orderStatus = false;
var selectorOrden;
let arrayCatas = [];
let minPrice = 0;
let maxPrice = 100;
let rbCountAll = document.getElementById("rbCountAll");
let rbCountVino = document.getElementById("rbCountVino");
let rbCountQueso = document.getElementById("rbCountQueso");
let rbCountJamon = document.getElementById("rbCountJamon");
let arrayAverageStars = [];
//LEER LOS DATOS
db.collection("catas").get().then((querySnapshot) => {
	querySnapshot.forEach((doc) => {
		arrayCatas.push({
			id: doc.id,
			descripcion: doc.data().descripcion,
			enlace: doc.data().enlace,
			enlaceCompra: doc.data().enlaceCompra,
			enlaceVideoPromocional: doc.data().enlaceVideoPromocional,
			idioma: doc.data().idioma,
			imagen: doc.data().imagen,
			nombre: doc.data().nombre,
			precio: doc.data().precio,
			tipologia: doc.data().tipologia,
			comentarios: doc.data().comentarios != undefined ? doc.data().comentarios : [],
			numeroReproducciones: doc.data().numeroReproducciones != undefined ? doc.data().numeroReproducciones : 0,
		});
		arrayCatas.sort((a, b) => {
			return a.precio - b.precio;
		});
		loadDocument(arrayCatas);
	});
	countElementsTypology(arrayCatas);
});

function countElementsTypology(arrayCatas) {
	rbCountVino.innerHTML = arrayCatas.countCertainElements("Vino");
	rbCountQueso.innerHTML = arrayCatas.countCertainElements("Queso");
	rbCountJamon.innerHTML = arrayCatas.countCertainElements("Jamón");
	rbCountAll.innerHTML = (arrayCatas.countCertainElements("Vino") +
		arrayCatas.countCertainElements("Queso") +
		arrayCatas.countCertainElements("Jamón"));
}
const loadDocument = (documentos) => {
	let imageLanguage;
	let imageCata;

	if (documentos.length > 0) {

		contentCards.innerHTML = '';
		documentos.forEach(documento => {
			if (documento.imagen != null && documento.imagen != "") {
				imageCata = documento.imagen;
			}
			if (documento.idioma == "ES") {
				imageLanguage = "https://firebasestorage.googleapis.com/v0/b/catasengrupouptasting.appspot.com/o/imagenes%2FflagES.png?alt=media&token=2a4a87a9-54b2-45db-b241-5feb5936d8f1";
			} else if (documento.idioma == "CA") {
				imageLanguage = "https://firebasestorage.googleapis.com/v0/b/catasengrupouptasting.appspot.com/o/imagenes%2FflagCA.png?alt=media&token=15e2927f-cbed-4552-9fb1-f7d2e5eaf9ff";
			} else if (documento.idioma == "IN") {
				imageLanguage = "https://firebasestorage.googleapis.com/v0/b/catasengrupouptasting.appspot.com/o/imagenes%2FflagIN.png?alt=media&token=c21e271a-68e8-4b1e-abb2-2ce80978e8e4";
			}
			contentCards.innerHTML += `
			<div class="col mb-5">
				<div class="card h-100">
					<!-- Product image-->
					<img alt="..." class="card-img-top pt-2 cataImgCard" src="${imageCata}"/>
					
					<!-- Product details-->
					<div class="card-body p-4">
						<div class="text-center">
							<h5 class="fw-bolder">${documento.nombre + " "}<img class="img-icon" src="${imageLanguage}"/></h5>
							<p class ="lines-5">${documento.descripcion}</p>
							<!-- Product price-->
							<a class="a-center" href="${documento.enlaceCompra}" target="_blank">
								<h5 class="a-center"> 
									<span>${documento.precio}&euro;</span>
									<img class="img-icon-2" src="./assets/img/buy_icon.svg"/> 
								</h5>
							</a>
						</div>
						<div class="text-center pt-3">
							<a class="btn btn-outline-dark mt-auto" href="${documento.enlace} "onclick="increaseViewCount('${documento.id}', '${documento.numeroReproducciones}')" target="_blank" rel="noopener noreferrer">
								Iniciar cata como anfitrión
							</a>
						</div>
					</div>
					<!-- Product actions-->

					<div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
						<div class="text-center">
							<div class="row">
								<div>
									${showAverageStars(documento.comentarios)}
									<div class="btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop${documento.id}">
										<i class="bi bi-chat-square-text-fill text-gray h4"><spam class="numComment">${documento.comentarios.length} </spam></i>
										
									</div>
								</div>
							</div>
						</div>
						<!-- Modal -->
						<div class="modal fade" id="staticBackdrop${documento.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title" id="staticBackdropLabel">Comentarios</h5>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
									</div>
									<div id="modalBody${documento.id}" class="modal-body">
										
									</div>
									<div class="modal-footer">
										<!--<button type="button" class="btn btn-primary">Guardar</button>-->
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			`;
			showBodyModalCata("staticBackdrop" + documento.id, "modalBody" + documento.id, documento.id, documento.comentarios);
		});
	}
}

function showAverageStars(commentData) {
	let averagePoints = 0;
	let nOfVal = 0;
	let comments = commentData;
	let stars = "";
	let contStars = 0;
	if (comments.length > 0) {
		comments.forEach(valoracio => {
			averagePoints = parseInt(averagePoints) + parseInt(valoracio.puntos);
			nOfVal++;
		});
		averagePoints = averagePoints / nOfVal;
		for (let i = 0; i < Math.floor(averagePoints); i++) {
			stars += `<i class="bi bi-star-fill h4 text-warning"></i>`;
			contStars++;
		}
		if (!Number.isInteger(averagePoints)) {
			stars += `<i class="bi bi-star-half h4 text-warning"></i>`;
			contStars++;
		}
		for (let i = contStars; i < 5; i++) {
			stars += `<i class="bi bi-star h4 text-warning"></i>`;
		}
		return stars;
	}
	else {
		return "No hay valoraciones";
	}
}

function showStars(commentStarsPoints) {
	let starPoints = parseInt(commentStarsPoints);
	let stars = "";
	let contStars = 0;

	if (starPoints > 0) {
		contStars = 0;
		for (let i = 1; i <= starPoints; i++) {
			stars += `<i class="bi bi-star-fill h4 text-warning"></i>`;
			contStars++;
		}
		for (let i = contStars; i < 5; i++) {
			stars += `<i class="bi bi-star h4 text-warning"></i>`;
		}
		return stars;
	}
}

var commentNewNumStar;
function toggleStars(numStars, id) {
	let numStarsAdded = parseInt(numStars);
	let starOne = document.getElementById("starOne" + id);
	let starTwo = document.getElementById("starTwo" + id);
	let starThree = document.getElementById("starThree" + id);
	let starFour = document.getElementById("starFour" + id);
	let starFive = document.getElementById("starFive" + id);
	commentNewNumStar = ""
	switch (numStarsAdded) {
		case 1:
			starOne.classList.add("text-warning");
			starTwo.classList.remove("text-warning");
			starThree.classList.remove("text-warning");
			starFour.classList.remove("text-warning");
			starFive.classList.remove("text-warning");
			commentNewNumStar = "1";
			break;
		case 2:
			starOne.classList.add("text-warning");
			starTwo.classList.add("text-warning");
			starThree.classList.remove("text-warning");
			starFour.classList.remove("text-warning");
			starFive.classList.remove("text-warning");
			commentNewNumStar = "2";
			break;
		case 3:
			starOne.classList.add("text-warning");
			starTwo.classList.add("text-warning");
			starThree.classList.add("text-warning");
			starFour.classList.remove("text-warning");
			starFive.classList.remove("text-warning");
			commentNewNumStar = "3";
			break;
		case 4:
			starOne.classList.add("text-warning");
			starTwo.classList.add("text-warning");
			starThree.classList.add("text-warning");
			starFour.classList.add("text-warning");
			starFive.classList.remove("text-warning");
			commentNewNumStar = "4";
			break;
		case 5:
			starOne.classList.add("text-warning");
			starTwo.classList.add("text-warning");
			starThree.classList.add("text-warning");
			starFour.classList.add("text-warning");
			starFive.classList.add("text-warning");
			commentNewNumStar = "5";
			break;
		default:
			starOne.classList.remove("text-warning");
			starTwo.classList.remove("text-warning");
			starThree.classList.remove("text-warning");
			starFour.classList.remove("text-warning");
			starFive.classList.remove("text-warning");
			commentNewNumStar = "0";
			break;
	}
}

function increaseViewCount(idCata, data) {
	let viewcount = data;
	viewcount++;
	db.collection("catas").doc(idCata).update({
		numeroReproducciones: viewcount
	});
}

function uploadComment(idCata) {
	let commentNewName = document.getElementById("newCataForm_field_1_" + idCata);
	let commentNewDescription = document.getElementById("newCataForm_field_2_" + idCata);
	let commentNewCurrentdate = new Date().toLocaleDateString();
	let mapToStore = "";

	if (commentNewName.value != "" && commentNewDescription.value != "" && commentNewNumStar != undefined && commentNewNumStar != "") {
		mapToStore = { "usuario": commentNewName.value, "comentario": commentNewDescription.value, "puntos": commentNewNumStar, "fecha": commentNewCurrentdate };
		db.collection("catas").doc(idCata).update({
			comentarios: firebase.firestore.FieldValue.arrayUnion(mapToStore)
		});
		toggleStars("0", idCata);
		commentNewName.value = "";
		commentNewDescription.value = "";
		alert("El comentario se ha guardado correctamente");
	} else {
		alert("Los campos no puden estar vacios");
	}
}

function showBodyModalCata(staticBackdrop, modalbodyId, id, commentData) {
	let divModal = document.getElementById(staticBackdrop);
	let divModalbodyId = document.getElementById(modalbodyId);
	let showComments = document.getElementById(id);
	let comments = commentData;
	comments = comments.reverse();
	showComments = "";
	if (comments.length > 0) {
		comments.forEach(comment => {
			divModalbodyId.innerHTML += `
										<div class="border mb-5">
											<div class="row">
												<div class="col-12 mt-3">
													<div class="text-center">
														${showStars(comment.puntos)}
													</div>
												</div>
												<div class="row">
													<div class="col-4 ps-4">${comment.usuario}</div>
													<div class="col-4"></div>
													<div class="col-4"><p class="float-end">${comment.fecha}<p></div>
												</div>
												<div class="row">
													<div class="col-12 ps-4 pb-2">
													${comment.comentario}
													</div>
												</div>
											</div>
										</div>
										`;
		});
	} else {
		divModalbodyId.innerHTML = "No hay valoraciones";
	}

	divModalbodyId.innerHTML += `
								<div class="border mb-3">
								<form id="d">
									<div class="col-12 mt-3">
										<div class="text-center">
											<i id="starOne${id}" class="bi bi-star-fill h4" onclick="toggleStars('${1}', '${id}')"></i>
											<i id="starTwo${id}" class="bi bi-star-fill h4" onclick="toggleStars('${2}', '${id}')"></i>
											<i id="starThree${id}" class="bi bi-star-fill h4" onclick="toggleStars('${3}','${id}')"></i>
											<i id="starFour${id}" class="bi bi-star-fill h4" onclick="toggleStars('${4}','${id}')"></i>
											<i id="starFive${id}" class="bi bi-star-fill h4" onclick="toggleStars('${5}','${id}')"></i>
										</div>
									</div>
									<div class="row">
										<div class="row">
											<div class="col-12 ps-4 mt-4">
												<div class="form-floating mb-3">
													<input type="text" id="newCataForm_field_1_${id}" class="form-control" placeholder="Nombre de cata"/>
													<label for="newCataForm_field_1">Nombre de cata</label>
												</div>
												<div class="form-floating">
													<textarea id="newCataForm_field_2_${id}" class="form-control" placeholder="Descripción" ></textarea>
													<label for="newCataForm_field_2">Descripción</label>
												</div>
											</div>
										</div>
										<div class="row">
											<div class="col-12 ps-4 mt-3 mb-4">
												<button type="button" onclick="uploadComment('${id}')" class="btn btn-primary float-end">Guardar</button>
											</div>
										</div>
									</div>
								</form>
								</div>
								`;

}
//FILTROS

//Radio button Tipologia
//Muestra que radio button a sido seleccionado
function valueSelected() {
	const radioButtons = document.querySelectorAll('input[name="cataTypology"]');
	let selectedSize;
	for (const radioButton of radioButtons) {
		if (radioButton.checked) {
			selectedSize = radioButton.value;
			break;
		}
	}
	return selectedSize;
}

function showTypology(arrayCatas, idioma, rdbValueTypology) {
	if (idioma == "all") {
		if (rdbValueTypology == "all") {
			return arrayfilteredData = arrayCatas;
		} else if (rdbValueTypology == "vino") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Vino");
		} else if (rdbValueTypology == "queso") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Queso");
		} else if (rdbValueTypology == "jamon") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Jamón");
		}
	} else if (idioma == "ES") {
		if (rdbValueTypology == "all") {
			return arrayfilteredData = arrayCatas;
		} else if (rdbValueTypology == "vino") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Vino");
		} else if (rdbValueTypology == "queso") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Queso");
		} else if (rdbValueTypology == "jamon") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Jamón");
		}
	} else if (idioma == "CA") {
		if (rdbValueTypology == "all") {
			return arrayfilteredData = arrayCatas;
		} else if (rdbValueTypology == "vino") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Vino");
		} else if (rdbValueTypology == "queso") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Queso");
		} else if (rdbValueTypology == "jamon") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Jamón");
		}
	} else if (idioma == "IN") {
		if (rdbValueTypology == "all") {
			return arrayfilteredData = arrayCatas;
		} else if (rdbValueTypology == "vino") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Vino");
		} else if (rdbValueTypology == "queso") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Queso");
		} else if (rdbValueTypology == "jamon") {
			return arrayfilteredData = arrayCatas.filter(a => a.tipologia == "Jamón");
		}
	}
}

//Slider rango precio
$(".js-range-slider").ionRangeSlider({
	type: "double",
	min: 0,
	max: 100,
	from: 0,
	to: 100,
	grid: false,
	onStart: function (data) {
	},
	onChange: function (data) {
		minPrice = data.from;
		maxPrice = data.to;
	}
});

let rangSliderPrice = $(".js-range-slider").data("ionRangeSlider");
//Devuelve el número total de lementos que le pases.
Array.prototype.countCertainElements = function (value) {
	return this.filter(arrayElement => arrayElement.tipologia == value).length;
}

//
document.getElementById("filterRangePrice").addEventListener("click", () => {
	let rdbValueTypology = valueSelected();
	let arrayfilteredData = [];

	if (Number.isNaN(minPrice) == false && minPrice <= maxPrice) {
		if (selectFilterByLenguage.selectedOptions[0].value == "all") {
			if (rdbValueTypology == "all") {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice);
				countElementsTypology(arrayfilteredData);
			} else {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice);
				arrayfilteredData = showTypology(arrayfilteredData, "all", rdbValueTypology);
				countElementsTypology(arrayfilteredData);
			}

		} else if (selectFilterByLenguage.selectedOptions[0].value == "ES") {
			if (rdbValueTypology == "all") {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "ES");
				countElementsTypology(arrayfilteredData);
			} else {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "ES");
				arrayfilteredData = showTypology(arrayfilteredData, "ES", rdbValueTypology);
				countElementsTypology(arrayfilteredData);
			}

		} else if (selectFilterByLenguage.selectedOptions[0].value == "CA") {
			if (rdbValueTypology == "all") {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "CA");
				countElementsTypology(arrayfilteredData);
			} else {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "CA");
				arrayfilteredData = showTypology(arrayfilteredData, "CA", rdbValueTypology);
				countElementsTypology(arrayfilteredData);
			}

		} else if (selectFilterByLenguage.selectedOptions[0].value == "IN") {
			if (rdbValueTypology == "all") {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "IN");
				countElementsTypology(arrayfilteredData);
			} else {
				arrayfilteredData = arrayCatas.filter(a => a.precio >= minPrice && a.precio <= maxPrice && a.idioma == "IN");
				arrayfilteredData = showTypology(arrayfilteredData, "IN", rdbValueTypology);
				countElementsTypology(arrayfilteredData);
			}
		}
	}

	//Ordenar datos
	//Si no hay datos
	if (arrayfilteredData.length == 0) {
		contentCards.innerHTML = '<h3 class="sinResultados text-center w-100">No se han encontrado resultados</h3>';

	} else {
		//Si hay datos en el array
		if (selectOrderBy.selectedOptions[0].value == "lowPrice") {
			arrayfilteredData.sort((a, b) => {
				return a.precio - b.precio;
			});
		} else if (selectOrderBy.selectedOptions[0].value == "highPrice") {
			arrayfilteredData.sort((b, a) => {
				return a.precio - b.precio;
			});
		}
		loadDocument(arrayfilteredData);
	}
});
