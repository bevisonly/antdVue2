<template>
  <a-modal class="modalTop" :width='1300' :title="flag == 'add' ? '新增' : flag == 'edit' ? '编辑' : flag == 'pickerOk' ? '领料确认' : '详情' " :dialogStyle="{'top': '30px'}" :maskClosable='false' v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <a-row class="rowSelete">
        <span class="rowSeletSpan"><span v-if="flag == 'details' ? false : true" class="redfont">*&nbsp;</span>领料员：</span>
        <a-select
          v-if="flag == 'details' ? false : true"
          style="width: 43.1%;margin-right: 20px;"
          v-model="getPickerNameValue"
          placeholder="请选择领料员"
          mode="multiple"
          option-label-prop="label"
        >
          <div slot="dropdownRender" slot-scope="menu">
            <v-nodes :vnodes="menu" />
            <div class="flex-ed"><a-button type="link">关闭</a-button>&nbsp;</div>
          </div>
          <a-select-option v-for="item in pickerNameOption" :key="item.id" :label="item.workerName" :value="item.workerName+'+'+item.id">
            {{ item.workerName }}
          </a-select-option>
        </a-select>
        <span v-else style="margin-right: 20px; background:  #f8f8f8;">{{ getPickerNameValue }}</span>
        <span>
          <span>备注：</span>
          <a-input v-if="flag == 'details' ? false : true" style="width: 45.1%" v-model="pickerBox.remark"></a-input>
          <span v-else style="background:  #f8f8f8;">{{ pickerBox.remark }}</span>
        </span>
      </a-row>
      <a-row>
        <a-col class="colStyle colBorder" :span="12">
          <p class="pTittle">领料商品单</p>
          <p v-if="flag == 'details' ? false : true" class="pSelete">
            <a-select
              class="autoCompleteStyle"
              show-search
              style="width: 45%;margin-right: 10px;"
              :value="leftBox.getProductValue"
              placeholder="请输入选择商品名称"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              :loading="leftBox.loadingSeleteLeft"
              @search="handleGetProductValueSearch"
              @change="handleGetProductValueOption"
            >
              <a-select-option v-for="item in leftBox.getProductValueOption" :key="item.id">
                {{ item.itemName }}
              </a-select-option>
            </a-select>
            <a-input class="inputStyle" placeholder="请输入数量" v-LimitInputNumber="leftBox.getNum" v-model="leftBox.getNum"></a-input>
            <a-button class="marginRight" type="primary" @click="addCommdityGet">添加</a-button>
            <span v-show="leftBox.uselyNum && flag == 'add'? true : false">可用数量：{{ leftBox.uselyNum }}</span>
          </p>
          <a-table
            :bordered="flag == 'details' ? false : true"
            ref="tableRef"
            :data-source="unfinishedProListTable"
            rowKey="id"
            :scroll="{ x: 307.778 }"
            :pagination='false'
          >
            <a-table-column :title="flag == 'details' ? '领料商品' : getProductIcon" data-index="piItemName" :width="190">
              <template slot-scope="text, record">
                <a-select
                  v-if="flag == 'details' ? false : true"
                  style="width: 100%;margin-right: 10px;"
                  show-search
                  v-model="record.piItemName"
                  placeholder="请输入选择商品名称"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleGetProductValueSearch"
                  @change="() => handleLeftChange(record.piItemName, record.key, 'piItemName', record.id)"
                >
                  <a-select-option v-for="item in leftBox.getProductValueOption" :key="item.id" :value="item.itemName+'+'+item.id+'+'+item.itemCode+'+'+item.whId+'+'+item.whCode+'+'+item.itemId">
                    {{ item.itemName }}
                  </a-select-option>
                </a-select>
                <span v-else>{{record.piItemName}}</span>
              </template>
            </a-table-column>
            <a-table-column title="入库时间" data-index="inDate" :width="170"></a-table-column>
            <a-table-column :title="flag == 'details' ? '领取数量' : getNumIcon" data-index="pickingNum" :width="100">
              <template slot-scope="text, record">
                <a-input
                  v-if="flag == 'details' ? false : true"
                  v-model="record.pickingNum"
                  placeholder="必填"
                  style="width: 100%"
                  @change="() => handleLeftChange(record.pickingNum, record.key, 'pickingNum', record.id)">
                </a-input>
                <span v-else>{{record.pickingNum}}</span>
              </template>
            </a-table-column>
            <a-table-column :title="flag == 'details' ? '单位' : unitIcon" data-index="unit" :width="110">
              <template slot-scope="text, record">
                <div :key="record.unit">
                  <span>{{record.unit}}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="备注" data-index="remark" :width="300">
              <template slot-scope="text, record">
                <a-input
                  v-if="flag == 'details' ? false : true"
                  v-model="record.remark"
                  style="width: 100%"
                  @change="() => handleLeftChange(record.remark, record.key, 'remark', record.id)">
                </a-input>
                <span v-else>{{record.remark}}</span>
              </template>
            </a-table-column>
            <a-table-column v-if="flag == 'details' ? false : true" title="操作" fixed='right' data-index="operation" :width="90" align='center'>
              <template slot-scope="text, record">
                <a-button class="greenfont redfonthover" type="link" icon='minus-circle' @click="deleteLeftItem(record.id)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
        <a-col class="colStyle colBorder" :span="12">
          <p class="pTittle">产成品清单</p>
          <p v-if="flag == 'details' ? false : true" class="pSelete">
            <a-select
              style="width: 45%;margin-right: 10px;"
              show-search
              :value="rightBox.doneProductValue"
              placeholder="请输入选择商品名称"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleDoneProductValueSearch"
              @change="handleDoneProductValueOption"
            >
              <a-select-option v-for="item in rightBox.getProductValueOption" :key="item.id">
                {{ item.itemName }}
              </a-select-option>
            </a-select>
            <a-input class="inputStyle" placeholder="请输入数量" v-LimitInputNumber='rightBox.getNum' v-model="rightBox.getNum"></a-input>
            <a-button class="marginRight" type="primary" @click="addCommdityDone">添加</a-button>
          </p>
          <a-table
            :bordered="flag == 'details' ? false : true"
            ref="tableRef"
            :data-source="finishedProListTable"
            rowKey="id"
            :scroll="flag == 'details' ? {} : { x: 307.778 }"
            :pagination='false'
          >
            <a-table-column :title="flag == 'details' || finishedProListTable.length == 0 ? '产成品' : doneProductIcon" data-index="piItemName" :width="255">
              <template slot-scope="text, record">
                <a-select
                  v-if="flag == 'details' ? false : true"
                  style="width: 100%;margin-right: 10px;"
                  show-search
                  v-model="record.piItemName"
                  placeholder="请输入选择商品名称"
                  :default-active-first-option="false"
                  :filter-option="false"
                  :not-found-content="null"
                  :loading='rightBox.loadingSeleteRight'
                  @search="handleDoneProductValueSearch"
                  @change="() => handleRightChange(record.piItemName, record.key, 'piItemName', record.id)"
                >
                  <a-select-option v-for="item in rightBox.getProductValueOption" :key="item.id" :value="item.itemName+'+'+item.id+''+item.itemCode">
                    {{ item.itemName }}
                  </a-select-option>
                </a-select>
                <span v-else>{{record.piItemName}}</span>
              </template>
            </a-table-column>
            <a-table-column :title="flag == 'details' || finishedProListTable.length == 0 ? '预出产数' : doneNumIcon" data-index="preProductionNum" :width="120">
              <template slot-scope="text, record">
                <a-input
                  v-if="flag == 'details' ? false : true"
                  v-model="record.preProductionNum"
                  placeholder="必填"
                  style="width: 100%"
                  @change="() => handleRightChange(record.preProductionNum, record.key, 'preProductionNum', record.id)">
                </a-input>
                <span v-else>{{record.preProductionNum}}</span>
              </template>
            </a-table-column>
            <a-table-column :title="flag == 'details' || finishedProListTable.length == 0 ? '单位' : unitIcon" data-index="unit" :width="150">
              <template slot-scope="text, record">
                <div :key="record.unit">
                  <a-select
                    v-if="flag == 'details' ? false : true"
                    v-model="record.unit"
                    placeholder="必填"
                    style="width: 100%"
                    @change="() => handleRightChange(record.unit, record.key, 'unit', record.id)">
                    <a-select-option v-for="(item,i) in rightBox.unitOption" :key="i" :value="item.dicText">
                      {{ item.dicText }}
                    </a-select-option>
                  </a-select>
                  <span v-else>{{record.unit}}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column v-if="flag == 'details' ? false : true" title="操作" fixed='right' data-index="operation" :width="90" align='center' >
              <template slot-scope="text, record">
                <a-button class="greenfont redfonthover" type="link" icon='minus-circle' @click="deleteRightItem(record.id)">删除</a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-col>
      </a-row>
      <a-row>
        <p class="flex-ed submitBtn">
          <a-button v-if="flag == 'details' ? false : true" class="btnMarginRight" type="primary" @click="cancelBtn">取消</a-button>
          <a-button v-if="flag == 'pickerOk'" type="primary" @click="okBtn">确认领料</a-button>
          <a-button v-else type="primary" @click="okBtn">{{ flag == 'details' ? '关闭' : flag == 'add' ? '确定' : '保存' }}</a-button>
        </p>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import {
  getCommodityName,
  doneCommodityName,
  unitList,
  getPickerName,
  pickingHeadInsert,
  pickingHeadUpdate,
  pickingHeadConfirm
} from '@/services/materialRequisition.js'
import { throttle } from "../../utils/tool";
export default {
  name: "modalNewAdd",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      visibleLModal: false,
      flag: 'add',
      unitIcon: () => {return <span class='redfont'>* <span class="greyfont">单位</span></span>},
      getNumIcon: () => {return <span class='redfont' >* <span class="greyfont">领取数量</span></span>},
      getProductIcon: () => {return <span class='redfont'>* <span class="greyfont">领料商品</span></span>},
      doneProductIcon: () => {return <span class='redfont'>* <span class="greyfont">产成品</span></span>},
      doneNumIcon: () => {return <span class='redfont'>* <span class="greyfont">预出产数</span></span>},
      pickerBox: {
        id: [],
        name: [],
        remark: undefined
      },
      getPickerNameValue: undefined,
      pickerNameOption: [],
      finishedProListTable: [],
      unfinishedProListTable: [],
      leftBox: {
        getProductValue: undefined,
        getProductValueOption: [],
        getProductValueMaterial: undefined,
        getNum: undefined,
        uselyNum: undefined,
        unitOption: [],
        loadingSeleteLeft: true
      },
      rightBox: {
        doneProductValue: undefined,
        getProductValueOption: [],
        getProductValueMaterial: undefined,
        getNum: undefined,
        unitOption: [],
        loadingSeleteRight: true
      },
      editRightFlag: false,
      deleteDataRight: [],
      deleteDataLeft: [],
      parentId: undefined,
      allMsg: undefined,
      pickerOkId: undefined
    }
  },
  methods: {
    openModal(flag, allMsg) {
      this.getCommodityName()
      this.doneCommodityName()
      this.parentId = undefined
      this.flag = flag
      this.editRightFlag = false
      this.visibleLModal = true
      this.getPickerNameValue = []
      this.pickerBox.id = []
      this.pickerBox.name = []
      this.pickerBox.remark = undefined
      this.finishedProListTable = []
      this.unfinishedProListTable = []
      this.deleteDataRight = []
      this.deleteDataLeft = []
      this.leftBox.uselyNum = undefined
      this.allMsg = undefined
      this.pickerOkId = undefined
      if (flag == 'details') {
        this.getPickerNameValue = allMsg.pickingUserName
        this.pickerBox.remark = allMsg.remark
        this.finishedProListTable = allMsg.finishedProList
        this.unfinishedProListTable = allMsg.unfinishedProList
      } else if (flag == 'edit' || flag == 'pickerOk') {
        this.pickerOkId = allMsg.id
        this.allMsg = this.$parent.deepClone(allMsg)
        this.pickerBox.id = this.$parent.deepClone(String(allMsg.pickingUserId)?.split(','))
        this.pickerBox.name = this.$parent.deepClone(allMsg.pickingUserName?.split(','))
        this.pickerBox.name?.map( (item,i) => {this.getPickerNameValue[i] = item+'+'+this.pickerBox.id[i]} )
        this.pickerBox.remark = this.$parent.deepClone(allMsg.remark)
        this.finishedProListTable = this.$parent.deepClone(allMsg.finishedProList)
        this.unfinishedProListTable = this.$parent.deepClone(allMsg.unfinishedProList)
        this.finishedProListTable?.map(item => item.flag = '3')
        this.unfinishedProListTable?.map(item => item.flag = '3')
      }
    },
    cancelModalBtn() {
      this.visibleLModal = false;
    },
    getPickerName() {
      getPickerName({name: ''}).then(
        res => {
          if (res.data.code == '200') {
            this.pickerNameOption = res.data.data
          }
        }
      )
    },
    getCommodityName() {
      const params = {
        rows: 50,
        page: 1,
        sort: "id",
        order: "DESC",
        itemCode: "",
        itemName: ""
      }
      this.leftBox.loadingSeleteLeft = true
      getCommodityName(params).then(
        res => {
          if (res.data.code == '200') {
            this.leftBox.getProductValueOption = res.data.data
            this.leftBox.loadingSeleteLeft = false
          } else {
            this.leftBox.loadingSeleteLeft = false
          }
        }
      ).catch(() => this.leftBox.loadingSeleteLeft = false)
    },
    doneCommodityName() {
      const params = {
        rows: 50,
        page: 1,
        sort: "id",
        order: "DESC",
        itemFlag: '2',
      }
      this.rightBox.loadingSeleteRight = true
      doneCommodityName(params).then(
        res => {
          this.rightBox.getProductValueOption = res.data.rows
          this.rightBox.loadingSeleteRight = false
        }
      ).catch(() => this.rightBox.loadingSeleteRight = false)
    },
    getUnit() {
      unitList({type: 10}).then(
        res => {
          if (res.data.code == '200') {
            this.leftBox.unitOption = res.data.data
            this.rightBox.unitOption = res.data.data
          }
        }
      )
    },
    handleGetProductValueSearch(value) {
      const params = {
        rows: 50,
        page: 1,
        sort: "id",
        order: "DESC",
        itemName: value,
      }
      getCommodityName(params).then(res => res.data.code == '200' && (this.leftBox.getProductValueOption = res.data.data))
    },
    handleGetProductValueOption(value) {
      this.leftBox.getProductValue = value
      this.leftBox.getProductValueMaterial = this.leftBox.getProductValueOption.find( item => { return item.id == value} )
      this.leftBox.uselyNum = this.leftBox.getProductValueOption.find( item => { return item.id == value} ).balance
    },
    handleDoneProductValueSearch(value) {
      const params = {
        rows: 50,
        page: 1,
        sort: "id",
        order: "DESC",
        likeItemName: value,
      }
      doneCommodityName(params).then(
        res => {
          this.rightBox.getProductValueOption = res.data.rows
        }
      )
    },
    handleDoneProductValueOption(value) {
      this.rightBox.doneProductValue = value
      this.rightBox.getProductValueMaterial = this.rightBox.getProductValueOption.find( item => { return item.id == value} )
    },
    addCommdityGet() {
      if (!this.leftBox.getProductValueMaterial) {
        this.$message.warn('请先选择商品')
        return
      }
      if (this.leftBox.getNum == undefined) {
        this.$message.warn('请先填写数量')
        return
      }
      let commodity = {
        id: this.leftBox.getProductValueMaterial.id,
        piItemFlag: '1',
        piItemId: this.leftBox.getProductValueMaterial.itemId,
        lotId: this.leftBox.getProductValueMaterial.id,
        piItemName: this.leftBox.getProductValueMaterial.itemName,
        piItemNo: this.leftBox.getProductValueMaterial.itemCode,
        piItemSpec: this.leftBox.getProductValueMaterial.itemSpec,
        piItemPrice: this.leftBox.getProductValueMaterial.poPrice,
        inDate: this.leftBox.getProductValueMaterial.inDate,
        pickingNum: this.leftBox.getNum,
        unit: this.leftBox.getProductValueMaterial.measureUnit === ''? undefined : this.leftBox.getProductValueMaterial.measureUnit,
        remark: undefined,
        stockNum: this.leftBox.getProductValueMaterial.balance,
        piStockId: this.leftBox.getProductValueMaterial.whId,
        piStockName: '',
        piStockCode: this.leftBox.getProductValueMaterial.whCode,
      }
      if (this.unfinishedProListTable.some(item => {return item.piItemId == commodity.id} )) {
        this.$message.warn('该商品已存在')
        return
      }
      if (this.flag == 'edit' || this.flag == 'pickerOk') commodity.flag = '1'
      this.unfinishedProListTable.push(commodity)
      this.leftBox.uselyNum = undefined
      this.leftBox.getProductValue = undefined
      this.leftBox.getNum = undefined
      this.leftBox.getProductValueMaterial = undefined
    },
    addCommdityDone() {
      if (!this.rightBox.getProductValueMaterial) {
        this.$message.warn('请先选择商品')
        return
      }
      if (this.rightBox.getNum == undefined) {
        this.$message.warn('请先填写数量')
        return
      }
      let commodity = {
        id: this.rightBox.getProductValueMaterial.id,
        piItemFlag: '2',
        piItemId: this.rightBox.getProductValueMaterial.id,
        piItemName: this.rightBox.getProductValueMaterial.itemName,
        piItemNo: this.rightBox.getProductValueMaterial.itemCode,
        preProductionNum: this.rightBox.getNum,
        unit: this.rightBox.getProductValueMaterial.defUom === '' ? undefined : this.rightBox.getProductValueMaterial.defUom,
      }
      if (this.finishedProListTable.some(item => item.piItemId == commodity.id)) {
        this.$message.warn('该商品已存在')
        return
      }
      if (this.flag == 'edit' || this.flag == 'pickerOk') commodity.flag = '1'
      this.finishedProListTable.push(commodity)
      this.rightBox.doneProductValue = undefined
      this.rightBox.getNum = undefined
      this.rightBox.getProductValueMaterial = undefined
    },
    editRightBtn() { this.editRightFlag = !this.editRightFlag },
    deleteRightItem(id) {
      this.finishedProListTable.some(
        (item,i) => {
          if (this.flag == 'edit' || this.flag == 'pickerOk') {
            if (item.flag == '1' && item.id == id) {
              return this.finishedProListTable.splice(i,1)
            } else if (item.flag == '3' && item.id == id) {
              item.flag = '2'
              this.deleteDataRight.push(item)
              return this.finishedProListTable.splice(i,1)
            }
          } else if (this.flag == 'add' && item.id == id){
            return this.finishedProListTable.splice(i,1)
          }
        }
      )
    },
    deleteLeftItem(id) {
      this.unfinishedProListTable.some(
        (item,i) => {
          if (this.flag == 'edit' || this.flag == 'pickerOk') {
            if (item.flag == '1' && item.id == id) {
              return this.unfinishedProListTable.splice(i,1)
            } else if (item.flag == '3' && item.id == id) {
              item.flag = '2'
              this.deleteDataLeft.push(item)
              return this.unfinishedProListTable.splice(i,1)
            }
          } else if (this.flag == 'add' && item.id == id) {
            return this.unfinishedProListTable.splice(i,1)
          }
        }
      )
    },
    handleLeftChange(value, key, column, id=0) {
      let keyId = id
      this.unfinishedProListTable.find((item,i) => {
        if (item.id == id) {
          keyId = i
        }
      })
      const newData = [...this.unfinishedProListTable]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        if (value.includes('+') && this.unfinishedProListTable.some(item => item.piItemId == value.split('+')[1])) {
          target[column] = undefined
          this.$message.warn(value.split('+')[0]+'已存在')
          return
        }
        target[column] = value.includes('+') ? value.split('+')[0] : value
        if (value.includes('+')) {
          target.itemId = value.split('+')[1]
          target.lotId = value.split('+')[1]
          target.piItemNo = value.split('+')[2]
          target.piStockId = value.split('+')[3]
          target.piStockCode = value.split('+')[4]
          target.piItemId = value.split('+')[5]
        }
        this.unfinishedProListTable = newData
      }
    },
    handleRightChange(value, key, column, id=0) {
      let keyId = id
      this.finishedProListTable.find((item,i) => {
        if (item.id == id) {
          keyId = i
        }
      })
      const newData = [...this.finishedProListTable]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        if (value.includes('+') && this.finishedProListTable.some(item => item.piItemId == value.split('+')[1])) {
          target[column] = undefined
          this.$message.warn(value.split('+')[0]+'已存在')
          return
        }
        target[column] = value.includes('+') ? value.split('+')[0] : value
        if (value.includes('+')) {
          target.piItemId = value.split('+')[1]
          target.piItemNo = value.split('+')[2]
        }
        this.finishedProListTable = newData
      }
    },
    cancelBtn() {
      this.visibleLModal = false
    },
    addFun (params) {
      pickingHeadInsert(params).then(
        res => {
          if (res.data.code == '200') {
            this.$parent.pagination.page = 1
            this.$parent.submitPagination()
            this.$message.success(res.data.message)
            this.visibleLModal = false
          } else {
            this.$message.warn(res.data.message)
          }
        }
      ).catch(e => this.$message.error('异常错误' + e))
    },
    editFun(params) {
      pickingHeadUpdate(params).then(
        res => {
          if (res.data.code == '200') {
            this.$parent.submitPagination()
            this.$message.success(res.data.message)
            this.visibleLModal = false
          } else {
            this.$message.warn(res.data.message)
          }
        }
      ).catch(e => this.$message.error('异常错误' + e))
    },
    submitTableBtn: throttle(function() {
      if (this.flag == 'details') {
        this.visibleLModal = false
        return
      }
      if (this.getPickerNameValue && this.getPickerNameValue !== "" && this.getPickerNameValue.length != 0) {
        this.pickerBox.name = []
        this.pickerBox.id = []
        this.getPickerNameValue.map(
          item => {
            this.pickerBox.name.push(item.split('+')[0])
            this.pickerBox.id.push(item.split('+')[1])
          }
        )
      } else {
        this.$message.warn('领料员必填...')
        return
      }
      if (this.unfinishedProListTable.length == 0) {
        this.$message.warn('领料单商品至少有一项')
        return
      }
      if (this.unfinishedProListTable.some(item => {return item.piItemName == undefined || item.unit == undefined || item.pickingNum == undefined})) {
        this.$message.warn('领料单商品的必填项,存在未填写项')
        return
      }
      if (this.finishedProListTable.some(item => {return item.piItemName == undefined || item.unit == undefined || item.preProductionNum == undefined})) {
        this.$message.warn('产成品清单的必填项,存在未填写项')
        return
      }
      const params = {
        pickingUserId: this.pickerBox.id.join(','),
        pickingUserName: this.pickerBox.name.join(','),
        remark: this.pickerBox.remark,
        unfinishedProList: this.unfinishedProListTable.concat(this.deleteDataLeft),
        finishedProList: this.finishedProListTable.concat(this.deleteDataRight),
      }
      if (this.flag == 'edit' || this.flag == 'pickerOk') { params.id= this.parentId }
      if (this.flag == 'add') {
        this.addFun(params)
      } else if (this.flag == 'edit' || this.flag == 'pickerOk') {
        this.allMsg.pickingUserId= this.pickerBox.id.join(','),
        this.allMsg.pickingUserName= this.pickerBox.name.join(','),
        this.allMsg.remark= this.pickerBox.remark,
        this.allMsg.unfinishedProList= this.unfinishedProListTable.concat(this.deleteDataLeft),
        this.allMsg.finishedProList= this.finishedProListTable.concat(this.deleteDataRight)
        if (this.flag == 'edit') {
          this.editFun(this.allMsg)
        } else {
          this.pickerOkBtn(this.allMsg)
        }
      }
    },3500),
    pickerOkBtn(params) {
      pickingHeadConfirm(params).then(
        res => {
          if (res.data.code == 200) {
            this.$parent.submitPagination()
            this.visibleLModal = false
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message, 3)
          }
        }
      )
    },
    okBtn() {
      this.submitTableBtn()
    }
  },
  activated() {
    this.getPickerName()
    this.getCommodityName()
    this.doneCommodityName()
    this.getUnit()
  },
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
  /deep/ .ant-modal-body {
    padding-bottom: 0px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .rowSelete {
      margin-bottom: 4px;
      .rowSeletSpan {
        padding-left: 15px;
        color: #000000d9;
      }
    }
    .colBorder {
      border: @border-color;
    }
    .colStyle {
      width:49.6%;
      margin-right: 5px;
      .ant-btn-link{
        margin: 0;padding: 0px 4px;
      }
      /deep/.ant-btn > .anticon + span {
        margin-left: 0;
      }
      .pTittle {
        margin-bottom: 0;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        border-bottom: @border-color;
        background-color: @common-bgc;
      }
      .pSelete {
        margin-bottom: 0;
        padding-left: 4px;
        height: 46px;
        line-height: 46px;
        .inputStyle {
          width: 20%;
          margin-right: 10px;
        }
        .marginRight {
          margin-right: 10px;
        }
      }
    }
    .submitBtn {
      margin-bottom: 0;
      height: 50px;
      line-height: 50px;
      .btnMarginRight {
        margin-right: 10px;
      }
    }
  }
}
</style>