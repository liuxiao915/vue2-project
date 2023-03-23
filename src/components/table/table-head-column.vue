<template>
    <th :style="{ textAlign: column.headerAlign, ...cellWidthStyle }">
        <div class="table-cell table-header-cell" :style="bindCellStyle" :class="cellClass" @click="changeTableSort(column,$event)">
            <slot :column="column">
                {{ column.label === undefined ? '' : column.label }}
                <span v-if="column.sortable" class="caret-wrapper">
                    <i class="sort-caret ascending"></i>
                    <i class="sort-caret descending"></i>
                </span>
            </slot>
        </div>
    </th>
</template>

<script>
export default {
    props: {
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
        headerCellClassName: {
            type: Function
        },
        headerCellStyle: {
            type: Function
        },
        data: {
            type: Array,
            default() {
                return []
            }
        }
    },
    watch: {
        column() {
            this.init();
        }
    },
    data() {
        return {
            cellClass: '',
            bindCellStyle: {},
            cellWidthStyle: {},
            upAndDown:true
        }
    },
    created() {
        this.init();
    },
    deactivated(){
        if(this.column.sortable){
            let descending = document.getElementsByClassName('descending')
            let ascending = document.getElementsByClassName('ascending')
            for(let y = 0; y < descending.length; y++){
                descending[y].style.borderTopColor = '#fff'
            }
            for(let w = 0; w < ascending.length; w++){
                ascending[w].style.borderBottomColor = '#fff'
            }
            this.upAndDown = true
        }
    },
    methods: {
        init() {
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
        changeTableSort(column,e){
            this.$emit('sort-change',column, this.upAndDown)
            if(!column.sortable) return
            let i = e.currentTarget.getElementsByClassName('ascending')[0]
            let n = e.currentTarget.getElementsByClassName('descending')[0]
            let descending = this.$parent.$el.getElementsByClassName('descending')
            let ascending = this.$parent.$el.getElementsByClassName('ascending')
            for(let y = 0; y < descending.length; y++){
                descending[y].style.borderTopColor = '#fff'
            }
            for(let w = 0; w < ascending.length; w++){
                ascending[w].style.borderBottomColor = '#fff'
            }
            if(!column.createTime){
                if(this.upAndDown){
                    this.upAndDown = false
                    // this.data = this.data.sort((a, b) => b[column.prop] - a[column.prop]);
                    i.style.borderBottomColor = '#888'
                    n.style.borderTopColor = '#fff'
                }else {
                    this.upAndDown = true
                    // this.data = this.data.sort((a, b) => a[column.prop] - b[column.prop]);
                    i.style.borderBottomColor = '#fff'
                    n.style.borderTopColor = '#888'
                }
            }else {
                if(this.upAndDown){
                    this.upAndDown = false
                    i.style.borderBottomColor = '#888'
                    n.style.borderTopColor = '#fff'
                    // this.data = this.data.sort((a, b) => {
                    //     var x = a.createTime.replace(/:/g, "").replace(/-/g, "").replace(" ", "")
                    //     var y = b.createTime.replace(/:/g, "").replace(/-/g, "").replace(" ", "")
                    //     return ((x>y)?-1:((x<y)?1:0));
                    //  })
                }else {
                    this.upAndDown = true
                    i.style.borderBottomColor = '#fff'
                    n.style.borderTopColor = '#888'
                    // this.data = this.data.sort((a, b) => {
                    //     var x = a.createTime.replace(/:/g, "").replace(/-/g, "").replace(" ", "")
                    //     var y = b.createTime.replace(/:/g, "").replace(/-/g, "").replace(" ", "")
                    //     return ((x<y)?-1:((x>y)?1:0));
                    //  })
                }
            }
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
        width: 0;
        vertical-align: middle;
        cursor: pointer;
        overflow: initial;
        position: relative;
        .sort-caret.ascending {
            border-bottom-color: #fff;
            position: relative;
            top: -5px;
        }
        .sort-caret {
            width: 0;
            height: 0;
            border: 4px solid transparent;
            position: absolute;
            left: 7px;
        }
        .sort-caret.descending {
            border-top-color: #fff;
            position: relative;
            top: -2px;
        }
        .el-table .sort-caret {
            width: 0;
            height: 0;
            border: 4px solid transparent;
            position: absolute;
            left: 7px;
        }
    }
</style>