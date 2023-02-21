import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import uid from '@ckeditor/ckeditor5-utils/src/uid';
import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import Utils from '../utils/utils';
import ControlFormView from './ui/controlFormView';

// Need math commands from there
import ControlEditing from './controlEditing';
import { ControlType } from '../../enums/enums';
export default class ControlUI extends Plugin {
    static get requires() {
        [ContextualBalloon, ControlEditing]
    }
    static get pluginName() {
        return 'ControlUI';
    }
    init() {
        const editor = this.editor;
        editor.editing.view.addObserver(ClickObserver);
        this.formView = this._createFormView();
        this._balloon = editor.plugins.get(ContextualBalloon);
        this._enableUserBalloonInteractions();
    }
    destroy() {
        super.destroy();
        this.formView.destroy();
    }
    _showUI() {
        this._addFormView();
        this._balloon.showStack('main');
    }
    _addFormView() {
        if (this._isFormInPanel) {
            return;
        }
        const editor = this.editor;
        this.formView = this._createFormView();
        this._balloon.add({
            view: this.formView,
            position: Utils.getBalloonPositionData(editor)
        });
    }
    _createFormView() {
        const editor = this.editor;
        const controlCommand = editor.commands.get('control');
        const controlConfig = editor.config.get('controlConfig');
        const formView = new ControlFormView(
            editor.locale,
            controlCommand.id,
            controlCommand.type,
            controlCommand.value,
        );

        //formView.mathInputView.bind('value').to(mathCommand, 'value');
        //formView.displayButtonView.bind('isOn').to(mathCommand, 'display');

        // // Form elements should be read-only when corresponding commands are disabled.
        // formView.mathInputView.bind('isReadOnly').to(mathCommand, 'isEnabled', value => !value);
        formView.saveButtonView.bind('isEnabled').to(controlCommand);
        // formView.displayButtonView.bind('isEnabled').to(mathCommand);

        // Listen to submit button click
        this.listenTo(formView, 'submit', () => {
            if (formView.type == ControlType.PHAN_SO) {
                const value = {
                    tuSo: formView.tuSoInputView.fieldView.element.value,
                    mauSo: formView.mauSoInputView.fieldView.element.value
                }
                editor.execute('control', formView.id, controlCommand.type, value);
            }
            else if (formView.type == ControlType.PHEP_CHIA) {
                const value = {
                    soBiChia: formView.soBiChiaInputView.fieldView.element.value,
                    soChia: formView.soChiaInputView.fieldView.element.value,
                    soDu: formView.soDuInputView.fieldView.element.value,
                    thuongSo: formView.soThuongInputView.fieldView.element.value,
                }
                editor.execute('control', formView.id, controlCommand.type, value);
            }
            else if (formView.type == ControlType.LUA_CHON) {
                let value = [];
                const rawValues = formView.luaChonInputView.element.value;
                if (rawValues) {
                    value = rawValues.split('\n').filter(v => v && v != '');
                    value = value.map((v, index) => ({
                        text: Utils.renderEquationString(v, controlConfig),
                        equation: v,
                        value: `opt_${index}_${formView.id}`,
                    }));
                }
                editor.execute('control', formView.id, controlCommand.type, value);
            }
            this._closeFormView();
        });

        // Listen to cancel button click
        this.listenTo(formView, 'cancel', () => {
            this._closeFormView();
        });

        // Close plugin ui, if esc is pressed (while ui is focused)
        // formView.keystrokes.set('esc', (data, cancel) => {
        // 	this._closeFormView();
        // 	cancel();
        // });

        return formView;
    }
    _hideUI() {
        if (!this._isFormInPanel) {
            return;
        }

        const editor = this.editor;

        this.stopListening(editor.ui, 'update');
        this.stopListening(this._balloon, 'change:visibleView');

        editor.editing.view.focus();

        // Remove form first because it's on top of the stack.
        this._removeFormView();
    }

    _closeFormView() {
        const controlCommand = this.editor.commands.get('control');
        if (controlCommand.value !== undefined) {
            this._removeFormView();
        } else {
            this._hideUI();
        }
    }

    _removeFormView() {
        if (this._isFormInPanel) {
            this.formView.saveButtonView.focus();
            this._balloon.remove(this.formView);
            this.editor.editing.view.focus();
        }
    }
    _enableUserBalloonInteractions() {
        const editor = this.editor;
        const viewDocument = this.editor.editing.view.document;
        this.listenTo(viewDocument, 'click', () => {
            const controlCommand = editor.commands.get('control');
            if (controlCommand.value) {
                this._showUI();
            }
        });

        // Close the panel on the Esc key press when the editable has focus and the balloon is visible.
        editor.keystrokes.set('Esc', (data, cancel) => {
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
            callback: () => this._hideUI()
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