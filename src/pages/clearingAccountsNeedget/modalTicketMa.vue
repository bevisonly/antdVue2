<template>
  <div class="modalTop" id="scrollTop">
    <div class="modalContainer">
      <div class="divBorder" v-if="fullScreen">
        <p class="pTittle fontWeight">基础信息</p>
        <a-row class="rowMarginTop" :gutter="12">
          <a-col :span="6">
            <div class="aRequired">发票名称：</div>
            <a-input class="widthMax" v-model="headMsg.invoiceName"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="aRequired">发票限额：</div>
            <a-select class="widthMax" v-model="headMsg.invoiceMaxType" @change="handleChangeInvoiceMaxType">
              <a-select-option value="1">不限</a-select-option>
              <a-select-option value="2">万位</a-select-option>
              <a-select-option value="3">十万位</a-select-option>
              <a-select-option value="4">百万位</a-select-option>
              <a-select-option value="5">千万位</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div>客户银行：</div>
            <a-input class="widthMax" disabled v-model="headMsg.depositBank"></a-input>
          </a-col>
          <a-col :span="6">
            <div>电话号码：</div>
            <a-input class="widthMax" v-model.trim="headMsg.phone"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop" :gutter="12">
          <a-col :span="6">
            <div class="aRequired">开票金额：</div>
            <a-input-number class="widthMax" v-model.trim="headMsg.invoiceAmount"></a-input-number>
          </a-col>
          <a-col :span="6">
            <div>已完成开票金额：</div>
            <a-input class="widthMax" disabled v-model="headMsg.invoiceAmounted"></a-input>
          </a-col>
          <a-col :span="6">
            <div>开票日期：</div>
            <a-date-picker class="widthMax" show-time v-model="headMsg.invoiceDate" @change="onChange" @ok="onOk">
              <template slot="dateRender" slot-scope="current, today">
                <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">
                  {{ current.date() }}
                </div>
              </template>
            </a-date-picker>
          </a-col>
          <a-col :span="6">
            <div>发票号：</div>
            <a-input class="widthMax" v-model.trim="headMsg.invoiceNo"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop" :gutter="12">
          <a-col :span="6">
            <div>税号：</div>
            <a-input class="widthMax" v-model.trim="headMsg.taxNo"></a-input>
          </a-col>
          <a-col :span="6">
            <div>凭证号：</div>
            <a-input class="widthMax" v-model.trim="headMsg.evidenceNo"></a-input>
          </a-col>
          <a-col :span="12">
            <div>单位地址：</div>
            <a-input class="widthMax" v-model.trim="headMsg.partnerAddress"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop" :gutter="12">
          <a-col :span="12">
            <div>发票信息：</div>
            <a-textarea class="widthMax" :auto-size='{minRows: 4, maxRows: 8}' v-model="headMsg.invoiceMessage"/>
          </a-col>
          <a-col :span="12">
            <div>
              <span>上传单据：</span>
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
      <div class="tableContainer">
        <p class="pTittle fontWeight">开票商品列表</p>
        <div class="flex-sb heightDiv">
          <a-button-group>
            <a-button icon="user" :type="whichData == 'customer' ? 'primary' : ''" @click="changeData('customer', 1)"> 按客户 </a-button>
            <a-button icon="shopping" :type="whichData == 'item' ? 'primary' : ''" @click="changeData('item', 2)"> 按商品 </a-button>
          </a-button-group>
          <a-button-group>
            <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
            <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
            <checkboxList v-model="columns" width="340" col="3" />
          </a-button-group>
        </div>
        <a-table
          bordered
          :columns="columns"
          :scroll="{ x: 307.778, y: total < 20 ? 0 : 1300 }"
          :data-source="tableData"
          rowKey="id"
          :pagination='tableData.length > 50 ? true :false'
        >
          <span slot="vat" slot-scope="text,record">
          {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
          {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
          {{ record.vat+'%' }}
          </span>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
            <span v-for="(item, j) in footerTotal" :key="item.name">
              <span class="greyfont">{{item.name}}</span>
              &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + +c[item.value]), 0) }}</span>&gt;
              <a-divider v-show="j != footerTotal.length - 1" type="vertical" />
            </span>
          </template>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button class="marginRight" type="primary" @click="ticketPartConfirm">确认部分开票</a-button>
        <a-button type="primary" @click="ticketAllConfirm">确认全部开票</a-button>
      </div>
    </div>
    <div style="position: fixed; bottom: 64px; right: 42px; z-index: 999999;">
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
  blueAddOrTicket,
  ticketPartConfirm,
  ticketAllConfirm,
  getImgURL,
  transferFile,
  deleteFile,
  saveFile
} from '@/services/settlement/receive/clearingAccountsNeedget'
import { throttle } from "../../utils/tool";
const columns = [
  {title: "销售单号", dataIndex: "soCode", width: 210},
  {title: "商品名称", dataIndex: "itemName", width: 200},
  {title: "商品编码", dataIndex: "itemCode", width: 200},
  {title: "客户", dataIndex: "customerName", width: 280},
  {title: "门店名称", dataIndex: "storeName", width: 280},
  {title: "数量", dataIndex: "qty", width: 140},
  {title: "单位", dataIndex: "unit", width: 140},
  {title: "单价", dataIndex: "signPrice", width: 180},
  {title: "单据金额", dataIndex: "signAmount", width: 180},
  {title: "扣点金额", dataIndex: "deductionAmount", width: 180},
  {title: "应收金额", dataIndex: "receivableAmount", width: 180},
  {title: "税额", dataIndex: "taxAmount", width: 180},
  {title: "不含税金额", dataIndex: "includingTaxAmount", width: 180},
  {title: "增值税", dataIndex: "vat", width: 200, scopedSlots: {customRender: "vat"}},
]
export default {
  name: "modalTicketMa",
  data() {
    return {
      columns,
      flag: 'ticket',
      headMsg: {
        id: undefined,
        version: undefined,
        issueState: undefined,
        invoiceName: undefined,
        invoiceMaxType: undefined,
        depositBank: undefined,
        phone: undefined,
        invoiceAmount: undefined,
        invoiceAmounted: undefined,
        invoiceDate: undefined,
        invoiceNo: undefined,
        taxNo: undefined,
        evidenceNo: undefined,
        partnerAddress: undefined,
        invoiceMessage: undefined
      },
      whichData: 'customer',
      footerTotal: [
        {name: '数量', value: 'qty'},
        {name: '单价', value: 'signPrice'},
        {name: '单据金额', value: 'signAmount'},
        {name: '扣点金额', value: 'deductionAmount'},
        {name: '应收金额', value: 'receivableAmount'},
        {name: '税额', value: 'taxAmount'},
        {name: '不含税额', value: 'includingTaxAmount'},
      ],
      tableData: [],
      fullScreen: true,
      disabledFlage: 0,
      total: 0,
      allMsg: {},
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fd: new FormData(),
      imgObj: new Image()
    }
  },
  methods: {
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
        this.$message.warn('找不到文件链接/路径', 3)
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
    tableList(id, type) {
      let params = {
        arInvoiceId: id,
        arInvoiceCodeState: type,
        order: 'desc',
        sort: 'id'
      }
      blueAddOrTicket(params).then(res => res.data.code == 200 && (this.tableData = res.data.data))
    },
    onChange(value) { this.headMsg.invoiceDate = moment(value).format("YYYY-MM-DD HH:mm:ss") },
    onOk(value) { this.headMsg.invoiceDate = moment(value).format("YYYY-MM-DD HH:mm:ss") },
    handleChangeInvoiceMaxType(value) { this.headMsg.invoiceMaxType = value },
    changeData(flag, type) {
      this.whichData = flag
      this.tableList(this.headMsg.id, type)
    },
    openModal(flag, record = {}) {
      this.flag = flag
      this.fileList = []
      this.tableList(record.id, 1)
      this.getImgURL(record.id)
      this.allMsg = record
      this.headMsg=record
      this.headMsg.id = record.id
      this.headMsg.version = record.version
      this.headMsg.issueState = record.issueState
      this.headMsg.invoiceName = record.invoiceName
      this.headMsg.invoiceMaxType = this.typeis(record.invoiceMaxType) == 'number' ? "" + record.invoiceMaxType : record.invoiceMaxType,
      this.headMsg.depositBank = record.depositBank
      this.headMsg.phone = record.phone
      this.headMsg.invoiceAmount = record.invoiceAmount
      this.headMsg.invoiceAmounted = record.invoiceAmounted
      this.headMsg.invoiceDate = record.invoiceDate || null
      this.headMsg.invoiceNo = record.invoiceNo
      this.headMsg.taxNo = record.taxNo
      this.headMsg.evidenceNo = record.evidenceNo
      this.headMsg.partnerAddress = record.partnerAddress
      this.headMsg.invoiceMessage = record.invoiceMessage
    },
    redo() { this.tableList(this.headMsg.id, this.whichData == "customer" ? 1 : 2)},
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    throttleTicketPartConfirm: throttle(function() {
      if (!this.headMsg.invoiceName || !this.headMsg.invoiceMaxType || !this.headMsg.invoiceAmount) {
        this.$message.warn('请检查发票名称，发票限额，开票金额是否已填写', 3)
        return
      }
      ticketPartConfirm(this.headMsg).then(res => {
        if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(e => this.$message.error('部分开票失败'+e, 3))
    },3500),
    ticketPartConfirm() {
      this.throttleTicketPartConfirm()
    },
    throttleTicketAllConfirm: throttle(function() {
      if (!this.headMsg.invoiceName || !this.headMsg.invoiceMaxType || !this.headMsg.invoiceAmount) {
        this.$message.warn('请检查发票名称，发票限额，开票金额是否已填写', 3)
        return
      }
      ticketAllConfirm(this.headMsg).then(res => {
        if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      }).catch(e => this.$message.error('全部开票失败'+e, 3))
    },3500),
    ticketAllConfirm() {
      this.throttleTicketAllConfirm()
    },
    triggerFun() {
      this.openModal(this.$parent.subPageFlag, this.$parent.dataSubPage)
    }
  },
  activated() {
    this.triggerFun()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  .modalContainer {
    margin-bottom: 10px;
    .pTittle {
      margin-bottom: 0;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      background-color: @common-bgc;
    }
    .fontWeight {
      font-weight: 600;
    }
    .circle {
      display: inline-block;
      width: 36px;
      height: 36px;
      line-height: 36px;
      margin-right: 16px;
      text-align: center;
      border: @border-color;
      border-radius: 50%;
    }
    .bgc {
      border: 0;
      font-size: 18px;
      background-color: #009b00;
      color: white;
    }
    .divBorder {
      border: @border-color;
      .rowMarginTop {
        margin: 5px 20px !important;
        .widthMax {
          width: 100%;
        }
      }
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .ant-btn-link{
        margin: 0;padding: 0px 4px;
      }
      .heightDiv {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
      }
      .a-btn {
        width: 50px;
      }
      .ant-table-footer .ant-divider {
        margin-left: 5px;
        background-color: #7a7a7a;
      }
    }
    .marginRight {
      margin-right: 10px;
    }
  }
}
</style>