<template>
  <a-modal
    class="modalTop"
    :width="1300"
    title="退货单"
    :dialogStyle="{ top: '30px' }"
    v-model="visibleLModal"
    :destroyOnClose="true"
    :maskClosable="false"
    :footer="null"
  >
    <div class="modalContainer">
      <div class="divTop">
        <div class="subTittle">基本信息</div>
        <a-row type="flex" class="rowA">
          <a-col :span="6" :order="4">
            <div class="txtCenter">
              <span class="fontWeight">销售订单编号：</span
              ><span>{{ allMsg.sno }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="3">
            <div class="txtCenter">
              <span class="fontWeight">采购订单编号：</span
              ><span>{{ allMsg.poCode }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="2">
            <div class="txtCenter">
              <span class="fontWeight">出库单编号：</span
              ><span>{{ allMsg.imItemCode }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="1">
            <div class="txtCenter">
              <span class="fontWeight">供应商联系手机：</span
              ><span>{{ allMsg.supplierPhone }}</span>
            </div>
          </a-col>
        </a-row>
        <a-row type="flex" class="rowB">
          <a-col :span="6" :order="1">
            <div class="txtCenter">
              <span class="fontWeight">供应商名称：</span
              ><span>{{ allMsg.supplierName }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="2">
            <div class="txtCenter">
              <span class="fontWeight">采购订单提交人：</span
              ><span>{{ allMsg.poSubuserName }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="3">
            <div class="txtCenter">
              <span class="fontWeight">采购订单提交时间：</span
              ><span>{{ allMsg.poSubtime }}</span>
            </div>
          </a-col>
          <a-col :span="6" :order="4">
            <div class="txtCenter">
              <span class="fontWeight">订单备注：</span
              ><span>{{ allMsg.orderRemark }}</span>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="divCenter">
        <div class="subTittle">商品列表</div>
        <a-table
          bordered
          ref="tableRef"
          :data-source="dataTable"
          rowKey="id"
          :pagination="false"
        >
          <a-table-column title="商品编码" data-index="itemCode" :width="140" />
          <a-table-column title="商品名称" data-index="itemName" :width="160" />
          <a-table-column title="退货数量" data-index="returnQty" :width="160">
            <template slot-scope="text, record">
              <a-input v-if="flag == 'edit'" v-model="record.returnQty" />
              <span v-else>{{ record.returnQty }}</span>
            </template>
          </a-table-column>
          <a-table-column
            title="实际退货数量"
            data-index="actualReturnQty"
            :width="140"
          />
          <a-table-column title="单位" data-index="unit" :width="140" />
          <a-table-column title="商品规格" data-index="itemSpec" :width="140" />
          <a-table-column title="采购单价" data-index="poPrice" :width="120" />
          <a-table-column title="采购件数" data-index="poQty" :width="120" />
          <a-table-column
            title="采购费用小计"
            data-index="poAmount"
            :width="120"
          />
        </a-table>
      </div>
      <div class="divBottom">
        <div class="subTittle">退货信息</div>
        <a-row type="flex" class="rowA">
          <a-col :span="8" :order="1">
            <div class="txtCenter">
              <span class="fontWeight">退&nbsp;货&nbsp;人&nbsp;：&nbsp;</span>
              <span>
                <a-input
                  class="widthStyle"
                  v-if="flag == 'edit'"
                  placeholder="请输入退货人"
                  v-model="returnMsg.returnPerson"
                ></a-input>
                <span v-else>{{ allMsg.returnPerson }}</span>
              </span>
            </div>
          </a-col>
          <a-col :span="8" :order="2">
            <div class="txtCenter">
              <span class="fontWeight">联系号码：</span>
              <span>
                <a-input
                  class="widthStyle"
                  v-if="flag == 'edit'"
                  placeholder="请输入退货人联系号码"
                  v-model="returnMsg.returnPhone"
                ></a-input>
                <span v-else>{{ allMsg.returnPhone }}</span>
              </span>
            </div>
          </a-col>
          <a-col :span="8" :order="3">
            <div class="txtCenter">
              <span class="fontWeight">退货备注：</span>
              <span>
                <a-input
                  class="widthStyle"
                  v-if="flag == 'edit'"
                  placeholder="请输入退货备注"
                  v-model="returnMsg.remark"
                ></a-input>
                <span v-else>{{ allMsg.remark }}</span>
              </span>
            </div>
          </a-col>
        </a-row>
        <a-row type="flex" class="rowB">
          <a-col :span="8" :order="1">
            <div class="txtCenter">
              <span class="fontWeight">退货时间：</span>
              <span>
                <a-date-picker
                  class="widthStyle"
                  v-if="flag == 'edit'"
                  placeholder="请输入退货时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  show-time
                  v-model="returnMsg.actualReturnDate"
                >
                  <template slot="dateRender" slot-scope="current, today">
                    <div
                      class="ant-calendar-date"
                      :style="getCurrentStyle(current, today)"
                    >
                      {{ current.date() }}
                    </div>
                  </template>
                </a-date-picker>
                <span v-else>{{ allMsg.actualReturnDate }}</span>
              </span>
            </div>
          </a-col>
          <a-col :span="16" :order="2">
            <div class="txtCenter">
              <span class="fontWeight">退货地址：</span>
              <span>
                <a-input
                  class="widthInput"
                  v-if="flag == 'edit'"
                  placeholder="请输入详细地址"
                  v-model="returnMsg.returnAddress"
                ></a-input>
                <span v-else>{{ allMsg.returnAddress }}</span>
              </span>
            </div>
          </a-col>
        </a-row>
        <a-row type="flex" class="rowB">
          <a-col :span="24" :order="1">
            <div class="txtCenter">
              <span class="fontWeight">上传单据：</span>
              <a-upload
                list-type="picture-card"
                :file-list="fileList"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.png,.jpeg,.txt"
                :showUploadList="{
                  showRemoveIcon: flag == 'details' ? false : true,
                }"
                @preview="handlePreview"
                :before-upload="beforeUpload"
                @change="changeFile"
              >
                <div v-if="flag == 'edit' && fileList.length < 21">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">点击上传</div>
                </div>
              </a-upload>
              <a-modal
                :visible="previewVisible"
                :footer="null"
                @cancel="() => (previewVisible = false)"
              >
                <img style="width: 100%" :src="previewImage" />
              </a-modal>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="flex-ed" v-if="flag == 'edit'">
        <a-button type="primary" @click="cancelModalBtn">取消</a-button>
        <a-button type="primary" style="margin-left: 10px" @click="confrim"
          >退货确认</a-button
        >
      </div>
    </div>
  </a-modal>
</template>

<script>
import moment from "moment";
import {
  details,
  confirm,
  uploadFile,
  uploadFileUrl,
  getUploadFile,
  // deleteUploadFile,
} from "@/services/transport/signed/returnSupplierCommdity";
import { throttle } from "../../utils/tool";
export default {
  name: "modalDetails",
  data() {
    return {
      visibleLModal: false,
      allMsg: {},
      returnMsg: {},
      dataTable: [],
      flag: "details",
      supplierData: {},
      moneyReverse: undefined,
      money: "8000",

      previewVisible: false,
      previewImage: "",
      fileList: [],
      fd: new FormData(),
      imgObj: new Image(),
    };
  },
  methods: {
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YYYY-MM-DD") == moment(today).format("YYYY-MM-DD")) {
        style.border = "1px solid green";
        style.borderRadius = "50%";
        style.backgroundColor = "white";
        style.color = "green";
      }
      return style;
    },
    getFileBase64(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let imgData = {
          uid: file.uid,
          name: file.name,
          type: file.type,
          size: file.size,
          url: undefined,
        };
        reader.onload = () => {
          imgData.url = reader.result;
          resolve(imgData);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    getFile(res) {
      if (!res.url) {
        this.$message.warn("找不到文件链接/路径");
        return;
      }
      const link = document.createElement("a");
      link.href = res.url;
      link.download = res.name || "anonymous";
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    async handlePreview(file) {
      if (
        file.name?.match(/\.pdf|\.docx|\.doc|\.xlsx|\.xls|\.txt/g) != null ||
        file.type?.includes("application")
      ) {
        this.getFile(file);
        return;
      }
      if (!file.url && !file.preview) {
        file.preview = await this.getFileBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    details(soId, imItemId) {
      details({ soId: soId, imItemId: imItemId })
        .then((res) => {
          if (res.data.code == "200") {
            this.dataTable = res.data.data.orderReturnedDtoList;
          } else {
            this.$message.warn("获取详情的表格数据失败");
          }
        })
        .catch(() => this.$message.warn("获取详情的表格数据异常"));
    },
    typeOfPicture(url) {
      return new Promise((resolve, reject) => {
        this.imgObj.src = url;
        this.imgObj.onload = () => resolve("picX");
        this.imgObj.onerror = () => reject("fileN");
      });
    },
    getUploadFile(imItemId) {
      let fd = new FormData();
      fd.set("tableId", imItemId);
      fd.set("tableName", "returned");
      getUploadFile(fd).then((res) => {
        if (res.data.code == "200") {
          res.data.data.forEach((item, i) => {
            this.fileList.push({
              uid: item.id,
              name: "picX",
              type: "image",
              size: "1000",
              url: item.filePath,
            });
            this.typeOfPicture(item.filePath).catch((e) => {
              this.fileList[i].name = e;
              this.fileList[i].type = "application";
            });
          });
        }
      });
    },
    openModal(flag, allMsg) {
      this.flag = flag;
      this.dataTable = [];
      this.fileList = [];
      this.deleteFileListId = [];
      this.details(allMsg.soId, allMsg.imItemId);
      this.getUploadFile(allMsg.imItemId);
      this.allMsg = allMsg || {};
      this.returnMsg = {};
      this.visibleLModal = true;
    },
    cancelModalBtn() {
      this.visibleLModal = false;
    },
    changeFile(file) {
      if (file.file.status === "uploading") return;
      this.fileList.forEach((item, i) => {
        if (
          file.file.status === "removed" &&
          file.file.url == item.url &&
          file.file.uid == item.uid
        ) {
          this.fileList.splice(i, 1);
          return;
          // this.fd.set("id", item.uid);
          // deleteUploadFile(this.fd)
          //   .then((res) => {
          //     res.data.code == "200"
          //       ? (this.$message.success("删除成功"),
          //         this.fileList.splice(i, 1))
          //       : this.$message.warn("删除失败");
          //   })
          //   .catch(() => this.$message.warn("删除失败"));
        }
      });
    },
    beforeUpload(file) {
      let fd = new FormData();
      fd.set("file", file);
      fd.set("mode", "batch");
      fd.set("tableId", this.allMsg.imItemId);
      fd.set("tableName", "returned");
      uploadFile(fd)
        .then((res) => {
          if (res.data.code == "200") {
            // this.uploadFileUrl(res.data.data[0].filePath);
            this.fileList.push({
              uid: this.fileList.length,
              url: res.data.data[0].filePath,
              name: res.data.data[0].fileName,
              size: res.data.data[0].fileSize,
              type: res.data.data[0].fileType,
            });
          }
        })
        .catch(() => this.$message.warn("获取上传文件记录失败"));
    },
    async uploadFileUrl(url) {
      const params = {
        tableId: this.allMsg.imItemId,
        tableName: "returned",
        fileUrlList: url,
      };
      await uploadFileUrl(params);
    },
    throttleConfirm: throttle(function () {
      const params = this.allMsg;
      params.orderReturnedDtoList = this.dataTable;
      Object.assign(params, this.returnMsg);
      params.actualReturnDate =
        moment(this.returnMsg.actualReturnDate || "").format("YYYY-MM-DD") ==
        "Invalid date"
          ? ""
          : moment(this.returnMsg.actualReturnDate).format(
              "YYYY-MM-DD HH:mm:ss"
            );
      confirm(params)
        .then((res) => {
          if (res.data.code == "200") {
            let url = [];
            this.fileList.forEach((item) => {
              if (item.url) {
                url.push(item.url);
              }
            });
            if (url.length > 0) {
              this.uploadFileUrl(url);
            }
            this.visibleLModal = false;
            this.$parent.submitPagination();

            this.$message.success("退货确认成功");
          } else {
            this.$message.warn("退货确认失败");
          }
        })
        .catch(() => this.$message.warn("退货确认失败"));
    }, 3500),
    confrim() {
      this.throttleConfirm();
    },
  },
};
</script>

<style lang="less" scoped>
@import "../../assets/css/commonless";
.modalTop {
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 10px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .divTop,
    .divCenter,
    .divBottom {
      margin-bottom: 10px;
      border: @border-color;
    }
    .divTop .txtCenter,
    .divBottom .txtCenter {
      margin-left: 18px;
      .fontWeight {
        font-weight: 600;
      }
      .widthStyle {
        width: 82%;
      }
      .widthInput {
        width: 91%;
      }
    }
    .rowA {
      margin-top: 10px;
    }
    .rowB {
      margin: 10px 0;
    }
    .subTittle {
      margin: 0;
      padding-left: 15px;
      height: 40px;
      line-height: 40px;
      background-color: @common-bgc;
      letter-spacing: 1px;
      font-size: 14px;
      font-weight: 800;
    }
  }
}
</style>