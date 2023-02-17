<template>
  <div class="finalTop">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询</p>
      <div class="queryInfoDiv">
        <a-form-model ref="searchFormRef" :model="searchForm" layout="horizontal">
          <a-row>
            <a-form-model-item class="floatLeft widthTime">
              <a-range-picker show-time allowClear valueFormat="YYYY-MM-DD HH:mm:ss" v-model="dateGroup" @change="changeDate"/>
            </a-form-model-item>
            <a-form-model-item class="floatLeft widthPercent">
              <a-input v-model="searchForm.proName" placeholder="请输入商品名称"></a-input>
            </a-form-model-item>
            <a-form-model-item class="floatLeft marginRight">
              <a-select v-model="searchForm.state" placeholder="请选择审核状态">
                <a-select-option value=''>{{'全部'}}</a-select-option>
                <a-select-option value='0'>{{'待审核'}}</a-select-option>
                <a-select-option value='1'>{{'已审核'}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="floatLeft widthPercent">
              <a-select style="width: 100%;" v-model="searchForm.source" allowClear placeholder="损溢状态选择">
                <a-select-option value='1'>{{'手工报损'}}</a-select-option>
                <a-select-option value='3'>{{'盘点报损'}}</a-select-option>
                <a-select-option value='5'>{{'退货报损'}}</a-select-option>
                <a-select-option value='2'>{{'手工报溢'}}</a-select-option>
                <a-select-option value='4'>{{'盘点报溢'}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="floatLeft widthPercent">
              <a-select class="selectOption" placeholder="仓库选择" v-model="searchForm.wareHouseName" allowClear>
                <a-select-option v-for="item in warehousList" :key="item.id" >{{item.whName}}</a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="floatLeft">
              <a-button class="ant-button" type="primary" @click="queryInfo">查询</a-button>
            </a-form-model-item>
            <a-form-model-item class="floatLeft" v-if="whichPage != 'lossReport_'">
              <a-button v-show="!btnPermision('fix')" style="margin-left: 15px;" type="primary" title="修复旧数据" :loading="loadingFix" @click="fixOldData">修复</a-button>
            </a-form-model-item>
          </a-row>
        </a-form-model>
      </div>
    </div>
    <div class="tableInfo">
      <div class="addData">
        <a-button type="primary" :disabled="btnPermision('new')" @click="openEditPage('add', '')">新增</a-button>
      </div>
      <a-table
        bordered
        ref="tableRef"
        :data-source="dataTable"
        :loading='loading'
        rowKey="id"
        :scroll="{ x: 307.778 }"
        :pagination='false'
      >
        <a-table-column key="loNumber" title="损益单号" data-index="loNumber" :width="190"/>
        <a-table-column key="auditTime" title="审核时间" data-index="auditTime" :width="180"/>
        <a-table-column key="wareHouseName" title="仓库名称" data-index="wareHouseName" :width="160"/>
        <a-table-column key="loType" title="损益类型" data-index="loType" :width="146">
          <template slot-scope="text, record">
            <a-tag v-show="record.loType == 1" color="#f50">按金额报损</a-tag>
            <a-tag v-show="record.loType == 3" color="#87d000">按数量报损</a-tag>
            <a-tag v-show="record.loType == 2" color="#108ee9">
              <span style="letter-spacing: 36px;">报</span>溢
            </a-tag>
          </template>
        </a-table-column>
        <a-table-column key="proNum" title="损益数量" data-index="proNum" :width="100"/>
        <a-table-column key="price" title="损益金额" data-index="price" :width="100"/>
        <a-table-column key="createUser" title="制单人" data-index="createUser" :width="140"/>
        <a-table-column key="state" title="状态" data-index="state" :width="76">
          <template slot-scope="text, record">
            <span :class="record.state == 1 ? 'greenfont' : ''">{{record.state == 1? '已审核' : '待审核'}}</span>
          </template>
        </a-table-column>
        <a-table-column key="source" title="来源" data-index="source" :width="suitableTdWidth">
          <template slot-scope="text, record">
            <span>
              {{
                record.source == 1? '手工报损' :
                record.source == 2? '手工报溢' :
                record.source == 3? '盘点报损' :
                record.source == 4? '盘点报溢' :
                record.source == 5? '退回报损' :
                record.source == 6? '分拣加工报损' : record.source
              }}
            </span>
          </template>
        </a-table-column>
        <a-table-column key="operation" title="操作" fixed='right' data-index="operation" :width="360" align='center'>
          <template slot-scope="text, record">
            <a-button class="bluefonthover" type="link" :disabled="btnPermision('details')" @click="detailsInfo(record.id, record.loType)">详情</a-button>
            <a-button class="bluefonthover" type="link" :disabled="btnPermision('check') && record.source != 6" @click="openEditPage('check', record.id)">审核</a-button>
            <a-button class="bluefonthover" type="link" :disabled="btnPermision('edit') && record.source != 6" @click="openEditPage('edit', record.id)">编辑</a-button>
            <a-button class="bluefonthover" type="link" :disabled="btnPermision('export')" @click="downloadExcel(record.id)">导出</a-button>
            <a-popconfirm placement="bottom" title="确定删除吗？" :disabled="btnPermision('delete')" @confirm="confirm(record.id, record.state)">
              <a-icon slot="icon" type="minus-circle" style="color: red"/>
              <a-button class="redfonthover" type="link" :disabled="btnPermision('delete')">删除</a-button>
            </a-popconfirm>
          </template>
        </a-table-column>
      </a-table>
      <div class="paginationContainer flex-ed">
        <a-pagination
          show-size-changer
          :pageSizeOptions='pageSizeOptions'
          :default-current="1"
          :total="pagination.total"
          :show-total="total => `共 ${pagination.total} 条`"
          @showSizeChange="onShowSizeChange"
          @change="onPageSizeChange"
        />
      </div>
    </div>
    <modalNewLoseAndOverflower ref="modalNewLoseAndOverflowerRef"></modalNewLoseAndOverflower>
    <modalDetails ref="modalDetailsRef"></modalDetails>
  </div>
</template>

<script>
import modalNewLoseAndOverflower from './modalNewLoseAndOverflower'
import modalDetails from './modalDetails'
import {
  lossOverflowGetData,
  lossOverflowDelete,
  warehouseList,
  fixOldData,
  exportData
} from '../../services/showLoseAndOverflower'
export default {
  name: "showLoseAndOverflower",
  components: { modalNewLoseAndOverflower, modalDetails },
  data() {
    return {
      whichPage: 'warehouse_showloseoverflower_',
      searchForm: {
        startTime: undefined,
        endTime: undefined,
        proName: undefined,
        state: '0',
        source: undefined,
        wareHouseName: undefined
      },
      dateGroup: [],
      suitableTdWidth: 120,
      warehousList: [],
      dataTable: [],
      loading: false,
      loadingFix: false,
      pageSizeOptions: ["10", "20", "50", "100"],
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
    };
  },
  methods: {
    btnPermision(name) {
      return !this.hasPermission(this.whichPage + name)
    },
    fixOldData() {
      this.loadingFix = true
      fixOldData().then(() => {
        this.loadingFix = false
        this.$message.success('修复旧数据成功')
      }).catch(() => {
        this.$message.warn('修复失败')
        this.loadingFix = false
      })
    },
    changeDate() {
      this.searchForm.startTime = this.dateGroup[0];
      this.searchForm.endTime = this.dateGroup[1];
    },
    openEditPage(flag, id) {
      this.$refs.modalNewLoseAndOverflowerRef.openModal(flag, id);
    },
    detailsInfo(id, flag) {
      this.$refs.modalDetailsRef.openModal(id, flag);
    },
    queryInfo() {
      const params = {
        ...this.searchForm,
        currentPage: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
      }
      this.loading = true
      lossOverflowGetData(params).then(res => {
        if (res.data.code == '200') {
          this.pagination.total = res.data.data.total
          this.dataTable = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
        this.loading = false
      }).catch( () => this.loading = false )
    },
    getWarehoseList() {
      warehouseList({}).then(val => {
        if (val.data.code == '200') {
          this.warehousList = val.data.data
        }
      })
    },
    onPageSizeChange(current, pageSize) {
      this.pagination.currentPage = current == 0 ? 1 : current
      this.pagination.pageSize = pageSize
      this.queryInfo()
    },
    onShowSizeChange(current, pageSize) {
      this.pagination.currentPage = current == 0 ? 1 : current
      this.pagination.pageSize = pageSize
      this.queryInfo()
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadExcel(id) {
      this.$message.success('正在导出，请稍后')
      exportData({id: id}).then(res => {
        if (res.data.type == 'application/vnd.ms-excel' || res.data.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          let name = res.headers['content-disposition'] ? decodeURIComponent(res.headers['content-disposition']).match(/(?<=filename=).*(?=\.xl)/gm)[0] : '列表导出'
          this.getErrExcel(res.data, name)
        } else {
          this.$message.error('导出失败')
        }
      }).catch(e => this.$message.error('导出失败'+e))
    },
    confirm(id, state) {
      if (state === 1) {
        this.$message.error('已审核商品，不能删除')
        return
      }
      lossOverflowDelete({id}).then(val => {
        if (val.data.code == '200') {
          this.queryInfo()
          this.$message.success('删除成功')
        } else {
          this.$message.error(val.data.message)
        }
      })
    }
  },
  mounted() {
    this.$nextTick(()=>{
      window.addEventListener('resize', () => {
        document.querySelector('.paginationContainer')?.clientWidth > 1600 ? this.suitableTdWidth = '' : this.suitableTdWidth = 160
      });
    })
  },
  activated() {
    this.whichPage = this.$route.path?.includes('lossReport') ? 'lossReport_' : 'warehouse_showloseoverflower_'
    document.querySelector('.paginationContainer')?.clientWidth > 1600 ? this.suitableTdWidth = '' : this.suitableTdWidth = 160
    this.getWarehoseList()
    this.queryInfo()
  }
}
</script>

<style lang="less" scoped>
@import "index";
</style>