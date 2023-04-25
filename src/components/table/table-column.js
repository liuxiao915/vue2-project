export default {
    name: 'SapiTableColumn',
    props: {
        prop: {
            type: String
        },
        label: {
            type: String
        },
        width: {
            type: String
        },
        minWidth: {
            type: String
        },
        fixed: {
            type: Boolean
        },
        align: {
            type: String
        },
        headerAlign: {
            type: String
        },
        sortable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        owner() {
            let parent = this.$parent;
            while (parent && !parent.tableId) {
                parent = parent.$parent;
            }
            return parent;
        },
    },
    mounted() {
        const props = ['prop', 'label', 'width', 'minWidth', 'fixed', 'align', 'headerAlign', 'sortable'];
        const column = this.getPropsData(props);
        if (this.$scopedSlots.default) {
            column.renderCell = (props) => this.$scopedSlots.default(props);
        }
        if (this.$scopedSlots.header) {
            column.renderHeader = (props) => this.$scopedSlots.header(props);
        }
        this.columnConfig = column;
        // 注册 watcher
        this.registerNormalWatchers();
        // const children = this.owner.$refs.hiddenColumns.children;
        // const columnIndex = this.getColumnElIndex(children, this.$el);
        this.owner.insertColumn(this.columnConfig)
    },
    destroyed() {
        this.owner.removeColumn(this.columnConfig)
    },
    render(h) {
        // slots 也要渲染，需要计算合并表头
        return h('div', this.$slots.default);
    },
    methods: {
        getPropsData(...props) {
            return props.reduce((prev, cur) => {
                if (Array.isArray(cur)) {
                    cur.forEach((key) => {
                        prev[key] = this[key];
                    });
                }
                return prev;
            }, {});
        },
        getColumnElIndex(children, child) {
            return [].indexOf.call(children, child);
        },
        registerNormalWatchers() {
            const props = ['prop', 'label'];
            props.forEach(key => {
              this.$watch(key, (newVal) => {
                this.columnConfig[key] = newVal;
              });
            });
          },
    }
}