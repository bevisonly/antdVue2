<template>
  <div class="finalTop">
    <div class="topContainer">
      <div class="topBox" v-show="fullscreenSwitch">
        <p class="topQuery">筛选查询</p>
        <div class="formContainer">
          <a-form-model ref="searchForm" :model="searchForm">
            <a-row>
              <a-col :span="24">
                <a-form-model-item class="floatLeft formItemRequireOrderId">
                  <a-input class="inputOrderId" v-model="searchForm.partnerName" placeholder="请输入门店名称"></a-input>
                </a-form-model-item>
                <a-form-model-item class="floatLeft forBorder formItemPurchaseAccountName">
                  <a-input class="inputPurchaseName" v-model="searchForm.parentName" placeholder="请输入公司名称"></a-input>
                  <a-button class="ant-button" type="primary" @click="resetSearch">清空</a-button>
                  <a-button class="ant-button" type="primary" @click="onSubmit(1,'search')">查询</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="bottomBox" :style="{border: fullscreenSwitch ? undefined : 0}">
        <p class="bottomTitle" v-show="fullscreenSwitch">数据列表</p>
        <div class="tableContainer">
          <div class="topButton flex-sb">
            <a-button class="buttonGroup" type="primary" :disabled="!hasPermission('add_store')" @click="addBtn('add')">新增</a-button>
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
            <template slot="invcCycle" slot-scope="text, record">
              <span>
                {{
                  record.invcCycleType === 1? '自然月底' :
                  record.invcCycleType === 3? `每月${record.invcCycle}号` :
                  record.invcCycleType === 4? `${record.invcCycle}天` : ''
                }}
              </span>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('update_store') || adminOrgId != record.orgId ? true : false" @click="eidtBtn(record.id, record)">编辑</a-button>
              <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('store_spec_delete') || adminOrgId != record.orgId ? true : false" @confirm="deleteIt(record.id)">
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('store_spec_delete') || adminOrgId != record.orgId ? true : false">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table>
          <div class="paginationContainer flex-ed">
            <a-pagination
              v-model="currentPage"
              show-size-changer
              :pageSizeOptions='pageSizeOptions'
              :default-current="1"
              :total="pagination.total"
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
  partnerListPartnerStoreByPartnerDto,
  partnerDelete,
  opSubjectList
} from "@/services/customerStoreManageList.js";
import modalEdit from './modalEdit'
import moment from "moment";
const columns = [
  {title: '门店名称', dataIndex: 'partnerName', width: 250},
  {title: '公司简称', dataIndex: 'shortName', width: 140},
  {title: '公司名称', dataIndex: 'parentName', width: 250},
  {title: '所属运营主体', dataIndex: 'opName', width: 236},
  {title: '门店类型', dataIndex: 'category', width: 120},
  {title: '结算账号', dataIndex: 'bankAccount', width: 236},
  {title: '结算周期', dataIndex: 'invcCycle', width: 120, scopedSlots: {customRender: "invcCycle"}},
  {title: '联系人', dataIndex: 'contactName', width: 100},
  {title: '联系方式', dataIndex: 'contactPhone', width: 150},
  {title: '添加时间', dataIndex: 'reateDate', width: 170},
  {title: '地址', dataIndex: 'address', width: 420},
  {title: '操作', dataIndex: 'operation', width: 180, align: "center", fixed: 'right', scopedSlots: {customRender: "operation"}},
]
export default {
  name: "customerStoreManageList",
  components: { modalEdit },
  data() {
    return {
      columns,
      fullscreenSwitch: true,
      searchForm: {
        partnerName: "",
        parentName: "",
      },
      opNameArray: [],
      valueOption: undefined,
      opSubjectListMaterial: {},
      supplierOption: [],
      storeNameOption: [],
      customerNameOption: [],
      downloadExcelPath: "",
      selectedRowKeys: [],
      data: [],
      dataBaseInfo: {},
      ifShow: true,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "20", "50", "100", "200", "500"],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      currentPage: 1,
      loading: false,
      paramsBtn: undefined,
      dataSelected: [],
      adminOrgId: undefined
    };
  },
  methods: {
    addBtn(flag){
      this.pagination.currentPage = this.currentPage
      const params = {
        rows: this.pagination.pageSize,
        page: 1,
      }
      this.$refs.modalEditRef.openModal(flag, undefined, params)
    },
    eidtBtn(id, msg){
      this.pagination.currentPage = this.currentPage
      const params = {
        rows: this.pagination.pageSize,
        page: 1,
        partnerName: typeof(this.searchForm.partnerName) == 'string' ? this.searchForm.partnerName.trim() : this.searchForm.partnerName,
        parentName: typeof(this.searchForm.parentName) == 'string' ? this.searchForm.parentName.trim() : this.searchForm.parentName
      }
      this.$refs.modalEditRef.openModal(id, msg, this.paramsBtn || params)
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    opSubjectList() {
      const params = {}
      opSubjectList(params).then( val => val.data.code == 200 ? this.opNameArray = val.data.data : '' )
    },
    handleChangeOption(value) {
      this.valueOption = value;
      this.opSubjectListMaterial = this.opNameArray.find( item => { return item.id == value} )
    },
    resetSearch() {
      let restData = {
        partnerName: "",
        opName: "",
      };
      this.valueOption = undefined
      this.searchForm = restData
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
    onSubmit(page,flag) {
      this.loading = true;
      const params = {
        rows: this.pagination.pageSize,
        page: page ? page : this.pagination.currentPage,
        partnerName: typeof(this.searchForm.partnerName) == 'string' ? this.searchForm.partnerName.trim() : this.searchForm.partnerName,
        parentName: typeof(this.searchForm.parentName) == 'string' ? this.searchForm.parentName.trim() : this.searchForm.parentName
      }
      if (page) {
        this.currentPage = 1
      }
      if (flag) {
        this.paramsBtn = this.deepClone(params)
      }
      partnerListPartnerStoreByPartnerDto(params).then(
        val => {
          this.loading = false;
          val.data.rows.map(
            item => {
              item.createDate = moment(item.createDate).format("YYYY-MM-DD HH:mm:ss")
            }
          )
          this.data = val.data.rows
          this.pagination.total = val.data.total
        }
      ).catch( () => this.loading = false)
    },
    onSubmitForPagination() {
      this.loading = true;
      if (this.paramsBtn) {
        this.paramsBtn.rows = this.pagination.pageSize
        this.paramsBtn.page = this.pagination.currentPage
      } else {
        const params = {
          rows: this.pagination.pageSize,
          page: this.pagination.currentPage,
          partnerName: typeof(this.searchForm.partnerName) == 'string' ? this.searchForm.partnerName.trim() : this.searchForm.partnerName,
          parentName: typeof(this.searchForm.parentName) == 'string' ? this.searchForm.parentName.trim() : this.searchForm.parentName
        }
        this.paramsBtn = this.deepClone(params)
      }
      partnerListPartnerStoreByPartnerDto(this.paramsBtn).then(
        val => {
          this.loading = false;
          val.data.rows.map(
            item => {
              item.createDate = moment(item.createDate).format("YYYY-MM-DD HH:mm:ss")
            }
          )
          this.data = val.data.rows
          this.pagination.total = val.data.total
        }
      ).catch( () => this.loading = false)
    },
    refresh(params) {
      this.loading = true
      partnerListPartnerStoreByPartnerDto(params).then(
        val => {
          this.loading = false;
          val.data.rows.map(
            item => {
              item.createDate = moment(item.createDate).format("YYYY-MM-DD HH:mm:ss")
            }
          )
          this.data = val.data.rows
          this.pagination.total = val.data.total
        }
      ).catch( () => this.loading = false)
    },
    deleteIt(id) {
      const params = {id: id}
      partnerDelete(params).then(
        val => {
          if (val.data.code == 200) {
            this.onSubmitForPagination()
            this.$message.success('删除成功')
          } else {
            this.$message.warn('删除失败')
          }
        }
      )
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
      this.currentPage = current
      this.pagination.currentPage = current
      this.pagination.pageSize = pageSize
      this.onSubmitForPagination()
    },
  },
  activated() {
    this.adminOrgId = localStorage.getItem('orgId')
    this.onSubmitForPagination()
    this.opSubjectList()
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>