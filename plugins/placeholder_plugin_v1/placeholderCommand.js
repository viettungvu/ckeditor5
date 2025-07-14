import Command from "@ckeditor/ckeditor5-core/src/command";
import * as xplaceholder from "./constants.js";
export default class PlaceholderCommandV1 extends Command {
  execute(placeholder) {
    this.editor.model.change((writer) => {
      const selection = this.editor.model.document.selection;
      const replace = `{${placeholder.value}}`;
      if (placeholder.type === "button") {
        const innerText = placeholder.innerText || placeholder.text;
        const linkText = writer.createText(innerText, {
          linkHref: replace,
          linkIsExternal: true,
          linkStyledAsButton: true,
        });

        this.editor.model.insertContent(linkText, selection);
      } else {
        const text = writer.createText(replace);
        this.editor.model.insertContent(text, selection);
      }
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedElement = selection.getSelectedElement();
    this.isEnabled = selectedElement === null || selectedElement.is("element", xplaceholder.MODEL_NAME);
    //this.value = selectedElement ? selectedElement.getAttribute("value") : null;
  }
}
