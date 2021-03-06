const RED_COLOR = '#ff0000';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

// day #1

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');

//day #2

const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');

const inputSearch = document.querySelector('.input-search');

let login = localStorage.getItem('gloDelivery');

// Day #4

const cart = [];

// Day#3

const getData = async function(url) {
  
  const response = await fetch(url);
  
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }

  return await response.json();

};


function validName(str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toogleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';

  if (modalAuth.classList.contains('is-open')) {
    disabledScroll();
  } else {
    enableScroll();
  }
}

function autorized() {

  function logOut() { 

    login = null;

    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

function notAutorized() {

  function logIn(event) {
    // Проверка на введенные логина
    event.preventDefault();

    if (validName(loginInput.value)) {

      login = loginInput.value;
  
      localStorage.setItem('gloDelivery', login);
  
      toogleModalAuth();
  
      buttonAuth.removeEventListener('click', toogleModalAuth);
      closeAuth.removeEventListener('click', toogleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();

    } else {
      // alert('Your login')
      loginInput.style.borderColor = RED_COLOR;
      loginInput.value = '';
    }

  }

  buttonAuth.addEventListener('click', toogleModalAuth);
  closeAuth.addEventListener('click', toogleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (event) {
    console.log(event.target);
    if (event.target.classList.contains('is-open')) {
      toogleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  }
}

// Day 2 //

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {
  
  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
      <img src="${image}" alt=${name} class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            ${stars}
          </div>
          <div class="price">От ${price} ₽</div>
          <div class="category">${kitchen}</div>
        </div>
      </div>
  `;

  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);

}

function createCardGood({ image, description, name, price, id}) {

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src=${image} alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">От ${price} ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {

  const target = event.target;

  if (login) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {

      // console.log(restaurant.dataset.products);
      
      cardsMenu.textContent = '';
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      const {name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function(data) {
        data.forEach(createCardGood);
      });

    }
  } else {
    toogleModalAuth();
  }

}

function addToCart(event) {
  
  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;
    cart.push({
      id: id,
      title: title,
      cost: cost
    });

    console.log(cart);
  }
}

function init() {

  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);
  
  cardsMenu.addEventListener('click', addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {

    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');

  });

  checkAuth();

  inputSearch.addEventListener('keypress', function(event) {

    if (event.charCode === 13) {
      
      const value = event.target.value.trim();

      if (!value) {

        event.target.style.backgroundColor = RED_COLOR;
        event.target.value = '';
        setTimeout(function() {
          event.target.style.backgroundColor = '';
        }, 1500);
        return;
      }

      getData('./db/partners.json')
      .then(function (data) {
        return data.map(function(partner) {
          return partner.products;
        });
      })
      .then(function (linksProduct) {

        cardsMenu.textContent = '';

        linksProduct.forEach(function(link) {
          getData(`./db/${link}`)
            .then(function(data) {

              const resultSearch = data.filter(function(item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });
              
              containerPromo.classList.add('hide');
              restaurants.classList.add('hide');
              menu.classList.remove('hide');

              restaurantTitle.textContent = 'Результат поиска';
              restaurantRating.textContent = '';
              restaurantPrice.textContent = '';
              restaurantCategory.textContent = 'разное';
              resultSearch.forEach(createCardGood);
            });
        });
      });
    }
  });

  // Slider

  new Swiper('.swiper-container', {
    sliderPreview: 1,
    loop: true,
    autoplay: true,
    effect: 'coverflow',
    grabCursor: true,
    // cubeEffect: {
    //   shadow: false,
    // },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    }
  });
  
}

init();