<template>
  <a-modal
    :width='980'
    :dialogStyle="{'top': '38px'}"
    v-model="visibleSpecsDedailsModal"
    title="规格详情"
    :footer="null"
    >
    <div class="finalTop">
      <div class="topContainer">
        <div class="bottomBox">
          <p class="bottomTitle" v-show="fullscreenSwitch">
            规格列表 <a-icon type="book" />
          </p>
          <div class="tableContainer">
            <div class="topButton flex-sb">
              <div class="buttonGroup">
                <a-button type="primary" @click="openNewSpecsModal('添加类型')">添加类型</a-button>
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
                            <a-checkbox class="paintfonthover" value="childSpecCode" :disabled="disabledFlage == 'childSpecCode'" >编码</a-checkbox><br>
                            <a-checkbox class="paintfonthover" value="childSpecName" :disabled="disabledFlage == 'childSpecName'" >名称</a-checkbox><br>
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
              <a-table-column v-if="vIf.childSpecCode" key="childSpecCode" title="编码" data-index="childSpecCode" :width="70" :sorter="(a, b) => a.childSpecCode.length - b.childSpecCode.length"/>
              <a-table-column v-if="vIf.childSpecName" key="childSpecName" title="名称" data-index="childSpecName" :width="110" :sorter="(a, b) => a.childSpecName.length - b.childSpecName.length"/>
                   <!-- 4.1.0 -->
            <a-table-column v-if="vIf.amount" key="amount" title="数量" data-index="amount" :width="80" :sorter="(a, b) => a.amount.length - b.amount.length"/>
            <a-table-column v-if="vIf.defUom" key="defUom" title="单位" data-index="defUom" :width="80" :sorter="(a, b) => a.defUom.length - b.defUom.length"/>
              <!--  -->
              <a-table-column v-if="vIf.description" key="description" title="描述" data-index="description" :width="150" :sorter="(a, b) => a.description.length - b.description.length"/>
              <a-table-column v-if="vIf.operation" key="operation" title="操作" data-index="operation" :width="70" align='center' >
                <template slot-scope="text, record">
                    <span class="greenfont bluefonthover cursorPin" @click="openNewSpecsModal('添加类型保存',record.id,record.childSpecCode,record.childSpecName,record.amount,record.defUom,record.description,record.version)">&nbsp;<a-icon type="form" />修改</span>
                    <a-popconfirm placement="left" title="删除当前数据，及其子数据吗？" ok-text="确定" cancel-text="取消" @confirm="confirm(record.id,record.childSpecName)">
                      <a-icon slot="icon" type="question-circle-o" style="color: red" />
                      <span class="greenfont redfonthover cursorPin">&nbsp;<a-icon type="minus-circle" />删除</span>
                    </a-popconfirm>
                </template>
              </a-table-column>
            </a-table>
            <!-- <div class="pagination-style flex-ed" v-if="ifShow">
              <a-pagination
                show-size-changer
                :total="paginationTotal"
                :show-total="total => `共 ${total} 条`"
                :pageSizeOptions="pageSizeOptions"
                @showSizeChange="onShowSizeChange"
                @change="onChange"
              />
            </div> -->
          </div>
        </div>
      </div>
      <modalNewSpecs ref="modalNewSpecsRef"></modalNewSpecs>
    </div>
  </a-modal>
</template>

<script>
import {
  itemSpecChildListPage,
  itemSpecChildDelete
  } from "@/services/commoditySpecs.js";
import moment from "moment";
import modalNewSpecs from './modalNewSpecs'
export default {
  name: "reportSettlement",
  components: { modalNewSpecs },
  data() {
    return {
      fullscreenSwitch: true,
      visibleSpecsDedailsModal: false,
      widthInput: "225px",
      specsCode: '',
      searchForm: {
        childSpecCode: "",
      },
      supplierForm: {
        supplier: ''
      },
      visibleSelectColumnPopover: false,
      disabledFlage: 0,
      data: [],
      vIf: {
        childSpecCode: true,
        childSpecName: true,
        amount: true,
        defUom: true,
        description: true,
        operation: true,
      },
      columnCheck: ['childSpecCode','childSpecName','amount','defUom','description','operation'],
      ifShow: true,
      current: 1,
      pageSize: 10,
      paginationTotal: 0,
      pageSizeOptions: ["10", "15", "20", "30"],
      pagination: {},
      loading: false,
    };
  },
  methods: {
    handleChange(value, key, column) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.data = newData;
      }
    },
    itemSpecChildListPage() {
      const params = {
        parentCode: this.specsCode || ''
      }
      itemSpecChildListPage(params).then(
        res => {
          this.data = res.data.rows
          this.paginationTotal = res.data.total
        }
      )
    },
    openModal(specsCode) {
      this.specsCode = specsCode
      this.itemSpecChildListPage()
      this.visibleSpecsDedailsModal = true;
    },
    openNewSpecsModal(editFlag,id,specsCode,specsName,amount,defUom,descripetion,version) {
      this.$refs.modalNewSpecsRef.openModal(this.specsCode,editFlag,id,specsCode,specsName,amount,defUom,descripetion,this.reloadTable,version);
    },
    moment,
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toUpperCase()
          .indexOf(input.toUpperCase()) >= 0
      );
    },
    resetSearch() {
      let restData = {
        childSpecCode: "",
      };
      this.searchForm = restData;
    },
    reloadTable() {
      this.itemSpecChildListPage()
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
    confirm(id,info) {
      const params = {
        id: id
      }
      itemSpecChildDelete(params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success('已为您删除'+info)
            this.reloadTable()
          } else {
            this.$message.warn('删除失败...')
          }
        }
      )
    }
  },
  created() {
    document.body.clientWidth <= 1366 ? this.widthInput = '225px' : this.widthInput = '307.778px'
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>