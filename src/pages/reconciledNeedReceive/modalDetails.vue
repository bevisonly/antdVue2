<template>
  <a-modal
    class="modalTop"
    title="详情"
    :dialogStyle="{ top: '30px' }"
    :maskClosable="false"
    v-model="visibleLModal"
    :footer="null"
  >
    <div class="modalContainer">
      <div class="divBorder" v-if="fullScreen">
        <p class="pTittle fontWeight">订单信息</p>
        <div class="paddingLeftRight">
          <a-row class="rowMarginTop" :gutter="14">
            <a-col :span="8" v-for="item in orderMsg" :key="item[0]">
              <span class="fontWeight">{{item[0]}}：</span>
              <a-input disabled class="widthMargin" v-model="allMsg[item[1]]"></a-input>
            </a-col>
            <a-col :span="!imgData[0]? 8 : 24">
              <span class="fontWeight">单据图片：</span>
              <a-input v-if="!imgData[0]" disabled class="widthMargin" value="尚未上传单据"/>
              <div v-else>
                <div class="modalDiv" v-for="item in imgData" :key="item.filePath">
                  <div class="info">
                    <img class="imgStyle" :src="item.filePath" />
                    <span class="eyeInfo">
                      <a-space :size="10">
                        <a-icon type="eye" style="color: white;" @click="browseImg(item.filePath)" />
                        <a-icon type="download" style="color: white;" @click="downloadImg(item.filePath)" />
                      </a-space>
                    </span>
                  </div>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">对账单明细列表</p>
        <div class="flex-ed heightDiv">
          <a-button-group>
            <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo" ></a-button>
            <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn" ></a-button>
            <checkboxList v-model="columns" width="300" />
          </a-button-group>
        </div>
        <a-table
          bordered
          :columns="columns"
          :scroll="{ x: 300, y: total < 20 ? 0 : 1300 }"
          :data-source="tableData"
          rowKey="id"
          :pagination="tableData.length > 19 ? { showTotal: () => `共 ${tableData.length} 条`, showSizeChanger: true, showQuickJumper: tableData.length > 1000 } : false"
        >
          <span tips="增值税" slot="vat" slot-scope="text, record">
            <span>{{ record.vat ? record.vat + '%' : '' }}</span>
          </span>          <template tips="合计" slot="footer" slot-scope="currentPageData">
            本页合计：
            <span v-if="currentPageData">
              <span v-for="(item, i) in totalSum" :key="i">
                <span class="greyfont">{{item[1]}}</span>
                &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + +c[item[0]]), 0) }}</span>&gt;
                <a-divider type="vertical" style="background: #000000a6;" v-show="i != totalSum.length - 1" />
              </span>
            </span>
          </template>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
      </div>
    </div>
    <!-- <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="() => (previewVisible = false)"
      :closeIcon="closeIcon"
    >
      <img style="width: 100%" title="预览" :src="previewImg" />
    </a-modal> -->
    <ImageEdit :suitStyle="!0" :imgList="imgDataSrc" :filePreviewShow="previewVisible" @close="() => previewVisible = !1"/>
  </a-modal>
</template>

<script>
import {
  getListDetail,
  getImgURL as getImgUrlData
} from '@/services/settlement/receive/reconciliatedNeedPay'
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
const columns = [
  {title: '序号', dataIndex: 'indexId', width: 80},
  {title: '商品名称', dataIndex: 'itemName', width: 220},
  {title: '商品编码', dataIndex: 'itemSno', width: 160},
  {title: '客户', dataIndex: 'customerName', width: 240},
  {title: '门店名称', dataIndex: 'storeName', width: 240},
  {title: '数量', dataIndex: 'ignQty', width: 180},
  {title: '重量(KG)', dataIndex: 'signWeight', width: 180},
  {title: '单价(元)', dataIndex: 'signPrice', width: 180},
  {title: '计价单位', dataIndex: 'priceUnit', width: 220},
  {title: '单据金额', dataIndex: 'saleAmount', width: 180},
  {title: '扣点金额', dataIndex: 'deductionAmount', width: 180},
  {title: '应收金额', dataIndex: 'receivableAmount', width: 200},
  {title: '税额', dataIndex: 'taxAmount', width: 200},
  {title: '不含税金额', dataIndex: 'includingTaxAmount', width: 180},
  {title: '增值税', dataIndex: 'vat', width: 180, fixed: "right", scopedSlots: {customRender: "vat"}},
]
export default {
  name: 'modalDetails',
  components: { ImageEdit },
  data() {
    return {
      columns,
      visibleLModal: false,
      orderMsg: [
        ['订单号', 'sno'],['运营主体','opName'],['客户名称','customerName'],
        ['门店名称', 'storeName'],['关联合同','contractTitle'],['单据金额','totalSignAmount']
      ],
      totalSum: [
        ["signQty", "数量"],["saleAmount", "商品金额"],["receivableAmount", "应收金额"],["includingTaxAmount", "不含税金额"]
      ],
      allMsg: {},
      imgData: [],
      imgDataSrc: [],
      id: undefined,
      tableData: [],
      fullScreen: true,
      previewVisible: false,
      previewImg: undefined,
      imgObj: new Image(),
      closeIcon: () => {
        return (
          <div style="margin-left: 32px;">
            <a-icon type="close-circle" theme="twoTone" />
          </div>
        )
      },
      total: 0
    }
  },
  methods: {
    details(record) {
      getListDetail({
        id: record.id,
        rows: 10,
        page: 1,
        sort: 'id',
        order: 'desc'
      })
        .then(res => {
          if (res.status === 200 && !res.code) {
            if (res.data.total) {
              res.data?.rows.forEach((item, i) => (item.indexId = i + 1))
              this.tableData = res.data?.rows || []
            }
            this.total = res.data.total
            this.visibleLModal = true
          }
        })
        .catch(() => this.$message.error('查看列表详情失败'))
    },
    openModal(record) {
      this.tableData = []
      this.allMsg = record
      this.id = record.id
      this.getImgURL(record.id)
      this.details(record)
    },
    redo() {
      this.details({ id: this.id })
    },
    fullScreenBtn() {
      this.fullScreen = !this.fullScreen
    },
    getImgURL(id) {
      this.imgData.splice(0)
      this.imgDataSrc.splice(0)
      getImgUrlData({ tableId: id, tableName: 'signed' }).then(res => {
        if (res.data.code == 200) {
          res.data?.data?.forEach(img => {
            this.typeOfPicture(img.filePath).then(() => {
              this.imgData.push(img)
              this.imgDataSrc.push(img.filePath)
            })
          })
        }
      }).catch(e => this.$message.error('error'+e, 3.5))
    },
    typeOfPicture(url) {
      return new Promise((resolve, reject) => {
        this.imgObj.src = url;
        this.imgObj.onload = () => resolve("picX");
        this.imgObj.onerror = () => reject("fileN");
      });
    },
    browseImg(imgURL) {
      this.previewImg = imgURL
      this.previewVisible = true
    },
    downloadImg(imgURL) {
      const link = document.createElement('a')
      link.href = imgURL
      link.download = '已对账单据图片'
      link.click()
    },
    closeModalBtn() {
      this.visibleLModal = false
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop {
  /deep/.ant-modal {
    width: 92% !important;
    min-width: 1300px !important;
    max-width: 2000px !important;
  }
  /deep/ .ant-modal-body {
    padding-top: 0;
  }
  /deep/ .ant-modal-header {
    border: 0;
  }
  /deep/ .ant-modal-body {
    padding-bottom: 1px;
  }
  .modalContainer {
    margin-bottom: 10px;
    padding-top: 10px;
    border-top: @border-color;
    .pTittle {
      margin-bottom: 0;
      padding-left: 15px;
      height: 30px;
      line-height: 30px;
      background-color: @common-bgc;
    }
    .paddingLeftRight {
      padding: 0 16px;
    }
    .fontWeight {
      font-weight: 600;
    }
    .divBorder {
      margin-top: 10px;
      border: @border-color;
      .rowMarginTop {
        margin: 5px 0;
        .widthMargin {
          width: 100%;
        }
        .modalDiv {
          display: inline-block;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          margin-right: 8px;
          margin-bottom: 8px;
          .info {
            position: relative;
            .eyeInfo {
              position: absolute;
            }
            &:hover > .eyeInfo {
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 101;
            }
          }
          &:hover {
            cursor: pointer;
            .info::before {
              position: absolute;
              z-index: 100;
              width: 100%;
              border: 1 solid red;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              opacity: 1;
              transition: all 0.3s;
              content: ' ';
            }
          }
          .imgStyle {
            width: 86px;
          }
        }
      }
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .ant-btn-link {
        margin: 0;
        padding: 0px 4px;
      }
      .heightDiv {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
      }
      .a-btn {
        width: 50px;
      }
      .ant-table-footer .ant-divider {
        margin-left: 5px;
        background-color: #7a7a7a;
      }
    }
  }
}
</style>
