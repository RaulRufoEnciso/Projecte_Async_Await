// Claus
const keys = {
    api_key: '18306d2b6411ac1e14ce3c250066a7a1',
    session_id: '56dccd551dbc5cf5f3c303ef10fdd74c13fc8d9a',
    account_id: '21240784'
}

let moviesResult = document.getElementById("moviesResult");


async function setFav(id, favBool){
    const url = `https://api.themoviedb.org/3/account/${keys.account_id}/favorite?api_key=${keys.api_key}&session_id=${keys.session_id}`;
    const body = {
        media_type: "movie",
        media_id: id,
        favorite: favBool
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(`ID ${id} marked as ${favBool}`);
        showFavs(); // Recargar la lista de favoritos
    } catch (error) {
        console.error('Error setting favorite:', error);
    }
}


async function showFavs(){
    const url = `https://api.themoviedb.org/3/account/${keys.account_id}/favorite/movies?api_key=${keys.api_key}&session_id=${keys.session_id}&language=en-US&sort_by=created_at.asc&page=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        moviesResult.innerHTML = ""; // Limpiar los resultados previos
        data.results.forEach(movie => printMovie(movie, true, false));
    } catch (error) {
        console.error('Error fetching favorite movies:', error);
    }
}


async function searchMovies(query) {
    clearInput();
    removeActive();
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${keys.api_key}&query=${encodeURIComponent(query)}`;

    try {
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        const movies = searchData.results;

        for (const movie of movies) {
            const favCheckUrl = `https://api.themoviedb.org/3/movie/${movie.id}/account_states?api_key=${keys.api_key}&session_id=${keys.session_id}`;
            const favResponse = await fetch(favCheckUrl);
            const favData = await favResponse.json();

            printMovie(movie, favData.favorite, false);
        }
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}




/* FUNCIONS D'INTERACCIÓ AMB EL DOM */

// Click Favorites
document.getElementById("showFavs").addEventListener("click", function(){
    removeActive();
    this.classList.add("active");

    showFavs();
})

// Click Watchlist
document.getElementById("showWatch").addEventListener("click", function(){
    removeActive();
    this.classList.add("active");

    //showWatch();
})

/* Funcions per detectar la cerca d'una pel·lícula */
// Intro a l'input
document.getElementById("search").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMovies(this.value);
    }
});

// Click a la lupa
document.querySelector(".searchBar i").addEventListener("click", ()=>searchMovies(document.getElementById("search").value));

// Netejar l'input
document.getElementById("search").addEventListener('click', ()=>clearInput()); 

function clearInput(){
    document.getElementById("search").value="";
}

// Elimina l'atribut active del menú
function removeActive(){
    document.querySelectorAll(".menu li a").forEach(el=>el.classList.remove("active"));
}

/* Funció per printar les pel·lícules */
function printMovie(movie, fav, watch){

    let favIcon = fav ? 'iconActive' : 'iconNoActive';
    let watchIcon = watch ? 'iconActive' : 'iconNoActive';

    moviesResult.innerHTML += `<div class="movie">
                                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}">
                                    <h3>${movie.original_title}</h3>
                                    <div class="buttons">
                                        <a id="fav" onClick="setFav(${movie.id}, ${!fav})"><i class="fa-solid fa-heart ${favIcon}"></i></a>
                                        <a id="watch" onClick="setWatch(${movie.id}, ${!watch})"><i class="fa-solid fa-eye ${watchIcon}"></i></a>
                                    </div>`;
}

// Implementacion del scroll infinito
var current_page = 1;
var total_pages = 0;
var query = ''; // Mantener la consulta global

window.addEventListener('scroll', async () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 5 && current_page < total_pages) {
        current_page++;
        await searchMovies(query); // Recargar la búsqueda con la página actualizada
    }
});

async function searchMovies(queryParam) {
    query = queryParam; // Actualizar la consulta global
    // resto del código sigue igual
}
