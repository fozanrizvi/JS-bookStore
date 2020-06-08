'use strict';

import 'bootstrap';
import '../css/style.scss';

const fetchApi = async (searchStr) => {
  const googleAPI = "https://www.googleapis.com/books/v1/volumes?maxResults=12&q=" + searchStr;
  const data = await fetch(googleAPI).then(r => r.json());
  return data;
}

class App {
  constructor() {
    this.searchInp = document.getElementById('serchBook');
    this.findButton = document.getElementById("findBook");
    this.findButton.addEventListener('click', this.getFetchBooksApiData.bind(this));
  }
  render(data) {
    if (data) {
      const { items } = data;
      const ul = document.createElement('UL');
      ul.classList.add('list-view');
      setTimeout(() => {
        renderView(items, ul);
        const booksData = JSON.parse(localStorage.getItem("bookItem"));
        const bookItems = booksData !== null ? [...booksData, items[0]] : [items[0]];
        localStorage.setItem('bookItem', JSON.stringify(bookItems));
        document.getElementsByClassName('no-records')[0].innerHTML = '';
        document.getElementsByClassName('spinner-loader')[0].style.display = 'none';
      }, 3000);
    }

  }
  getFetchBooksApiData() {
    const serachVal = this.searchInp.value;
    if(document.getElementsByClassName('list-view').length){
      document.getElementsByClassName('list-view')[0].remove();
    }
    if(serachVal === ''){
      return
    }
    document.getElementsByClassName('spinner-loader')[0].style.display = 'block';
    fetchApi(serachVal).then((response) => {
      this.searchInp.value = '';
      this.render(response);
    });
  }
}
const app = new App();

window.addEventListener('load', () => {
  const lastItem = getLastItem();
  if (lastItem !== '') {
    viewRender(lastItem)
  } else {
    app.render();
  }
});

const renderView = (items, ul) => {
  for (let i = 0; i < items.length; i++) {
    const li = document.createElement('LI');
    li.classList.add('image-list');
    const innerDiv = document.createElement('DIV');
    innerDiv.classList.add('image-list-inner');
    const img = document.createElement('IMG');
    img.setAttribute('src', items[i].volumeInfo.imageLinks.smallThumbnail);
    innerDiv.appendChild(img);
    li.appendChild(innerDiv);
    const content = document.createElement('DIV');
    content.classList.add('image-list-content');
    const h3 = document.createElement('H3');
    const h5 = document.createElement('H5');
    const p = document.createElement('P');
    h3.innerHTML = items[i].volumeInfo.title;
    h5.innerHTML = items[i].volumeInfo.authors.length ? items[i].volumeInfo.authors[0] : '';
    p.innerHTML = items[i].volumeInfo.description;
    content.appendChild(h3);
    content.appendChild(h5);
    content.appendChild(p);
    li.appendChild(content);
    ul.appendChild(li);
    document.getElementById("book-list").appendChild(ul);
  }
}
const viewRender = (item) => {
  const{volumeInfo} = item;
  const{categories} = volumeInfo;
  const promsie = fetchApi(categories[0]);
  promsie.then((response) => app.render(response));
}

const getLastItem = () => {
  const items = JSON.parse(localStorage.getItem("bookItem"));
  let categeory = '';
  if (items !== null) {
    document.getElementsByClassName('no-records')[0].innerHTML = '';
    if (items.length > 5) {
      const data = items.slice(Math.max(items.length - 5, 0));
      categeory = data[Math.floor(Math.random() * data.length)];
    }
  }
  return categeory;
}

const body = document.body || document.getElementsByTagName("body")[0]
const header = document.getElementsByClassName('navbar')[0];
body.onscroll = function () {
  const EleTop = document.body.scrollTop || document.documentElement.scrollTop;
  if (EleTop > 250) {
    header.classList.add('header-toggle-opacity');
  } else {
    header.classList.remove('header-toggle-opacity');
  }
}