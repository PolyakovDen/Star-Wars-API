window.onload = function() {
    var url = `http://swapi.py4e.com/api/people/`;

    function dataRequest(u) {
        fetch(u)
            .then(response => response.json())
            .then(function (data) {
                buildHeroesList(data);
                showDetails(data);
                if (!paginationLi.length) createPaginationControls(data);
            })
            .catch(error => {
                console.log(error);
            });
    };
    dataRequest(url);

    function buildHeroesList(data) {
        var res = data.results;
        var heroesList = document.querySelector(".heroes__list");
        var parent = heroesList.parentNode;
        parent.removeChild(heroesList);
        heroesList = document.createElement("ul");
        heroesList.className = "heroes__list";
        parent.appendChild(heroesList);
        for (var i = 0; i < res.length; i++) {
            var name = res[i].name;
            var heroItem = document.createElement("li");
            heroItem.className = "hero__item";
            heroItem.id = res[i].name;
            heroItem.innerHTML = name;
            heroesList.append(heroItem);
        };
    };

    function showDetails(data) {
        var res = data.results;
        document.addEventListener("mouseover", function(e) {
            if (e.target.classList.contains("hero__item")) {
                for (var i = 0; i < res.length; i++) {
                    if (e.target.id === res[i].name) {
                        heroDetailsInformation(res[i]);
                        
                        displayMovie(res[i]);

                        showPopUp(e.target);
                    };
                };
            };
        });
    };

    function heroDetailsInformation(text) {
        var heroMainInf = document.querySelector(".heroes__main-information");
        var heroMainInfItem = `
        <h1 class="heroes__main-information--name">${text.name}</h1>
        <ul class="heroes__main-information--list">
            <li class="heroes__main-information--item">
                Height: ${text.height}
            </li>
            <li class="heroes__main-information--item">
                Mass: ${text.mass}
            </li>
            <li class="heroes__main-information--item">
                Hair color: ${text.hair_color}
            </li>
            <li class="heroes__main-information--item">
                Skin color: ${text.skin_color}
            </li>
            <li class="heroes__main-information--item">
                Eye color: ${text.eye_color}
            </li>
            <li class="heroes__main-information--item">
                Birth year: ${text.birth_year}
            </li>
        </ul>`;
        heroMainInf.innerHTML = heroMainInfItem;
    };

    function displayMovie(text) {
        var heroFilmList = document.querySelector(".heroes__films--list");
        var films = text.films;
        heroFilmList.innerHTML = '';
        for (var film of films) {
            fetch(film)
                .then(response => response.json())
                .then(function (data) {
                    var heroFilmItem = document.createElement("li");
                    heroFilmItem.className = "heroes__films--item";
                    heroFilmItem.innerHTML = data.title;
                    heroFilmList.append(heroFilmItem);
                })
                .catch(error => {
                    console.log(error);
                });
        };
    };

    function showPopUp(target) {
        var popUp = document.querySelector(".heroes__item--popup");
        var closeButton = document.querySelector(".close");
        var openButton = target;
        openButton.addEventListener("click", openPopUp);
        function openPopUp () {
            popUp.classList.remove("hidden");
        };
        closeButton.addEventListener("click", closePopUp);
        function closePopUp () {
            popUp.classList.add("hidden");
        };
    };

    var paginationList = document.querySelector(".pagination__list");
    var paginationLi = [];
    var pageNum;
    function createPaginationControls(data) {
        var count = data.count;
        var countOfItems = Math.ceil(count / 10); //10 - это число записей на странице
        for (var i = 1; i <= countOfItems; i++) {
            paginationItem = document.createElement("li");
            paginationItem.className = "pagination__item";
            paginationItem.innerHTML = i;
            paginationList.append(paginationItem);
            paginationLi.push(paginationItem);
        };
        for (var value of paginationLi) {
            value.addEventListener("click", function() {
                pageNum = this.innerHTML;
                dataRequest('http://swapi.py4e.com/api/people/?page=' + pageNum);
            });
        };
    };

};