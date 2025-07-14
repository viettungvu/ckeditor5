document.addEventListener("DOMContentLoaded", () => {
  XClassicEditor.create(document.querySelector("#editor"), {
    xplaceholder: {
      types: [
        { text: "Công ty", value: "company" },
        { text: "Vị trí ứng tuyển", value: "position" },
        { text: "Họ tên ứng viên", value: "candidate_name" },
        { text: "Link gì đó", value: "link", type: "button", innerText: "Link test" },
      ],
    },
    link: {
      decorators: {
        // styledAsButton: {
        //   mode: "manual",
        //   label: "Styled as Button",
        //   attributes: {
        //     class: "btn btn-primary",
        //   },
        // },
      },
    },
    // htmlSupport: {
    //   allow: [
    //     {
    //       name: "figure",
    //       classes: "table",
    //       styles: true, // cho phép dùng style inline
    //     },
    //   ],
    // },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],

      tableProperties: {
        // The configuration of the TableProperties plugin.
      },

      tableCellProperties: {
        // The configuration of the TableCellProperties plugin.
      },
    },
  })
    .then((editor) => {
      //XClassicEditor.Inspector.attach(editor);
    })
    .catch((err) => {
      console.log(err);
    });
});
