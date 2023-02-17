<template>
  <div class="mainTop">
    <div class="queryInfo">
      <a-form-model>
        <a-row>
          <a-col :span="24" class="colMargin">
            <a-button type="primary" icon="undo" v-refresh="submitBtn">获取更新</a-button>
          </a-col>
          <a-col :span="6" class="colStyle">
            <a-input-search style="width: 100%; position: sticky; top: -1px; padding: 10px 10px 0 10px;" placeholder="输入关键词" enter-button="搜索" @change="onTreeSearch"></a-input-search>
            <div id="colStyle">
              <a-tree showLine :expanded-keys="expandedKeys" :auto-expand-parent="autoExpandParent" :tree-data="gData" @expand="onExpand" @select="onSelectTree">
                <a-icon slot="switcherIcon" type="down" />
                <template slot="title" slot-scope="{title}">
                  <span v-if="title.indexOf(searchValue) > -1">
                    {{title.substr(0, title.indexOf(searchValue))}}
                    <span style="color: green;font-size: 1.05rem">{{searchValue}}</span>
                    {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                  </span>
                  <span v-else>{{ title }}</span>
                </template>
              </a-tree>
            </div>
          </a-col>
          <a-col :span="18" class="tableStyle">
            <div style="margin-bottom: 2px;">
              <a-input-search style="width: 40%;" v-model="searchWord" placeholder="输入姓名/邮箱/手机号" @search="onSearch" />
            </div>
            <a-table
              :columns="columns"
              :data-source="dataTable"
              :loading='loading'
              size="small"
              rowKey="id"
              :scroll="{y: dataTable.length < 20 && pagination.size < 20 ? 0 : 1000}"
              :pagination="{showTotal: ()=>`共 ${dataTable.length} 条`, showSizeChanger: !0, showQuickJumper: !0, size: 'small'}"
            >
              <span slot="lastname" slot-scope="text, record">
                <a-button type="link" @click="detailsBtn(record)">{{record.lastname}}</a-button>
              </span>
              <span slot="operation" slot-scope="text, record">
                <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('signableEnterprise_edit')" @click="editBtn('add', record.id)">合同签订</a-button>
                <a-button class="cursorDef bluefont bluefonthover" type="link" :disabled="!hasPermission('signableEnterprise_list')" @click="listBtn(record.id)">合同列表</a-button>
              </span>
            </a-table>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <modal-details ref="modalDetailsRef"/>
  </div>
</template>

<script>
import modalDetails from './modalDetails'
import { search, details } from "@/services/resourceCenter/contractMa/organizationSystem"
const columns = [
  {title:"姓名", dataIndex:"lastname", scopedSlots: {customRender: "lastname"}},
  {title:"部门", dataIndex:"departmentname"},
  {title:"分部", dataIndex:"subcompanyname"},
  {title:"手机号码", dataIndex:"mobile"},
  {title:"邮箱账号", dataIndex:"email"},
  {title:"人员编码", dataIndex:"workcode"},
  {title:"职务", dataIndex:"jobcall"},
  {title:"更新时间", dataIndex:"lastmodate"},
]
const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title
    dataList.push({key, title})
    if (node.children) generateList(node.children)
  }
};
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
export default {
  name: 'organizationSystem',
  components: { modalDetails },
  data() {
    return {
      columns,
      dataTable: [],
      copyDataTable: [],
      loading: false,
      searchWord: undefined,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData: [],
      departmentId: undefined,
      pageSizeOptions: ['10','20','50','100','200'],
      pagination: {total: 0, page: 1, size: 10},
    }
  },
  methods: {
    onSearch(v) {
      if (v?.trim() === undefined || v?.trim() === '') this.dataTable = this.copyDataTable
      this.loading = !0
      this.dataTable = this.copyDataTable?.filter(item => {
        return item.lastname?.includes(v?.trim()) || item.email?.includes(v?.trim()) || item.mobile?.includes(v?.trim())
      })
      this.loading = !1
    },
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },
    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
    recursionChild(newArr, arr) {
      if (this.typeis(arr) != 'array') return []
      arr.forEach(item => {
        let tepBox = {}
        tepBox.key = item.subCompanyDesc+'||'+item.id+'||'+item.type
        tepBox.value = item.subCompanyDesc+'||'+item.id+'||'+item.type
        tepBox.title = item.subCompanyDesc
        tepBox.scopedSlots = {title: "title"}
        if (item.branches?.length) {
          tepBox.children = []
          newArr.push(tepBox)
          this.recursionChild(tepBox.children, item.branches)
        } else {
          newArr.push(tepBox)
        }
      })
    },
    details(id) {
      let params = {
        subcompanyid1: id[0] == 0 ? id[1] : undefined,
        departmentid: id[0] == 1 ? id[1] : undefined
      }
      this.loading = !0
      details(params).then(res => {
        this.loading = !1
        if (res.data.code == 1) {
          this.dataTable = res.data.data.dataList
          this.copyDataTable = res.data.data.dataList
        } else {
          this.$message.error(res.data.message, 3)
        }
      }).catch(() => this.loading = !1)
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = !1;
    },
    onSelectTree(v) {
      this.departmentid = [v[0]?.split('||')[2],v[0]?.split('||')[1]]
      this.details(this.departmentid)
    },
    onTreeSearch(e) {
      let value = e.target.value;
      if (!value?.trim()) return
      let expandedKeys = []
      expandedKeys = dataList.map(item => {
        if (item.title.indexOf(value) > -1) return getParentKey(item.key, this.gData);
        return null;
      }).filter((item, i, self) => item && self.indexOf(item) === i);
      Object.assign(this, {expandedKeys, searchValue: value, autoExpandParent: !0});
    },
    detailsBtn(record) { this.$refs.modalDetailsRef.openModal(record) },
    deepClone(obj) {
      let objStorageBox = null
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
    submitBtn() {
      search({}).then(res => {
        let data = []
        let treeData = res.data?.data || []
        this.recursionChild(data, treeData)
        this.gData = data
        generateList(data)
      }).catch(() => this.loading = false)
    },
  },
  created() {
    document.querySelector("#colStyle").style.maxHeight = document.querySelector("html").clientHeight - 260 + 'px'
  },
  activated() {
    this.submitBtn()
  },
}
</script>

<style lang="less" scoped>
  @import './index';
</style>