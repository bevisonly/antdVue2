<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <vxe-toolbar style="width: 100%; text-align: left">
      <template #buttons>
        <vxe-button status="primary" @click="addRole()">新增</vxe-button>
      </template>
    </vxe-toolbar>

    <vxe-table
      border
      resizable
      show-overflow
      highlight-hover-row
      ref="xTable"
      :data="tableData"
      :edit-config="{
        trigger: 'manual',
        mode: 'row',
      }"
      style="width: 100%"
      keep-source
      :loading="loadingdata"
    >
      <vxe-table-column
        field="roleName"
        title="角色名称"
        :edit-render="{ name: 'input' }"
      ></vxe-table-column>
      <!-- <vxe-table-column field="name" title="Name"></vxe-table-column> -->
      <vxe-table-column
        field="description"
        title="角色描述"
        :edit-render="{ name: 'input' }"
      ></vxe-table-column>
      <!-- <vxe-table-column
        field="description"
        title="角色描述"
        :formatter="formatterSex"
      ></vxe-table-column> -->
      <vxe-table-column
        field="orgName"
        title="归属市场"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column
        field="created"
        title="创建时间"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
      ></vxe-table-column>
      <vxe-table-column
        field="modified"
        title="修改时间"
        :edit-render="{ name: 'input', attrs: { type: 'text' } }"
        show-overflow
      ></vxe-table-column>
      <vxe-table-column title="操作" width="270" show-overflow>
        <template #default="{ row }">
          <!-- <template v-if="$refs.xTable.isActiveByRow(row)">
            <vxe-button @click="saveRowEvent(row)">保存</vxe-button>
            <vxe-button @click="cancelRowEvent(row)">取消</vxe-button>
          </template> -->
          <template>
            <vxe-button
              status="primary"
              icon="fa fa-edit"
              @click="distribution(row)"
            >
              分配权限
            </vxe-button>
            <vxe-button status="primary" @click="editEvent(row)">
              编辑
            </vxe-button>
            <vxe-button status="danger" @click="removeEvent(row)">
              删除
            </vxe-button>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <!-- 权限的分配 -->
    <vxe-modal
      v-model="showEdit"
      title="权限分配"
      width="1000"
      min-width="600"
      :loading="submitLoading"
      resize
      destroy-on-close
      @close="closeItem"
      show-overflow
    >
      <template #default>
        <vxe-table
          resizable
          :tree-config="{ children: 'children' }"
          :data="treedata"
          :checkbox-config="{
            labelField: 'name',
            highlight: false,
            showHeader: true,
            checkRowKeys: selectedList,
          }"
          border
          :edit-config="{ trigger: 'manual', mode: 'row' }"
          ref="xTrees"
          keep-source
          @checkbox-change="selectChangeEvent"
          @checkbox-all="selectAll"
          row-id="id"
        >
          >
          <vxe-table-column
            type="checkbox"
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

          <vxe-table-column
            field="description"
            title="描述"
            :edit-render="{ name: 'input', attrs: { type: 'text' } }"
          ></vxe-table-column>
        </vxe-table>
        <vxe-toolbar style="text-align: center; margin-top: 40px">
          <template #buttons>
            <vxe-button status="primary" @click="saveAuth">保存</vxe-button>
            <vxe-button @click="cancleEvent">取消</vxe-button>
          </template>
        </vxe-toolbar>
      </template>
    </vxe-modal>
    <!-- 角色的编辑 -->
    <vxe-modal
      v-model="showRoleEdit"
      :title="selectRow ? '编辑' : '新增'"
      width="800"
      min-width="600"
      min-height="300"
      :loading="submitLoading"
      resize
      destroy-on-close
    >
      <template #default>
        <vxe-form
          :data="formData"
          :items="formItems"
          :rules="formRules"
          title-align="right"
          title-width="100"
          @submit="submitEvent"
        ></vxe-form>
      </template>
    </vxe-modal>
  </div>
</template>
  <script>
import {
  searchRole,
  insertRole,
  tenantQuery,
  assignPermission,
  delRole,
  updateRole,
  rolePermissionList,
} from "@/services/roleMa.js";
import { findSelected, familyTree } from "../../utils/treeData";
// import { funAuthList } from "@/services/funauth";
import { mapState } from "vuex";
// import { axios } from "axios";
export default {
  name: "NewPage",
  data() {
    return {
      chooseingList: [],
      //权限选中的菜单
      selectedList: [],
      //权限分配的请求参数
      authParams: {
        mainId: "",
        resourceIds: [],
      },
      //权限类型展示判断
      typeList: [
        { label: "目录", value: "1" },
        { label: "链接", value: "2" },
        { label: "按钮", value: "3" },
      ],
      //权限列表
      treedata: [],
      submitLoading: false,
      loadingdata: false,
      tableData: [],
      params: {
        roleName: "",
        orgId: "",
        description: "",
      },
      selectRow: null,
      showEdit: false,
      showRoleEdit: false,
      //角色编辑表单
      formData: {
        roleName: null,
        orgId: null,
        description: null,
      },
      formRules: {
        roleName: [
          { required: true, message: "请输入角色名称" },
          { min: 1, max: 10, message: "长度不超过10 个字" },
        ],
        // description: [{ required: true, message: "请输入角色描述" }],
        orgId: [{ required: true, message: "请选择租户" }],
      },
      formItems: [
        {
          title: "基本信息",
          span: 24,
          titleAlign: "left",
          titleWidth: 200,
          titlePrefix: { icon: "fa fa-address-card-o" },
        },
        {
          field: "roleName",
          title: "角色名称",
          span: 24,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入角色名称" },
          },
        },
        {
          field: "description",
          title: "角色描述",
          span: 24,
          itemRender: {
            name: "$input",
            props: { placeholder: "请输入角色描述" },
          },
        },
        {
          field: "orgId",
          title: "租户",
          span: 24,
          itemRender: {
            name: "$select",
            props: { placeholder: "请选择租户" },
            options: [],
          },
        },

        {
          align: "center",
          span: 24,
          titleAlign: "left",
          itemRender: {
            name: "$buttons",
            children: [
              { props: { type: "submit", content: "提交", status: "primary" } },
              { props: { type: "reset", content: "重置" } },
            ],
          },
        },
      ],
    };
  },

  created() {
    this.getRoleList();
    // this.getTreeList();
    this.getTenantList();
    console.log(this.treedata);
  },

  methods: {
    closeItem() {
      this.$refreshPage("/stage/stageCenter/roleManagement");
    },
    //权限分配的保存按钮
    saveAuth() {
      // this.authParams.resourceIds = [];
      if (this.chooseingList.length > 0) {
        var arrs = [];
        console.log(this.chooseingList);
        this.chooseingList.forEach((item) => {
          console.log("1111" + item.id);
          this.authParams.resourceIds.push(item.id);
          console.log(this.authParams.resourceIds);

          let temps = familyTree(this.treedata, item.id);
          arrs.push.apply(arrs, temps);
          // console.log(this.authParams.resourceIds);
        });
        console.log(arrs);
        this.authParams.resourceIds = [...new Set(arrs)];
      }
      console.log(this.authParams.resourceIds);
      if (this.authParams) {
        assignPermission(this.authParams).then((res) => {
          if (res.data.code == 200) {
            console.log(res);
            this.$XModal.message({
              content: "保存成功",
              status: "success",
            });
            this.showEdit = false;
            this.$refreshPage("/stage/stageCenter/roleManagement");
          } else if (res.data.code == 5000) {
            this.$XModal.message({
              content: res.data.message,
              status: "error",
            });
          }
        });
        console.log(this.authParams);
      }
      if (!this.authParams.resourceIds) {
        console.log("id组合在");
      }
    },
    //权限分配的取消按钮
    cancleEvent() {
      this.showEdit = false;
      this.authParams.resourceIds = [];
      this.$refreshPage("/stage/stageCenter/roleManagement");
    },
    //权限列表的选中事件
    selectChangeEvent({ records }) {
      this.chooseingList = records;
      console.info(`勾选${records.length}个树形节点`, records);
    },
    selectAll({ records }) {
      this.chooseingList = records;
    },

    //获取角色列表
    getRoleList() {
      let that = this;
      that.loadingdata = true;
      searchRole().then((res) => {
        console.log(res.data.data);
        that.tableData = res.data.data;
        console.log(that.tableData);
        that.loadingdata = false;
      });
    },
    //租户详情
    getTenantList() {
      tenantQuery().then((res) => {
        console.log(res);
        res.data.data.forEach((item) => {
          item.label = item.shortName;
          item.value = item.orgId;
        });
        console.log(res.data.data);
        this.formItems[3].itemRender.options = res.data.data;
      });
    },

    //新增角色的操作
    addRole() {
      this.selectRow = null;
      this.showRoleEdit = true;
      this.formData = {
        roleName: "",
        orgId: "",
        description: "",
      };
    },
    //编辑角色的操作
    editEvent(row) {
      console.log(row);
      this.showRoleEdit = true;
      this.selectRow = row;
      this.formData = {
        id:row.id,
        roleName: row.roleName,
        orgId: row.orgId,
        description: row.description,
      };
    },
    //删除角色的操作
    removeEvent(row) {
      console.log(row);
      this.$XModal.confirm("您确定要删除该数据?").then((type) => {
        const $table = this.$refs.xTable;
        if (type === "confirm") {
          let params = { id: "" };
          params.id = row.id;
          delRole(params).then((res) => {
            if (res.data.code == "200") {
              this.$XModal.message({
                content: res.data.message,
                status: "success",
              });
              $table.remove(row);
            }
          });
        }
      });
    },
    //弹框表单的提交
    submitEvent() {
      this.submitLoading = true;
      setTimeout(() => {
        // const $table = this.$refs.xTable;
        this.submitLoading = false;
        this.showRoleEdit = false;

        //角色的修改
        if (this.selectRow) {
         
          updateRole(this.formData).then((res) => {
            if (res.data.code == "200") {
              this.$XModal.message({ content: "保存成功", status: "success" });
              this.getRoleList();
            } else if (res.data.code == 5000) {
              this.$XModal.message({
                content: res.data.message,
                status: "error",
              });
            }
            // Object.assign(this.selectRow, this.formData);
          });
        }
        //角色的新增
        else {
          console.log(this.formData);
          insertRole(this.formData).then((res) => {
            if (res.data.code == "200") {
              this.$XModal.message({ content: "新增成功", status: "success" });
              // $table.insert(this.formData);
              this.getRoleList();
            } else if (res.data.code == 5000) {
              this.$XModal.message({
                content: res.data.message,
                status: "error",
              });
            }
          });
        }
      }, 500);
    },
    //权限分配
    distribution(row) {
      console.log(this.selectedList);
      console.log(row);
      if (row && row != null) {
        console.log(row);
        this.showEdit = true;
        this.authParams.mainId = row.id;
        let that = this;
        let params = { roleId: "" };
        params.roleId = row.id;
        rolePermissionList(params).then((res) => {
          that.treedata = res.data.data;
          findSelected(that.treedata, this.selectedList);
          var arrs = [];
          this.selectedList.forEach((item) => {
            this.authParams.resourceIds.push(item);
            let temps = familyTree(this.treedata, item);
            arrs.push.apply(arrs, temps);
          });
          this.authParams.resourceIds = [...new Set(arrs)];
          console.log(this.authParams.resourceIds);
          // console.log(this.selectedList);
          // this.selectedList = Object.assign([], this.selectedList);
        });
      }
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