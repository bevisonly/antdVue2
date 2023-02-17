<template>
  <div class="details-modal">
    <!-- <a-modal
      width="60%"
      centered
      v-model="visible"
      title="销售单签收"
      destroyOnClose
    > -->
    <a-page-header
      style="border: 1px solid rgb(235, 237, 240)"
      :title="pageTitle"
      @back="handleBack"
    />
    <div class="order-info">
      <a-card
        size="small"
        title="订单信息"
        :head-style="{ backgroundColor: '#f0f3f6' }"
      >
        <div class="signed-info">
          <a-form :form="orderInfo">
            <a-row :gutter="12">
              <a-col :span="6">
                <a-form-item label="送货日期">
                  <a-input v-model="orderInfo.deliveryDate" :disabled="true">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="运营主体">
                  <a-input
                    v-model="orderInfo.opName"
                    placeholder=""
                    :disabled="true"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="客户类型">
                  <a-select
                    style="width: 100%"
                    v-model="orderInfo.customerType"
                    @select="handlecustomertypeChange"
                    :disabled="reconciliaState"
                  >
                    <a-select-option :value="1"> 客户列表 </a-select-option>
                    <!-- <a-select-option :value="2"> 自定义客户 </a-select-option> -->
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="客户名称" class="required">
                  <a-input v-if="orderInfo.customerType == 2" v-model="orderInfo.customerName" :disabled="reconciliaState"></a-input>
                  <a-select
                    v-else
                    show-search
                    :filter-option="filterOption"
                    v-model="orderInfo.customerId"
                    style="width: 100%"
                    :disabled="reconciliaState"
                    @select="handleSelectCustomer"
                    placeholder="客户名称"
                  >
                    <a-select-option v-for="d in option.customer" :key="d.id">
                      {{ d.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="客户门店">
                  <a-input v-if="orderInfo.customerType == 2" v-model="orderInfo.storeName" :disabled="reconciliaState"></a-input>
                  <a-select
                    v-else
                    v-model="orderInfo.storeId"
                    style="width: 100%"
                    placeholder="客户门店"
                    :disabled="reconciliaState"
                    show-search
                    :filter-option="filterOption"
                    @select="handleSelectStore"
                  >
                    <a-select-option v-for="item in option.store" :key="item.id" >
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="销售订单号">
                  <a-input v-model="orderInfo.sno" :disabled="true"> </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="收款方式">
                  <a-select
                    v-model="orderInfo.payType"
                    style="width: 100%"
                    placeholder="收款方式"
                    :disabled="orderInfo.customerType == 2 || reconciliaState"
                    @select="forceUpdate"
                  >
                    <a-select-option :value="1" >现结</a-select-option>
                    <a-select-option :value="2" >周期结算</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="6" v-if="orderInfo.type == 3">
                <a-form-item label="是否采购服务">
                  <a-input
                    v-model="orderInfo.isPurchaseServerText"
                    placeholder=""
                    :disabled="true"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6" v-if="orderInfo.type == 3">
                <a-form-item label="服务单类型">
                  <a-input
                    v-model="orderInfo.serverTypeText"
                    placeholder=""
                    :disabled="true"
                  >
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item label="备注">
                  <a-input v-model="orderInfo.remark" :disabled="true">
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="关联合同" :class="{required: mustCheck}">
                  <a-select
                    style="width: 100%;"
                    show-search
                    v-model="orderInfo.contractId"
                    placeholder="请先选择客户"
                    :default-active-first-option="false"
                    :filter-option="false"
                    :not-found-content="null"
                    :disabled="!orderInfo.customerId||orderInfo.reconciliaState==520||orderInfo.reconciliaState==620"
                    @search="contract"
                    @select="contractSelect"
                    @focus="contract"
                  >
                    <a-select-option v-for="item in contractOption" :key="item.id">{{item.contractTitle}}&{{item.contractNumber}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
    </div>
    <div class="signed-item" style="margin-top: 10px">
      <a-card
        size="small"
        title="签收录入"
        :head-style="{ backgroundColor: '#f0f3f6' }"
      >
        <div class="receiving-info">
          <a-form-model :form="receiveForm">
            <a-row :gutter="12">
              <a-col :span="6">
                <a-form-model-item label="送货司机" prop="deliveryDriver">
                  <a-input
                    v-model="receiveForm.deliveryDriver"
                    :readOnly="pageState === 2"
                    :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="送货司机手机号" prop="deliveryPhone">
                  <a-input
                    v-model="receiveForm.deliveryPhone"
                    placeholder=""
                    :readOnly="pageState === 2"
                    :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="签收人" prop="signPerson">
                  <a-input
                    v-model="receiveForm.signPerson"
                    :readOnly="pageState === 2"
                    :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
                  >
                  </a-input>
                </a-form-model-item>
              </a-col>
              <!-- <a-col :span="6">
                  <a-form-model-item label="客户订单号" prop="customerSno">
                    <a-input v-model="receiveForm.customerSno" placeholder="">
                    </a-input>
                  </a-form-model-item>
                </a-col> -->
            </a-row>
          </a-form-model>
          <div class="upload-img" v-if="pageState !== 2">
            <a-form-item label="上传单据">
              <div class="flex-fs uploadbox">
                <div v-if="uploadUrls.length > 0" class="flex-fs imgWrap">
                  <div
                    class="uploadImgs"
                    v-for="(item, index) in uploadUrls"
                    :key="index"
                  >
                    <span class="imgDelete" @click="deleteUploads(item, index)" v-if="orderInfo.reconciliaState!=520&&orderInfo.reconciliaState!=620">
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
                <a-upload :before-upload="beforeUpload" :showUploadList="false">
                  <div
                    class="uploadImgIcon flex-ct"
                    v-if="uploadUrls.length < 21&&(orderInfo.reconciliaState!=520&&orderInfo.reconciliaState!=620)"
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
        </div>
        <div class="detail-table">
          <a-table
            :columns="columns"
            :data-source="tableDetail"
            :pagination="false"
            :loading="tableLoading"
            style="margin-top: 10px"
            size="small"
            :scroll="{ y: 300, x: 1300 }"
            rowKey="dataIndex"
          >
            <span slot="customerSno" slot-scope="text, record">
              <a-input
                v-model="record.customerSno"
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input>
            </span>
            <span slot="signQtyTit" class="table-formva"> 验收数量</span>
            <span slot="signPriceTit" class="table-formva"> 验收价格</span>
            <span slot="signQty" slot-scope="text, record">
              <a-input-number
                v-model="record.signQty"
                placeholder="必填"
                v-number
                @change="
                  handleCaculate(
                    record.signQty,
                    record.key,
                    'signQty',
                    record.id
                  )
                "
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="signPrice" slot-scope="text, record">
              <a-input-number
                v-model="record.signPrice"
                v-number
                @change="
                  handleCaculate(
                    record.signPrice,
                    record.key,
                    'signPrice',
                    record.id
                  )
                "
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="signItemAmount" slot-scope="text, record">
              <a-input-number
                v-model="record.signItemAmount"
                v-number
                @change="
                  handleCaculate(
                    record.signItemAmount,
                    record.key,
                    'signItemAmount',
                    record.id
                  )
                "
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="costWeight" slot-scope="text, record">
              <a-input-number
                v-model="record.costWeight"
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="returnQty" slot-scope="text, record">
              <a-input-number
                v-model="record.returnQty"
                v-number
                :disabled="
                  (orderInfo.isPurchaseServer == 0 && orderInfo.type == 3)||(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)
                "
              ></a-input-number>
            </span>

            <span slot="badQty" slot-scope="text, record">
              <a-input-number v-model="record.badQty" v-number></a-input-number>
            </span>
            <span slot="costQty" slot-scope="text, record">
              <a-input-number
                v-model="record.costQty"
                v-number
                :readOnly="pageState === 2 || pageState === 0"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="costPrice" slot-scope="text, record">
              <a-input-number
                v-model="record.costPrice"
                v-number
                :readOnly="pageState === 2 || pageState === 0"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input-number>
            </span>
            <span slot="signItemName" slot-scope="text, record">
              <a-input
                v-model="record.signItemName"
                placeholder="必填"
                :readOnly="pageState === 2"
                :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
              ></a-input>
            </span>
            <span slot="packageList" slot-scope="text, record">
              <a-button type="link" @click="openPackage(record)" :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
                >包装选择</a-button
              >
            </span>
            <span slot="priceUnit" slot-scope="text, record">
              <div>
                <a-select
                  style="width: 100%"
                  v-model="record.priceUnit"
                  placeholder="请选择"
                  :readOnly="pageState === 2"
                  :disabled='orderInfo.reconciliaState==520||orderInfo.reconciliaState==620'
                >
                  <a-select-option
                    v-for="item in dictionaryData"
                    :key="item.id"
                    :value="item.dicText"
                    >{{ item.dicText }}
                  </a-select-option>
                </a-select>
              </div>
            </span>
          <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
          <span slot="invoiceBusinessType" slot-scope="text, record">
              <a-select
                v-model="record.invoiceBusinessType"
                @click.stop.native
                placeholder=""
                :disabled="(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)||pageState==2"
                style="width: 40%">
                <a-select-option :value='0'>应税业务</a-select-option>
                <a-select-option :value='1'>免税业务</a-select-option>
              </a-select>
              <a-select
                v-model="record.invoiceType"
                @click.stop.native
                placeholder=""
                :disabled="(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)||pageState==2"
                @change="taxAmountComputed(record)"
                style="width: 60%">
                <a-select-option v-for="(item,index) in invoiceOption" :key="index" :value='item.value' :title='item.text'>
                  {{item.text}}
                </a-select-option>
              </a-select>
          </span>
          <span slot="vatTit" class="table-formva">税率/抵扣率(%)</span>
          <span tips="税率" slot="vat" slot-scope="text, record">
            <span style="width: 40%">
              <span v-if="record.invoiceType==3">抵扣率</span>
              <span v-if='record.invoiceType==1||record.invoiceType==2'>税率</span>
            </span>
            <a-select
              style="width: 50%;margin-left:2px"
              v-model="record.vat"
              placeholder="必填项"
              :disabled="(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)||pageState==2"
              @change="taxAmountComputed(record)"
            >
              <a-select-option v-for="item in rateOption" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </span>
            <span slot="opreation" slot-scope="text, record">
              <a-button
                type="link"
                @click="showModalBill(record)"
                :disabled="record.signQty <= 1"
                >拆单</a-button
              >
              <a-button
                type="link"
                v-if="!record.id"
                @click="removeTemp(record)"
                >删除</a-button
              >
            </span>
            <template slot="footer">
              <div>
                <div class="totalSum" style="font-weight: bold">
                  合计 :
                  <span style="margin-left: 20px">
                    总验收金额 :{{ sumPrice }}</span
                  >
                  <span style="margin-left: 20px">
                    商品总数量 :{{ sumQty }}</span
                  >
                </div>
              </div>
            </template>
          </a-table>
        </div>
      </a-card>
      <div class="divBorder">
        <p class="pTittle fontWeight">费用项列表</p>
        <div v-show="flag != 'details'&&pageState!=2" class="flex-ed topBottom">
          <a-select
            mode="multiple"
            class="selectWidth"
            v-model="feeBox"
            :style="`width: ${selectAutoWidth}%`"
            placeholder="请选择费用进行添加"
            @change="receiveMsgChange"
            show-search
            :filter-option="filterOption"
            :disabled='btnState&&(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)'
          >
            <a-select-option
              v-for="(item, i) in receiveMsgOption"
              :value="item.id"
              :key="i"
            >
              {{ item.type == 2 ? item.name + "(国际)" : item.name }}
            </a-select-option>
          </a-select>
          <a-button type="primary" style="margin: 0 10px" @click="addReceiveMsg" :disabled='btnState&&(orderInfo.reconciliaState==520||orderInfo.reconciliaState==620)'
            >添加</a-button
          >
        </div>
        <a-table
          bordered
          :scroll="{ x: 300, y: costTableData.length < 11 ? 0 : 800 }"
          :columns="costColumns"
          :data-source="costTableData"
          rowKey="rowId"
          :pagination="false"
        >
          <template tips="费用类型" slot="feeType" slot-scope="text, record">
            <span>{{
              record.feeType == 1
                ? "国内"
                : record.feeType == 2
                ? "国际"
                : "其他"
            }}</span>
          </template>
          <span slot="receivingSubjectId"
            ><span class="redfont" v-show="flag != 'details'">*</span
            >收款主体</span
          >
          <template
            tips="收款主体"
            slot="receivingSubjectId"
            slot-scope="text, record"
          >
            <a-select
              style="width: 100%; min-width: 280px"
              v-model="record.receivingSubjectId"
              :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
              placeholder="必选"
              @change="
                () =>
                  handleChange(
                    record.receivingSubjectId,
                    record.key,
                    'receivingSubjectId',
                    record.id
                  )
              "
              @focus="handleSupplierSearch"
              show-search
              :filter-option="filterOption"
            >
              <a-select-option
                v-for="(item, i) in supplierOption"
                :key="i"
                :value="item.id"
                >{{ item.partnerName }}</a-select-option
              >
            </a-select>
          </template>
          <template
            tips="清关单号"
            slot="customsClearanceFeeNumber"
            slot-scope="text, record"
          >
            <a-input
              v-if="flag != 'details'"
              v-model="record.customsClearanceFeeNumber"
              :disabled='(record.reconciliaState==520||record.reconciliaState==620)||pageState==2'
            />
            <span v-else>{{ record.customsClearanceFeeNumber }}</span>
          </template>
          <span slot="feeAmount"
            ><span class="redfont" v-show="flag != 'details'">*</span
            >费用金额</span
          >
          <span slot="rateTitle"
            ><span class="redfont" v-show="flag != 'details'">*</span
            >税率/抵扣率(%)</span
          >
          <template tips="费用金额" slot="feeAmount" slot-scope="text, record">
            <a-input-number
              v-if="flag != 'details'"
              placeholder="必填"
              v-model="record.feeAmount"
              :disabled='(record.reconciliaState==520||record.reconciliaState==620)||pageState==2'
            />
            <span v-else>{{ record.feeAmount }}</span>
          </template>
          <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
          <span slot="invoiceBusinessType" slot-scope="text, record">
              <a-select
                v-model="record.invoiceBusinessType"
                @click.stop.native
                placeholder=""
                :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
                style="width: 40%">
                <a-select-option :value='0'>应税业务</a-select-option>
                <a-select-option :value='1'>免税业务</a-select-option>
              </a-select>
              <a-select
                v-model="record.invoiceType"
                @click.stop.native
                placeholder=""
                :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
                style="width: 60%">
                <a-select-option :value='1' title='增值税普通发票'>增值税普通发票</a-select-option>
                <a-select-option :value='2' title='增值税专用发票'>增值税专用发票</a-select-option>
              </a-select>
          </span>
          <span tips="税率" slot="rate" slot-scope="text, record">
            <span style="width: 40%">
              <span v-if="record.invoiceType==3">抵扣率</span>
              <span v-if='record.invoiceType==1||record.invoiceType==2'>税率</span>
            </span>
            <a-select
              style="width: 50%;margin-left:2px"
              v-model="record.rate"
              placeholder="必填项"
              @change="rateChange"
              :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
            >
              <a-select-option v-for="item in rateOption" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </span>
          <span
            tips="不含税金额"
            slot="priceExcludingTax"
            slot-scope="text, record"
          >
            <span
              :calculateNum="
                priceExcludingTaxx(record, record.feeAmount, record.rate)
              "
            >
              {{
                record.feeAmount && record.rate
                  ? formatPrice(
                      +record.feeAmount -
                        ((+record.rate / 100) * +record.feeAmount) /((100 + +record.rate)/ 100),
                      2
                    )
                  : text||''
              }}
            </span>
          </span>
          <span tips="币种" slot="currency" slot-scope="text, record">
            <a-select
              style="width: 100%"
              v-model="record.currency"
              :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
            >
              <a-select-option v-for="item in currencyOption" :key="item">{{
                item
              }}</a-select-option>
            </a-select>
          </span>
          <span tips="汇率" slot="exchangeRate" slot-scope="text, record">
            <a-input-number
              v-model="record.exchangeRate"
              :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
            ></a-input-number>
          </span>
          <span
            tips="外币金额"
            slot="foreignCurrencyAmount"
            slot-scope="text, record"
          >
            <a-input-number
              v-model="record.foreignCurrencyAmount"
              :disabled="(record.reconciliaState==520||record.reconciliaState==620)||pageState==2"
            ></a-input-number>
          </span>
          <span
            tips="人民币金额"
            slot="currencyAmount"
            slot-scope="text, record"
          >
            <span
              :calculateNum="
                currencyAmountx(
                  record,
                  record.foreignCurrencyAmount,
                  record.exchangeRate
                )
              "
            >
              {{
                (+record.foreignCurrencyAmount || 0) &&
                (+record.exchangeRate || 0)
                  ? formatPrice(
                      (+record.foreignCurrencyAmount).toFixed(2) *
                        (+record.exchangeRate).toFixed(2),
                      2
                    )
                  : ""
              }}
            </span>
          </span>
          <template tips="备注" slot="remark" slot-scope="text, record">
            <a-input v-if="flag != 'details'" v-model="record.remark" :disabled='(record.reconciliaState==520||record.reconciliaState==620)||pageState==2' />
            <span v-else>{{ record.remark }}</span>
          </template>
          <template
            tips="操作"
            v-if="flag != 'details'"
            slot="operation"
            slot-scope="text, record"
          >
            <a-button
              class="greenfont redfonthover"
              type="link"
              @click="removeFee(record.id)"
              :disabled='(record.reconciliaState==520||record.reconciliaState==620)||pageState==2'
              >删除</a-button
            >
          </template>
          <template tips="合计" slot="footer" slot-scope="currentPageData">
            本页合计：
            <span class="greyfont">费用金额</span>
            &lt;<span class="redfont">{{
              currentPageData.reduce((t, c) => {
                return (
                  ((+t + +c.feeAmount).toFixed(2) * 100) / 100 || 0
                );
              }, 0)
            }}</span
            >&gt;
          </template>
        </a-table>
      </div>
    </div>
    <div
      style="
        text-align: right;
        height: 60px;
        line-height: 60px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      "
    >
      <a-space>
        <a-button @click="handleBack">返回列表</a-button>
        <a-button
          type="primary"
          @click="signedConfirmMethod"
          :disabled="!hasPermission('waitForSigned_confirm')"
          :loading="btnLoading"
          v-if="pageState === 0"
          >签收确认</a-button
        >
        <a-button
          type="primary"
          @click="signedConfirmMethod"
          :disabled="!hasPermission('waitForSigned_confirm')"
          :loading="btnLoading"
          v-if="pageState === 1"
          >保存编辑</a-button
        >
        <a-button
          type="primary"
          @click="signedConfirmMethod"
          :disabled="!hasPermission('waitForSigned_confirm')"
          :loading="btnLoading"
          v-if="pageState === 2"
          >确认</a-button
        >
      </a-space>
    </div>
    <!-- </a-modal> -->
    <!-- 包装选择 -->
    <a-modal
      title="包装选择"
      :visible="packageVisible"
      :width="700"
      @cancel="handleCancelPackage"
      :dialogStyle="{
        top: '160px',
      }"
      destroyOnClose
    >
      <div class="details">
        <div class="table">
          <p class="table-title flex-sb">
            <span>包装列表</span>
            <span>
              <a-select
                ref="addPackageSelect"
                mode="multiple"
                v-model="valueSelectPackage"
                size="small"
                show-search
                placeholder="请选择包装"
                option-filter-prop="children"
                style="width: 200px; margin-right: 6px"
                :filter-option="filterOption"
                @change="chooseSelectPackage"
              >
                <div slot="dropdownRender" slot-scope="menu">
                  <v-nodes :vnodes="menu" />
                  <a-divider style="margin: 4px 0" />
                  <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                  >
                    <a-button type="primary" size="small" @click="addPackage"
                      >确认</a-button
                    >
                  </div>
                </div>
                <a-select-option
                  v-for="item in packageListData"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.packName }}
                </a-select-option>
              </a-select>
            </span>
          </p>
          <div class="table-data">
            <a-table
              rowKey="packCode"
              :pagination="false"
              :columns="packageColumns"
              :data-source="packageData"
              :scroll="{ y: 200 }"
            >
              <span slot="PQTitle" class="table-formva"> 包装数量</span>
              <span slot="del" slot-scope="text, record, index">
                <a-popconfirm
                  title="确定要删除这条数据吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="delPackageOne(record, index)"
                  @cancel="cancel"
                >
                  <a-button type="link"> 删除 </a-button>
                </a-popconfirm>
              </span>
              <span slot="packQty" slot-scope="text, record">
                <a-input-number
                  v-model="record.packQty"
                  placeholder="必填"
                  v-number
                ></a-input-number>
              </span>
              <span slot="packUnitPrice" slot-scope="text">
                <span>{{ text }}</span>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="handleCancelPackage">取消 </a-button>
        <a-button type="primary" @click="handleSubmitPackage">确定 </a-button>
      </template>
    </a-modal>
    <a-modal
      title="签收拆单"
      :visible="separdinedBillVisible"
      :width="600"
      @cancel="billCancel"
    >
      <a-row :gutter="12">
        <a-col :span="16">
          <a-form-item label="商品名称">
            <a-input :disabled="true" v-model="billData.itemName"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :span="16">
          <span class="surplus">剩余可拆单量 : {{ billData.signQty }} </span>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="4"
          ><a-button
            :disabled="!billData.signQty > 0"
            type="primary"
            icon="plus"
            @click="billspread"
            >再拆一单</a-button
          ></a-col
        >
      </a-row>
      <a-row
        :gutter="24"
        v-for="(item, index) in bills"
        :key="index"
        type="flex"
      >
        <a-col :span="16">
          <a-form-item label="分配数量">
            <a-input-number v-model="item.signQty" v-number></a-input-number>
          </a-form-item>
        </a-col>
        <a-form-item>
          <a-button
            type="primary"
            icon="minus"
            @click="removeBill(item)"
            style="margin-top: 42px; margin-left: 4px"
          ></a-button>
        </a-form-item>
      </a-row>

      <template slot="footer">
        <a-button type="primary" @click="confirmBill">确认拆单</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import {
  getSignedDetails,
  signedConfirm,
  // checkLockInventoryOrder,
} from "../../services/signed/waitForSigned";
import {
  GetEditOrder,
  GetReturnOrBadView,
  ReSignedOrder,
  ReturnOrBadOrder,
  receiveMsg,
  contract,
} from "../../services/signed/signed";
import { partnerType } from "@/services/userMa.js"
import { dictionary } from "../../services/pickUpOrder/pickUpOrderList";
import { packList } from "../../services/purchaseSaleInventory";
import {
  addImg,
  uploadFiles,
  delUploadFiles,
  getUploadFiles,
} from "../../services/product/productList";
import ImageEdit from "../../components/imageEdit/imageEdit.vue";
import { isFalse } from "../../utils/util";
import { mustContract } from "../../services/commonSaasApi";
const columnsAll = [
  {
    align: "center",
    title: "入库日期",
    dataIndex: "prodDate",
    width: 200,
  },
  {
    align: "center",
    title: "柜号",
    dataIndex: "containCode",
    width: 100,
  },
  {
    align: "center",
    title: "商品编码",
    dataIndex: "itemSno",
    width: 100,
  },
  {
    align: "center",
    title: "采购商品名称",
    dataIndex: "itemName",
    width: 200,
  },
  {
    align: "center",
    title: "规格",
    dataIndex: "specs",
    width: 100,
  },

  {
    align: "center",
    slots: { title: "signQtyTit" },
    dataIndex: "signQty",
    width: 100,
    scopedSlots: { customRender: "signQty" },
  },
  {
    align: "center",
    slots: { title: "signPriceTit" },
    dataIndex: "signPrice",
    scopedSlots: { customRender: "signPrice" },
    width: 100,
  },
  {
    align: "center",
    title: "计价单位",
    dataIndex: "priceUnit",
    width: 100,
    scopedSlots: { customRender: "priceUnit" },
  },
  {
    align: "center",
    title: "验收金额",
    dataIndex: "signItemAmount",
    width: 140,
    scopedSlots: { customRender: "signItemAmount" },
  },
  {titleTips: "发票类型",
    slots: { title: "invoiceBusinessTypeTit" },
    dataIndex: "invoiceBusinessType",
    width: 280,
    align: "center",
    scopedSlots: { customRender: "invoiceBusinessType" },},
  {titleTips: "税率/抵扣率",
   slots: { title: "vatTit" },
   dataIndex: "vat",width: 150,
   align: "center",
   scopedSlots: { customRender: "vat" },
   },
  {
    align: "center",
    title: "税额",
    dataIndex: "taxAmount",
    width: 150,
  },
  {
    align: "center",
    title: "客户订单号",
    dataIndex: "customerSno",
    width: 200,
    scopedSlots: { customRender: "customerSno" },
  },
  {
    align: "center",
    title: "辅助单位",
    dataIndex: "costWeight",
    width: 100,
    scopedSlots: { customRender: "costWeight" },
  },
  //! {
  //!   align: "center",
  //!   title: "出库数量",
  //!   width: 100,
  //!   dataIndex: "deliveryCount",
  //! },

  {
    align: "center",
    title: "成本价",
    dataIndex: "costPrice",
    width: 100,
  },
  //! scopedSlots: { customRender: "costPrice" },
  {
    align: "center",
    title: "成本数量",
    dataIndex: "costQty",
    width: 100,
    scopedSlots: { customRender: "costQty" },
  },
  {
    align: "center",
    title: "退货数量",
    dataIndex: "returnQty",
    width: 100,
    scopedSlots: { customRender: "returnQty" },
  },
  {
    align: "center",
    title: "转呆滞数量",
    dataIndex: "badQty",
    width: 100,
    scopedSlots: { customRender: "badQty" },
  },
  {
    align: "center",
    title: "验收商品名称",
    dataIndex: "signItemName",
    width: 100,
    scopedSlots: { customRender: "signItemName" },
  },
  {
    align: "center",
    title: "包装",
    dataIndex: "packageList",
    width: 100,
    scopedSlots: { customRender: "packageList" },
  },
  {
    align: "center",
    title: "包装数量",
    dataIndex: "packQty",
    width: 100,
    scopedSlots: { customRender: "packQty" },
  },
  {
    align: "center",
    title: "包装费用",
    dataIndex: "packAmount",
    width: 100,
  },
  {
    align: "center",
    title: "操作",
    dataIndex: "opreation",
    width: 150,
    scopedSlots: { customRender: "opreation" },
    fixed: "right",
  },
];
const packageColumns = [
  {
    dataIndex: "del",
    title: "操作",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "del" },
  },
  {
    title: "包装名称",
    dataIndex: "packName",
    width: 100,
    align: "center",
  },
  {
    title: "包装编号",
    dataIndex: "packCode",
    width: 150,
    align: "center",
  },
  {
    dataIndex: "packQty",
    slots: { title: "PQTitle" },
    width: 100,
    align: "center",
    scopedSlots: { customRender: "packQty" },
  },
  {
    title: "包装价格(元)",
    dataIndex: "packUnitPrice",
    width: 110,
    align: "center",
    scopedSlots: { customRender: "packUnitPrice" },
  },
];
const costColumns = [
  {
    title: "费用类型",
    dataIndex: "feeType",
    width: 120,
    scopedSlots: { customRender: "feeType" },
  },
  { title: "费用项", dataIndex: "feeName", width: 120 },
  {
    slots: { title: "receivingSubjectId" },
    dataIndex: "receivingSubjectId",
    width: 340,
    scopedSlots: { customRender: "receivingSubjectId" },
  },
  {
    slots: { title: "feeAmount" },
    dataIndex: "feeAmount",
    width: 180,
    scopedSlots: { customRender: "feeAmount" },
  },
  {
    slots: { title: "invoiceBusinessTypeTit" },
    dataIndex: "invoiceBusinessType",
    width: 280,
    align: "center",
    scopedSlots: { customRender: "invoiceBusinessType" },
  },
  {
    slots: { title: "rateTitle" },
    dataIndex: "rate",
    width: 150,
    align: "center",
    scopedSlots: { customRender: "rate" },
  },
  {
    title: "不含税金额",
    dataIndex: "priceExcludingTax",
    width: 180,
    align: "center",
    scopedSlots: { customRender: "priceExcludingTax" },
  },
  {
    title: "币种",
    dataIndex: "currency",
    align: "center",
    width: 160,
    scopedSlots: { customRender: "currency" },
  },
  {
    title: "汇率",
    dataIndex: "exchangeRate",
    align: "center",
    width: 160,
    scopedSlots: { customRender: "exchangeRate" },
  },
  {
    title: "外币金额",
    dataIndex: "foreignCurrencyAmount",
    width: 180,
    align: "center",
    scopedSlots: { customRender: "foreignCurrencyAmount" },
  },
  {
    title: "人民币金额",
    dataIndex: "currencyAmount",
    width: 180,
    align: "center",
    scopedSlots: { customRender: "currencyAmount" },
  },
  {
    title: "清关单号",
    dataIndex: "customsClearanceFeeNumber",
    width: 280,
    scopedSlots: { customRender: "customsClearanceFeeNumber" },
  },
  {
    title: "备注",
    dataIndex: "remark",
    width: 280,
    scopedSlots: { customRender: "remark" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 120,
    align: "center",
    scopedSlots: { customRender: "operation" },
    fixed:'right'
  },
];
import { mixin } from "../../utils/mixins";
export default {
  mixins: [mixin],
  components: {
    ImageEdit,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    return {
      contractOption: [],
      invoiceOption:[
        {value:1,text:'增值税普通发票'},
        {value:2,text:'增值税专用发票'},
        {value:3,text:'增值税普通发票(免税)'}
      ],
      reconciliaState: false,
      option: {
        customer: [],
        store: []
      },
      rateOption: ["0", "1", "3", "6", "9","11", "13"],
      currencyOption: ["人民币", "美元", "欧元", "英镑", "澳元"],
      uploadUrls: [],
      btnLoading: false,
      orderType: "",
      separdinedBillVisible: false,
      //包装------
      packageVisible: false,
      packageColumns,
      flag: undefined,
      feeBox: [],
      costColumns,
      costTableData: [],
      supplierOption: [],
      receiveMsgOption: [],
      receiveMsgMaterial: [],
      packageData: [],
      packageListValueData: [],
      valueSelectPackage: [],
      packageListData: [],
      //-------------
      //计价单位数据
      dictionaryData: [],
      columns: [],
      columnsAll,
      tableDetail: [],
      tableLoading: false,
      fileUrlList: [],
      fileList: [],
      imgData: {
        type: "item",
        tableName: "signed",
        mode: "batch",
      },
      visible: false,
      orderInfo: {
        deliveryDate: "",
        opName: "",
        customerName: "",
        storeName: "",
        sno: "",
        payType: undefined,
        remark: "",
        contractId: undefined,
        contractTitle: undefined
      },
      receiveForm: {
        soId: "",
        deliveryDriver: "",
        deliveryPhone: "",
        signPerson: "",
        // customerSno: "",
      },
      billData: {},
      bills: [],
      previewImage: undefined,
      previewVisible: false,
      previewImageList: [],
      pageTitle: "",
      pageState: 0,
      mustSelectContract: [],
      mustCheck: false,
    };
  },
  computed: {
    priceExcludingTaxx() {
      return function (record, feeAmount, rate) {
        record.priceExcludingTax =
          feeAmount && rate
            ? this.formatPrice(
                +record.feeAmount - (+record.rate / 100) * +record.feeAmount /((100 + +record.rate)/ 100),
                2
              )
            : record.priceExcludingTax||'';
        return +record.feeAmount - +record.rate * +record.feeAmount;
      };
    },
    currencyAmountx() {
      return function (record, foreignCurrencyAmount, exchangeRate) {
        record.currencyAmount =
          (+foreignCurrencyAmount || 0) && (+exchangeRate || 0)
            ? this.formatPrice(
                (+record.foreignCurrencyAmount).toFixed(2) *
                  (+record.exchangeRate).toFixed(2),
                2
              )
            : undefined;
        return +record.foreignCurrencyAmount * +record.exchangeRate;
      };
    },
    selectAutoWidth: function () {
      return this.feeBox.length > 3
        ? 10 * (this.feeBox.length - 1) < 93
          ? 10 * (this.feeBox.length - 1)
          : 92
        : 38;
    },
    sumPrice() {
      return this.formatPrice(
        this.tableDetail.reduce((t, c) => +t + (+c.signItemAmount || 0) || 0, 0)
      );
    },
    sumQty() {
      let num = 0;
      this.tableDetail.forEach((item) => {
        num = num + (item.signQty ? Number(item.signQty) : 0);
      });
      return this.formatPrice(num);
    },
    btnState(){
      let state=false
      if (this.costTableData&&this.costTableData.length>0) {
        if (this.costTableData.findIndex(item=>item.reconciliaState==510||item.reconciliaState==610)==-1) {
          state=true
        }  
      }
      return state
    },
  },
  async activated() {
    // this.costTableData = [];
    await this.mustContract()
    this.receiveMsgMaterial = [];
    let data, state;
    if (Object.keys(this.$route.query).length) {
      data = this.$route.query.record;
      state = this.$route.query.state || 0;
    }
    this.pageState = state;
    switch (state) {
      case 1:
        this.pageTitle = "已签收编辑";
        break;
      case 2:
        this.pageTitle = "已签收退货/转呆滞";
        break;
      case 0:
        this.pageTitle = "订单签收";
        break;

      default:
        break;
    }
    //处理表头
    let signing = [],
      singed = [],
      returned = [];
    this.columnsAll.forEach((item) => {
      if (this.pageState === 0) {
        let a = ["badQty"];
        if (a.indexOf(item.dataIndex) < 0) {
          signing.push(item);
        }
      }
      if (this.pageState === 1) {
        let a = ["badQty", "opreation"];
        if (a.indexOf(item.dataIndex) < 0) {
          singed.push(item);
        }
      }
      if (this.pageState === 2) {
        let a = ["opreation"];
        if (a.indexOf(item.dataIndex) < 0) {
          returned.push(item);
        }
      }
    });
    switch (this.pageState) {
      case 0:
        this.columns = signing;
        break;
      case 1:
        this.columns = singed;
        break;
      case 2:
        this.columns = returned;
        break;

      default:
        break;
    }
    this.uploadUrls = [];
    // this.receiveForm.soId = data.id;
    this.receiveForm = {
      soId: data.id,
      deliveryDriver: "",
      deliveryPhone: "",
      signPerson: "",
    };
    let params = new FormData();
    params.append("tableId", this.receiveForm.soId);
    params.append("tableName", "signed");
    getUploadFiles(params).then((res) => {
      if (res.data.code == 200 && res.data.data.length > 0) {
        this.uploadUrls = [];
        let filetemp = [];
        res.data.data.forEach((item) => {
          filetemp.push({ ...JSON.parse(item.filePath), id: item.id });
        });
        this.uploadUrls = filetemp;
        console.log(this.uploadUrls);
      }
    });
    this.getDetails(data.id);
    this.getDictionaryData();
    this.receiveMsg();
    this.handleSupplierSearch();
  },
  methods: {
    async mustContract() {
      await mustContract().then(res => {
        if (res.data.code == 200) {
          this.mustSelectContract = res.data.data
        }
      })
    },
    clearContract() {
      this.orderInfo.contractId = undefined
      this.orderInfo.contractTitle = undefined
      this.contract()
    },
    contract(contractTitle, id, contractMsg) {
      contract({partnerId: this.orderInfo.customerId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.contractOption = res.data.data
          if (id && this.contractOption.every(vip => vip.id != id)) {
            this.contractOption.unshift(contractMsg)
          }
        } else {
          this.contractOption.splice(0)
        }
      }).catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id === id)
      this.orderInfo.contractTitle = contractMsg.contractTitle
      this.$forceUpdate()
    },
    taxAmountComputed(record){
      // record.taxAmount = 0;
      if (record.invoiceType==3) {
        record.taxAmount=record.signItemAmount&&record.vat?(+record.signItemAmount*(+record.vat/100)).toFixed(2):record.taxAmount
      }else{
        record.taxAmount =
          record.signItemAmount && record.vat
            ? (
                ((Number(record.signItemAmount) / (1 + Number(record.vat) / 100)) *
                  Number(record.vat)) /
                100
              ).toFixed(2)
            : record.taxAmount;
      }
      this.$forceUpdate()
    },
    async getPartner() {
      const params = {
        partnerType: 20,
        partnerName: '',
        isEnable: 1
      };
      await partnerType(params).then((res) => {
        if (res.data.code == 200) {
          this.option.customer = res.data.data || [];
        }
      })
    },
    async getStore(id) {
      const params = {
        partnerType: 22,
        parentId: id || '',
        isEnable: 1
      };
      await partnerType(params).then((res) => {
        if (res.data.code == 200) {
          this.option.store = res.data.data || [];
        }
      })
    },
    handleSelectCustomer(id) {
      let customerObj = this.option.customer.find((item) => item.id == id)
      if (this.orderInfo.customerType != 2 && this.isUndef(customerObj)) {
        this.PartnerData?.unshift({id: id, partnerName: this.orderInfo.customerName, orgId: this.orderInfo.orgId})
      }
      this.mustCheck = this.orderInfo.customerType != 2 ? this.mustSelectContract.includes(customerObj?.orgId || this.orderInfo.orgId) : false
      this.orderInfo.customerName = customerObj?.partnerName
      this.orderInfo.storeName = undefined
      this.orderInfo.storeId = undefined
      this.getStore(id)
      this.clearContract()
    },
    handlecustomertypeChange(v) {
      if (v == 2) {
        this.orderInfo.storeName = undefined
        this.orderInfo.storeId = undefined
        this.orderInfo.customerId = undefined
        this.orderInfo.customerName = undefined
        this.orderInfo.payType = 1
      }
    },
    handleSelectStore(id) {
      let storeObj = this.option.store.find((item) => item.id == id)
      this.orderInfo.storeName = storeObj.partnerName
      this.$forceUpdate()
    },
    forceUpdate() {
      this.$forceUpdate()
    },
    rateChange(value){
      console.log(value);
      console.log(this.costTableData);
      this.$forceUpdate()
    },
    getCostTableData(allGet) {
      // let costTableDataId = [];
      // this.costTableData.forEach((item) => costTableDataId.push(item.id));
      allGet.forEach((item) => {
        // if (!costTableDataId.includes(item.id)) {
          this.costTableData.push({
            id: '',
            feeType: item.type,
            feeName: item.name,
            receivingSubjectId: this.supplierOption[0]?.id,
            receivingSubjectName: this.supplierOption[0]?.partnerCode,
            receivingSubjectCode: this.supplierOption[0]?.partnerName,
            feeAmount: undefined,
            remark: undefined,
            operation: undefined,
          });
        // }
      });
      this.costTableData.forEach((item, i) => (item.rowId = ++i));
      this.feeBox = [];
    },
    handleSupplierSearch() {
      // 收款主体
      partnerType({ partnerTypes: [30, 40], partnerName: "", isEnable: 1 }).then(
        (res) => res.data.code == "200" && (this.supplierOption = res.data.data)
      );
    },
    receiveMsg() {
      receiveMsg({ orderType: 1 }).then(
        (res) => res.data.code == 200 && (this.receiveMsgOption = res.data.data)
      );
    },
    receiveMsgChange(value) {
      this.feeBox = value;
    },
    addReceiveMsg() {
      this.receiveMsgMaterial = [];
      this.receiveMsgOption.forEach((item) =>
        this.feeBox.forEach(
          (val) => val == item.id && this.receiveMsgMaterial.push(item)
        )
      );
      this.getCostTableData(this.receiveMsgMaterial);
    },
    removeFee(id) {
      this.costTableData.find((item, i) => {
        if (item.id == id) {
          this.costTableData.splice(i, 1);
          return item.id == id;
        }
      });
    },
    handleChange(value, key, column, id = 0) {
      let keyId = id;
      this.costTableData.find((item, i) => item.id == id && (keyId = i));
      const newData = [...this.costTableData];
      const target = newData.filter((item) => key === item.key)[keyId];
      if (target) {
        target[column] = value;
        this.costTableData = newData;
      }
    },
    handleCaculate(value, key, column, id = 0) {
      let keyId = id;
      this.tableDetail.find((item, i) => item.id == id && (keyId = i));
      const newData = [...this.tableDetail];
      const target = newData.filter((item) => key === item.key)[keyId];
      if (target) {
        target[column] = value;
        column === "signItemAmount"
          ? (target.signPrice = this.formatPrice(
              +target.signItemAmount / +target.signQty
            ))
          : (target.signItemAmount = this.formatPrice(
              +target.signPrice * +target.signQty
            ));
        this.tableDetail = newData;
        this.taxAmountComputed(target)
      }
    },
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
      params.append("tableName", "signed");
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
            tableId: this.receiveForm.soId,
            tableName: "signed",
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
    //拆单删除
    removeTemp(record) {
      if (record.tempId) {
        console.log(record.tempId);
        let index = this.tableDetail.indexOf(record);
        if (index !== -1) {
          this.tableDetail.splice(index, 1);
          this.tableDetail.forEach((item) => {
            if (item.id == record.tempId) {
              item.signQty = Number(item.signQty) + Number(record.signQty);
            }
          });
        }
      }
    },
    //拆单模态框----------
    confirmBill() {
      console.log(this.bills);
      let qty = 0;
      this.bills.forEach((item) => {
        qty = qty + Number(item.signQty);
        item.deliveryQty = item.signQty;
        item.costQty = item.signQty;
      });
      console.log(this.billData.signQty);
      console.log(qty);
      if (qty > Number(this.billData.signQty)) {
        this.$message.error("分配总件数大于剩余可分配的件数,请重新分配");
        return;
      }

      if (qty == Number(this.billData.signQty)) {
        this.tableDetail.splice(
          this.tableDetail.findIndex((item) => item.id === this.billData.id),
          1
        );
        this.bills.forEach((v) => {
          this.tableDetail.unshift(v);
        });
      }
      if (qty < Number(this.billData.signQty)) {
        this.tableDetail.forEach((item) => {
          if (item.id == this.billData.id) {
            item.signQty = Number(item.signQty) - qty;
            item.deliveryQty = item.signQty;
            item.costQty = item.signQty;
          }
        });
        this.bills.forEach((v) => {
          this.tableDetail.unshift(v);
        });
      }
      this.separdinedBillVisible = false;
      console.log(this.tableDetail);
    },
    removeBill(item) {
      let index = this.bills.indexOf(item);
      if (index !== -1) {
        this.bills.splice(index, 1);
      }
    },
    billspread() {
      const temp = JSON.parse(JSON.stringify(this.billData));
      temp.tempId = this.billData.id;
      temp.id = "";
      temp.signQty = "";
      this.bills.push(temp);
    },
    showModalBill(data) {
      this.bills = [];
      console.log(data);
      this.billData = JSON.parse(JSON.stringify(data));
      const temp = JSON.parse(JSON.stringify(this.billData));
      temp.tempId = this.billData.id;
      temp.id = "";
      temp.signQty = "";
      this.bills.push(temp);
      this.separdinedBillVisible = true;
    },
    billCancel() {
      this.separdinedBillVisible = false;
    },
    //计价单位
    getDictionaryData() {
      dictionary({ type: "10" }).then((res) => {
        if (res.data.code == 200) {
          this.dictionaryData = res.data.data;
        }
      });
    },

    async getOption(order) {
      if (order.reconciliaState == 510 || order.reconciliaState === undefined) {
        this.reconciliaState = false
      } else {
        this.reconciliaState = true
      }
      await this.getPartner();
      await this.getStore(order.customerId);
      if (!this.isUndef(order.customerId,order.customerName) && !this.option.customer.some(x => x.id == order.customerId)) {
        this.option.customer.splice(0,0,{
          id: order.customerId,
          partnerName: order.customerName,
        })
      }
      if (!this.isUndef(order.storeId,order.storeName) && !this.option.store.some(x => x.id == order.storeId)) {
        this.option.store.splice(0,0,{
          id: order.storeId,
          partnerName: order.storeName,
        })
      }
    },
    async getDetails(id) {
      this.tableLoading = true;
      if (this.pageState === 0) {
        let res = await getSignedDetails({ id: id });
        this.tableLoading = false;
        console.log(res);
        if (res.data.code == 200) {
          let data = res.data.data;
          this.orderType = data.order.type;
          console.log(this.orderType);
          let temp = data.orderDetailList.rows;
          temp.forEach((item) => {
            item.costPrice = item.costPrice || "";
            item.signQty = item.saleQty || "";
            item.packAmount = item.packAmount || "";
            item.costWeight = item.costWeight / 1000 || "";
            item.returnQty = item.returnQty || "";
            item.signPrice = item.salePrice || "";
            item.signItemName = item.itemName || "";
            item.packQty = item.packQty || "";
            item.signItemAmount =
              item.signItemAmount ||
              item.saleAmount ||
              this.formatPrice(+item.signQty * +item.signPrice) ||
              "";
          });
          this.tableDetail = JSON.parse(JSON.stringify(temp));
          this.orderInfo = data.order;
          await this.getOption(data.order)
          this.orderInfo.payType = data.order.payType;
          this.costTableData=data.orderFeeList||[]
          this.contract(undefined,data.order.contractId,{id: data.order.contractId, contractTitle: data.order.contractTitle})
        }
      }
      if (this.pageState === 1) {
        let res = await GetEditOrder({ id: id });
        const data = res.data;
        if (data.code == 200) {
          this.tableLoading = false;
          this.tableDetail = data.data.orderDetailDtoList;
          this.orderInfo = data.data;
          await this.getOption(data.data)
          this.receiveForm.deliveryDriver = data.data.deliveryDriver;
          this.receiveForm.deliveryPhone = data.data.deliveryPhone;
          this.receiveForm.signPerson = data.data.signPerson;
          data.data.orderFeeList.find((item) => {
            if (!this.supplierOption.includes(item.receivingSubjectId)) {
              this.supplierOption.unshift({
                id: item.receivingSubjectId,
                companyName: item.receivingSubjectName,
              });
            }
          });
          this.costTableData = data.data.orderFeeList||[];
          this.contract(undefined,data.data.contractId,{id: data.data.contractId, contractTitle: data.data.contractTitle})
        }
      }
      if (this.pageState === 2) {
        let res = await GetReturnOrBadView({ id: id });
        const data = res.data;
        if (data.code == 200) {
          this.tableLoading = false;
          this.tableDetail = data.data.orderDetailDtoList;
          this.orderInfo = data.data;
          this.getOption(data.data)
          this.receiveForm.deliveryDriver = data.data.deliveryDriver;
          this.receiveForm.deliveryPhone = data.data.deliveryPhone;
          this.receiveForm.signPerson = data.data.signPerson;
          this.costTableData = data.data.orderFeeList||[];
          this.contract(undefined,data.data.contractId,{id: data.data.contractId, contractTitle: data.data.contractTitle})
        }
      }
      if (this.isUndef(this.orderInfo.customerId)) this.handleSelectCustomer(this.orderInfo.customerId)
      switch (this.orderInfo.isPurchaseServer) {
        case 1:
          this.orderInfo.isPurchaseServerText = "是";
          break;
        case 0:
          this.orderInfo.isPurchaseServerText = "否";
          break;

        default:
          break;
      }
      switch (this.orderInfo.serverType) {
        case 1:
          this.orderInfo.serverTypeText = "加工服务单";
          break;
        case 2:
          this.orderInfo.serverTypeText = "配送服务单";
          break;
        case 3:
          this.orderInfo.serverTypeText = "仓储服务单";
          break;

        default:
          break;
      }
    },

    handleBack() {
      // this.visible = false;
      if (this.pageState === 0) {
        this.$closePage(
          "/transport/signed/waitForSignedNew",
          "/transport/signed/waitForSigned"
        );
      } else {
        this.$closePage(
          "/transport/signed/waitForSignedNew",
          "/transport/signed/signedList"
        );
      }
    },
    //图片提交事件
    saveFiles() {
      if (this.fileUrlList.length > 0) {
        const paramsImg = {
          fileUrlList: this.fileUrlList,
          tableId: this.receiveForm.soId,
          tableName: "signed",
        };
        addImg(paramsImg).then((res) => {
          if (res.data.code !== "200") {
            this.$message.error(res.data.message);
            return;
          }
        });
      }
    },
    //签收/编辑/退货确认事件
    async signedConfirmMethod() {
      if (this.mustCheck && this.isUndef(this.orderInfo.contractId)) {
        this.$message.error("请选择关联合同")
        return
      }
      //! glht
      if (this.tableDetail&&this.tableDetail.length>0?this.tableDetail.some(item=> isFalse([item.invoiceBusinessType,item.invoiceType,item.signQty,item.signPrice])):false) {
        this.$message.error("商品的验收数量/价格、发票金额、税率为必填项");
        return
      }
      if (
        this.costTableData&&this.costTableData.length>0?this.costTableData.some(
         item=>isFalse([item.receivingSubjectId,item.rate,item.feeAmount,item.invoiceBusinessType,item.invoiceType])
        ):false
      ) {
        this.$message.error("请填写费用项必填项");
        return;
      }
      this.btnLoading = true;
      if (this.pageState === 0) {
        if (this.isUndef(this.orderInfo.customerName)) {
          this.$message.error("客户门店必填")
          this.btnLoading = false;
          return
        }
        let temp = this.tableDetail
          ? JSON.parse(JSON.stringify(this.tableDetail))
          : [];
        if (temp.length > 0) {
          const params = temp.map((val) => {
            val.costPrice = val.costPrice ? Number(val.costPrice) : "";
            val.packAmount = val.packAmount ? Number(val.packAmount) : "";
            val.signPrice = val.signPrice ? Number(val.signPrice) : "";
            return (val = { ...val, ...this.receiveForm });
          });
          const res = await signedConfirm({
            ...this.$route.query.record,
            orderDetailDtoList: params,
            orderFeeList: this.costTableData,
            customerId: this.orderInfo.customerId,
            customerName: this.orderInfo.customerName,
            storeId: this.orderInfo.storeId,
            storeName: this.orderInfo.storeName,
            payType: this.orderInfo.payType,
            customerType: this.orderInfo.customerType,
            contractTitle: this.orderInfo.contractTitle,
            contractId: this.orderInfo.contractId,
          });
          this.btnLoading = false;
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.saveFiles();
            this.$closePage(
              "/transport/signed/waitForSignedNew",
              "/transport/signed/waitForSigned"
            );
          } else {
            this.$message.error(res.data.message);
          }
        }
      }
      if (this.pageState === 1) {
        if (this.isUndef(this.orderInfo.customerName)) {
          this.$message.error("客户门店必填")
          this.btnLoading = false;
          return
        }
        let temp = JSON.parse(JSON.stringify(this.orderInfo));
        delete temp.orderDetailDtoList;
        temp.deliveryDriver = this.receiveForm.deliveryDriver;
        temp.deliveryPhone = this.receiveForm.deliveryPhone;
        temp.signPerson = this.receiveForm.signPerson;
        temp.orderFeeList=this.costTableData||[]
        temp.customerType = this.orderInfo.customerType;
        temp.customerId = this.orderInfo.customerId;
        temp.customerName = this.orderInfo.customerName;
        temp.storeId = this.orderInfo.storeId;
        temp.storeName = this.orderInfo.storeName;
        temp.payType = this.orderInfo.payType;
        const params = {
          ...temp,
          orderDetailDtoList: this.tableDetail,
        };
        const res = await ReSignedOrder(params);
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.saveFiles();
          this.$closePage(
            "/transport/signed/waitForSignedNew",
            "/transport/signed/signedList"
          );
        } else {
          this.$message.error(res.data.message);
        }
      }
      if (this.pageState === 2) {
        const params = [...this.tableDetail];
        const res = await ReturnOrBadOrder(params);
        this.btnLoading = false;
        if (res.data.code == 200) {
          this.$message.success(res.data.message);
          this.saveFiles();
          this.$closePage(
            "/transport/signed/waitForSignedNew",
            "/transport/signed/signedList"
          );
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    //----------------包装
    cancel() {
      this.$message.error("取消");
    },
    //包装选择
    openPackage(row) {
      this.getPackageList();
      this.ItemsObj = row;

      this.packageData = row.packageList
        ? JSON.parse(JSON.stringify(row.packageList))
        : [];
      this.packageVisible = true;
    },
    //包装删除行
    delPackageOne(row, index) {
      this.packageData.splice(index, 1);
    },
    addPackage() {
      if (this.packageListValueData.length === 0) {
        this.$message.error(`请选择一条数据进行添加！`);
        return;
      }
      let quniPackages = [];
      this.packageData.forEach((item) => {
        this.packageListValueData.forEach((val) => {
          if (item.id === val.id) {
            quniPackages.push(item.packName);
          }
        });
      });
      if (quniPackages.length > 0) {
        let itemsStr = quniPackages.join(",");
        this.$message.error(`包装${itemsStr}已经存在！`);
        return;
      }
      this.packageData = this.packageData.concat(this.packageListValueData);
      this.packageListValueData = [];
      this.valueSelectPackage = [];
      this.$refs.addPackageSelect.blur();
    },
    //包装规格选择
    chooseSelectPackage() {
      let packageListValueDataArr = [];
      this.packageListData.forEach((item) => {
        if (this.valueSelectPackage.indexOf(item.id) > -1) {
          packageListValueDataArr.push(item);
        }
      });
      this.packageListValueData = JSON.parse(
        JSON.stringify(packageListValueDataArr)
      );
    },
    handleCancelPackage() {
      this.packageVisible = false;
    },
    handleSubmitPackage() {
      let packagePrice = 0;
      let packageQty = 0;
      let packageDataArr = JSON.parse(JSON.stringify(this.packageData));
      packageDataArr.forEach((item) => {
        let uPrice = item.packQty * item.packUnitPrice;
        packagePrice = (+packagePrice || 0) + uPrice;
        packageQty = packageQty + Number(item.packQty);
      });
      let uniqArr = [];
      for (let i = 0; i < this.tableDetail.length; i++) {
        let item = this.tableDetail[i];
        if (item.id === this.ItemsObj.id) {
          packageDataArr.forEach((val) => {
            if (!val.packQty) {
              uniqArr.push(val.packName);
            }
          });
          if (uniqArr.length > 0) {
            let str = uniqArr.join(",");
            this.$message.error(`请填写${str}包装数量！`);
            return;
          }
          item.packageList = packageDataArr;
          item.packAmount = packagePrice;
          item.packQty = packageQty;
        }
      }
      this.packageVisible = false;
    },
    getPackageList() {
      const params = {};
      packList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.packageListData = data.data;
          this.packageListData.forEach((item) => {
            item.packId = item.id;
            item.packUnitPrice = item.unitPrice;
            item.packUnitWeight = item.unitWeight;
          });
        } else {
          this.$message.error(data.message);
        }
      });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-form-item {
  margin-bottom: 0;
}
.table-formva::before {
  display: inline-block;
  color: #f5222d;
  font-size: 14px;
  line-height: 1;
  content: "*";
}
.detail-table {
  /deep/.ant-input {
    text-align: center;
  }
}

.surplus {
  color: red;
}
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
.divBorder {
  margin-top: 10px;
  border: 1px solid #f0f0f0;
  .pTittle {
    margin-bottom: 0;
    padding-left: 15px;
    height: 30px;
    line-height: 30px;
    background-color: #f0f3f6;
  }
  .fontWeight {
    font-weight: 600;
  }
  .rowMarginTop {
    margin: 5px 0;
    .widthMarginTop {
      width: 90%;
    }
    .widthMargin {
      width: 97%;
    }
    .widthLeftMargin {
      width: 92%;
    }
    .widthMarginRight {
      width: 97%;
    }
    .marginLeft {
      margin-left: 20px;
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
</style>
