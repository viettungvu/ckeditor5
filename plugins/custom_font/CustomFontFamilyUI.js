// CustomFontFamilyUI.js
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import { createDropdown, addListToDropdown } from "@ckeditor/ckeditor5-ui/src/dropdown/utils";
import Model from "@ckeditor/ckeditor5-ui/src/model";
import Collection from "@ckeditor/ckeditor5-utils/src/collection";
import "./CustomFontFamily.css";
export default class CustomFontFamilyUI extends Plugin {
  init() {
    const editor = this.editor;
    const componentFactory = editor.ui.componentFactory;
    const fontFamilyConfig = editor.config.get("fontFamily");

    // Đảm bảo plugin FontFamily đã được đăng ký
    if (!editor.plugins.has("FontFamily")) {
      return;
    }

    // Lấy options từ cấu hình
    const options = fontFamilyConfig.options;
    const defaultTitle = "Font";

    componentFactory.add("fontFamily", (locale) => {
      const dropdownView = createDropdown(locale);
      const command = editor.commands.get("fontFamily");

      // Thêm class cho dropdown
      dropdownView.set({
        class: "ck-font-family-dropdown",
      });

      const items = new Collection();

      // Thêm option mặc định
      // items.add({
      //     type: 'button',
      //     model: new Model({
      //         label: 'Default',
      //         withText: true,
      //         tooltip: 'Default Font',
      //         commandName: 'fontFamily',
      //         commandParam: ''
      //     })
      // });

      // Thêm các options font
      for (const option of options) {
        const fontName = typeof option === "string" ? option.split(',')[0] : option.title;
        const fontValue = typeof option === "string" ? option : option.model;

        items.add({
          type: "button",
          model: new Model({
            label: fontName,
            withText: true,
            tooltip: fontName,
            commandName: "fontFamily",
            commandParam: fontValue,
            // Thêm style trực tiếp vào model
            labelStyle: `font-family: ${fontValue}`,
          }),
        });
      }

      addListToDropdown(dropdownView, items);

      // Cập nhật label và style của dropdown button
      dropdownView.buttonView.set({
        withText: true,
        tooltip: "Font Family",
      });

      // Cải thiện binding cho label
      dropdownView.buttonView.bind("label").to(command, "value", (value) => {
        if (!value) {
          return defaultTitle;
        }
        return value.split(",")[0];
        // Tìm font name dựa trên giá trị
        for (const option of options) {
          const model = typeof option === "string" ? option : option.model;
          const title = typeof option === "string" ? option : option.title;

          if (model === value) {
            return title;
          }
        }

        return value; // Trả về giá trị nếu không tìm thấy title
      });

      // Cải thiện binding cho style
      const buttonView = dropdownView.buttonView;
      command.on("change:value", () => {
        const fontValue = command.value;
        if (fontValue) {
          // Áp dụng style trực tiếp vào DOM element
          buttonView.element.style.fontFamily = fontValue;
        } else {
          buttonView.element.style.fontFamily = "";
        }
      });

      // Thêm sự kiện render để đảm bảo style được áp dụng
      dropdownView.on("render", () => {
        if (command.value) {
          buttonView.element.style.fontFamily = command.value;
        }
      });

      dropdownView.bind("isEnabled").to(command);

      this.listenTo(dropdownView, "execute", (evt) => {
        const source = evt.source;
        editor.execute("fontFamily", { value: source.commandParam });

        // Cập nhật style của button sau khi thực thi
        if (source.commandParam) {
          buttonView.element.style.fontFamily = source.commandParam;
        } else {
          buttonView.element.style.fontFamily = "";
        }

        editor.editing.view.focus();
      });

      return dropdownView;
    });
  }
}
