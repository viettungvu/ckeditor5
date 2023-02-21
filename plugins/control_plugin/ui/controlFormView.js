import View from '@ckeditor/ckeditor5-ui/src/view';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';

import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import InputTextView from '@ckeditor/ckeditor5-ui/src/inputtext/inputtextview';
import {createLabeledInputText} from '@ckeditor/ckeditor5-ui/src/labeledfield/utils';
import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import Utils from '../../utils/utils';
import { ControlType } from "../../enums/enums";
export default class ControlFormView extends View {
    constructor(locale, controlType, controlValues) {
        super(locale);
        const t = locale.t;

        // Submit button
        this.saveButtonView = this._createButton(t('Lưu'), checkIcon, 'ck-button-save', null);
        this.saveButtonView.type = 'submit';

        // Cancel button
        this.cancelButtonView = this._createButton(t('Hủy'), cancelIcon, 'ck-button-cancel', 'cancel');
        let children = [];
        if (controlType == ControlType.PHAN_SO) {
            children=[
                {
                    tag:'div',
                    attributes:{
						class:[
							'ck-control-view__item'
						]
					},
                    children:[
                        this._createControlLabelInput(0, 'Tử số'),
                        this._createControlLabelInput(0, 'Mẫu số'),
                    ]
                }
            ]
        }
        this.setTemplate({
            tag:'form',
            attributes: {
				class: [
					'ck',
					'ck-control-form',
					...popupClassName
				],
				tabindex: '-1',
				spellcheck: 'false'
			},
			children: [
                {
                    tag:'div',
                    attributes: {
						class: [
							'ck-control-form-group'
						]
					},
                    children
                },
				{
					tag: 'div',
					attributes: {
						class: [
							'ck-control-group__button'
						]
					},
					children: [
						this.saveButtonView,
						this.cancelButtonView
					]
				}
			]
        })
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

    _createControlInput(type, values) {
        const t = this.locale.t;
        const inputView = new InputTextView(this.locale);
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

    _createControlLabelInput(value, label){
        const t=this.locale.t;
        const labeledInputView = new LabeledFieldView(this.locale, createLabeledInputText );
        labeledInputView.label=t(label);
        const inputView = mathInput.inputView;
        inputView.element.value=value.trim();
        return labeledInputView;
    }
}