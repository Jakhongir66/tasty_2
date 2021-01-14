


// =======================================================================================================



$(window).on('scroll', function () {

	if ($(this).scrollTop() > 100) {
		$('.header').addClass("sticky");
		$('main').css("margin-top", "120px");
	} else {
		$('.header').removeClass("sticky");
		$('main').css("margin-top", "0px");
	}
});
// $('.wrapper').addClass('loaded');
$('.icon-menu').click(function (event) {
	event.preventDefault();
	$(this).toggleClass('_active');
	$('.menu').toggleClass('_active');
	$('body').toggleClass('_lock');
})
// =======================================================================================================
// Sliders:
let swiperMain = new Swiper('.mainslider__body', {
	// direction: 'vertical',
	slidesPerView: 1,
	autoHeight: false,
	slidesPerGroup: 1,
	centeredSlides: true,
	initialSlide: 1,
	slidesPerColumn: 1,
	loop: true,
	autoplay: {
		delay: 3000,
	},
	speed: 600,
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev'
	},
});
// _ibg
function _ibg() {
	$.each($('._ibg'), function (index, val) {
		if ($(this).find('img').length > 0) {
			$(this).css('background-image', 'url("' + $(this).find('img').attr('src') + '")');
		}
	})
}
_ibg();
// =======================================================================================================
(function () {
	let navLinks = $('nav ul li a'),
		// navM = $('nav').height(),
		navM = 40,
		section = $('section'),
		documentEl = $(document);

	documentEl.on('scroll', function () {
		let currentScrollPage = documentEl.scrollTop();

		section.each(function () {
			let self = $(this);
			if (self.offset().top < (currentScrollPage + navM) && (currentScrollPage + navM) < (self.offset().top + self.outerHeight())) {
				let targetClass = '.' + self.attr('class') + '-page';
				navLinks.removeClass('_active');
				$(targetClass).addClass('_active')
			}
		});
	});
})();
$(document).ready(function () {
	$('nav a[href^="#"]').click(function () {
		let target = $(this).attr('href');
		$('html, body').animate({
			scrollTop: $(target).offset().top
		}, 500);
		// $('nav a[href^="#"]').removeClass('_active');
		// $(this).addClass('_active')
		return false
	});
});
// =======================================================================================================
let select = function () {
	let selectHeader = document.querySelectorAll('.select__header');
	let selectItem = document.querySelectorAll('.select__item');

	selectHeader.forEach(item => {
		item.addEventListener('click', selectToggle)
	});

	selectItem.forEach(item => {
		item.addEventListener('click', selectChoose)
	});

	function selectToggle() {
		this.parentElement.classList.toggle('is-active');
	}

	function selectChoose() {
		let text = this.innerText,
			select = this.closest('.select'),
			currentText = select.querySelector('.select__current');
		currentText.innerText = text;
		select.classList.remove('is-active');

	}
};

select();
// =======================================================================================================
(function () {
	let original_positions = [];
	let da_elements = document.querySelectorAll('[data-da]');
	let da_elements_array = [];
	let da_match_media = [];
	// Заполняем массивы
	if (da_elements.length > 0) {
		let number = 0;
		for (let index = 0; index < da_elements.length; index++) {
			const da_element = da_elements[index];
			const da_move = da_element.getAttribute('data-da');
			const da_array = da_move.split(',');
			if (da_array.length == 3) {
				da_element.setAttribute('data-da-index', number);
				// Zapolnyaem massiv pervonachalniy pozitsii
				original_positions[number] = {
					"parent": da_element.parentNode,
					"index": index_in_parent(da_element)
				};
				// Zapolnyaem massiv elementov
				da_elements_array[number] = {
					"element": da_element,
					"destination": document.querySelector('.' + da_array[0].trim()),
					"place": da_array[1].trim(),
					"breakpoint": da_array[2].trim()
				}
				number++;
			}
		}
		dynamic_adapt_sort(da_elements_array);

		// Sozdaem sobitia v tochke brekpointa
		for (let index = 0; index < da_elements_array.length; index++) {
			const el = da_elements_array[index];
			const da_breakpont = el.breakpoint;
			const da_type = "max"; // Dlya MobileFirst pomenyat na min

			da_match_media.push(window.matchMedia("(" + da_type + "-width: " + da_breakpont + "px)"));
			da_match_media[index].addListener(dynamic_adapt);

		}
	}
	// Osnovnaya funksiya
	function dynamic_adapt(e) {
		for (let index = 0; index < da_elements_array.length; index++) {
			const el = da_elements_array[index];
			const da_element = el.element;
			const da_destination = el.destination;
			const da_place = el.place;
			const da_breakpont = el.breakpoint;
			const da_classname = "_dynamic_adapt_" + da_breakpont;

			if (da_match_media[index].matches) {
				// Perebrasivaem elementi
				if (!da_element.classList.contains(da_classname)) {
					let actual_index;
					if (da_place == 'first') {
						actual_index = index_of_elements(da_destination)[0];
					} else if (da_place == 'last') {
						actual_index = index_of_elements(da_destination)[index_of_elements(da_destination).length];
					} else {
						actual_index = index_of_elements(da_destination)[da_place];
					}
					da_destination.insertBefore(da_element, da_destination.children[actual_index]);
					da_element.classList.add(da_classname);
				}
			} else {
				// Vozvrashaet na mesto
				if (da_element.classList.contains(da_classname)) {
					dynamic_adapt_back(da_element);
					da_element.classList.remove(da_classname);
				}
			}
		}
		custom_adapt();
	}

	// Vizov osnovnoi funksii
	dynamic_adapt();

	// Funksia vozvrat na mesto
	function dynamic_adapt_back(el) {
		const da_index = el.getAttribute('data-da-index');
		const original_place = original_positions[da_index];
		const parent_place = original_place['parent'];
		const index_place = original_place['index'];
		const actual_index = index_of_elements(parent_place, true)[index_place];
		parent_place.insertBefore(el, parent_place.children[actual_index]);
	}
	// Funksia polucheniya indeksa vnutri roditelya
	function index_in_parent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}
	// Funksia polucheniya massiva indeksov elementov vnutri roditelya
	function index_of_elements(parent, back) {
		const children = parent.children;
		const children_array = [];
		for (let i = 0; i < children.length; i++) {
			const children_element = children[i];
			if (back) {
				children_array.push(i);
			} else {
				// Isklyuchaya perenesenniy element
				if (children_element.getAttribute('data-da') == null) {
					children_array.push(i);
				}
			}
		}
		return children_array;
	}
	// Sortirovka obekta
	function dynamic_adapt_sort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 } // Dlya MobileFirst pomenyat
		});
		arr.sort(function (a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	// Dopolnitelniy senarii adaptatsii
	function custom_adapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}

	// Слушаем изменение размера экрана ----<<>>

}());

// Обьявленям переменные
// const parent_original = document.querySelector('.content__blocks_city');
// const parent = document.querySelector('.content__column_river');
// const item = document.querySelector('.content__block_item');

// Слушаем изменение размера экрана
window.addEventListener('resize', function (event) {
	const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (viewport_width < 992) {
		if (!item.classList.contains('done')) {
			parent.insertBefore(item, parent.children[2]);
			item.classList.add('done');
		}
	} else {
		if (item.classList.contains('done')) {
			parent_original.insertBefore(item, parent_original.children[2]);
			item.classList.remove('done');
		}
	}
});

// =======================================================================================================
const maskPhone = () => {
	const inputsPhone = document.querySelectorAll('input[name="phone"]');

	inputsPhone.forEach((input) => {
		let keyCode;

		const mask = (event) => {
			event.keyCode && (keyCode = event.keyCode);
			let pos = input.selectionStart;

			if (pos < 3) {
				event.preventDefault();
			}
			let matrix = "+998 (__) ___ __ __ ",
				i = 0,
				def = matrix.replace(/\D/g, ""),
				val = input.value.replace(/\D/g, ""),
				newValue = matrix.replace(/[_\d]/g, (a) => {
					if (i < val.length) {
						return val.charAt(i++) || def.charAt(i);
					} else {
						return a;
					}
				});
			i = newValue.indexOf("_");
			if (i !== -1) {
				i < 5 && (i = 3);
				newValue = newValue.slice(0, i);
			}

			let reg = matrix
				.substr(0, input.value.length)
				.replace(/_+/g, (a) => {
					return "\\d{1," + a.length + "}";
				})
				.replace(/[+()]/g, "\\$&");
			reg = new RegExp("^" + reg + "$");
			if (!reg.test(input.value) || input.value.length < 5 || (keyCode > 20 && keyCode < 30)) {
				input.value = newValue;
			}
			if (event.type == "blur" && input.value.length < 5) {
				input.value = "";
			};
		};
		input.addEventListener("input", mask, false);
		input.addEventListener("focus", mask, false);
		input.addEventListener("blur", mask, false);
		input.addEventListener("keydown", mask, false);
	});
}
maskPhone();

// =======================================================================================================

// let variousItem = document.querySelectorAll('[data-card-item]');
// // let item = document.querySelectorAll('[data-card-v]')

// variousItem.forEach(button => {
// 	button.addEventListener('click', activeCard)
// });
// function activeCard() {
// 	// item.classList.toggle('_active')
// 	this.classList.toggle('_active')
// }
$('[data-card-item]').on('click', function () {
	$(this).toggleClass('_active')
});
$(document).on('click', '.item-various__type', function () {
	$(this).addClass('_active').siblings().removeClass('_active')
});
$(document).on('click', '.item-various__dough', function () {
	$(this).addClass('_active').siblings().removeClass('_active')
});
$('.product-info__image').on('click', function () {
	$('.product-info__content').toggleClass('_active')
});
document.documentElement.addEventListener('click', function (e) {
	if (!e.target.closest('.product-info__image')) {
		let one = document.querySelector('.product-info__content');
		one.classList.remove('_active');
	}
});

