import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClickObserver from '@ckeditor/ckeditor5-engine/src/view/observer/clickobserver';
import ContextualBalloon from '@ckeditor/ckeditor5-ui/src/panel/balloon/contextualballoon';
import clickOutsideHandler from '@ckeditor/ckeditor5-ui/src/bindings/clickoutsidehandler';
import uid from '@ckeditor/ckeditor5-utils/src/uid';
import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import Utils from '../utils/utils';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import ControlFormView from './ui/controlFormView';

// Need math commands from there
import MathEditing from './mathediting';
import ControlEditing from './controlEditing';
import { ControlType } from '../../enums/enums';
export default class ControlUI extends Plugin{
    static get requires(){
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
    _createFormView() {
		const editor = this.editor;
		const mathCommand = editor.commands.get('math');

		const mathConfig = editor.config.get('math');

		const formView = new ControlFormView(
			editor.locale,
            ControlType.PHAN_SO
		);

		// formView.mathInputView.bind('value').to(mathCommand, 'value');
		// formView.displayButtonView.bind('isOn').to(mathCommand, 'display');

		// // Form elements should be read-only when corresponding commands are disabled.
		// formView.mathInputView.bind('isReadOnly').to(mathCommand, 'isEnabled', value => !value);
		// formView.saveButtonView.bind('isEnabled').to(mathCommand);
		// formView.displayButtonView.bind('isEnabled').to(mathCommand);

		// Listen to submit button click
		this.listenTo(formView, 'submit', () => {
			//editor.execute('math', formView.equation, formView.displayButtonView.isOn, mathConfig.outputType, mathConfig.forceOutputType);
			this._closeFormView();
		});

		// Listen to cancel button click
		this.listenTo(formView, 'cancel', () => {
			this._closeFormView();
		});

		// Close plugin ui, if esc is pressed (while ui is focused)
		formView.keystrokes.set('esc', (data, cancel) => {
			this._closeFormView();
			cancel();
		});

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
		const mathCommand = this.editor.commands.get('math');
		if (mathCommand.value !== undefined) {
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

	_createToolbarMathButton() {
		const editor = this.editor;
		const mathCommand = editor.commands.get('math');
		const t = editor.t;
        this._showUI();
	}

	_enableUserBalloonInteractions() {
		const editor = this.editor;
		const viewDocument = this.editor.editing.view.document;
		this.listenTo(viewDocument, 'click', () => {
			const controlCommand = editor.commands.get('xcontrol');
            this._showUI();
			
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