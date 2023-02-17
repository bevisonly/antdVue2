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
                  <a-input class="inputOrderId" v-model="searchForm.partnerName" placeholder="请输入客户/公司名称"></a-input>
                </a-form-model-item>
                <a-form-model-item class="floatLeft forBorder formItemPurchaseAccountName">
                  <a-select
                    class="inputPurchaseName"
                    show-search
                    :value="valueOption"
                    placeholder="请选择运营主体"
                    :default-active-first-option="false"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    allowClear
                    @change="handleChangeOption"
                  >
                    <a-select-option v-for="item in opNameArray" :key="item.id">
                      {{ item.opName }}
                    </a-select-option>
                  </a-select>
                  <a-button class="ant-button" type="primary" @click="resetSearch">清空</a-button>
                  <a-button class="ant-button" type="primary" @click="onSubmit(1, 'search')">查询</a-button>
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
            <a-button class="buttonGroup" type="primary" :disabled="!hasPermission('partner_add')" @click="addBtn('add')">新增</a-button>
            <a-button-group class="a-button-group">
              <a-button class="a-button" type="primary" icon="sync" title="刷新数据" @click="reloadTable"></a-button>
              <a-button class="a-button" type="primary" icon="fullscreen" title="全屏" @click="switchFullscreen"></a-button>
              <checkboxList v-model="columns" width="300" />
            </a-button-group>
          </div>
          <a-table
            style="margin-top: 10px"
            bordered
            :columns="columns"
            :data-source="data"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :loading='loading'
            rowKey="id"
            :scroll="{ x: 307.778 }"
            :pagination="false"
          >
            <template slot="partnerType" slot-scope="text, record">
              <span>{{record.partnerType == 20 ? '客户':''}}</span>
            </template>
            <template slot="isEnable" slot-scope="text, record">
              <span :class="record.isEnable == 1 ? 'greenfont' : ''">{{ record.isEnable == 1 ? '启动' : '禁用' }}</span>
            </template>
            <template slot="ifLimit" slot-scope="text, record">
              <span :class="record.ifLimit == 1 ? 'greenfont' : ''">{{ record.ifLimit == 1 ? '是' : '否' }}</span>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm v-if="record.ifLimit" placement="bottom"  ok-text="确定" cancel-text="取消" :disabled="!hasPermission('partner_limit') || adminOrgId != record.orgId ? true : false" @confirm="limitBtn(record.id, record.ifLimit)">
                <template slot="title">
                  <div class="break-word">请确认是否取消限额，取消限额后将不受额度限制！</div>
                </template>
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont bluefonthover" type='link' :disabled="!hasPermission('partner_limit') || adminOrgId != record.orgId ? true : false">是否限额</a-button>
              </a-popconfirm>
              <a-button v-else class="greenfont bluefonthover" type='link' :disabled="!hasPermission('partner_limit') || adminOrgId != record.orgId ? true : false" @click="limitBtn(record.id, record.ifLimit)">是否限额</a-button>
              <a-button class="greenfont bluefonthover" type="link" :disabled="!hasPermission('partner_update') || adminOrgId != record.orgId ? true : false" @click="eidtBtn(record.id, record)">编辑</a-button>
              <a-button class="greenfont bluefonthover" type='link' :disabled="!hasPermission('partner_onOff') || adminOrgId != record.orgId ? true : false" @click="onOffBtn(record.id, record.isEnable)">启禁</a-button>
              <a-popconfirm placement="bottom" title="确定删除吗？" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('partner_menu_delete') || adminOrgId != record.orgId ? true : false" @confirm="deleteIt(record.id)">
                <a-icon slot="icon" type="question-circle" style="color: red" />
                <a-button class="greenfont redfonthover" type="link" :disabled="!hasPermission('partner_menu_delete') || adminOrgId != record.orgId ? true : false">删除</a-button>
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
  partnerListPartnerByPartnerDto,
  partnerDelete,
  opSubjectList,
  customerInvalidinformation,
  customerLimitOperation
} from "@/services/customerManageList.js";
import modalEdit from './modalEdit'
const columns = [
  {title: '名称', dataIndex: 'partnerName', width: 250},
  {title: '公司简称', dataIndex: 'shortName', width: 180},
  {title: '行业简介', dataIndex: 'description', width: 200},
  {title: '所属运营主体', dataIndex: 'opName', width: 236},
  {title: '客户类型', dataIndex: 'partnerType', width: 166, scopedSlots: {customRender: "partnerType"}},
  {title: '启动状态', dataIndex: 'isEnable', width: 150, scopedSlots: {customRender: "isEnable"}},
  {title: '是否限额', dataIndex: 'ifLimit', width: 150, scopedSlots: {customRender: "ifLimit"}},
  {title: '建议额度（万元）', dataIndex: 'suggestAmount', width: 180},
  {title: '审批额度（万元）', dataIndex: 'approvalLimit', width: 150},
  {title: '联系人', dataIndex: 'contactName', width: 150},
  {title: '联系方式', dataIndex: 'contactPhone', width: 150},
  {title: '添加时间', dataIndex: 'createDate', width: 170},
  {title: '操作', dataIndex: 'operation', width: 340, align: "center", fixed: 'right', scopedSlots: {customRender: "operation"}},
]
export default {
  name: "customerManageList",
  components: { modalEdit },
  data() {
    return {
      columns,
      fullscreenSwitch: true,
      searchForm: {
        partnerName: "",
        opName: "",
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
      dataSelected: [],
      paramsBtn: undefined,
      adminOrgId: undefined
    };
  },
  methods: {
    addBtn(flag){
      const params = {
        rows: this.pagination.pageSize,
        page: 1,
      }
      this.$refs.modalEditRef.openModal(flag, undefined, params)
    },
    eidtBtn(id, msg){
      const params = {
        rows: this.pagination.pageSize,
        page: 1,
        partnerName: this.searchForm.partnerName,
        opName: this.opSubjectListMaterial?.opName == undefined ? '' : this.opSubjectListMaterial?.opName
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
    onOffBtn(id, isEnable) {
      customerInvalidinformation({id, isEnable}).then(val => {
        if (val.data.code == 200) {
          this.onSubmitForPagination()
          this.$message.success('执行成功')
        } else {
          this.$message.warn('执行失败,'+val.data.result, 1.5)
        }
      })
    },
    limitBtn(id, ifLimit) {
      customerLimitOperation({id, ifLimit}).then(val => {
        if (val.data.code == 200) {
          this.onSubmitForPagination()
          this.$message.success('执行成功')
        } else {
          this.$message.warn('执行失败,'+val.data.result, 1.5)
        }
      })
    },
    resetSearch() {
      let restData = {
        partnerName: "",
        opName: "",
      };
      this.valueOption = undefined
      this.opSubjectListMaterial = {}
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
    onSubmit(page, flag) {
      this.loading = true;
      const params = {
        rows: this.pagination.pageSize,
        page: page ? page : this.pagination.currentPage,
        partnerName: this.searchForm.partnerName,
        opName: this.opSubjectListMaterial?.opName == undefined ? '' : this.opSubjectListMaterial?.opName
      }
      if (page) {
        this.currentPage = page
      }
      if (flag === 'search') {
        this.paramsBtn = this.deepClone(params)
      }
      partnerListPartnerByPartnerDto(params).then(
        val => {
          this.loading = false;
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
          partnerName: this.searchForm.partnerName,
          opName: this.opSubjectListMaterial?.opName == undefined ? '' : this.opSubjectListMaterial?.opName
        }
        this.paramsBtn = this.deepClone(params)
      }
      partnerListPartnerByPartnerDto(this.paramsBtn).then(
        val => {
          this.loading = false;
          this.data = val.data.rows
          this.pagination.total = val.data.total
        }
      ).catch( () => this.loading = false)
    },
    refresh(params) {
      this.loading = true;
      partnerListPartnerByPartnerDto(params).then(val => {
        this.loading = false;
        this.data = val.data.rows
        this.pagination.total = val.data.total
      }).catch( () => this.loading = false)
    },
    deleteIt(id) {
      const params = {id: id}
      partnerDelete(params).then(
        val => {
          if (val.data.code == 200) {
            this.onSubmitForPagination()
            this.$message.success('删除成功')
          } else {
            this.$message.warn(`删除失败,${val.data.message}`)
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
      this.pagination.currentPage = 1
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
<style>
.break-word{
  max-width: 200px;
  white-space: normal;
  word-break: break-all;
}
</style>