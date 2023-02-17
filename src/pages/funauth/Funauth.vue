<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <vxe-toolbar style="width: 100%; text-align: left">
      <template #buttons>
        <vxe-button status="primary" @click="insertEvent">新增</vxe-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      :tree-config="{ children: 'children' }"
      :data="tableData"
      :checkbox-config="{ labelField: 'name', highlight: false }"
      border
      :edit-config="{ trigger: 'manual', mode: 'row' }"
      ref="xTree"
      keep-source
      style="width: 100%"
      :loading="loading"
    >
      >
      <vxe-table-column
        type=""
        width="280"
        tree-node
        field="name"
        title="名称"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column
        field="type"
        title="权限类型"
        :edit-render="{
          name: '$select',
          options: typeList,
          props: { clearable: true },
        }"
      ></vxe-table-column>
      <vxe-table-column
        field="code"
        title="权限编码"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      >
      </vxe-table-column>
      <vxe-table-column
        field="url"
        title="url"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      >
      </vxe-table-column>
      <!-- <vxe-table-column
        field="orderNumber"
        title="排序编号"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      >
      </vxe-table-column> -->

      <vxe-table-column
        field="description"
        title="描述"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column title="操作" width="240" show-overflow>
        <template #default="{ row, $seq, seq }">
          <template v-if="$refs.xTree.isActiveByRow(row, $seq, seq)">
            <vxe-button @click="saveRowEvent(row, $seq, seq)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row, $seq, seq)"
              >取消</vxe-button
            >
          </template>
          <template v-else>
            <vxe-button @click="editRowEvent(row, $seq, seq)">编辑</vxe-button>
            <vxe-button @click="inInsertRow(row, $seq, seq)">新增</vxe-button>
            <vxe-button status="danger" @click="removeEvent(row)"
              >删除</vxe-button
            >
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
  <script>
import {
  funAuthList,
  funAuthUpdate,
  funAuthDel,
  funAuthAdd,
} from "@/services/funauth";

import { mapState } from "vuex";
import { findId, findParentId } from "../../utils/treeData";
// import { axios } from "axios";
export default {
  name: "NewPage",
  data() {
    return {
      loading: false,
      tableData: [],
      typeList: [
        { label: "目录", value: "1" },
        { label: "链接", value: "2" },
        { label: "按钮", value: "3" },
      ],
      params: {
        name: "",
        code: "",
        type: "",
        id: "",
        url: "",
        orderNumber: "",
        parentId: "",
        description: "",
      },
    };
  },

  created() {
    this.getList();

  },
  methods: {
    //勾选节点
    // selectChangeEvent({ records }) {
    //   console.info(`勾选${records.length}个树形节点`, records);
    // },

    //获取权限列表
    getList() {
      let that = this;
      funAuthList().then((res) => {
        that.tableData = res.data.data;
      });
    },

    //树形表格编辑行数据
    editRowEvent(row, $seq, seq) {
      console.log(row, $seq, seq);
      const $table = this.$refs.xTree;
      $table.setActiveRow(row);
    },
    //表格编辑之后的保存修改
    saveRowEvent(row) {
      const $table = this.$refs.xTree;

      if (row.id) {
        funAuthUpdate(row).then((res1) => {
          if (res1.data.code == 200) {
            this.$XModal.message({
              content: res1.data.message,
              status: "success",
            });
          } else if (res1.data.code == 5000) {
            this.$XModal.message({
              content: res1.data.message,
              status: "error",
            });
          }
          this.getList();
        });
      } else {
        funAuthAdd(row).then((res2) => {
          if (res2.data.code == 200) {
            this.$XModal.message({
              content: res2.data.message,
              status: "success",
            });
          } else if (res2.data.code == 5000) {
            this.$XModal.message({
              content: res2.data.message,
              status: "error",
            });
          }
          this.getList();
          $table.loadData(this.tableData);
        });
      }
      $table.clearActived().then(() => {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
        }, 300);
      });
    },
    //删除行数据的操作
    removeEvent(row) {
      this.$XModal.confirm("您确定要删除该数据?").then((type) => {
        const $table = this.$refs.xTree;
        if (type === "confirm") {
          if (
            !row.parentId &&
            !row.name &&
            !row.type &&
            !row.url &&
            !row.code
          ) {
            $table.remove(row);
          } else if (
            row.parentId &&
            !row.name &&
            !row.type &&
            !row.url &&
            !row.code
          ) {
            findParentId(this.tableData, row.parentId);
            $table.remove(row);
            $table.loadData(this.tableData);
          } else {
            let params = {
              id: row.id,
            };
            funAuthDel(params).then((res) => {
              if (res.data.code == 200) {
                this.$XModal.message({
                  content: "保存删除成功！",
                  status: "success",
                });
              } else if (res.data.code == 5000) {
                this.$XModal.message({
                  content: res.data.message,
                  status: "error",
                });
              }
            });
          }
          this.getList();
        }
      });
    },
    //新增最外层树状节点
    async insertEvent() {
      const $table = this.$refs.xTree;
      await $table.insert(this.params);
      await $table.setActiveCell(this.params, "name");
    },

    //新增树状的子节点的操作
    inInsertRow(row, $req, req) {
      console.log(row, $req, req);
      const xTree = this.$refs.xTree;
      if (row.id) {
        this.params.parentId = row.id;
        findId(this.tableData, row.id, this.params);
        xTree.setActiveCell(this.params, "name");
      }
    },
    //取消编辑的操作
    cancelRowEvent(row) {
      const $table = this.$refs.xTree;
      if (!row.name || !row.code || !row.type) {
        $table.loadData(this.tableData);
      }
      $table.clearActived().then(() => {
        // 还原行数据
        $table.revertData(row);
      });
    },
  },

  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
  <style scoped lang="less">
@import "index.less";
</style>