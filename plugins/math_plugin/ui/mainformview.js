import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import LabelView from '@ckeditor/ckeditor5-ui/src/label/labelview';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';

import Utils from '../../utils/utils';

import MathView from './mathview';

import '../../../theme/mathform.css';

export default class MainFormView extends View {
	constructor(locale, engine, lazyLoad, previewEnabled, previewUid, previewClassName, popupClassName, katexRenderOptions) {
		super(locale);

		const t = locale.t;

		// Create key event & focus trackers
		this._createKeyAndFocusTrackers();

		// Submit button
		this.saveButtonView = this._createButton(t('Lưu'), checkIcon, 'ck-button-save', null);
		this.saveButtonView.type = 'submit';

		// Equation input
		this.mathInputView = this._createMathInput();

		// Display button
		this.displayButtonView = this._createDisplayButton();

		// Cancel button
		this.cancelButtonView = this._createButton(t('Hủy'), cancelIcon, 'ck-button-cancel', 'cancel');

		this.previewEnabled = previewEnabled;

		let children = [];
		if (this.previewEnabled) {
			// Preview label
			this.previewLabel = new LabelView(locale);
			this.previewLabel.text = t('Xem trước');

			// Math element
			this.mathView = new MathView(engine, lazyLoad, locale, previewUid, previewClassName, katexRenderOptions);
			this.mathView.bind('display').to(this.displayButtonView, 'isOn');

			children = [
				{
					tag:'div',
					attributes:{
						class:[
							'ck-math-view__item'
						]
					},
					children:[this.mathInputView]
				},
				{
					tag:'div',
					attributes:{
						class:[
							'ck-math-view__item'
						]
					},
					children:[this.displayButtonView]
				},
				{
					tag:'div',
					attributes:{
						class:[
							'ck-math-view__item'
						]
					},
					children:[this.previewLabel]
				},
				{
					tag:'div',
					attributes:{
						class:[
							'ck-math-view__item'
						]
					},
					children:[this.mathView]
				}
			];
		} else {
			children = [
				this.mathInputView,
				this.displayButtonView
			];
		}

		// Add UI elements to template
		this.setTemplate({
			tag: 'form',
			attributes: {
				class: [
					'ck',
					'ck-math-form',
					...popupClassName
				],
				tabindex: '-1',
				spellcheck: 'false'
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: [
							'ck-math-view'
						]
					},
					children
				},
				{
					tag: 'div',
					attributes: {
						class: [
							'ck-math-group__button'
						]
					},
					children: [
						this.saveButtonView,
						this.cancelButtonView
					]
				}
			]
		});
	}

	render() {
		super.render();

		// Prevent default form submit event & trigger custom 'submit'
		submitHandler({
			view: this
		});

		// Register form elements to focusable elements
		const childViews = [
			this.mathInputView,
			this.displayButtonView,
			this.saveButtonView,
			this.cancelButtonView
		];

		childViews.forEach(v => {
			this._focusables.add(v);
			this.focusTracker.add(v.element);
		});

		// Listen to keypresses inside form element
		this.keystrokes.listenTo(this.element);
	}

	focus() {
		this._focusCycler.focusFirst();
	}

	get equation() {
		return this.mathInputView.element.value;
	}

	set equation(equation) {
		this.mathInputView.element.value = equation;
		if (this.previewEnabled) {
			this.mathView.value = equation;
		}
	}

	_createKeyAndFocusTrackers() {
		this.focusTracker = new FocusTracker();
		this.keystrokes = new KeystrokeHandler();
		this._focusables = new ViewCollection();

		this._focusCycler = new FocusCycler({
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				focusPrevious: 'shift + tab',
				focusNext: 'tab'
			}
		});
	}

	_createMathInput() {
		const t = this.locale.t;
		const inputView=new InputTextView(this.locale);
		let template = inputView.template;
		template.tag = 'textarea';
		inputView.extendTemplate({
			attributes: {
				rows: '3',
				placeholder: t('Nhập công thức'),
				class: [
					'ck-math-textarea'
				],
			}
		})

		const onInput = () => {
			if (inputView.element != null) {
				let equationInput = inputView.element.value.trim();

				// If input has delimiters
				if (Utils.hasDelimiters(equationInput)) {
					// Get equation without delimiters
					const params = Utils.extractDelimiters(equationInput);

					// Remove delimiters from input field
					inputView.element.value = params.equation;

					equationInput = params.equation;

					// update display button and preview
					this.displayButtonView.isOn = params.display;
				}
				if (this.previewEnabled) {
					// Update preview view
					this.mathView.value = equationInput;
				}

				this.saveButtonView.isEnabled = !!equationInput;
			}
		};
		inputView.on('render', onInput);
		inputView.on('input', onInput);
		inputView.on('change:value', onInput);
		return inputView;
	}

	_createButton(label, icon, className, eventName) {
		const button = new ButtonView(this.locale);

		button.set({
			label,
			icon,
			tooltip: true
		});

		button.extendTemplate({
			attributes: {
				class: className
			}
		});

		if (eventName) {
			button.delegate('execute').to(this, eventName);
		}

		return button;
	}

	_createDisplayButton() {
		const t = this.locale.t;

		const switchButton = new SwitchButtonView(this.locale);

		switchButton.set({
			label: t('Hiển thị 1 dòng'),
			withText: true
		});

		switchButton.extendTemplate({
			attributes: {
				class: 'ck-button-display-toggle'
			}
		});

		switchButton.on('execute', () => {
			// Toggle state
			switchButton.isOn = !switchButton.isOn;

			if (this.previewEnabled) {
				// Update preview view
				this.mathView.display = switchButton.isOn;
			}
		});

		return switchButton;
	}
}
