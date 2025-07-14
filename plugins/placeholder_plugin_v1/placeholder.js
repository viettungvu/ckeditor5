import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import PlaceholderUIV1 from "./placeholderUI";
import PlaceholderEditingV1 from "./placeholderEditing";
import "./placeholder.css";

export default class PlaceholderV1 extends Plugin {
  static get requires() {
    return [PlaceholderEditingV1, PlaceholderUIV1];
  }
}
