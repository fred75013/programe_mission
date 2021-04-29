const PageDetails = (argument = "") => {
  console.log("Page Details", argument);
  const preparePage = () => {
    let cleanedArgument = argument.replace(/\s+/g, "-");

    const fetchGame = (url, argument) => {
      let finalURL = url + argument + "?key=" + process.env.API_KEY;

      let trailerURL = url + argument + "/movies?key=" + process.env.API_KEY;

      https: fetch(trailerURL)
        .then((response) => response.json())
        .then((response) => {
          let { results } = response;

          results.forEach((trailer) => {
            document.querySelector(".trailer").innerHTML = `
            <h1 class="color-red">TRAILER</h1>
            <iframe src="${trailer.data.max}" frameborder="0" class="iframe"></iframe>`;
          });
        });

      fetch(`${finalURL}`)
        .then((response) => response.json())
        .then((response) => {
          document.querySelector(".welcome").style.display = "none";
          document.querySelector(".select").style.display = "none";
          document.querySelector(".show-more").style.display = "none";

          let {
            name,
            released,
            description,
            background_image,
            website,
            rating,
            ratings_count,
            developers,
            platforms,
            publishers,
            genres,
            tags,
            stores,
          } = response;

          let searchURL = `https://api.rawg.io/api/games?key=${process.env.API_KEY}&search=${name}`;
          fetch(searchURL)
            .then((response) => response.json())
            .then((response) =>
              response.results.forEach((element) => {
                if (element.name === name) {
                  element.short_screenshots.forEach((screenshot) => {
                    document.querySelector(".screen-shot").innerHTML += `
                    <div>
                    <img src="${screenshot.image}" alt="screen shot du jeu" class="img-screen">
                    </div>
                    `;
                  });
                }
              })
            );

          fetch(`https://api.rawg.io/api/genres?key=${process.env.API_KEY}`)
            .then((response) => response.json())
            .then((response) => {
              const count = (names) =>
                names.reduce((a, b) => ({ ...a, [b]: (a[b] || 0) + 1 }), {}); // don't forget to initialize the accumulator

              const duplicates = (dict) =>
                Object.keys(dict).filter((a) => dict[a] > 1);

              let { results } = response;
              let gamesNameGenre = [];
              results.forEach((x) => {
                genres.forEach((y) => {
                  if (y.name === x.name) {
                    x.games.forEach((game) => {
                      gamesNameGenre.push(game.id);
                    });
                  }
                });
              });
              duplicates(count(gamesNameGenre)).forEach((z) => {
                let platform = [];
                let genres = [];
                fetch(
                  `https://api.rawg.io/api/games/${z}?key=${process.env.API_KEY}`
                )
                  .then((response) => response.json())
                  .then((response) =>
                    response.platforms.forEach((plat) => {
                      platform.push(plat.platform.name);
                    })(
                      response.genres.forEach((genre) => {
                        genres.push(genre.name);
                      })(
                        (document.querySelector(".similareGame").innerHTML += `
                  <div class="gameCards">

                    <div class="imgs-card">
                      <img src="${response.background_image}"  class="img-card">
                      <div class="details-card">
                        <p class="mb-0">${response.released}</p>
                        <p class="mb-0"></p>
                        <p class="mb-0">${genres.join(" , ")}</p>
                        <p class="mb-0">${response.rating}/5 - ${
                          response.ratings_count
                        } votes </p>              
                      </div>
                    </div>


                    <div class="cardGame">
                      <a href="#pagedetails/${response.id}">
                        <p class="mt-1 mb-0">${response.name}</p>
                      </a>
                      
                      <p class="mb-4">${platform.join(" , ")}</p>
                    </div>
                  </div>
                  `)
                      )
                    )
                  );
              });
            });

          let articleDOM = document.querySelector(".page-details .article");

          document.querySelector(
            ".banner"
          ).style.backgroundImage = `url(${background_image})`;

          document.querySelector(
            ".website"
          ).innerHTML = `<a href="${website}" target="_blank" style="color:#d20a32;">Check website   >></a>`;

          developers.forEach((dev) => {
            articleDOM.querySelector(
              ".developer span"
            ).innerHTML += `${dev.name}, `;
          });
          if (articleDOM.querySelector(".developer span").innerHTML === "") {
            articleDOM.querySelector(".developer span").innerHTML = "n/a";
          }

          platforms.forEach((plat) => {
            articleDOM.querySelector(
              ".platforms span"
            ).innerHTML += `${plat.platform.name}, `;
          });
          if (articleDOM.querySelector(".platforms span").innerHTML === "") {
            articleDOM.querySelector(".platforms span").innerHTML = "n/a";
          }

          publishers.forEach((publi) => {
            articleDOM.querySelector(
              ".publishers span"
            ).innerHTML += `${publi.name}, `;
          });
          if (articleDOM.querySelector(".publishers span").innerHTML === "") {
            articleDOM.querySelector(".publishers span").innerHTML = "n/a";
          }

          genres.forEach((genre) => {
            articleDOM.querySelector(
              ".genres span"
            ).innerHTML += `${genre.name}, `;
          });
          if (articleDOM.querySelector(".genres span").innerHTML === "") {
            articleDOM.querySelector(".genres span").innerHTML = "n/a";
          }

          tags.forEach((tag) => {
            articleDOM.querySelector(".tags span").innerHTML += `${tag.name}, `;
          });
          if (articleDOM.querySelector(".tags span").innerHTML === "") {
            articleDOM.querySelector(".tags span").innerHTML = "n/a";
          }

          stores.forEach((store) => {
            articleDOM.querySelector(
              ".stores"
            ).innerHTML += `<p><a href="https://${store.store.domain}" target="_blank">${store.store.name}</a></p>`;
          });
          if (articleDOM.querySelector(".stores").innerHTML === "") {
            articleDOM.querySelector(".stores").innerHTML = "n/a";
          }

          articleDOM.querySelector(
            "p.rating"
          ).innerHTML = `${rating}/5 - ${ratings_count} votes`;
          articleDOM.querySelector("h1.title").innerHTML = name;
          articleDOM.querySelector("p.release-date span").innerHTML = released;
          articleDOM.querySelector("p.description").innerHTML = description;
        });
    };

    fetchGame(`https://api.rawg.io/api/games/`, cleanedArgument);
  };

  const render = () => {
    pageContent.innerHTML = `
      <section class="page-details">
        <div class="banner">
        <button class="btn website"></button>
        </div>
        <div class="article">
          <div class="title-rating">
            <h1 class="title"></h1>
            <p class="rating"></p>
          </div>
          <p class="description"></p>
          <div class="rdppgt">
            <div class="rdg">
              <div class="rd">
                <p class="release-date ml-2">Release date <br/> <span></span></p>
                <p class="developer ml-2">Developer <br/> <span></span></p>
              </div>
              <p class="genres ml-2">Genres <br/> <span></span></p>
            </div>
            <div class="ppt">
              <div class="pp">
                <p class="platforms ml-2">Platforms <br/> <span></span></p>
                <p class="publishers ml-2">Publishers <br/> <span></span></p>
              </div>
              <p class="tags ml-2 ">Tags <br/> <span></span></p>
            </div>
          </div>
          <div class="stores">
            <h1 class="color-red">BUY</h1>
          </div>
          <div class="trailer">
          </div>
          <h1 class="color-red">SCREENSHOTS</h1>
          <div class="screen-shot">        
          </div>
          <h1 class="color-red">SIMILAR GAMES</h1>
          <div class="similareGame articles">
          </div>
        </div>
      </section>
    `;

    preparePage();
  };

  render();
};
export { PageDetails };
