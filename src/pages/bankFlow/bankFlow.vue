<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="visiable">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select placeholder="请选择流水类型" v-model="form.transWay" @change="selectOption" allowClear>
                <a-select-option v-for="item in option.typeFlow" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select placeholder="请选择流水关联状态" v-model="form.status" allowClear>
                <a-select-option v-for="item in option.referenceStatus" :key="item.key">{{item.value}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select show-search placeholder="请选择本方的户名" :filter-option="filterOption" v-model="form.accountName" allowClear>
                <a-select-option v-for="item in option.accountNameList" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select show-search placeholder="请选择银行" :filter-option="filterOption" v-model="form.bankName" allowClear>
                <a-select-option v-for="item in option.bankNameList" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select show-search placeholder="请选择对方的户名" :filter-option="filterOption" v-model="form.oppAccName" allowClear>
                <a-select-option v-for="item in option.oppAccNameList" :key="item">{{item}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select show-search placeholder="请选择付款类型" v-model="form.paymentMethod" allowClear>
                <a-select-option v-for="item in option.paymentList" :key="item.id">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入银行流水号" v-model.trim="form.bankSerialNumber" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle dateWidth">
              <a-range-picker
                v-model="form.time"
                format="YYYY-MM-DD HH:mm:ss"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                :placeholder="['交易开始日期','交易结束日期']"
                @change="onChange"
                allowClear
              >
                <template slot="dateRender" slot-scope="current, today">
                  <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">{{current.date()}}</div>
                </template>
              </a-range-picker>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" @click="submitBtn('select')">查询</a-button>
              <a-button :class="{colorSpan: syncFlowDisable}" type="primary" :disabled="syncFlowDisable && disabled('banKFlow_syncFlow')" @click="getSyncFlow">
                同步流水
                <div v-show="syncFlowDisable" style="position: absolute;top:2px;left:32px;">
                  <a-statistic-countdown valueStyle="font-size: 16px;" format="ss" :value="deadline" @finish="onFinish" />
                </div>
              </a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo">
      <div class="pTittle">数据列表</div>
      <a-button-group class="pBorder" style="margin-left: 10px;">
        <a-button type="primary" :loading="loadingList" :disabled="disabled('bankFlow_exportList')" @click="exportList">导出列表</a-button>
        <a-button type="primary" :loading="loadingTemplate" :disabled="disabled('bankFlow_exportTemplate')" @click="exportTemplate">下载模板</a-button>
        <a-button type="primary" :disabled="disabled('banKFlow_uploadFile')" @click="uploadFlow">上传流水</a-button>
      </a-button-group>
      <a-table
        bordered
        ref="tableRef"
        :columns="columns"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <template slot="relatedBill" slot-scope="text, record">
          <a-popover trigger="hover" placement="right">
            <template slot="content">
              <div style="max-width:200px; margin:0; word-wrap:break-word; color:#1900ff;">
                {{ record.relatedBill }}
              </div>
            </template>
            <p style="width:174px; margin:0; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
              {{ record.relatedBill }}
            </p>
          </a-popover>
        </template>
        <span slot="status" slot-scope="text, record">
          <a-tag color="#999999" v-show="record.status == 0">
            <div style="width: 48px;text-align: center;">{{option.status[text]}}</div>
          </a-tag>
          <a-tag color="#F59A23" v-show="record.status == 1">
            {{option.status[text]}}
          </a-tag>
          <a-tag color="#5F9900" v-show="record.status == 2">
            <div style="width: 48px;text-align: center;">{{option.status[text]}}</div>
          </a-tag>
        </span>
        <span slot="paymentMethod" slot-scope="text"><span>{{text == 1 ? '现结' : '周期结算'}}</span></span>
        <span slot="accountNumber" tips="本方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
        <span slot="oppAccNo" tips="对方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
        <span slot="fileName" tips="文件名" slot-scope="text, record">
          <a-button type="link" style="text-decoration: underline;" :disabled="disabled('bankFlow_exportFile')" @click="exportSingle(record)">{{text}}</a-button>
        </span>
        <span slot="operation" slot-scope="text, record">
          <a-popconfirm placement="left" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="disabled('bankFlow_delete')" @confirm="deleteItem(record.id)">
            <a-icon slot="icon" type="question-circle" style="color: red" />
            <a-button class="btncircle" type="primary" icon='delete' :disabled="disabled('bankFlow_delete')"></a-button>
          </a-popconfirm>
        </span>
      </a-table>
      <div class="paginationContainer flex-ed" v-show="dataTable[0]">
        <a-pagination
          :pageSizeOptions='pageSizeOptions'
          v-model="pagination.page"
          :pageSize="pagination.size"
          :total="pagination.total"
          :show-total="() => `共 ${pagination.total} 条`"
          show-size-changer
          :show-quick-jumper="pagination.total >= 500 ? true : false"
          @showSizeChange="paginationSize"
          @change="paginationPage"
        />
      </div>
    </div>
    <modalUpload ref="modalUploadRef" />
  </div>
</template>

<script>
import moment from 'moment';
import modalUpload from './modalUpload'
const columns = [
  {title: "交易时间", dataIndex: "transDatetime", width: 180},
  {title: "关联状态", dataIndex: "status", width: 160, scopedSlots: {customRender: "status"}},
  {title: "付款方式", dataIndex: "paymentMethod", width: 120, scopedSlots: {customRender: "paymentMethod"}},
  {title: "已关联流水金额", dataIndex: "noRefrenceMoney", width: 150},
  {title: "未关联流水金额", dataIndex: "surplusTransAmount", width: 150},
  {title: "关联账单", dataIndex: "relatedBill", width: 260, scopedSlots: {customRender: "relatedBill"}},
  {title: "本方组织", dataIndex: "orgName", width: 260},
  {title: "本方账户银行", dataIndex: "bankName", width: 260},
  {title: "本方账户户名", dataIndex: "accountName", width: 260},
  {title: "本方账户账号", dataIndex: "accountNumber", width: 260, scopedSlots: {customRender: "accountNumber"}},
  {title: "币种", dataIndex: "currencyCode", width: 120},
  {title: "收入", dataIndex: "income", width: 150},
  {title: "支出", dataIndex: "outcome", width: 150},
  {title: "对方账户户名", dataIndex: "oppAccName", width: 260},
  {title: "对方账户账号", dataIndex: "oppAccNo", width: 320, scopedSlots: {customRender: "oppAccNo"}},
  {title: "对方开户行", dataIndex: "oppBank", width: 320},
  {title: "银行流水号", dataIndex: "bankSerialNumber", width: 240},
  {title: "用途", dataIndex: "purpose", width: 260},
  {title: "摘要", dataIndex: "description", width: 160},
  {title: "备注", dataIndex: "noteAppended", width: 260},
  {title: "文件名", dataIndex: "fileName", width: 300, scopedSlots: {customRender: "fileName"}},
  {title: "上传人", dataIndex: "createUser", width: 160},
  {title: "上传时间", dataIndex: "createDate", width: 180},
  {title: "操作", dataIndex: "operation", align: 'center', fixed: 'right', width: 140, scopedSlots: {customRender: "operation"}},
]
import {
  selectOption,
  search,
  exportList,
  exportTemplate,
  clear,
  syncFlow
} from '@/services/settlement/receive/bankFlow'
export default {
  name: 'bankFlow',
  components: { modalUpload },
  data() {
    return {
      visiable: true,
      syncFlowDisable: false,
      deadline: undefined,
      columns,
      form: {},
      dataTable: [],
      loading: !1,
      loadingList: !1,
      loadingTemplate: !1,
      pageType: 'needget',
      option: {
        typeFlow: [{key: '', value: "全部"},{key: "收入", value: "应收银行流水"},{key: "支出", value: "应付银行流水"}],
        referenceStatus: [{key: '全部', value: "全部"},{key: '0', value: "未关联"},{key: 2, value: "已关联"},{key: 1, value: "部分关联"}],
        status: ["未关联", "部分关联", "已关联"],
        accountNameList: ["全部"],
        bankNameList: ["全部"],
        oppAccNameList: ["全部"],
        paymentList: [{id: 1, name: '现结'},{id: 2, name: '周期结算'}]
      },
      pageSizeOptions: ['10','20','50','100'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
      copyParams: undefined,
    }
  },
  methods: {
    onFinish() {
      this.deadline = undefined
      this.syncFlowDisable = false
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    disabled(value) {
      let bankFlow = 'bankFlow'
      let endStr = value.slice(value.indexOf('_')+1)
      this.pageType === 'needget' ? value = bankFlow + 'Needget_' + endStr : value = bankFlow + 'Needpay_' + endStr
      return !this.hasPermission(value)
    },
    changeStyle() {
      let nodeP = document.querySelector(".tableInfo")
      let nodeTable = document.querySelector(".btnGrp")
      this.visiable = !this.visiable
      if (!this.visiable) {
        nodeP.style.border = '0'
        nodeTable.style.backgroundColor = "transparent"
      } else {
        nodeP.style.border = '1px solid #cccccc'
        nodeTable.style.backgroundColor = "#F0F3F6"
      }
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() == moment(today).format("DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    onChange(v) {
      this.form.transDatetimeStart = v[0]
      this.form.transDatetimeEnd = v[1]
    },
    resetBtn() { this.form = {} },
    strExchange(str) { return String(str || "")?.replace(/(?<=.{4}).{1}(?=.{4})/g,'*') },
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
    getExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    exportList() {
      const params = {
        status: this.form.status,
        transWay: this.form.transWay || undefined,
        accountName: this.form.accountName,
        bankName: this.form.bankName,
        oppAccName: this.form.oppAccName,
        bankSerialNumber: this.form.bankSerialNumber,
        transDatetimeStart: this.form.transDatetimeStart,
        transDatetimeEnd: this.form.transDatetimeEnd,
        paymentMethod: this.form.paymentMethod,
      }
      this.loadingExcel = !0
      exportList(params).then((res) => {
        this.loadingExcel = !1
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '银行流水列表'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('导出列表失败')
        }
      }).catch(e => {
        this.loadingExcel = !1
        this.$message.warn('导出列表异常:'+e, 3)
      })
    },
    exportTemplate() {
      this.loadingTemplate = !0
      exportTemplate({}).then((res) => {
        this.loadingTemplate = !1
        if (res.status == '200') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '银行流水模板'
          this.getExcel(res.data, name)
        } else {
          this.$message.warn('下载失败')
        }
      }).catch(e => {
        this.loadingTemplate = !1
        this.$message.warn('下载异常:'+e, 3)
      })
    },
    exportSingle(record) {
      let aNode = document.createElement('a')
      aNode.href = record.filePath
      aNode.download = record.fileName?.slice(0,record.fileName?.lastIndexOf('.')) || "文件"
      aNode.click()
    },
    uploadFlow() {
      this.$refs.modalUploadRef.openModal()
    },
    selectOption() {
      selectOption({transWay: this.form.transWay}).then(res => {
        this.option.accountNameList = ["全部", ...res.data.data?.accountNameList]
        this.option.bankNameList = ["全部", ...res.data.data?.bankNameList]
        this.option.oppAccNameList = ["全部", ...res.data.data?.oppAccNameList]
      })
    },
    getSyncFlow() {
      this.syncFlowDisable = true
      if (!localStorage.getItem("deadline") || Date.now() > +localStorage.getItem("deadline")) {
        localStorage.setItem("deadline", Date.now() + 60000)
      }
      this.deadline = +localStorage.getItem("deadline")
      syncFlow().then((res) => {
        if (res.data.code == '200') {
          this.$message.success(res.data.message)
        } else {
          this.$message.error('查询失败!')
        }
      }).catch(e => this.$message.error('查询失败!'+e))
    },
    submitBtn(flag) {
      if (flag == 'select') this.pagination.page = 1
      if (!this.form.transWay && !this.form.status &&
          !this.form.accountName && !this.form.bankName &&
          !this.form.oppAccName && !this.form.bankSerialNumber &&
          !this.form.transDatetimeStart && !this.form.paymentMethod
      ) return
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        ...this.form
      }
      delete params.transDatetime
      if (params.accountName == "全部") delete params.accountName
      if (params.bankName == "全部") delete params.bankName
      if (params.oppAccName == "全部") delete params.oppAccName
      if (params.transWay == "") delete params.transWay
      if (params.status == "全部") delete params.status
      this.loading = true
      if (flag) this.copyParams = this.deepClone(params)
      search(params).then((res) => {
        if (res.data.code == '200') {
          res.data.data?.list.map((item) => {
            item.noRefrenceMoney = this.formatPrice((+item.transAmount || 0) - (+item.surplusTransAmount || 0))
            item.transWay == "收入" ? item.income = item.transAmount : item.outcome = item.transAmount
          })
          this.dataTable = res.data.data?.list || []
          this.pagination.total = res.data.data?.total || 0
          this.loading = false
        } else {
          this.loading = false
          this.$message.error('查询失败!')
        }
      }).catch(() => {this.loading = false})
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          sort: "id",
          order: "DESC",
          ...this.form
        })
      }
      delete this.copyParams.transDatetime
      delete this.copyParams.time
      if (this.copyParams.accountName == "全部") delete this.copyParams.accountName
      if (this.copyParams.bankName == "全部") delete this.copyParams.bankName
      if (this.copyParams.oppAccName == "全部") delete this.copyParams.oppAccName
      if (this.copyParams.transWay == "") delete this.copyParams.transWay
      search(this.copyParams).then((res) => {
        if (res.data.code == '200') {
          res.data.data?.list.map((item) => {
            item.noRefrenceMoney = this.formatPrice((+item.transAmount || 0) - (+item.surplusTransAmount || 0))
            item.transWay == "收入" ? item.income = item.transAmount : item.outcome = item.transAmount
          })
          this.dataTable = res.data.data?.list || []
          this.pagination.total = res.data.data?.total || 0
          this.loading = false
        } else {
          this.loading = false
          this.$message.warn('查询失败!')
        }
      }).catch(() => {this.loading = false})
    },
    deleteItem(id) {
      clear({id}).then((res) => {
        if (res.data.code == '200') {
          this.submitPagination()
          this.$message.success(res.data.message, 3)
        } else {
          this.$message.warn(res.data.message, 3)
        }
      })
    },
    //! details(record) {
    //!   this.$router.push({
    //!     path: "/balance/receiveable/receiveableVerificationDetails",
    //!     query: {state: 'receivableVerification', record, stateValue: 'bankFlow'},
    //!   });
    //! },
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    }
  },
  activated() {
    this.$route.path?.includes('bankFlowNeedget') && (this.pageType = "needget")
    this.$route.path?.includes('bankFlowNeedpay') && (this.pageType = "needpay")
    this.selectOption()
    if (localStorage.getItem("deadline") && Date.now() < +localStorage.getItem("deadline")) {
      this.deadline = +localStorage.getItem("deadline")
      this.syncFlowDisable = true
    }
  },
}
</script>

<style lang="less">
  @import './index';
</style>