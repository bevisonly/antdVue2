<template>
  <div class="functional-authority" :style="`min-height: ${pageMinHeight}px`">
    <div class="add-btn">
      <a-button type="primary" :disabled="!hasPermission('funAuthMa_addParent')" @click="insertRow(null, 0)">新增</a-button>
    </div>
    <div class="fun-table" style="margin-top: 20px">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :loading="tableLoading"
        rowKey="id"
        size="middle"
        :scroll="{ x: 920 }"
        :expandIcon='expandIcon'
      >
        <span slot="type" slot-scope="text, record">
          <div v-if="record.type == 1">目录</div>
          <div v-if="record.type == 2">链接</div>
          <div v-if="record.type == 3">按钮</div>
        </span>
        <div slot="opreation" slot-scope="text, record">
          <a-button type="link" :disabled="!hasPermission('funAuthMa_addSub')" @click="insertRow(record, 0)">新增</a-button>
          <a-button type="link" :disabled="!hasPermission('funAuthMa_edit')" @click="editRows(record, 1)">编辑</a-button>
          <a-popconfirm
            title="确定删除该权限资源吗?"
            ok-text="确定"
            cancel-text="取消"
            :disabled="!hasPermission('funAuthMa_delete')"
            @confirm="delRow(record)"
          >
            <a-button type="link" :disabled="!hasPermission('funAuthMa_delete')">删除</a-button>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
    <a-modal
      v-model="visible"
      :title="editTitle == 1 ? '编辑权限资源' : '新增权限资源'"
      destroyOnClose
      :footer="null"
    >
      <a-form-model
        :model="form"
        :rules="formRules"
        ref="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item
              label="名称"
              prop="name"
              style="margin-top: 10px"
            >
              <a-input v-model="form.name"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="权限编码" prop="code">
              <a-input v-model="form.code"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="权限类型" prop="type">
              <a-select v-model="form.type" style="width: 100%">
                <a-select-option
                  v-for="(item, index) in typeList"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="16" v-if="form.type == 2">
          <a-col :span="24">
            <a-form-model-item label="链接" prop="url">
              <a-input v-model="form.url"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="排序" prop='orderNumber'>
              <a-input-number v-model="form.orderNumber"></a-input-number>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-model-item label="描述">
              <a-input v-model="form.description"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-form-model-item
            style="
              display: flex;
              justify-content: center;
              align-items: center;
              text-align: center;
            "
          >
            <a-button type="primary" @click="handleOk">提交</a-button>
            <a-button style="margin-left: 10px" @click="handleCancel"
              >取消</a-button
            >
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </a-modal>
  </div>
</template>
  <script>
import { mapState } from "vuex";

const columns = [
  {
    title: "名称",
    width: 150,
    dataIndex: "name",
  },
  {
    align: "center",
    title: "权限类型",
    width: 80,
    dataIndex: "type",
    scopedSlots: { customRender: "type" },
  },
  {
    align: "center",
    title: "权限编码",
    width: 200,
    dataIndex: "code",
  },
  {
    align: "center",
    title: "排序",
    width: 100,
    dataIndex: "orderNumber",
  },
  {
    align: "center",
    title: "url",
    width: 200,
    dataIndex: "url",
  },
  {
    align: "center",
    title: "描述",
    width: 100,
    dataIndex: "description",
  },
  {
    align: "center",
    title: "操作",
    width: 250,
    dataIndex: "opreation",
    fixed: "right",
    scopedSlots: { customRender: "opreation" },
  },
];
import {
  DelResource,
  GetResourceList,
  InsertResource,
  UpdateResource,
} from "../../services/stage/functionalAuthority";

import { mixin } from "../../utils/mixins";
export default {
  name: "functionalAuthority",
  mixins: [mixin],
  data() {
    return {
      editTitle: "",
      columns,
      tableData: [],
      tableLoading: false,
      visible: false,
      form: {},
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      formRules: {
        name: [{ required: true, message: "请输入权限名称" }],
        type: [{ required: true, message: "请选择权限类型" }],
        code: [{ required: true, message: "请填写权限编码" }],
        // url: [{ required: true, message: "请填写权限类型对应的链接" }],
      },
      typeList: [
        { value: 1, name: "目录" },
        { value: 2, name: "链接" },
        { value: 3, name: "按钮" },
      ],
    };
  },

  activated() {
    this.getList();
  },
  methods: {
    expandIcon(props) {
      // console.log(props);
      if (props.record.children.length > 0) {
        if (props.expanded) {
          //有数据-展开时候图标
          return (
            <a
              style="color: 'black',margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="down" />{" "}
            </a>
          );
        } else {
          //有数据-未展开时候图标
          return (
            <a
              style="color: 'black' ,margin-right:0px"
              onClick={(e) => {
                props.onExpand(props.record, e);
              }}
            >
              <a-icon type="right" />
            </a>
          );
        }
      } else {
        //无数据-图标
        return (
          <span style="margin-right:0px">
            <a-icon />
          </span>
        );
      }
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      console.log();

      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            ...this.form,
          };
          switch (this.editTitle) {
            case 0:
              InsertResource(params).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("新增权限资源成功");
                  this.getList();
                  this.visible = false;
                } else {
                  this.$message.error("新增权限资源失败");
                }
              });
              break;
            case 1:
              UpdateResource(params).then((res) => {
                if (res.data.code == 200) {
                  this.$message.success("修改权限资源成功");
                  this.getList();
                  this.visible = false;
                } else {
                  this.$message.error("修改权限资源失败");
                }
              });
              break;

            default:
              break;
          }
        } else {
          return false;
        }
      });
    },
    getList() {
      this.tableLoading = true;
      GetResourceList().then((res) => {
        if (res.data.code == 200) {
          this.tableLoading = false;
          const data = res.data.data;
          this.tableData = JSON.parse(JSON.stringify(data));
        } else {
          this.$message.error("获取权限列表数据错误");
        }
      });
    },
    insertRow(record, state) {
      this.editTitle = state;
      console.log(record);
      this.visible = true;
      this.form = {
        name: "",
        code: "",
        type: "",
        parentId: record ? record.id : "",
        description: "",
        url: "",
        orderNumber:'',
      };
      console.log(this.form);
    },
    editRows(record, state) {
      this.visible = true;
      this.editTitle = state;
      console.log(record);
      this.form = {
        name: record.name,
        code: record.code,
        type: record.type,
        description: record.description,
        url: record.url || "",
        id: record.id,
        orderNumber: record.orderNumber,
      };
      console.log(this.form);
    },
    delRow(record) {
      console.log(record);
      DelResource({ id: record.id }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除权限资源成功");
          this.getList();
        } else {
          this.$message.error("删除权限资源失败");
        }
      });
    },
  },
  computed: {
    ...mapState("setting", ["pageMinHeight"]),
  },
};
</script>
  <style scoped lang="less">
/deep/ .ant-modal-body {
  padding-bottom: 0 !important;
}
@import "index.less";
</style>