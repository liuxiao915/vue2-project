<template>
    <div class="sapi-table-wrapper" :style="{ height: height }">
        <div class="hidden-columns" ref="hiddenColumns"><slot></slot></div>
        <div class="sapi-table_header-wrap">
            <table :cell-bordered="border" class="sapi-table_header-table">
                <table-header
                    :headerRowClassName="headerRowClassName"
                    :headerRowStyle="headerRowStyle"
                    :headerCellClassName="headerCellClassName"
                    :headerCellStyle="headerCellStyle"
                    :sortOrders="sortOrders"
                    :sortColumnId="store.sortColumnId"
                ></table-header>
            </table>
        </div>
        <div class="sapi-table_body-wrap" :style="{ height: tableBodyHeight }">
            <table :cell-bordered="border" class="sapi-table_body-table" :style="{ width: tableHeaderWidth }">
                <table-body
                    :rowKey="rowKey"
                    :indent="indent"
                    :treeProps="treeProps"
                    :rowClassName="rowClassName"
                    :rowStyle="rowStyle"
                    :cellClassName="cellClassName"
                    :cellStyle="cellStyle"
                    :tdClassName="tdClassName"
                    :formatter="formatter"
                    :highlightCurrentRow="highlightCurrentRow"
                    :defaultExpandAll="defaultExpandAll"
                    :expandRowKeys="expandRowKeys"
                    :lazyload="lazyload"
                ></table-body>
            </table>
        </div>
        <div class="fixed-sapi-table_wrapper" v-show="showFixed" v-if="!!fixedTableWidth" :style="{width: fixedTableWidth + 'px', height: tableHeight}">
            <div class="fixed-sapi-table_header-wrap">
                <table :cell-bordered="border" class="sapi-table_header-table sapi-table_fixed-header-table" :style="{ width: tableHeaderWidth }">
                    <table-header
                        :headerRowClassName="headerRowClassName"
                        :headerRowStyle="headerRowStyle"
                        :headerCellClassName="headerCellClassName"
                        :headerCellStyle="headerCellStyle"
                        :sortOrders="sortOrders"
                        :sortColumnId="store.sortColumnId"
                    ></table-header>
                </table>
            </div>
            <div class="fixed-sapi-table_body-wrap" :style="{ top: fixedTableTop }">
                <!-- <div></div> -->
                <table :cell-bordered="border" class="fixed-sapi-table_body-table" :style="{ width: tableHeaderWidth }">
                    <table-body
                        :rowKey="rowKey"
                        :indent="indent"
                        :treeProps="treeProps"
                        :rowClassName="rowClassName"
                        :rowStyle="rowStyle"
                        :cellClassName="cellClassName"
                        :cellStyle="cellStyle"
                        :tdClassName="tdClassName"
                        :formatter="formatter"
                        :highlightCurrentRow="highlightCurrentRow"
                        :defaultExpandAll="defaultExpandAll"
                        :expandRowKeys="expandRowKeys"
                        :lazyload="lazyload">
                    </table-body>
                </table>
                <!-- <div></div> -->
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
import BScroll from 'better-scroll'
import ResizeObserver from 'resize-observer-polyfill';
import tableHeader from './table-header'
import tableBody from './table-body'
let tableIdSeed = 0;

export default {
    name: 'SapiTable',
    components: {
        tableHeader,
        tableBody
    },
    provide () {
        return {
            table: this
        }
    },
    props: {
        data: {
            type: Array,
            default() {
                return []
            }
        },
        height: {
            type: String,
            default: 'auto'
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
        tdClassName: {
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
        },
        border: {
            type: Boolean,
            default : false
        },
        lazyload: {
            type: Function
        },
        isAutoFill: {
            type: Boolean,
            default: false
        },
        sortOrders: {
            type: Array,
            default() {
                return ['asc', 'desc', null]
            }
        }
    },
    data() {
        return {
            isPullUpLoad: false,
            tableHeight: '',
            tableHeadHeight: '',
            tableBodyHeight: '',
            tableHeaderWidth: '',
            bodyWidth: '',
            fixedTableWidth: '',
            fixedTableTop: '',
            showFixed: true,
            store: {
                columns: [],
                sortColumnId: ''
            }
        }
    },
    watch: {
        data (val) {
            console.log(val);
            if (this.lazyload && !this.isChangeByPullingUpLoad) {
                this.loadFinished = false
                // 懒加载自动填充满表格内容
                if (this.isAutoFill) {
                    this.handleAutoFill()
                }
            }
            this.isChangeByPullingUpLoad = false
            this.changeLoadTdTxt()
        }
    },
    deactivated () {
        this.disconnect()
    },
    activated () {
        this.initTable()
    },
    created () {
        this.tableId = 'sapi-table_' + tableIdSeed++;
    },
    mounted () {
        this.initTable()
    },
    beforeDestroy () {
        this.disconnect()
    },
    methods: {
        initTable () {
            this.tableHeaderWrap = this.$el.querySelector('.sapi-table_header-wrap')
            this.tableHeader = this.tableHeaderWrap.querySelector('.sapi-table_header-table')
            this.tableHeaderObserver = new ResizeObserver(this.handleHeaderWrapperResize)
            this.tableHeaderObserver.observe(this.tableHeader)
            this.tableObserver = new ResizeObserver(this.handleTableWrapperResize)
            this.tableObserver.observe(this.$el)
            this.initScroll()
            this.changeLoadTdTxt()
        },
        disconnect () {
            this.tableHeaderObserver && this.tableHeaderObserver.disconnect()
            this.tableObserver && this.tableObserver.disconnect()
        },
        getTotalWidth () {
            return this.store.columns.reduce((total, column) => {
                if (column.width && (column.fixed === '' || column.fixed === true)) {
                    total.fixedWidth += parseInt(column.width);
                }
                total.bodyWidth += parseInt(column.width) || parseInt(column.minWidth) || 80
                return total;
            }, {
                fixedWidth: 0,
                bodyWidth: 0
            })
        },
        insertColumn (column) {
            this.store.columns.push(column)
            const totalWidth = this.getTotalWidth()
            this.fixedTableWidth = totalWidth.fixedWidth
            this.bodyWidth = totalWidth.bodyWidth
            this.$nextTick(() => {
                if (!!this.fixedTableWidth) {
                    this.fixedTableBody = this.$el.querySelector('.fixed-sapi-table_body-wrap');
                }
            })
        },
        removeColumn (column) {
            const columnIndex = this.store.columns.indexOf(column)
            this.store.columns.splice(columnIndex, 1)
        },
        initScroller () {
            this.tableBody = this.$el.querySelector('.sapi-table_body-wrap')
            this.bscroll = new BScroll(this.tableBody, {
                probeType: 3,
                scrollX: true,
                scrollY: true,
                click: true,
                tap: true,
                bounce: {
                    bottom: !!this.lazyload,
                    left: false,
                    right: false,
                    top: false
                },
                pullUpLoad:  {
                    threshold: -50
                }
            })
            this.bscroll.on('scroll', this.handleTableScroll)
            if (this.lazyload) {
                this.bscroll.on('pullingUp', this.pullingUpHandler)
            }
        },
        handleTableWrapperResize () {
            // 表格高度及表体高度
            if (this.height === 'auto') {
                const tableRect = this.$el.getBoundingClientRect();
                this.tableHeight = tableRect.bottom - tableRect.top + 'px';
                if (this.bscroll) {
                    this.bscroll.destroy()
                    this.bscroll = null
                }
            } else {
                this.tableHeight = parseInt(this.height) + 'px';
                this.tableBodyHeight = parseInt(this.tableHeight) - parseInt(this.tableHeadHeight) + 'px';
                if (!this.bscroll) {
                    this.initScroller()
                }
            }
            if (this.bscroll) {
                this.$nextTick(() => {
                    this.bscroll.refresh()
                })
            }
            // 懒加载自动填充满表格内容
            if (this.lazyload && this.isAutoFill && !this.isPullUpLoad && this.height !== 'auto') {
                this.handleAutoFill()
            }
        },
        handleHeaderWrapperResize () {
            // 判断固定表格是否显示
            this.showFixed = this.tableHeaderWrap.clientWidth >= this.bodyWidth ? false : true
            // 表头高度
            const tableHeadHeight = this.tableHeaderWrap.clientHeight + 'px'
            if (this.fixedTableBody) {
                if (!this.tableHeadHeight || this.tableHeadHeight === '0px') {
                    this.fixedTableTop = parseInt(tableHeadHeight) + 'px';
                } else if (!!this.tableHeadHeight && this.tableHeadHeight !== '0px' && this.tableHeadHeight !== tableHeadHeight) {
                    this.fixedTableTop = parseInt(this.fixedTableTop) + parseInt(this.tableHeadHeight) - parseInt(tableHeadHeight) + 'px';
                }
                this.tableHeadHeight = tableHeadHeight
            }
            // 表头宽度
            this.tableHeaderWidth = this.tableHeader.clientWidth + 'px'
            this.handleTableWrapperResize()
        },
        handleAutoFill () {
            if (this.loadFinished) {
                return
            }
            this.$nextTick(() => {
                const tableClientHeight = this.$el.querySelector('.sapi-table_body-table').clientHeight
                if (tableClientHeight < parseInt(this.tableBodyHeight, 10)) {
                    this.pullingUpHandler().then((res) => {
                        if (res) {
                            this.handleAutoFill()
                        }
                    }).catch(() => {})
                }
            })
        },
        pullingUpHandler () {
            return new Promise((resolve, reject) => {
                if (this.isPullUpLoad || this.loadFinished) {
                    this.bscroll && this.bscroll.finishPullUp()
                    this.bscroll && this.bscroll.refresh()
                    return resolve(false)
                }

                this.isPullUpLoad = true
                this.isChangeByPullingUpLoad = true
                this.changeLoadTdTxt()
                this.lazyload().then((loadFinished) => {
                    this.loadFinished = loadFinished
                    this.bscroll && this.bscroll.finishPullUp()
                    this.bscroll && this.bscroll.refresh()
                    this.isPullUpLoad = false
                    this.changeLoadTdTxt()
                    resolve(true)
                }).catch((error) => {
                    this.isPullUpLoad = false
                    this.isChangeByPullingUpLoad = false
                    this.isPullUpLoadFail = true
                    this.changeLoadTdTxt()
                    this.bscroll && this.bscroll.finishPullUp()
                    this.bscroll && this.bscroll.refresh()
                    reject(error)
                })
            })
        },
        changeLoadTdTxt () {
            this.$nextTick(() => {
                const tds = [].slice.call(this.$el.querySelectorAll('.sapi-table_pulling-td'))
                for (const td of tds) {
                    if (this.isPullUpLoadFail) {
                        td.innerHTML = '加载失败，请重试'
                        continue
                    }
                    if (this.isPullUpLoad) {
                        td.innerHTML = '加载中'
                        continue
                    }
                    if (!this.data || !this.data.length) {
                        td.innerHTML = '暂无数据'
                        continue
                    }
                    td.innerHTML = this.loadFinished ? '没有更多了' : '上拉加载更多'
                }
                if (this.isPullUpLoadFail) {
                    this.isPullUpLoadFail = false
                }
                if (this.bscroll) {
                    this.$nextTick(() => {
                        this.bscroll.refresh()
                    })
                }
            })
        },
        handleTableScroll (postion) {
            this.tableHeaderWrap.scrollTop = 0
            this.tableHeaderWrap.scrollLeft = - postion.x
            if (this.fixedTableBody) {
                this.fixedTableTop = parseInt(this.tableHeadHeight) + postion.y + 'px';
            }
        },
        initScroll () {
            this.$nextTick(() => {
                // 刷新bscroll
                if (this.bscroll) {
                    this.bscroll.refresh()
                }
                // 懒加载的时候不需要初始化滚动位置
                if (this.bscroll && this.lazyload) {
                    if (this.data && this.data.length) {
                        this.bscroll.on('pullingUp', this.pullingUpHandler)
                    }
                    return
                }
                // 初始化滚动位置
                if (this.tableHeaderWrap) {
                    this.tableHeaderWrap.scrollTop = 0
                    this.tableHeaderWrap.scrollLeft = 0
                }
                if (this.bscroll) {
                    this.bscroll.scrollTo(0, 0)
                }
            })
        }
    }
}
/*eslint-disable*/
</script>

<style lang="less">
    .sapi-table-wrapper {
        width: 100%;
        position: relative;
        background: #ffffff;
        z-index: 4;
        transform: translateZ(0px);
        -webkit-transform: translateZ(0px);
        .hidden-columns {
            visibility: hidden;
            position: absolute;
            z-index: -1;
        }
        table {
            font-size: 12px;
            table-layout: fixed;
            position: relative;
            tr {
                background: #ffffff;
                color: #606972;
                th {
                    padding: 7px 0;
                }
                td {
                    padding: 9.5px 0;
                }
            }
            tr.current-row>td {
                background-color: #ecf5ff;
            }
            tr {
                td, th {
                    box-sizing: border-box;
                    text-overflow: ellipsis;
                    vertical-align: middle;
                    position: relative;
                    text-align: left;
                    line-height: 1;
                }
            }
        }
        .sapi-table_header-wrap {
            width: 100%;
            overflow: hidden;
            position: relative;
            z-index: 2;
            table {
                z-index: 2;
            }
        }
        .sapi-table_body-wrap {
            width: 100%;
            position: relative;
            z-index: 2;
            overflow: hidden;
            table {
                z-index: 2;
                tbody, tr, td, .table-cell, .table-cell>span {
                    position: relative;
                    z-index: 2;
                }
            }
        }
        .fixed-sapi-table_wrapper {
            position: absolute;
            top: 0;
            left: 0;
            overflow: hidden;
            box-shadow: 1px 0 3px #F5FFFA;
            background: #ffffff;
            z-index: 4;
            transform: translateZ(0px);
            -webkit-transform: translateZ(0px);
            .fixed-sapi-table_header-wrap {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 4;
                table {
                    z-index: 4;
                }
            }
            .fixed-sapi-table_body-wrap {
                position: absolute;
                left: 0;
                z-index: 3;
                table {
                    z-index: 3;
                    tbody, tr, td, .table-cell, .table-cell>span {
                        position: relative;
                        z-index: 3;
                    }
                }
            }
        }
    }
    .table-cell.table-header-cell {
        padding: 0 5px;
        box-sizing: border-box;
        font-weight: 600;
        display: flex;
        align-items: center;
    }
    .table-cell {
        display: inline-block;
        line-height: 16px;
        padding: 0 5px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
    }
    
</style>