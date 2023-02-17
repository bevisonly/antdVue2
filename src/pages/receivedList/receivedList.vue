<template>
  <div class="topDiv">
    <div class="queryInfo" v-if="fullScreen">
      <p class="queryInfoP">筛选查询</p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入单据单号" v-model.trim="form.poCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input style="width: 100%;" placeholder="请输入柜号" v-model.trim="form.containerCode"></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search :value="form.supplierId" placeholder="请搜索选择供应商名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :not-found-content="null" @search="handleSupplierSearch" @change="handleSupplierOption">
                <a-select-option v-for="item in option.supplierOption.filter(supplierStrategy)"
                  :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search v-model="form.agencyId" placeholder="请选择代理公司名称"
                :default-active-first-option="false" :show-arrow="false" :filter-option="filterOption"
                :not-found-content="null">
                <a-select-option v-for="item in option.supplierOption.filter(agencyStrategy)"
                  :key="item.id">{{ item.partnerName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select style="width: 100%;" show-search v-model="form.feeName" placeholder="请搜索选择费用项"
                :default-active-first-option="false" :show-arrow="false" :filter-option="filterOption"
                :not-found-content="null" @select="onSelectFee">
                <a-select-option v-for="item in option.receiveMsgOption" :key="item.id">
                  {{ item.type == 2 ? item.name + "(国际)" : item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" @click="resetBtn">清空</a-button>
              <a-button class="ant-button" type="primary" @click="submitBtn('search')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="tableInfo" :style="{border: !fullScreen ? 0 : ''}">
      <p class="bottomTitle" v-show="fullScreen">账款列表</p>
      <div class="flex-sb heightDiv">
        <a-button type="primary" :disabled="!hasPermission('pickUpOrderEnd_print')" @click="printBtn">打印</a-button>
        <a-button-group>
          <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
          <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
          <checkboxList v-model="columns" width="290" />
        </a-button-group>
      </div>
      <a-table class="tableStyle" bordered ref="tableRef" :columns="columns" :data-source="dataTable" :loading='loading'
        rowKey="id" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        :scroll="{ x: 300, y: dataTable[10] ? 560 : 0 }" :pagination='false'>
        <span tips="订单状态" slot="poState" slot-scope="text, record">
          <div>{{ record.poState == 220 ? '已收货' : "未收货" }}</div>
        </span>
        <span tips="操作" slot="operation" slot-scope="text, record">
          <a-button class="greenfont bluefonthover" type="link"
            :disabled="!hasPermission('pickUpOrderEnd_details')" @click="detailsBtn('details', record)">详情</a-button>
          <a-popconfirm placement="bottom" title="确定撤回吗？" ok-text="确定" cancel-text="取消"
            :disabled="!hasPermission('pickUpOrderEnd_delete') || record.reconciliaState == 620"
            @confirm="cancel(record.id)">
            <a-icon slot="icon" type="delete" style="color: red" />
            <a-button class="greenfont redfonthover" type="link"
              :disabled="!hasPermission('pickUpOrderEnd_delete') || record.reconciliaState == 620">撤回</a-button>
          </a-popconfirm>
          <a-button class="greenfont bluefonthover" type="link"
            :disabled="!hasPermission('pickUpOrderEnd_edit')" @click="detailsBtn('edit', record)">编辑</a-button>
        </span>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination :pageSizeOptions='pageSizeOptions' v-model="pagination.page" :pageSize="pagination.size"
          :total="pagination.total" :show-total="() => `共 ${pagination.total} 条`" show-size-changer
          :show-quick-jumper="pagination.total >= 1000 ? true : false" @showSizeChange="paginationSize"
          @change="paginationPage" />
      </div>
    </div>
    <modal-details ref="modalDetailsRef" />
    <modal-Print ref="modalPrintRef" />
  </div>
</template>

<script>
import modalDetails from './modalDetails'
import modalPrint from './modalPrint.vue'
import {
  search,
  cancel,
  receiveMsg,
} from '@/services/pickUpOrder/receivedList'
import { partnerType } from "../../services/userMa";
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy'
const columns = [
  { title: '采购订单号', dataIndex: 'poCode', width: 210 },
  { title: '采购订单提交时间', dataIndex: 'poSubtime', width: 190 },
  { title: '订单状态', dataIndex: 'poState', width: 140, scopedSlots: { customRender: "poState" } },
  { title: '供应商名称', dataIndex: 'supplierName', width: 260 },
  { title: '代理公司名称', dataIndex: 'agencyName', width: 260 },
  { title: '柜号', dataIndex: 'containerCode', width: 200 },
  { title: "关联合同", dataIndex: "contractTitle", width: 240 },
  { title: '供应商联系手机', dataIndex: 'supplierPhone', width: 160 },
  { title: '采购件数', dataIndex: 'purchaseQty', width: 160 },
  { title: '收货件数', dataIndex: 'deliveryQty', width: 160 },
  { title: '收货人', dataIndex: 'deliveryUser', width: 200 },
  { title: '收货人手机', dataIndex: 'deliveryPhone', width: 160 },
  { title: '收货时间', dataIndex: 'deliveryTime', width: 190 },
  { title: '收货地点', dataIndex: 'deliveryAdress', width: 280 },
  { title: '操作', dataIndex: 'operation', fixed: 'right', align: 'center', width: 240, scopedSlots: { customRender: 'operation' } },
]
export default {
  name: 'receivedList',
  components: { modalDetails, modalPrint },
  data() {
    return {
      columns,
      form: {
        poCode: undefined,
        containerCode: undefined,
        supplierId: undefined,
        feeName: undefined,
        feeType: undefined
      },
      option: {
        supplierOption: [],
        receiveMsgOption: [],
        supplierMaterial: {},
      },
      fullScreen: true,
      selectedRowKeys: [],
      disabledFlage: 0,
      dataTable: [],
      loading: false,
      pageSizeOptions: ['10', '20', '50', '100', '200'],
      pagination: { total: 0, page: 1, size: 10 },
    }
  },
  methods: {
    supplierStrategy: PARTNER_STRATEGY.SUPPLIER,
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    onSelectFee(id) {
      let feeObj = this.option.receiveMsgOption.find(x => x.id == id)
      this.form.feeName = feeObj.name
      this.form.feeType = feeObj.type
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    receiveMsg() { receiveMsg({ orderType: null }).then(res => res.data.code == 200 && (this.option.receiveMsgOption = res.data.data)) },
    editOrder(record, flag) {
      this.$router.push({
        path: "/transport/pickUp/pickUpOrderPickUpRouter",
        query: {
          record: record,
          data: this.dataTable,
          state: flag == "details" ? 0 : 1,
          flag: "receivedList"
        },
      });
    },
    detailsBtn(flag, record) {
      record.poType == 2 ? this.editOrder(record, flag) : this.$refs.modalDetailsRef.openModal(flag, record)
    },
    cancel(id) {
      cancel({ id: id }).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message)
          this.submitPagination()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    printBtn() {
      if (!this.selectedRowKeys.length) {
        this.$message.warn('请先勾选要打印的数据', 2)
        return
      }
      this.$refs.modalPrintRef.openModal(this.selectedRowKeys)
    },
    resetBtn() {
      let nullParams = {
        poCode: undefined,
        containerCode: undefined,
        supplierId: undefined,
        agencyId: undefined,
        feeName: undefined,
        feeType: undefined
      }
      this.option.supplierMaterial = {}
      this.form = nullParams
      this.handleSupplierSearch("")
    },
    redo() {
      this.pagination.page = 1
      this.pagination.size = 10
      let params = {
        page: 1,
        rows: 10,
        sort: "id",
        order: "DESC",
      }
      search(params).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    getExcel(res, name) {
      const link = document.createElement('a')
      const blob = new Blob([res], { type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    deepClone(obj) {
      let objStorageBox = null
      if (typeof (obj) == 'object' && obj !== null) {
        objStorageBox = obj instanceof Array ? [] : {}
        for (let i in obj) {
          objStorageBox[i] = this.deepClone(obj[i])
        }
      } else {
        objStorageBox = obj
      }
      return objStorageBox
    },
    handleSupplierSearch(value) {
      partnerType({ partnerName: value?.trim(), partnerTypes: [30, 40] }).then(res => res.data.code == '200' && (this.option.supplierOption = res.data.data))
    },
    handleSupplierOption(value) {
      this.form.supplierId = value
      this.option.supplierMaterial = this.option.supplierOption.find(item => item.id == value) || {}
    },
    submitPagination() {
      this.selectedRowKeys = []
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          sort: "id",
          order: "DESC",
          poCode: this.form.poCode?.trim(),
          containerCode: this.form.containerCode?.trim(),
          partnerName: this.option.supplierMaterial?.partnerName,
          agencyName: this.option.supplierOption.find(partner => partner.id === this.form.agencyId)?.partnerName,
          feeName: this.form.feeName,
          feeType: this.form.feeType,
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        if (res.data.code == '200') {
          this.loading = false
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.loading = false
        }
      }).catch(() => this.loading = false)
    },
    submitBtn(flag) {
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        sort: "id",
        order: "DESC",
        poCode: this.form.poCode?.trim(),
        containerCode: this.form.containerCode?.trim(),
        partnerName: this.option.supplierMaterial?.partnerName,
        agencyName: this.option.supplierOption.find(partner => partner.id === this.form.agencyId)?.partnerName,
        feeName: this.form.feeName,
        feeType: this.form.feeType,
      }
      if (flag == 'search') {
        this.pagination.page = 1
        this.copyParams = this.deepClone(params)
      }
      this.loading = true
      search(params).then(res => {
        if (res.data.code == 200) {
          this.loading = false
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.loading = false
          this.$message.warn(res.data.message, 2)
        }
      }).catch(() => this.loading = false)
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
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        document.querySelector('.paginationContainer')?.clientWidth > 1700 ? this.suitableTdWidth = '' : this.suitableTdWidth = 160
      });
    })
  },
  activated() {
    this.handleSupplierSearch('')
    this.submitPagination()
    this.receiveMsg()
  },
}
</script>

<style lang="less">
@import './index';
</style>