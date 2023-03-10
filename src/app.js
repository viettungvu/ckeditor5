import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import DocumentList from '@ckeditor/ckeditor5-list/src/documentlist';
import DocumentListProperties from '@ckeditor/ckeditor5-list/src/documentlistproperties';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageInsert from '@ckeditor/ckeditor5-image/src/imageinsert';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResizeEditing from '@ckeditor/ckeditor5-image/src/imageresize/imageresizeediting';
import ImageResizeHandles from '@ckeditor/ckeditor5-image/src/imageresize/imageresizehandles';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
//import Base64UploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import { ControlType, BackgroundColorClass } from '../enums/enums';
import Control from '../plugins/control_plugin/control';
import Math from '../plugins/math_plugin/math';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
//import Placeholder from '../plugins/demo_plugin/demo'
class XMEditor extends ClassicEditor {
    static ControlType = ControlType;
    static BackgroundColorClass = BackgroundColorClass;
    static Inspector = CKEditorInspector;
};
XMEditor.builtinPlugins = [
    Essentials,
    Bold, Italic,
    Heading,
    Paragraph,
    Alignment,
    GeneralHtmlSupport,
    Control, Math,
    Image, ImageResizeEditing, ImageResizeHandles, ImageResize,
    SimpleUploadAdapter, ImageUpload, ImageInsert,
    List, ListProperties,
    SourceEditing,
    //Placeholder
];
// Editor configuration.
XMEditor.defaultConfig = {
    language: 'vi',
    htmlSupport: {
        allow: [ /* HTML features to allow */ {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true
        }],
        disallow: [ /* HTML features to disallow */]
    },
    toolbar: {
        items: [
            'undo', 'redo', '|',
            'heading', '|',
            'bold', 'italic', '|',
            'bulletedList', 'numberedList', '|',
            'alignment', '|',
            'resizeImage', 'insertImage', '|',
            'math', '|',
            'sourceEditing', '|'
        ],
        shouldNotGroupWhenFull: true
    },
    alignment: {
        options: ['left', 'right', 'center', 'justify']
    },
    // simpleUpload: {
    //     uploadUrl: 'https://localhost:44360/images/upload1',
    //     withCredentials: true,
    //     headers: {
    //         'X-CSRF-TOKEN': 'CSRF-Token',
    //         Authorization: 'Bearer <JSON Web Token>'
    //     }
    // },
    // image: {
    //     resizeOptions: [{
    //             name: 'resizeImage:original',
    //             value: null,
    //             icon: 'original'
    //         },
    //         {
    //             name: 'resizeImage:25',
    //             value: '25',
    //             icon: 'small'
    //         },
    //         {
    //             name: 'resizeImage:50',
    //             value: '50',
    //             icon: 'medium'
    //         },
    //         {
    //             name: 'resizeImage:75',
    //             value: '75',
    //             icon: 'large'
    //         }
    //     ]
    // }
    image: {
        resizeUnit: 'px',
        resizeOptions: [{
            name: 'resizeImage:original',
            label: 'Original',
            value: null
        },
        {
            name: 'resizeImage:100',
            label: '100px',
            value: '100'
        },
        {
            name: 'resizeImage:200',
            label: '200px',
            value: '200'
        }
        ],
        insert: {
            type: 'inline'
        }
    }
}
export default XMEditor;