<template>
    <div class="sapi-table-wrapper" :style="{ height: height }">
        <div class="sapi-table_header-wrap">
            <table :cell-bordered="false" class="sapi-table_header-table">
                <slot name="header"></slot>
            </table>
        </div>
        <div class="sapi-table_body-wrap" :style="{ height: tableBodyHeight }">
            <table :cell-bordered="false" class="sapi-table_body-table">
                <slot name="body"></slot>
            </table>
        </div>

        <div class="fixed-sapi-table_wrapper" v-if="fixedTableWidth"
            :style="{ width: fixedTableWidth + 'px', height: tableHeight }">
            <div class="fixed-sapi-table_header-wrap">
                <table :cell-bordered="false" class="sapi-table_header-table sapi-table_fixed-header-table">
                    <slot name="header"></slot>
                </table>
            </div>
            <div class="fixed-sapi-table_body-wrap" :style="{ top: tableHeadHeight }">
                <table :cell-bordered="false" class="sapi-table_body-table">
                    <slot name="fixedbody"></slot>
                </table>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        height: {
            type: String,
            default: 'auto'
        },
        fixedTableWidth: {
            type: Number
        },
        data: {
            type: Array
        }
    },
    data() {
        return {
            tableHeight: '',
            tableHeadHeight: '',
            tableBodyHeight: ''
        }
    },
    computed: {
        computedScrollerHeight() {
            return this.tableBodyHeight
        }
    },
    watch: {
        height(val) {
            if (val) {
                this.setHeight(val);
            }
        },
        data() {
            this.setHeight();
        }
    },
    mounted() {
        this.tableHeaderWrap = this.$el.querySelector('.sapi-table_header-wrap');
        const tableHeaderWrapRect = this.tableHeaderWrap.getBoundingClientRect();
        this.tableHeadHeight = tableHeaderWrapRect.bottom - tableHeaderWrapRect.top + 'px';
        this.tableHeader = this.tableHeaderWrap.querySelector('.sapi-table_header-table')
        const tableHeaderRect = this.tableHeader.getBoundingClientRect();
        this.tableHeaderWidth = tableHeaderRect.right - tableHeaderRect.left;
        this.isLockX = this.tableHeaderWidth <= document.documentElement.clientWidth;
        this.setHeight();
        if (this.fixedTableWidth) {
            this.fixedTableBody = this.$el.querySelector('.fixed-sapi-table_body-wrap');
        }
        this.tableBody = this.$el.querySelector('.sapi-table_body-wrap');
        this.tableBody.addEventListener('scroll', this.handleTableScroll)
    },
    destroyed() {
        this.tableHeaderWrap = null;
        this.tableHeader = null;
        if (this.fixedTableWidth) {
            this.fixedTableBody = null;
        }
        this.tableBody.removeEventListener('scroll', this.handleTableScroll)
    },
    methods: {
        handleTableScroll() {
            this.tableHeaderWrap.scrollTo(this.tableBody.scrollLeft, 0);
            if (this.fixedTableWidth) {
                this.fixedTableBody.style.top = parseInt(this.tableHeadHeight) - this.tableBody.scrollTop + 'px';
            }
        },
        setHeight() {
            this.$nextTick(() => {
                if (this.tableHeaderWrap) {
                    this.tableHeaderWrap.scrollTo(0, 0);
                }
                if (this.fixedTableBody) {
                    this.tableBody.scrollTo(0, 0);
                    this.fixedTableBody.style.top = parseInt(this.tableHeadHeight) + 'px';
                }
                if (this.height === 'auto') {
                    const tableRect = this.$el.getBoundingClientRect();
                    this.tableHeight = tableRect.bottom - tableRect.top + 'px';
                } else {
                    this.tableHeight = parseInt(this.height) + 'px';
                    this.tableBodyHeight = parseInt(this.tableHeight) - parseInt(this.tableHeadHeight) + 'px';
                }
            })
        },
    }
}
</script>

<style lang="less">
.table-cell.table-header-cell {
    padding: 0 5px;
    box-sizing: border-box;
    font-weight: 600;
}
.table-cell {
    line-height: 16px;
    padding: 0 5px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
}
.sapi-table-wrapper {
    width: 100%;
    position: relative;
    background: #ffffff;
    z-index: 4;
    transform: translateZ(0px);
    -webkit-transform: translateZ(0px);
    table {
        font-size: 12px;
        table-layout: fixed;
        position: relative;
        tr {
            background: #ffffff;
            color: #606972;
            th {
                padding: 7px 0;

                &:before,
                &:after {
                    display: none;
                }
            }
            td {
                padding: 9.5px 0;
            }
        }
        tr.current-row>td {
            background-color: #ecf5ff;
        }
        tr {
            td,
            th {
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
        overflow: auto;
        z-index: 2;
        table {
            z-index: 2;
            tbody,
            tr,
            td,
            .table-cell,
            .table-cell>span {
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
                tbody,
                tr,
                td,
                .table-cell,
                .table-cell>span {
                    position: relative;
                    z-index: 3;
                }
            }
        }
    }
}</style>