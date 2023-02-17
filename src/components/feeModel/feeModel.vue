<template>
  <div class="fee-table">
    <a-divider />
    <p class="table-title" style="margin-top: 20px">
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="4"><span style="margin-left: 10px">费用项列表</span></a-col>
        <a-col class="gutter-row" :span="6">
          <span>
            <a-select ref="addFeeSelect" mode="multiple" v-model="valueSelectFee" show-search placeholder="可选择费用进行添加"
              option-filter-prop="children" style="width: 100%" :filter-option="filterOption" @change="chooseSelectFee"
              :dropdown-menu-style="{ height: '200px' }">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 4px 0" />
                <div style="padding: 4px 8px; cursor: pointer" @mousedown="e => e.preventDefault()">
                  <a-button type="primary" size="small" @click="addFee">确认</a-button>
                </div>
              </div>
              <a-icon slot="suffixIcon" type="smile" />
              <a-select-option v-for="item in feeCateData" :key="item.id">
                {{ item.type == 1 ? item.name : item.name + '(国际)' }}
              </a-select-option>
            </a-select>
          </span>
        </a-col>
      </a-row>
    </p>
    <div class="table-data" v-if="feeData.length > 0">
      <a-table rowKey="fakeId" :pagination="false" :columns="feeColumns" :data-source="feeData"
        :scroll="{ y: 200, x: 1300 }" size="small">
        <span slot="RSTitle" class="table-formva"> 收款主体</span>
        <span slot="FATitle" class="table-formva"> 费用金额</span>
        <span slot="rateTitle" class="table-formva"> 税率/抵扣率(%)</span>
        <span slot="del" slot-scope="text, record, index">
          <a-popconfirm title="确定要删除这条数据吗?" ok-text="确定" cancel-text="取消" @confirm="delFeeOne(record, index)">
            <a-button type="link"> 删除 </a-button>
          </a-popconfirm>
        </span>
        <span slot="feeType" slot-scope="text">{{
            text == 1 ? '国内' : '国际'
        }}</span>
        <span slot="receivingSubjectId" slot-scope="text, record">
          <a-select style="width: 100%" v-model="record.receivingSubjectId" placeholder="必选" show-search
            :filter-option="filterOption" @change="supplierIdChange">
            <a-select-option v-for="item in partnerList" :key="item.id">{{
                item.partnerName
            }}</a-select-option>
          </a-select>
        </span>
        <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
        <span slot="invoiceBusinessType" slot-scope="text, record">
          <a-select v-model="record.invoiceBusinessType" @click.stop.native placeholder="" style="width: 40%">
            <a-select-option :value="0">应税业务</a-select-option>
            <a-select-option :value="1">免税业务</a-select-option>
          </a-select>
          <a-select v-model="record.invoiceType" @click.stop.native placeholder="" style="width: 60%">
            <a-select-option v-for="(item, index) in invoiceOption" :key="index" :value="item.value" :title="item.text">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </span>
        <span slot="rate" slot-scope="text, record">
          <span style="width: 40%">
            <span v-if="record.invoiceType == 3">抵扣率</span>
            <span v-if="[1,2,4,5].includes(record.invoiceType)">税率</span>
          </span>
          <a-select style="width: 50%; margin-left: 2px" v-model="record.rate" placeholder="必填项">
            <a-select-option v-for="item in rateOption" :key="item">{{
                item
            }}</a-select-option>
          </a-select>
        </span>
        <span slot="priceExcludingTax" slot-scope="text, record">
          <span :calculateNum="
            priceExcludingTaxx(record, record.feeAmount, record.rate)
          ">
            {{
                record.feeAmount && record.rate
                  ? formatPrice(
                    +record.feeAmount -
                    ((+record.rate / 100) * +record.feeAmount) /
                    ((100 + +record.rate) / 100),
                    2
                  )
                  : text || ''
            }}
          </span>
        </span>
        <span slot="currency" slot-scope="text, record">
          <a-select style="width: 100%" v-model="record.currency">
            <a-select-option v-for="item in currencyOption" :key="item">{{
                item
            }}</a-select-option>
          </a-select>
        </span>
        <span slot="exchangeRate" slot-scope="text, record">
          <a-input-number v-model="record.exchangeRate"></a-input-number>
        </span>
        <span slot="foreignCurrencyAmount" slot-scope="text, record">
          <a-input-number v-model="record.foreignCurrencyAmount"></a-input-number>
        </span>
        <span slot="currencyAmount" slot-scope="text, record">
          <span :calculateNum="
            currencyAmountx(
              record,
              record.foreignCurrencyAmount,
              record.exchangeRate
            )
          ">
            {{
                (+record.foreignCurrencyAmount || 0) &&
                  (+record.exchangeRate || 0)
                  ? formatPrice(
                    (+record.foreignCurrencyAmount).toFixed(2) *
                    (+record.exchangeRate).toFixed(2),
                    2
                  )
                  : ''
            }}
          </span>
        </span>
        <span slot="customsClearanceFeeNumber" slot-scope="text, record">
          <a-input v-model="record.customsClearanceFeeNumber" />
        </span>
        <span slot="feeAmount" slot-scope="text, record">
          <a-input-number v-model="record.feeAmount" placeholder="必填" @change="singleFeeChange()" />
        </span>
        <span slot="remark" slot-scope="text, record">
          <a-input v-model="record.remark" />
        </span>
        <template slot="footer">
          <div>费用项合计 : {{ totalFee }}</div>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
const feeColumns = [
  {
    dataIndex: 'del',
    title: '操作',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'del' }
  },
  {
    title: '费用类型',
    dataIndex: 'feeType',
    width: 100,
    align: 'center',
    scopedSlots: { customRender: 'feeType' }
  },
  { title: '费用项', dataIndex: 'feeName', width: 110, align: 'center' },
  {
    dataIndex: 'receivingSubjectId',
    width: 200,
    align: 'center',
    slots: { title: 'RSTitle' },
    scopedSlots: { customRender: 'receivingSubjectId' }
  },
  {
    dataIndex: 'customsClearanceFeeNumber',
    width: 200,
    align: 'center',
    title: '清关单号',
    scopedSlots: { customRender: 'customsClearanceFeeNumber' }
  },
  {
    dataIndex: 'feeAmount',
    width: 120,
    align: 'center',
    slots: { title: 'FATitle' },
    scopedSlots: { customRender: 'feeAmount' }
  },
  {
    dataIndex: 'invoiceBusinessType',
    width: 280,
    align: 'center',
    slots: { title: 'invoiceBusinessTypeTit' },
    scopedSlots: { customRender: 'invoiceBusinessType' }
  },
  {
    dataIndex: 'rate',
    width: 150,
    align: 'center',
    slots: { title: 'rateTitle' },
    scopedSlots: { customRender: 'rate' }
  },
  {
    title: '不含税金额',
    dataIndex: 'priceExcludingTax',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'priceExcludingTax' }
  },
  {
    title: '币种',
    dataIndex: 'currency',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'currency' }
  },
  {
    title: '汇率',
    dataIndex: 'exchangeRate',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'exchangeRate' }
  },
  {
    title: '外币金额',
    dataIndex: 'foreignCurrencyAmount',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'foreignCurrencyAmount' }
  },
  {
    title: '人民币金额',
    dataIndex: 'currencyAmount',
    width: 120,
    align: 'center',
    scopedSlots: { customRender: 'currencyAmount' }
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
    align: 'center',
    scopedSlots: { customRender: 'remark' }
  }
]
import { getFeeList } from '../../services/pickUpOrder/pickUpOrderList'
import { partnerType } from '../../services/userMa'
export default {
  components: {
    VNodes: { functional: true, render: (h, ctx) => ctx.props.vnodes }
  },
  data() {
    return {
      //费用项20220803
      feeColumns,
      feeData: [],
      feeCateValueData: [],
      feeCateData: [],
      valueSelectFee: [],
      rateOption: ['0', '1', '3', '6', '9', '11', '13'],
      currencyOption: ['人民币', '美元', '欧元', '英镑', '澳元'],
      partnerList: [],
      //免税二期
      invoiceOption: [
        { value: 1, text: '增值税普通发票' },
        { value: 2, text: '增值税专用发票' }
        // { value: 3, text: "增值税普通发票(免税)" },
      ]
    }
  },
  props: {
    feeFather: {
      type: Array,
      required: true,
      default: function () {
        return []
      }
    },
    orderType: {
      type: [Number, Object],
      default: null
    }
  },
  computed: {
    priceExcludingTaxx() {
      return function (record, feeAmount, rate) {
        record.priceExcludingTax =
          feeAmount && rate
            ? this.formatPrice(
              +record.feeAmount -
              ((+record.rate / 100) * +record.feeAmount) /
              ((100 + +record.rate) / 100),
              2
            )
            : record.priceExcludingTax || ''
        return +record.feeAmount - +record.rate * +record.feeAmount
      }
    },
    currencyAmountx() {
      return function (record, foreignCurrencyAmount, exchangeRate) {
        record.currencyAmount =
          (+foreignCurrencyAmount || 0) && (+exchangeRate || 0)
            ? this.formatPrice(
              (+record.foreignCurrencyAmount).toFixed(2) *
              (+record.exchangeRate).toFixed(2),
              2
            )
            : undefined
        return +record.foreignCurrencyAmount * +record.exchangeRate
      }
    },
    totalFee() {
      return (
        this.feeData.reduce((t, c) => {
          return this.formatPrice(t + (+c.feeAmount || 0), 2)
        }, 0) || '-'
      )
    }
  },
  created() {
    this.getSuppliers()
    this.getFeeList()
    this.feeData = JSON.parse(JSON.stringify(this.feeFather))
  },
  methods: {
    //接收默认值
    receiveData(data) {
      this.feeData = data
    },
    submit() {
      this.$emit('updateFee', this.feeData)
    },
    singleFeeChange() { },
    //非国际订单只需要获取供应商列表
    async getSuppliers() {
      let res = await partnerType({ partnerTypes: [30], isEnable: 1 })
      if (res.data.code == 200) {
        this.partnerList = res.data.data || []
      }
    },
    //费用的分类数据
    async getFeeList() {
      let res = await getFeeList({ orderType: this.orderType })
      console.log(res)
      if (res.data.code == 200) {
        this.feeCateData = res.data.data
      }
    },
    //费用删除行
    delFeeOne(row, index) {
      this.feeData.splice(index, 1)
      this.forEachCaculate('no')
    },
    addFee() {
      if (!this.feeCateValueData.length) {
        this.$message.error(`请选择一条数据进行添加！`)
        return
      }
      this.feeData = this.feeData.concat(this.feeCateValueData)
      this.feeData.forEach((fakeId, f) => (fakeId.fakeId = ++f))
      this.feeCateValueData = []
      this.valueSelectFee = []
      this.$refs.addFeeSelect.blur()
    },
    //费用规格选择
    chooseSelectFee() {
      let feeCateValueDataArr = []
      this.feeCateData.forEach(item => {
        if (this.valueSelectFee.indexOf(item.id) > -1) {
          feeCateValueDataArr.push(item)
        }
      })
      feeCateValueDataArr.forEach(v => {
        v.feeType = v.type
        v.feeName = v.name
        v.receivingSubjectId = ''
      })
      this.feeCateValueData = JSON.parse(JSON.stringify(feeCateValueDataArr))
      this.feeCateValueData.forEach(item => {
        item.id = ''
      })
    },
    supplierIdChange() { },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style lang="less" scoped>
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: '*';
}
</style>
