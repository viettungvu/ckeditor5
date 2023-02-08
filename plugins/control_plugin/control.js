import ControlEditing from './controlEditing';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Control extends Plugin {
    static get requires() {
        return [ControlEditing];
    }

}