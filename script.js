//simplificando o query selector
let cart = [];
let pizzaQt = 1;
let modalKey = 0;

const q = (el) => document.querySelector(el);
const qA = (el) => document.querySelectorAll(el);

const Pizza = {
  list(item, index) {
  //clonando a div que monta as pizzas.
  let pizzaItem = q('.models .pizza-item').cloneNode(true);
  
  pizzaItem.setAttribute('data-key', index)
  //colocando informações de cada pizza.
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `à partir de R$ ${item.price[0].toFixed(2)}`;

  Modal.open(pizzaItem);

  q('.pizza-area').append(pizzaItem);
  }
}

const Modal = {
  open(pizzaItem) {
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
      e.preventDefault();
  
      //target.closest procura o elemento mais próxima de <a> que possua a classe .pizza-item
      let key = e.target.closest('.pizza-item').getAttribute('data-key');
      modalKey = key;
      
      //colocando informações no modal
      this.populate(key);
      this.sizeChange(key);
      //colocando efeito de entrada do modal
      q('.pizzaWindowArea').style.opacity = 0;
      q('.pizzaWindowArea').style.display = 'flex';
  
      //colocando a opacidade 1 para mostrar o modal com efeito
      setTimeout(() => {
        q('.pizzaWindowArea').style.opacity = 1;
      }, 200);
    });
  },

  populate(key) {
    let pizzaInfo = q('.pizzaInfo');
    pizzaQt = 1;

    q('.pizzaBig img').src = pizzaJson[key].img;
    pizzaInfo.querySelector('h1').innerHTML = pizzaJson[key].name;
    pizzaInfo.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    pizzaInfo.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[2].toFixed(2)}`;

    //tirar a classe selected de todos para colocar apenas no grande.
    q('.pizzaInfo--size.selected').classList.remove('selected');

    //colocar tamanhos
    qA('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if(sizeIndex == 2) {
        //colocando classe selected no grande.
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = `(${pizzaJson[key].sizes[sizeIndex]})`;
    });

    q('.pizzaInfo--qt').innerHTML = pizzaQt;
  },

  addPizza() {
    pizzaQt++;
    q('.pizzaInfo--qt').innerHTML = pizzaQt;
  },

  removePizza() {
    if(pizzaQt == 1) {
      pizzaQt = 1;
    } else {
      pizzaQt -= 1;
    }

    q('.pizzaInfo--qt').innerHTML = pizzaQt;
  },

  sizeChange(key) {
    qA('.pizzaInfo--size').forEach((size, sizeIndex) => {
      size.addEventListener('click', () => {
        q('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');

        this.changePrice(sizeIndex, key);
      });
    });
  },

  changePrice(sizeIndex, key) {
    q('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price[sizeIndex].toFixed(2)}`;
  },

  close() {
    q('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
      q('.pizzaWindowArea').style.display = 'none';
    }, 500);
  }
}

const Cart = {
  add() {
    let size = parseInt(q('.pizzaInfo--size.selected').getAttribute('data-key'));
    
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
      cart[key].qt += pizzaQt;
    } else {
      cart.push({
        identifier,
        id: pizzaJson[modalKey].id,
        size,
        qt: pizzaQt
      });
    }

    this.update();
    Modal.close();
  },

  update() {
    q('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
      q('aside').classList.add('show');
      q('.cart').innerHTML = '';

      let subtotal = 0;
      let desconto = 0;
      let total = 0;

      for(let i in cart) {
        let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
        subtotal += pizzaItem.price[cart[i].size] * cart[i].qt;

        console.log(subtotal);

        let cartItem = q('.models .cart--item').cloneNode(true);
        let pizzaSize;

        switch(cart[i].size) {
          case 0:
            pizzaSize = 'P';
            break;
          case 1:
            pizzaSize = 'M';
            break;
          case 2:
            pizzaSize = 'G';
            break;
        }

        let pizzaName = `${pizzaItem.name} (${pizzaSize})`;

        cartItem.querySelector('img').src = pizzaItem.img;
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
        cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
          if(cart[i].qt > 1) {
            cart[i].qt--;
          } else {
            cart.splice(i, 1);
          }
          this.update();
        });

        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
          cart[i].qt++;
          this.update();
        });

        q('.cart').append(cartItem);
      }

      desconto = subtotal * 0.1;
      total = subtotal - desconto;
  
      q('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
      q('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
      q('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`
    } else {
      q('aside').classList.remove('show');
      q('aside').style.left = '100vw';
    }
  },

  open() {
    if (cart.length > 0) {
      q('aside').style.left = '0';
    }
  },

  close() {
    q('aside').style.left = '100vw';
  }
}

// q('.menu-openner').addEventListener('click', () => {

// })

const App = {
  init() {
    pizzaJson.map((item, index) => {
      Pizza.list(item, index);
    });
  }
}

App.init();