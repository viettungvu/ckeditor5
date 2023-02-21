import Command from '@ckeditor/ckeditor5-core/src/command';
import { ControlType, BG_COLOR_CLASS } from '../../enums/enums';

import Utils from '../utils/utils';
export default class ControlCommand extends Command {
    execute(id, type, value) {
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedElement = selection.getSelectedElement();

        model.change(writer => {
            let control;
            if (selectedElement && (selectedElement.is('element', 'xcontrol') ||
                selectedElement.is('element', 'xcontrol-inline'))) {
                const display = selectedElement.is('element', 'xcontrol');
                const classList = selectedElement.getAttribute('class');
                control = writer.createElement(display ? 'xcontrol' : 'xcontrol-inline', { id, type, value, class: classList });
            } else {
                const id = Utils.getTime();
                const classList = [BG_COLOR_CLASS[id % BG_COLOR_CLASS.length], 't-control'];
                control = writer.createElement('xcontrol-inline', { id: id, type: ControlType.NHAP, value: [], class: classList });
            }
            model.insertContent(control);
        });
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;
        const selectedElement = selection.getSelectedElement();

        this.isEnabled = selectedElement === null || (selectedElement.is('element', 'xcontrol') ||
            selectedElement.is('element', 'xcontrol-inline'));
        if (selectedElement) {
            this.id = selectedElement.getAttribute('id');
            this.type = selectedElement.getAttribute('type');
            this.value = selectedElement.getAttribute('value');
            this.display = selectedElement.is('element', 'xcontrol');
            this.classList = selectedElement.getAttribute('class');
        }
        else{
            this.id = null;
            this.type = null;
            this.value = null;
            this.display = null;
            this.classList = null;
        }
    }
}
