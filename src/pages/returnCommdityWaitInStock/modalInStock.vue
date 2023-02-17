<template>
  <a-modal class="modalTop" :width='1300' title="退货入库单" :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :destroyOnClose="true" :maskClosable="false" :footer="null">
    <div class="modalContainer">
      <div class="tittleBorder">
        <div class="tittleStyle">基本信息</div>
        <div class="formBox">
          <a-row>
            <a-col :span="6">
              <span><span class="redfont">*</span>入库仓库：</span>
              <a-select
                class="selectWidth"
                show-search
                :value="baseInfo.whName"
                placeholder="请选择入库仓库"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @change="handleChangeStock"
              >
                <a-select-option v-for="item in warehouseOption" :key="item.id" :value="item.id+'+'+item.whName">
                  {{ item.whName }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="18">
              <span>退货原因：</span>
              <a-input class="widthInput" placeholder="请输入退货原因" v-model="baseInfo.remark"/>
            </a-col>
          </a-row>
        </div>
      </div>
      <a-row class="rowStyle">
        <a-col :span="14">
          <div class="tableBox">
            <div class="flex-sb tittleStyle">
              <span>退货原料商品单</span>
              <a-tag>按原料入库</a-tag>
            </div>
            <p class="pSelete">
              <a-select
                style="width: 27%;margin-right: 10px;"
                show-search
                placeholder="请输入选择商品名称"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                :value="baseInfo.itemId"
                @search="searchItemName($event)"
                @change="changeItemName"
                @popupScroll='handlePopupScroll'
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <div style="padding: 0 8px 4px; cursor: pointer" @mousedown="(e) => e.preventDefault()">
                    <div style="text-align: center;padding-top: 4px;">
                      <a-spin v-show="spinning && itemNameOption[0]" />
                    </div>
                  </div>
                </div>
                <a-select-option v-for="item in itemNameOption" :key="item.id">
                  {{ item.itemName }}
                </a-select-option>
              </a-select>
              <a-input class="inputStyle" placeholder="请输入数量" v-LimitInputNumber v-model='baseInfo.returnQty'></a-input>
              <a-button class="marginRight" type="primary" @click="addCommdity">添加</a-button>
            </p>
            <a-table
              bordered
              size="middle"
              :data-source="leftTable"
              rowKey="id"
              :scroll="{ x: 307.778 }"
              :pagination='false'
            >
              <a-table-column title="原料商品" data-index="itemName" :width="280"></a-table-column>
              <a-table-column :title="iconNum" data-index="returnQty" :width="140">
                <template slot-scope="text, record">
                  <a-input v-model="record.returnQty"></a-input>
                </template>
              </a-table-column>
              <a-table-column :title="iconUnit" data-index="priceUnit" :width="140">
                <template slot-scope="text, record">
                  <div :key="record.priceUnit">
                    <a-select
                      v-model="record.priceUnit"
                      placeholder="必填"
                      style="width: 100%"
                      @change="() => handleLeftChange(record.priceUnit, record.key, 'priceUnit', record.id)">
                      <a-select-option v-for="(item,i) in unitOption" :key="i" :value="item.dicText">
                        {{ item.dicText }}
                      </a-select-option>
                    </a-select>
                  </div>
                </template>
              </a-table-column>
              <a-table-column title="备注" data-index="remark" :width="300">
                <template slot-scope="text, record">
                  <a-input v-model="record.remark"></a-input>
                </template>
              </a-table-column>
              <a-table-column title="操作" fixed='right' data-index="operation" :width="90" align='center' >
                <template slot-scope="text, record">
                  <a-button class="greenfont redfonthover" type="link" icon='minus-circle' @click="deleteLeftItem(record.id)">删除</a-button>
                </template>
              </a-table-column>
            </a-table>
          </div>
        </a-col>
        <a-col :span="10">
          <div class="tableBox marginLeft">
            <div class="flex-sb tittleStyle">
              <span>退货成品清单</span>
              <a-tag>按成品入库</a-tag>
            </div>
            <p class="pSelete">
            </p>
            <a-table
              bordered
              :data-source="rightTable"
              size="middle"
              rowKey="id"
              :scroll="{ x: 307.778 }"
              :pagination='false'
            >
              <a-table-column title="商品名称" data-index="itemName" :width="230">
              </a-table-column>
              <a-table-column :title="iconPreNum" data-index="returnQty" :width="140">
                <template slot-scope="text, record">
                  <a-input v-model="record.returnQty"></a-input>
                </template>
              </a-table-column>
              <a-table-column title="单位" data-index="priceUnit" :width="140"></a-table-column>
            </a-table>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <p class="flex-ed submitBtn">
          <a-button class="btnMarginRight" type="primary" @click="cancelBtn">取消</a-button>
          <a-button type="primary" @click="submitBtn">保存</a-button>
        </p>
      </a-row>
    </div>
  </a-modal>
</template>

<script>
import {
  unitList,
  inStockDetails,
  getWarehouse,
  getCommodity,
  returnConfirm
} from '@/services/transport/signed/returnCommdityWaitInStock'
import { debounce } from '../../utils/util';
import { throttle } from "../../utils/tool";
export default {
  name: "modalInStock",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      visibleLModal: false,
      iconNum: () => {return <span class='redfont'>* <span class="greyfont">退货数量</span></span>},
      iconPreNum: () => {return <span class='redfont'>* <span class="greyfont">退货数量</span></span>},
      iconUnit: () => {return <span class='redfont'>* <span class="greyfont">单位</span></span>},
      rightTable: [],
      leftTable: [],
      baseInfo: {
        whId: undefined,
        whName: undefined,
        remark: undefined,
        returnQty: undefined,
        itemId: undefined,
        itemNameMaterial: {},
        prodDate: undefined,
        itemSno: undefined
      },
      warehouseOption: [],
      itemNameOption: [],
      unitOption: [],
      paramsData: {},
      spinning: false,
      productSearchName: undefined,
      paginationSelect: {
        page: 1,
        rows: 100,
        total: 0,
      },
    }
  },
  methods: {
    deepClone(obj) {
      let objStorageBox = null;
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
    getInStockDetails(record) {
      let parmas = {
        id: record.id,
        imItemId: record.imItemId,
        imItemCode: record.imItemCode,
        sno: record.sno,
      }
      inStockDetails(parmas).then(res => {
        if (res.data.code == 200) {
          res.data?.data?.orderDetailDtoList?.forEach(res => res.itemType = 2)
          this.paramsData = this.deepClone(res.data?.data)
          this.rightTable = this.deepClone(res.data?.data?.orderDetailDtoList)
          this.baseInfo.prodDate = this.deepClone(res.data?.data?.orderDetailDtoList?.[0]?.prodDate)
          this.baseInfo.itemSno = this.deepClone(res.data?.data?.orderDetailDtoList?.[0]?.itemSno)
        } else {
          this.$message.warn('获取退货确认数据失败')
        }
      }).catch(() => this.$message.warn('获取退货确认数据失败'))
    },
    openModal(record) {
      this.paramsData = {}
      this.leftTable = []
      this.rightTable = []
      this.baseInfo.whId = this.warehouseOption[0]?.id
      this.baseInfo.whName = this.warehouseOption[0]?.whName
      this.baseInfo.remark = undefined
      this.baseInfo.returnQty = undefined
      this.baseInfo.itemId = undefined
      this.baseInfo.itemNameMaterial = {}
      this.baseInfo.prodDate = undefined
      this.baseInfo.itemSno = undefined
      this.getInStockDetails(record)
      this.visibleLModal = true
    },
    getWarehouse() {
      getWarehouse({}).then(res => {
        res.data.code == 200 ? this.warehouseOption = res.data.data : undefined
      })
    },
    getCommodity() {
      const params = {page: 1, rows: 100}
      getCommodity(params).then(res => {
        if (res.data.code == 200) {
          this.itemNameOption = res.data.data
          this.paginationSelect.total = res.data.totalPage || 0
        }
      })
    },
    getUnit() {
      unitList({type: 10}).then(res => this.unitOption = res.data.data)
    },
    handleChangeStock(value) {
      this.baseInfo.whId = value.split('+')[0]
      this.baseInfo.whName = value.split('+')[1]
    },
    handlePopupScroll(e) {
      if (e.target.scrollTop + e.target.offsetHeight > e.target.scrollHeight - 4) {
        if (this.paginationSelect.page >= this.paginationSelect.total) {
          return false;
        }
        this.spinning = true
        this.debounceSearchItemName(this.productSearchName || "", "srcoll");
      }
    },
    searchItemName(itemName) {
      this.debounceSearchItemName(itemName)
    },
    debounceSearchItemName: debounce(function (itemName, ifScroll){
      this.productSearchName = itemName
      this.paginationSelect.page = ifScroll ? this.paginationSelect.page + 1 : 1
      getCommodity({itemName, page: this.paginationSelect.page, rows: this.paginationSelect.rows}).then(res => {
        this.spinning = false
        if (res.data.code == 200) {
          this.itemNameOption = ifScroll ? this.itemNameOption.concat(res.data.data) : res.data.data
          this.paginationSelect.total = res.data.totalPage || 0
        } else {
          this.$message.error("获取商品选项列表失败")
        }
      }).catch(() => {
        this.spinning = false
        this.$message.error("获取商品选项列表失败")
      })
    },100),
    changeItemName(itemId) {
      this.baseInfo.itemId = itemId
      this.baseInfo.itemNameMaterial = this.itemNameOption.find( item => item.id == itemId )
    },
    addCommdity() {
      if (this.baseInfo.itemId == undefined) {
        this.$message.error('请先选择商品')
        return
      }
      if (this.leftTable.some(res => res.itemId == this.baseInfo.itemNameMaterial.id && res.itemName == this.baseInfo.itemNameMaterial.itemName )) {
        this.$message.error(`${this.baseInfo.itemNameMaterial.itemName}已存在,不可重复添加`)
        return
      }
      let newItem = {
        id: this.baseInfo.itemNameMaterial.id,
        itemId: this.baseInfo.itemNameMaterial.id,
        itemSno: this.baseInfo.itemSno,
        orgId: this.baseInfo.itemNameMaterial.orgId,
        prodDate: this.baseInfo.prodDate,
        itemName: this.baseInfo.itemNameMaterial.itemName,
        returnQty: this.baseInfo.returnQty,
        priceUnit: this.baseInfo.itemNameMaterial.defUom,
        itemType: 1,
        remark: undefined
      }
      this.leftTable.push(newItem)
      this.baseInfo.itemId = undefined
      this.baseInfo.itemNameMaterial = undefined
      this.baseInfo.returnQty = undefined
    },
    deleteLeftItem(id) {
      this.leftTable.some((res,i) => {
        if (res.id == id) {
          this.leftTable.splice(i,1)
          return true
        }
      })
    },
    handleLeftChange(value, key, column, id=0) {
      let keyId = id
      this.leftTable.find((item,i) => {
        if (item.id == id) keyId = i
      })
      const newData = [...this.leftTable]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = value
        this.leftTable = newData
      }
    },
    cancelBtn() {
      this.visibleLModal = false
    },
    submitBtn() {
      this.throttleSubmit()
    },
    throttleSubmit: throttle(function () {
      if (this.baseInfo.whId == undefined) {
        this.$message.error('请选择入库出库')
        return
      }
      if (this.leftTable.some(res => this.isUndef(res.returnQty, res.priceUnit))) {
        this.$message.error('原料退货数量/单位必填')
        return
      }
      if (this.rightTable.some(res => this.isUndef(res.returnQty))) {
        this.$message.error('退货成品数量必填')
        return
      }
      this.paramsData.orderDetailDtoList = []
      this.paramsData.orderDetailDtoList.push(...this.leftTable)
      this.paramsData.orderDetailDtoList.push(...this.rightTable)
      this.paramsData.whId = this.baseInfo.whId
      this.paramsData.whName = this.baseInfo.whName
      this.paramsData.remark = this.baseInfo.remark
      const params = this.paramsData
      returnConfirm(params).then(res => {
        if (res.data.code == 200) {
          this.$parent.submitPagination()
          this.$message.success("保存成功")
          this.visibleLModal = false
        } else {
          this.$message.error("保存失败")
        }
      }).catch(() => this.$message.error("保存失败"))
    },3500)
  },
  activated() {
    this.getWarehouse()
    this.getUnit()
  },
  created() {
    this.getCommodity()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.tittle() {
  margin: 0;
  padding-left: 15px;
  background-color: @common-bgc;
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: 800;
}
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
    .tittleBorder {
      border: @border-color;
      .tittleStyle {
        height: 40px;
        line-height: 40px;
        .tittle()
      }
      .formBox {
        padding: 10px 0px 10px 15px;
        .selectWidth {
          width: 210px;
        }
        .widthInput {
          width: 336px;
        }
      }
    }
    .rowStyle {
      margin-top: 10px;
      .tableBox {
        border: @border-color;
        min-height: 309px;
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
        .tittleStyle {
          height: 30px;
          line-height: 30px;
          .tittle()
        }
        .ant-btn-link{
          margin: 0;padding: 0px 4px;
        }
        /deep/.ant-btn > .anticon + span {
          margin-left: 0;
        }
      }
      .marginLeft {
        margin-left: 5px;
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