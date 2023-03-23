import Vue from 'vue'
import sapiTableColumn from './table-column.js'
import hTable from './table.vue'
import tableColumn from './table-column.vue'
import tableHeadColumn from './table-head-column.vue'
Vue.component('sapi-table-column', sapiTableColumn)
const getElParentNode = function(el, parentTagName) {
    if (el.tagName.toLowerCase() === parentTagName.toLowerCase()) {
        return el;
    }
    let parentNode = el.parentNode;
    let targetParentNode = null;
    while(!targetParentNode) {
        if (parentNode.tagName.toLowerCase() === parentTagName.toLowerCase()) {
            targetParentNode = parentNode;
        } else {
            parentNode = parentNode.parentNode;
        }
    }
    return targetParentNode;
}
export default {
    name: 'sapi-table',
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        height: {
            type: String
        },
        indent: {
            type: Number,
            default: 10
        },
        // 树形行唯一id，为树形时必需指定
        rowKey: {
            type: String
        },
        treeProps: {
            type: Object,
            default() {
                return {
                    children: 'children'
                }
            }
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        // 默认展开行 rowKey值组成的数组，
        expandRowKeys: {
            type: Array,
            default() {
                return []
            }
        },
        headerRowClassName: {
            type: String
        },
        headerRowStyle: {
            type: Object,
            default() {
                return {}
            }
        },
        headerCellClassName: {
            type: Function
        },
        headerCellStyle: {
            type: Function
        },
        rowClassName: {
            type: Function
        },
        rowStyle: {
            type: Function
        },
        cellClassName: {
            type: Function
        },
        cellStyle: {
            type: Function
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        },
        formatter: {
            type: Function
        }
    },
    components: {
        hTable,
        tableColumn,
        tableHeadColumn
    },
    data() {
        return {

        }
    },
    render(h) {
        const $slots = this.$slots.default;
        const columns = $slots.filter(slot => slot.componentOptions && slot.componentOptions.tag === 'sapi-table-column');
        const columnComponentProps = columns.map(column => column.componentOptions.propsData);
        const _this = this
        const headerChildNodes = columnComponentProps.map((property, index) => {
            return h('table-head-column', {
                props: {
                    column: property,
                    columnIndex: index,
                    headerCellClassName: this.headerCellClassName,
                    headerCellStyle: this.headerCellStyle,
                    data: this.data
                },
                scopedSlots: {
                    default: (props) => {
                        if(columns[index].data.scopedSlots && columns[index].data.scopedSlots.header) {
                            return columns[index].data.scopedSlots.header(props)
                        }
                    }
                },
                on: {
                    "sort-change"(column,sortable){
                        _this.$emit("sort-change",column, sortable)
                    }
                }
            })
        })
        
        const getColumnChildNodes = (row, rowIndex, level, indent, expand, isExpand, showFixedCellContent) => {
            return columnComponentProps.map((property, index) => {
                const tabelColumnProps = {
                    on: {},
                    props: {
                        row: row,
                        rowIndex: rowIndex,
                        column: property,
                        columnIndex: index,
                        cellClassName: this.cellClassName,
                        cellStyle: this.cellStyle,
                        formatter: this.formatter,
                        rowKey: this.rowKey,
                        level: level,
                        indent: indent,
                        expand: expand,
                        isExpand: isExpand,
                        showFixedCellContent: (property.fixed === true || property.fixed === '') && showFixedCellContent
                    },
                    scopedSlots: {
                        default: (props) => {
                            if (columns[index].data.scopedSlots && columns[index].data.scopedSlots.default) {
                                return columns[index].data.scopedSlots.default(props)
                            }
                        }
                    }
                }
                if (this.$listeners['cell-click']) {
                    const vm = this;
                    tabelColumnProps.on.click = function(e) {
                        vm.$emit('cell-click', row, rowIndex, property, index, e)
                    }
                }
                return h('table-column', tabelColumnProps)
            })
        }

        const fixedWidth = columnComponentProps.reduce((total, column) => {
            if (column.width && (column.fixed === '' || column.fixed === true)) {
                total += parseInt(column.width);
            }
            return total;
        }, 0)
        
        const getTreeColumnChildNodes = (showFixedCellContent) => {
            const indent = this.indent;
            const rowKey = this.rowKey;
            const { children } = this.treeProps;
            const treeColumns = [];
            const getColumns = (data, level = 1, isParentRowExpand = true) => {
                for (let i = 0; i < data.length; i++) {
                    const rowIndex = i;
                    const row = data[rowIndex];
                    let isExpand = false;

                    const rowProps = {
                        class: {
                            'sapi-table_row': true
                        },
                        style: {},
                        on: {}
                    }

                    const className = rowKey ? `sapi-tree-table_row--level-${level - 1}-${i}` : '';
                    rowProps.class[className] = true;
                    if (rowKey) {
                        rowProps.key = row[rowKey];
                        rowProps.style.display = isParentRowExpand ? '' : 'none';
                        isExpand = !!this.defaultExpandAll;
                        if (this.expandRowKeys && this.expandRowKeys.length) {
                            if (this.expandRowKeys.includes(row[rowKey])) {
                                isExpand = true;
                            }
                        }
                    }

                    if (typeof this.rowClassName === 'function') {
                        const rowClass = this.rowClassName(row, rowIndex);
                        rowProps.class[rowClass] = true
                    }

                    if (typeof this.rowStyle === 'function') {
                        const rowStyle = this.rowStyle(row, rowIndex);
                        rowProps.style = rowStyle;
                    }
                    
                    if (this.$listeners['row-click'] || this.highlightCurrentRow) {
                        const vm = this;
                        rowProps.on.click = function(e) {
                            if (vm.$listeners['row-click']) {
                                vm.$emit('row-click', row, rowIndex, e)
                            }

                            if (vm.highlightCurrentRow) {
                                const el = e.target || e.srcElement;
                                const targetTr = getElParentNode(el, 'tr');
                                const trs = Array.prototype.slice.call(targetTr.parentNode.querySelectorAll('tr'));
                                for(let tr of trs) {
                                    tr.classList.remove('current-row');
                                }
                                targetTr.classList.add('current-row');
                            }
                        }
                    }
                    
                    const expand = rowKey && row[children] && row[children].length;

                    treeColumns.push(h('tr', rowProps, getColumnChildNodes(row, rowIndex, level, (level - 1) * indent, expand, isExpand, showFixedCellContent)))
                    if (expand) {
                        getColumns(row[children], level + 1, isExpand)
                    }
                }
            }
            
            getColumns(this.data || []);
            return treeColumns;
        }
        return h('h-table', {
            props: {
                height: this.height,
                fixedTableWidth: fixedWidth,
                data: this.data
            },
            scopedSlots: {
                header: () => {
                    const trProps = {
                        class: {},
                        style: this.headerRowStyle
                    };
                    if (this.headerRowClassName) {
                        trProps.class = {
                            [this.headerRowClassName]: true
                        }
                    }
                    return h('thead', {
                        
                    }, [
                        h('tr', trProps, headerChildNodes)
                    ])
                },
                body: () => {
                    
                    return h('tbody', {

                    } , getTreeColumnChildNodes(false))
                },
                fixedbody: () => {
                    
                    return h('tbody', {

                    } , getTreeColumnChildNodes(true))
                }
            }
        }, [])
    }
}