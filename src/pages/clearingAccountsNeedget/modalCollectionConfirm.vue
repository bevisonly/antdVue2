<template>
  <div class="modalTop" id="scrollTop">
    <div class="modalContainer">
      <div class="divBorder">
        <p class="pTittle">收款信息</p>
        <a-row class="rowMarginTop">
          <a-col :span="6"><div>客户名称：</div><a-input class="inputWidth" disabled v-model="baseData.partnerName"></a-input></a-col>
          <a-col :span="6"><div>所属主体：</div><a-input class="inputWidth" disabled v-model="baseData.opName"></a-input></a-col>
          <a-col :span="6"><div>已收款金额：</div><a-input class="inputWidth" disabled v-model="baseData.receivedAmount"></a-input></a-col>
          <a-col :span="6"><div>到款金额：</div><a-input-number class="inputWidthFull" v-model="baseData.receiptsAmount"></a-input-number></a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="6">
            <div>到账日期：</div>
            <a-date-picker class="inputWidth" show-time v-model="baseData.receivedDate" @change="onChange" @ok="onOk">
              <template slot="dateRender" slot-scope="current, today">
                <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                  {{ current.date() }}
                </div>
              </template>
            </a-date-picker>
          </a-col>
          <a-col :span="6">
            <div>到款渠道：</div>
            <a-select class="inputWidth" v-model="baseData.paymentType" @change="handleChangePaymentType">
              <!-- //! 当前支付方式使用固定值，暂时保留已注释接口渲染选项 -->
              <!-- <a-select-option v-for="(item, i) in option.payWayOption" :value="item.id" :key="i"> {{ item.dicText }} </a-select-option> -->
              <a-select-option value="1">微信对私</a-select-option>
              <a-select-option value="2">现金</a-select-option>
              <a-select-option value="3">私对公转账</a-select-option>
              <a-select-option value="4">支付宝</a-select-option>
              <a-select-option value="5">公对公转账</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div>货币类型：</div>
            <a-select class="inputWidth" v-model="baseData.currencyType" @change="handleChangeCurrencyType">
              <a-select-option v-for="(item, i) in option.moneyOption" :value="item.id" :key="i"> {{ item.dicText }} </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <span>单据金额：</span><a-input class="inputWidthFull" disabled v-model="baseData.totalAmount"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="12">
            <div>备注：</div>
            <a-textarea class="textareaStyle" v-model="baseData.remark" :auto-size='{minRows: 1, maxRows: 8}' />
          </a-col>
          <a-col :span='6'>
            <span>收款方式：</span><a-select class="inputWidthFull" disabled v-model="allMsg.payType">
              <a-select-option value='1'>现结</a-select-option>
              <a-select-option value='2'>周期结算</a-select-option>
              <a-select-option value='1,2'>现结</a-select-option>
            </a-select>
          </a-col>
          <!-- <a-col :span="6">
            <div :class="{aRequired: !isUndef(baseData.customerId)}">关联合同：</div>
            <a-select
              style="width: 100%;"
              show-search
              v-model="baseData.contractId"
              placeholder="请先选择客户"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :disabled="!baseData.partnerName"
              @search="contract"
              @select="contractSelect"
              @focus="contract"
            >
              <a-select-option v-for="item in contractOption" :key="item.id">{{item.contractTitle}}</a-select-option>
            </a-select>
          </a-col> -->
          <!-- //! glht -->
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="12">
            <div>
              <div>上传单据：</div>
              <a-upload
                list-type="picture-card"
                :file-list="fileList"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.png,.jpeg,.txt"
                :showUploadList="{showRemoveIcon: true}"
                @preview="handlePreview"
                :before-upload="beforeUpload"
                @change="changeFile"
              >
                <div v-if="fileList.length < 21">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    点击上传
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="() => previewVisible = false">
                <img style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="divBorder">
        <p class="pTittle">关联银行流水</p>
        <a-form-model :model="form">
          <a-row>
            <a-col :span="24">
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select placeholder="请选择流水关联状态" v-model="form.status" allowClear>
                  <a-select-option v-for="item in optionx.referenceStatus" :key="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择本方的户名" v-model="form.accountName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.accountNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择银行" v-model="form.bankName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.bankNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择对方的户名" v-model="form.oppAccName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.oppAccNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择付款类型" v-model="form.paymentMethod" allowClear>
                  <!-- <a-select-option v-for="item in optionx.paymentList" :key="item.id">{{item.name}}</a-select-option> -->
                  <a-select-option :value='1' :disabled="allMsg.payType!=1&&allMsg.payType!='1,2'">现结</a-select-option>
                  <a-select-option :value='2' :disabled='allMsg.payType!=2'>周期结算</a-select-option>
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
                  @change="onChangeX"
                  allowClear
                >
                  <template slot="dateRender" slot-scope="current, today">
                    <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">{{current.date()}}</div>
                  </template>
                </a-range-picker>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle">
                <a-button class="ant-button" type="primary" icon="redo" @click="resetBtn">清空</a-button>
                <a-button class="ant-button" type="primary" icon="search" @click="submitBtn('select')">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="tableInfo">
          <a-table
            bordered
            ref="tableRef"
            size="middle"
            :columns="columns"
            :data-source="dataTable"
            :loading='loading'
            rowKey="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: 307.778 , y: pagination.size > 10 ? 600 : 0}"
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
                <div style="width: 48px;text-align: center;">{{optionx.status[text]}}</div>
              </a-tag>
              <a-tag color="#F59A23" v-show="record.status == 1">
                {{optionx.status[text]}}
              </a-tag>
              <a-tag color="#5F9900" v-show="record.status == 2">
                <div style="width: 48px;text-align: center;">{{optionx.status[text]}}</div>
              </a-tag>
            </span>
            <span slot="paymentMethod" slot-scope="text"><span>{{text == 1 ? '现结' : '周期结算'}}</span></span>
            <span slot="accountNumber" tips="本方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
            <span slot="oppAccNo" tips="对方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
            <span slot="fileName" tips="文件名" slot-scope="text, record">
              <a-button type="link" style="text-decoration: underline;" @click="exportSingle(record)">{{text}}</a-button>
            </span>
            <template tips='合计' slot="footer" slot-scope="currentPageData" v-if="currentPageData">
              <span class="greyfont">已选择关联金额</span>
              &lt;<span class="redfont">{{ referenceMoney }}</span>&gt;
              <a-divider class="dividerStyle" type="vertical" />
              <span class="greyfont">剩余未关联金额</span>
              &lt;<span class="redfont">{{
                0 > formatPrice((typeis(+baseData.receiptsAmount == 'number') ? +baseData.receiptsAmount : 0) - referenceMoney) ? 0 :
                formatPrice((typeis(+baseData.receiptsAmount == 'number') ? +baseData.receiptsAmount : 0) - referenceMoney)
              }}</span>&gt;
            </template>
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
      </div>
      <div class="flex-ed">
        <a-space :size="20">
          <a-button type="primary" @click="allConfirmGetMoney">全部收款确认</a-button>
          <a-button type="primary" @click="partConfirmGetMoney">部分收款确认</a-button>
        </a-space>
      </div>
    </div>
    <div style="position: fixed; bottom: 60px; right: 42px; z-index: 999999;">
      <a-space :size="10">
        <a-button type="primary" shape="circle" icon="up" @click="scrollTop" />
        <a-button type="primary" shape="circle" icon="close" @click="changeComp" />
      </a-space>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {
  getImgURL,
  transferFile,
  deleteFile,
  saveFile,
  partConfirmGetMoney,
  allConfirmGetMoney,
  dataList,
  getIds,
  contract
 } from '@/services/settlement/receive/clearingAccountsNeedget'
import {
  selectOption,
  search,
  clear
} from '@/services/settlement/receive/bankFlow'
const columns = [
  {title: "交易时间", dataIndex: "transDatetime", width: 180},
  {title: "关联状态", dataIndex: "status", width: 160, scopedSlots: {customRender: "status"}},
  {title: "付款方式", dataIndex: "paymentMethod", width: 120, scopedSlots: {customRender: "paymentMethod"}},
  {title: "已关联流水金额", dataIndex: "noRefrenceMoney", width: 150},
  {title: "未关联流水金额", dataIndex: "surplusTransAmount", width: 150},
  {title: "关联账单", dataIndex: "relatedBill", width: 260, scopedSlots: {customRender: "relatedBill"}},
  {title: "本方组织", dataIndex: "orgName", width: 260},
  {title: "本方账户银行", dataIndex: "bankName", width: 260},
  {title: "本方账户户名", dataIndex: "accountName", width: 300},
  {title: "本方账户账号", dataIndex: "accountNumber", width: 260, scopedSlots: {customRender: "accountNumber"}},
  {title: "币种", dataIndex: "currencyCode", width: 120},
  {title: "收入", dataIndex: "income", width: 150},
  {title: "支出", dataIndex: "outcome", width: 150},
  {title: "对方账户户名", dataIndex: "oppAccName", width: 260},
  {title: "对方账户账号", dataIndex: "oppAccNo", width: 220, scopedSlots: {customRender: "oppAccNo"}},
  {title: "对方开户行", dataIndex: "oppBank", width: 300},
  {title: "银行流水号", dataIndex: "bankSerialNumber", width: 200},
  {title: "用途", dataIndex: "purpose", width: 200},
  {title: "摘要", dataIndex: "description", width: 160},
  {title: "备注", dataIndex: "noteAppended", width: 260},
  {title: "文件名", dataIndex: "fileName", width: 300, scopedSlots: {customRender: "fileName"}},
  {title: "上传人", dataIndex: "uploadUser", width: 160},
  {title: "上传时间", dataIndex: "uploadDate", width: 180},
]
export default {
  name: "modalCollectionConfirm",
  data() {
    return {
      columns,
      allMsg: {},
      contractOption: [],
      baseData: {
        id: undefined,
        partnerId: undefined,
        partnerName: undefined,
        receiptsAmount: undefined,
        opName: undefined,
        receivedAmount: undefined,
        receivedDate: undefined,
        paymentType: undefined,
        currencyType: undefined,
        remark: undefined,
        version: undefined,
        capitalIds: []
      },
      option: {
        moneyOption: [],
        payWayOption: []
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fd: new FormData(),
      imgObj: new Image(),
      form: {},
      dataTable: [],
      loading: !1,
      optionx: {
        typeFlow: [{key: '', value: "全部"},{key: "应收", value: "应收银行流水"},{key: "应付", value: "应付银行流水"}],
        referenceStatus: [{key: '', value: "全部"},{key: "0", value: "未关联"},{key: 2, value: "已关联"},{key: 1, value: "部分关联"}],
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
      selectedRowKeys: [],
    }
  },
  computed: {
    referenceMoney() {
      let money = []
      this.selectedRowKeys.forEach((item) => {
        this.dataTable.forEach((val) => { item == val.id && money.push(val.surplusTransAmount) })
      })
      return money.reduce((t, c) => this.formatPrice(t + (+c || 0)), 0)
    },
  },
  methods: {
    clearContract() {
      this.baseData.contractId = undefined
      this.baseData.contractTitle = undefined
      this.contract()
    },
    contract(contractTitle, id, contractMsg) {
      contract({partnerId: this.baseData.customerId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.contractOption = res.data.data
          if (id && this.contractOption.every(vip => vip.id == id)) {
            this.contractOption.undefined(contractMsg)
          }
        } else {
          this.contractOption.splice(0)
        }
      }).catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id === id)
      this.baseData.contractTitle = contractMsg.contractTitle
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    changeComp() { this.$parent.changeComponent() },
    scrollTop() {
      document.querySelector("#scrollTop").scrollIntoView({behavior: "smooth"});
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onChangeX(v) {
      this.form.transDatetimeStart = v[0]
      this.form.transDatetimeEnd = v[1]
    },
    resetBtn() { this.form = {
      status:undefined,
      accountName:this.allMsg.payType==2||this.allMsg.customerType==1?this.form.accountName:undefined,
      bankName:undefined,
      oppAccName:this.allMsg.payType==2||this.allMsg.customerType==1?this.form.oppAccName:undefined,
      paymentMethod:this.allMsg.payType==2?2:undefined,
      bankSerialNumber:'',
      time:[],
      transDatetimeStart:'',
      transDatetimeEnd:''
    } },
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
    exportSingle(record) {
      let aNode = document.createElement('a')
      aNode.href = record.filePath
      aNode.download = record.fileName?.slice(0,record.fileName?.lastIndexOf('.')) || "文件"
      aNode.click()
    },
    selectOption() {
      let params = {
        // orgId : this.baseData.orgId,
        transWay: '收入',
        partnerId : this.baseData.customerId
      }
      selectOption(params).then(res => {
        this.optionx.accountNameList = [...(res.data.data?.accountNameList || [])]
        this.form.accountName = this.optionx.accountNameList[0]
        this.optionx.bankNameList = ["全部", ...(res.data.data?.bankNameList || [])]
        this.optionx.oppAccNameList = ["全部", ...(res.data.data?.oppAccNameList || [])]
      })
    },
    submitBtn(flag) {
      if (flag == 'select') this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        // orgId: this.baseData.orgId,
        partnerId: this.baseData.customerId,
        sort: "id",
        order: "DESC",
        ...this.form
      }
      delete params.transDatetime
      params.bankSerialNumber = params.bankSerialNumber?.trim()
      params.transWay = "收入"
      if (params.accountName == "全部") delete params.accountName
      if (params.bankName == "全部") delete params.bankName
      if (params.oppAccName == "全部") delete params.oppAccName
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
          this.$message.warn('流水查询失败!'+res.data.message,5)
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
          // orgId: this.baseData.orgId,
          partnerId: this.baseData.customerId,
          sort: "id",
          order: "DESC",
          ...this.form
        })
      }
      this.dataTable = []
      this.copyParams.bankSerialNumber = this.copyParams.bankSerialNumber?.trim()
      delete this.copyParams.transDatetime
      this.copyParams.transWay = "收入"
      if (this.copyParams.accountName == "全部") delete this.copyParams.accountName
      if (this.copyParams.bankName == "全部") delete this.copyParams.bankName
      if (this.copyParams.oppAccName == "全部") delete this.copyParams.oppAccName
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
          this.$message.warn('流水查询失败!'+res.data.message,5)
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
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    typeOfPicture(url) {
      return new Promise((resolve, reject) => {
        this.imgObj.src = url
        this.imgObj.onload = () => resolve("picX")
        this.imgObj.onerror = () => reject("fileN")
      })
    },
    getImgURL(id) {
      getImgURL({tableId: id, tableName: 'ar_settlement'}).then(res => {
        if (res.data.code == "200") {
          res.data.data.forEach((item,i) => {
            this.fileList.push({
              uid: item.id,
              name: "picX",
              type: "image",
              size: "1000",
              url: item.filePath,
            })
            this.typeOfPicture(item.filePath).catch(e => {
              this.fileList[i].name = e
              this.fileList[i].type = "application"
            })
          })
        }
      })
    },
    getFileBase64(file){
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let imgData = {
          uid: file.uid,
          name: file.name,
          type: file.type,
          size: file.size,
          url: undefined,
        };
        reader.onload = () => {
          imgData.url = reader.result;
          resolve(imgData)
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      })
    },
    getFile(res) {
      if (!res.url) {
        this.$message.warn('找不到文件链接/路径')
        return
      }
      const link = document.createElement('a')
      link.href = res.url
      link.download = res.name || 'anonymous'
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    async handlePreview(file) {
      if (file.name?.match(/\.pdf|\.docx|\.doc|\.xlsx|\.xls|\.txt/g) != null || file.type?.includes("application")) {
        this.getFile(file)
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await this.getFileBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    changeFile(file) {
      if (file.file.status === "uploading") return
      this.fileList.forEach((item, i) => {
        if (file.file.status === "removed" && file.file.url == item.url && file.file.uid == item.uid) {
          this.fd.set("id", item.uid)
          deleteFile(this.fd).then(res => {
            res.data.code == "200" ?
            (this.$message.success("删除文件成功"), this.fileList.splice(i, 1)) :
            this.$message.error("删除文件失败")
          }).catch(() => this.$message.error("删除文件失败"))
        }
      })
    },
    beforeUpload(file) {
      let fd = new FormData()
      fd.set("file", file)
      fd.set("mode", "batch")
      fd.set("tableId", this.allMsg.id)
      fd.set("tableName", "ar_settlement")
      transferFile(fd).then(res => {
        if (res.data.code == "200") {
          this.saveFile(res.data.data[0].filePath)
          this.fileList.push({
            uid: this.fileList.length,
            url: res.data.data[0].filePath,
            name: res.data.data[0].fileName,
            size: res.data.data[0].fileSize,
            type: res.data.data[0].fileType,
          })
        }
      }).catch(() => this.$message.warn('获取上传文件记录失败'))
    },
    saveFile(url) {
      const params = {
        tableId: this.allMsg.id,
        tableName: "ar_settlement",
        fileUrlList: [url]
      }
      saveFile(params).then(res => res.data.code == "200" && this.$message.success("上传文件成功"))
    },
    onChange(value) {
      this.baseData.receivedDate = moment(value).format("YYYY-MM-DD HH:mm:ss")
    },
    onOk(value) { this.baseData.receivedDate = moment(value).format("YYYY-MM-DD HH:mm:ss") },
    handleChangePaymentType(value) { this.baseData.paymentType = value },
    handleChangeCurrencyType(value) { this.baseData.currencyType = value },
    async getIds(docId, docCode) {
      let ids = []
      await getIds({relateType: 1, docId, docCode}).then((res) => {
        res.data.data.forEach((item) => { ids.push(item.yocylId) })
      })
      return ids
    },
    openModal(record = {}, whichPage) {
      this.form={}
      this.selectedRowKeys = []
      this.baseData.capitalIds = []
      this.fileList = []
      this.baseData.id = record.id,
      this.baseData.partnerName = record.customerName,
      this.baseData.partnerId = record.customerId,
      this.baseData.receiptsAmount = record.receiptsAmount,
      this.baseData.opName = record.opName,
      this.baseData.receivedAmount = record.receivedAmount,
      this.baseData.receivedDate = moment(record.receivedDate).format("YYYY-MM-DD HH:mm:ss") || null,
      this.baseData.paymentType = this.typeis(record.paymentType) == 'number' ? "" + record.paymentType : record.paymentType,
      this.baseData.currencyType = record.currencyType,
      this.baseData.remark = record.remark,
      this.baseData.version = record.version,
      this.baseData.totalAmount = record.totalAmount,
      this.baseData.orgId = record.orgId
      this.baseData.customerId = record.customerId
      this.baseData.contractId = record.contractId
      this.baseData.contractTitle = record.contractTitle
      this.contract(undefined, record.contractId, {id: record.contractId, contractTitle: record.contractTitle})
      this.allMsg = record
      record.payType==2&&(this.form.paymentMethod=2)
      this.getImgURL(record.id)
      this.getIds(record.id, record.arInvoiceCode).then((val) => {this.selectedRowKeys = val})
      whichPage === 'collectionConfirmComp' && this.submitBtn('select')
      this.selectOption()
    },
    allConfirmGetMoney() {
      // if (!this.isUndef(this.baseData.customerId) && this.isUndef(this.baseData.contractId)) {
      //   this.$message.error("请选则关联合同", 3)
      //   return
      // }
      //! glht
      //! isUndef判断是否为[undefined,0,'0','']
      if (this.baseData.receivedAmount != this.baseData.totalAmount && this.isUndef(+this.baseData.receiptsAmount || '')) {
        this.$message.error('到款金额不能为空或等于0', 3.5)
        return
      }
      if (this.referenceMoney < ((+this.baseData.totalAmount || 0) - (+this.baseData.receivedAmount || 0))) {
        this.$message.error("银行流水关联数据需大于等于单据金额", 3.5)
        return
      }
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('全部收款至少需要关联一条流水', 3.5)
        return
      }
      this.baseData.capitalIds = this.selectedRowKeys
      allConfirmGetMoney(this.baseData).then(res => {
        if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(e => this.$message.error('全部收款确认失败'+e, 3))
    },
    partConfirmGetMoney() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('部分收款至少需要关联一条流水', 3.5)
        return
      }
      //! isUndef判断是否为[undefined,0,'0','']
      if (this.baseData.receivedAmount != this.baseData.totalAmount && this.isUndef(+this.baseData.receiptsAmount || '')) {
        this.$message.error('到款金额不能为空或等于0', 3.5)
        return
      }
      if (+this.baseData.receivedAmount + +this.baseData.receiptsAmount > +this.baseData.totalAmount) {
        this.$message.error('已收款金额与到款金额之和不能超过单据金额', 3.5)
        return
      }
      if (this.referenceMoney < (+this.baseData.receiptsAmount || 0) - (+this.baseData.receivedAmount || 0)) {
        this.$message.error("银行流水关联数据需大于等于到款金额", 3.5)
        return
      }
      this.baseData.capitalIds = this.selectedRowKeys
      partConfirmGetMoney(this.baseData).then(res => {
        if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(e => this.$message.error('部分收款确认失败'+e, 3))
    },
    dataList(type) {
      dataList({type: type}).then(res => type == 14 ? this.option.moneyOption = res.data.data : this.option.payWayOption = res.data.data)
    },
    triggerFun() {
      this.$nextTick(() => {
        this.openModal(this.$parent.dataSubPage, this.$parent.changePage)
      })
    }
  },
  activated() {
    [14, 28].forEach(item => this.dataList(item))
    this.triggerFun()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  .formItemStyle {
    float: left;
    margin-left: 10px;
    .ant-button {
      margin-right: 10px;
    }
  }
  .formItemStylewidth {
    width: 18.3%;
    min-width: 194.89px;
    max-width: 300px;
  }
  .dateWidth {
    width: 360px;
  }
  .ant-row .ant-form-item {
    margin-bottom: 0;
  }
  .tableInfo {
    .ant-btn-link{
      margin: 0;padding: 0px 4px;
    }
    .ant-btn > .anticon + span {
      margin-left: 0;
    }
    .dividerStyle {
      background-color: #525252;
    }
  }
  .paginationContainer{
    margin: 10px 8px 10px 0;
  }
  .modalContainer {
    margin-bottom: 10px;
    .divBorder {
      margin-bottom: 10px;
      border: @border-color;
      .pTittle {
        margin-bottom: 0;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        background-color: @common-bgc;
        font-weight: 600;
      }
      .rowMarginTop {
        margin: 5px 20px;
        .inputWidth {
          width: 96%;
        }
        .inputWidthFull {
          width: 100%;
        }
        .textareaStyle {
          width: 98%;
        }
      }
    }
  }
}
</style>