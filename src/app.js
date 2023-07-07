import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import InlineEditor from '@ckeditor/ckeditor5-editor-inline/src/inlineeditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Alignment from '@ckeditor/ckeditor5-alignment/src/alignment';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import List from '@ckeditor/ckeditor5-list/src/list';
import ListProperties from '@ckeditor/ckeditor5-list/src/listproperties';
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import { Image, ImageInsert, ImageUpload, ImageResizeEditing, ImageResizeHandles, ImageResize, ImageToolbar, ImageTextAlternative, ImageCaption, ImageStyleUI }
    from '@ckeditor/ckeditor5-image';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import SimpleUploadAdapter from '@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter';
import { ControlType, BackgroundColorClass } from '../enums/enums';
import Control from '../plugins/control_plugin/control';
import Math from '../plugins/math_plugin/math';
import CKEditorInspector from '@ckeditor/ckeditor5-inspector';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
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
    Control, Math, MathType,
    Image, ImageResizeEditing, ImageResizeHandles, ImageResize, ImageToolbar, ImageTextAlternative, ImageStyleUI,
    SimpleUploadAdapter, ImageUpload, ImageInsert,
    List, ListProperties,
    SourceEditing,

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
        disallow: [

        ]
    },
    toolbar: {
        items: [
            'heading', '|',
            'bold', 'italic', 'bulletedList', 'numberedList', '|',
            'alignment', '|',
            'insertImage', '|',
            'math', 'MathType', '|',
            'sourceEditing', '|',
            'undo', 'redo', '|',
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
            label: 'Gốc',
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
        },
        {
            name: 'resizeImage:300',
            label: '300px',
            value: '300'
        },
        {
            name: 'resizeImage:400',
            label: '400px',
            value: '400'
        }
        ],
        insert: {
            type: 'inline'
        },
        styles: {
            // // Defining custom styling options for the images.
            // options: [ {
            //     name: 'side',
            //     icon: sideIcon,
            //     title: 'Side image',
            //     className: 'image-side',
            //     modelElements: [ 'imageBlock' ]
            // }, {
            //     name: 'margin-left',
            //     icon: leftIcon,
            //     title: 'Image on left margin',
            //     className: 'image-margin-left',
            //     modelElements: [ 'imageInline' ]
            // }, {
            //     name: 'margin-right',
            //     icon: rightIcon,
            //     title: 'Image on right margin',
            //     className: 'image-margin-right',
            //     modelElements: [ 'imageInline' ]
            // },
            // // Modifying icons and titles of the default inline and
            // // block image styles to reflect its real appearance.
            // {
            //     name: 'inline',
            //     icon: inlineIcon
            // }, {
            //     name: 'block',
            //     title: 'Centered image',
            //     icon: centerIcon
            // } ]
        },
        toolbar: ['imageTextAlternative', '|', 'imageStyle', 'resizeImage']
    },
}


class XMInlineEditor extends InlineEditor {

};
XMInlineEditor.builtinPlugins = [
    Essentials,
    Bold, Italic,
    Paragraph,
    Control, Math, MathType,
    Image, ImageResizeEditing, ImageResizeHandles, ImageResize, ImageToolbar, ImageTextAlternative, ImageStyleUI,
    SimpleUploadAdapter, ImageUpload, ImageInsert,
];
// Editor configuration.
XMInlineEditor.defaultConfig = {
    language: 'vi',
    htmlSupport: {
        allow: [ /* HTML features to allow */ {
            name: /.*/,
            attributes: true,
            classes: true,
            styles: true
        }],
        disallow: [

        ]
    },
    toolbar: {
        items: [
            'bold', 'italic', '|',
            'insertImage', '|',
            'math', 'MathType', '|',
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
            label: 'Gốc',
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
        },
        {
            name: 'resizeImage:300',
            label: '300px',
            value: '300'
        },
        {
            name: 'resizeImage:400',
            label: '400px',
            value: '400'
        }
        ],
        insert: {
            type: 'inline'
        },
        styles: {
            // // Defining custom styling options for the images.
            // options: [ {
            //     name: 'side',
            //     icon: sideIcon,
            //     title: 'Side image',
            //     className: 'image-side',
            //     modelElements: [ 'imageBlock' ]
            // }, {
            //     name: 'margin-left',
            //     icon: leftIcon,
            //     title: 'Image on left margin',
            //     className: 'image-margin-left',
            //     modelElements: [ 'imageInline' ]
            // }, {
            //     name: 'margin-right',
            //     icon: rightIcon,
            //     title: 'Image on right margin',
            //     className: 'image-margin-right',
            //     modelElements: [ 'imageInline' ]
            // },
            // // Modifying icons and titles of the default inline and
            // // block image styles to reflect its real appearance.
            // {
            //     name: 'inline',
            //     icon: inlineIcon
            // }, {
            //     name: 'block',
            //     title: 'Centered image',
            //     icon: centerIcon
            // } ]
        },
        toolbar: ['imageTextAlternative', '|', 'imageStyle', 'resizeImage']
    },
}


export default { XMEditor,XMInlineEditor };