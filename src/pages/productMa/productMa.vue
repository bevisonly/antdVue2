<template>
  <div class="new-page" :style="`min-height: ${pageMinHeight}px`">
    <!-- 分类 -->
    <div class="product-tree">
      <!-- <a-button
        :icon="showCateIcon"
        type="primary"
        @click="showCateTree"
        title="分类折叠"
      ></a-button> -->
      <a-card
        :body-style="{ padding: 0 }"
        style="text-align: center; margin-top: 20px"
        v-if="showCate"
      >
        <a-button-group style="width: 200px; margin-top: 10px">
          <a-button type="primary" size="small" @click="addCate()"
            >新建</a-button
          >
          <a-button type="primary" size="small" @click="editCate()"
            >编辑</a-button
          >
          <a-button type="primary" size="small" @click="delCate">删除</a-button>
        </a-button-group>
        <a-tree
          v-if="treeData.length"
          :selected-keys="selectedKeys"
          :tree-data="treeData"
          :replace-fields="{
            children: 'children',
            title: 'typeName',
            key: 'id',
            label: 'typeCode',
          }"
          @select="onSelect"
          class="ant-tree"
          showIcon
        >
          <a-icon slot="folder" type="folder" />
        </a-tree>
      </a-card>
    </div>
    <!-- 表格 -->
    <div class="table-item">
      <div class="type-choose">
        <a-radio-group
          v-model="searchform.itemFlag"
          button-style="solid"
          size="large"
          @change="productTypeChange"
        >
          <a-radio-button :value="1"> 基础商品 </a-radio-button>
          <a-radio-button :value="2"> 加工品 </a-radio-button>
        </a-radio-group>
      </div>
      <div class="search-item" style="margin-top: 16px">
        <a-card
          title="筛选查询"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
          size="small"
        >
          <div class="search" id="components-form-demo-advanced-search">
            <a-form :form="searchform">
              <a-row :gutter="24">
                <a-col :span="4">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.likeItemName"
                      placeholder="商品名/商品编码"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-input
                      v-model.trim="searchform.partnerName"
                      placeholder="所属公司"
                    >
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-select
                      v-model="searchform.status"
                      placeholder="商品状态"
                      allowClear
                    >
                      <a-select-option value="1"> 已激活 </a-select-option>
                      <a-select-option value="0"> 未激活 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="4">
                  <a-form-item>
                    <a-select
                      v-model="searchform.groundingState"
                      placeholder="上架状态"
                      allowClear
                    >
                      <a-select-option value="1"> 已上架 </a-select-option>
                      <a-select-option value="2"> 未上架 </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="4">
                  <a-form-item>
                    <a-space>
                      <a-button type="primary" @click="handleReset"
                        >清 空</a-button
                      >
                      <a-button type="primary" @click="searchItem"
                        >查 询</a-button
                      >
                    </a-space>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </div>
        </a-card>
      </div>
      <a-card
        title="数据列表"
        class="card-table"
        :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
        :body-style="{ padding: '12px,2px' }"
        size="small"
      >
        <div style="margin-bottom: 16px; text-align: left">
          <a-button-group>
            <a-button
              type="primary"
              :disabled="!hasPermission('saasitem_batchOnSale')"
              icon="arrow-up"
              @click="batchUp"
            >
              批量上架
            </a-button>
            <a-button
              type="primary"
              icon="arrow-down"
              :disabled="!hasPermission('saasitem_batchOffSale')"
              @click="undercarriage"
            >
              批量下架
            </a-button>
            <a-button
              :disabled="!hasPermission('saasitem_add')"
              type="primary"
              icon="edit"
              @click="editItem(0, false)"
            >
              添加
            </a-button>
          </a-button-group>
        </div>
        <a-table
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectChange,
          }"
          :columns="columns"
          :data-source="listData"
          rowKey="id"
          :pagination="false"
          :loading="tableLoading"
          size="middle"
          :scroll="{ x: '105%' }"
        >
          <div slot="spec" slot-scope="text, record">
            <span v-if="record.specList.length > 0">
              <a-tag
                v-for="item in record.specList"
                style="margin-top: 4px"
                :key="item.id"
                >{{ item.specName }}</a-tag
              >
            </span>
          </div>
          <template slot="itemCode" slot-scope="text, record">
            <div>
              <a-button type="link" @click="editItem(record, true)">{{
                text
              }}</a-button>
            </div>
          </template>
          <template slot="status" slot-scope="text, record">
            <div>
              <a-tag v-if="record.status == 1">已激活</a-tag>
              <a-tag v-if="record.status == 0">未激活</a-tag>
            </div>
          </template>
          <template slot="groundingState" slot-scope="text, record">
            <div>
              <a-tag v-if="record.groundingState == 1">已上架</a-tag>
              <a-tag v-if="record.groundingState == 2">未上架</a-tag>
            </div>
          </template>
          <!-- <template slot="version" slot-scope="text, record, index"> -->
          <template slot="version" slot-scope="text, record">
            <div class="editable-row-operations" v-if="record.status == 1">
              <a-button
                type="link"
                size="small"
                @click="editItem(record, false)"
                :disabled="!hasPermission('saasitem_edit')"
                >编辑</a-button
              >
              <a-button type="link" size="small" @click="invalid(record.id)"
                >作废</a-button
              >
              <a-button
                type="link"
                size="small"
                :disabled="!hasPermission('saasitem_custom')"
                @click="showOtherItem(record, 'customer')"
                >客户商品</a-button
              >
              <a-button
                type="link"
                size="small"
                :disabled="!hasPermission('saasitem_store')"
                @click="showOtherItem(record, 'saler')"
                >商家商品</a-button
              >
              <!-- <a-button type="link" size="small" @click="choosePackage(record.id)">选择包装</a-button> -->
              <a-button
                type="link"
                size="small"
                v-if="record.groundingState == 1"
                @click="onSale(record.id, 2)"
                >下架</a-button
              >
              <a-button
                type="link"
                size="small"
                v-if="record.groundingState == 2"
                @click="onSale(record.id, 1)"
                >上架</a-button
              >
            </div>
            <div class="editable-row-operations" v-if="record.status == 0">
              <a-button type="link" size="small" @click="active(record.id)"
                >激活</a-button
              >
            </div>
          </template>
        </a-table>
        <!-- 分页 -->
        <div class="pagination">
          <a-pagination
            :page-size-options="['10', '20', '30', '40', '50']"
            :total="pagination.total"
            show-size-changer
            :page-size="pagination.rows"
            show-quick-jumper
            :current="pagination.page"
            :show-total="(total) => `共 ${total} 条记录`"
            @change="pageChange"
            @showSizeChange="pageSizeChange"
          >
          </a-pagination>
        </div>
      </a-card>
    </div>
    <!-- 弹框 -->
    <a-modal
      v-model="modalShow"
      centered
      :title="cateState == 1 ? '新增商品分类' : '修改商品分类'"
      @ok="handleOk"
      destroyOnClose
    >
      <div class="edit-content" v-if="cateState">
        <a-form-model-item label="分类名称" class="table-formva">
          <a-input v-model="cateform.typeName"></a-input>
        </a-form-model-item>
      </div>
      <div class="edit-content" v-if="!cateState">
        确定要删除{{ delText }}吗 ?
      </div>
    </a-modal>
    <!-- <add-item ref="AddItem" :typeList="treeData" /> -->
    <add-other-item ref="addOtherItem"></add-other-item>
  </div>
</template>
<script>
import { mapState } from "vuex";
// import AddItem from "./addItem.vue";
import AddOtherItem from "./addOtherItem.vue";
import {
  cateList,
  itemList,
  cateAdd,
  cateBeforeDel,
  cateDel,
  upDown,
  invalidItem,
  activeItem,
  onSale,
} from "@/services/product/productList.js";
import { filterArray } from "../../utils/treeData";
const columns = [
  {
    title: "商品名称",
    dataIndex: "itemName",
    key: "itemName",
    // fixed: "left",
    width: 150,
    align: "left",
  },
  {
    title: "商品编码",
    dataIndex: "itemCode",
    key: "itemCode",
    width: 150,
    align: "left",
    scopedSlots: { customRender: "itemCode" },
  },
  {
    title: "规格",
    dataIndex: "spec",
    key: "spec",
    width: 90,
    align: "left",
    scopedSlots: { customRender: "spec" },
  },
  {
    title: "计量单位",
    dataIndex: "defUom",
    key: "defUom",
    width: 90,
    align: "left",
  },
  {
    title: "所属公司",
    dataIndex: "partnerName",
    key: "partnerName",
    width: 220,
    align: "left",
  },
  {
    title: "商品类型",
    dataIndex: "itemType",
    key: "itemType",
    width: 200,
    align: "left",
  },
  {
    title: "商品条码",
    dataIndex: "barcode",
    key: "barcode",
    width: 90,
    align: "left",
  },
  {
    title: "商品状态",
    width: 90,
    align: "left",
    dataIndex: "status",
    key: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "上架状态",
    dataIndex: "groundingState",
    key: "groundingState",
    scopedSlots: { customRender: "groundingState" },
    width: 90,
    align: "left",
  },
  {
    title: "创建人",
    dataIndex: "createUser",
    key: "createUser",
    // width: 80,
    align: "left",
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "version",
    key: "version",
    width: 350,
    fixed: "right",
    scopedSlots: { customRender: "version" },
  },
];

export default {
  name: "NewPage",
  components: { AddOtherItem },
  // components: { AddItem, AddOtherItem },
  data() {
    return {
      cateRules: {
        typeName: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
        ],
      },
      //--分页
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      //-----------分类
      parentCode: "",
      version: "",
      typeCode: "",
      cateform: { typeName: "" },
      typeInfoList: {},
      delText: "",
      selectedKeys: [],
      selectedParentKey: "",
      treeData: [],
      modalShow: false,
      cateState: null,
      //-----------表格
      searchform: {
        likeItemName: "",
        partnerName: "",
        status: undefined,
        groundingState: undefined,
        itemFlag: 1,
      },
      listData: [],
      columns,
      selectedRowKeys: [],
      tableLoading: false,
      showCate: true,
      showCateIcon: "down-circle",
    };
  },
  // created() {
  //   this.getList();
  //   this.getCate();
  // },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
  activated() {
    this.getList();
    this.getCate();
  },
  methods: {
    showCateTree() {
      if (this.showCate) {
        this.showCate = false;
        this.showCateIcon = "right-circle";
      } else {
        this.showCate = true;
        this.showCateIcon = "down-circle";
      }
    },
    productTypeChange() {
      console.log(this.productType);
      this.pagination.page = 1;
      this.getList();
    },
    // choosePackage(){
    //   this.$refs.AddItem.packageBtn()
    //   // this.$refs.AddItem.getPackData(id)
    // },
    onSale(id, state) {
      let params = {
        id: id,
        groundingState: state,
      };
      onSale(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //分页change
    //分页
    pageChange(index) {
      this.pagination.page = index;
      this.getList();
    },
    pageSizeChange(index, pageSize) {
      this.pagination.page = 1;
      this.pagination.rows = pageSize;
      this.getList();
    },
    //商家和客户商品
    showOtherItem(record, other) {
      this.$refs.addOtherItem.showModal(record, other);
    },
    //商品激活
    active(val) {
      activeItem({ id: val }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //商品的作废
    invalid(val) {
      invalidItem({ id: val }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //商品添加
    editItem(val, isShow) {
      // this.$refs.AddItem.handleOpen(val, isShow, this.searchform.itemFlag,this.selectedKeys[0]);
      // this.$refs.AddItem.getMeasure();
      this.$router.push({
        path: "/basicDataManagement/item/itemAdd",
        query: {
          val: val,
          isShow: isShow,
          productType: this.searchform.itemFlag,
          typeId: this.typeInfoList||{},
          typeList: this.treeData,
        },
      });
    },
    //上架
    batchUp() {
      console.log(this.selectedRowKeys);
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      console.log(this.selectedRowKeys);
      let params = {
        ids: this.selectedRowKeys,
        groundingState: 1,
      };
      upDown(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //下架
    undercarriage() {
      console.log(this.selectedRowKeys);
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      console.log(this.selectedRowKeys);
      let params = {
        ids: this.selectedRowKeys,
        groundingState: 2,
      };
      upDown(params).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //搜索
    searchItem() {
      this.pagination.page = 1;
      this.getList();
    },
    //搜索框清空
    handleReset() {
      this.parentCode=''
      this.searchform.likeItemName = "";
      this.searchform.partnerName = "";
      this.searchform.status = undefined;
      this.searchform.groundingState = undefined;
      // this.searchform = {
      //   likeItemName: "",
      //   partnerName: "",
      //   status: "",
      //   groundingState: "",
      // };
    },
    //分类
    getCate() {
      cateList().then((res) => {
        console.log(res);
        this.treeData = res.data.data;
        this.treeData.forEach((v) => {
          v.label = v.typeCode;
          if (!v.parentId) {
            v.slots = {
              icon: "folder",
            };
            console.log(v);
          }
        });
        this.treeData = filterArray(this.treeData);
      });
    },
    //列表数据
    getList() {
      //商品
      const params = {
        itemTypeCode: this.parentCode,
        ...this.searchform,
        ...this.pagination,
      };
      this.tableLoading = true;
      itemList(params).then((res) => {
        this.tableLoading = false;

        console.log(res);
        this.pagination.total = res.data.total;
        // this.listData = res.data.rows;
        let listData = res.data.rows;
        listData.forEach((item) => {
          if (item.specIdList) {
            item.specIdList.length > 0
              ? (item.spec = item.specIdList[0].specName)
              : "";
          }
        });
        this.listData = JSON.parse(JSON.stringify(listData));
      });
    },
    //-------------分类树
    handleOk() {
      if (this.cateState === 0) {
        cateBeforeDel({ itemTypeId: this.selectedKeys[0] }).then((res) => {
          if (res.data.data == 0 && res.data.code == 200) {
            console.log(res.data.data);
            cateDel({ id: this.selectedKeys[0] }).then((delRes) => {
              if (delRes.data.code == 200) {
                this.modalShow = false;
                this.treeData = [];
                this.getCate();
                this.$message.success(delRes.data.message);
              } else {
                this.$message.error(delRes.data.message);
              }
            });
          } else {
            this.$message.error("该分类下还有商品不可删除");
          }
        });
      }
      if (this.cateState == 1) {
        if (!this.cateform.typeName) {
          this.$message.error("分类名称为必填");
          return;
        }
        let params = { typeName: this.cateform.typeName, active: 1 };

        if (this.selectedKeys.length > 0) {
          params = {
            typeName: this.cateform.typeName,
            active: 1,
            parentId: this.selectedKeys[0],
            parentCode: this.parentCode,
          };
        }
        cateAdd(params).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.modalShow = false;
            this.treeData = [];
            this.getCate();
            this.$message.success(res.data.message);
          }
        });
      }
      //修改
      if (this.cateState == 2) {
        if (!this.cateform.typeName) {
          this.$message.error("分类名称为必填");
          return;
        }
        let data = {
          typeName: this.cateform.typeName,
          active: 1,
          id: this.selectedKeys[0],
          typeCode: this.typeCode,
          version: this.version,
        };
        cateAdd(data).then((res) => {
          console.log(res);
          if (res.data.code == 200) {
            this.modalShow = false;
            this.treeData = [];
            this.getCate();
            this.$message.success(res.data.message);
          }
        });
      }
    },
    addCate() {
      this.modalShow = true;
      this.cateState = 1;

      this.cateform.typeName = "";
    },
    editCate() {
      console.log(this.selectedKeys);
      if (!this.selectedKeys.length) {
        this.$message.error("请选择一条分类数据", 2);
        return;
      }
      this.modalShow = true;
      this.cateState = 2;
    },
    delCate() {
      if (!this.selectedKeys.length) {
        this.$message.error("请选择一条分类数据", 2);
        return;
      }
      this.cateState = 0;
      this.modalShow = true;
    },
    // onExpand(expandedKeys) {
    //   console.log("onExpand", expandedKeys);
    //   this.expandedKeys = expandedKeys;
    //   this.autoExpandParent = false;
    // },
    // onCheck(checkedKeys) {
    //   console.log("onCheck", checkedKeys);
    //   this.checkedKeys = checkedKeys;
    // },
    onSelect(selectedKeys, info) {
      console.log(selectedKeys);
      console.log(info);
      if (selectedKeys&&selectedKeys.length > 0) {
        this.parentCode = info.node.label;
      }
      this.getList();
      this.selectedKeys = selectedKeys;
      if (info.selectedNodes.length > 0) {
        this.typeInfoList=info.selectedNodes[0].data.props
        this.selectedParentKey = info.selectedNodes[0].data.props.parentId;
        this.typeName = info.selectedNodes[0].data.props.typeName
          ? info.selectedNodes[0].data.props.typeName
          : "";
        this.cateform.typeName = info.selectedNodes[0].data.props.typeName
          ? info.selectedNodes[0].data.props.typeName
          : "";
        this.delText = info.selectedNodes[0].data.props.typeName
          ? info.selectedNodes[0].data.props.typeName
          : "";
        this.typeCode = info.selectedNodes[0].data.props.typeCode
          ? info.selectedNodes[0].data.props.typeCode
          : "";
        this.version = info.selectedNodes[0].data.props.version
          ? info.selectedNodes[0].data.props.version
          : "";
      }else{
        this.typeInfoList={}
      }
    },
    //--------------表格
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
  },
};
</script>
<style scoped lang="less">
@import "index.less";
/deep/.ant-form-item {
  margin-bottom: 0;
}
/*统一table表格的尺寸*/
// /deep/.ant-table {
//   table-layout: fixed;
// }
// /deep/.ant-table-tbody > tr > td {
//   max-width: 400px;
//   min-width: 80px;
//   border-bottom: 0;
//   /*text-align: center !important;*/
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   word-wrap: break-word;
//   word-break: break-all;
// }
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
</style>