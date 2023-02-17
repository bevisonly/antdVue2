<template>
  <a-modal class="modalTop" title="编辑" :dialogStyle="{'top': '30px'}" :maskClosable="flag == 'details'? true : false" v-model="visibleLModal" :footer="null">
    <div class="modalContainer">
      <div class="divBorder">
        <p class="pTittle fontWeight">订单信息</p>
        <a-row class="rowMarginTop" :gutter="16">
          <a-col :span="6">
            <div class="fontWeight">采购订单编号：</div>
            <a-input disabled v-model="headMsg.poCode"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">需求单号：</div>
            <a-input disabled v-model="headMsg.roCode"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">供应商名称：</div>
            <a-select
              class="widthMax"
              placeholder="请选择供应商"
              v-model="headMsg.supplierId"
              :disabled="flag == 'details'||formDisabled"
              @change="changeSupplier"
              allowClear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in select.supplier.filter(supplierStrategy)" :key="item.id"> {{ item.partnerName }} </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">代理公司名称：</div>
            <a-select
              class="widthMax"
              placeholder="请输入代理公司名称"
              v-model="headMsg.agency"
              :disabled="flag == 'details'||formDisabled"
              allowClear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="item in select.supplier.filter(agencyStrategy)" :key="item.id"> {{ item.partnerName }} </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">供应商联系手机：</div>
            <a-input :disabled="flag == 'details'||formDisabled" v-model="headMsg.supplierPhone"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">采购订单提交时间：</div>
            <a-input disabled v-model="headMsg.poSubtime"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">采购员：</div>
            <a-select
              class="widthMax"
              v-model="headMsg.buyerName"
              :disabled="flag == 'details'||formDisabled"
              @change="getBuyerName"
              allowClear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="(item, j) in select.buyer" :value="item.id" :key="j">{{item.realName}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">计划交付时间：</div>
            <a-date-picker
              class="widthMax"
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              valueFormat="YYYY-MM-DD HH:mm:ss"
              v-model="headMsg.planDeliveryTime"
              :disabled="flag == 'details'||formDisabled"
            />
          </a-col>
          <a-col :span="6">
            <div class="fontWeight" :class="{aRequired: flag != 'details'}">入库仓库：</div>
            <a-select
              class="widthMax"
              v-model="headMsg.whId"
              :disabled="flag == 'details'||formDisabled"
              @select="selectWarehouse"
              allowClear
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="(item, j) in select.warehouse" :value="item.baseId" :key="j">{{item.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="12">
            <div class="fontWeight" :class="{aRequired: flag != 'details' && mustCheck}">关联合同：</div>
            <a-select
              class="widthMax"
              show-search
              v-model="headMsg.contractId"
              placeholder="请先选择供应商"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :disabled="flag=='details'||!headMsg.supplierId||formDisabled"
              @search="contract"
              @select="contractSelect"
              @focus="contract"
            >
              <a-select-option v-for="item in select.contractOption" :key="item.id">{{item.contractTitle}}&{{ item.contractNumber }}</a-select-option>
            </a-select>
          </a-col>
        </a-row>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">收货单商品列表</p>
        <div class="heightDiv">
          <a-button-group>
            <a-button icon="ordered-list" :type="whichData == 'order' ? 'primary' : ''" @click="changeData('order', 1)"> 按客户查看 </a-button>
            <a-button icon="shopping" :type="whichData == 'item' ? 'primary' : ''" @click="changeData('item', 2)"> 按商品查看 </a-button>
          </a-button-group>
        </div>
        <a-table
          bordered
          :scroll="{ x: 307.778, y: total < 20 ? 0 : 1300 }"
          :columns="tableColumns" :data-source="tableData" rowKey="id"
          :pagination='tableData.length > 19 ? {showTotal: ()=>`共 ${tableData.length} 条`,showSizeChanger: true,showQuickJumper: tableData.length > 1000} : false'
        >
          <span slot="puPrice"><span class="redfont" v-show="flag != 'details'">*</span>实际采购单价</span>
          <template tips="实际采购单价" slot="puPrice" slot-scope="text, record">
            <a-input-number v-if="flag != 'details'" :disabled='formDisabled' v-model="record.puPrice" placeholder="必填" @change="() => handleChangeCaculate()"/>
            <span v-else>{{ record.puPrice }}</span>
          </template>
          <template tips="实际采购总额" slot="puTotalAmount" slot-scope="text, record">
            <a-input-number v-if="flag != 'details'" :disabled='formDisabled' v-number v-model="record.puTotalAmount" placeholder="必填" @change="() => handlePuTotalAmount(record.puTotalAmount,record.key,'puTotalAmount',record.id)"/>
            <span v-else>{{ record.puTotalAmount }}</span>
          </template>
        <span slot="invoiceBusinessTypeTit" class="table-formva"><span class="redfont" v-show="flag != 'details'">*</span>发票类型</span>
        <span slot="invoiceBusinessType" slot-scope="text, record">
          <a-select
            v-model="record.invoiceBusinessType"
            @click.stop.native
            placeholder=""
            style="width: 40%"
            :disabled="flag == 'details'||formDisabled"
            @change="forEachCaculate('puTotalAmount')"
          >
            <a-select-option :value="0">应税业务</a-select-option>
            <a-select-option :value="1">免税业务</a-select-option>
          </a-select>
          <a-select
            v-model="record.invoiceType"
            @click.stop.native
            placeholder=""
            style="width: 60%"
            :disabled="flag == 'details'||formDisabled"
            @change="forEachCaculate('puTotalAmount')"
          >
            <a-select-option
              v-for="(item, index) in invoiceOption"
              :key="index"
              :value="item.value"
              :title="item.text"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </span>
          <span slot="inputTaxRate"><span class="redfont" v-show="flag != 'details'">*</span>税率/抵扣率(%)</span>
          <template tips="进项税" slot="inputTaxRate" slot-scope="text, record">
            <span style="width: 40%">
             <span v-if="record.invoiceType == 3">抵扣率</span>
             <span v-if="record.invoiceType == 1 || record.invoiceType == 2"
               >税率</span>
            </span>
            <a-select v-if="flag != 'details'" v-model="record.inputTaxRate" placeholder="必填" style="width: 50%;margin-left:2px" 
            :disabled='formDisabled'
            @change="forEachCaculate('puTotalAmount')"            >
              <a-select-option v-for="(item, i) in rateOption" :key="i" :value='item'>{{ item }}</a-select-option>
            </a-select>
            <span v-else>{{ record.inputTaxRate }}<span v-show="record.inputTaxRate">%</span></span>
          </template>
          <template tips="计价单位" slot="priceUnit" slot-scope="text, record">
            <a-select style="width: 100%;" v-model="record.priceUnit" :disabled="flag == 'details' ||formDisabled" placeholder="必选"
              @change="() => handleUnitTotalMoney(record.priceUnit, record.key, 'priceUnit', record.id)"
            >
              <a-select-option v-for="(item, i) in unitOption" :key="i" :value='item.dicText'>{{ item.dicText }}</a-select-option>
            </a-select>
          </template>
          <span slot="deliveryQty"><span class="redfont" v-show="flag != 'details'">*</span>收货数量</span>
          <template tips="收货数量" slot="deliveryQty" slot-scope="text, record">
            <a-input-number v-if="flag != 'details'" :disabled='formDisabled' v-model="record.deliveryQty" placeholder="必填" @change="() => handleChangeCaculate()"/>
            <span v-else>{{ record.deliveryQty }}</span>
          </template>
          <template tips="包装" slot="packingName" slot-scope="text, record">
            <a-button v-if="flag != 'details'" :disabled="formDisabled" class="greenfont redfonthover" type="link" @click="addPackage('edit', record.pkgDetails)">选择包装</a-button>
            <a-button v-else class="greenfont redfonthover" type="link" @click="addPackage('', record.pkgDetails)">选择包装</a-button>
          </template>
          <template tips="入库总成本金额" slot="totalCostOfWarehousing" slot-scope="text, record">
            <a-input-number v-if="flag != 'details'" v-model="record.totalCostOfWarehousing"
              @change="() => handleUnitTotalMoney(record.totalCostOfWarehousing, record.key, 'totalCostOfWarehousing', record.id)"/>
            <span v-else>{{ record.totalCostOfWarehousing }}</span>
          </template>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            商品合计：
            <span class="greyfont" v-show="currentPageData">采购件数</span>
            &lt;<span class="redfont">{{ poQty }}</span>&gt;<a-divider type="vertical" />
            <span class="greyfont">收货数量</span>
            &lt;<span class="redfont">{{ deliveryQty }}</span>&gt;<a-divider type="vertical" />
            <span class="greyfont">实际采购总额</span>
            &lt;<span class="redfont">{{ puTotalAmount }}</span>&gt;<a-divider type="vertical" />
            <span class="greyfont">入库总成本金额</span>
            &lt;<span class="redfont">{{ totalCostOfWarehousing }}</span>&gt;
          </template>
        </a-table>
      </div>
      <div class="divBorder">
        <p class="pTittle fontWeight">收货信息</p>
        <a-row class="rowMarginTop" :gutter="16">
          <a-col :span="6">
            <div class="fontWeight">收货人：</div>
            <a-input :disabled="flag == 'details'||formDisabled" v-model="headMsg.deliveryUser"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">收货人联系号码：</div>
            <a-input :disabled="flag == 'details'||formDisabled" v-model="headMsg.deliveryPhone"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">收货地址：</div>
            <a-input :disabled="flag == 'details'||formDisabled" v-model="headMsg.deliveryAdress"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">收货时间：</div>
            <a-date-picker class="widthMax" disabled format="YYYY-MM-DD HH:mm:ss" v-model="headMsg.deliveryTime"/>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">预付款：</div>
            <a-input-number :disabled="headMsg.payReconciliaState==620 || flag == 'details'||formDisabled" v-model="headMsg.payAmount" @input="changeNoPayAmount"></a-input-number>
          </a-col>
          <a-col :span='6'>
            <div class="fontWeight">预付款比率：</div>
            <a-input :disabled="headMsg.payReconciliaState==620 || flag == 'details'||formDisabled" v-model="headMsg.payAmountRatio"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">预付款时间：</div>
            <a-date-picker class="widthMax" :disabled="headMsg.payReconciliaState==620 || flag == 'details'||formDisabled" format="YYYY-MM-DD HH:mm:ss" v-model="headMsg.advanceTime"/>
            <span style="padding-left: 100%"></span>
          </a-col>
          <a-col :span='6'>
            <div class="fontWeight">扣供应商款：</div>
            <a-input-number :disabled="flag == 'details'||formDisabled" v-model="headMsg.deductions" @input="changeNoPayAmount"></a-input-number>          </a-col>
          <a-col :span="6">
            <span class="fontWeight">尾款：</span>
            <a-input-number :disabled="flag == 'details'||formDisabled" v-model="headMsg.noPayAmount"></a-input-number>          </a-col>
          <a-col :span="6">
            <div class="fontWeight">尾款时间：</div>
            <a-date-picker class="widthMax" :disabled="flag == 'details'||formDisabled" format="YYYY-MM-DD HH:mm:ss" v-model="headMsg.noPayDate"/>
          </a-col>
          <a-col :span='6'>
            <div class="fontWeight">收货备注：</div>
            <a-input :disabled="flag == 'details'||formDisabled" v-model="headMsg.remark"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="24">
           <div class="upload-img">
            <a-form-item label="上传单据">
              <div class="flex-fs uploadbox">
                <div v-if="uploadUrls.length > 0" class="flex-fs imgWrap">
                  <div
                    class="uploadImgs"
                    v-for="(item, index) in uploadUrls"
                    :key="index"
                  >
                    <span class="imgDelete" @click="deleteUploads(item, index)" v-if="flag!='details'">
                      <a-icon type="close" />
                    </span>
                    <img
                      v-if="item.type.includes('image')"
                      :src="item.url"
                      :alt="item.name"
                      @click="preView(item.url)"
                    />
                    <div
                      v-else
                      class="cursorPin iconBox textwrap"
                      title="点击下载预览"
                      @click="downloadFile(item.url)"
                    >
                      <p class="iconP">
                        <a-icon type="file" />
                      </p>
                      {{ item.name }}
                    </div>
                  </div>
                </div>
                <a-upload :before-upload="beforeUpload" :showUploadList="false" v-if="flag!='details'">
                  <div
                    class="uploadImgIcon flex-ct"
                    v-if="uploadUrls.length < 21"
                  >
                    <a-icon type="plus" />
                  </div>
                </a-upload>
                <ImageEdit
                  :imgList="previewImageList"
                  :filePreviewShow="previewVisible"
                  @close="handleCancelPreviewImage"
                />
              </div>
            </a-form-item>
          </div>
            <!-- <div>
              <div class="marginLeft fontWeight">上传图片：</div>
              <a-upload
                class="marginLeft"
                list-type="picture-card"
                :file-list="fileList"
                accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.png,.jpeg,.txt"
                :showUploadList="{showRemoveIcon: flag == 'details' ? false : true}"
                @preview="handlePreview"
                :before-upload="beforeUpload"
                @change="changeFile"
              >
                <div v-if="flag != 'details' && fileList.length < 21">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">
                    点击上传
                  </div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible" :footer="null" @cancel="() => previewVisible = false">
                <img style="width: 100%" :src="previewImage" />
              </a-modal>
            </div> -->
          </a-col>
        </a-row>
      </div>
      <div class="divBorder">
        <p class="pTittle fontWeight">费用项列表</p>
        <div v-show="flag != 'details'" class="flex-ed topBottom">
          <a-select
            mode="multiple"
            class="selectWidth"
            v-model="feeBox"
            :style="`width: ${selectAutoWidth}%`"
            placeholder="请选择费用进行添加"
            @change="receiveMsgChange"
            :disabled='btnState&&formDisabled'
          >
            <a-select-option v-for="(item, i) in receiveMsgOption" :value="item.id" :key="i"> {{ item.type == 2 ? item.name + "(国际)" : item.name }} </a-select-option>
          </a-select>
          <a-button type="primary" style="margin: 0 10px;" @click="addReceiveMsg" :disabled='btnState&&formDisabled'>添加</a-button>
        </div>
        <a-table
          bordered
          :scroll="{ x: 300, y: costTableData.length < 11 ? 0 : 1300 }"
          :columns="costColumns" :data-source="costTableData" rowKey="fakeId"
          :pagination='false'
        >
          <template tips='费用类型' slot="feeType" slot-scope="text, record">
            <span>{{record.feeType == 1 ? '国内' : record.feeType == 2 ? '国际' : '其他'}}</span>
          </template>
          <span slot="receivingSubjectId"><span class="redfont" v-show="flag != 'details'">*</span>收款主体</span>
          <template tips='收款主体' slot="receivingSubjectId" slot-scope="text, record">
            <a-select
              style="width: 100%; min-width: 280px;"
              v-model="record.receivingSubjectId"
              :disabled="flag == 'details' ||(record.reconciliaState==520||record.reconciliaState==620)"
              placeholder="必选"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option v-for="(item, i) in supplierOption" :key="i" :value="item.id">{{ item.partnerName }}</a-select-option>
            </a-select>
          </template>
          <template tips='清关单号' slot="poCode" slot-scope="text, record">
            <a-input v-if="flag != 'details'" :disabled="record.reconciliaState==520||record.reconciliaState==620" v-model="record.poCode" />
            <span v-else>{{record.poCode}}</span>
          </template>
          <span slot="feeAmount"><span class="redfont" v-show="flag != 'details'">*</span>费用金额</span>
          <span slot="rateTitle"><span class="redfont" v-show="flag != 'details'">*</span>税率/抵扣率(%)</span>
          <template tips='费用金额' slot="feeAmount" slot-scope="text, record">
            <a-input-number v-if="flag != 'details'" placeholder="必填" :disabled="record.reconciliaState==520||record.reconciliaState==620" v-model="record.feeAmount" @change="forEachCaculate('puTotalAmount')"/>
            <span v-else>{{record.feeAmount}}</span>
          </template>
          <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
          <span slot="invoiceBusinessType" slot-scope="text, record">
            <a-select
              v-model="record.invoiceBusinessType"
              @click.stop.native
              placeholder=""
              style="width: 40%"
              :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)"
              @change="forEachCaculate('puTotalAmount')"
            >
              <a-select-option :value="0">应税业务</a-select-option>
              <a-select-option :value="1">免税业务</a-select-option>            </a-select>
              <a-select
                v-model="record.invoiceType"
                @click.stop.native
                placeholder=""
                style="width: 60%"
                :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)"
                @change="forEachCaculate('puTotalAmount')"
              >
                <a-select-option :value='1' title="增值税普通发票">增值税普通发票</a-select-option>
                <a-select-option :value='2' title="增值税专用发票">增值税专用发票</a-select-option>
              </a-select>
          </span>
          <span tips='税率/抵扣率(%)' slot="rate" slot-scope="text, record">
            <span style="width: 40%">
              <span v-if="record.invoiceType == 3">抵扣率</span>
              <span v-if="[1,2,4,5].includes(record.invoiceType)">税率</span>
            </span>
            <a-select style="width: 50%;margin-left:2px" v-model="record.rate" placeholder="必填项"
              :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)"
              @change="forEachCaculate('puTotalAmount')"
            >
              <a-select-option v-for="item in rateOption" :key="item">{{item}}</a-select-option>
            </a-select>
          </span>
          <span tips='不含税金额' slot="priceExcludingTax" slot-scope="text, record">
            <span :calculateNum="priceExcludingTaxx(record, record.feeAmount, record.rate)">
              {{record.feeAmount && record.rate ? formatPrice(+record.feeAmount - +record.rate / 100 * +record.feeAmount /((100 + +record.rate)/ 100), 2) : text||''}}
            </span>
          </span>
          <span tips='币种' slot="currency" slot-scope="text, record">
            <a-select style="width: 100%" v-model="record.currency" :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)">
              <a-select-option v-for="item in currencyOption" :key="item">{{item}}</a-select-option>
            </a-select>
          </span>
          <span tips='汇率' slot="exchangeRate" slot-scope="text, record">
            <a-input-number v-model="record.exchangeRate" :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)"></a-input-number>
          </span>
          <span tips='外币金额' slot="foreignCurrencyAmount" slot-scope="text, record">
            <a-input-number v-model="record.foreignCurrencyAmount" :disabled="flag == 'details'||(record.reconciliaState==520||record.reconciliaState==620)"></a-input-number>
          </span>
          <span tips='人民币金额' slot="currencyAmount" slot-scope="text, record">
            <span :calculateNum="currencyAmountx(record, record.foreignCurrencyAmount, record.exchangeRate)" >
              {{(+record.foreignCurrencyAmount || 0) && (+record.exchangeRate || 0) ? formatPrice((+record.foreignCurrencyAmount).toFixed(2) * (+record.exchangeRate).toFixed(2), 2) : ""}}
            </span>
          </span>
          <template tips='备注' slot="remark" slot-scope="text, record">
            <a-input v-if="flag != 'details'" :disabled="record.reconciliaState==520||record.reconciliaState==620" v-model="record.remark" />
            <span v-else>{{record.remark}}</span>
          </template>
          <template tips='操作' v-if="flag != 'details'" slot="operation" slot-scope="text, record, index">
            <a-button class="greenfont redfonthover" type="link" @click="removeFee(record.id, index)" :disabled='(record.reconciliaState==520||record.reconciliaState==620)'>删除</a-button>
          </template>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
            <span class="greyfont">费用金额</span>
            &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => { return formatPrice(t + (+c.feeAmount || 0),2) }, 0) }}</span>&gt;
          </template>
        </a-table>
      </div>
      <div class="flex-ed marginTop">
        <a-button type="primary" @click="closeModalBtn">关闭</a-button>
        <a-button class="bottomMargin" v-show="flag == 'edit'" type="primary" @click="okSaveEdit">确认</a-button>
      </div>
      <modal-Package ref="modalPackageRef"/>
    </div>
  </a-modal>
</template>

<script>
import modalPackage from './modalPackage'
import {
  details,
  saveEdit,
  // getImgURL,
  // transferFile,
  // saveFile,
  // deleteFile,
  receiveMsg,
  unit,
  getWarehouse,
  contract
} from '@/services/pickUpOrder/receivedList'
import { throttle } from "../../utils/tool";
import { getBuyer } from "../../services/purchaseSaleInventory";
import { partnerType } from "../../services/userMa";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import { isFalse } from "../../utils/util";
import {
  addImg,
  uploadFiles,
  delUploadFiles,
  getUploadFiles,
} from "../../services/product/productList";
import { mustContract } from "../../services/commonSaasApi";
import { PARTNER_STRATEGY } from '@/services/dataFilterStrategy';
const tableColumns = [
  {title: '商品编号', dataIndex: 'itemCode', width: 200},
  {title: '商品名称', dataIndex: 'itemName', width: 220},
  {title: '客户名称', dataIndex: 'customerName', width: 280},
  {title: '门店名称', dataIndex: 'storeName', width: 280},
  {title: '规格', dataIndex: 'itemSpec', width: 120},
  {slots: { title: 'puPrice' }, dataIndex: 'puPrice', width: 160, scopedSlots: {customRender: "puPrice"}},
  {title: '采购件数', dataIndex: 'poQty', width: 120},
  {title: '数量单位', dataIndex: 'unit', width: 120},
  {slots: { title: 'invoiceBusinessTypeTit' }, dataIndex: 'invoiceBusinessType', width: 280, scopedSlots: {customRender: "invoiceBusinessType"}},
  {slots: { title: 'inputTaxRate' }, dataIndex: 'inputTaxRate', width: 200, scopedSlots: {customRender: "inputTaxRate"}},
  {title: '计价单位', dataIndex: 'priceUnit', width: 160, scopedSlots: {customRender: "priceUnit"}},
  {slots: { title: 'deliveryQty' }, dataIndex: 'deliveryQty', width: 160, scopedSlots: {customRender: "deliveryQty"}},
  {title: '包装', dataIndex: 'packingName', width: 120, scopedSlots: {customRender: "packingName"}},
  {title: '包装费用(元)', dataIndex: 'packingCost', width: 160},
  {title: '实际采购总额', dataIndex: 'puTotalAmount', width: 230, scopedSlots: {customRender: "puTotalAmount"}},
  {title: '入库总成本金额', dataIndex: 'totalCostOfWarehousing', width: 230},
  {title: '成本分摊单价', dataIndex: 'costAllocationUnitPrice', width: 230},
  {title: '备注', dataIndex: 'remark', width: 360},
]
const costColumns = [
  {title: '费用类型', dataIndex: 'feeType', width: 180, scopedSlots: {customRender: "feeType"}},
  {title: '费用项', dataIndex: 'feeName', width: 240},
  {slots: { title: 'receivingSubjectId' }, dataIndex: 'receivingSubjectId', width: 340, scopedSlots: {customRender: "receivingSubjectId"}},
  {title: '清关单号', dataIndex: 'poCode', width: 340, scopedSlots: {customRender: "poCode"}},
  {slots: { title: 'feeAmount' }, dataIndex: 'feeAmount', width: 180, scopedSlots: {customRender: "feeAmount"}},
  {slots: { title: "invoiceBusinessTypeTit" }, dataIndex: "invoiceBusinessType", width: 280, align: "center", scopedSlots: { customRender: "invoiceBusinessType" }},
  {slots: { title: "rateTitle" }, dataIndex: "rate", width: 200, align: "center", scopedSlots: { customRender: "rate" }},
  {title: "不含税金额", dataIndex: "priceExcludingTax", width: 180, align: "center", scopedSlots: { customRender: "priceExcludingTax" }},
  {title: "币种", dataIndex: "currency", align: "center", width: 160, scopedSlots: { customRender: "currency" }},
  {title: "汇率", dataIndex: "exchangeRate", align: "center", width: 160, scopedSlots: { customRender: "exchangeRate" }},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 180, align: "center", scopedSlots: { customRender: "foreignCurrencyAmount" }},
  {title: "人民币金额", dataIndex: "currencyAmount", width: 180, align: "center", scopedSlots: { customRender: "currencyAmount" }},
  {title: '备注', dataIndex: 'remark', width: 240, scopedSlots: {customRender: "remark"}},
  {title: '操作', dataIndex: 'operation', width: 120, fixed: 'right', align: 'center', scopedSlots: {customRender: "operation"}}
]
export default {
  name: "modalDetails",
  components: { modalPackage,ImageEdit },
  data() {
    return {
      //免税二期
      invoiceOption: [
        { value: 1, text: "增值税普通发票" },
        { value: 2, text: "增值税专用发票" },
        { value: 3, text: "增值税普通发票(免税)" },
      ],
      rateOption: ["0","1","3","6","9","11","13"],
      currencyOption: ["人民币","美元","欧元","英镑","澳元"],
      visibleLModal: false,
      tableColumns,
      costColumns,
      flag: 'details',
      whichData: 'order',
      allMsg: {},
      headMsg: {
        id: undefined,
        poCode: undefined,
        roCode: undefined,
        supplierName: undefined,
        supplierId: undefined,
        supplierPhone: undefined,
        poSubtime: undefined,
        poSubuserName: undefined,
        buyerName: undefined,
        deliveryUser: undefined,
        deliveryPhone: undefined,
        deliveryAdress: undefined,
        deliveryTime: undefined,
        advanceTime: undefined,
        noPayDate: undefined,
        payAmountRatio: undefined,
        deductions: undefined,
        remark: undefined,
        planDeliveryTime: undefined,
        whId: undefined,
        contractId: undefined,
        contractTitle: undefined,
      },
      unitOption: [],
      supplierOption: [],
      receiveMsgOption: [],
      receiveMsgMaterial: [],
      feeBox: [],
      tableData: [],
      costTableData: [],
      imgData: [],
      previewImg: undefined,
      disabledFlage: 0,
      total: 0,
      // previewVisible: false,
      previewImage: '',
      fileList: [],
      fd: new FormData(),
      imgObj: new Image(),
      enterDetailType:1,
      select: {
        supplier: [],
        warehouse: [],
        contractOption: [],
      },
      suplierMsg: {},
      buyerMsg: {},
      //单据相关
      previewVisible: false,
      uploadUrls: [],
      previewImageList: [],
      mustSelectContract: [],
      mustCheck: false,
    }
  },
  directives: {
    numtrim: {
      inserted: function(el) {
        el.oninput = () => el.value = el.value?.replace(/[^.0-9]|(?<=\.{1}[0-9]{2}).*/,'')
        el.onpaste = () => el.value = el.value?.replace(/[^.0-9]|(?<=\.{1}[0-9]{2}).*/,'')
      }
    },
  },
  computed: {
    priceExcludingTaxx() {
      return function(record, feeAmount, rate) {
        record.priceExcludingTax = feeAmount && rate ? this.formatPrice(+record.feeAmount - +record.rate / 100 * +record.feeAmount /((100 + +record.rate)/ 100), 2) : record.priceExcludingTax||''
        return +record.feeAmount - +record.rate * +record.feeAmount
      }
    },
    currencyAmountx() {
      return function(record, foreignCurrencyAmount, exchangeRate) {
        record.currencyAmount = (+foreignCurrencyAmount || 0) && (+exchangeRate || 0) ? this.formatPrice((+record.foreignCurrencyAmount).toFixed(2) * (+record.exchangeRate).toFixed(2), 2) : undefined
        return +record.foreignCurrencyAmount * +record.exchangeRate
      }
    },
    selectAutoWidth: function() {
      return this.feeBox.length > 3 ? 10 * (this.feeBox.length - 1) < 93 ? 10 * (this.feeBox.length - 1) : 92  : 38
    },
    poQty: function() { return this.formatPrice(this.tableData.reduce((t, c) => t + (+c.poQty || 0), 0)) },
    deliveryQty: function() { return this.formatPrice(this.tableData.reduce((t, c) => t + (+c.deliveryQty || 0), 0)) },
    puTotalAmount: function() { return this.formatPrice(this.tableData.reduce((t, c) => t + (+c.puTotalAmount || 0), 0)) },
    totalCostOfWarehousing: function() { return this.formatPrice(this.tableData.reduce((t, c) => t + (+c.totalCostOfWarehousing || 0), 0)) },
    btnState(){
      let state=false
      if (this.costTableData&&this.costTableData.length>0) {
        if (this.costTableData.findIndex(item=>item.reconciliaState==510||item.reconciliaState==610)==-1) {
          state=true
        }
      }
      return state
    },
    formDisabled(){
      let state=false
      if (this.headMsg.reconciliaState == 520 ||this.headMsg.reconciliaState == 620) {
        state=true
      }
      return state
    }
  },
  methods: {
    supplierStrategy: PARTNER_STRATEGY.SUPPLIER,
    agencyStrategy: PARTNER_STRATEGY.AGENCY,
    async mustContract() {
      await mustContract().then(res => {
        if (res.data.code == 200) {
          this.mustSelectContract = res.data.data
        }
      })
    },
    clearContract() {
      this.headMsg.contractId = undefined
      this.headMsg.contractTitle = undefined
      this.contract()
    },
    async contract(contractTitle) {
      await contract({partnerId: this.headMsg.supplierId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.select.contractOption = res.data.data
        } else {
          this.select.contractOption.splice(0)
        }
      }).catch(() => this.select.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.select.contractOption.find(item => item.id === id)
      this.headMsg.contractTitle = contractMsg.contractTitle
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    //单据文件
    deleteUploads(item, index) {
      if (item.id) {
        let params = new FormData();
        params.append("id", item.id);
        delUploadFiles(params).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("删除单据文件成功");
            this.uploadUrls.splice(index, 1);
          } else {
            this.$message.error(res.data.message);
          }
        });
      } else {
        this.uploadUrls.splice(index, 1);
      }
    },
    //!-----------------------------------------------------
    downloadFile(url) {
      let labelA = document.createElement("a");
      labelA.href = url;
      labelA.click();
    },
    preView(url) {
      this.previewImageList = [];
      this.previewImage = url;
      if (this.uploadUrls.length > 0) {
        this.uploadUrls.forEach((item) => {
          if (item.type.includes("image")) {
            this.previewImageList.push(item.url);
          }
        });
      } else {
        this.previewImageList.push(url);
      }
      this.previewVisible = true;
    },
    handleCancelPreviewImage() {
      this.previewImage = undefined;
      this.previewImageList = [];
      this.previewVisible = false;
    },
    beforeUpload(file) {
      let params = new FormData();
      params.append("file", file);
      params.append("mode", "batch");
      params.append("type", "item");
      params.append("tableName", "pickUpOrder");
      uploadFiles(params).then((res) => {
        if (res.data.code === "200") {
          let uploadFiles = {
            type: res.data.data[0].fileType,
            name: res.data.data[0].fileName,
            url: res.data.data[0].filePath,
            state: res.data.data[0].fileState,
          };
          addImg({
            fileUrlList: uploadFiles,
            tableId: this.headMsg.id,
            tableName: "pickUpOrder",
          }).then((imgres) => {
            if (imgres.data.code == 200) {
              this.$message.success("上传单据文件成功");
              this.uploadUrls.push(uploadFiles);
            } else {
              this.$message.error(imgres.data.message);
            }
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    selectWarehouse(v) {
      let warehouseResult = {}
      warehouseResult = this.select.warehouse.find(h => h.baseId == v) ?? {}
      this.headMsg.whName = warehouseResult.name
      this.headMsg.whCode = warehouseResult.code
    },
    async getWarehouse() {
      await getWarehouse({}).then(res => {
        if (res.data.code == "200") {
          res.data.data.find(x => {
            x.baseId = +x.baseId
            return !1
          })
          this.select.warehouse = res.data.data
        }
      });
    },
    getBuyer() { getBuyer().then(res => res.data.code == 200 && (this.select.buyer = res.data.data)); },
    getBuyerName(value) {
      if (!value) {
        this.headMsg.buyerName = undefined
        return
      }
      this.headMsg.buyerId = value
      this.buyerMsg = this.select.buyer?.find(item => item.id == value)
      this.headMsg.buyerName = this.buyerMsg.realName
    },
    async getSuppliers() {
      await partnerType({ partnerTypes: [30], isEnable: 1 }).then(res => this.select.supplier = res.data.data)
    },
    changeSupplier(value) {
      if (!value) {
        this.headMsg.supplierName = undefined
        return
      }
      this.headMsg.supplierId = value
      this.suplierMsg = this.select.supplier?.find(item => item.id == value)
      this.headMsg.supplierName = this.suplierMsg.partnerName
      this.mustCheck = this.mustSelectContract.includes(this.suplierMsg?.orgId)
      this.clearContract()
    },
    changeSupplierCheck() {
      this.mustCheck = this.mustSelectContract.includes(this.headMsg.orgId)
    },
    changeNoPayAmount() {
      this.headMsg.noPayAmount = this.puTotalAmount - (+this.headMsg.payAmount || 0) - (+this.headMsg.deductions || 0)
      this.$forceUpdate()
    },
    caculateTableValue(value, key, column, id=0, flag) {
      let keyId = id
      // let tableLength = this.tableData?.length - 1
      this.tableData.find((item,i) => item.id == id && (keyId = i))
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = value
        target.puTotalAmount = flag === 'puTotalAmount' ? target.puTotalAmount : this.formatPrice(target.puPrice * target.deliveryQty)
        target.packingCost = this.formatPrice(target.pkgDetails?.reduce((t, c) => this.formatPrice(+t + (+c.packQty * +c.packUnitPrice)), 0))
        target.rowTotal = target.puTotalAmount + target.packingCost
        target.priceExcludingTax =
          target.invoiceType == 1 || target.invoiceType == 2
            ? +target.rowTotal -
              (target.rowTotal * (+target.inputTaxRate / 100)) /
                (1 + +target.inputTaxRate / 100)
            : target.invoiceType == 3
            ? +target.rowTotal - target.rowTotal * (+target.inputTaxRate / 100)
            : target.priceExcludingTax || 0;
        target.priceExcludingTax = +target.priceExcludingTax.toFixed(2);
        target.afterTaxItemAmount=target.invoiceBusinessType == 0 && (target.invoiceType == 2||target.invoiceType == 3)?+target.priceExcludingTax:target.rowTotal||''
        target.feeDataTotal = 0;
        if (this.costTableData && this.costTableData.length > 0) {
          this.costTableData.forEach((item) => {
              if (item.invoiceBusinessType == 0 && item.invoiceType == 2) {
                target.feeDataTotal += +item.priceExcludingTax || 0;
              } else {
                target.feeDataTotal += +item.feeAmount || 0;
              }
          });
        }
        target.tableTotal = this.tableData.reduce((t, c) => this.formatPrice(+t + ((c.invoiceBusinessType == 0 && (c.invoiceType == 2||c.invoiceType == 3)?+c.priceExcludingTax:+c.puTotalAmount) + target.packingCost)), 0)
        target.pageTotal = target.tableTotal + target.feeDataTotal
        target.otherFeeAmount=this.formatPrice(target.feeDataTotal*
        (target.invoiceBusinessType==0&&(target.invoiceType==2||target.invoiceType==3)?+target.priceExcludingTax:target.rowTotal)/target.tableTotal
        )
        // target.pageTotal = target.tableTotal + this.costTableData.reduce((t, c) => this.formatPrice(+t + +c.feeAmount), 0)
        target.totalCostOfWarehousing = this.formatPrice(target.pageTotal * 
        ((target.invoiceBusinessType == 0 && (target.invoiceType == 2||target.invoiceType == 3)?+target.priceExcludingTax:target.rowTotal) / target.tableTotal))
        target.costAllocationUnitPrice = this.formatPrice(target.totalCostOfWarehousing / target.deliveryQty)
        // if (endItem) {
        //   target.totalCostOfWarehousing = target.pageTotal - this.tableData.reduce((t, c, j) => this.formatPrice(t + (j == tableLength ? 0 : +c.totalCostOfWarehousing || 0)), 0)
        //   target.totalCostOfWarehousing = this.formatPrice(target.totalCostOfWarehousing)
        // }
        this.tableData = newData
      }
      this.headMsg.noPayAmount = this.puTotalAmount -  (+this.headMsg.payAmount || 0) - (+this.headMsg.deductions || 0)
    },
    forEachCaculate(flag) {
      let ids = []
      this.tableData.forEach(item => ids.push(item.id))
      ids.forEach((id, k) => this.caculateTableValue(undefined, undefined, undefined, id, flag, ids.length == k + 1))
    },
    handlePuTotalAmount(value, key, column, id=0) {
      let keyId = id
      this.tableData.find((item,i) => item.id == id && (keyId = i))
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.key)[keyId]
      if (target) {
        target[column] = value
        target['deliveryQty'] != 0 && (target['puPrice'] = this.formatPrice(value / target['deliveryQty']))
        this.tableData = newData
      }
      this.changeNoPayAmount()
      this.forEachCaculate("puTotalAmount")
    },
    handleChangeCaculate() {
      this.changeNoPayAmount()
      this.forEachCaculate()
    },
    handleUnitTotalMoney(value, key, column, id=0) {
      let keyId = id
      this.tableData.find((item,i) => item.id == id && (keyId = i))
      const newData = [...this.tableData];
      const target = newData.filter(item => key === item.key)[keyId];
      if (target) {
        target[column] = value;
        this.tableData = newData
      }
    },
    typeOfPicture(url) {
      return new Promise((resolve, reject) => {
        this.imgObj.src = url
        this.imgObj.onload = () => resolve("picX")
        this.imgObj.onerror = () => reject("fileN")
      })
    },
    // getImgURL(id) {
    //   getImgURL({tableId: id, tableName: 'pickUpOrder'}).then(res => {
    //     if (res.data.code == "200") {
    //       res.data.data.forEach((item,i) => {
    //         this.fileList.push({
    //           uid: item.id,
    //           name: "picX",
    //           type: "image",
    //           size: "1000",
    //           url: item.filePath,
    //         })
    //         this.typeOfPicture(item.filePath).catch(e => {
    //           this.fileList[i].name = e
    //           this.fileList[i].type = "application"
    //         })
    //       })
    //     }
    //   })
    // },
    // getFileBase64(file){
    //   return new Promise((resolve, reject) => {
    //     let reader = new FileReader();
    //     let imgData = {
    //       uid: file.uid,
    //       name: file.name,
    //       type: file.type,
    //       size: file.size,
    //       url: undefined,
    //     };
    //     reader.onload = () => {
    //       imgData.url = reader.result;
    //       resolve(imgData)
    //     };
    //     reader.onerror = error => reject(error);
    //     reader.readAsDataURL(file);
    //   })
    // },
    // getFile(res) {
    //   if (!res.url) {
    //     this.$message.warn('找不到文件链接/路径', 3)
    //     return
    //   }
    //   const link = document.createElement('a')
    //   link.href = res.url
    //   link.download = res.name || 'anonymous'
    //   link.click()
    //   window.URL.revokeObjectURL(link.href)
    // },
    // async handlePreview(file) {
    //   if (file.name?.match(/\.pdf|\.docx|\.doc|\.xlsx|\.xls|\.txt/g) != null || file.type?.includes("application")) {
    //     this.getFile(file)
    //     return
    //   }
    //   if (!file.url && !file.preview) {
    //     file.preview = await this.getFileBase64(file.originFileObj);
    //   }
    //   this.previewImage = file.url || file.preview;
    //   this.previewVisible = true;
    // },
    // changeFile(file) {
    //   if (file.file.status === "uploading") return
    //   this.fileList.forEach((item, i) => {
    //     if (file.file.status === "removed" && file.file.url == item.url && file.file.uid == item.uid) {
    //       this.fd.set("id", item.uid)
    //       deleteFile(this.fd).then(res => {
    //         res.data.code == "200" ?
    //         (this.$message.success("删除文件成功"), this.fileList.splice(i, 1)) :
    //         this.$message.error("删除文件失败")
    //       }).catch(() => this.$message.error("删除文件失败"))
    //     }
    //   })
    // },
    // beforeUpload(file) {
    //   let fd = new FormData()
    //   fd.set("file", file)
    //   fd.set("mode", "batch")
    //   fd.set("tableId", this.headMsg.id)
    //   fd.set("tableName", "pickUpOrder")
    //   transferFile(fd).then(res => {
    //     if (res.data.code == "200") {
    //       this.saveFile(res.data.data[0].filePath)
    //       this.fileList.push({
    //         uid: this.fileList.length,
    //         url: res.data.data[0].filePath,
    //         name: res.data.data[0].fileName,
    //         size: res.data.data[0].fileSize,
    //         type: res.data.data[0].fileType,
    //       })
    //     }
    //   }).catch(() => this.$message.warn('获取上传文件记录失败'))
    // },
    // saveFile(url) {
    //   const params = {
    //     tableId: this.headMsg.id,
    //     tableName: "pickUpOrder",
    //     fileUrlList: [url]
    //   }
    //   saveFile(params).then(res => res.data.code == "200" && this.$message.success("上传文件成功"))
    // },
    getCostTableData(allGet) {
      allGet.forEach(item => {
        this.costTableData.push({
          id: item.id,
          feeType: item.type,
          feeName: item.name,
          receivingSubjectId: this.supplierOption[0]?.id,
          receivingSubjectName: this.supplierOption[0]?.partnerCode,
          receivingSubjectCode: this.supplierOption[0]?.partnerName,
          poCode: this.headMsg.poCode,
          feeAmount: undefined,
          remark: undefined,
          operation: undefined,
          // dutyFreeState:1,
        })
      })
      this.costTableData.forEach((fakeId,f) => fakeId.fakeId = ++f)
      this.feeBox = []
    },
    receiveMsg(orderType) { receiveMsg({orderType:orderType===1?1:3}).then(res => res.data.code == 200 && (this.receiveMsgOption = res.data.data)) },
    receiveMsgChange(value) { this.feeBox = value },
    addReceiveMsg() {
      this.receiveMsgMaterial = []
      this.receiveMsgOption.forEach(item => this.feeBox.forEach(val => val == item.id && ( item.id='',this.receiveMsgMaterial.push(item))))
      this.getCostTableData(this.receiveMsgMaterial)
    },
    removeFee(record, index) {
      this.costTableData.splice(index, 1)
      this.forEachCaculate("puTotalAmount")
    },
    details(id, type = 1) {
      let parmas = {
        id: id,
        sort: 'id',
        order: 'desc',
        enterDetailType: type,
      }
      details(parmas).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data?.details || []
          this.headMsg.payReconciliaState = res.data.data.payReconciliaState
          this.costTableData = res.data.data?.purchaseFeeList || []
          this.costTableData.forEach((fakeId,f) => fakeId.fakeId = ++f)
        }
      }).catch(() => this.$message.error("查看待结算列表详情失败") )
    },
    changeData(flag, type) {
      this.whichData = flag
      this.enterDetailType=type
      this.details(this.headMsg.id, type)
    },
    addPackage(flag, packingName) { this.$refs.modalPackageRef.openModal(flag, packingName) },
    async openModal(flag, record) {
      this.costTableData = []
      this.fileList = []
      this.flag = flag
      this.allMsg = record
      this.whichData = 'order'
      this.headMsg = {...record}
      this.changeSupplierCheck(record.orgId)
      this.details(record.id)
      // this.getImgURL(record.id)
      await this.getWarehouse()
      await this.getBuyer()
      await this.contract()
      this.receiveMsg(record.poType)
      if (!this.select.contractOption?.some(x => x.id == record.contractId) && !this.typeis(record.contractId, 'undefined')) {
        this.select.contractOption.unshift({id: record.contractId, contractTitle: record.contractTitle})
      }
      if (!this.select.supplier?.some(x => x.id == record.supplierId) && !this.typeis(record.supplierId, 'undefined')) {
        this.select.supplier.unshift({id: record.supplierId, partnerName: record.supplierName, orgId: record.orgId, partnerType: 30})
      }
      if (!this.select.warehouse?.some(x => x.baseId == record.whId) && !this.typeis(record.whId, 'undefined')) {
        this.select.warehouse.unshift({baseId: record.whId, name: record.whName, code: record.whCode})
      }
      this.visibleLModal = true
      let params = new FormData();
      params.append("tableId", record.id);
      params.append("tableName", "pickUpOrder");
      let res= await getUploadFiles(params)
      this.uploadUrls = [];
      if (res.data.code == 200 && res.data.data.length > 0) {
        let filetemp = [];
        res.data.data.forEach((item) => {
          filetemp.push({ ...JSON.parse(item.filePath), id: item.id });
        });
        this.uploadUrls = filetemp;
      }
    },
    closeModalBtn() { this.visibleLModal = false },
    throttleOKSaveEdit: throttle(function() {
      if (this.mustCheck && this.isUndef(this.headMsg.contractId)) {
        this.$message.error("请选择关联合同")
        return
      }
      if (this.headMsg.noPayAmount < 0) {
        this.$message.error("尾款为负数，请确认是否输入有误")
        return
      }
      if (this.costTableData.some(item => isFalse([item.receivingSubjectId,item.rate,item.feeAmount,item.invoiceBusinessType,item.invoiceType]))) {
        this.$message.warn('收款主体、费用金额、发票类型、税率存在空值')
        return
      }
      if (this.tableData.some(item => isFalse([item.puPrice,item.deliveryQty,item.inputTaxRate,item.invoiceBusinessType,item.invoiceType]))) {
        this.$message.warn('收货单商品列表必填项存在空值')
        return
      }
      if (this.typeis(this.headMsg.whId, 'undefined')) {
        this.$message.warn('入库仓库为必填项')
        return
      }
      this.allMsg = {...this.headMsg}
      this.allMsg.totalCostOfWarehousing = this.tableData.reduce((t, c) => { return this.formatPrice(t + ((+c.puTotalAmount || 0) + (+c.packingCost || 0))) || 0 }, 0)
      this.allMsg.purchaseFeeList = this.costTableData
      this.allMsg.details = this.tableData
      this.allMsg.enterDetailType = this.enterDetailType
      const params = this.allMsg
      saveEdit(params).then(res => {
        if (res.data.code == 200) {
          this.visibleLModal = false
          this.$parent.submitPagination()
          this.$message.success(res.data.message)
        } else { this.$message.error(res.data.message) }
      }).catch(e => this.$message.error("更新失败"+e, 3))
    },3500),
    okSaveEdit() { this.throttleOKSaveEdit() },
    handleSupplierSearch() { partnerType({ partnerTypes: [30], isEnable: 1 }).then(res => res.data.code == '200' && (this.supplierOption = res.data.data)) },
    unit() { unit({type: 10}).then(res => res.data.code == '200' && (this.unitOption = res.data.data)) },
  },
  async activated() {
    await this.mustContract()
    this.getSuppliers()
    this.unit()
    this.handleSupplierSearch()
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.uploadbox {
  flex-wrap: wrap;

  .imgWrap {
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .uploadImgs {
    position: relative;
    border-radius: 4px;
    width: 104px;
    height: 104px;
    border: 1px solid #d9d9d9;
    padding: 14px;
    margin-bottom: 4px;

    .imgDelete {
      cursor: pointer;
      position: absolute;
      right: 4px;
      top: -10px;
    }

    .iconBox {
      text-align: center;
      font-size: 16px;

      /deep/.iconP {
        margin: 0;
        padding: 0;
        line-height: 0;

        i {
          svg {
            width: 40px;
            height: 40px;
            color: #818181;
          }
        }
      }
    }

    img {
      width: 100%;
      height: 100%;
      vertical-align: middle;
      object-fit: cover;
    }

    margin-right: 4px;
  }

  .uploadImgIcon {
    width: 104px;
    height: 104px;
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    background-color: #fafafa;
    cursor: pointer;
  }
}
.modalTop{
  /deep/.ant-modal{
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
    .fontWeight {
      font-weight: 600;
    }
    .divBorder {
      margin-top: 10px;
      border: @border-color;
      .rowMarginTop {
        margin: 5px 0;
        padding: 0 16px;
        .widthMax {
          width: 100%;
        }
      }
      .topBottom {
        margin: 10px 0;
        .selectWidth {
          width: 38%;
          min-width: 475px;
          max-width: 1800px;
          transition: width 1s;
        }
      }
    }
    .marginTop {
      margin-top: 10px;
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .heightDiv {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
      }
      .ant-table-footer .ant-divider {
        margin-left: 5px;
        background-color: #7a7a7a;
      }
    }
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>