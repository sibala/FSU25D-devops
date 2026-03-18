import { fetchPosts, fetchTags, fetchPostsByTag } from "./api-service.js";
import { setPosts, setTags, setSelectedTag } from "./app-model.js";
import { renderPosts, renderTags, showLoading, showError } from "./app-view.js";

async function handleTagChange(tag) {
  setSelectedTag(tag || null);
  showLoading();

  try {
    let data = tag ? await fetchPostsByTag(tag) : await fetchPosts();
    setPosts(data.posts);
    renderPosts(data.posts);
  } catch {
    showError("Kunde inte ladda inlägg");
  }
}

// Starta appen
async function init() {
  try {
    let [tags, postData] = await Promise.all([fetchTags(), fetchPosts()]);
    setTags(tags);
    setPosts(postData.posts);
    renderTags(tags, handleTagChange);
    renderPosts(postData.posts);
  } catch {
    showError("Kunde inte ladda data");
  }
}

init();
