<template>
  <a-modal
    :width="800"
    destroyOnClose
    v-model="visible"
    :title="
      editState ? (editState == 1 ? '账户编辑' : 'UAP账户关联') : '账户新增'
    "
    :maskClosable="false"
  >
    <div class="uap-search" v-if="editState == 2">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-select
            show-search
            placeholder="请选择或搜索一个UAP账户关联"
            option-filter-prop="children"
            :filter-option="filterOption"
            @change="uapChange"
            style="width: 100%"
            v-model="uapUser"
          >
            <a-select-option
              v-for="(item, index) in uapUserList"
              :key="index"
              :value="item.id"
            >
              {{ item.userName }}
            </a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </div>
    <div class="user-info">
      <a-form-model :model="userForm" :rules="rules" ref="userForm">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-model-item label="账号名称" prop="userName">
              <a-input
                v-model="userForm.userName"
                :disabled="editState == 1"
              ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="真实姓名" prop="realName">
              <a-input v-model="userForm.realName"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-model-item label="手机号码" prop="phone">
              <a-input v-model="userForm.phone"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="租户选择" prop="orgId">
              <a-select
                style="width: 100%"
                v-model="userForm.orgId"
                @change="tenantChange"
              >
                <a-select-option
                  v-for="item in tenantList"
                  :key="item.id"
                  :value="item.orgId"
                >
                  {{ item.opCode }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="租户组织选择">
              <a-cascader
                allowClear
                :options="deptList"
                v-model="userForm.deptIds"
                change-on-select
                expand-trigger="hover"
                placeholder="选择租户组织"
                @change="onChange"
                :field-names="{
                  label: 'name',
                  value: 'id',
                  children: 'children',
                }"
                not-found-content="该租户下暂无组织"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-model-item label="用户类型" prop="userType">
              <a-select
                style="width: 100%"
                v-model="userForm.userType"
                @change="userTypeChange"
              >
                <a-select-option value="1"> 客户 </a-select-option>
                <a-select-option value="2"> 内部用户 </a-select-option>
                <a-select-option value="3"> 供应商 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="userForm.userType == 1">
            <a-form-model-item label="客户" prop="customerId">
              <a-select
                style="width: 100%"
                v-model="userForm.customerId"
                @change="customerChange"
              >
                <a-select-option
                  v-for="item in customerList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="userForm.userType == 1">
            <a-form-model-item label="门店" prop="storeId">
              <a-select
                style="width: 100%"
                v-model="userForm.storeId"
                @change="storeChange"
              >
                <a-select-option
                  v-for="item in storeList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if="userForm.userType == 3">
            <a-form-model-item label="供应商" prop="supplierId">
              <a-select style="width: 100%" v-model="userForm.supplierId">
                <a-select-option
                  v-for="item in supplierList"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="editState == 0">
          <a-col :span="8">
            <a-form-model-item label="密码" prop="password">
              <a-input v-model="userForm.password" type="password"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="确认密码" prop="confirmPassword">
              <a-input
                v-model="userForm.confirmPassword"
                type="password"
              ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16" v-if="editState == 0 || editState == 2">
          <a-col :span="8">
            <a-form-model-item label="邮箱" prop="email">
              <a-input v-model="userForm.email"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-model-item label="账号描述" prop="description">
              <a-input v-model="userForm.description" type="textarea"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-model-item style="text-align: center">
            <a-button type="primary" @click="saveEdit">提交</a-button>
            <a-button style="margin-left: 10px" @click="clearForm"
              >清空</a-button
            >
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </div>
    <template slot="footer">
      <div>
        <!-- <a-button type="primary" @click="saveEdit">保存</a-button>
        <a-button @click="clearForm">清空</a-button> -->
      </div>
    </template>
  </a-modal>
</template>

<script>
import {
  getTenant,
  getUapUserList,
  UserInsert,
  getTenantOrganization,
} from "../../services/stage/userMa";
import { partnerType, UserAssociate, UserUpdate } from "../../services/userMa";
import { findPid } from "../../utils/treeData";
export default {
  data() {
    return {
      deptList: [],
      deptListAll: [],

      uapUser: "",
      uapUserList: [],
      customerList: [],
      supplierList: [],
      storeList: [],
      tenantList: [],
      visible: false,
      editState: "",
      userForm: {
        accountId: "",
        userName: "",
        realName: "",
        phone: "",
        cellphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        userType: "",
        orgId: "",
        opId: "",
        opCode: "",
        opName: "",
        customerId: "",
        customerCode: "",
        customerName: "",
        supplierId: "",
        storeId: "",
        storeCode: "",
        storeName: "",
        deptId: "",
        deptIds: [],
      },
      rules: {
        // accountId: [{ required: true, message: "请输入账号名称" }],
        realName: [
          { required: true, message: "请输入真实姓名" },
          { min: 2, max: 5, message: "长度在 2 到 5 个汉字" },
          { pattern: "^[\u4e00-\u9fa5]{2,5}$", message: "请输入正确的格式" },
        ],
        userName: [
          { required: true, message: "请输入账号名称" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字" },
          {
            pattern: "^[a-zA-Z0-9_\\u4e00-\\u9fa5]{2,20}$",
            message: "请输入正确的格式",
          },
        ],
        phone: [
          { required: true, message: "请填写手机号码" },
          { pattern: "^[1][3-9][0-9]{9}$", message: "请输入正确的手机号格式" },
        ],
        email: [
          // { required: true, message: "请绑定邮箱号码" },
          {
            pattern: "^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$",
            message: "请输入正确的邮箱号码",
          },
        ],
        password: [
          { required: true, message: "请设置密码" },
          { pattern: "^.{6,20}$", message: "请输入正确的密码格式" },
        ],
        orgId: [{ required: true, message: "请选择租户" }],
        // deptIds: [{ required: true, message: "请选择租户组织" }],
        confirmPassword: [
          { required: true, message: "请再次输入密码" },
          { pattern: "^.{6,20}$", message: "请输入正确的密码格式" },
        ],
        userType: [{ required: true, message: "请选择要创建的用户类型" }],
      },
    };
  },
  methods: {
    getTenantOrgAll(id) {
      getTenantOrganization().then((res) => {
        if (res.data.code == 200) {
          this.deptListAll = JSON.parse(JSON.stringify(res.data.data));
          console.log(this.deptListAll);
          console.log(id);
          let nodes = findPid(this.deptListAll, id);
          console.log(nodes);
          this.userForm.deptIds = nodes || [];
          this.$forceUpdate();
          console.log(this.userForm.deptIds); //["111", "222"]
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    onChange(value) {
      value
        ? (this.userForm.deptId = value[value?.length - 1])
        : (this.userForm.deptId = "");
      this.$forceUpdate();
    },
    tenantChange(val) {
      this.tenantList.forEach((item) => {
        if (val == item.orgId) {
          this.userForm.opId = item.id;
          this.userForm.opCode = item.opCode;
          this.userForm.opName = item.opName;
        }
      });
      this.getTenantSingle(val);
    },
    getTenantSingle(val) {
      getTenantOrganization({ orgId: val }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.deptList = res.data.data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    uapChange(val) {
      console.log(val);
      this.uapUserList.forEach((item) => {
        if (item.id == val) {
          this.userForm = {
            userName: item.userName,
            accountId: item.userName,
            realName: item.realName,
            phone: item.cellphone,
            cellphone: item.cellphone,
            email: item.email,
            password: "",
            confirmPassword: "",
            description: item.description,
            userType: "",
            orgId: "",
            opId: "",
            opCode: "",
            opName: "",
            customerId: "",
            customerCode: "",
            customerName: "",
            supplierId: "",
            supplierCode: "",
            supplierName: "",
            storeId: "",
            storeCode: "",
            storeName: "",
            deptId: "",
            deptIds: [],
          };
        }
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    clearForm() {
      this.userForm = {
        accountId: "",
        realName: "",
        phone: "",
        cellphone: "",
        email: "",
        password: "",
        confirmPassword: "",
        description: "",
        userType: "",
        orgId: "",
        opId: "",
        opCode: "",
        opName: "",
        customerId: "",
        customerCode: "",
        customerName: "",
        supplierId: "",
        storeId: "",
        storeCode: "",
        storeName: "",
        deptId: "",
        deptIds: [],
      };
      this.deptList = [];
    },
    customerChange(val) {
      this.userForm.storeId = "";
      this.getPartnerList(22, val);
      this.customerList.forEach((item) => {
        if (item.id == val) {
          this.userForm.customerCode = item.partnerCode;
          this.userForm.customerName = item.partnerName;
        }
      });
    },
    storeChange(val) {
      console.log(val);
      this.storeList.forEach((item) => {
        if (item.id == val) {
          this.userForm.storeCode = item.partnerCode;
          this.userForm.storeName = item.partnerName;
        }
      });
      console.log(this.userForm);
    },

    userTypeChange(val) {
      if (val == 1) {
        this.getPartnerList(20);
        this.userForm.supplierId = "";
      }
      if (val == 2) {
        this.userForm.customerId = "";
        this.userForm.customerCode = "";
        this.userForm.customerName = "";
        this.userForm.storeId = "";
        this.userForm.storeCode = "";
        this.userForm.storeName = "";
        this.userForm.supplierId = "";
      }
      if (val == 3) {
        this.getPartnerList(30);
        this.userForm.customerId = "";
        this.userForm.customerCode = "";
        this.userForm.customerName = "";
        this.userForm.storeId = "";
        this.userForm.storeCode = "";
        this.userForm.storeName = "";
      }
    },
    getPartnerList(type, id) {
      const params = id
        ? {
            partnerType: type,
            parentId: id,
            isEnable: 1
          }
        : { partnerType: type, isEnable: 1 };
      partnerType(params).then((res) => {
        if (res.data.code == 200) {
          switch (params.partnerType) {
            case 20:
              this.customerList = res.data.data;
              break;
            case 30:
              this.supplierList = res.data.data;
              break;
            case 22:
              this.storeList = res.data.data;
              break;

            default:
              break;
          }
        }
      });
    },
    getUap() {
      getUapUserList().then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.uapUserList = res.data.data;
        }
      });
    },
    getTenantList() {
      getTenant().then((res) => {
        if (res.data.code == 200) {
          this.tenantList = res.data.data;
          console.log(this.tenantList);
        }
      });
    },
    showUserModal(record, state) {
      console.log(record);
      console.log(`${record}+${state}`);
      this.deptList = [];
      this.editState = state;
      this.getTenantList();
      switch (state) {
        case 0:
          this.clearForm();

          break;
        case 1:
          switch (record.userType) {
            case 1:
              this.getPartnerList(20);
              if (record.storeId) {
                this.getPartnerList(22, record.customerId);
              }
              break;
            case 3:
              this.getPartnerList(30);
              break;
            default:
              break;
          }
          this.userForm = {
            id: record.id,
            accountId: record.accountId,
            userName: record.accountId,
            realName: record.realName,
            phone: record.cellphone,
            cellphone: record.cellphone,
            email: "",
            password: "",
            confirmPassword: "",
            description: record.description,
            userType: record.userType?.toString(),
            orgId: record.orgId,
            opId: "",
            opCode: "",
            opName: "",
            customerId: record.customerId,
            customerCode: "",
            customerName: record.customerName,
            supplierId: record.supplierId,
            supplierName: record.supplierName,
            supplierCode: "",
            storeId: record.storeId || "",
            storeCode: "",
            storeName: record.storeName || "",
          };
          if (record.orgId) {
            this.getTenantSingle(record.orgId);
          }
          if (record.deptId) {
            console.log(11111);
            this.getTenantOrgAll(record.deptId);
          }

          break;
        case 2:
          this.uapUser = "";
          this.clearForm();
          this.getUap();

          break;

        default:
          break;
      }
      this.$forceUpdate();
      this.visible = true;
    },
    saveEdit() {
      if (this.deptList?.length > 0 && !this.userForm.deptIds?.length > 0) {
        this.$message.error("当前租户下存在组织请选择");
        return;
      }
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          switch (this.editState) {
            case 0:
              UserInsert(this.userForm).then((res) => {
                if (res.data.code == 200) {
                  console.log(res);
                  this.$parent.getUserList();
                  this.$message.success("新增账号成功");
                  this.visible = false;
                } else if (res.data.code == 2000) {
                  this.$message.error(res.data.message);
                  setTimeout(() => {
                    this.uapUser = this.userForm.userName;
                    this.getUap();
                    this.editState = 2;
                  }, 1500);
                } else {
                  this.$message.error(res.data.message);
                }
              });
              break;
            case 1:
              UserUpdate(this.userForm).then((res) => {
                if (res.data.code == 200) {
                  console.log(res);
                  this.visible = false;
                  this.$parent.getUserList();
                  this.$message.success("账号信息修改成功");
                } else {
                  this.$message.error(res.data.message);
                }
              });
              break;
            case 2:
              UserAssociate(this.userForm).then((res) => {
                if (res.data.code == 200) {
                  console.log(res);
                  this.visible = false;
                  this.$parent.getUserList();
                  this.$message.success("账号关联成功");
                } else {
                  this.$message.error(res.data.message);
                }
              });
              break;
            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.user-info {
  /deep/.ant-form-item {
    margin-bottom: 0;
  }
}
</style>