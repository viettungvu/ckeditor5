import Command from "@ckeditor/ckeditor5-core/src/command";
import * as xplaceholder from "./constants.js";
export default class PlaceholderCommand extends Command {
  execute({ value }) {
    this.editor.model.change((writer) => {
      const placeholder = writer.createElement(xplaceholder.MODEL_NAME, { value: value });
      // Get the current selection or a fallback position
      const selection = this.editor.model.document.selection;
      let position = selection.getFirstPosition();

      // If no valid position, use the first valid position in the document
      if (!position || !this.editor.model.schema.checkChild(position.parent,xplaceholder.MODEL_NAME)) {
        const root = this.editor.model.document.getRoot();
        position = writer.createPositionAt(root, 0);
      }

      this.editor.model.insertContent(placeholder, position);
    });
  }

  refresh() {
    const model = this.editor.model;
    const selection = model.document.selection;
    const selectedElement = selection.getSelectedElement();
    this.isEnabled = selectedElement === null || selectedElement.is("element", xplaceholder.MODEL_NAME);
  }
}
