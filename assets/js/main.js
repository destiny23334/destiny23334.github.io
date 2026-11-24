(function () {
  var listEl = document.getElementById("post-list");
  var filtersEl = document.getElementById("filters");
  var countEl = document.getElementById("count");
  if (!listEl || !filtersEl) return;

  var posts = (window.POSTS || []).slice().sort(function (a, b) {
    return a.date < b.date ? 1 : -1;
  });

  var activeTag = "全部";
  var tags = ["全部"];
  posts.forEach(function (post) {
    (post.tags || []).forEach(function (tag) {
      if (tags.indexOf(tag) === -1) tags.push(tag);
    });
  });

  function formatDate(value) {
    return value.split("-").join(".");
  }

  function renderFilters() {
    filtersEl.innerHTML = "";
    tags.forEach(function (tag) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = tag;
      if (tag === activeTag) btn.className = "active";
      btn.addEventListener("click", function () {
        activeTag = tag;
        renderFilters();
        renderList();
      });
      filtersEl.appendChild(btn);
    });
  }

  function renderList() {
    var visible = posts.filter(function (post) {
      return activeTag === "全部" || (post.tags || []).indexOf(activeTag) !== -1;
    });

    if (countEl) countEl.textContent = visible.length + " 篇";

    if (!visible.length) {
      listEl.innerHTML = '<p class="empty">这个标签下还没有文章。</p>';
      return;
    }

    listEl.innerHTML = visible
      .map(function (post) {
        var tagsHtml = (post.tags || [])
          .map(function (tag) {
            return "<span>#" + tag + "</span>";
          })
          .join("");
        return (
          '<a class="card" href="' +
          post.url +
          '">' +
          '<div class="top"><h3>' +
          post.title +
          "</h3><time>" +
          formatDate(post.date) +
          "</time></div>" +
          (post.summary ? "<p>" + post.summary + "</p>" : "") +
          '<div class="tags">' +
          tagsHtml +
          "</div></a>"
        );
      })
      .join("");
  }

  renderFilters();
  renderList();
})();
