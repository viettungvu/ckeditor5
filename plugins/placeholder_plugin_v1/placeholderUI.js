import { ListView, ListItemView, ButtonView, ContextualBalloon } from "@ckeditor/ckeditor5-ui";
import ClickObserver from "@ckeditor/ckeditor5-engine/src/view/observer/clickobserver";
import clickOutsideHandler from "@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import Utils from "../utils/utils.js";
import * as xplaceholder from "./constants.js";
export default class PlaceholderUIV1 extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    this.editor.editing.view.addObserver(ClickObserver);
    this.formView = this._createListView();
    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this._createToolbarMathButton();
    this._enableUserBalloonInteractions();
  }
  destroy() {
    super.destroy();
    this.formView.destroy();
  }
  _showUI() {
    this._addFormView();
    this._balloon.showStack("main");
  }
  _addFormView() {
    if (this._isFormInPanel) {
      return;
    }
    this.formView = this._createListView();
    this._balloon.add({
      view: this.formView,
      position: Utils.getBalloonPositionData(this.editor),
    });
  }

  _createListView() {
    const placeholders = this.editor.config.get("xplaceholder.types") || [
      { text: "Date", value: "date" },
      { text: "First Name", value: "first_name" },
      { text: "Surname", value: "surname" },
    ];
    // Create a ListView for the placeholder types
    const listView = new ListView(this.editor.locale);

    listView.set({
      role: "menu",
      class: [xplaceholder.AUTHOR_CLASS, "ck-placeholder-list"].join(' '),
    });

    // Create list items for each placeholder type
    const items = placeholders.map((type) => {
      const listItem = new ListItemView(this.editor.locale);
      const buttonView = new ButtonView(this.editor.locale);
      buttonView.set({
        label: type.text,
        withText: true,
        class: [xplaceholder.AUTHOR_CLASS, "ck-button__label"].join(' '),
      });
      listItem.setTemplate({
        tag: "li",
        attributes: {
          class: [xplaceholder.AUTHOR_CLASS, "ck-list__item"].join(' '),
        },
        children: [buttonView],
      });
      listItem.set({
        label: type.text,
        withText: true,
      });

      // Execute the placeholder command and hide the panel on click
      buttonView.on("execute", () => {
        this.editor.execute(xplaceholder.CMD_NAME, { value: type.value });
        this.editor.editing.view.focus();
        // Hide the panel
        // const panelView = listView.element.closest('.ck-placeholder-panel');
        // if (panelView) {
        //   panelView.style.display = 'none';
        // }
      });

      return listItem;
    });

    listView.items.addMany(items);

    // Bind list's isEnabled to the placeholder command
    listView.set("isEnabled", false);
    listView.bind("isEnabled").to(this.editor.commands.get(xplaceholder.CMD_NAME), "isEnabled");
    return listView;
  }

  _hideUI() {
    if (!this._isFormInPanel) {
      return;
    }

    this.stopListening(this.editor.ui, "update");
    this.stopListening(this._balloon, "change:visibleView");

    this.editor.editing.view.focus();

    // Remove form first because it's on top of the stack.
    this._removeFormView();
  }

  _closeFormView() {
    const controlCommand = this.editor.commands.get(xplaceholder.CMD_NAME);
    if (controlCommand.value !== undefined) {
      this._removeFormView();
    } else {
      this._hideUI();
    }
  }

  _removeFormView() {
    if (this._isFormInPanel) {
      this._balloon.remove(this.formView);
      this.editor.editing.view.focus();
    }
  }

  _createToolbarMathButton() {
    const editor = this.editor;
    const cmd = editor.commands.get(xplaceholder.CMD_NAME);
    const t = this.editor.t;

    // Handle the `Ctrl+Alt+P` keystroke and show the panel.
    this.editor.keystrokes.set(xplaceholder.PLUGIN_KEYSTROKE, (keyEvtData, cancel) => {
      // Prevent focusing the search bar in FF and opening new tab in Edge. #153, #154.
      cancel();

      if (cmd.isEnabled) {
        this._showUI();
      }
    });

    this.editor.ui.componentFactory.add("placeholder", (locale) => {
      const button = new ButtonView(locale);

      button.isEnabled = true;
      button.label = t("Chèn placeholder");
      button.icon = xplaceholder.PLUGIN_ICON;
      button.keystroke = xplaceholder.PLUGIN_KEYSTROKE;
      button.tooltip = true;
      button.isToggleable = true;

      button.bind("isEnabled").to(cmd, "isEnabled");

      this.listenTo(button, "execute", () => this._showUI());

      return button;
    });
  }
  _enableUserBalloonInteractions() {
    const viewDocument = this.editor.editing.view.document;
    this.listenTo(viewDocument, "click", () => {
      const controlCommand = this.editor.commands.get(xplaceholder.CMD_NAME);
      if (controlCommand.value) {
        this._showUI();
      }
    });

    // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
    this.editor.keystrokes.set("Esc", (data, cancel) => {
      if (this._isUIVisible) {
        this._hideUI();
        cancel();
      }
    });

    // Close on click outside of balloon panel element.
    clickOutsideHandler({
      emitter: this.formView,
      activator: () => this._isFormInPanel,
      contextElements: [this._balloon.view.element],
      callback: () => this._hideUI(),
    });
  }

  get _isUIVisible() {
    const visibleView = this._balloon.visibleView;

    return visibleView == this.formView;
  }

  get _isFormInPanel() {
    return this._balloon.hasView(this.formView);
  }
}
