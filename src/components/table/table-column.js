export default {
    template: `<div><slot></slot></div>`,
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
        },
        createTime: {
            type: String,
            default: false
        }
    }
}