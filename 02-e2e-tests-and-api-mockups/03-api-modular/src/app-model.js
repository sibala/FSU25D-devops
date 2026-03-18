let posts = [];
let tags = [];
let selectedTag = null;

export function setPosts(data) {
  posts = data;
}

export function getPosts() {
  return posts;
}

export function setTags(data) {
  tags = data;
}

export function getTags() {
  return tags;
}

export function setSelectedTag(tag) {
  selectedTag = tag;
}

export function getSelectedTag() {
  return selectedTag;
}

export function reset() {
  posts = [];
  tags = [];
  selectedTag = null;
}
