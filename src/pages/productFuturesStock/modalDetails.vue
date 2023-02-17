<template>
  <a-modal class="modalTop" :width='1240' :title="allMsg.flag == 'inStock' ? '入库明细' : '出库明细' " :dialogStyle="{'top': '30px'}" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="tableContainer">
        <div class="addBox">
          <p class="pTittle fontWeight">明细列表</p>
          <p class="pSelete">
            <span class="fontWeight">{{allMsg.flag == 'inStock' ? '入库类型' : '出库类型'}}&nbsp;</span>
            <a-select
              class="selectStyle"
              show-search
              v-model="form.transType"
              placeholder="请选择类型"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
            >
              <a-select-option v-for="item in allMsg.flag == 'inStock' ? option.inStock : option.outStock" :key="item.dicCode">
                {{ item.dicText }}
              </a-select-option>
            </a-select>
            <span class="fontWeight">采购供应商&nbsp;</span>
            <a-select
              class="selectStyle"
              show-search
              :value="form.supplierName"
              placeholder="请搜索选择供应商名称"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="handleSupplierSearch"
              @change="handleSupplierOption"
            >
              <a-select-option v-for="item in supplierNameOption" :key="item.id + '+' + item.partnerName">{{ item.partnerName }}</a-select-option>
            </a-select>
            <a-button type="primary" style="margin-right: 10px;" icon="sync" @click="clearForm">清空</a-button>
            <a-button type="primary" icon="search" @click="searchInfo">查询</a-button>
          </p>
        </div>
        <a-table
          bordered
          ref="tableRef"
          :columns="allMsg.flag == 'inStock' ? inStockColumns : outStockColumns"
          :data-source="inStockDetails"
          rowKey="id"
          :pagination='{showTotal: ()=>`共 ${pagination.total} 条`, showSizeChanger: true, showQuickJumper: pagination.total > 2000}'>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            合计: <span v-if="allMsg.flag == 'inStock'">
                    <span class="greyfont">入库数量</span>(<span class="redfont">{{ currentPageData.reduce((t, c) => { return (+t + +c.qty).toFixed(8)*100000000/100000000 || undefined }, 0) }}</span>)<a-divider type="vertical" />
                  </span>
                  <span v-else>
                    <span class="greyfont">出库数量</span>(<span class="redfont">{{ currentPageData.reduce((t, c) => { return (+t + +c.qty).toFixed(8)*100000000/100000000 || undefined }, 0) }}</span>)<a-divider type="vertical" />
                    <span class="greyfont">损耗数量</span>(<span class="redfont">{{ currentPageData.reduce((t, c) => { return (+t + +c.lossQty).toFixed(8)*100000000/100000000 || undefined }, 0) }}</span>)<a-divider type="vertical" />
                  </span>
          </template>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button type='primary' @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
  </a-modal>
</template>

<script>
const inStockColumns = [
  {title: '日期', dataIndex: 'createDate'},
  {title: '商品名称', dataIndex: 'itemName'},
  {title: '商品编码', dataIndex: 'itemCode'},
  {title: '规格', dataIndex: 'spec'},
  {title: '计价单位', dataIndex: 'priceUnit'},
  {title: '入库类型', dataIndex: 'transTypeName'},
  {title: '入库数量', dataIndex: 'qty'},
  {title: '采购价格', dataIndex: 'poPrice'},
  {title: '采购供应商', dataIndex: 'supplierName'},
]
const outStockColumns = [
  {title: '日期', dataIndex: 'createDate'},
  {title: '商品名称', dataIndex: 'itemName'},
  {title: '商品编码', dataIndex: 'itemCode'},
  {title: '规格', dataIndex: 'spec'},
  {title: '计价单位', dataIndex: 'priceUnit'},
  {title: '出库类型', dataIndex: 'transTypeName'},
  {title: '出库数量', dataIndex: 'qty'},
  {title: '损耗数量', dataIndex: 'lossQty'},
  {title: '采购价格', dataIndex: 'poPrice'},
  {title: '采购供应商', dataIndex: 'supplierName'},
]
import { partnerType } from "@/services/userMa.js";
import {
  detailsInStock,
  detailsOutStock,
  transType
} from '@/services/enterSaleStore/store/productFuturesStock'
export default {
  name: "modalPrintOutboundOrder",
  data() {
    return {
      visibleLModal: false,
      allMsg: {
        flag: 'inStock',
        id: undefined
      },
      form: {
        supplierName: undefined,
        transType: undefined
      },
      supplierNameOption: [],
      supplierNameMaterial: undefined,
      option: {
        outStock: [],
        inStock: []
      },
      inStockDetails: [],
      inStockColumns,
      outStockColumns,
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
    }
  },
  methods: {
    details(obj) {
      let params = {
        reportId: this.allMsg.id,
        page: 1,
        sort: 'id',
        order: 'desc'
      }
      params = this.typeis(obj) == 'object' ? Object.assign(params,obj) : params
      this.allMsg.flag == 'inStock' ?
      detailsInStock(params).then( res => this.inStockDetails = res.data.rows ) :
      detailsOutStock(params).then( res => this.inStockDetails = res.data.rows )
    },
    openModal(flag, id) {
      this.allMsg.flag = flag
      this.allMsg.id = id
      this.clearForm()
      this.details()
      this.visibleLModal = true;
    },
    getTransType(num,type) {
      transType({type: num}).then(
        res => {
          if (res.data.code == '200' && type == 'inStock') {
            this.option.inStock = res.data.data
          } else if (res.data.code == '200') {
            this.option.outStock = res.data.data
          }
        }
      )
    },
    getSupplierName() {
      partnerType({partnerName: '',partnerType: 30}).then(
        res => {
          if (res.data.code == '200') {
            this.supplierNameOption = res.data.data
          }
        }
      )
    },
    handleSupplierSearch(value) {
      partnerType({partnerName: value, partnerType: 30}).then(
        res => {
          if (res.data.code == '200') {
            this.supplierNameOption = res.data.data
          }
        }
      )
    },
    handleSupplierOption(value) {
      this.form.supplierName = value
      this.supplierNameMaterial = this.supplierNameOption.find( item => { return item.id == value} )
    },
    clearForm() {
      this.form.supplierName = undefined
      this.form.transType = undefined
    },
    searchInfo() {
      const params = {
        transType: this.form.transType,
        supplierId: this.form.supplierName?.split('+')[0],
        supplierName: this.form.supplierName?.split('+')[1],
      }
      this.details(params)
    },
    closeModalBtn() {
      this.visibleLModal = false;
    },
  },
  activated() {
    this.getTransType(25,'inStock')
    this.getTransType(26)
    this.getSupplierName()
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
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .fontWeight {
      font-weight: 600;
    }
    .selectStyle {
      width: 24%;
      margin-right: 10px;
      font-weight: normal;
    }
    .inputStyle {
      width: 22%;
      margin-right: 20px;
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .addBox {
        .pSelete {
          margin-bottom: 0;
          padding-left: 20px;
          height: 46px;
          line-height: 46px;
          font-weight: 600;
        }
      }
      .pTittle {
        margin-bottom: 0;
        padding-left: 15px;
        height: 30px;
        line-height: 30px;
        background-color: @common-bgc;
      }
    }
  }
}
</style>