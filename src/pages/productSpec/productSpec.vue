<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <vxe-table
      show-overflow
      row-id="id"
      :loading="loading1"
      :data="tableData1"
      border
    >
      <vxe-table-column type="checkbox" width="60"></vxe-table-column>
      <vxe-table-column type="seq" title="编码" width="60"></vxe-table-column>
      <vxe-table-column field="name" title="名称" sortable></vxe-table-column>
      <vxe-table-column field="sex" title="描述"></vxe-table-column>
      <vxe-table-column field="age" title="操作"></vxe-table-column>
    </vxe-table>

    <vxe-pager
      :loading="loading1"
      :current-page="tablePage1.currentPage"
      :page-size="tablePage1.pageSize"
      :total="tablePage1.totalResult"
      :layouts="[
        'PrevPage',
        'JumpNumber',
        'NextPage',
        'FullJump',
        'Sizes',
        'Total',
      ]"
      @page-change="handlePageChange1"
    >
    </vxe-pager>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "NewPage",
  data() {
    return {
      loading1: false,
      tableData1: [],
      tablePage1: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0,
      },
    };
  },
  created() {
    this.findList1();
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  methods: {
    findList1() {
      this.loading1 = true;
      setTimeout(() => {
        const list = [
          {
            id: 10001,
            name: "Test1",
            nickname: "T1",
            role: "Develop",
            sex: "1",
            age: 28,
            address: "Shenzhen",
          },
          {
            id: 10002,
            name: "Test2",
            nickname: "T2",
            role: "Test",
            sex: "0",
            age: 22,
            address: "Guangzhou",
          },
          {
            id: 10003,
            name: "Test3",
            nickname: "T3",
            role: "PM",
            sex: "1",
            age: 32,
            address: "Shanghai",
          },
          {
            id: 10004,
            name: "Test4",
            nickname: "T4",
            role: "Designer",
            sex: "0",
            age: 23,
            address: "Shenzhen",
          },
          {
            id: 10005,
            name: "Test5",
            nickname: "T5",
            role: "Develop",
            sex: "0",
            age: 30,
            address: "Shanghai",
          },
          {
            id: 10006,
            name: "Test6",
            nickname: "T6",
            role: "Develop",
            sex: "0",
            age: 27,
            address: "Shanghai",
          },
          {
            id: 10007,
            name: "Test7",
            nickname: "T1",
            role: "Develop",
            sex: "1",
            age: 28,
            address: "Shenzhen",
          },
          {
            id: 10008,
            name: "Test8",
            nickname: "T2",
            role: "Test",
            sex: "0",
            age: 22,
            address: "Guangzhou",
          },
          {
            id: 10009,
            name: "Test9",
            nickname: "T3",
            role: "PM",
            sex: "1",
            age: 32,
            address: "Shanghai",
          },
          {
            id: 100010,
            name: "Test10",
            nickname: "T4",
            role: "Designer",
            sex: "0",
            age: 23,
            address: "Shenzhen",
          },
          {
            id: 100011,
            name: "Test11",
            nickname: "T5",
            role: "PM",
            sex: "0",
            age: 35,
            address: "Shenzhen",
          },
          {
            id: 100012,
            name: "Test12",
            nickname: "T6",
            role: "Designer",
            sex: "1",
            age: 25,
            address: "Shanghai",
          },
          {
            id: 100013,
            name: "Test13",
            nickname: "T9",
            role: "Develop",
            sex: "1",
            age: 33,
            address: "Shenzhen",
          },
          {
            id: 100014,
            name: "Test14",
            nickname: "T6",
            role: "Develop",
            sex: "0",
            age: 21,
            address: "Shanghai",
          },
          {
            id: 100015,
            name: "Test15",
            nickname: "T6",
            role: "Develop",
            sex: "0",
            age: 19,
            address: "Shanghai",
          },
          {
            id: 100016,
            name: "Test16",
            nickname: "T8",
            role: "Develop",
            sex: "1",
            age: 29,
            address: "Shenzhen",
          },
        ];
        this.loading1 = false;
        this.tablePage1.totalResult = list.length;
        this.tableData1 = list.slice(
          (this.tablePage1.currentPage - 1) * this.tablePage1.pageSize,
          this.tablePage1.currentPage * this.tablePage1.pageSize
        );
      }, 300);
    },
    handlePageChange1({ currentPage, pageSize }) {
      this.tablePage1.currentPage = currentPage;
      this.tablePage1.pageSize = pageSize;
      this.findList1();
    },
  },
};
</script>
<style scoped lang="less">
@import "index.less";
</style>