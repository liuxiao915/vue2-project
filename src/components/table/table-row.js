import tableTd from './table-td.vue'

export default {
    name: 'SapiTableRow',
    inject: {
        table: {
            from: 'table',
            default () {
                return {}
            }
        }
    },
    components: {
        tableTd
    },
    props: {
        row: {
            type: Object,
            default () {
                return {}
            }
        },
        rowIndex: {
            type: Number
        },
        rowKey: {
            type: String,
            default: ''
        },
        treeProps: {
            type: Object,
            default() {
                return {
                    children: 'children'
                }
            }
        },
        level: {
            type: Number
        },
        indent: {
            type: Number
        },
        parentNode: {
            type: Object
        },
        isExpand: {
            type: Boolean
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
        tdClassName: {
            type: Function
        },
        formatter: {
            type: Function
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false
        }
    },
    render (h) {
        const { children } = this.treeProps;
        
        const rowProps = {
            class: {
                'sapi-table_row': true
            },
            style: {},
            on: {}
        }

        const className =  this.rowKey ? `sapi-tree-table_row--level-${this.level - 1}-${this.rowIndex}` : '';
        rowProps.class[className] = true;
        if (this.rowKey) {
            rowProps.key =  this.row[this.rowKey];
            rowProps.style.display = !this.parentNode || this.parentNode && this.isExpand ? '' : 'none';
        }

        if (typeof this.rowClassName === 'function') {
            const rowClass = this.rowClassName(this.row, this.rowIndex);
            rowProps.class[rowClass] = true
        }

        if (typeof this.rowStyle === 'function') {
            const rowStyle = this.rowStyle(this.row, this.rowIndex);
            rowProps.style = rowStyle;
        }
        
        if (this.table.$listeners['row-click'] || this.highlightCurrentRow) {
            const vm = this;
            rowProps.on.click = function(e) {
                if (vm.table.$listeners['row-click']) {
                    vm.table.$emit('row-click', this.row, this.rowIndex, e)
                }

                if (vm.highlightCurrentRow) {
                    const el = e.target || e.srcElement;
                    const targetTr = vm.getElParentNode(el, 'tr');
                    const trs = Array.prototype.slice.call(targetTr.parentNode.querySelectorAll('tr'));
                    for(let tr of trs) {
                        tr.classList.remove('current-row');
                    }
                    targetTr.classList.add('current-row');
                }
            }
        }
        
        const expand = !!this.rowKey && !!this.row[children] && !!this.row[children].length;

        return h('tr', rowProps, this.getTds(expand))
    },
    methods: {
        getTds (expand) {
            const store = this.table.store
            return store.columns.map((column, index) => {
                const tabelColumnProps = {
                    on: {},
                    props: {
                        row: this.row,
                        rowIndex: this.rowIndex,
                        column: column,
                        columnIndex: index,
                        cellClassName: this.cellClassName,
                        cellStyle: this.cellStyle,
                        tdClassName: this.tdClassName,
                        formatter: this.formatter,
                        rowKey: this.rowKey,
                        level: this.level,
                        indent: (this.level - 1) * this.indent,
                        expand: expand,
                        isExpand: this.isExpand
                    },
                    scopedSlots: {
                        default: (props) => {
                            if (column && column.renderCell) {
                                return column.renderCell(props)
                            }
                        }
                    }
                }
                if (this.table.$listeners['cell-click']) {
                    const vm = this;
                    tabelColumnProps.on.click = function(e) {
                        vm.table.$emit('cell-click', this.row, this.rowIndex, column, index, e)
                    }
                }
                return this.$createElement('table-td', tabelColumnProps)
            })
        },
        getElParentNode (el, parentTagName) {
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
    }
}