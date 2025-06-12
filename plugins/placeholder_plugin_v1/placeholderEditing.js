import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";

import { toWidget, viewToModelPositionOutsideModelElement } from "@ckeditor/ckeditor5-widget/src/utils";
import PlaceholderCommandV1 from "./placeholderCommand.js";
import * as xplaceholder from "./constants.js";
export default class PlaceholderEditingV1 extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    //this._defineConverters();

    this.editor.commands.add(xplaceholder.CMD_NAME, new PlaceholderCommandV1(this.editor));

    // this.editor.editing.mapper.on(
    //   "viewToModelPosition",
    //   viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => viewElement.hasClass(xplaceholder.COMMON_CLASS))
    // );
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

    // schema.register(xplaceholder.MODEL_NAME, {
    //   isInline: true,
    //   allowWhere: "$text",
    //   allowAttributes: ["value"],
    // });
    // schema.register('', {
    //   inheritAllFromObject: true,
    //   //allowWhere: "$text",
    //   //allowAttributes: ["value"],
    // });
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
}
