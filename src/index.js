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
        Notiflix.Notify.warning('From 2 to 10');
      } else if (data.length === 1) {
        Notiflix.Notify.success('OK. 1');
      }
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
