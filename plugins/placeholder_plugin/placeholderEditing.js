import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";

import { toWidget, viewToModelPositionOutsideModelElement } from "@ckeditor/ckeditor5-widget/src/utils";
import PlaceholderCommand from "./placeholderCommand.js";
import * as xplaceholder from "./constants.js";
export default class PlaceholderEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConverters();
    this._defineClipboardInputOutput();
    this.editor.commands.add(xplaceholder.CMD_NAME, new PlaceholderCommand(this.editor));

    this.editor.editing.mapper.on(
      "viewToModelPosition",
      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass(xplaceholder.COMMON_CLASS))
    );
    this.editor.config.define("xplaceholder", {
      types: [
        { text: "Date", value: "date" },
        { text: "First Name", value: "first_name" },
        { text: "Surname", value: "surname" },
      ],
    });
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register(xplaceholder.MODEL_NAME, {
      // Behaves like a self-contained inline object (e.g. an inline image)
      // allowed in places where $text is allowed (e.g. in paragraphs).
      // The inline widget can have the same attributes as text (for example linkHref, bold).
      inheritAllFrom: "$inlineObject",

      // The placeholder can have many types, like date, name, surname, etc:
      allowAttributes: ["value"],
    });
  }

  _defineConverters() {
    const conversion = this.editor.conversion;

    //Data to model
    conversion.for("upcast").elementToElement({
      view: {
        name: "span",
        classes: [xplaceholder.COMMON_CLASS],
      },
      model: (viewElement, { writer: modelWriter }) => {
        const value = viewElement.getChild(0).data.slice(1, -1);
        return modelWriter.createElement(xplaceholder.MODEL_NAME, { value });
      },
    });
    //Model-to-view
    conversion.for("editingDowncast").elementToElement({
      model: xplaceholder.MODEL_NAME,
      view: (modelItem, { writer: viewWriter }) => {
        const widgetElement = createPlaceholderView(modelItem, viewWriter);

        // Enable widget handling on a placeholder element inside the editing view.
        return toWidget(widgetElement, viewWriter);
      },
    });
    //Model-to-data
    conversion.for("dataDowncast").elementToElement({
      model: xplaceholder.MODEL_NAME,
      view: (modelItem, { writer: viewWriter }) => createPlaceholderView(modelItem, viewWriter),
    });

    // Helper method for both downcast converters.
    function createPlaceholderView(modelItem, viewWriter) {
      const value = modelItem.getAttribute("value");
      const placeholderView = viewWriter.createContainerElement(
        "span",
        {
          class: xplaceholder.COMMON_CLASS,
          value: value,
        },
        `{${value}}`
      );
      return placeholderView;
    }
  }
  // Integration with the clipboard pipeline.
  _defineClipboardInputOutput() {
    const editor = this.editor;
    const view = editor.editing.view;
    const viewDocument = view.document;

    // Processing pasted or dropped content
    this.listenTo(viewDocument, "clipboardInput", (evt, data) => {
      // Skip if content is already processed
      if (data.content) {
        return;
      }

      const xmcontrol = data.dataTransfer.getData("xmcontrol");
      if (xmcontrol) {
        try {
          const controlData = JSON.parse(xmcontrol);
          const writer = editor.model.createWriter();
          const placeholder = writer.createElement("xplaceholder", { value: controlData.value || "" });
          
          // Get the drop position from data.targetRanges
          let position = null;
          if (data.targetRanges && data.targetRanges.length) {
            const viewRange = data.targetRanges[0];
            position = editor.editing.mapper.toModelPosition(viewRange.start);
          } else {
            // Fallback to selection or document start
            position = editor.model.document.selection.getFirstPosition() || 
                      writer.createPositionAt(editor.model.document.getRoot(), 0);
          }

          // Insert the placeholder if the position is valid
          if (editor.model.schema.checkChild(position.parent, "xplaceholder")) {
            editor.model.change((modelWriter) => {
              modelWriter.insert(placeholder, position);
            });
            data.content = editor.data.toView(placeholder);
          }
        } catch (error) {
          console.error("Error processing xmcontrol data: ", error);
        }
      }
    });

    // Processing copied content
    this.listenTo(document, "clipboardOutput", (evt, data) => {
      if (data.content.childCount !== 1) {
        return;
      }
      // Optional: Add custom clipboard output logic if needed
    });
  }
}
