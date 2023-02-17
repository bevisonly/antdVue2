<template>
  <div class="finalTop">
    <div class="queryInfo">
      <p class="queryInfoP">筛选查询 <a-icon type="search" /></p>
      <a-form-model :model="form">
        <a-row>
          <a-col :span="24">
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-select placeholder="是否公开，默认为全部" v-model="form.isPublic" allowClear>
                <a-select-option value="" > 全部 </a-select-option>
                <a-select-option value="0" > 公开 </a-select-option>
                <a-select-option value="1" > 私有 </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请选择数据类型" v-model="form.type" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入字段值" v-model="form.dicText" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入字段编码" v-model="form.dicCode" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入键值" v-model="form.keyName" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle formItemStylewidth">
              <a-input placeholder="请输入备注" v-model="form.remark" allowClear></a-input>
            </a-form-model-item>
            <a-form-model-item class="formItemStyle">
              <a-button class="ant-button" type="primary" icon="redo" @click="clearForm">清空</a-button>
              <a-button class="ant-button" type="primary" icon="search" @click="onSubmit('search')">查询</a-button>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="bottomBox">
      <p class="bottomTitle">
        结果列表 <a-icon type="book" />
      </p>
      <div class="tableContainer">
        <div class="topButton">
          <a-button class="marginRight" type="primary" :disabled="!hasPermission('dataSource_add')" @click="openNewAddModal">新增</a-button>
          <a-button class="marginRight" type="primary" :disabled="!hasPermission('dataSource_deleteMore')" @click="batchDelete">批量删除</a-button>
          <a-button type="primary" :disabled="!hasPermission('dataSource_updateMore')" @click="batchUpdate">批量更新</a-button>
        </div>
        <a-table
          class="tableStyle"
          bordered
          ref="tableRef"
          :data-source="data"
          :loading='loading'
          rowKey="id"
          size="small"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :scroll="{ x: 307.778, y: data.length < 50 && pagination.size < 50 ? 0 : 1300}"
          :pagination="false"
        >
          <a-table-column title="数据类型" data-index="type" :width="200">
            <span slot-scope="text, record" @click="handleChange(record.type, record.key, 'type', record.id)">
              <a-input v-model="record.type"></a-input>
            </span>
          </a-table-column>
          <a-table-column title="字段值" data-index="dicText" :width="360">
            <span slot-scope="text, record">
              <a-input v-model="record.dicText"></a-input>
            </span>
          </a-table-column>
          <a-table-column title="键值" data-index="keyName" :width="200">
            <span slot-scope="text, record">
              <a-input v-model="record.keyName"></a-input>
            </span>
          </a-table-column>
          <a-table-column title="字段编码" data-index="dicCode" :width="160">
            <span slot-scope="text, record">
              <a-input v-model="record.dicCode"></a-input>
            </span>
          </a-table-column>
          <a-table-column title="是否公开" data-index="isPulic" :width="120">
            <span slot-scope="text, record">
              <a-switch
                checked-children="公开"
                un-checked-children="私有"
                :checked="record.isPublic == 0 ? true : false"
                @click="changeIsPublic(record.isPublic, record.key, 'isPublic', record.id)"
              />
            </span>
          </a-table-column>
          <a-table-column title="备注" data-index="remark" :width="250">
            <span slot-scope="text, record">
              <a-input v-model="record.remark"></a-input>
            </span>
          </a-table-column>
          <a-table-column title="创建人" data-index="createUser" :width="200"/>
          <a-table-column title="创建时间" data-index="createDate" :width="180"/>
          <a-table-column title="维护时间" data-index="updateDate" :width="180"/>
          <a-table-column title="操作" align="center" fixed='right' data-index="operation" :width="220">
            <template slot-scope="text, record">
              <a-button class="greenfont redfonthover cursorPin" type="link" :disabled="!hasPermission('dataSource_update')" @click="save(record)">保存</a-button>
              <a-popconfirm placement="left" title="确定删除当前数据吗" ok-text="确定" cancel-text="取消" :disabled="!hasPermission('dataSource_delete')" @confirm="confirm(record.id)">
                <a-button class="greenfont redfonthover cursorPin" type="link" :disabled="!hasPermission('dataSource_delete')">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </a-table>
        <div class="paginationContainer flex-ed">
          <a-pagination
            :pageSizeOptions='pageSizeOptions'
            v-model="pagination.page"
            :pageSize="pagination.size"
            :total="pagination.total"
            :show-total="() => `共 ${pagination.total} 条`"
            show-size-changer
            :show-quick-jumper="pagination.total >= 1000 ? true : false"
            @showSizeChange="paginationSize"
            @change="paginationPage"
          />
        </div>
      </div>
    </div>
    <modalNewAdd ref="modalNewAddRef"></modalNewAdd>
  </div>
</template>

<script>
import {
  abolish,
  update,
  search
} from "@/services/baseDataMa/dataSource.js";
import modalNewAdd from './modalNewAdd'
export default {
  name: "dataSource",
  components: { modalNewAdd },
  data() {
    return {
      visible: false,
      form: {
        type: undefined,
        dicText: undefined,
        isPublic: undefined,
        dicCode: undefined,
        keyName: undefined,
        remark: undefined
      },
      copyParams: {},
      data: [],
      selectedRowKeys: [],
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
      loading: false,
    };
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    save(record) {
      let params = {
        id: record.id,
        isPublic: record.isPublic,
        type: record.type,
        dicText: record.dicText,
        dicCode: record.dicCode,
        remark: record.remark,
        keyName: record.keyName,
        version: record.version
      }
      update({list: [params]}).then(res => {
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success("更新成功"+res.data.message)
        }
      })
    },
    batchDelete() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请先勾选数据")
        return
      }
      abolish({ids: this.selectedRowKeys.join(",")}).then(res => {
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success("批量删除成功"+res.data.message)
        }
      })
    },
    batchUpdate() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("当前尚未选择任何数据")
        return
      }
      let params = []
      this.data.forEach(item => this.selectedRowKeys.find(val => {
        if (item.id == val) {
          params.push({
            id: item.id,
            isPublic: item.isPublic,
            type: item.type,
            dicText: item.dicText,
            dicCode: item.dicCode,
            remark: item.remark,
            keyName: item.keyName,
            version: item.version
          })
          return !0
        }
      }))
      update({list: params}).then(res => {
        if (res.data.code == 200) {
          this.selectedRowKeys = []
          this.submitPagination()
          this.$message.success("更新成功"+res.data.message)
        } else {
          this.selectedRowKeys = []
          this.$message.error("更新失败"+res.data.message)
        }
      })
    },
    confirm(id) {
      abolish({ids: id}).then(res => {
        if (res.data.code == 200) {
          this.submitPagination()
          this.$message.success("删除成功"+res.data.message)
        }
      })
    },
    changeIsPublic(value, key, column, id=0) {
      let keyId = id
      this.data.find((item,i) => {
        if (item.id == id) {
          keyId = i
          return !0
        }
      })
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = +!value
        this.data = newData
      }
    },
    openNewAddModal() {
      this.$refs.modalNewAddRef.openModal();
    },
    clearForm() {
      this.form = {
        type: undefined,
        dicText: undefined,
        isPublic: undefined,
        dicCode: undefined,
        keyName: undefined,
        remark: undefined
      }
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
    onSubmit(flag) {
      this.pagination.page = 1
      const params = {
        rows: this.pagination.size,
        page: this.pagination.page,
        ...this.form
      }
      this.loading = true;
      if (flag) {
        this.copyParams = this.deepClone(params)
      }
      search(params).then(res => {
        this.loading = false
        if (res.data.code == 200) {
          this.pagination.total = res.data.data.total || 0
          this.data = res.data.data.list
        }
      }).catch(() => this.loading = false)
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          rows: this.pagination.size,
          page: this.pagination.page,
          ...this.form
        })
      }
      this.loading = true
      search(this.copyParams).then(res => {
        this.loading = false
        if (res.data.code == 200) {
          this.pagination.total = res.data.data.total || 0
          this.data = res.data.data.list
        }
      }).catch(() => this.loading = false)
    },
    paginationPage(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage,pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    }
  },
  activated() {
    this.submitPagination();
  },
};
</script>

<style lang="less" scoped>
@import "index";
</style>