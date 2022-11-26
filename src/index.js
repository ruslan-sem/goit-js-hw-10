import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const country = document.querySelector('.country-info');

input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  let query = event.target.value.trim();
  if (query === '') {
    list.innerHTML = '';
    country.innerHTML = '';
    return;
  }
  fetchCountries(query)
    .then(json => {
      if (json.length > 10) {
        list.innerHTML = '';
        country.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (json.length >= 2 && json.length <= 10) {
        country.innerHTML = '';
        list.innerHTML = createMarkupList(json);
        return;
      }
      if (json.length === 1) {
        list.innerHTML = '';
        country.innerHTML = createMarkupCard(json);
      }
    })
    .catch(() => {
      list.innerHTML = '';
      country.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCard(card) {
  const lng = [];
  for (let key in card[0].languages) {
    lng.push(card[0].languages[key]);
  }

  return `<h2>
  <img src="${card[0].flags.svg}" alt="${card[0].name.official}" width="36">
  ${card[0].name.official}
  </h2>
  <p><b>Capital:</b> ${card[0].capital[0]}</p>
  <p><b>Population:</b> ${card[0].population}</p>
  <p><b>Languages:</b> ${lng.join(', ')}</p>`;
}

function createMarkupList(cardarr) {
  return cardarr
    .map(
      el =>
        `<li class="country-list__item">
        <img src="${el.flags.svg}" alt="${el.name.official}" width="36">
        ${el.name.official}
        </li>`
    )
    .join('');
}
