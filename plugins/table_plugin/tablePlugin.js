import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';
import UpcastWriter from '@ckeditor/ckeditor5-engine/src/view/upcastwriter';
import { toWidget, viewToModelPositionOutsideModelElement, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
export default class TablePlugin extends Plugin {
    init() {
        console.log('TableEditingPlugin initialized');
        this._defineSchema();
        this._defineConverters();
        const editor = this.editor;
        editor.editing.mapper.on(
            'viewToModelPosition',
            viewToModelPositionOutsideModelElement(editor.model, true)
        );
    }


    upcastTable() {
        console.log('Upcast override updacast');
    }
    _defineSchema() {
        const schema = this.editor.model.schema;
        schema.register('t-table', {
            allowWhere: '$block',
            isInline: true,
            isObject: true,
            allowAttributes: ['style', 'data']
        });
    }
    _defineConverters() {
        const conversion = this.editor.conversion;
        conversion.for('upcast').elementToElement({
            view: {
                name: 'figure',
                classes: ['table']
            },
            model: (viewElement, { writer }) => {
                return writer.createElement('t-table', getTableData(viewElement));
            },
            converterPriority: 'high'
        });


        conversion.for('dataDowncast').elementToElement({
            model: 't-table',
            view: (modelItem, { writer: viewWriter }) => createTableView(modelItem, viewWriter)
        });

        conversion.for('editingDowncast').elementToElement({
            model: 't-table',
            view: (modelItem, { writer: viewWriter }) => toWidget(createTableView(modelItem, viewWriter), viewWriter)
        });


        function createTableView(modelItem, viewWriter) {
            console.log(modelItem);
            return viewWriter.createContainerElement('table', {class:'table table-bordered'}, [
                viewWriter.createContainerElement('tbody', {}, [
                    viewWriter.createContainerElement('tr', {}, [
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'1')
                        ]),
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'2')
                        ]), 
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'3')
                        ])
                    ]),
                    viewWriter.createContainerElement('tr', {}, [
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'1')
                        ]),
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'1')
                        ]), 
                        viewWriter.createContainerElement('td', {}, [
                            viewWriter.createContainerElement('span', {class:'bcd'},'1')
                        ])
                    ])
                ])
            ])
        }


        function getTableData(viewElement) {

            const table=Array.from(viewElement.getChildren()).find(e=>e.is('element', 'table'));
          
            const tableChildElements = table.getChildren();

            const bodyElement = Array.from(tableChildElements).find(element => element.is('element', 'tbody'))

            const colGroups = Array.from(tableChildElements).find(element => element.is('element', 'colgroup'));
            const rowsElement = Array.from(bodyElement.getChildren());
            console.log(rowsElement);
            let tableData = [];
            let tableWithColums;
            for (let index = 0; index < rowsElement.length; index++) {
                const rowElement = rowsElement[index];
                const colsInRow = Array.from(rowElement.getChildren());
                const rowData = colsInRow.map(col => {
                    return getText(col);
                });
                tableData.push({
                    row: index,
                    data: rowData
                })
            }
            console.log(tableData);
            if (colGroups) {
                const colWidth = Array.from(colGroups.getChildren()).map(col => {
                    return col.getStyle('width');
                })
                return {
                    style: colWidth,
                    data: tableData
                }
            }
            return {
                style: [],
                data: tableData
            }
        }

        function getText(viewElement) {
            return Array.from(viewElement.getChildren())
                .map(node => node.is('$text') ? node.data : '')
                .join('');
        }
    }
}