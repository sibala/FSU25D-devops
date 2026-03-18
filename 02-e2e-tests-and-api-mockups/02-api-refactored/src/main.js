let tagFilter = document.getElementById("tag-filter");
let postList = document.getElementById("post-list");

async function fetchPosts() {
  let res = await fetch("https://dummyjson.com/posts");
  return res.json();
}

async function fetchTags() {
  let res = await fetch("https://dummyjson.com/posts/tags");
  return res.json();
}

async function fetchPostsByTag(tag) {
  let res = await fetch("https://dummyjson.com/posts/tag/" + tag);
  return res.json();
}

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

function renderTags(tags) {
  tags.forEach((tag) => {
    let option = document.createElement("option");
    option.value = tag.slug;
    option.textContent = tag.name;
    tagFilter.appendChild(option);
  });
}

async function handleTagChange() {
  let tag = tagFilter.value;
  postList.innerHTML = '<p class="loading">Laddar inlägg…</p>';

  let data = tag ? await fetchPostsByTag(tag) : await fetchPosts();
  renderPosts(data.posts);
}

// Starta appen
tagFilter.addEventListener("change", handleTagChange);

async function init() {
  let tags = await fetchTags();
  renderTags(tags);

  let data = await fetchPosts();
  renderPosts(data.posts);
}

init();
