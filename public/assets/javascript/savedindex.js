$(document).ready(function () {
  var savedarticleContainer = $(".saved-article-container");
  $(".clearsaved").on("click", handleSavedArticleClear);

  initSavedPage();

  function initSavedPage() {
    savedarticleContainer.empty();
    $.get("/api/saved").then(function (data) {
      if (data && data.length) {
        rendersavedArticles(data);
        console.log(data);
      } else {
        renderEmpty();
      }
    });
  }

  function rendersavedArticles(articles) {
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    savedarticleContainer.append(articleCards);
  }

  function createCard(article) {
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.title)
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.title);

    card.append(cardHeader, cardBody);
    card.data("_id", article._id);
    return card;
  }

  function renderEmpty() {
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>Uh Oh. Looks like we don't have any new articles.</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    savedarticleContainer.append(emptyAlert);
  }

  function handleSavedArticleClear() {
    $.get("/api/clearsaved").then(function () {
      savedarticleContainer.empty();
      initSavedPage();
    });
  }

});