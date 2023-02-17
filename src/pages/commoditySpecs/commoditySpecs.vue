<template>
  <div class="finalTop">
    <div class="topContainer">
      <div class="topBox" v-show="fullscreenSwitch">
        <p class="topQuery">
          筛选查询 <a-icon type="search" />
        </p>
        <div class="formContainer">
          <a-form-model ref="searchForm" :model="searchForm" layout="vertical">
            <a-row>
              <a-col :span="24">
                <a-form-model-item class="forBorder" label="编码">
                  <a-input v-model="searchForm.specCode" placeholder="请输入编码" :style="{width: `${widthInput}`}" style="margin-left: 15px;"></a-input>
                  <a-button class="ant-button" type="primary" icon="sync" @click="resetSearch">清空</a-button>
                  <a-button class="ant-button" type="primary" icon="search" @click="onSubmit">查询</a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="bottomBox">
        <p class="bottomTitle">
          规格列表 <a-icon type="book" />
        </p>
        <div class="tableContainer">
          <div class="topButton flex-sb">
            <div class="buttonGroup">
              <a-button type="primary" :disabled="!hasPermission('itemSpec_add')" @click="openNewSpecsModal">新增</a-button>
            </div>
            <a-button-group class="a-button-group">
              <a-button class="a-button" type="primary" icon="sync" title="刷新数据" @click="reloadTable"></a-button>
              <a-button class="a-button" type="primary" icon="fullscreen" title="全屏" @click="switchFullscreen"></a-button>
              <a-button class="a-button" type="primary" icon="bars" title="展示列" @click="openSelectColumnPopover">
                <a-popover v-model="visibleSelectColumnPopover" placement="bottomRight">
                  <template slot="title">
                    <span class="bluefont">隐藏/显示</span>
                  </template>
                  <template slot="content">
                    <a-checkbox-group @change="onChangeChecked">
                          <a-checkbox class="paintfonthover" value="specCode" :disabled="disabledFlage == 'specCode'" >编码</a-checkbox><br>
                          <a-checkbox class="paintfonthover" value="specName" :disabled="disabledFlage == 'specName'" >名称</a-checkbox><br>
                          <a-checkbox class="paintfonthover" value="description" :disabled="disabledFlage == 'description'" >描述</a-checkbox><br>
                          <a-checkbox class="paintfonthover" value="operation" :disabled="disabledFlage == 'operation'" >操作</a-checkbox>
                    </a-checkbox-group>
                  </template>
                </a-popover>
              </a-button>
            </a-button-group>
          </div>
          <a-table
            style="margin: 10px 16px 0 16px"
            bordered
            ref="tableRef"
            :data-source="data"
            :loading='loading'
            rowKey="id"
            :scroll="{ x: 307.778 }"
            :pagination="{showTotal: ()=>`共 ${paginationTotal} 条`,showSizeChanger: true,showQuickJumper: paginationTotal/271 > 1}"
          >
            <a-table-column v-if="vIf.specCode" key="specCode" title="编码" data-index="specCode" :width="70" :sorter="(a, b) => a.specCode.length - b.specCode.length"/>
            <a-table-column v-if="vIf.specName" key="specName" title="名称" data-index="specName" :width="110" :sorter="(a, b) => a.specName.length - b.specName.length"/>
              <!-- 4.1.0 -->
            <a-table-column v-if="vIf.amount" key="amount" title="数量" data-index="amount" :width="80" :sorter="(a, b) => a.amount.length - b.amount.length"/>
            <a-table-column v-if="vIf.defUom" key="defUom" title="单位" data-index="defUom" :width="80" :sorter="(a, b) => a.defUom.length - b.defUom.length"/>
              <!--  -->
            <a-table-column v-if="vIf.description" key="description" title="描述" data-index="description" :width="150" :sorter="(a, b) => a.description.length - b.description.length"/>
            <a-table-column v-if="vIf.operation" key="operation" title="操作" data-index="operation" :width="100" align='center' >
              <template slot-scope="text, record">
                  <span class="greenfont bluefonthover cursorPin" v-show="hasPermission('itemSpecChild_list')" @click="openSpecsDedailsModal(record.specCode)">&nbsp;<a-icon type="solution" />规格明细</span>
                  <span class="greenfont bluefonthover cursorPin" v-show="hasPermission('itemSpecChild_add')" @click="openNewSpecsModal(record.id,'编辑规格',record.specCode,record.specName,record.amount,record.defUom,record.description,record.createUser,record.createDate,record.version)">&nbsp;<a-icon type="form" />修改</span>
                  <a-popconfirm placement="left" title="删除当前数据，及其子数据吗？" ok-text="确定" cancel-text="取消" @confirm="confirm(record.id,record.specCode)">
                    <a-icon slot="icon" type="question-circle-o" style="color: red" />
                    <span class="greenfont redfonthover cursorPin" v-show="hasPermission('item_spec_delete')">&nbsp;<a-icon type="minus-circle" />删除</span>
                  </a-popconfirm>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </div>
    </div>
    <modalNewSpecs ref="modalNewSpecsRef"></modalNewSpecs>
    <modalSpecsDedails ref="modalSpecsDedailsRef"></modalSpecsDedails>
  </div>
</template>

<script>
import {
  itemSpecListPage,
  itemSpecDelete
} from "@/services/commoditySpecs.js";
import modalNewSpecs from './modalNewSpecs'
import modalSpecsDedails from './modalSpecsDedails'
export default {
  name: "reportSettlement",
  components: { modalNewSpecs, modalSpecsDedails },
  data() {
    return {
      fullscreenSwitch: true,
      widthInput: "225px",
      searchForm: {
        specCode: "",
      },
      visibleSelectColumnPopover: false,
      disabledFlage: 0,
      data: [],
      dataBaseInfo: {},
      vIf: {
        specCode: true,
        specName: true,
        //4.1.0
        amount: true,
        defUom: true,
        ////-------
        description: true,
        operation: true,
      },
      columnCheck: ['specCode','specName','amount','defUom','description','operation'],
      ifShow: true,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "15", "20", "30"],
      pagination: {},
      loading: false,
      baseURL: '',
    };
  },
  methods: {
    openNewSpecsModal(id,editFlag,specCode,specName,amount,defUom,description,createUser,createDate,version) {
      this.$refs.modalNewSpecsRef.openModal(id,editFlag,specCode,specName,amount,defUom,description,createUser,createDate,version);
    },
    openSpecsDedailsModal(specCode) {
      this.$refs.modalSpecsDedailsRef.openModal(specCode);
    },
    confirm(id,info) {
      const params = {id: id}
      itemSpecDelete(params).then(
        res => {
          if (res.data.code == 200) {
            this.reloadTable();
            this.$message.success('已为您删除,编码为'+info+'的数据')
          } else {
            this.$message.warn('删除失败!...')
          }
        }
      )
    },
    resetSearch() {
      let restData = {
        specCode: "",
      };
      this.searchForm = restData;
    },
    onSubmit() {
      const params = {
        page: 1,
        sort: "id",
        order: "desc",
        specCode: this.searchForm.specCode
      }
      this.loading = true;
      itemSpecListPage(params).then(
        res => {
          this.paginationTotal = res.data.total
          this.data = res.data.rows
          this.loading = false;
        }
      )
    },
    reloadTable() {
      this.onSubmit();
    },
    switchFullscreen() {
      this.fullscreenSwitch = !this.fullscreenSwitch;
    },
    openSelectColumnPopover() {
      this.visibleSelectColumnPopover = true;
    },
    onChangeChecked(checkedValues) {
      if (checkedValues.length == 4) {
        this.disabledFlage = checkedValues[3];
        this.$message.warn('请至少保留一个...')
        return
      } else {
        this.disabledFlage = 0;
      }
      Object.keys(this.vIf).map(
        key => checkedValues.includes(key)? this.vIf[key] = false : this.vIf[key] = true
      )
    },
  },
  activated() {
    document.body.clientWidth <= 1366 ? this.widthInput = '225px' : this.widthInput = '307.778px'
    this.onSubmit();
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>