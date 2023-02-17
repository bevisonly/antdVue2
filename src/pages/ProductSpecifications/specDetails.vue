<template>
  <div>
    <a-modal
      centered
      v-model="visible"
      title="规格明细"
      :width="850"
      destroyOnClose
      :maskClosable="false"
      :footer="null"
    >
      <div class="list-table" style="margin-top: 16px">
        <a-card
          title="数据列表"
          class="card-table"
          size="small"
          :head-style="{ backgroundColor: '#f0f3f6', padding: '12px,2px' }"
          :body-style="{ padding: '12px,2px' }"
        >
          <div class="new-add" style="margin-top: 10px">
            <a-button type="primary" @click="toAddSpec">添加类型</a-button>
          </div>
          <a-table
            :columns="columns"
            :data-source="tableList"
            rowKey="id"
            :pagination="false"
            style="margin-top: 10px"
            size="middle"
          >
            <template slot="opreation" slot-scope="text, record">
              <a-button type="link" @click="editSpec(record)">编辑</a-button>
              <!-- <a-button type="link" @click="specDetele(record)">删除</a-button> -->
              <a-popconfirm
                title="确定删除此规格?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="specDetele(record)"
              >
                <a-button type="link">删除</a-button>
              </a-popconfirm>
            </template>
          </a-table>
          <!-- 分页 -->
          <div class="pagination" v-if="tableList && tableList.length > 0">
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
    </a-modal>
    <spec-edit ref="specEdit"></spec-edit>
  </div>
</template>

<script>
import {
  GetListChild,
  SpecChildDelete,
} from "../../services/product/ProductSpecifications";
import SpecEdit from "./specEdit.vue";
export default {
  components: { SpecEdit },
  data() {
    return {
      visible: false,
      columns: [
        {
          align: "center",
          title: "编码",
          dataIndex: "childSpecCode",
        },
        {
          align: "center",
          title: "名称",
          dataIndex: "childSpecName",
        },
        {
          align: "center",
          title: "转换数量",
          dataIndex: "amount",
        },
        {
          align: "center",
          title: "转换单位",
          dataIndex: "defUom",
        },
        {
          align: "center",
          title: "描述",
          dataIndex: "description",
        },
        {
          align: "center",
          title: "操作",
          dataIndex: "opreation",
          scopedSlots: { customRender: "opreation" },
        },
      ],
      pagination: {
        rows: 10,
        total: 0,
        page: 1,
        sort: "id",
        order: "desc",
      },
      tableList: [],
      parentCode: "",
    };
  },
  methods: {
    editSpec(record) {
      console.log(record);
      this.$refs.specEdit.openModal("子规格编辑", record, this.parentCode);
    },
    //新增
    toAddSpec() {
      this.$refs.specEdit.openModal("子规格新增", "", this.parentCode);
    },
    //子规格删除
    specDetele(record) {
      SpecChildDelete({ id: record.id }).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          this.$message.success(data.message);
          this.getList();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    openModal(record) {
      this.parentCode = record.specCode;
      this.getList();
    },
    //列表数据
    getList() {
      let temp = JSON.parse(JSON.stringify(this.pagination));
      delete temp.total;
      const params = {
        ...temp,
        parentCode: this.parentCode,
      };
      GetListChild(params).then((res) => {
        this.tableList = res.data.rows;
        this.pagination.total = res.data.total;
        this.visible = true;
      });
    },
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
  },
};
</script>

 <style lang="less" scpoed>
.pagination {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>>
