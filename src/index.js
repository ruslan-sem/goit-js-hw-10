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
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        // Notiflix.Notify.warning('From 2 to 10');
        country.innerHTML = '';
        list.innerHTML = createList(data);
      } else if (data.length === 1) {
        // Notiflix.Notify.success('OK. 1');
        list.innerHTML = '';
        country.innerHTML = createCard(data[0]);
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createCard(card) {
  console.log(card);
  let lng = [];
  for (key in card.languages) {
    lng.push(card.languages[key]);
  }
  const lngstr = lng.join(', ');
  console.log(
    card.flags.svg,
    card.name.official,
    card.capital[0],
    card.population,
    lngstr
  );

  return `<h2>
  <img src="${card.flags.svg}" alt="${card.name.official}" width="36">
  ${card.name.official}
  </h2>
  <p><b>Capital:</b> ${card.capital[0]}</p>
  <p><b>Population:</b> ${card.population}</p>
  <p><b>Languages:</b> ${lngstr}</p>`;
}

function createList(cardarr) {
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
