<template>
  <div class="sapi-table">
    <sapi-table :data="tableData" header-row-class-name="project-table-header" :header-row-style="{background: '#2F88F6', color: '#ffffff'}">
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
      <sapi-table-column header-align="center" align="center" width="60px" label="签约" prop="contract"></sapi-table-column>
    </sapi-table>
  </div>
</template>
<script>
// import  sapiTable from '@/components/table/index.js'
import  sapiTable from '@/components/table1/table.vue'
import  sapiTableColumn from '@/components/table1/table-column.js'
export default {
  components: {sapiTable, sapiTableColumn},
  data() {
    return {
      tableData: [
        {name: '区域111', exploitCost: '111', managementCost: '222', marketingCost: '333', taxes: '444', contractAmount: '555', contract: '666'}
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
.sapi-table {
  height: 100%;
}
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
