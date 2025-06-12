document.addEventListener("DOMContentLoaded", () => {
  XClassicEditor.create(document.querySelector("#editor"), {
    xplaceholder: {
      types: [
        { text: "Công ty", value: "company" },
        { text: "Vị trí ứng tuyển", value: "position" },
        { text: "Họ tên ứng viên", value: "candidate_name" },
      ],
    },
  })
    .then((editor) => {
      XClassicEditor.Inspector.attach( editor );
    })
    .catch((err) => {
      console.log(err);
    });
});
