<template>
  <a-modal :width='1200' class="modalTop" destroyOnClose :title="addOrDownload == 'add' ? '盘点新增' : '编辑盘点'" :dialogStyle="{'top': '30px'}" v-model="visibleInventoryNewAdd" :maskClosable='false' :footer="null" @cancel='cancelModalForm'>
    <div class="modalFinalTop">
      <p class="baseInfo">基本信息</p>
      <div class="baseInfoToOption">
        <span>仓库：</span>
        <a-select class="selectOption" placeholder="仓库选择" :value="wareHouseName == undefined && warehousList[0] ? warehousList[0].whName : wareHouseName" @change="handleChangeWhNameOption">
          <a-select-option v-for="item in warehousList" :key="item.id" >{{item.whName}}</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="tableContainer">
      <p class="tipsInfo">商品</p>
      <div class="searchBox">
        <a-select
          class="autoCompleteStyle"
          show-search
          v-model="valueOption"
          placeholder="请输入商品名称"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSearch($event)"
          @change="handleChangeOption"
          @popupScroll="handlePopupScroll"
        >
          <a-spin
            v-if="productLoading && dataOption[0]"
            slot="notFoundContent"
            size="small"
          ></a-spin>
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <div
              style="padding: 0 8px 4px; cursor: pointer"
              @mousedown="(e) => e.preventDefault()"
            >
              <div style="text-align: center;">
                <a-spin v-show="productLoading && dataOption[0]" />
              </div>
            </div>
          </div>
          <a-select-option v-for="item in dataOption" :key="item.vlotId || item.id">
            <div class="flex-sb">
              <div>
                <span class="greenfont-a">商品名：</span>{{ item.itemName }}
              </div>
              <a-space>
                <span><span class="greenfont-a">平均价:</span>{{ item.averagePrice }}</span>
                <span><span class="greenfont-a">可用数:</span>{{ item.balance }}</span>
                <span><span class="greenfont-a">编码:</span>{{ item.itemCode }}</span>
              </a-space>
            </div>
          </a-select-option>
        </a-select>
        <a-input class="inputStyle" placeholder="请输入数量" allowClear v-model="invNum"></a-input>
        <a-button type="primary" @click="addBtn">添加</a-button>
      </div>
      <a-table
        bordered
        ref="tableRef"
        :data-source="dataTable"
        :columns="commonTable"
        :loading='loading'
        rowKey="vlotId"
        :pagination="false"
      >
        <!-- :scroll="{ x: 307.778 }" -->
        <template tips="实际库存" slot="invNum" slot-scope="text, record">
          <a-input v-model="record.invNum" />
        </template>
        <template slot="invDeference" slot-scope="text, record">
          <span>{{ !Number.isNaN(record.sysNum - record.invNum) ? record.invNum - record.sysNum : '0' }}</span>
        </template>
        <template tips="备注" slot="remark" slot-scope="text, record">
          <a-input
            v-model="record.remark"
            style="caret-color: green;"
            @change="() => handleChange(record.remark, record.key, 'remark', record.id)"/>
        </template>
        <template tips='操作' slot="operation" slot-scope="text, record">
          <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消"  @confirm="confirm(record.id)">
            <a-icon slot="icon" type="question-circle" style="color: red" />
            <span class="greenfont redfonthover cursorPin">删除</span>
          </a-popconfirm>
        </template>
      </a-table>
      <div class="flex-ed confrimButton">
        <div class="buttonBox">
          <a-button class="buttonCancle" @click="cancelModalBtn">取消</a-button>
          <a-button type="primary" @click="sureBtn">{{ addOrDownload == 'add' ? '确认' : addOrDownload == 'check' ? '审核' : '保存' }}</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  inventoryStockGetInventoryStockInfo,
  inventoryStockUpdate,
  inventoryStockUpdateStatus,
  inventoryStockAdd
} from '../../services/inventoryCheck.js'
import {
  warehouseList,
  lossOverflowGetItems
} from '../../services/showLoseAndOverflower'
import { debounce } from "../../utils/util";
const commonTable = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', scopedSlots: { customRender: 'proName' }, width: 160},
  {title: '单位', align: 'center', dataIndex: 'unit', scopedSlots: { customRender: 'unit' }, width: 140,},
  {title: '商品类型', align: 'center', dataIndex: 'proType', scopedSlots: { customRender: 'proType' }, width: 140,},
  {title: '系统数量', align: 'center', dataIndex: 'sysNum', scopedSlots: { customRender: 'sysNum' }, width: 140,},
  {title: '实际库存', align: 'center', dataIndex: 'invNum', scopedSlots: { customRender: 'invNum' }, width: 100,},
  {title: '盘库差异', align: 'center', dataIndex: 'invDeference', scopedSlots: { customRender: 'invDeference' }, width: 104,},
  {title: '备注', align: 'center', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 260,},
  {title: '操作', align: 'center', fixed: '', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, width: 100},
]
export default {
  name: "modalInventoryNewAdd",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      visibleInventoryNewAdd: false,
      visibleNode: '',
      addOrDownload: 'add',
      pInventoryId: undefined,
      selectForm: {
        wareHouseName: {},
      },
      dataOption: [],
      valueOption: undefined,
      warehousList: [],
      wareHouseName: undefined,
      commodityMaterial: {},
      proName: '',
      invNum: undefined,
      detailsInfoBox: {},
      queryInfoFun: '',
      commonTable,
      dataTable: [],
      deleteDate: [],
      loading: false,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "20", "50", "100"],
      pagination: {},
      paginationProduct:{
        page:1,
        rows:10,
        totalPage:0,
      },
      productLoading:false,
      productSearchName:''
    }
  },
  methods: {
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight - 4
      ) {
        if (this.paginationProduct.page >= this.paginationProduct.totalPage) {
          return false;
        }
        this.productLoading = true
        this.handleSearch(this.productSearchName || "", "srcoll");
      }
    },
    inventoryStockGetInventoryStockInfo(id) {
      const params = {id : id}
      inventoryStockGetInventoryStockInfo(params).then(
        val => {
          if (val.data.code == 200) {
            this.wareHouseName = val.data.data.wareHouseName
            if (this.addOrDownload == 'check' || this.addOrDownload == 'edit') {
              this.selectForm.wareHouseName.whName = val.data.data.wareHouseName
              this.selectForm.wareHouseName.id = val.data.data.whId
            }
            val.data.data.inventoryStockSubList.map(item => item.flag = 0)
            this.dataTable = val.data.data.inventoryStockSubList
            this.detailsInfoBox = val.data.data
          } else {
            this.dataTable = []
            this.$message.warn(`获取数据失败${val.data.message}`, 1.5)
          }
        }
      )
    },
    openModal(flag, id, queryInfoFun) {
      this.addOrDownload = flag
      this.pInventoryId = id
      this.invNum = ''
      this.queryInfoFun = queryInfoFun
      this.valueOption = undefined
      if (flag == 'add') {
        this.wareHouseName = undefined
      } else {
        this.inventoryStockGetInventoryStockInfo(id)
      }
      this.deleteDate = []
      this.dataOption=[]
      this.paginationProduct={
        page:1,
        rows:10,
        totalPage:1,
      }
      this.handleSearch('')
      this.visibleInventoryNewAdd = true;
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0);
    },
    getWarehoseList() {
      const params = {}
      warehouseList(params).then(
        val => {
          if (val.data.code == '200') {
            this.warehousList = val.data.data
          }
        }
      )
    },
    handleChangeWhNameOption(value) {
      this.wareHouseName = value;
      this.selectForm.wareHouseName = this.warehousList.find( item => { return item.id == value} )
    },
    handleSearch:debounce(function (value,state) {
      this.productSearchName=value
      this.productLoading=true
      this.paginationProduct.page=state?this.paginationProduct.page+1:1
      const params = { itemName: this.productSearchName ,...this.paginationProduct}
      lossOverflowGetItems(params).then(
        res => {
          this.productLoading=false
          if (res.data.code == '200') {
            this.dataOption =state?this.dataOption.concat(res.data.data): res.data.data
            this.paginationProduct.totalPage=res.data.totalPage||0
          }
          else{
            this.$message.error('盘点商品数据获取失败')
          }
        }
      ).catch((error)=>{
        this.productLoading=false
        this.$message.error(error||'盘点商品数据获取失败')
      })
    },1000),
    handleChangeOption(value) {
      this.valueOption = value;
      this.commodityMaterial = this.dataOption.find( item => { return (item.vlotId || item.id) == value} )
    },
    handleChange(value, key, column, id=0) {
      let keyId = id
      this.dataTable.find((item,i) => {
        if (item.id == id) {
          keyId = i
        }
      })
      const newData = [...this.dataTable]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = value
        this.dataTable = newData
      }
    },
    cancelModalForm() {
      this.wareHouseName == undefined
      this.dataTable = []
      this.deleteDate = []
      this.detailsInfoBox = {}
      this.sysNum = ''
    },
    confirm(id) {
      this.dataTable.some(
        (item,i) => {
          if (item.flag == 0 && item.id == id) {
            item.flag = 2
            this.deleteDate.push(item)
            return this.dataTable.splice(i,1)
          } else if (item.id == id) {
            return this.dataTable.splice(i,1)
          }
        }
      )
    },
    cancelModalBtn() {
      this.wareHouseName == undefined
      this.dataTable = []
      this.deleteDate = []
      this.detailsInfoBox = {}
      this.visibleInventoryNewAdd = false
      this.sysNum = ''
    },
    addBtn() {
      let commodityData = {
        id: this.commodityMaterial.id,
        vlotId: this.commodityMaterial.vlotId,
        flag: this.addOrDownload !== 'add' ? 1 : undefined,
        unit: this.commodityMaterial.defUom,
        proName: this.commodityMaterial.itemName,
        proCode: this.commodityMaterial.itemCode,
        proId: this.commodityMaterial.id,
        proTypeCode: this.commodityMaterial.itemTypeCode,
        proTypeId: this.commodityMaterial.itemTypeId,
        proType: this.commodityMaterial.itemType,
        sysNum: this.commodityMaterial.balance,
        invNum: this.invNum,
        price: typeof(this.commodityMaterial.averagePrice) == 'number' && !Number.isNaN(this.commodityMaterial.averagePrice) ? this.commodityMaterial.averagePrice : '',
        loPrice: typeof((this.commodityMaterial.averagePrice * this.num)) == 'number' && !Number.isNaN((this.commodityMaterial.averagePrice * this.num)) ? (this.commodityMaterial.averagePrice * this.num) : '',
        remark: '',
      }
      if (commodityData.proName === undefined) {
        this.$message.error('请先选择商品')
        return
      }
      for (let i = 0; i < this.dataTable.length; i++) {
        if (this.dataTable[i].vlotId == commodityData.vlotId) {
          this.$message.error('该相同明细的商品已存在，请勿重复添加')
          return
        }
      }
      this.dataTable.push(commodityData)
    },
    inventoryStockUpdate() {
      this.detailsInfoBox.wareHouseName = this.selectForm.wareHouseName.whName
      this.detailsInfoBox.whId = this.selectForm.wareHouseName.id
      this.detailsInfoBox.state = 0
      this.detailsInfoBox.inventoryStockSubList = this.dataTable.concat(this.deleteDate)
      const params = this.detailsInfoBox
      params.inventoryStockSubList.map(
        val => {
          val.price = typeof(val.price) == 'number' && !Number.isNaN(val.price) >= 0 ? val.price : val.price
          val.loPrice = typeof(val.loPrice) == 'number' && !Number.isNaN(val.loPrice) ? val.loPrice : ''
          val.subNum = typeof(val.sysNum - val.invNum) == 'number' && !Number.isNaN(val.sysNum - val.invNum) ? val.invNum - val.sysNum : '0'
        }
      )
      inventoryStockUpdate(params).then(
        val => {
          if (val.data.code == 200) {
            this.$message.success('保存成功')
            this.queryInfoFun()
            this.cancelModalForm()
            this.deleteDate = []
            this.visibleInventoryNewAdd = false
          } else {
            this.$message.warn(`保存失败${val.data.message}`, 1.5)
          }
        }
      )
    },
    inventoryStockUpdateStatus() {
      this.detailsInfoBox.wareHouseName = this.selectForm.wareHouseName.whName
      this.detailsInfoBox.whId = this.selectForm.wareHouseName.id
      this.detailsInfoBox.inventoryStockSubList = this.dataTable.concat(this.deleteDate)
      const params = this.detailsInfoBox
      params.inventoryStockSubList.map(
        val => {
          val.price = typeof(val.price) == 'number' && !Number.isNaN(val.price) >= 0 ? val.price : val.price
          val.loPrice = typeof(val.loPrice) == 'number' && !Number.isNaN(val.loPrice) ? val.loPrice : ''
          val.subNum = typeof(val.sysNum - val.invNum) == 'number' && !Number.isNaN(val.sysNum - val.invNum) ? val.invNum - val.sysNum : '0'
        }
      )
      inventoryStockUpdateStatus(params).then(
        val => {
          if (val.data.code == "200") {
            this.$message.success('审核成功')
            this.deleteDate = []
            this.cancelModalForm()
            this.queryInfoFun()
            this.visibleInventoryNewAdd = false
          } else {
            this.$message.warn(`审核失败${val.data.message}`, 3)
          }
        }
      )
    },
    inventoryStockAdd() {
      const params = {
        whId: this.selectForm.wareHouseName?.id ?? this.warehousList[0].id,
        wareHouseName: this.selectForm.wareHouseName?.whName ?? this.warehousList[0].whName,
        state: 0,
        remark: '',
        inventoryStockSubList: this.dataTable,
      }
      params.inventoryStockSubList.map(
        val => {
          val.price = typeof(val.price) == 'number' && !Number.isNaN(val.price) >= 0 ? val.price : val.price
          val.loPrice = typeof(val.loPrice) == 'number' && !Number.isNaN(val.loPrice) ? val.loPrice : ''
          val.subNum = typeof(val.sysNum - val.invNum) == 'number' && !Number.isNaN(val.sysNum - val.invNum) ? val.invNum - val.sysNum : ''
        }
      )
      inventoryStockAdd(params).then(
        val => {
          if (val.data.code == 200) {
            this.$message.success('新增成功')
            this.queryInfoFun()
            this.cancelModalForm()
            this.visibleInventoryNewAdd = false
          } else {
            this.$message.warn('新增失败')
          }
        }
      )
    },
    sureBtn() {
      if (this.addOrDownload == 'add') {
        this.inventoryStockAdd()
      } else if (this.addOrDownload == 'edit') {
        this.inventoryStockUpdate()
      } else {
        this.inventoryStockUpdateStatus()
      }
    }
  },
  // created() {
  //   this.handleSearch()
  // },
  activated() {
    this.getWarehoseList()
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  /deep/ .ant-modal-body{
    padding-top: 0;
  }
  /deep/ .ant-modal-header{
    border: 0;
  }
  .modalFinalTop{
    margin-bottom: 10px;
    border: @border-color;
    .baseInfo{
      margin: 0;
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      border-bottom: @border-color;
      background-color: @common-bgc;
      letter-spacing: 1px;
      font-size: 14px;
      font-weight: 800;
    }
    .baseInfoToOption{
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      .marginRight{
        margin-right: 4px;
      }
      .selectOption{
        width: 20%;
        min-width: 200px;
        max-width: 300px;
        margin-right: 10px;
      }
    }
  }
  .tableContainer{
    border: @border-color;
    background-color: #fff;
    .tipsInfo{
      margin: 0;padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background-color: @common-bgc;
      letter-spacing: 1px;
      font-size: 14px;
      font-weight: 800;
    }
    .tipsInfoBorder{
      border-bottom: @border-color;
    }
    .searchBox{
      height: 40px;
      line-height: 40px;
      .autoCompleteStyle{
        margin: 0 10px 0 15px;
        width: 55%;
        /deep/.ant-select-selection-selected-value {
          width: 735px;
        }
      }
      .inputStyle{
        margin-right: 10px;width: 20%;
      }
    }
  }
  .confrimButton{
    margin: 8px 8px 8px;
    .buttonBox{
      .buttonCancle{
        margin-right: 10px;
      }
    }
  }
}
</style>