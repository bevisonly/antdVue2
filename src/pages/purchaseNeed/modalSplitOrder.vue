<template>
    <a-modal :width='1160' :dialogStyle="{'top': '30px'}" v-model="visibleSplitOrder" title="转采购单拆单" :maskClosable='false' okText="确定" @ok="handleOk" @cancel='cancelModalForm'>
      <div class="mainContainer">
        <div class="topMsgShow">
          <a-row class="topRow">
            <a-col :span="8" class="topCol"><span class="topColSpan">商品名称:&nbsp;</span><span class="topColSpanRgiht">{{ baseInfo.commodityName }}</span></a-col>
            <a-col :span="3" class="topCol"><span class="topColSpan">规格:&nbsp;</span><span class="topColSpanRgiht">{{ baseInfo.specs }}</span></a-col>
            <a-col :span="9" class="topCol"><span class="topColSpan">计价单位:&nbsp;</span><span class="topColSpanRgiht">{{ baseInfo.priceUnit }}</span></a-col>
            <a-col :span="4" class="topCol flex-ed centerMsgShow redfont">剩余可拆订单数量：<span class="topTipsMsg">{{ baseInfo.parentWeight }}</span></a-col>
          </a-row>
        </div>
        <div class="bottomOperation">
          <a-row class="bottomRow" v-for="(item,i) in splitOrder" :key="i">
            <a-col :span="2">
              <p class="bottomColP">新增</p>
              <a-button-group>
                <a-button size='small' icon='plus'  type="primary" title="增加一条" v-if="i == splitOrder.length-1 ? true : false" @click="addList"></a-button>
                <a-button size='small' icon='minus' type="primary" title="删除" @click="deleteList(i)"></a-button>
              </a-button-group>
            </a-col>
            <a-col :span="6">
              <p class="bottomColP">供应商名称:</p>
              <a-select
                style="width: 240px"
                placeholder="请输入供应商名称"
                v-model="item.partnerName"
                @select="handleChangeOption"
                show-search
                :filter-option="filterOption"
                >
                <a-select-option v-for="val in supplierNameList" :key="val.id" :value="val.id">
                  {{ val.partnerName }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="3">
              <p class="bottomColP">拆订单数量:</p>
              <a-input-number
                v-if="item.priUnit == '公斤' || item.priUnit == '斤' || item.priUnit == 'kg' || item.priUnit == 'g'"
                :min='0'
                v-model="item.poQty"/>
              <a-input-number v-else v-model="item.poQty" :min='0' :precision='0'/>
            </a-col>
            <a-col :span="7">
              <p class="bottomColP">供应商收货地址:</p><p class="bottomColPdown">{{item.address}}</p>
            </a-col>
            <a-col :span="4">
              <p class="bottomColP">供应商联系手机:</p><p class="bottomColPdown">{{item.contactPhone}}</p>
            </a-col>
            <a-col :span="2" class="flex-ed">
              <a-button size='small' type="primary" title="包装选择" style="margin-left: 6px;" @click="selectPackage(i)">选择包装</a-button>
            </a-col>
          </a-row>
        </div>
      </div>
      <modalPackageSelect ref="modalPackageSelectRef"></modalPackageSelect>
    </a-modal>
</template>
<script>
import { partnerList2 } from "@/services/reportSettlementMa.js";
import { partnerType } from "@/services/userMa.js"
import modalPackageSelect from './modalPackageSelect'
import { throttle } from "../../utils/tool";
export default {
  name: 'modalSplitOrder',
  components: { modalPackageSelect },
  data() {
    return {
      visibleSplitOrder: false,
      supplierForm: {
        supplier: '',
      },
      valueOption: undefined,
      supplierNameList: [],
      supplierMaterial: [],
      splitOrder: [],
      baseInfo: {
        commodityName: '',
        specs: '',
        priceUnit: '',
        parentWeight: ''
      },
      rowDataMerge: '',
      sendSplitOrderDataToModalFormTableDataFun: '',
      parentTopId: '',
      parentTopAllInfo: '',
    }
  },
  methods: {
    openDailog(ultimateParentId,parentQty,sendSplitOrderDataToModalFormTableDataFun,parentAllInfo,id) {
      this.parentTopId = id
      this.parentTopAllInfo = parentAllInfo
      this.sendSplitOrderDataToModalFormTableDataFun = sendSplitOrderDataToModalFormTableDataFun
      this.visibleSplitOrder = true
      this.baseInfo.parentId = id
      this.baseInfo.commodityName = parentAllInfo.itemName ? parentAllInfo.itemName : '-'
      this.baseInfo.specs = parentAllInfo.specs ? parentAllInfo.specs : '-'
      this.baseInfo.priceUnit = parentAllInfo.priceUnit ? parentAllInfo.priceUnit : '-'
      this.baseInfo.parentWeight = parentQty
      this.baseInfo.ultimateParentId = ultimateParentId
      this.splitOrder = [{
        supplierName: parentAllInfo.supplierName ? parentAllInfo.supplierName : '',
        deliveryAdress: parentAllInfo.deliveryAdress ? parentAllInfo.deliveryAdress : '',
        supplierPhone: parentAllInfo.supplierPhone ? parentAllInfo.supplierPhone : '',
        priUnit: parentAllInfo.priceUnit ? parentAllInfo.priceUnit : '',
        poQty: parentQty,
      }]
    },
    getSelectValue() {
      const params = {
        partnerType : 30,
        isEnable: 1
      };
      partnerList2(params).then((res) => {
        if (res.data.code == 200) {
          this.supplierNameList = res.data.data
        }
      });
    },
    handleSearch(value) {
      const params = {
        partnerType: 30,
        partnerName: value || '',
        isEnable: 1
      }
      partnerType(params).then((res) => {
        this.supplierNameList = res.data.data
      })
    },
    handleChangeOption(value) {
      let splitOrderDetail = {}
      this.valueOption = value;
      this.supplierMaterial = this.supplierNameList.find( item => { return item.id == value} )
      splitOrderDetail.partnerName= this.supplierMaterial.partnerName
      splitOrderDetail.supplierId= this.supplierMaterial.id
      splitOrderDetail.poQty= this.splitOrder[this.splitOrder.length - 1].poQty
      splitOrderDetail.address= this.supplierMaterial.address
      splitOrderDetail.contactPhone= this.supplierMaterial.contactPhone
      splitOrderDetail.addFlag= true
      this.splitOrder.splice(this.splitOrder.length - 1, 1, splitOrderDetail)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    addList() {
      let newSplitOrder = {
        splitOrderId: this.splitOrder.length,
        partnerName: '',
        roQty: '',
        address: '',
        contactPhone: '',
        addFlag: true
      }
      this.splitOrder.push(newSplitOrder)
    },
    savaPackageInfoFun(packageInfo) {
      this.splitOrder.forEach(
        (item,i) => {
          if (i == this.rowDataMerge) {
            item.pkgDetails = packageInfo
          }
        }
      )
    },
    selectPackage(rowDataIndex) {
      this.rowDataMerge = rowDataIndex
      this.splitOrder.forEach(
        (item,i) => {
          if (item.pkgDetails && rowDataIndex == i) {
            this.$refs.modalPackageSelectRef.openModal('',item.pkgDetails,this.savaPackageInfoFun);
          } else {
            this.$refs.modalPackageSelectRef.openModal('','',this.savaPackageInfoFun);
          }
        }
      )
    },
    deleteList(i) {
      this.splitOrder.splice(i,1)
    },
    handleOkThrottle: throttle(function() {
      let remainder = this.splitOrder.reduce( (total, currentValue) => { return total + currentValue.poQty }, 0 )
      let remainderTip = remainder - Number(this.baseInfo.parentWeight)
      let parentPoQty = this.baseInfo.parentWeight - remainder
      if (remainderTip > 0) {
        this.$message.warn('已经超过最大限度的可拆单量...')
        return
      }
      let timeSubstr = new Date().getTime().toString()
      this.splitOrder.forEach(
        (item,i) => {
          item.supplierName = item.partnerName
          item.deliveryAdress = item.address
          item.supplierPhone = item.contactPhone
          item.id = this.parentTopAllInfo.id + i + (timeSubstr.substr(-4))
          item.ultimateParentId = this.parentTopAllInfo.ultimateParentId
          item.itemId = this.parentTopAllInfo.itemId
          item.itemName = this.parentTopAllInfo.itemName
          item.itemSpec = this.parentTopAllInfo.itemSpec
          item.roCode = this.parentTopAllInfo.roCode
          item.poQty = Math.round(item.poQty)
          item.soQty = this.parentTopAllInfo.soQty
          item.soDetailId = this.parentTopAllInfo.id
          item.poPrice = this.parentTopAllInfo.poPrice
          item.priceUnit = this.parentTopAllInfo.priceUnit
          item.unit = this.parentTopAllInfo.unit
          item.sumQty = this.parentTopAllInfo.sumQty
          item.soId = this.parentTopAllInfo.soId
          item.soIds = this.parentTopAllInfo.soIds
          item.commonIdForSupplier = this.parentTopAllInfo.id
          item.soCode = this.parentTopAllInfo.soCode
          item.stock = this.parentTopAllInfo.stock
          item.customerName = this.parentTopAllInfo.customerName
          item.storeName = this.parentTopAllInfo.storeName
          item.salePrice = this.parentTopAllInfo.salePrice ? this.parentTopAllInfo.salePrice : ''
          item.btnDeleteFlag = 1
          item.flag = 2
          if (!item.pkgDetails) {
            item.pkgDetails = []
          }
        }
      )
      for (let i = 0; i < this.splitOrder.length; i++) {
        for (let j = i+1; j < this.splitOrder.length; j++) {
          if (this.splitOrder[i].supplierName === this.splitOrder[j].supplierName) {
            this.$message.warn("存在相同的供应商")
            return
          } 
        }
      }
      for (let i = 0; i < this.splitOrder.length; i++) {
        if (typeof(this.splitOrder[i].supplierName) == 'undefined' || this.splitOrder[i].poQty == 0) {
          this.$message.warn("存在供应商为空，或无效拆单数量的情况")
          return
        }
      }
      this.sendSplitOrderDataToModalFormTableDataFun(this.parentTopId,this.splitOrder,parentPoQty)
      this.splitOrder = []
      this.visibleSplitOrder = false
    },1000),
    handleOk() {
      this.handleOkThrottle()
    },
    cancelModalForm() {
      this.splitOrder = []
    }
  },
  created() {
    this.getSelectValue()
  },
  activated() {
    this.getSelectValue()
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/css/commonless';
.mainContainer {
  border: 1px solid #cccccc;
  padding: 10px 20px;
  .topMsgShow {
    .topRow {
      margin-bottom: 12px;
      .topCol {
        line-height: 32px;
        .topColSpan {
          color: black;
        }
        .topColSpanRgiht {
          background-color: #f7f7f7;
          padding: 0 2px;
          border-radius: 6px;
        }
        .topTipsMsg {
          font-size: 1.2em;
        }
      }
    }
  }
  .bottomOperation {
    border-top: 1px solid #e6e6e6;
    .bottomRow {
      margin-top: 10px;
      .bottomColP {
        margin: 0;
        color: black;
      }
      .bottomColPdown {
        margin-top: 6px;
      }
      //! 去除输入框的加减按钮
      /deep/.ant-input-number-handler-wrap{
        width: 0;
        height: 0;
      }
      .bottomColPInput {
        width: 90%;
      }
    }
  }
}
</style>