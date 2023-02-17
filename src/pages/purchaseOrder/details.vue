<template>
  <div class="modal">
    <a-spin :tip="spinText" :spinning="spinning">
      <a-modal title="采购订单详情" :visible="visible" :width="980" @cancel="handleCancel" destroyOnClose
        :maskClosable="false">
        <div class="details">
          <div class="info" v-if="modalType === 1">
            <p class="info-title">基本信息</p>
            <div class="info-form">
              <a-form :form="form">
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="需求编号">
                      <a-input readOnly v-model="form.roCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="销售单号">
                      <a-input readOnly v-model="form.soCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="供应商名称">
                      <a-input readOnly v-model="form.supplierName" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="供应商联系手机">
                      <a-input readOnly v-model="form.supplierPhone" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单编号">
                      <a-input readOnly v-model="form.poCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单提交时间">
                      <a-input readOnly v-model="form.poSubtime" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单提交人">
                      <a-input readOnly v-model="form.createUser" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款">
                      <a-input readOnly v-model="form.payAmount" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款比率(%)">
                      <a-input readOnly v-model="form.payAmountRatio" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款时间">
                      <a-input readOnly v-model="form.advanceTime" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="仓库">
                      <a-input readOnly v-model="form.whName" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="计划交货时间">
                      <a-input readOnly v-model="form.planDeliveryTime" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购员">
                      <a-input readOnly v-model="form.buyerName" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="12">
                    <a-form-item label="关联合同">
                      <a-input readOnly v-model="form.contractTitle" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <div class="info" v-if="modalType === 2">
            <p class="info-title">基本信息</p>
            <div class="info-form">
              <a-form :form="form">
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="供应商名称">
                      <a-input readOnly v-model="form.supplierName" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="代理公司名称">
                      <a-input readOnly v-model="form.agencyName" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="供应商联系手机">
                      <a-input readOnly v-model="form.supplierPhone" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="业务类型">
                      <a-input readOnly v-model="form.businessType" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="柜号">
                      <a-input readOnly v-model="form.containerCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="订单日期">
                      <a-input readOnly v-model="form.orderDate" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="交易方式">
                      <a-input readOnly v-model="form.transactionType" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="目的港">
                      <a-input readOnly v-model="form.purposeHarbor" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="开船日期">
                      <a-input readOnly v-model="form.sailDate" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预计到港日期">
                      <a-input readOnly v-model="form.expectArrivalDate" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="船名">
                      <a-input readOnly v-model="form.shipName" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="运输方式">
                      <a-input readOnly v-model="form.flowDirection" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="订单号">
                      <a-input readOnly v-model="form.orderCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="提单">
                      <a-input readOnly v-model="form.pickCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单编号">
                      <a-input readOnly v-model="form.poCode" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单提交时间">
                      <a-input readOnly v-model="form.createDate" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="采购订单提交人">
                      <a-input readOnly v-model="form.createUser" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款">
                      <a-input readOnly v-model="form.payAmount" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款比率(%)">
                      <a-input readOnly v-model="form.payAmountRatio" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款比例条款">
                      <a-input readOnly v-model="form.payAmountRatioTerm" />
                    </a-form-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-item label="预付款时间">
                      <a-input readOnly v-model="form.advanceTime" />
                    </a-form-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="发货港">
                      <a-input readOnly v-model="form.shipmentPort"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="定价方式">
                      <a-input readOnly v-model="form.pricingState"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="条款">
                      <a-input readOnly v-model="form.terms"></a-input>
                    </a-form-model-item>
                  </a-col>
                </a-row>
                <a-row :gutter="16">
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="币种">
                      <a-input readOnly v-model="form.currency"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="汇率">
                      <a-input v-model="form.exchangeRate" readOnly></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col class="gutter-row" :span="6">
                    <a-form-model-item label="采购员">
                      <a-input readOnly v-model="form.buyerName" @change="forceUpdate"></a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col class="gutter-row" :span="12">
                    <a-form-item label="关联合同">
                      <a-input readOnly v-model="form.contractTitle" @change="forceUpdate"/>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
          <div class="table" style="margin-bottom: 10px" v-if="priceData && priceData.length > 0">
            <p class="table-title">费用信息</p>
            <div class="table-data">
              <a-table rowKey="id" :pagination="false" :columns="priceColumns" :data-source="priceData"
                :scroll="{ x: 300, y: 800 }">
                <span slot="feeType" slot-scope="text">{{
                    text == 1 ? '国内' : '国际'
                }}</span>
                <span slot="rate" slot-scope="text, record">
                  <span>
                    {{
                        record.invoiceBusinessType == 0
                          ? '应税 -'
                          : record.invoiceBusinessType == 1
                            ? '免税 -'
                            : ''
                    }}
                    {{
                        record.invoiceType == 1
                          ? '普票 -'
                          : record.invoiceType == 2
                            ? '专票 -'
                            : record.invoiceType == 3
                              ? '普票(免税) -'
                              : record.invoiceType == 4
                              ? '进口增值税 -'
                              : record.invoiceType == 5
                              ? '进口关税 -'
                              : ''
                    }}{{
    record.invoiceType == 3
      ? '抵扣率'
      : [1, 2, 4, 5].includes(record.invoiceType)
        ? '税率'
        : ''
}}
                    {{ record.rate + '%' }}
                  </span>
                </span>
                <template slot="footer">
                  <div>
                    <span>费用项合计 : </span>
                    <span>{{ totalFee }}</span>
                  </div>
                </template>
              </a-table>
            </div>
          </div>
          <div class="table">
            <p class="table-title">商品信息</p>
            <div class="table-data">
              <a-table rowKey="id" :pagination="false" :columns="columns" :data-source="data"
                :scroll="{ y: 200, x: 850 }">
                <span slot="inputTaxRate" slot-scope="text, record">
                  <span>
                    {{
                        record.invoiceBusinessType == 0
                          ? '应税 -'
                          : record.invoiceBusinessType == 1
                            ? '免税 -'
                            : ''
                    }}
                    {{
                        record.invoiceType == 1
                          ? '普票 -'
                          : record.invoiceType == 2
                            ? '专票 -'
                            : record.invoiceType == 3
                              ? '普票(免税) -'
                              : ''
                    }}{{
    record.invoiceType == 3
      ? '抵扣率'
      : record.invoiceType == 1 || record.invoiceType == 2
        ? '税率'
        : ''
}}
                    {{ record.inputTaxRate + '%' }}</span>
                </span>
                <span slot="PriTitle"> 采购单价</span>
                <span slot="poPrice" slot-scope="text, record">
                  <a-space>
                    <span>
                      {{ record.poPrice }}
                    </span>
                    <span>{{ form.currency }}</span>
                  </a-space>
                </span>
                <span slot="Packaging" slot-scope="record">
                  <a-button type="link" @click="openPackage(record)">
                    包装选择
                  </a-button>
                </span>
              </a-table>
            </div>
            <p class="table-total">
              {{ settleStateDesc }}
            </p>
          </div>
        </div>

        <template slot="footer">
          <a-button type="primary" @click="confirmOrder" :disabled="form.poState !== 201">{{ form.poState === 201 ?
              '确认此单' : '已确认'
          }}
          </a-button>
          <a-button type="primary" v-if="
            unconfirmedList &&
            unconfirmedList.length > 0 &&
            form.poState !== 201
          " @click="nextOrder">下一单待确认
          </a-button>
          <a-button type="primary" @click="handleCancel">返回 </a-button>
        </template>
      </a-modal>
    </a-spin>
    <a-modal title="包装选择" :visible="packageVisible" :width="600" @cancel="handleCancelPackage" :dialogStyle="{
      top: '160px'
    }" destroyOnClose>
      <div class="details">
        <div class="table">
          <p class="table-title">商品信息</p>
          <div class="table-data">
            <a-table rowKey="packCode" :pagination="false" :columns="packageColumns" :data-source="packageData"
              :scroll="{ y: 200 }">
              <span slot="packUnitPrice" slot-scope="text">
                <span>{{ text }}</span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button type="primary" @click="handleCancelPackage">关闭 </a-button>
      </template>
    </a-modal>
  </div>
</template>
<script>
import {
  purchaseOrderHeadGetSingle,
  purchaseOrderHeadToConfirm,
  GetNoConfirmIds
} from '../../services/purchaseSaleInventory'
export default {
  name: 'purchaseOrderDetails',
  data() {
    return {
      spinning: false,
      spinText: '',
      packageVisible: false,
      visible: false,
      settleStateDesc: '',
      form: {
        roCode: '',
        soCode: '',
        supplierName: '',
        supplierPhone: '',
        poCode: '',
        poSubtime: '',
        createUser: '',
        payAmount: '',
        buyerName: '',
        contractTitle: ''
      },
      priceColumns: [
        {
          title: '费用类型',
          dataIndex: 'feeType',
          width: 150,
          align: 'center'
        },
        { title: '费用项', dataIndex: 'feeName', width: 150, align: 'center' },
        {
          title: '收款主体',
          dataIndex: 'receivingSubjectName',
          width: 280,
          align: 'center'
        },
        {
          title: '费用金额',
          dataIndex: 'feeAmount',
          width: 180,
          align: 'center'
        },
        {
          title: '增值税',
          dataIndex: 'rate',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'rate' }
        },
        {
          title: '不含税金额',
          dataIndex: 'priceExcludingTax',
          width: 180,
          align: 'center'
        },
        { title: '币种', dataIndex: 'currency', width: 120, align: 'center' },
        {
          title: '汇率',
          dataIndex: 'exchangeRate',
          width: 120,
          align: 'center'
        },
        {
          title: '外币金额',
          dataIndex: 'foreignCurrencyAmount',
          width: 200,
          align: 'center'
        },
        {
          title: '人民币金额',
          dataIndex: 'currencyAmount',
          width: 200,
          align: 'center'
        },
        { title: '备注', dataIndex: 'remark', width: 200, align: 'center' }
      ],
      priceData: [],
      data: [],
      columns: [],
      columnsNormal: [
        {
          title: '商品名称',
          dataIndex: 'itemName',
          width: 100,
          align: 'center'
        },
        {
          title: '商品编码',
          dataIndex: 'itemCode',
          width: 150,
          align: 'center'
        },
        {
          title: '原产国',
          dataIndex: 'itemCountryOrigin',
          width: 150,
          align: 'center'
        },
        {
          title: '客户名称',
          dataIndex: 'customerName',
          width: 220,
          align: 'center'
        },
        {
          title: '门店名称',
          dataIndex: 'storeName',
          width: 220,
          align: 'center'
        },
        {
          title: '数量',
          dataIndex: 'poQty',
          width: 70,
          align: 'center'
        },
        {
          title: '计价单位',
          dataIndex: 'priceUnit',
          width: 100,
          align: 'center'
        },
        {
          title: '辅助单位',
          dataIndex: 'unit',
          width: 100,
          align: 'center'
        },
        {
          dataIndex: 'poPrice',
          width: 150,
          slots: { title: 'PriTitle' },
          align: 'center',
          scopedSlots: { customRender: 'poPrice' }
        },
        {
          title: '采购净重',
          dataIndex: 'poNetweight',
          width: 100,
          align: 'center'
        },
        {
          title: '净重单位',
          dataIndex: 'poNetweightUnit',
          width: 100,
          align: 'center'
        },
        {
          title: '规格',
          dataIndex: 'itemSpec',
          width: 70,
          align: 'center'
        },
        {
          title: '品种',
          dataIndex: 'itemType',
          width: 150,
          align: 'center'
        },
        {
          title: '等级',
          dataIndex: 'itemLevel',
          width: 150,
          align: 'center'
        },
        {
          title: '品牌',
          dataIndex: 'itemBrand',
          width: 150,
          align: 'center'
        },
        {
          title: '包装',
          width: 120,
          scopedSlots: { customRender: 'Packaging' },
          align: 'center'
        },
        {
          title: '包装费用(元)',
          dataIndex: 'packingCost',
          width: 120,
          align: 'center'
        },
        {
          title: '采购总额',
          dataIndex: 'poTotalAmount',
          width: 100,
          align: 'center'
        },
        {
          title: '增值税',
          dataIndex: 'inputTaxRate',
          width: 200,
          scopedSlots: { customRender: 'inputTaxRate' },
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 100,
          ellipsis: true,
          align: 'center'
        }
      ],
      packageData: [],
      buyerOption: [],
      packageColumns: [
        {
          title: '包装名称',
          dataIndex: 'packName',
          width: 100,
          align: 'center'
        },
        {
          title: '包装编号',
          dataIndex: 'packCode',
          width: 150,
          align: 'center'
        },
        {
          title: '包装数量',
          dataIndex: 'packQty',
          width: 100,
          align: 'center'
        },
        {
          title: '包装价格(元)',
          dataIndex: 'packUnitPrice',
          width: 110,
          align: 'center',
          scopedSlots: { customRender: 'packUnitPrice' }
        }
      ],
      modalType: '',
      detailId: '',
      unconfirmedList: []
    }
  },
  methods: {
    forceUpdate() {
      this.$forceUpdate()
    },
    getDetails(id, contractTitle) {
      this.spinning = true
      this.spinText = '详情加载中'
      const params = {
        id: id
      }
      purchaseOrderHeadGetSingle(params).then(res => {
        this.spinning = false
        const data = res.data
        if (data.code === '200') {
          this.form = {
            ...data.data,
            contractTitle,
            ...data.data.purchaseGlobalOrderDetail
          }
          this.form.payAmount = this.form.payAmount ? this.form.payAmount : ''
          this.data = data.data.details
          this.data.forEach(item => {
            item.poPrice = item.poPrice ? item.poPrice : ''
            item.poTotalAmount = item.poTotalAmount ? item.poTotalAmount : ''
            item.packingCost = item.packingCost ? item.packingCost : ''
          })
          this.settleStateDesc = data.data.settleStateDesc
          this.modalType = data.data.poType //1.国内订单、2.国际订单
          this.priceData = data.data.purchaseFeeList || []
          this.priceData.forEach(item => {
            item.feeAmount = item.feeAmount ? item.feeAmount : ''
            switch (item.feeType) {
              case 1:
                item.feeType = '国内费用'
                break
              case 2:
                item.feeType = '国际费用'
                break
              default:
                break
            }
          })
          if (this.modalType === 1) {
            let gnColumns = []
            let gnNoColumns = [
              'itemCountryOrigin',
              'itemType',
              'itemLevel',
              'itemBrand',
              'poNetweight',
              'poNetweightUnit'
            ]
            this.columnsNormal.forEach(item => {
              if (gnNoColumns.indexOf(item.dataIndex) < 0) {
                gnColumns.push(item)
              }
            })
            this.columns = gnColumns
          } else {
            this.columns = this.columnsNormal
          }
          this.visible = true
        } else {
          this.$message.error('获取详情失败！')
        }
      })
    },
    nextOrder() {
      if (this.unconfirmedList && this.unconfirmedList.length > 0) {
        this.getDetails(this.unconfirmedList[0])
        this.detailId = this.unconfirmedList[0]
      }
    },
    async getUnConfirmOrder() {
      const res = await GetNoConfirmIds()
      if (res.data.code === '200') {
        this.unconfirmedList = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    },
    confirmOrder() {
      const params = {
        id: this.detailId
      }
      this.spinning = true
      this.spinText = '确认订单中'
      purchaseOrderHeadToConfirm(params).then(res => {
        const data = res.data
        this.spinning = false
        if (data.code === '200') {
          this.$message.success(data.message)
          console.log(this.unconfirmedList)
          this.getDetails(this.detailId)
          this.getUnConfirmOrder()
        } else {
          this.$message.error(data.message)
        }
      })
    },
    openPackage(row) {
      this.packageData = row.pkgDetails
      this.packageVisible = true
    },
    openModal(row) {
      this.getUnConfirmOrder()
      this.detailId = row.id
      this.getDetails(row.id, row.contractTitle)
    },
    handleCancelPackage() {
      this.packageVisible = false
    },
    handleCancel() {
      this.visible = false
      this.$parent.getTableList()
    }
  },
  created() { },
  computed: {
    totalFee() {
      return (
        this.priceData.reduce((t, c) => {
          return this.formatPrice(t + (+c.feeAmount || 0), 2)
        }, 0) || '-'
      )
    }
  }
}
</script>
<style scoped lang="less">
.details {
  .info {
    margin-bottom: 10px;

    .info-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }
  }

  /deep/.ant-form-item-label {
    line-height: 22px;
  }

  /deep/.ant-form-item {
    margin-bottom: 0;
  }

  .table {
    border: 1px solid #f0f0f0;
    border-radius: 6px;

    .table-title {
      height: 35px;
      line-height: 35px;
      padding: 0 20px;
      background-color: rgb(240, 243, 246);
      font-weight: 550;
      border-radius: 6px;
      margin-bottom: 0;
    }

    .table-data {
      padding: 10px;
    }

    .table-total {
      margin-bottom: 0;
      padding: 0 20px;
      line-height: 35px;
    }
  }
}
</style>
