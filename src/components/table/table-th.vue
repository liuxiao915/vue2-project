<template>
    <th :style="{ textAlign: column.headerAlign || column.align, ...cellWidthStyle }">
        <div class="table-cell table-header-cell" :style="{justifyContent: computedAlign ,...bindCellStyle}" :class="cellClass" @click="changeTableSort(column,$event)">
            <slot :column="column">
                {{ column.label === undefined ? '' : column.label }}
            </slot>
            <span v-if="column.sortable" class="caret-wrapper" style="">
                <i class="sort-caret ascending" :class="{'active': sortType === true}"></i>
                <i class="sort-caret descending" :class="{'active': sortType === false}"></i>
            </span>
        </div>
    </th>
</template>

<script>
let tableColumnIdSeed = 0;
export default {
    name: 'SapiTableTh',
    inject: {
        table: {
            from: 'table',
            default () {
                return null
            }
        }
    },
    props: {
        column: {
            type: Object,
            default() {
                return {
                    label: ''
                }
            }
        },
        sortOrders: {
            type: Array,
        },
        columnIndex: {
            type: Number
        },
        headerCellClassName: {
            type: Function
        },
        headerCellStyle: {
            type: Function
        },
        sortColumnId: {
            type: String
        }
    },
    watch: {
        column() {
            this.init();
        },
        sortColumnId(val) {
            if (val !== this.tableColumnId) {
                this.sortType = null;
            }
        }
    },
    data() {
        return {
            cellClass: '',
            bindCellStyle: {},
            cellWidthStyle: {},
            sortType: null,
            colIndex: null
        }
    },
    computed: {
        computedAlign() {
            const align = this.column.headerAlign || this.column.align
            let alignObj = {
                'left' : 'flex-start',
                'center' : 'center',
                'right' : 'flex-end'
            }
            return alignObj[align] || ''
        }
    },
    created() {
        this.tableColumnId = 'sapi-table-column_' + tableColumnIdSeed++;
        if (this.headerCellStyle && typeof this.headerCellStyle === 'function') {
            this.bindCellStyle = this.headerCellStyle(this.column, this.columnIndex) || {};
        }

        if (this.column.width) {
            this.cellWidthStyle.width = parseInt(this.column.width) + 'px';
        }

        if (this.column.minWidth) {
            this.cellWidthStyle.minWidth = parseInt(this.column.minWidth) + 'px';
        }

        if (!this.column.width && !this.column.minWidth) {
            this.cellWidthStyle = {
                minWidth: '80px',
                width: 'auto'
            }
        }

        if (this.headerCellClassName && typeof this.headerCellClassName === 'function') {
            this.cellClass = this.headerCellClassName(this.column, this.columnIndex);
        }
    },
    methods: {
        changeTableSort (column, e) {
            console.log(e);
            if(!column.sortable) return;
            this.table.store.sortColumnId = this.tableColumnId;
            const prop = column.prop;
            let order = null;
            if (this.sortType === true) {
                this.sortType = false;
                order = this.sortOrders[1]; // 降序
            } else if(this.sortType === false) {
                this.sortType = null; // 默认
                order = this.sortOrders[2];
            } else if(this.sortType === null) {
                order = this.sortOrders[0]; // 升序
                this.sortType = true;
            }
            this.table && this.table.$emit('sort-change',{ column, prop, order })
        }
    }
}
</script>
<style lang="less">
    .caret-wrapper {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        height: 12px;
        width: 8px;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        margin-left: 3px;
        margin-top: 3px;
        .sort-caret.ascending {
            border-bottom-color: #cdd1d6;
            position: relative;
            top: -5px;
            &.active {
                border-bottom-color: #69717A;
            }
        }
        .sort-caret {
            width: 0;
            height: 0;
            border: 4px solid transparent;
            position: absolute;
            left: 0px;
        }
        .sort-caret.descending {
            border-top-color: #cdd1d6;
            position: relative;
            top: -2px;
            &.active {
                border-top-color: #69717A;
            }
        }
        .el-table .sort-caret {
            width: 0;
            height: 0;
            border: 4px solid transparent;
            position: absolute;
            left: 0px;
        }
    }
</style>
