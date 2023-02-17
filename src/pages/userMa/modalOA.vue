<template>
  <a-modal class="modalTop" :title="flag == 'add' ? '新增关联OA账户' : '编辑关联OA账户'" :maskClosable="!1" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
    <a-form-model layout="vertical" ref="ruleForm" :model="form">
      <a-row :gutter="16">
        <a-col :span=24>
          <a-select
            class="seachInput"
            v-model="allOAMsgId"
            :show-arrow="false"
            :filter-option="filterOption"
            placeholder="请输入名称"
            show-search
            allowClear
            @change="handleOAMsgOption"
          >
            <a-select-option v-for="item in select.OAMsgOption" :key="item.id">{{item.lastname}}（{{item.departmentname}}）</a-select-option>
          </a-select>
        </a-col>
        <a-col :span=8>
          <a-form-model-item class="required" label="账号名称"><a-input v-model.trim="form.accountId"/></a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item class="required" label="用户类型">
            <a-select style="width: 100%" v-model="form.userType">
              <a-select-option :value="1"> 客户 </a-select-option>
              <a-select-option :value="3"> 供应商 </a-select-option>
              <a-select-option :value="2"> 内部用户 </a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="form.userType == 1">
          <a-form-model-item class="required" label="客户">
            <a-select style="width: 100%" v-model="form.customerId">
              <a-select-option v-for="item in select.customer" :key="item.id" @change="changeCustomerOption">{{item.partnerName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="form.userType == 1">
          <a-form-model-item class="required" label="门店">
            <a-select style="width: 100%" v-model="form.storeId">
              <a-select-option v-for="item in select.store" :key="item.id" @change="changeStoreOption">{{item.partnerName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="8" v-if="form.userType == 3">
          <a-form-model-item class="required" label="供应商">
            <a-select style="width: 100%" v-model="form.supplierId">
              <a-select-option v-for="item in select.supplier" :key="item.id" @change="changeSupplierOption">{{item.partnerName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item class="required" label="手机号码"><a-input v-model.trim="form.phone"/></a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item class="required" label="成员姓名"><a-input v-model.trim="form.realName"/></a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item label="邮箱地址"><a-input v-model.trim="form.email"/></a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item class="required" label="租户">
            <a-select
              style="width: 100%"
              v-model="form.orgId"
              show-search
              :show-arrow="false"
              :filter-option="filterOption"
              @change="getOrg"
            >
              <a-select-option v-for="item in select.tenant" :key="item.orgId">{{item.opCode}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item :class="select.deptId.length ? 'required' : ''" label="租户组织">
            <a-cascader
              v-model="form.deptId"
              :options="select.deptId"
              :show-search="{ filter }"
              not-found-content="该租户下暂无组织"
              change-on-select
              expand-trigger="hover"
              placeholder="选择租户组织"
              :field-names="{label: 'name',value: 'id',children: 'children'}"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item :class="{'required': flag === 'add'}" label="登录密码"><a-input v-model.trim="form.password" :maxLength='20' /></a-form-model-item>
        </a-col>
        <a-col :span=8>
          <a-form-model-item :class="{'required': flag === 'add'}" label="确认密码"><a-input v-model.trim="form.confirmPassword" :maxLength='20' /></a-form-model-item>
        </a-col>
        <a-col :span=24>
          <a-form-model-item label="OA组织">
            <a-cascader
              :field-names="{ label: 'subCompanyDesc', value: 'id', children: 'branches' }"
              :options="select.oaOption"
              :show-search="{ filter }"
              v-model="form.organizationIds"
              placeholder="请选则OA组织"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span=24>
          <a-form-model-item label="备注信息">
            <a-input v-model.trim="form.description" type="textarea" :autoSize="{ minRows: 2, maxRows: 2 }" :maxLength="500"/>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="flex-ct marginTop">
      <a-space :size="20">
        <a-button type="primary" v-refresh="closeModalBtn">提交</a-button>
        <a-button @click="cancelBtn">取消</a-button>
      </a-space>
    </div>
    </div>
  </a-modal>
</template>

<script>
import {
  getTenant,
  add,
  oaMsg,
  getTenantOrganization,
  UserUpdate as update,
  org
} from "../../services/stage/userMa";
import { oa } from "../../services/stage/tenantManagement";
import { partnerType } from "../../services/userMa";
export default {
  name: "modalOA",
  data() {
    return {
      visibleLModal: false,
      flag: "add",
      form: {
        userType: 2,
        customerId: undefined,
        storeId: undefined,
        supplierId: undefined,
        phone: undefined,
        realName: undefined,
        orgId: undefined,
        deptId: [],
        password: undefined,
        confirmPassword: undefined,
        organizationIds: [],
        description: undefined,
        insertType: 1,
      },
      allOAMsgId: undefined,
      select: {
        customer: [],
        store: [],
        supplier: [],
        deptId: [],
        oaOption: [],
        OAMsgOption: [],
        OAMsgMaterial: {},
        customerMaterial: {},
        storeMaterial: {},
        supplierMaterial: {},
      },
      oaIdOption: [],
    }
  },
  computed: {
    outstandingAmount() { return ((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0)) },
    unpaidRatio() { return (((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0))/+this.form.contractMoney*100) }
  },
  methods: {
    findPid(arr1, id, sonTree = "children") {
      var temp = []
      var forFn = function (arr, id) {
        arr.forEach(item => {
          if (item.id === id) {
            temp.unshift(item.id)
            delete item[sonTree]
            forFn(arr1, item.parentId)
          } else { item[sonTree] && forFn(item[sonTree], id) }
        })
      }
      forFn(arr1, id)
      return temp
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    },
    filter(inputValue, path) {
      return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
    },
    oaMsg() {
      oaMsg({userId: '', loginId: ''}).then(res => this.select.OAMsgOption = res.data?.data?.dataList)
    },
    getTenantList() {
      getTenant({}).then(res => this.select.tenant = res.data.data || [])
    },
    getOrg(v) { this.getTenantSingle(v) },
    async getTenantSingle(orgId) {
      getTenantOrganization({orgId}).then(res => {
        if (res.data.code == 200) {
          this.select.deptId = res.data.data
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    async getTenantSingleX(id) {
      let data
      await getTenantOrganization().then(res => {
        if (res.data.code == 200) {
          this.select.deptId = res.data.data
          data = this.findPid(res.data.data, id)
        } else {
          this.$message.error(res.data.message);
        }
      })
      return data || []
    },
    oa() {oa({}).then(res => {
      this.select.oaOption = res.data.data
    })},
    async getPartnerList(type, id) {
      const params = id ? {partnerType: type, parentId: id, isEnable: 1} : {partnerType: id, isEnable: 1};
      partnerType(params).then((res) => {
        if (res.data.code == 200) {
          switch (params.partnerType) {
            case 20:
              this.select.customer = res.data.data;
              break;
            case 30:
              this.select.supplier = res.data.data;
              break;
            case 22:
              this.select.store = res.data.data;
              break;
            default:
              break;
          }
        }
      });
    },
    changeCustomerOption(v) {
      this.form.customerId = v
      this.select.customerMaterial = this.select.Option.find(item => item.id == v) || {}
      this.form.customerName = this.select.customerMaterial.partnerName
    },
    changeStoreOption(v) {
      this.form.storeId = v
      this.select.storeMaterial = this.select.Option.find(item => item.id == v) || {}
      this.form.storeName = this.select.storeMaterial.partnerName
    },
    changeSupplierOption(v) {
      this.form.supplierId = v
      this.select.supplierMaterial = this.select.Option.find(item => item.id == v) || {}
      this.form.supplierName = this.select.supplierMaterial.partnerName
    },
    async organizationIds(departmentId) {
      return org({departmentId})
    },
    findOaIdArr(oaOption, strArr, oaIdArr) {
      if (!strArr.length) return
      oaOption.some(item => {
        if (item.subCompanyDesc === strArr[0]) {
          oaIdArr.push(item.id)
          let newStrArr = [...strArr].splice(1)
          item.branches && this.findOaIdArr(item.branches, newStrArr, oaIdArr)
        }
      })
    },
    handleOAMsgOption(v) {
      let strPosition
      this.allOAMsgId = v
      this.select.OAMsgMaterial = this.select.OAMsgOption.find(item => item.id == v) || {}
      this.organizationIds(this.select.OAMsgMaterial.departmentid).then(res => {
        this.form.organizationIds = []
        this.findOaIdArr(this.select.oaOption, res.data.data.split('/'), this.form.organizationIds)
        this.$forceUpdate()
      })
      strPosition = this.select.OAMsgMaterial.email?.indexOf("@")
      this.form.userName = this.select.OAMsgMaterial.email?.substring(0,strPosition)
      this.form.phone = this.select.OAMsgMaterial.mobile
      this.form.realName = this.select.OAMsgMaterial.lastname
      this.form.email = this.select.OAMsgMaterial.email
      this.form.OAAccountId = this.select.OAMsgMaterial.id
      this.form.accountId = this.select.OAMsgMaterial.email?.substring(0,strPosition)
    },
    async openModalOA(record, flag) {
      let msg
      this.allOAMsgId = undefined
      this.form = {userType: 2, insertType: 1}
      this.flag = flag == 3 ? 'add' : 'edit'
      msg = {...record}
      msg.organizationIds = msg.organizationIds?.split('/') || []
      if (msg.organizationIds.length) {
        msg.organizationIds = msg.organizationIds.map(item => item = +item)
      }
      msg.phone = msg.cellphone
      if (msg.deptId) {await this.getTenantSingleX(msg.deptId).then(res => msg.deptId = res)}
      if (msg.orgId) {
        await this.getTenantList(msg.orgId)
      } else {this.getTenantList()}
      flag == 1 && (this.form = {...msg})
      if (msg.userType == 1) {
        this.getPartnerList(20)
        msg.storeId && this.getPartnerList(22, msg.customerId)
      } else if (msg.userType == 3) {
        this.getPartnerList(30)
      }
      this.visibleLModal = true
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof(obj) == 'object' && obj !== null)  {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) { objStorageBox[i] = this.deepClone(obj[i]) }
      } else { objStorageBox = obj }
      return objStorageBox
    },
    closeModalBtn() {
      let validate = ["accountId", "userType", "phone", "realName","orgId"]
      if (this.form.userType == 1) {
        validate.push("customerId","storeId")
      } else if (this.form.userType == 3) {
        validate.push("supplierId")
      }
      this.flag === 'add' && validate.push("password", "confirmPassword")
      if (this.select.deptId.length) validate.push("deptId")
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error('两次密码需要一致才能关联成功', 3)
        return
      }
      if (this.flag === 'add' && this.form.password.length < 6) {
        this.$message.error('密码为6~20位', 3)
        return
      }
      if (validate.some(item => this.form[item] === undefined || this.form[item] === "")) {
        this.$message.error('存在必填项为空', 3)
        return
      }
      let params = this.deepClone(this.form)
      params.organizationIds = params.organizationIds?.join("/")
      params.deptId = params.deptId?.at(-1)
      if (this.flag == 'add') {
        add(params).then(res => {
          if (res.data.code == 200) {
            this.$message.success("保存成功")
            this.$parent.getUserList()
            this.visibleLModal = false
          } else { this.$message.error(res.data.message, 3) }
        }).catch(() => this.$message.error("保存失败"))
        return
      }
      update(params).then(res => {
        if (res.data.code == 200) {
          this.$message.success("修改成功")
          this.$parent.getUserList()
          this.visibleLModal = false
        } else {this.$message.error(res.data.message, 3)}
      }).catch(res => this.$message.error(res.data.message, 3))
    },
    cancelBtn() { this.visibleLModal = false },
  },
  activated() {
    this.oa()
    this.getPartnerList(20)
    this.getPartnerList(22)
    this.getPartnerList(30)
    this.oaMsg()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 800px !important;
  }
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .ant-form-item {
      height: 74px;
      margin-bottom: 0;
    }
    /deep/.ant-form-item-label {
      padding: 0;
    }
    /deep/.ant-form-item-with-help{
      margin: 0;padding: 0;
    }
    /deep/.ant-form-explain {
      margin: 0;
    }
    .seachInput {
      width: 32.1%;
      margin-bottom: 10px;
    }
    .marginTop {
      margin-top: 10px;
    }
  }
}
</style>