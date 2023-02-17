<template>
  <a-modal class="modalTop" title="合同签订" :dialogStyle="{'top': '30px'}" :maskClosable="!1" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
    <a-form-model layout="vertical" ref="ruleForm" :model="form">
      <a-row :gutter="16">
        <a-col :span=12>
          <a-form-model-item class="required" label="项目名称"><a-input v-model.trim="form.projectName" :maxLength="50" allowClear/></a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="合同标题"><a-input v-model.trim="form.contractTitle" :maxLength="50" allowClear/></a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="合同类型">
            <a-select style="width: 100%" v-model="form.contractTypeDictionaryId" @change="contractTypeChange" allowClear>
              <a-select-option v-for="item in select.contractType" :key="item.id">{{item.dicText}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12 v-if="form.contractType == '其他'">
          <a-form-model-item class="required" label="其他类型"><a-input v-model.trim="form.otherTypes" :maxLength="50" allowClear/></a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="我方法人主体">
            <a-select
              v-model="form.operateEntity"
              show-search
              allowClear
              :show-arrow="false"
              :filter-option="false"
              style="width: 100%"
              @search="handleOpSearch"
              @focus="handleOpSearch"
              @change="handleOpOption"
            >
              <a-select-option v-for="item in select.operateEntity" :key="item.operateEntityName">{{item.operateEntityName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="合同金额">
            <a-input-number v-model="form.contractMoney" />
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item label="币种">
            <a-select v-model="form.currency" allowClear style="width: 100%">
              <a-select-option v-for="item in select.currency" :key="item.dicText">{{item.dicText}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item label="发票">
            <a-select v-model="form.invoice" allowClear style="width: 100%">
              <a-select-option v-for="item in select.invoice" :key="item.dicText">{{item.dicText}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item label="发票类型">
            <a-select v-model="form.invoiceType" allowClear style="width: 100%">
              <a-select-option v-for="item in select.invoiceType" :key="item.dicText">{{item.dicText}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="结算方式">
            <a-select v-model="form.invcType" allowClear style="width: 100%">
              <a-select-option value="2">先款后货</a-select-option>
              <a-select-option value="3">有账期</a-select-option>
              <a-select-option value="4">货到付款</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col v-if="form.invcType == '有账期' || form.invcType == 3" :span=12>
          <a-form-model-item class="required" label="账期">
            <a-input-group compact>
              <a-select style="width: 25%" placeholder="选择账期方式" v-model="form.billingPeriod" allowClear @change="clearInvcCycle">
                <a-select-option value="自然月底">自然月底</a-select-option>
                <a-select-option value="固定日期">固定日期</a-select-option>
                <a-select-option value="固定天数">固定天数</a-select-option>
              </a-select>
              <a-select v-if="form.billingPeriod == '固定日期'" style="width: 75%;" v-model="form.invcCycle" @change="forceUpdate">
                <a-select-option v-for="item in dateOption" :key="item">{{ item }}</a-select-option>
              </a-select>
              <a-select v-if="form.billingPeriod == '固定天数'" style="width: 25%" placeholder="选择生效节点" v-model="form.effectiveNode" allowClear>
                <a-select-option value="开票后">开票后</a-select-option>
                <a-select-option value="结算后">结算后</a-select-option>
                <a-select-option value="收货后">收货后</a-select-option>
                <a-select-option value="下单后">下单后</a-select-option>
              </a-select>
              <a-input
                v-if="form.billingPeriod == '固定天数' || form.billingPeriod == '自然月底' || !form.billingPeriod"
                :style="{'width': form.billingPeriod == '固定天数' ? '47%' : '75%'}"
                :readOnly="form.billingPeriod == '自然月底' || !form.billingPeriod"
                v-model.trim="form.invcCycle" allowClear
              />
              <span v-if="form.billingPeriod == '固定天数'" class="spanStyle">天</span>
            </a-input-group>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="是否预付款">
            <a-select style="width: 100%" v-model="form.ifAdvancePayment" @change="clearRatio">
              <a-select-option value="0">否</a-select-option>
              <a-select-option value="1">是</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=12 v-if="form.ifAdvancePayment == 1">
          <a-form-model-item :class="{required: form.ifAdvancePayment == 1}" label="预付款比例（%）">
            <a-input-number :min="0" :max="100" v-model="form.advancePaymentRatio" />
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item label="履约保证金（元）">
            <a-input-group compact>
              <a-select style="width: 40%;" v-model="form.performanceBondType" allowClear>
                <a-select-option value="对方支付（我方收取）">对方支付（我方收取）</a-select-option>
                <a-select-option value="我方支付（对方收取）">我方支付（对方收取）</a-select-option>
              </a-select>
              <a-input v-model="form.performanceBond" style="width: 60%;!important" />
            </a-input-group>
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item label="已付金额（元）">
            <a-input-number v-model="form.amountPaid" />
          </a-form-model-item>
        </a-col>
        <a-col :span=12>
          <a-form-model-item class="required" label="所属业务单元">
            <a-select
              style="width: 100%"
              show-search
              allowClear
              v-model="form.belongOpId"
              :show-arrow="false"
              :filter-option="false"
              @search="handleBusinessSearch"
              @focus="handleBusinessSearch"
              @change="handleBusinessOption"
            >
              <a-select-option v-for="item in select.opName" :key="item.id">{{item.opName}}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span=24>
          未付金额{{formatPrice(outstandingAmount)}}元，未付比例<span class="redfont">{{formatPrice(unpaidRatio,2)}}%</span>
        </a-col>
        <a-col :span=24>
          <a-form-model-item label="备注">
            <a-input v-model.trim="form.remark" allowClear type="textarea" :autoSize="{ minRows: 2, maxRows: 6 }" :maxLength="500"/>
          </a-form-model-item>
        </a-col>
        <a-col :span=24>
          <a-form-model-item label="合同有效期" required>
            <a-date-picker
              v-model="form.contractValidityStart"
              allowClear
              show-time
              type="date"
              style="width: 23.6%;"
            />
            一
            <a-date-picker
              v-model="form.contractValidityEnd"
              allowClear
              show-time
              type="date"
              style="width: 23.6%;"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
      <div class="flex-ct">
        <a-space :size="20">
          <a-popconfirm v-if="flag != 'add'" placement="bottom" title="确定要修改信息吗？" ok-text="确定" cancel-text="取消" @confirm="closeModalBtn">
            <a-button>保存</a-button>
          </a-popconfirm>
          <a-button v-else v-refresh="closeModalBtn">保存</a-button>
          <a-button @click="cancelBtn">取消</a-button>
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  dictionary,
  op,
  business,
  add,
  searchById,
  update
} from "@/services/resourceCenter/contractMa/signableEnterprise"
import moment from 'moment'
export default {
  name: "modalEdit",
  data() {
    return {
      visibleLModal: false,
      flag: "add",
      form: {},
      select: {
        operateEntity: [],
        opName: [],
      },
      dateOption: [
        "1号","2号","3号","4号","5号","6号","7号","8号","9号","10号","11号","12号","13号","14号",
        "15号","16号","17号","18号","19号","20号","21号","22号","23号","24号","25号","26号","27号","28号",
      ],
      invcTypeMsg: {
        "预付款": 1,
        "先款后货": 2,
        "有账期": 3,
        "货到付款": 4
      },
      contractTypeMaterial: {},
      operateEntityMaterial: {},
      belongOpIdMaterial: {}
    }
  },
  computed: {
    outstandingAmount() { return ((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0)) },
    unpaidRatio() { return (((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0))/+this.form.contractMoney*100) }
  },
  methods: {
    clearRatio(v) {
      v === 0 && (this.form.advancePaymentRatio = undefined)
      this.$forceUpdate()
    },
    handleOpSearch(value) {
      op({operateEntityName: value?.trim(), rows: 100, page: 1}).then(res => this.select.operateEntity = res.data.rows || [])
    },
    handleOpOption(value) {
      this.form.operateEntity = value
      this.operateEntityMaterial = this.select.operateEntity.find(item => item.operateEntityName == value) || {}
      this.form.operateEntityId = this.operateEntityMaterial.id
    },
    handleBusinessSearch(value) {
      business({opName: value?.trim()}).then(res => this.select.opName = res.data.data || [])
    },
    handleBusinessOption(value) {
      this.form.belongOpId = value
      this.belongOpIdMaterial = this.select.opName.find(item => item.id == value) || {}
      this.form.belongOpName = this.belongOpIdMaterial.opName
    },
    dictionary() {
      dictionary({keyName: "合同类型"}).then(res => this.select.contractType = res.data.data)
      dictionary({keyName: "币种"}).then(res => this.select.currency = res.data.data)
      dictionary({keyName: "发票"}).then(res => this.select.invoice = res.data.data)
      dictionary({keyName: "发票类型"}).then(res => this.select.invoiceType = res.data.data)
    },
    contractTypeChange(v) {
      this.contractTypeMaterial = this.select.contractType?.find(val => val.id == v) || {}
      this.form.contractType = this.contractTypeMaterial.dicText
      this.form.contractTypeCode = this.contractTypeMaterial.dicCode
    },
    clearInvcCycle() { this.form.invcCycle = undefined },
    forceUpdate() { this.$forceUpdate() },
    searchById(id) {
      searchById({id}).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.data
          this.form.invcType = this.invcTypeMsg[res.data.data.invcType] || res.data.data.invcType
        } else {
          this.$message.error("获取信息失败")
          this.visibleLModal = false
        }
      }).catch(()=> {this.$message.error("获取信息失败"); this.visibleLModal = false})
    },
    openEditModal(flag, id) {
      this.flag = flag
      this.form = {}
      this.handleBusinessSearch()
      flag == 'add' && (this.form.companyId = id)
      flag == 'edit' && (this.searchById(id))
      this.contractTypeMaterial = {}
      this.visibleLModal = true
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof(obj) == 'object' && obj !== null)  {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    closeModalBtn() {
      let validate = [
        "projectName","contractTitle","contractTypeDictionaryId","operateEntity",
        "contractMoney","invcType","contractValidityStart","belongOpId","ifAdvancePayment"
      ]
      if (this.form.contractType == '其他') {validate.push("otherTypes")}
      if (this.form.ifAdvancePayment == 1 ) validate.push("advancePaymentRatio")
      if (this.form.invcType == '有账期' || this.form.invcType == 3) {
        validate.push("billingPeriod")
        if (this.form.billingPeriod == '固定天数') validate.push("invcCycle","effectiveNode")
        if (this.form.billingPeriod == '固定日期') validate.push("invcCycle")
      }
      if (validate.some(item => this.isUndef(this.form[item]))) {
        this.$message.error('存在必填项为空', 3)
        return
      }
      this.form.contractValidityStart = moment(this.form.contractValidityStart).format("YYYY-MM-DD HH:mm:ss")
      this.form.contractValidityEnd = moment(this.form.contractValidityEnd).format("YYYY-MM-DD HH:mm:ss")
      if (new Date(this.form.contractValidityStart).getTime() > new Date(this.form.contractValidityEnd).getTime()) {
        this.$message.error("结束时间必须晚于开始时间")
        return
      }
      let params = this.deepClone(this.form)
      params.outstandingAmount = this.formatPrice((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0))
      params.unpaidRatio = this.formatPrice(((+this.form.contractMoney || 0) - (+this.form.amountPaid || 0))/+this.form.contractMoney*100,2)
      if (this.flag == 'add') {
        add(params).then(res => {
          if (res.data.code == 200) {
            this.$message.success("保存成功")
            this.$parent.submitPagination()
            this.visibleLModal = false
          }
        }).catch(() => this.$message.error("保存失败"))
        return
      }
      update(params).then(res => {
        if (res.data.code == 200) {
          this.$message.success("保存成功")
          this.$parent.submitPagination()
          this.visibleLModal = false
        }
      }).catch(() => this.$message.error("保存失败"))
    },
    cancelBtn() { this.visibleLModal = false },
  },
  activated() {
    this.dictionary()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/.ant-modal{
    width: 1200px !important;
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
    .spanStyle {
      margin-left: 2px;
      line-height: 34px;
    }
  }
}
</style>