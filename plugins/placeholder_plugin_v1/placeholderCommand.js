import Command from "@ckeditor/ckeditor5-core/src/command";
import * as xplaceholder from "./constants.js";
export default class PlaceholderCommandV1 extends Command {
  execute({ value }) {
    this.editor.model.change((writer) => {
      //const placeholder = writer.createElement(xplaceholder.MODEL_NAME, { value: value });

      this.editor.model.insertContent(writer.createText(`{${value}}`), this.editor.model.document.selection);
      //this.editor.model.insertContent(placeholder);
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
