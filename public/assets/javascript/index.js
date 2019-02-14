$(document).ready(function () {
  var articleContainer = $(".article-container");
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);

  initPage();

  function initPage() {
    articleContainer.empty();
    $.get("/api/articles").then(function (data) {
      if (data && data.length) {
        renderArticles(data);
      } else {
        renderEmpty();
      }
    });
  }

  function renderArticles(articles) {
    var articleCards = [];
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }
    articleContainer.append(articleCards);
  }

  function createCard(article) {
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.link)
          .text(article.title),
        $("<a class='btn btn-success save'>Save Article</a>")
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
    articleContainer.append(emptyAlert);
  }

  function handleArticleSave() {
    var articleToSave = $(this).parents(".card").data();
    $(this).parents(".card").remove();

    $.ajax({
      method: "PUT",
      url: "/api/article/" + articleToSave._id,
      data: articleToSave
    }).then(function (data) {
    });
  }

  function handleArticleScrape() {
    $.ajax({
      method: "GET",
      url: "/api/fetch"
    }).then(function (data) {
      initPage();
    });
  }

  function handleArticleClear() {
    $.get("/api/clear").then(function () {
      articleContainer.empty();
      initPage();
    });
  }
});
