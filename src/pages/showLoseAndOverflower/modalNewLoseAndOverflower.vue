<template>
  <a-modal :width='1200' class="modalTop" :dialogStyle="{'top': '30px'}" :title="addOrEidt == 'add' ? '新增' : '编辑'" v-model="visibleLO" :maskClosable='false' :footer="null" @cancel='cancelModalForm'>
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
      <p class="tipsInfo">
        <a-button-group v-if="addOrEidt == 'add'">
          <a-button :type="tableType == 'loss' && tableTypeLoss != 'numloss' ? 'primary' : '' " @click="changeProductOrigin('loss', '', 1)">按金额报损</a-button>
          <a-button :type="tableTypeLoss == 'numloss' ? 'primary' : '' " @click="changeProductOrigin('loss', 'numloss', 3)">按数量报损</a-button>
          <a-button :type="tableType == 'overflow' ?'primary' : ''" @click="changeProductOrigin('overflow', '', 2)">报溢</a-button>
        </a-button-group>
        <span v-else>商品</span>
      </p>
      <div class="searchBox">
        <a-select
          class="autoCompleteStyle"
          show-search
          :value="valueOption"
          placeholder="请输入商品名称"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          @search="handleSearch($event)"
          @change="handleChangeOption"
          @focus="focusEvent"
          @popupScroll='handlePopupScroll'
        >
          <a-spin :spinning="spinningFirst" slot="notFoundContent">
            <div style="height: 30px;"></div>
          </a-spin>
          <a-spin v-show="spinning && dataOption[0]" slot="notFoundContent" size="small"></a-spin>
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <div style="padding: 0 8px 4px; cursor: pointer" @mousedown="(e) => e.preventDefault()">
              <div style="text-align: center;">
                <a-spin v-show="spinning && dataOption[0]" />
              </div>
            </div>
          </div>
          <a-select-option v-for="item in dataOption" :key="item.vlotId || item.id">
            <div class="flex-sb">
              <div>
                <span class="greenfont-a">商品名：</span>{{ item.itemName }}
              </div>
              <a-space>
                <span v-show="tableType == 'loss'"><span class="greenfont-a">入库日期:</span>{{ item.inDate }}</span>
                <span v-show="tableType == 'loss'"><span class="greenfont-a">平均价:</span>{{ item.averagePrice }}</span>
                <span v-show="tableType == 'loss'"><span class="greenfont-a">可用数:</span>{{ item.balance }}</span>
                <span><span class="greenfont-a">编码:</span>{{ item.itemCode }}</span>
              </a-space>
            </div>
          </a-select-option>
        </a-select>
        <a-input-number class="inputStyle" placeholder="请输入数量" allowClear v-model="num"></a-input-number>
        <a-button type="primary" @click="addCommodity">添加</a-button>
      </div>
      <a-table
        bordered
        :data-source="dataTable"
        :columns="tableType == 'loss' ? commonTable : overTable"
        :loading='loading'
        rowKey="vlotId"
        :pagination="false"
        :scroll="{ x: 307.778 }"
      >
        <span slot="num"><span class="redfont">*</span>实际数量</span>
        <template tips="实际数量" slot="num" slot-scope="text, record">
          <a-input-number
            v-model="record.num"
            @change="() => handleChangeNum(record, 'num')"/>
            <p class="redfont pTips" v-show="tableType != 'overflow' && record.invNum - record.num === 0 ? true : false">不能等于系统库存</p>
            <p class="redfont pTips" v-show="tableType != 'overflow' && record.num > record.invNum && (loType == 1 || loType == 3) ? true : false">数量应少于系统库存</p>
            <p class="redfont pTips" v-show="tableType != 'overflow' && record.invNum > record.num && loType == 2 ? true : false">数量应超过系统库存</p>
        </template>
        <template tips="单据类型" slot="orderType" slot-scope="text, record">
          <span v-if="tableType == 'loss'">{{record.invNum > record.num ?  '报损单' : record.num > record.invNum ? '报溢单': ''}}</span>
          <span v-else>报溢单</span>
        </template>
        <template tips="损溢数量" slot="subNum" slot-scope="text, record">
          <span>{{typeis(record.num - record.invNum, 'number') ? formatPrice(record.num - record.invNum) : ''}}</span>
        </template>
        <span slot="price"><span class="redfont">*</span>成本单价</span>
        <template tips="成本单价" slot="price" slot-scope="text, record">
          <span v-if="tableType == 'loss'">{{ record.price }}</span>
          <a-input-number v-else v-model="record.price" @change="() => handleChangeNum(record, 'price')"></a-input-number>
        </template>
        <span slot="loPrice"><span v-if="tableTypeLoss == 'numloss'" class="redfont">*</span>报损报溢金额</span>
        <template tips="报损报溢金额" slot="loPrice" slot-scope="text, record">
          <div class="cursorDef" v-if="tableTypeLoss == 'numloss'">{{record.loPrice}}</div>
          <a-input-number v-else-if="tableType == 'loss'" v-model="record.loPrice" @change="() => handleLoPrice(record, 'loss')"></a-input-number>
          <a-input-number v-else v-model="record.loPrice" @change="() => handleLoPrice(record)"></a-input-number>
        </template>
        <template tips="备注" slot="remark" slot-scope="text, record">
          <a-input v-model="record.remark"/>
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
          <a-button type="primary" @click="submitBtn">{{btnText[addOrEidt]}}</a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import {
  lossOverflowAdd,
  lossOverflowUpdate,
  lossOverflowGetLossOverflowInfo,
  lossOverflowGetItems,
  lossOverflowUpdateStatus,
  warehouseList,
  baseCommodity,
  overAdd,
  updateOverData,
  updateOverState
} from '../../services/showLoseAndOverflower'
import { debounce } from "../../utils/util";
const commonTable = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', scopedSlots: { customRender: 'proName' }, width: 160},
  {title: '商品类型', align: 'center', dataIndex: 'proType', scopedSlots: { customRender: 'proType' }, width: 124},
  {title: '系统库存', align: 'center', dataIndex: 'invNum', scopedSlots: { customRender: 'invNum' }, width: 140},
  {align: 'center', dataIndex: 'num', scopedSlots: { customRender: 'num' }, width: 160, slots: { title: 'num' }},
  {title: '单据类型', align: 'center', dataIndex: 'orderType', scopedSlots: { customRender: 'orderType' }, width: 150},
  {title: '损溢数量', align: 'center', dataIndex: 'subNum', scopedSlots: { customRender: 'subNum' }, width: 140},
  {title: '成本单价', align: 'center', dataIndex: 'price', scopedSlots: { customRender: 'price' }, width: 140},
  {align: 'center', dataIndex: 'loPrice', scopedSlots: { customRender: 'loPrice' }, width: 140, slots: { title: 'loPrice' }},
  {title: '备注', align: 'center', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 240},
  {title: '操作', align: 'center', fixed: '', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, width: 100},
]
const overTable = [
  {title: '商品名称', align: 'center', dataIndex: 'proName', scopedSlots: { customRender: 'proName' }, width: 160},
  {title: '商品类型', align: 'center', dataIndex: 'proType', scopedSlots: { customRender: 'proType' }, width: 124},
  {align: 'center', dataIndex: 'num', scopedSlots: { customRender: 'num' }, width: 160, slots: { title: 'num' }},
  {title: '单据类型', align: 'center', dataIndex: 'orderType', scopedSlots: { customRender: 'orderType' }, width: 150},
  {align: 'center', dataIndex: 'price', scopedSlots: { customRender: 'price' }, width: 140, slots: { title: 'price' }},
  {title: '报损报溢金额', align: 'center', dataIndex: 'loPrice', scopedSlots: { customRender: 'loPrice' }, width: 140},
  {title: '备注', align: 'center', dataIndex: 'remark', scopedSlots: { customRender: 'remark' }, width: 240},
  {title: '操作', align: 'center', fixed: '', dataIndex: 'operation', scopedSlots: { customRender: 'operation' }, width: 100},
]
export default {
  name: "modalNewLoseAndOverflowerNew",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      visibleLO: false,
      addOrEidt: 'add',
      tableType: 'loss',
      tableTypeLoss: undefined,
      pCheckId: undefined,
      warehousList: [],
      btnText: {
        'add': '确定',
        'edit': '保存',
        'check': '审核',
      },
      selectForm: {
        wareHouseName: undefined,
        documentType: undefined
      },
      wareHouseName: undefined,
      whId: undefined,
      loType: undefined,
      dataOption: [],
      deleteDate: [],
      valueOption: undefined,
      commodityMaterial: {},
      commonTable,
      overTable,
      dataTable: [],
      infoBox: {},
      num: undefined,
      loading: false,
      spinningFirst: false,
      spinning: false,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "15", "20", "30"],
      pagination: {},
      paginationSelect: {
        page:1,
        rows:10,
        totalPage:0
      },
      productSearchName:''
    }
  },
  methods: {
    handlePopupScroll(e) {
      if (e.target.scrollTop + e.target.offsetHeight > e.target.scrollHeight - 4) {
        if (this.paginationSelect.page >= this.paginationSelect.totalPage) {
          return false;
        }
        this.spinning = true
        this.handleSearch(this.productSearchName || "", "srcoll");
      }
    },
    getDetailsInfo(id) {
      this.tableType = undefined
      lossOverflowGetLossOverflowInfo({id : id}).then(val => {
        if (val.data.code == 200) {
          if (val.data.data.loType == 1) {
            this.tableType = 'loss'
          } else if (val.data.data.loType == 2) {
            this.tableType = 'overflow'
          } else if (val.data.data.loType == 3) {
            this.tableType = 'loss'
            this.tableTypeLoss = 'numloss'
          }
          this.loType = val.data.data.loType
          this.wareHouseName = val.data.data.wareHouseName
          this.whId = val.data.data.whId
          val.data.data.subList.map(item => item.flag = 0)
          this.dataTable = val.data.data.subList
          this.infoBox = val.data.data
        } else {
          this.dataTable = []
          this.$message.error('获取数据失败'+val.data.message)
        }
      })
    },
    openModal(flag, id) {
      this.pCheckId = id
      this.deleteDate = []
      this.loType = undefined
      this.tableTypeLoss = undefined
      if (flag == 'add') {
        this.loType = 1
        this.tableType = 'loss'
        this.wareHouseName = undefined
        this.valueOption = undefined
      } else {
        this.valueOption = undefined
        this.getDetailsInfo(id)
      }
      this.addOrEidt = flag
      this.dataOption = []
      this.visibleLO = true;
    },
    changeProductOrigin(type, typeLoss, typeNum) {
      this.dataTable = []
      this.tableTypeLoss = typeLoss
      this.loType = typeNum
      if (type == 'loss') {
        this.tableType = 'loss'
      } else {
        this.tableType = 'overflow'
      }
    },
   handleSearch:debounce(function(value,state) {
      this.productSearchName=value
      this.paginationSelect.page=state?this.paginationSelect.page+1:1
      const params = {itemName:this.productSearchName,...this.paginationSelect}
      this.spinning = true
      if (this.tableType == 'loss') {
        lossOverflowGetItems(params).then(res => {
          if (res.data.code == '200') {
            this.spinning = false
            this.dataOption =state?this.dataOption.concat(res.data.data):res.data.data
            this.paginationSelect.totalPage=res.data.totalPage||0
          }
        }).catch(() => this.spinning = false)
      } else {
        baseCommodity(params).then(res => {
          if (res.data.code == '200') {
            this.spinning = false
            this.spinningFirst = false
            this.dataOption =state?this.dataOption.concat(res.data.data):res.data.data
            this.paginationSelect.totalPage=res.data.totalPage||0
          }
        }).catch(() => {
          this.spinningFirst = false
          this.spinning = false
        })
      }
    },1000),
    focusEvent() {
      this.spinningFirst = true
      this.handleSearch('')
    },
    handleChangeOption(value) {
      this.valueOption = value;
      this.commodityMaterial = this.dataOption.find(item => (item.vlotId || item.id) == value)
    },
    handleChangeWhNameOption(value) {
      this.wareHouseName = value;
      this.selectForm.wareHouseName = this.warehousList.find(item => item.id == value)
    },
    addCommodity() {
      if (this.tableType == 'loss') {
        let commodityData = {
          id: this.commodityMaterial.id,
          vlotId: this.commodityMaterial.vlotId,
          flag: this.addOrEidt !== 'add' ? 1 : undefined,
          proName: this.commodityMaterial.itemName,
          proCode: this.commodityMaterial.itemCode,
          proId: this.commodityMaterial.id,
          proTypeCode: this.commodityMaterial.itemTypeCode,
          proTypeId: this.commodityMaterial.itemTypeId,
          proType: this.commodityMaterial.itemType,
          unit: this.commodityMaterial.defUom,
          invNum: this.commodityMaterial.balance,
          num: +this.num,
          subNum: this.formatPrice(+this.num - this.commodityMaterial.balance),
          price: this.commodityMaterial.averagePrice,
          remark: '',
        }
        commodityData.loPrice = this.formatPrice(commodityData.subNum * commodityData.price)
        if (this.isUndef(commodityData.proName)) {
          this.$message.error('请先选择商品')
          return
        }
        if (this.dataTable.some(item => item.vlotId == commodityData.vlotId)) {
          this.$message.error('该相同明细的商品已存在，请勿重复添加')
          return
        }
        this.dataTable.push(commodityData)
      } else {
        let overCommodityData = {
          id: this.commodityMaterial.id,
          vlotId: this.commodityMaterial.vlotId,
          flag: 1,
          proId: this.commodityMaterial.id,
          proName: this.commodityMaterial.itemName,
          proCode: this.commodityMaterial.itemCode,
          num: +this.num,
          unit: this.commodityMaterial.defUom,
          price: undefined,
          loPrice: undefined,
          remark: undefined
        }
        if (this.isUndef(overCommodityData.proName)) {
          this.$message.error('请先选择商品')
          return
        }
        if (this.dataTable.some(item => item.id == overCommodityData.id)) {
          this.$message.error('该商品已存在，请勿重复添加')
          return
        }
        this.dataTable.push(overCommodityData)
      }
      this.valueOption = undefined
      this.commodityMaterial = {}
      this.num = undefined
    },
    handleLoPrice(record, flag) {
      let value = record.loPrice
      if (flag == 'loss') {
        record['subNum'] = this.formatPrice(+record['num'] - +record['invNum'])
        if (this.tableTypeLoss == 'numloss') {
          record['price'] = this.typeis(+value / +record['subNum'], 'number') ? this.formatPrice(+value / +record['subNum']) : 0
        }
      } else {
        record['price'] = this.typeis(+value / +record['num'], 'number') ? this.formatPrice(+value / +record['num']) : 0
      }
    },
    handleChangeNum(record, flag) {
      let value = +record.price
      if (flag == 'num') {
        record['subNum'] = this.formatPrice(+record['num'] - +record['invNum'])
        record['loPrice'] = this.formatPrice(+record['subNum'] * +record['price'])
      } else if (flag == 'price') {
        record['loPrice'] = this.formatPrice(+value * +record['num'])
      }
    },
    getWarehoseList() {
      warehouseList({}).then(val => val.data.code == '200' && (this.warehousList = val.data.data))
    },
    cancelModalForm() {
      this.infoBox = {}
      this.dataTable = []
      this.deleteDate = []
      this.selectForm.wareHouseName = undefined
      this.num = undefined
    },
    confirm(id) {
      this.dataTable.some((item,i) => {
        if (item.flag == 0 && item.id == id) {
          item.flag = 2
          this.deleteDate.push(item)
          this.dataTable.splice(i,1)
        } else if (item.id == id) {
          return this.dataTable.splice(i,1)
        }
      })
    },
    submitNewOver() {
      if (this.dataTable.some(item => this.isUndef(item.price) || this.isUndef(item.num))) {
        this.$message.error('成本单价、实际数量为必填项', 3.5)
        return
      }
      let params = {
        whId: this.selectForm.wareHouseName?.id ?? this.warehousList[0]?.id,
        wareHouseName: this.selectForm.wareHouseName?.whName ?? this.warehousList[0]?.whName,
        remark: '',
        subList: this.dataTable,
      }
      overAdd(params).then(val => {
        if (val.data.code == 200) {
          this.$message.success(val.data.message, 2)
          this.$parent.queryInfo()
          this.cancelModalForm()
          this.visibleLO = false
        } else {
          this.$message.error(val.data.message)
        }
      })
    },
    submitNew() {
      if (!this.dataTable.length) {
        this.$message.error('表格商品不能为空')
        return
      }
      if (this.tableType == 'overflow') {
        this.submitNewOver()
        return
      }
      if (this.dataTable.some(val => val.invNum == val.num)) {
        this.$message.error('存在数量等于系统库存项')
        return
      }
      this.dataTable.map(item => {
        if (this.typeis(item.invNum - item.num, 'number')) item.subNum = this.formatPrice(item.num - item.invNum)
      })
      let numTotal = this.dataTable.reduce((t,c) => t + (+c.num || 0), 0)
      const params = {
        whId: this.selectForm.wareHouseName?.id ?? this.warehousList[0]?.id,
        documentType: this.selectForm.documentType,
        loNumber: '',
        wareHouseName: this.selectForm.wareHouseName?.whName ?? this.warehousList[0]?.whName,
        loType: this.loType,
        proNum: numTotal,
        price: '',
        source: '',
        state: 0,
        remark: '',
        subList: this.dataTable,
      }
      lossOverflowAdd(params).then(val => {
        if (val.data.code == 200) {
          this.$message.success(val.data.message, 2)
          this.$parent.queryInfo()
          this.cancelModalForm()
          this.visibleLO = false
        } else {
          this.$message.error(val.data.message, 2)
        }
      })
    },
    submitEditOver() {
      this.infoBox.subList = this.dataTable
      this.infoBox.state = 0
      this.infoBox.subList = this.dataTable.concat(this.deleteDate)
      this.infoBox.wareHouseName = this.selectForm.wareHouseName?.whName ?? this.wareHouseName
      this.infoBox.whId = this.selectForm.wareHouseName?.id ?? this.whId
      let params = this.infoBox
      updateOverData(params).then(val => {
        if (val.data.code == '200') {
          this.$message.success(val.data.message)
          this.infoBox = {}
          this.dataTable = []
          this.$parent.queryInfo()
          this.selectForm.wareHouseName = undefined
          this.selectForm.documentType = undefined
          this.visibleLO = false
        } else {
          this.getDetailsInfo(this.pCheckId)
          this.$message.error(val.data.message, 3)
        }
      })
    },
    submitEdit() {
      if (this.dataTable.some(val => val.invNum == val.num)) {
        this.$message.error('存在数量等于系统库存项')
        return
      }
      this.dataTable.map(item => {
        if (item.num > item.invNum && (this.loType == 1 || this.loType == 3)) {
          this.$message.error('报损单的数量不对，请按提示修改正确后提交')
          return
        } else if (item.num < item.invNum && this.loType == 2) {
          this.$message.error('报溢单的数量不对，请按提示修改正确后提交')
          return
        }
      }
      )
      this.infoBox.subList = this.dataTable
      this.infoBox.state = 0
      this.infoBox.subList = this.dataTable.concat(this.deleteDate)
      this.infoBox.wareHouseName = this.selectForm.wareHouseName?.whName ?? this.wareHouseName
      this.infoBox.whId = this.selectForm.wareHouseName?.id ?? this.whId
      const params = this.infoBox
      params.subList.forEach(item => {
        if (this.typeis(item.num - item.invNum, 'number')) item.subNum = this.formatPrice(item.num - item.invNum)
      })
      lossOverflowUpdate(params).then(val => {
        if (val.data.code == '200') {
          this.$message.success(val.data.message)
          this.infoBox = {}
          this.dataTable = []
          this.$parent.queryInfo()
          this.selectForm.wareHouseName = undefined
          this.selectForm.documentType = undefined
          this.visibleLO = false
        } else {
          this.getDetailsInfo(this.pCheckId)
          this.$message.error(val.data.message, 3)
        }
      })
    },
    submitCheckOver() {
      this.infoBox.subList = this.dataTable
      this.infoBox.state = 0
      this.infoBox.subList = this.dataTable.concat(this.deleteDate)
      this.infoBox.wareHouseName = this.selectForm.wareHouseName?.whName ?? this.wareHouseName
      this.infoBox.whId = this.selectForm.wareHouseName?.id ?? this.whId
      let params = this.infoBox
      updateOverState(params).then(val => {
        if (val.data.code) {
          this.$message.success(val.data.message)
          this.$parent.queryInfo()
          this.dataTable = []
          this.selectForm.wareHouseName = undefined
          this.pCheckId = undefined
          this.visibleLO = false
        } else {
          this.$message.error(val.data.message)
        }
      })
    },
    submitCheck() {
      if (this.dataTable.some(val => val.invNum == val.num)) {
          this.$message.error('存在数量等于系统库存项')
          return
      }
      this.dataTable.map(
        item => {
          if (item.num > item.invNum && (this.loType == 1 || this.loType == 3)) {
            this.$message.error('报损单的数量不对，请按提示修改正确后提交')
            return
          } else if (item.num < item.invNum && this.loType == 2) {
            this.$message.error('报溢单的数量不对，请按提示修改正确后提交')
            return
          }
        }
      )
      this.infoBox.subList = this.dataTable
      this.infoBox.state = 0
      this.infoBox.subList = this.dataTable.concat(this.deleteDate)
      this.infoBox.wareHouseName = this.selectForm.wareHouseName?.whName ?? this.wareHouseName
      this.infoBox.whId = this.selectForm.wareHouseName?.id ?? this.whId
      const params = this.infoBox
      params.subList.map(item => {
        if (this.typeis(item.num - item.invNum, 'number')) item.subNum = this.formatPrice(item.num - item.invNum)
      })
      lossOverflowUpdateStatus(params).then(val => {
        if (val.data.code) {
          this.$message.success(val.data.message)
          this.$parent.queryInfo()
          this.dataTable = []
          this.selectForm.wareHouseName = undefined
          this.pCheckId = undefined
          this.visibleLO = false
        } else {
          this.$message.error(val.data.message, 3)
        }
      })
    },
    submitBtn() {
      if (this.dataTable.some(item => this.isUndef(item.num))) {
        this.$message.error('数量不能为空')
        return
      }
      if (this.loType == 1) {
        if (this.dataTable.some(item => this.isUndef(+item.loPrice))) {
          this.$message.error('报损报溢金额为必填项')
          return
        }
      }
      if (this.dataTable.some(item => !(+item.price > 0))) {
        this.$message.error('成本单价必须为大于0的正数')
        return
      }
      if (this.addOrEidt == 'edit') {
        this.tableType == 'loss' ? this.submitEdit() : this.submitEditOver()
      } else if (this.addOrEidt == 'check') {
        this.tableType == 'loss' ? this.submitCheck() : this.submitCheckOver()
      } else {
        this.submitNew()
      }
    },
    cancelModalBtn() {
      this.cancelModalForm()
      this.visibleLO = false;
    }
  },
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
        width: 62.483%;
        /deep/.ant-select-selection-selected-value {
          width: 835px;
        }
      }
      .inputStyle{
        margin-right: 10px;width: 20%;
      }
    }
    .pTips{
      margin: 0;height: 4px;
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