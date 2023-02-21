import {
    View,
    LabeledFieldView,
    createLabeledInputText,
    submitHandler,
    ButtonView,
    InputTextView
} from '@ckeditor/ckeditor5-ui';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import Utils from '../../utils/utils';
import { ControlType } from "../../../enums/enums";
import '../../../theme/controlform.css';
export default class ControlFormView extends View {
    constructor(locale, id, type, value) {
        super(locale);
        const t = locale.t;
        this.id = id;
        this.type = type;
        // Submit button
        this.saveButtonView = this._createButton(t('Lưu'), checkIcon, 'ck-button-save', null);
        this.saveButtonView.type = 'submit';

        // Cancel button
        this.cancelButtonView = this._createButton(t('Hủy'), cancelIcon, 'ck-button-cancel', 'cancel');
        let children = [];
        if (type == ControlType.PHAN_SO) {
            this.tuSoInputView = this._createControlLabelInput(value.tuSo, 'Tử số');
            this.mauSoInputView = this._createControlLabelInput(value.mauSo, 'Mẫu số');
            children = [
                this.tuSoInputView,
                this.mauSoInputView
            ]
        }
        else if (type == ControlType.PHEP_CHIA) {
            this.soBiChiaInputView = this._createControlLabelInput(value.soBiChia, 'Số bị chia');
            this.soChiaInputView = this._createControlLabelInput(value.soChia, 'Số chia');
            this.soThuongInputView = this._createControlLabelInput(value.thuongSo, 'Số dư');
            this.soDuInputView = this._createControlLabelInput(value.soDu, 'Thương');
            children = [
                this.soBiChiaInputView,
                this.soChiaInputView,
                this.soThuongInputView,
                this.soDuInputView,
            ]
        }
        else if (type == ControlType.LUA_CHON) {
            this.luaChonInputView = this._createControlTextarea(value);
            children = [this.luaChonInputView]
        }
        else {
            //Nothing
        }
        this.setTemplate({
            tag: 'form',
            attributes: {
                class: [
                    'ck',
                    'ck-control-form',
                ],
                tabindex: '-1',
                spellcheck: 'false'
            },
            children: [
                {
                    tag: 'div',
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

    render() {
        super.render();

        // Submit the form when the user clicked the save button
        // or pressed enter in the input.
        submitHandler({
            view: this
        });
    }

    focus() {
        this.childViews.first.focus();
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

    _createControlTextarea(value) {
        const t = this.locale.t;
        const inputView = new InputTextView(this.locale);
        const content = value.map(i => i.equation).join('\n');
        let template = inputView.template;
        template.tag = 'textarea';
        inputView.set('value', content);
        inputView.extendTemplate({
            attributes: {
                rows: '3',
                placeholder: t('Nhập lựa chọn'),
                class: [
                    'ck-math-textarea'
                ],
                
            }
        })
        return inputView;
    }

    _createControlLabelInput(value, label) {
        const t = this.locale.t;
        const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
        labeledInput.label = t(label);
        labeledInput.fieldView.value = value;
        return labeledInput;
    }
}