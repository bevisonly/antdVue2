<template>
  <div class="finalTop">
    <div class="topContainer">
      <div class="topBox" v-show="fullscreenSwitch">
        <p class="topQuery">筛选查询</p>
        <div class="formContainer">
          <a-row :gutter="[15, 10]">
            <a-col :span="8">
              <a-range-picker
                style="width: 100%"
                show-time
                dropdownClassName="noShowTimeStyle"
                valueFormat="YYYY-MM-DD HH:mm:ss"
                v-model="searchForm.dateGroup"
                :placeholder="['开始发起日期', '截至发起日期']"
                @change="changeDate"
              />
            </a-col>
            <a-col :span="6">
              <a-input class="inputOrderId" v-model.trim="searchForm.sno" placeholder="请输入需求/销售订单编号" allowClear />
            </a-col>
            <a-col :span="6">
              <a-input class="inputPurchaseName" v-model.trim="searchForm.buyerAccount" placeholder="请输入账户名称" allowClear />
            </a-col>
            <a-col :span="4">
              <a-button class="ant-button" type="primary" @click="resetSearch">清空</a-button>
              <a-button type="primary" @click="onSubmit">查询</a-button>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="bottomBox" :style="{border: !fullscreenSwitch ? 0 : ''}">
        <p class="bottomTitle" v-show="fullscreenSwitch">
          结果列表
        </p>
        <div class="tableContainer">
          <div class="topButton flex-sb">
            <a-button-group class="buttonGroup">
              <a-button :loading="exportLoading" type="primary" :disabled="!hasPermission('requireOrder_export')" @click="downloadOrder">
                导出订单
              </a-button>
              <a-button type="primary" :disabled="!hasPermission('require_order_batch_purchase')" @click="batchPurchase()">批量采购</a-button>
            </a-button-group>
            <a-button-group class="a-button-group">
              <a-button class="a-button" type="primary" icon="sync" title="刷新数据" @click="reloadTable"></a-button>
              <a-button class="a-button" type="primary" icon="fullscreen" title="全屏" @click="switchFullscreen"></a-button>
              <checkboxList v-model="columns" width="300" />
            </a-button-group>
          </div>
          <a-table
            style="margin: 10px 0 0"
            bordered
            ref="tableRef"
            :columns="columns"
            :data-source="data"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :loading='loading'
            rowKey="id"
            :scroll="{x: 300, y: data[10] ? 560 : 0}"
            :pagination="{showTotal: ()=>`共 ${paginationTotal} 条`,showSizeChanger: true,showQuickJumper: paginationTotal/271 > 1}"
          >
            <div slot="sno" slot-scope="text, record">
              <a-button class="blueunderlinefonthover" type="link" @click="lookUpDedails(record.id)">{{record.sno}}</a-button>
            </div>
            <div slot="soSno" slot-scope="text, record">
              <a-popover trigger="hover" placement="right">
                <template slot="content">
                  <div style="max-width:160px; margin:0; word-wrap:break-word; color:#1900ff;">
                    {{record.soSno}}
                  </div>
                </template>
                <p style="width:156px; margin:0; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                  {{record.soSno}}
                </p>
              </a-popover>
            </div>
            <div slot="soType" slot-scope="text, record">
              <span>
                {{
                    record.soType == 1 ? '销售订单':
                    record.soType == 2 ? '库存单':
                    record.soType == 3 ? '服务单':
                    record.soType == 4 ? '换货单':
                    record.soType == 5 ? '直送单': '采销一体单'
                }}
              </span>
            </div>
            <div slot="operation" slot-scope="text, record">
              <a-button class="bluefonthover" type="link" :disabled="!hasPermission('requireOrder_view')" @click="lookUpDedails(record.id)">查看</a-button>
              <a-button class="bluefonthover" type="link" :disabled="!hasPermission('requireOrder_add')" @click="purchase(record.id)">采购</a-button>
              <a-button class="bluefonthover" type="link" :disabled="!hasPermission('requireOrder_print')" @click="print(record.id)">打印</a-button>
              <a-popconfirm placement="left" title="当前需求单,确定作废吗？" ok-text="确定" cancel-text="取消" @confirm="confirm(record.id)">
                <a-icon slot="icon" type="question-circle-o" style="color: red" />
                <a-button class="redfonthover" type="link" :disabled="!hasPermission('require_order_delete')" >作废</a-button>
              </a-popconfirm>
            </div>
          </a-table>
        </div>
      </div>
    </div>
    <modalDetails ref="modalDetailsRef"></modalDetails>
  </div>
</template>

<script>
import {
  requireOrderListPage,
  requireOrderInvalid,
  requireOrderFindInfo,
  requireOrderExport
} from "@/services/purchaseNeed.js";
import modalDetails from './modalDetails'
const columns = [
  {title: '采购需求订单编号', dataIndex: 'sno', width: 200, scopedSlots: { customRender: "sno" }, sorter: (a, b) => +(b.sno.match(/\d{17}(?=[\d]{0}$)/)[0]) - +(a.sno.match(/\d{17}(?=[\d]{0}$)/)[0])},
  {title: '销售订单编号', dataIndex: 'soSno', width: 180, scopedSlots: { customRender: "soSno" }, sorter: (a, b) => a.match(/\d/g).join('') - b.match(/\d/g).join('')},
  {title: '订单类型', dataIndex: 'soType', width: 200, scopedSlots: { customRender: "soType" }, sorter: (a, b) => a.soType.length - b.soType.length},
  {title: '采购账户', dataIndex: 'buyerAccount', width: 280, sorter: (a, b) => a.buyerAccount.length - b.buyerAccount.length},
  {title: '需求单提交时间', dataIndex: 'createDate', width: 200, sorter: (a, b) => new Date(a.createDate).getTime() - new Date(b.createDate).getTime()},
  {title: '需求重量(kg)', dataIndex: 'roughWeight', width: 200, sorter: (a, b) => a.roughWeight - b.roughWeight },
  {title: '销售处理人', dataIndex: 'createUser', width: 200, sorter: (a, b) => a.createUser.length - b.createUser.length},
  {title: '运营主体', dataIndex: 'opName', width: 300, sorter: (a, b) => a.invAvailableType.length - b.invAvailableType.length},
  {title: '操作', dataIndex: 'operation', width: 300, fixed: 'right', align: 'center', scopedSlots: { customRender: "operation" }},
]
export default {
  name: "reportSettlement",
  components: { modalDetails },
  data() {
    return {
      columns,
      fullscreenSwitch: true,
      searchForm: {
        beginTime: "",
        endTime: "",
        sno: "",
        buyerAccount: "",
        dateGroup: [],
      },
      supplierForm: {
        supplier: ''
      },
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
      pageSizeOptions: ["10", "20", "50", "100"],
      pagination: {},
      loading: false,
      exportLoading: false,
      dataSelected: []
    };
  },
  methods: {
    changeDate() {
      this.searchForm.beginTime = this.searchForm.dateGroup[0] || "";
      this.searchForm.endTime = this.searchForm.dateGroup[1] || "";
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    lookUpDedails(id){
      this.$refs.modalDetailsRef.openModal(id);
    },
    getDataInfo(id) {
      const params = { id: id }
      requireOrderFindInfo(params).then(
        res => {
          this.dataBaseInfo = res.data.data
        }
      )
    },
    batchPurchase() {
      //! 同步 获取被选择的数据的采购用户
      this.data.find(item =>{
        this.selectedRowKeys.find(val =>{
          if (item.id == val) {
            this.dataSelected.push(item.buyerAccount)
          }
        })
      })
      // 判断采购用户是否为同一个
      let ifSameCustomer = this.dataSelected.every(res => {return this.dataSelected[0] == res})
      this.dataSelected = []
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('当前没有选择任何数据,无法采购...')
      } else if (!ifSameCustomer) {
        this.$message.error('批量采购的采购客户需是相同的...')
      } else {
        this.$router.push({
          path:'/enterSaleStore/purchase/requireOrderConfirm',
          query:{id:this.selectedRowKeys}
        })
      }
      this.selectedRowKeys = []
    },
    purchase(id) {
      this.$router.push({
        path:'/enterSaleStore/purchase/requireOrderConfirm',
        query:{id:id}
      })
    },
    print(id) {
      if (this.selectedRowKeys.length <= 1) {
        this.$refs.modalDetailsRef.openModal(id, 'print');
      } else {
        this.$message.warn('仅支持单条数据打印,请选择一条数据再打印')
      }
    },
    confirm(id) {
      requireOrderInvalid({id}).then(res => {
        if (res.data.code == 200) {
          this.onSubmit()
          this.$message.success('已为您作废...')
        } else {
          this.$message.error('作废失败,该销售订单下没有商品......')
        }
      })
    },
    resetSearch() {
      let restData = {
        beginTime: "",
        endTime: "",
        sno: "",
        buyerAccount: "",
        dateGroup: []
      };
      this.searchForm = restData;
    },
    onSubmit() {
      this.loading = true;
      const params = {
        sno: this.searchForm.sno,
        buyerAccount: this.searchForm.buyerAccount,
        beginTime: this.searchForm.beginTime,
        endTime: this.searchForm.endTime,
      };
      requireOrderListPage(params).then((res) => {
        this.paginationTotal = res.data.total;
        this.data = res.data.rows instanceof Array ? res.data.rows.reverse() : res.data.rows;
        this.loading = false;
      }).catch(() => this.loading = false);
    },
    getErrExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    downloadOrder() {
      this.exportLoading = true
      const params = {
        sno: this.searchForm.sno,
        buyerAccount: this.searchForm.buyerAccount,
        beginTime: this.searchForm.beginTime,
        endTime: this.searchForm.endTime,
      }
      requireOrderExport(params).then(res => {
        this.exportLoading = false
        if (res.data.type === "text/html") {
          this.$message.error('下载失败')
        } else {
          this.getErrExcel(res.data, '采购需求列表');
        }
      }).catch(() => this.exportLoading = false)
    },
    reloadTable() {
      this.resetSearch();
      this.onSubmit();
    },
    switchFullscreen() {
      this.fullscreenSwitch = !this.fullscreenSwitch;
    },
  },
  activated() {
    this.onSubmit();
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>