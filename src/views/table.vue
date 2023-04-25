<template>
  <div class="sapi-table">
    <sapi-table :data="tableData" rowKey="1111" height="300px" header-row-class-name="project-table-header" :treeProps="{children: 'children'}" :header-row-style="{background: '#2F88F6', color: '#ffffff'}">
      <sapi-table-column header-align="center" align="center" width="110px" label="区域" prop="name" fixed></sapi-table-column>
      <sapi-table-column header-align="center" align="center" width="60px" label="开发成本" prop="exploitCost">
        <!-- <template #default="scope">
                <span>{{ scope.row.exploitCost | $utils.toThousands(2) }}</span>
            </template> -->
      </sapi-table-column>
      <sapi-table-column header-align="center" align="center" width="60px" label="管理费用" prop="managementCost"></sapi-table-column>
      <sapi-table-column header-align="center" align="center" width="60px" label="营销费用" prop="marketingCost"></sapi-table-column>
      <sapi-table-column header-align="center" align="center" width="60px" label="税金" prop="taxes"></sapi-table-column>
      <sapi-table-column header-align="center" align="center" width="60px" label="签约金额" prop="contractAmount"></sapi-table-column>
    </sapi-table>
  </div>
</template>
<script>
import  sapiTable from '@/components/table/table.vue'
import  sapiTableColumn from '@/components/table/table-column.js'
export default {
  components: {sapiTable, sapiTableColumn},
  data() {
    return {
      tableData: [
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '1'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '2'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '3', children: [
        {name: '区域111', exploitCost: '11111', managementCost: '22222', marketingCost: '33333', taxes: '44444', contractAmount: '55555', id: '3-1'},
        {name: '区域111', exploitCost: '11111', managementCost: '22222', marketingCost: '33333', taxes: '44444', contractAmount: '55555', id: '3-2'}
        ]},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '4'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '5'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '6'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '7'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '8'},
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', id: '9'}
      ]
    }
  },
  methods: {
    // formatter (row,rowIndex,column,columnIndex) {
    //   const toThousandsProps = ['exploitCost', 'managementCost', 'marketingCost', 'taxes','contractAmount'];
    //   if (toThousandsProps.includes(column.prop)) {
    //     const place = row[column.prop].toString().includes('.') ? 2 : 0
    //     return row[column.prop] === undefined || row[column.prop] === null ? '' : proxy.$utils.toThousands(row[column.prop], place);
    //   }
    //   return row[column.prop];
    // }
  }
}
</script>
<style lang="less" scoped>
  .project-table-header {
    color: #ffffff;
    background-color: #4B9BFF;
  }
  .table-cell.padding-left__10px {
    padding-left: 10px;
    box-sizing: border-box;
  }
  .table-cell.padding-right__10px {
    padding-right: 10px;
    box-sizing: border-box;
  }
</style>
