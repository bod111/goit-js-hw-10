import './css/styles.css';

import { fetchCountries } from './js/fetchCountries';
import refs from './js/refs';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

function removeElems() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function searchFunc(event) {
  fetchCountries(event.target.value)
    .then(data => {
      let count = data.length;
      if (count > 10) {
        removeElems();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (count >= 2 && count <= 10) {
        removeElems();
        renderListCountries(data);
      } else if (count === 1) {
        renderCountry(data);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderListCountries(dataCountries) {
  refs.countryInfo.innerHTML = '';
  let country = dataCountries
    .map(({ name, flags }) => {
      return `<li class="country-list-item"><div class="item"><img src="${flags.svg}"/><p>${name.official}</p></div></li>`;
    })
    .join('');
  refs.countryList.innerHTML = country;
}

function renderCountry(dataCountries) {
  refs.countryList.innerHTML = '';
  let country = dataCountries
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="wrapper-title">
      <img src="${flags.svg}" alt="${name.official}" />
      <p class="country-list-title bold">${name.official}</p>
      </div>
      <p><span class="bold">Capital: </span>${capital.join('')}</p>
      <p><span class="bold">Population: </span>${population}</p>
      <p><span class="bold">Languages: </span>${Object.values(languages).join(', ')}</p>`;
    })
    .join('');
  refs.countryInfo.innerHTML = country;
}

refs.inputRef.addEventListener('input', debounce(searchFunc, DEBOUNCE_DELAY));
