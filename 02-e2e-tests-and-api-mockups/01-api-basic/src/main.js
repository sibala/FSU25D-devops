let tagFilter = document.getElementById("tag-filter");
let postList = document.getElementById("post-list");

// Hämta och visa inlägg
async function loadPosts(url) {
  postList.innerHTML = '<p class="loading">Laddar inlägg…</p>';
  let res = await fetch(url);
  let data = await res.json();
  renderPosts(data.posts);
}

// Hämta och visa taggar
async function loadTags() {
  let res = await fetch("https://dummyjson.com/posts/tags");
  let tags = await res.json();
  tags.forEach((tag) => {
    let option = document.createElement("option");
    option.value = tag.slug;
    option.textContent = tag.name;
    tagFilter.appendChild(option);
  });
}

// Lyssna på tagg-filter
tagFilter.addEventListener("change", async () => {
  let tag = tagFilter.value;
  let url = tag
    ? "https://dummyjson.com/posts/tag/" + tag
    : "https://dummyjson.com/posts";
  await loadPosts(url);
});

function renderPosts(posts) {
  postList.innerHTML = "";
  posts.forEach((post) => {
    let div = document.createElement("div");
    div.className = "post-card";

    let h3 = document.createElement("h3");
    h3.textContent = post.title;

    let p = document.createElement("p");
    p.textContent = post.body;

    let meta = document.createElement("div");
    meta.className = "post-meta";
    meta.textContent =
      "Tags: " + post.tags.join(", ") +
      " | Likes: " + post.reactions.likes +
      " | Views: " + post.views;

    div.append(h3, p, meta);
    postList.appendChild(div);
  });
}

// Starta appen
loadTags();
loadPosts("https://dummyjson.com/posts");
