<template>
    <td :style="{ textAlign: column.align, ...cellWidthStyle }">
        <div v-if="computedShowContent" class="table-cell" :style="bindCellStyle" :class="cellClass">
            <span v-if="!!rowKey && columnIndex === 0" class="sapi-table__indent" :style="{ 'padding-left': indent + 'px' }"></span>
            <span v-if="!!rowKey && columnIndex === 0 && expand" class="sapi-table__expand-icon" @click="handleExpandClick" :class="{'is-expanded': isExpanded}">
                <x-icon type="ios-arrow-right" size="14"></x-icon>
            </span>
            <span v-if="!!rowKey && columnIndex === 0 && !expand" class="sapi-table__indent" style="padding-left: 16px"></span>
            <slot :row="row" :column="column" :rowIndex="rowIndex" :columnIndex="columnIndex">
                <span>{{ cellTxt }}</span>
            </slot>
        </div>
    </td>
</template>

<script>
const reg = /sapi-tree-table_row--level-([0-9]+)-([0-9]+)/

export default {
    props: {
        row: {
            type: Object
        },
        rowIndex: {
            type: Number
        },
        column: {
            type: Object,
            default() {
                return {
                    label: ''
                }
            }
        },
        columnIndex: {
            type: Number
        },
        cellClassName: {
            type: Function
        },
        cellStyle: {
            type: Function
        },
        formatter: {
            type: Function
        },
        rowKey: {
            type: String
        },
        indent: {
            type: Number
        },
        level: {
            type: Number
        },
        expand: {
            type: Boolean
        },
        isExpand: {
            type: Boolean
        },
        showFixedCellContent: {
            type: Boolean
        }
    },
    data() {
        return {
            cellClass: '',
            bindCellStyle: {},
            cellWidthStyle: {},
            tdStyle: {},
            cellTxt: '',
            isExpanded: false
        }
    },
    watch: {
        row() {
            this.init()
        },
        column() {
            this.init();
        }
    },
    computed: {
        computedShowContent() {
            return (this.column.fixed === true || this.column.fixed === '') && this.showFixedCellContent || (this.column.fixed === undefined || this.column.fixed === false);
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.isExpanded = this.isExpand;
            if(typeof this.formatter === 'function') {
                this.cellTxt = this.formatter(this.row, this.rowIndex, this.column, this.columnIndex);
            }else if (this.column.prop && this.isNullOrUndefined(this.row[this.column.prop])) {
                this.cellTxt = '';
            } else {
                this.cellTxt = this.row[this.column.prop];
            }

            if (this.cellClassName && typeof this.cellClassName === 'function') {
                this.cellClass = this.cellClassName(this.row, this.rowIndex, this.column, this.columnIndex);
            }

            if (this.cellStyle && typeof this.cellStyle === 'function') {
                this.bindCellStyle = this.cellStyle(this.row, this.rowIndex, this.column, this.columnIndex);
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
        },
        handleExpandClick(e) {
            this.isExpanded = !this.isExpanded;
            const el = e.target || e.srcElement;
            const tdEl = this.getElParentNode(el, 'tr');
            const tdLevelClassName = tdEl.className.match(reg)[0];
            const tdCollection = Array.from(this.$parent.$parent.$el.querySelectorAll(`.${tdLevelClassName}`) || [], (td) => {
                return this.getElNextSiblings(td)
            })
            for(let td of tdCollection.flat()) {
                const arr = td.className.match(reg);
                const level = arr[1];
                if (Number(level) === this.level) {
                    td.style.display = this.isExpanded ? 'table-row' : 'none'
                } else if(td.classList.contains('show')) {
                    td.style.display = this.isExpanded ? 'table-row' : 'none';
                    if (this.isExpanded) {
                        td.classList.remove('show')
                    }
                } else if(td.classList.contains('hidden')) {
                    td.style.display = 'none'
                    td.classList.remove('none')
                }
            }
        },
        isNullOrUndefined(val) {
            return val === undefined || val === null;
        },
        getElParentNode(el, parentTagName) {
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
        },
        getElNextSiblings(el) {
            const nextSiblings = []
            const fn = (elNextSibling) => {
                if (!elNextSibling) {
                    return false;
                }

                const arr = elNextSibling.className.match(reg);
                const level = arr[1];
                if (level && Number(level) >= this.level) {
                    const display = this.getCss(elNextSibling, 'display')
                    if (Number(level) !== this.level && display === 'table-row') {
                        elNextSibling.classList.add('show')
                    } else if (Number(level) !== this.level && display === 'none') {
                        elNextSibling.classList.add('hidden')
                    }

                    nextSiblings.push(elNextSibling)
                    fn(this.getElNextSibling(elNextSibling))
                } 
            }

            let elNextSibling = this.getElNextSibling(el)
            fn(elNextSibling)
            return nextSiblings
        },
        getElNextSibling(el) {
            return el.nextSibling || el.nextElementSibling;
        },
        getCss(curEle,attr){  
            var val = null,reg = null;  
            if('getComputedStyle' in window){  
                val = window.getComputedStyle(curEle,null)[attr];  
            } else {   
                if(attr === 'opacity'){  
                    val = curEle.currentStyle['filter']; 
                    reg = /^alphaopacity=(\d+(?:\.\d+)?)opacity=(\d+(?:\.\d+)?)$/i;  
                    val = reg.test(val)?reg.exec(val)[1]/100:1;  
                } else {  
                    val = curEle.currentStyle[attr];  
                }  
            }  
            reg = /^(-?\d+(\.\d)?)(px|pt|em|rem)?$/i;  
            return reg.test(val)?parseFloat(val):val;   
        }
    }
}
</script>

<style lang="less">
.table-cell {
    .sapi-table__indent {
        display: inline-block;
        height: 14px;
    }
    .sapi-table__expand-icon {
        position: relative;
        top: 2px;
        display: inline-block;
        width: 14px;
        height: 14px;
        line-height: 14px;
        text-align: center;
        cursor: pointer;
        transition: transform .2s ease-in-out;
    }
    .sapi-table__expand-icon.is-expanded {
        transform: rotate(90deg);
    }
}
    
</style>