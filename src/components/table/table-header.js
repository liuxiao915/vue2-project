import tableTh from './table-th.vue'

export default {
    name: 'SapiTableHeader',
    inject: {
        table: {
            from: 'table',
            default () {
                return {}
            }
        }
    },
    components: {
        tableTh
    },
    props: {
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
        sortOrders: {
            type: Array,
            default() {
                return ['asc', 'desc', null]
            }
        },
        sortColumnId: {
            type: String
        },
    },
    render (h) {
        const store = this.table.store
        const trProps = {
            class: {},
            style: this.headerRowStyle
        }

        if (this.headerRowClassName) {
            trProps.class = {
                [this.headerRowClassName]: true
            }
        }
        return h('thead', {
            
        }, [
            h('tr', trProps, store.columns.map((column, index) => {
                return h('table-th', {
                    props: {
                        column: column,
                        columnIndex: index,
                        headerCellClassName: this.headerCellClassName,
                        headerCellStyle: this.headerCellStyle,
                        sortOrders: this.sortOrders,
                        sortColumnId: this.sortColumnId
                    },
                    scopedSlots: {
                        default: (props) => {
                            if(column && column.renderHeader) {
                                return column.renderHeader(props)
                            }
                        }
                    }
                })
            }))
        ])
    }
}