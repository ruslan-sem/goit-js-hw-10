export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/name';
  const PARAMS = 'fields=name,capital,population,flags,languages';

  return fetch(`${BASE_URL}/${name}?${PARAMS}`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}
