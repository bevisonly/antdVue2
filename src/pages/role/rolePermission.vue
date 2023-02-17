<template>
  <div class="permission">
    <a-modal
      width="70%"
      v-model="visible"
      title="权限分配"
      destroyOnClose
      @cancel="cancelModal"
    >
      <div class="permission-table">
        <!-- <a-table
          :rowSelection="rowSelection"
          :columns="columns"
          :dataSource="data"
          rowKey="id"
          :loading="permissionLoading"
          :pagination="false"
          :expandIcon="expandIcon"
        >
          <span slot="type" slot-scope="text, record">
            <div v-if="record.type == 1">目录</div>
            <div v-if="record.type == 2">链接</div>
            <div v-if="record.type == 3">按钮</div>
          </span>
        </a-table> -->
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
      </div>
      <template slot="footer">
        <div>
          <a-button @click="cancelModal">取消</a-button>
          <a-button type="primary" @click="handleSubmit">保存</a-button>
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { permissionList, saveRoleResource } from "../../services/stage/roleMa";
import {
  // findSelectedRole,
  findSelected,
  familyTree,
} from "../../utils/treeData";
const columns = [
  {
    // align: "center",
    title: "名称",
    dataIndex: "name",
  },
  {
    // align: "center",
    title: "权限类型",
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
  {
    // align: "center",
    title: "权限编码",
    dataIndex: "code",
  },
  {
    // align: "center",
    title: "url",
    dataIndex: "url",
  },
  {
    // align: "center",
    title: "描述",
    dataIndex: "description",
  },
];
export default {
  data() {
    return {
      columns,
      visible: false,
      selectedRowKeys: [],
      data: [],
      permissionLoading: false,
      roleId: "",
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
    };
  },
  // computed: {
  //   rowSelection() {
  //     const { selectedRowKeys } = this;
  //     return {
  //       selectedRowKeys,
  //       onChange: this.onSelectChange,
  //       hideDefaultSelections: true,
  //       onSelect: this.onSelect, //触发级联的方法
  //     };
  //   },
  // },
  methods: {
    // table的expandIcon属性，修改默认展开关闭按钮 子表无数据时不显示展开图标
    // expandIcon(props) {
    //   // console.log(props);

    // },
    // expandIcon(props) {
    //   // console.log(props);
    //   if (props.record.children.length > 0) {
    //     if (props.expanded) {
    //       //有数据-展开时候图标
    //       return (
    //         <a
    //           style="color: 'black',margin-right:0px"
    //           onClick={(e) => {
    //             props.onExpand(props.record, e);
    //           }}
    //         >
    //           <a-icon type="caret-down" />{" "}
    //         </a>
    //       );
    //     } else {
    //       //有数据-未展开时候图标
    //       return (
    //         <a
    //           style="color: 'black' ,margin-right:0px"
    //           onClick={(e) => {
    //             props.onExpand(props.record, e);
    //           }}
    //         >
    //           <a-icon type="caret-right" />
    //         </a>
    //       );
    //     }
    //   } else {
    //     //无数据-图标
    //     return (
    //       <span style="margin-right:0px">
    //         <a-icon type="info-circle" />
    //       </span>
    //     );
    //   }
    // },
    //权限列表的选中事件
    selectChangeEvent({ records }) {
      this.chooseingList = records;
      console.info(`勾选${records.length}个树形节点`, records);
    },
    selectAll({ records }) {
      this.chooseingList = records;
    },
    //---------------
    cancelModal() {
      this.$refreshPage("/stage/stageCenter/roleManagement");
      this.visible = false;
    },
    handleSubmit() {
      if (!this.chooseingList.length) {
        this.$message.error("当前选项没有发生任何改变，无需保存")
        return
      }
      if (this.chooseingList.length > 0) {
        var arrs = [];
        console.log(this.chooseingList);
        this.chooseingList.forEach((item) => {
          this.authParams.resourceIds.push(item.id);
          let temps = familyTree(this.treedata, item.id);
          arrs.push.apply(arrs, temps);
        });
        this.authParams.resourceIds = [...new Set(arrs)];
        this.authParams.mainId = this.roleId;
      }
      saveRoleResource(this.authParams).then((res) => {
        if (res.data.code == 200) {
          console.log(res);
          this.$refreshPage("/stage/stageCenter/roleManagement");
          this.visible = false;
          this.$message.success(
            res.data.message == "OK" ? "保存角色权限成功" : res.data.message
          );
        } else {
          this.$message.error(
            res.data.message ? res.data.message : "保存角色权限失败"
          );
        }
      });
    },
    //模态框显示
    showModal(id) {
      console.log(id);
      this.roleId = id;
      this.selectedRowKeys = [];
      this.getPermissionList(id);

      this.visible = true;
    },
    getPermissionList(id) {
      this.permissionLoading = true;
      permissionList({ roleId: id }).then((res) => {
        this.permissionLoading = false;
        console.log(res);
        if (res.data.code == 200) {
          // this.data = res.data.data;
          // let tempData = JSON.parse(JSON.stringify(this.data));
          // findSelectedRole(tempData, this.selectedRowKeys);
          // console.log(this.selectedRowKeys);
          this.treedata = res.data.data;
          findSelected(this.treedata, this.selectedList);
          var arrs = [];
          this.selectedList.forEach((item) => {
            this.authParams.resourceIds.push(item);
            let temps = familyTree(this.treedata, item);
            arrs.push.apply(arrs, temps);
          });
          this.authParams.resourceIds = [...new Set(arrs)];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // onSelectChange(selectedRowKeys) {
    //   console.log("selectedRowKeys changed: ", selectedRowKeys);
    //   this.selectedRowKeys = selectedRowKeys;
    // },
    // onSelect(record, selected) {
    //   //每个复选框点击都会触发
    //   const selectrows = [];
    //   if (Object.prototype.hasOwnProperty.call(record, "children")) {
    //     // if (record.hasOwnProperty("children")) {
    //     const generator = (record) => {
    //       //这里做一个递归查找
    //       record.forEach((item) => {
    //         selectrows.push(item.id);
    //         if (item.children && item.children.length > 0) {
    //           generator(item.children);
    //         }
    //       });
    //     };
    //     generator(record.children);
    //   }
    //   const newselect = this.selectedRowKeys.filter(
    //     (item) => !selectrows.includes(item)
    //   );
    //   //选中和取消选中的级联
    //   selected
    //     ? (this.selectedRowKeys = [...this.selectedRowKeys, ...selectrows])
    //     : (this.selectedRowKeys = newselect);
    //   console.log(this.selectedRowKeys);
    // },
  },
};
</script>

<style lang="less" scoped>
.permission-table {
  text-align: left;
}
/deep/.vxe-checkbox--label,
.vxe-table--render-default .is--checked.vxe-cell--checkbox,
.vxe-table--render-default .is--indeterminate.vxe-cell--checkbox {
  color: @primary-color;
}
/deep/.vxe-table--render-default
  .is--checked.vxe-cell--checkbox
  .vxe-checkbox--icon:before {
  background-color: @primary-color;
  border-color: @primary-color;
}
/deep/.vxe-table--render-default
  .is--indeterminate.vxe-cell--checkbox
  .vxe-checkbox--icon:before {
  background-color: @primary-color;
  border-color: @primary-color;
}
/deep/.vxe-table--render-default
  .vxe-cell--checkbox:not(.is--disabled):hover
  .vxe-checkbox--icon:before {
  border-color: @primary-color;
}
</style>