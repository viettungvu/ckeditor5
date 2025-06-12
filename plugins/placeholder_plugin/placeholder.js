import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import PlaceholderEditing from "./placeholderEditing";
import PlaceholderUI from "./placeholderUI";
import "./placeholder.css";

export default class Placeholder extends Plugin {
  static get requires() {
    return [PlaceholderEditing, PlaceholderUI];
  }
}
