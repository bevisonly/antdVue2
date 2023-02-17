<template>
  <a-modal :width="1000" destroyOnClose v-model="visible" title="数据权限管理">
    <a-radio-group
      v-model="dataState"
      style="margin-bottom: 16px"
      size="large"
      @change="stateChange"
      button-style="solid"
    >
      <a-radio-button value="tenant"> 组织权限设置 </a-radio-button>
      <a-radio-button value="customer"> 客户权限设置 </a-radio-button>
      <a-radio-button value="supplier"> 供应商权限设置 </a-radio-button>
      <a-radio-button value="warehouse"> 仓库 </a-radio-button>
      <a-radio-button value="person"> 个人权限设置 </a-radio-button>
    </a-radio-group>
    <div class="item-tenant" v-if="dataState == 'tenant'">
      <a-tree
        v-model="checkedKeys"
        checkable
        checkStrictly
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        :replace-fields="{ children: 'children', title: 'name', key: 'baseId' }"
        @check="onCheck"
        @expand="onExpand"
      />
    </div>
    <div class="item-customer" v-if="dataState == 'customer'">
      <div>
        <!-- <div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
        </div> -->
        <a-checkbox-group
          v-model="checkedListCustomer"
          :options="plainOptionsCustomer"
          @change="onChangeCustomer"
        />
      </div>
    </div>
    <div class="item-supplier" v-if="dataState == 'supplier'">
      <div>
        <!-- <div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
        </div> -->
        <a-checkbox-group
          v-model="checkedListSupplier"
          :options="plainOptionsSupplier"
          @change="onChangeSupplier"
        />
      </div>
    </div>

    <div class="item-warehouse" v-if="dataState == 'warehouse'">
      <div>
        <!-- <div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
        </div> -->
        <a-checkbox-group
          v-model="whCheckedList"
          :options="whPlainOptions"
          @change="whOnChange"
        />
      </div>
    </div>
    <div v-if="dataState == 'person'">
      <vxe-table
        row-id="id" resizable border ref="xTrees" keep-source
        :tree-config="{children: 'children'}" :data="treeDataPerson"
        :checkbox-config="{labelField: 'name', highlight: false, showHeader: true, checkRowKeys: selectedList}"
        :edit-config="{trigger: 'manual', mode: 'row'}"
        @checkbox-change="selectChangeEvent"
        @checkbox-all="selectAll"
      >
        >
        <vxe-table-column type="checkbox" tree-node field="name" title="名称" :edit-render="{name:'input', attrs:{type: 'text'}}" />
        <vxe-table-column field="type" title="权限类型" :edit-render="{name:'$select', options:typeList, props:{clearable:true}}"/>
        <vxe-table-column field="code" title="权限编码" :edit-render="{name:'input', attrs:{type:'text'}}" />
        <vxe-table-column field="url" title="url" :edit-render="{name:'input', attrs: {type: 'text'}}" />
        <vxe-table-column field="description" title="描述" :edit-render="{name:'input', attrs:{type:'text'}}" />
      </vxe-table>
    </div>
    <template slot="footer">
      <div>
        <a-button @click="modalCancel">取消</a-button>
        <a-button @click="modalSubmit" type="primary" :loading="btnLoading"
          >保存</a-button
        >
      </div>
    </template>
  </a-modal>
</template>

<script>
import {
  getDataPermission,
  tenantDataSave,
  getDataPartnerPermission,
  partnerDataSave,
  whPermissionList,
  saveWhPermission,
  searchPerson,
  updatePerson,
} from "../../services/stage/userMa";
import { findSelectedTenant } from "../../utils/treeData";
import deepClone from 'lodash.clonedeep'
import axios from "axios";
export default {
  data() {
    return {
      btnLoading: false,
      visible: false,
      dataState: "",
      accountId: "",
      orgId: "",
      //租户树状
      expandedKeys: [],
      restData: false,
      saveTenantExpandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      //客户和供应商
      checkedListSupplier: [],
      indeterminate: true,
      checkAll: false,
      plainOptionsSupplier: [],
      checkedListCustomer: [],
      plainOptionsCustomer: [],
      //仓库
      whCheckedList: [],
      //   indeterminate: true,
      //   checkAll: false,
      whPlainOptions: [],
      data: [],
      chooseingList: [],
      selectedList: [],
      typeList: [{label:"目录", value:"1" }, {label:"链接", value:"2" }, {label:"按钮", value:"3" }],
      treeDataPerson: [],
    };
  },
  methods: {
    checkBoxStatus(treeDataPerson, selectedList) {
      treeDataPerson.forEach(item => {
        item.selected == true && selectedList.push(item.id)
        item.children?.length && this.checkBoxStatus(item.children, selectedList)
      })
    },
    getSelectedId(treeDataPerson, ids) {
      treeDataPerson.forEach(item => {
        ids.push(item.id)
        item.children?.length && this.getSelectedId(item.children, ids)
      })
    },
    searchPerson(userId) {
      searchPerson({userId}).then(res => {
        if (res.data.code == 200) {
          this.selectedList = []
          this.treeDataPerson = res.data.data
          this.checkBoxStatus(this.treeDataPerson, this.selectedList)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    selectChangeEvent({records}) {
      this.chooseingList = records
    },
    selectAll({records}) {
      this.chooseingList = records
    },
    //切换
    stateChange() {
      this.checkedList = [];
      switch (this.dataState) {
        case "tenant":
          this.restData && this.getTenantData(this.accountId);
          break;
      //   case "customer":
      //     this.getPartnerDataPermissionList(2);
      //     break;
      //   case "supplier":
      //     this.getPartnerDataPermissionList(3);
      //     break;
        case "warehouse":
          this.saveTenant2();
          break;
        default:
          break;
      }
    },
    //查询仓库数据列表
    getWhPermissionList() {
      const params = {
        userId: this.accountId,
        orgId: this.orgId,
      };
      whPermissionList(params).then((res) => {
        if (res.data.code == 200) {
          const data = res.data.data;
          this.whPlainOptions = JSON.parse(JSON.stringify(data));
          this.whPlainOptions.forEach((item) => {
            item.value = item.baseId;
            item.label = item.name;
            if (item.selected) {
              this.whCheckedList.push(item.baseId);
            }
          });
        } else {
          this.$message.error("获取权限数据错误");
        }
      });
    },
    //客户和供应商
    getPartnerDataPermissionList(type) {
      const params = {
        userId: this.accountId,
        type: type,
      };
      getDataPartnerPermission(params).then((res) => {
        if (res.data.code == 200) {
          const data = res.data.data;
          if (type == 2) {
            this.plainOptionsCustomer = JSON.parse(JSON.stringify(data));
            this.plainOptionsCustomer.forEach((item) => {
              item.value = item.baseId;
              item.label = item.name;
              if (item.selected) {
                this.checkedListCustomer.push(item.baseId);
              }
            });
          }
          if (type == 3) {
            this.plainOptionsSupplier = JSON.parse(JSON.stringify(data));
            this.plainOptionsSupplier.forEach((item) => {
              item.value = item.baseId;
              item.label = item.name;
              if (item.selected) {
                this.checkedListSupplier.push(item.baseId);
              }
            });
          }
        } else {
          this.$message.error("获取权限数据错误");
        }
      });
    },
    whOnChange() {
      //   this.indeterminate =
      //     !!checkedList.length && checkedList.length < this.plainOptions.length;
      //   this.checkAll = checkedList.length === this.plainOptions.length;
      // console.log(checkedList);
    },
    onChange() {
      //   this.indeterminate =
      //     !!checkedList.length && checkedList.length < this.plainOptions.length;
      //   this.checkAll = checkedList.length === this.plainOptions.length;
      // console.log(checkedList);
    },
    onChangeCustomer() {
      //   this.indeterminate =
      //     !!checkedList.length && checkedList.length < this.plainOptions.length;
      //   this.checkAll = checkedList.length === this.plainOptions.length;
      // console.log(checkedList);
    },
    onChangeSupplier() {
      //   this.indeterminate =
      //     !!checkedList.length && checkedList.length < this.plainOptions.length;
      //   this.checkAll = checkedList.length === this.plainOptions.length;
      // console.log(checkedList);
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
    },
    //----------
    modalCancel() {
      this.visible = false;
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys.checked;
    },
    getTenantData(id) {
      this.saveTenantExpandedKeys = []
      this.expandedKeys = []
      this.treeData = []
      getDataPermission({ userId: id }).then((res) => {
        if (res.data.code == 200) {
          const data = res.data.data;
          this.treeData = JSON.parse(JSON.stringify(data));
          findSelectedTenant(this.treeData, this.checkedKeys);
          this.expandedKeys = JSON.parse(JSON.stringify(this.checkedKeys));
          this.saveTenantExpandedKeys = deepClone(this.checkedKeys)
          this.$forceUpdate();
        } else {
          this.$message.error("获取组织权限数据错误");
        }
      });
    },
    showPermissionModal(record) {
      this.checkedListSupplier = [];
      this.checkedListCustomer = [];
      this.whCheckedList = [];
      this.checkedKeys = [];
      this.accountId = record.id || "";
      this.orgId = record.orgId || "";
      this.visible = true;
      this.dataState = "tenant";
      this.getTenantData(this.accountId);
      this.getPartnerDataPermissionList(2);
      this.getPartnerDataPermissionList(3);
      this.getWhPermissionList();
      this.searchPerson(record.id)
    },
    saveTenant() {
      const params = {
        userId: this.accountId,
        selectIds: this.checkedKeys,
      };

      return tenantDataSave(params);
    },
    saveTenant2() {
      let go = !0
      if (this.saveTenantExpandedKeys.length !== this.checkedKeys.length) {
        go = !1
      } else if (this.checkedKeys.some((x, i) => !this.saveTenantExpandedKeys.includes(this.checkedKeys[i]))) {
        go = !1
      }
      if (go) return
      const params = {
        userId: this.accountId,
        selectIds: this.checkedKeys,
      };
      this.restData = false
      tenantDataSave(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success('已保存组织权限设置');
          this.getWhPermissionList();
          this.restData = true
        } else {
          this.$message.success(res.data.message,3)
        }
      })
    },
    savePartner(type) {
      const params = {
        userId: this.accountId,
        selectIds:
          type == 2 ? this.checkedListCustomer : this.checkedListSupplier,
        type: type,
      };

      return partnerDataSave(params);
    },
    saveWarehouse() {
      const params = {
        userId: this.accountId,
        selectIds: this.whCheckedList,
      };

      return saveWhPermission(params);
    },
    savePerson() {
      let resourceIds = []
      this.getSelectedId(this.chooseingList, resourceIds)
      return updatePerson({mainId: this.accountId, resourceIds})
    },
    modalSubmit() {
      var that = this;
      this.btnLoading = true;
      axios
        .all([
          that.saveTenant(),
          that.savePartner(2),
          that.savePartner(3),
          that.saveWarehouse(),
          that.savePerson()
        ])
        .then(
          axios.spread((r1, r2, r3, r4, r5) => {
            this.btnLoading = false;
            if (
              r1.data.code == 200 &&
              r2.data.code == 200 &&
              r3.data.code == 200 &&
              r4.data.code == 200 &&
              r5.data.code == 200
            ) {
              this.$message.success("保存成功");
              this.visible = false;
            } else {
              if (r1.data.code != 200) {
                this.$message.error(
                  r1.data.message ? r1.data.message : "保存租户数据失败"
                );
              }
              if (r2.data.code != 200) {
                this.$message.error(
                  r2.data.message ? r2.data.message : "保存客户数据失败"
                );
              }
              if (r3.data.code != 200) {
                this.$message.error(
                  r3.data.message ? r3.data.message : "保存供应商数据失败"
                );
              }
              if (r4.data.code != 200) {
                this.$message.error(
                  r4.data.message ? r4.data.message : "保存仓库数据失败"
                );
              }
              if (r5.data.code != 200) {
                this.$message.error(
                  r5.data.message ? r5.data.message : "个人权限设置失败"
                );
              }
            }
          })
        );
    },
  },
};
</script>

<style lang="less" scoped>
.item-customer,
.item-warehouse,
.item-supplier {
  /deep/ .ant-checkbox-group-item {
    display: block;
    margin-top: 10px;
    margin-left: 10px;
  }
}
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