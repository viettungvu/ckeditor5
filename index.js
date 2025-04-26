document.addEventListener("DOMContentLoaded", () => {
  XClassicEditor.create(document.querySelector("#editor"), {})
    .then((editor) => {})
    .catch((err) => {
      console.log(err);
    });
});
