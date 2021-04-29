let select = document.querySelector("#platforms");
let arrPlat = [];
fetch(`https://api.rawg.io/api/platforms?key=${process.env.API_KEY}`)
  .then((response) => response.json())
  .then((response) =>
    response.results.forEach((article) => {
      arrPlat.push(article);
      select.innerHTML += `<option value="${article.slug}" class="option">${article.name}</option>`;
    })
  );
select.addEventListener("click", (e) => {
  e.preventDefault();
  PageList(search.value);
});

let editors = [];
fetch(`https://api.rawg.io/api/developers?key=${process.env.API_KEY}`)
  .then((response) => response.json())
  .then((response) =>
    response.results.forEach((x) => {
      editors.push(x);
    })
  );

const PageList = (argument = "") => {
  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");
    let articles = "";

    const fetchList = (url, argument) => {
      let finalURL = url + "&dates=2021-01-01,2022-01-01&ordering=-added";
      if (argument) {
        let welcome = document.querySelector(".welcome");
        welcome.style.display = "none";
        finalURL = url + "&search=" + argument;
      }

      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          let count = 0;

          let showMore = document.querySelector(".show-more");

          response.results.forEach((article) => {
            let kindOfGame = [];
            article.genres.forEach((genre) => {
              kindOfGame.push(genre.name);
            });
            let platformGame = [];
            article.platforms.forEach((x) => {
              platformGame.push(`<span class="test">${x.platform.name}</span>`);
            });

            if (select.value === "") {
              count++;
              if (count <= 9) {
                articles += `
              <div class="gameCards">
              
                <div class="imgs-card">
                  <img src="${article.background_image}" class="img-card">
                  <div class="details-card">
                    <p class="mb-0">${article.released}</p>
                    <p class="mb-0"></p>
                    <p class="mb-0">${kindOfGame.join(" , ")}</p>
                    <p class="mb-0">${article.rating}/5 - ${
                  article.ratings_count
                } votes </p>              
                  </div>
                </div>


                <div class="cardGame">
                  <a href="#pagedetails/${article.id}">
                   ${article.name} 
                  </a>
                <p class="mb-4">${platformGame.join(" , ")}</p> 
                </div>
              </div>
          `;
              } else {
                articles += `
                <div class="gameCards not-visible">
              
                <div class="imgs-card">
                  <img src="${article.background_image}" class="img-card">
                  <div class="details-card">
                    <p class="mb-0">${article.released}</p>
                    <p class="mb-0"></p>
                    <p class="mb-0">${kindOfGame.join(" , ")}</p>
                    <p class="mb-0">${article.rating}/5 - ${
                  article.ratings_count
                } votes </p>              
                  </div>
                </div>


                <div class="cardGame">
                  <a href="#pagedetails/${article.id}">
                    <p class="mt-1 mb-0">${article.name} </p>
                  </a>
                <p class="mb-4">${platformGame.join(" , ")}</p> 
                </div>
              </div>
            `;
              }
            } else {
              article.platforms.forEach((items) => {
                if (items.platform.slug === select.value) {
                  count++;
                  if (count <= 9) {
                    articles += `
                    <div class="gameCards">
              
                    <div class="imgs-card">
                      <img src="${article.background_image}" class="img-card">
                      <div class="details-card">
                        <p class="mb-0">${article.released}</p>
                        <p class="mb-0"></p>
                        <p class="mb-0">${kindOfGame.join(" , ")}</p>
                        <p class="mb-0">${article.rating}/5 - ${
                      article.ratings_count
                    } votes </p>              
                      </div>
                    </div>
    
    
                    <div class="cardGame">
                      <a href="#pagedetails/${article.id}">
                        <p class="mt-1 mb-0">${article.name} </p>
                      </a>
                    <p class="mb-4">${platformGame.join(" , ")}</p> 
                    </div>
                  </div>
              `;
                  } else {
                    articles += `
                    <div class="gameCards not-visible">
              
                    <div class="imgs-card">
                      <img src="${article.background_image}" class="img-card">
                      <div class="details-card">
                        <p class="mb-0">${article.released}</p>
                        <p class="mb-0"></p>
                        <p class="mb-0">${kindOfGame.join(" , ")}</p>
                        <p class="mb-0">${article.rating}/5 - ${
                      article.ratings_count
                    } votes </p>              
                      </div>
                    </div>
    
    
                    <div class="cardGame">
                      <a href="#pagedetails/${article.id}">
                        <p class="mt-1 mb-0">${article.name} </p>
                      </a>
                    <p class="mb-4">${platformGame.join(" , ")}</p> 
                    </div>
                  </div>
                `;
                  }
                }
              });
            }
          });
          document.querySelector(".page-list .articles").innerHTML = articles;
          let allCards = document.querySelectorAll(".gameCards");
          let count2 = 0;
          showMore.addEventListener("dblclick", (e) => {
            e.preventDefault();
            allCards.forEach((x) => {
              if (x.classList.value.includes("not-visible")) {
                count2++;
                if (count2 < 10) {
                  x.classList.remove("not-visible");
                }
              }
            });
            count2 = 0;
          });

          let test = document.querySelectorAll(".test");
          arrPlat.forEach((x) => {
            test.forEach((y) => {
              if (y.innerHTML === x.name) {
                y.addEventListener("click", (e) => {
                  e.preventDefault();
                  document.querySelector(
                    ".welcome"
                  ).innerHTML = `<h1>${x.name}<h1>`;
                  document
                    .querySelector(".welcome")
                    .classList.add("text-center");

                  document.querySelector(".select").style.display = "none";
                  document.querySelector(".show-more").style.display = "none";
                  articles = "";
                  x.games.forEach((game) => {
                    fetch(
                      `https://api.rawg.io/api/games/${game.id}?key=${process.env.API_KEY}`
                    )
                      .then((response) => response.json())
                      .then((response) => {
                        let kindOfGame = [];
                        response.genres.forEach((genre) => {
                          kindOfGame.push(genre.name);
                        });
                        let platformGame = [];
                        response.platforms.forEach((x) => {
                          platformGame.push(
                            `<span class="test">${x.platform.name}</span>`
                          );
                        });

                        articles += `
                        <div class="gameCards">
                        
                          <div class="imgs-card">
                            <img src="${
                              response.background_image
                            }" class="img-card">
                            <div class="details-card">
                              <p class="mb-0">${response.released}</p>
                              <p class="mb-0"></p>
                              <p class="mb-0">${kindOfGame.join(" , ")}</p>
                              <p class="mb-0">${response.rating}/5 - ${
                          response.ratings_count
                        } votes </p>              
                            </div>
                          </div>
          
          
                          <div class="cardGame">
                            <a href="#pagedetails/${response.id}">
                             ${response.name} 
                            </a>
                          <p class="mb-4">${platformGame.join(" , ")}</p> 
                          </div>
                        </div>
                    `;
                        document.querySelector(
                          ".page-list .articles"
                        ).innerHTML = articles;
                      });
                  });
                });
              }
            });
          });
        });
    };

    fetchList(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}`,
      cleanedArgument
    );
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-list">
        <div class="articles">Hey, this page is a PageList template, about : ${argument}</div>
      </section>
    `;
    preparePage();
  };
  render();
};

export { PageList };

let submit = document.querySelector(".submit");
let search = document.querySelector("#search");
submit.addEventListener("click", (e) => {
  e.preventDefault();
  PageList(search.value);
});
