<template>
  <div class="finalTop">
    <div class="topContainer">
      <div class="topBox" v-show="fullscreenSwitch">
        <p class="topQuery">筛选查询</p>
        <div class="formContainer">
          <a-form-model ref="searchForm" :model="searchForm">
            <a-row>
              <a-col :span="24">
                <a-form-model-item class="floatLeft">
                  <a-range-picker :placeholder="['新增开始日期','新增截至日期']" show-time valueFormat="YYYY-MM-DD HH:mm:ss" v-model="dateGroup" @ok="changeDate" @change="changeDate"></a-range-picker>
                </a-form-model-item>
                <a-form-model-item class="floatLeft forBorder formItemPurchaseAccountName">
                  <a-input v-if="pageType == 'supplier'" class="inputPurchaseName" v-model.trim="searchForm.partnerName" placeholder="请输入供应商名称"></a-input>
                  <a-select
                    v-else
                    class="inputPurchaseName"
                    style="width: 100%;"
                    show-search
                    v-model.trim="agencyId"
                    placeholder="请输入代理公司名称"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :default-active-first-option="false"
                    @search="handleAgencySearch"
                    @focus="handleAgencySearch"
                    @select="handleAgencyOption"
                  >
                  <a-select-option v-for="item in agencyOption" :key="item.id">{{ item.partnerName }}</a-select-option>
                </a-select>
                  <a-button class="ant-button" type="primary" @click="resetForm">清空</a-button>
                  <a-button class="ant-button" type="primary" @click="onSubmit(pagination.currentPage, 'search')">查询</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="bottomBox" :style="{border: fullscreenSwitch ? undefined : 0}">
        <p class="bottomTitle" v-show="fullscreenSwitch">
          数据列表
        </p>
        <div class="tableContainer">
          <div class="topButton flex-sb">
            <a-button class="buttonGroup" type="primary" :disabled="disabled('add')" @click="addBtn('add')">新增</a-button>
            <a-button-group class="a-button-group">
              <a-button class="a-button" type="primary" icon="sync" title="刷新数据" @click="reloadTable"></a-button>
              <a-button class="a-button" type="primary" icon="fullscreen" title="全屏" @click="switchFullscreen"></a-button>
              <checkboxList v-model="columns" width="300" />
            </a-button-group>
          </div>
          <a-table
            style="margin-top: 10px"
            bordered
            ref="tableRef"
            :columns="columns"
            :data-source="data"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :loading='loading'
            rowKey="id"
            :scroll="{ x: 307.778 }"
            :pagination="false"
          >
            <template slot="invcType" slot-scope="text, record">
              <span>{{ record.invcType == 2 ? '统一结算' : record.invcType == 3 ? '独立结算' : record.invcType}}</span>
            </template>
            <template slot="invcCycle" slot-scope="text, record">
              <span>
                {{
                  record.invcCycleType === 1? '自然月底' :
                  record.invcCycleType === 3? `每月${record.invcCycle}号` :
                  record.invcCycleType === 4? `${record.invcCycle}天` : ''
                }}
              </span>
            </template>
            <template slot="isEnable" slot-scope="text, record">
              <span :class="{greenfont: record.isEnable}">{{ record.isEnable ? '启动' : '禁用' }}</span>
            </template>
            <template slot="ifLimit" slot-scope="text, record">
              <span :class="{greenfont: record.ifLimit}">{{ record.ifLimit ? '是' : '否' }}</span>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm :disabled="disabled('limit', record)" @confirm="limitBtn(record.id, record.ifLimit)">
                <template slot="title">
                  <div class="break-word">请确认是否取消限额，取消限额后将不受额度限制！</div>
                </template>
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont bluefonthover" type='link' :disabled="disabled('limit', record)">是否限额</a-button>
              </a-popconfirm>
              <a-button class="greenfont bluefonthover" type='link' :disabled="disabled('spec_edit', record)" @click="eidtBtn(record.id, record)">编辑</a-button>
              <a-button class="greenfont bluefonthover" type='link' :disabled="disabled('spec_onOff', record)" @click="onOffBtn(record.id, record.isEnable)">启禁</a-button>
              <a-popconfirm title="确定删除吗" :disabled="disabled('spec_delete', record)" @confirm="deleteSupplier(record.id)">
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont redfonthover" type='link' :disabled="disabled('spec_delete', record)">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table>
          <div class="paginationContainer flex-ed">
            <a-pagination
              show-size-changer
              :pageSizeOptions='pageSizeOptions'
              :default-current="1"
              :total="pagination.total"
              v-model="currentPage"
              :pageSize="pagination.pageSize"
              :show-total="() => `共 ${pagination.total} 条`"
              @showSizeChange="onShowSizeChange"
              @change="onPageSizeChange"
            />
          </div>
        </div>
      </div>
    </div>
    <modalEdit ref="modalEditRef"></modalEdit>
  </div>
</template>

<script>
import {
  supplierListSupplierByPartnerDto,
  supplierInvalidinformation,
  supplierLimitOperation
} from "@/services/supplierManagerList.js";
import { searchAgencyList, dropDownAgencylist } from "@/services/baseDataMa/agency";
import modalEdit from './modalEdit'
const columns = [
  {title: '供应商名称', dataIndex: 'partnerName', width: 360},
  {title: '所属运营主体', dataIndex: 'opName', width: 360},
  {title: '结算方式', dataIndex: 'invcType', width: 160, scopedSlots: {customRender: "invcType"}},
  {title: '结算周期', dataIndex: 'invcCycle', width: 160, scopedSlots: {customRender: "invcCycle"}},
  {title: '对账日期', dataIndex: 'checkDate', width: 180},
  {title: '经营简介', dataIndex: 'description', width: 240},
  {title: '建议额度（万元）', dataIndex: 'suggestAmount', width: 240},
  {title: '地址', dataIndex: 'address', width: 360},
  {title: '联系人', dataIndex: 'contactName', width: 160},
  {title: '联系方式', dataIndex: 'contactPhone', width: 160},
  {title: '启动状态', dataIndex: 'isEnable', width: 150, scopedSlots: {customRender: "isEnable"}},
  {title: '是否限额', dataIndex: 'ifLimit', width: 150, scopedSlots: {customRender: "ifLimit"}},
  {title: '操作', dataIndex: 'operation', width: 320, align: "center", fixed: 'right', scopedSlots: {customRender: "operation"}},
]
export default {
  name: "supplierManagerList",
  components: { modalEdit },
  data() {
    return {
      pageType: 'supplier',
      columns,
      fullscreenSwitch: true,
      dateGroup: [],
      searchForm: {
        beginDate: "",
        endDate: "",
        partnerName: "",
      },
      agencyId: undefined,
      agencyOption: [],
      agencyMaterial: {},
      selectedRowKeys: [],
      data: [],
      current: 1,
      pageSize: 10,
      pageSizeOptions: ["10", "20", "50", "100"],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      currentPage: undefined,
      loading: false,
      paramsBtn: undefined,
      adminOrgId: undefined
    };
  },
  methods: {
    disabled(value, record) {
      if (this.pageType == 'supplier' && value == 'spec_edit') value = 'update'
      return !this.hasPermission(this.pageType + '_' + value) || (record && this.adminOrgId != record.orgId)
    },
    changeDate() {
      this.searchForm.beginDate = this.dateGroup[0]
      this.searchForm.endDate = this.dateGroup[1]
    },
    handleAgencySearch(v) {
      dropDownAgencylist({type: 40, partnerName: v}).then(vip => vip.data.code == 200 && (this.agencyOption = vip.data.data))
    },
    handleAgencyOption(id) {
      this.agencyMaterial = this.agencyOption.find(item => item.id == id) || {}
      this.searchForm.partnerName = this.agencyMaterial.partnerName
    },
    addBtn(flag){
      const params = {
        sort: 'id',
        order: 'desc',
        rows: 10,
        page: 1,
      }
      this.$refs.modalEditRef.openModal(flag, undefined ,this.refresh, params);
    },
    eidtBtn(id, allMsg){
      const params = {
        partnerName: this.searchForm.partnerName,
        beginDate: this.dateGroup[0] || '',
        endDate: this.dateGroup[1] || '',
        sort: 'id',
        order: 'desc',
        rows: this.pagination.pageSize,
        page: this.pagination.currentPage,
      }
      this.$refs.modalEditRef.openModal(id, allMsg, this.refresh, this.paramsBtn || params);
    },
    resetForm() {
      this.searchForm.partnerName = undefined
      this.searchForm.beginDate = undefined
      this.searchForm.endDate = undefined
      this.dateGroup = []
      this.agencyId = undefined
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
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
    async onSubmit(page, flag) {
      this.loading = true;
      const params = {
        partnerName: this.searchForm.partnerName,
        beginDate: this.dateGroup[0] || '',
        endDate: this.dateGroup[1] || "",
        sort: 'id',
        order: 'desc',
        rows: this.pagination.pageSize,
        page: page ? page : this.pagination.currentPage,
      }
      if (page) {
        this.currentPage = page
      }
      if (flag == 'search') {
        this.pagination.currentPage = 1
        this.currentPage = 1
        this.paramsBtn = this.deepClone(params)
      }
      let api = this.pageType == 'supplier' ? supplierListSupplierByPartnerDto : searchAgencyList
      api(params).then(val => {
        this.loading = false;
        this.data = val.data.rows
        this.pagination.total = val.data.total
      }).catch( () => this.loading = false)
    },
    onSubmitForPagination() {
      this.loading = true;
      if (this.paramsBtn) {
        this.paramsBtn.rows = this.pagination.pageSize
        this.paramsBtn.page = this.pagination.currentPage
      } else {
        const params = {
          partnerName: this.searchForm.partnerName,
          beginDate: this.dateGroup[0] || '',
          endDate: this.dateGroup[1] || '',
          sort: 'id',
          order: 'desc',
          rows: this.pagination.pageSize,
          page: this.pagination.currentPage,
        }
        this.paramsBtn = this.deepClone(params)
      }
      let api = this.pageType == 'supplier' ? supplierListSupplierByPartnerDto : searchAgencyList
      api(this.paramsBtn).then(val => {
        this.loading = false;
        this.data = val.data.rows
        this.pagination.total = val.data.total
      }).catch( () => this.loading = false)
    },
    onOffBtn(id, isEnable) {
      supplierInvalidinformation({id, isEnable}).then(val => {
        if (val.data.code == 200) {
          this.onSubmitForPagination()
          this.$message.success('执行成功')
        } else {
          this.$message.warn('执行失败,'+val.data.result, 1.5)
        }
      })
    },
    limitBtn(id, ifLimit) {
      supplierLimitOperation({id, ifLimit}).then(val => {
        if (val.data.code == 200) {
          this.onSubmitForPagination()
          this.$message.success('执行成功')
        } else {
          this.$message.error('执行失败,'+val.data.result, 3.5)
        }
      })
    },
    deleteSupplier(id) {
      supplierInvalidinformation({id, isEnable: 2}).then(val => {
        if (val.data.code == 200) {
          this.onSubmitForPagination()
          this.$message.success(val.data.result)
        } else {
          this.$message.error(val.data.result)
        }
      })
    },
    refresh(params) {
      this.loading = true;
      let api = this.pageType == 'supplier' ? supplierListSupplierByPartnerDto : searchAgencyList
      api(params).then(val => {
        this.loading = false;
        this.data = val.data.rows
        this.pagination.total = val.data.total
      }).catch( () => this.loading = false)
    },
    resetSearch() {
      let restData = {
        beginDate: "",
        endDate: "",
        partnerName: "",
      };
      this.searchForm = restData;
    },
    reloadTable() {
      this.resetSearch();
      this.onSubmit();
    },
    switchFullscreen() {
      this.fullscreenSwitch = !this.fullscreenSwitch;
    },
    onPageSizeChange(current, pageSize) {
      this.currentPage = current
      this.pagination.currentPage = current
      this.pagination.pageSize = pageSize
      this.onSubmitForPagination()
    },
    onShowSizeChange(current, pageSize) {
      this.currentPage = current || 1
      this.pagination.currentPage = current || 1
      this.pagination.pageSize = pageSize
      this.onSubmitForPagination()
    },
  },
  activated() {
    this.selectedRowKeys = []
    this.searchForm.partnerName = undefined
    this.agencyId = undefined
    this.$route.path?.includes('agency') && (this.pageType = "agency", columns[0].title = "代理公司名称")
    this.$route.path?.includes('supplier') && (this.pageType = "supplier", columns[0].title = "供应商名称")
    this.adminOrgId = localStorage.getItem('orgId')
    this.onSubmitForPagination()
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>
<style>
.break-word{
  max-width: 200px;
  white-space: normal;
  word-break: break-all;
}
</style>