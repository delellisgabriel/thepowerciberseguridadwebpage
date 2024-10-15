// Dinamically set the current year in the footer
const setFullYearInFooter = () => document.getElementById('footerCurrentYear').textContent = new Date().getFullYear();

const toggleCssOnClick = () => {
    const toggleCss = () => {
      const styleSheetStatus = document.styleSheets[0].disabled;
      for(let i = 0; i < document.styleSheets.length; i++) {
        document.styleSheets[i].disabled = !styleSheetStatus;
      };
      toggleCssBtn.textContent = styleSheetStatus ? 'Disable CSS' : 'Enable CSS';
    }
    const toggleCssBtn = document.getElementById('toggle-css');
    if (!toggleCssBtn) return;
    toggleCssBtn.addEventListener('click', toggleCss);
};

const pokemonCard = (pokemon) => {
  const { localId, name, image } = pokemon;

  return (`
      <figure class="card-figure">
        <img src="${image}/low.webp" alt="${name} ${localId} card" />
        <figcaption>${name} - ${localId}</figcaption>
      </figure>
    `);
};

let isFetching = false;

const getPokemonCards = async (name) => {
    if (isFetching) {
        console.log("Already fetching data...");
        return;
    };
    // Set isFetching to true to prevent multiple fetch requests
    isFetching = true;
    const pokemonCardList = document.getElementById('pokemon-card-list');
    if (!pokemonCardList) {
        return;
    }
    pokemonCardList.innerHTML = `
        <span id="result">
            Loading... 🔃
            <span class="sr-only">Loading...</span>
        </span>
    `;
    // simulating slower response time to show loading state
    await new Promise(resolve => setTimeout(resolve, 0));
    const response = await fetch(`https://api.tcgdex.net/v2/en/cards?name=${name}`);
    if (!response.ok) {
        pokemonCardList.innerHTML = 'Failed to fetch Pokemon data 🤡';
        return;
    }
    const data = await response.json();
    if (!data || !data.length || data.length === 0) {
        pokemonCardList.innerHTML = 'No Pokemon found 😢';
        return;
    }
    pokemonCardList.innerHTML = '';
    data.forEach(pokemon => {
      if (!pokemon.image) return;
      const li = document.createElement('li');
      li.innerHTML = pokemonCard(pokemon);
      pokemonCardList.appendChild(li);
    });
    isFetching = false;
};

const handleFormSubmit = (event) => {
    event.preventDefault();
    const formElements = event.target.elements;
    const cardName = formElements['card-name'].value.toLowerCase();
    getPokemonCards(cardName);
};

window.onload = function ()  {
    setFullYearInFooter();
    toggleCssOnClick();
};
