import tableRow from './table-row'

export default {
    name: 'SapiTableBody',
    inject: {
        table: {
            from: 'table',
            default () {
                return {}
            }
        }
    },
    components: {
        tableRow
    },
    props: {
        rowKey: {
            type: String,
            default: ''
        },
        indent: {
            type: Number
        },
        treeProps: {
            type: Object,
            default() {
                return {
                    children: 'children'
                }
            }
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
        },
        defaultExpandAll: {
            type: Boolean,
            default: false
        },
        expandRowKeys: {
            type: Array,
            default () {
                return []
            }
        },
        lazyload: {
            type: Function
        }
    },
    render (h) {
        const { children } = this.treeProps;
        const treeColumns = [];
        const getColumns = (data, level = 1, parentRowVNode = null, isParentRowExpand = true) => {
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                const rowIndex = i;
                let isExpand = false;
                if (this.rowKey) {
                    isExpand = !!this.defaultExpandAll;
                    if (this.expandRowKeys && this.expandRowKeys.length) {
                        if (this.expandRowKeys.includes(row[this.rowKey])) {
                            isExpand = true;
                        }
                    }
                }
                const rowVNode = h('table-row', {
                    props: {
                        row: row,
                        rowIndex: rowIndex,
                        level: level,
                        parentNode: parentRowVNode,
                        isExpand: isExpand && isParentRowExpand,
                        indent: this.indent,
                        rowKey: this.rowKey,
                        treeProps: this.treeProps,
                        rowClassName: this.rowClassName,
                        rowStyle: this.rowStyle,
                        cellClassName: this.cellClassName,
                        cellStyle: this.cellStyle,
                        tdClassName: this.tdClassName,
                        formatter: this.formatter,
                        highlightCurrentRow: this.highlightCurrentRow
                    }
                })

                treeColumns.push(rowVNode)

                if (!!this.rowKey && !!row[children] && !!row[children].length) {
                    getColumns(row[children], level + 1, rowVNode, isExpand)
                }

                // if (this.rowKey) {
                //     this.$nextTick(() => {
                //         rowVNode.componentInstance.nodeData = {
                //             data: row,
                //             level: level,
                //             parentNode: parentRowVNode,
                //             children: []
                //         }
                //         console.log('parentRowVNode:', parentRowVNode.componentInstance.nodeData)
                //         if (parentRowVNode && parentRowVNode.componentInstance && parentRowVNode.componentInstance.nodeData) {
                //             parentRowVNode.componentInstance.nodeData.children.push(rowVNode)
                //         }
                //     })
                // }
            }
        }
        const { data } = this.table
        getColumns(data || []);

        // 传递懒加载函数 增加提示行
        if (this.lazyload || !data.length) {
            const { store } = this.table
            const loadTips = '暂无数据'
            treeColumns.push(h('tr', {
                class: {
                    'sapi-table_row sapi-table_pulling-row': true
                },
                style: {},
                on: {}
            }, [h('td', {
                class: {
                    'sapi-table_row sapi-table_pulling-td': true
                },
                style: {
                    textAlign: 'center'
                },
                on: {},
                attrs: {
                    colspan: store.columns.length
                }
            }, loadTips)]))
        }

        return h('tbody', {

        } , treeColumns);
    }
}