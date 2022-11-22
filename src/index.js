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
    .then(data => {
      if (data.length > 10) {
        list.innerHTML = '';
        country.innerHTML = '';
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        country.innerHTML = '';
        list.innerHTML = createMarkupList(data);
      } else if (data.length === 1) {
        list.innerHTML = '';
        country.innerHTML = createMarkupCard(data[0]);
      }
    })
    .catch(err => {
      list.innerHTML = '';
      country.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCard(card) {
  const lng = [];
  for (key in card.languages) {
    lng.push(card.languages[key]);
  }
  const lngstr = lng.join(', ');

  return `<h2>
  <img src="${card.flags.svg}" alt="${card.name.official}" width="36">
  ${card.name.official}
  </h2>
  <p><b>Capital:</b> ${card.capital[0]}</p>
  <p><b>Population:</b> ${card.population}</p>
  <p><b>Languages:</b> ${lngstr}</p>`;
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
