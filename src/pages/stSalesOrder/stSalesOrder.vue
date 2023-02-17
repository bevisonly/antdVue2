<template>
  <div class="new-page">
    <a-spin :spinning="spinning">
      <a-form-model :model="form" :rules="rules" ref="infoform">
        <div class="form-tab">
          <ul class="tab-ul flex-fs">
            <li
              :class="{ 'active-li': item.type === form.type }"
              v-for="item in orderTtpe"
              :key="item.type"
              v-show="item.type === form.type || pageState === 'add'"
            >
              <span class="cursorPin" @click="handleClickLi(item)">
                {{ item.name }}
              </span>
            </li>
          </ul>
        </div>
        <div class="form-details" v-if="screen">
          <!-- <a-form-model :model="form" :rules="rules" ref="infoform"> -->
          <div class="info">
            <p class="info-title">基本信息</p>
            <div class="info-form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="订单日期" prop="orderDate">
                    <a-date-picker
                      style="width: 100%"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      v-model="form.orderDate"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="送货日期" prop="deliveryDate">
                    <a-date-picker
                      style="width: 100%"
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      valueFormat="YYYY-MM-DD HH:mm:ss"
                      v-model="form.deliveryDate"
                    />
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="客户类型">
                    <a-select
                      style="width: 100%"
                      v-model="form.customerType"
                      @change="handlecustomertypeChange"
                    >
                      <a-select-option :value="1"> 客户列表 </a-select-option>
                      <!-- <a-select-option :value="2"> 自定义客户 </a-select-option> -->
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item
                    label="客户名称"
                    prop="customerId"
                    :rules="{
                      required: true,
                      message: '请选择客户名称',
                      trigger: 'change',
                    }"
                    v-if="form.customerType === 1"
                  >
                    <a-select
                      allowClear
                      style="width: 100%"
                      v-model="form.customerId"
                      placeholder="请选择"
                      show-search
                      :filter-option="filterOption"
                      @change="handleCustomerChange"
                    >
                      <a-select-option
                        :value="item.id"
                        v-for="item in customerData"
                        :key="item.id"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    label="客户名称"
                    prop="customerName"
                    :rules="{
                      required: true,
                      message: '请输入客户名称',
                      trigger: 'blur',
                    }"
                    show-search
                    :filter-option="filterOption"
                    v-if="form.customerType === 2"
                  >
                    <a-input
                      style="width: 100%"
                      v-model="form.customerName"
                      placeholder="请输入客户名称"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item
                    label="客户门店"
                    v-if="form.customerType === 1"
                  >
                    <a-select
                      allowClear
                      :disabled="!form.customerId"
                      style="width: 100%"
                      v-model="form.storeId"
                      placeholder="请选择"
                      @change="handleStoreChange"
                      show-search
                      :filter-option="filterOption"
                    >
                      <a-select-option
                        :value="item.id"
                        :key="item.id"
                        v-for="item in storeData"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item
                    label="客户门店"
                    v-if="form.customerType === 2"
                  >
                    <a-input
                      :disabled="!form.customerName"
                      v-model="form.storeName"
                      placeholder="请输入客户门店"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="门店类型">
                    <a-select
                      style="width: 100%"
                      v-model="form.storeType"
                      placeholder="请选择"
                    >
                      <a-select-option :value="1"> 自营 </a-select-option>
                      <a-select-option :value="2"> 联营 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="提货方式" prop="deliveryType">
                    <a-select
                      style="width: 100%"
                      v-model="form.deliveryType"
                      placeholder="请选择"
                    >
                      <a-select-option :value="1"> 自提 </a-select-option>
                      <a-select-option :value="2"> 配送 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="车牌号" prop="carPlate">
                    <a-input v-model="form.carPlate"></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type === 6">
                  <a-form-model-item label="入库仓库" prop="whId">
                    <a-select
                      style="width: 100%"
                      show-search
                      :filter-option="filterOption"
                      v-model="form.whId"
                      placeholder="请选择"
                    >
                      <a-select-option
                        :value="item.id"
                        :key="item.id"
                        v-for="item in whData"
                      >
                        {{ item.whName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col
                  class="gutter-row"
                  :span="6"
                  v-if="form.type === 5 || form.type === 6"
                >
                  <a-form-model-item label="采购账户">
                    <a-select
                      style="width: 100%"
                      v-model="form.purchaseSelected"
                      placeholder="请选择"
                      show-search
                      :filter-option="filterOption"
                      @change="purchaseSelectedChange"
                    >
                      <a-select-option
                        :value="item.id"
                        :key="item.id"
                        v-for="item in purchaseSelectedData"
                      >
                        {{ item.partnerName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="备注">
                    <a-textarea
                      :rows="1"
                      v-model="form.remark"
                      placeholder=""
                    ></a-textarea>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type===3">
                  <a-form-model-item label="是否采购服务" prop="isPurchaseServer">
                    <a-select
                      style="width: 100%"
                      v-model="form.isPurchaseServer"
                      placeholder="选择是否采购服务"
                    >
                      <a-select-option :value="1"> 是 </a-select-option>
                      <a-select-option :value="0"> 否 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type===3">
                  <a-form-model-item label="服务单类型" prop="serverType">
                    <a-select
                      style="width: 100%"
                      v-model="form.serverType"
                      placeholder="选择服务单类型"
                    >
                      <a-select-option :value="1"> 加工服务单 </a-select-option>
                      <a-select-option :value="2"> 配送服务单 </a-select-option>
                      <a-select-option :value="3"> 仓储服务单 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="12">
                  <a-form-model-item :class="{required: mustCheck}" label="关联合同">
                    <a-select
                      style="width: 100%;"
                      show-search
                      v-model="form.contractId"
                      placeholder="请先选择客户"
                      :default-active-first-option="false"
                      :filter-option="false"
                      :not-found-content="null"
                      :disabled="!form.customerId"
                      @search="contract"
                      @select="contractSelect"
                      @focus="contract"
                    >
                      <a-select-option v-for="item in contractOption" :key="item.id">{{item.contractTitle}}&{{item.contractNumber}}</a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type === 6">
                  <a-form-model-item label="销售单据">
                    <div class="flex-fs uploadbox">
                      <div
                        v-if="form.saleInvoiceUrls.length > 0"
                        class="flex-fs imgWrap"
                      >
                        <div
                          class="uploadImgs"
                          v-for="(item, index) in form.saleInvoiceUrls"
                          :key="index"
                        >
                          <span class="imgDelete" @click="deleteXsImgs(index)">
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
                              <a-icon
                                v-if="item.type.includes('pdf')"
                                type="file-pdf"
                              />
                              <a-icon
                                v-else-if="item.type.includes('do')"
                                type="file-word"
                              />
                              <a-icon v-else type="file-excel" />
                            </p>
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                      <a-upload
                        accept=".pdf,.docx,.dox,.xlsx,.xls,.jpg,.png,.jpeg"
                        :before-upload="beforeXsUpload"
                        :showUploadList="false"
                      >
                        <div
                          class="uploadImgIcon flex-ct"
                          v-if="form.saleInvoiceUrls.length < 3"
                        >
                          <a-icon type="plus" />
                        </div>
                      </a-upload>
                      <a-modal
                        :visible="previewVisible"
                        :width="400"
                        :footer="null"
                        @cancel="handleCancel"
                        :zIndex="1001"
                        centered
                      >
                        <img
                          alt="example"
                          style="width: 97%"
                          :src="previewImage"
                        />
                      </a-modal>
                    </div>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6" v-if="form.type === 6">
                  <a-form-model-item label="采购单据">
                    <div class="flex-fs uploadbox">
                      <div
                        v-if="form.purchaseInvoiceUrls.length > 0"
                        class="flex-fs"
                      >
                        <div
                          class="uploadImgs"
                          v-for="(item, index) in form.purchaseInvoiceUrls"
                          :key="index"
                        >
                          <span class="imgDelete" @click="deleteCgImgs(index)">
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
                              <a-icon
                                v-if="item.type.includes('pdf')"
                                type="file-pdf"
                              />
                              <a-icon
                                v-else-if="item.type.includes('do')"
                                type="file-word"
                              />
                              <a-icon v-else type="file-excel" />
                            </p>
                            {{ item.name }}
                          </div>
                        </div>
                      </div>
                      <a-upload
                        accept=".pdf,.docx,.dox,.xlsx,.xls,.jpg,.png,.jpeg"
                        :before-upload="beforeCgUpload"
                        :showUploadList="false"
                      >
                        <div
                          class="uploadImgIcon flex-ct"
                          v-if="form.purchaseInvoiceUrls.length < 3"
                        >
                          <a-icon type="plus" />
                        </div>
                      </a-upload>
                    </div>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <div class="info">
            <p class="info-title">收货信息</p>
            <div class="info-form">
              <a-row :gutter="16">
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="收货电话">
                    <a-input
                      v-model="form.receiptPhone"
                      placeholder="请输入收货电话"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="收货地区">
                    <a-input
                      v-model="form.receiptRegion"
                      placeholder="请输入收货地区"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="收货地址">
                    <a-input
                      v-model="form.receiptAddress"
                      placeholder="请输入收货地址"
                    ></a-input>
                  </a-form-model-item>
                </a-col>
                <a-col class="gutter-row" :span="6">
                  <a-form-model-item label="收款方式" prop="payType">
                    <a-select
                      style="width: 100%"
                      v-model="form.payType"
                      placeholder="请选择"
                      :disabled="form.customerType == 2"
                    >
                      <a-select-option :value="1"> 现结 </a-select-option>
                      <a-select-option :value="2"> 周期结算 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </div>
          </div>
          <!-- </a-form-model> -->
        </div>
      </a-form-model>
      <a-form-model
        :model="dataForm"
        ref="dataForm"
        :validateOnRuleChange="true"
      >
        <div class="table">
          <p class="table-title flex-sb">
            <span :title="form.type">商品信息</span>
            <span>
              <a-space>
                <a-button
                  :disabled="!form.customerId && form.customerType === 1"
                  type="primary"
                  @click="openPrudoct"
                  v-if="
                    form.type === 1 ||
                    form.type === 3 ||
                    form.type === 5 ||
                    form.type === 6
                  "
                  >商品列表</a-button
                >
                <a-button
                  :disabled="!form.customerId && form.customerType === 1"
                  type="primary"
                  @click="openKucunPrudoct"
                  v-if="form.type === 2 || form.type === 4 || form.type === 6"
                  >带出库存</a-button
                >
                <a-button-group class="a-button-group">
                  <checkboxList v-model="columns" width="340" />
                  <a-button class="btnStyle" type="primary" style="width: 50px;" :icon="screen ? 'fullscreen' : 'fullscreen-exit'" @click="screenBtn"></a-button>
                </a-button-group>
              </a-space>
            </span>
          </p>
          <div class="table-search">
            <a-row :gutter="16">
              <a-col :span="4" v-if="form.type === 6">
                <a-select
                  style="width: 100%"
                  v-model="productSelectState"
                  @change="handleProductChange"
                >
                  <a-select-option value="produ"> 商品列表 </a-select-option>
                  <a-select-option value="kucun"> 库存列表 </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="5">
                <a-select
                  style="width: 100%"
                  show-search
                  v-model="addItemValue"
                  placeholder="请输入商品名称/编码/关键字"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  @search="getItemsNoPage($event)"
                  @popupScroll="handlePopupScroll"
                  @select="getItemsNoPageSelect"
                  :disabled="!form.customerId && form.customerType === 1"
                  ref="sucker"
                >
                  <a-spin
                    v-if="productLoading && dataItemSource.length === 0"
                    slot="notFoundContent"
                    size="small"
                  ></a-spin>
                  <div slot="dropdownRender" slot-scope="menu">
                    <v-nodes :vnodes="menu" />
                    <div
                      style="padding: 0 8px 4px; cursor: pointer"
                      @mousedown="(e) => e.preventDefault()"
                    >
                      <a-spin
                        v-if="productLoading && dataItemSource.length > 0"
                        size="small"
                      ></a-spin>
                    </div>
                  </div>
                  <a-select-option v-for="d in dataItemSource" :key="d.id">
                    <div>
                      {{ d.itemName }}({{ d.itemCode }})
                      <span v-if="productSelectState === 'produ'">
                        <span v-show="!!d.specList[0]"></span
                        >{{
                          d.specList.length === 1
                            ? "(" + d.specList[0].specName + ")"
                            : ""
                        }}<span v-show="!!d.specList[0]"></span>
                      </span>
                      <span v-else-if="productSelectState == 'kucun'">
                        <span v-show="d.itemSpec">(</span
                        >{{ d.itemSpec ? d.itemSpec : ""
                        }}<span v-show="d.itemSpec">)</span>
                        <span v-show="d.whName">{{ d.whName }}</span>
                      </span>
                    </div>
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="3">
                <!-- :disabled="!addItemValue" -->
                <a-input-number
                  v-model="addItemObj.saleQty"
                  placeholder="请输入数量(精确度为2位小数)"
                  :precision="2"
                  :parser="checkNumber"
                ></a-input-number>
              </a-col>
              <a-col :span="3" v-if="productSelectState === 'kucun'">
                <span>可用数量：{{ addItemObjBalance }}</span>
              </a-col>
              <a-col :span="2">
                <a-button
                  type="primary"
                  @click="addItem"
                  :disabled="!addItemValue || !addItemObj.saleQty"
                  >添加</a-button
                >
              </a-col>
              <a-col :span="6" v-if="productSelectState === 'kucun'">
                <a-space>
                  <a-checkbox :checked="saleChecked" @change="onCheckedChange">
                    市场销售
                  </a-checkbox>
                  <a-input-number
                    style="width: 100%"
                    :disabled="!saleChecked"
                    v-model="form.allMarketCost"
                    v-number
                    @change="handleAllMarketCostChange"
                    placeholder="市场总费用"
                  ></a-input-number>
                </a-space>
              </a-col>
              <a-col :span="5">
                <a-popconfirm
                  title="确定要删除全部删除吗"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="clearTable"
                >
                  <a-button type="primary">一键清除商品列表</a-button>
                </a-popconfirm>
              </a-col>
            </a-row>
          </div>
          <div class="table-data">
            <a-table
              :rowKey="(record) => record.sortId"
              :pagination="paginationTable"
              :columns="columns"
              :data-source="dataForm.data"
              :scroll="{ y: 800, x: 300 }"
              @change="handleTableDataChange"
            >
              <span slot="del" slot-scope="text, record">
                <a-popconfirm
                  title="确定要删除这条数据吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="delOne(record, record.keyIndex)"
                  @cancel="cancel"
                >
                  <a-button type="link"> 删除 </a-button>
                </a-popconfirm>
              </span>
              <!-- 供应商名称 -->
              <span slot="supplierId" slot-scope="text, record">
                <a-form-model-item>
                  <a-select style="width: 100%" v-model="record.supplierId" show-search :filter-option="filterOption">
                    <a-select-option
                      :value="item.id"
                      :key="item.id"
                      v-for="item in supplierData"
                    >
                      {{ item.partnerName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <!-- 商品名称 -->
              <span slot="itemName" slot-scope="text, record">
                {{ record.itemName }}
              </span>
              <!-- s商品编码 -->
              <span slot="itemCode" slot-scope="text, record">
                {{ record.itemCode }}
              </span>
              <!-- 规格 -->
              <span slot="specs" slot-scope="text, record">
                <a-form-model-item>
                  <a-input v-if="record.balance" v-model="record.specs" readOnly>
                  </a-input>
                  <a-select
                    v-else
                    style="width: 100%"
                    v-model="record.specs"
                    show-search
                    :filter-option="filterOption"
                    allowClear
                    @change="specsChange"
                  >
                    <a-select-option
                      v-for="item in record.specList"
                      :key="item.id"
                      :value="item.specName"
                      >{{ item.specName }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <!-- 数量 -->
              <span slot="saleQtyTitle" class="table-formva"> 数量</span>
              <span slot="saleQty" slot-scope="text, record, index">
                <a-form-model-item>
                  <a-input-number
                    placeholder="必填(精确度为2位小数)"
                    v-numtrim
                    @change="handleInputSaleQtyChange(record, index)"
                    v-model="record.saleQty"
                    :precision="2"
                    :formatter="checkNumber"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 计价单位 -->
              <span slot="priceUnitTitle" class="table-formva"> 计价单位</span>
              <span slot="deliveryCountTitle" :class="form.type == 2 ? 'table-formva' : ''"> 出库数量/单位</span>
              <span slot="priceUnit" slot-scope="text, record">
                <a-form-model-item>
                  <a-select
                    style="width: 100%"
                    show-search
                    :filter-option="filterOption"
                    @change="unitChange($event, record)"
                    v-model="record.priceUnit"
                  >
                    <a-select-option
                      v-for="item in dictionaryData"
                      :key="item.id"
                      :value="item.dicText"
                      >{{ item.dicText }}
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <!-- 销售单价 -->
              <span slot="saleTitle" class="table-formva"> 销售单价</span>
              <span slot="salePrice" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    :disabled="record.containerCode && form.isMarketSale === 0"
                    placeholder="必填"
                    @change="handleInputChange(record)"
                    v-model="record.salePrice"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 采购单价 -->
              <span slot="purchaseUnitPriceTitle" class="table-formva">
                采购单价</span
              >
              <span slot="purchaseUnitPrice" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    @change="handlePurchaseChange(record)"
                    v-model="record.purchaseUnitPrice"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 供应价 -->
              <span slot="supplyPrice" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number v-numtrim v-model="record.supplyPrice"></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 辅助单位 -->
              <span slot="unit" slot-scope="text, record">
                <a-form-model-item>
                  <a-input v-model="record.unit"></a-input>
                </a-form-model-item>
              </span>
              <!-- 出库单位 -->
              <!-- <span slot="deliveryUnit" slot-scope="text, record">
              <a-input disabled v-model="record.deliveryUnit"></a-input>
            </span> -->
              <!-- 出库数量 -->
              <div slot="deliveryCount" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    style="width: 70px"
                    placeholder="精确度为2位小数"
                    v-model="record.deliveryCount"
                    @change="handleDeliveryCount(record)"
                    :disabled="!record.invId"
                    :precision="2"
                    :formatter="checkNumber"
                  ></a-input-number>
                  <span>{{ record.deliveryUnit }}</span>
                </a-form-model-item>
              </div>
              <!-- 销售金额 -->
              <span slot="saleAmount" slot-scope="text, record, index">
                <a-form-model-item>
                  <a-input-number
                    v-model="record.saleAmount"
                    v-numtrim
                    @change="saleAmountChange(record, index)"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 损耗后销售金额 -->
              <span slot="lossEndAmount" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    v-model="record.lossEndAmount"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 扣款 -->
              <span slot="deductions" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    :disabled="!saleChecked"
                    v-model="record.deductions"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 采购数量 -->
              <span slot="purchaseQtyTitle" class="table-formva">
                采购数量</span
              >
              <span slot="purchaseQty" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    placeholder="必填"
                    @change="handlePurchaseChange(record)"
                    v-model="record.purchaseQty"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 采购金额 -->
              <span slot="purchaseAmount" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    disabled
                    v-model="record.purchaseAmount"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 供应商结算金额 -->
              <span slot="settlementAmount" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    v-model="record.settlementAmount"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 成本价格 -->
              <span slot="costPrice" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    disabled
                    v-model="record.costPrice"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 成本数量 -->
              <span slot="costQty" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    v-numtrim
                    disabled
                    v-model="record.costQty"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 销售额 -->
              <span slot="marketSalePrice" slot-scope="text, record, index">
                <a-form-model-item>
                  <!-- :disabled="!saleChecked" -->
                  <a-input-number
                    v-numtrim
                    v-model="record.marketSalePrice"
                    @change="handleInputMarketSalePrice(record, 'ms', index)"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 市场费用 -->
              <span slot="marketCost" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    disabled
                    v-numtrim
                    v-model="record.marketCost"
                  ></a-input-number>
                </a-form-model-item>
              </span>
              <!-- 销售费用 -->
              <span slot="costSales" slot-scope="text, record, index">
                <a-form-model-item>
                  <a-input-number
                    :disabled="!saleChecked"
                    v-numtrim
                    v-model="record.costSales"
                    @change="handleInputMarketSalePrice(record, 'cs', index)"
                  ></a-input-number>
                  <!-- @change="costSalesChange" -->
                </a-form-model-item>
              </span>
              <!-- 柜号 -->
              <span slot="containerCode" slot-scope="text, record">
                <a-form-model-item>
                  <a-input disabled v-model="record.containerCode"></a-input>
                </a-form-model-item>
              </span>
              <!-- 币种 -->
              <span slot="currency" slot-scope="text, record">
                <a-form-model-item>
                  <a-input disabled v-model="record.currency"></a-input>
                </a-form-model-item>
              </span>
              <!--
            包装总费用
           -->
              <span slot="packingCost" slot-scope="text, record">
                <a-form-model-item>
                  <a-input-number
                    disabled
                    v-numtrim
                    v-model="record.packingCost"
                  ></a-input-number>
                </a-form-model-item>
              </span>
            <span slot="invoiceBusinessTypeTit" class="table-formva">发票类型</span>
            <span slot="invoiceBusinessType" slot-scope="text, record">
              <a-select
                v-model="record.invoiceBusinessType"
                @click.stop.native
                placeholder=""
                style="width: 40%">
                <a-select-option :value='0'>应税业务</a-select-option>
                <a-select-option :value='1'>免税业务</a-select-option>
              </a-select>
              <a-select
                v-model="record.invoiceType"
                @click.stop.native
                placeholder=""
                style="width: 60%">
                <a-select-option v-for="(item,index) in invoiceOption" :key="index" :value='item.value' :title='item.text'>
                  {{item.text}}
                </a-select-option>
              </a-select>
              </span>
              <!-- 增值税 -->
              <span slot="vatTitle" class="table-formva"> 税率/抵扣率(%)</span>
              <span slot="vat" slot-scope="text, record">
                <!-- <a-space>
                <a-input v-model="record.vat" placeholder="整数0-100"></a-input
                ><span>%</span>
              </a-space> -->
                <a-form-model-item>
                  <span style="width: 40%">
                   <span v-if="record.invoiceType==3">抵扣率</span>
                   <span v-if='record.invoiceType==1||record.invoiceType==2'>税率</span>
                  </span>
                  <a-select
                    v-model="record.vat"
                    style="width: 50%;margin-left:2px"
                    @click.stop.native
                    @change="toRefreshSelect"
                  >
                    <a-select-option :value="0"> 0 </a-select-option>
                    <a-select-option :value="1"> 1</a-select-option>
                    <a-select-option :value="3"> 3 </a-select-option>
                    <a-select-option :value="6"> 6 </a-select-option>
                    <a-select-option :value="9"> 9 </a-select-option>
                    <a-select-option :value="11"> 11 </a-select-option>
                    <a-select-option :value="13"> 13 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </span>
              <span slot="remark" slot-scope="text, record">
                <a-form-model-item>
                  <a-input v-model="record.remark"></a-input>
                </a-form-model-item>
              </span>
              <span slot="Packaging" slot-scope="text, record">
                <a-form-model-item>
                  <a-button type="link" @click="openPackage(record)">
                    包装选择
                  </a-button>
                </a-form-model-item>
              </span>
            </a-table>

            <p class="table-total">
              <!-- <span>已录入商品条数 : {{ itemsTotalNum }} ,</span> -->
              <span>
                总数量：{{ formatPrice(totalSaleAty) }}，订单总金额：{{
                  formatPrice(totalOrderPrice)
                }}</span
              >
              <span v-if="form.type === 6">
                ，采购总数量：{{ totalPurchaseQty.toFixed(2) }}，采购总金额：{{
                  formatPrice(totalPurchasePrice)
                }}
              </span>
            </p>
          </div>
        </div>
      </a-form-model>
      <FeeModel :feeFather='orderFeeList' @updateFee='updateFee' ref="feemodel" :orderType="1"/>
      <div class="btn">
        <a-space>
          <a-button type="primary" @click="submit" :loading="submitLoading"
            >确定</a-button
          >
          <a-button
            type="primary"
            @click="submit('draft')"
            :loading="submitDraftLoading"
            >暂存草稿</a-button
          >
        </a-space>
      </div>
      <st-addItems ref="stAddItems"></st-addItems>
      <st-addKucunItems ref="stAddKucunItems"></st-addKucunItems>
      <st-package ref="stPackage"></st-package>
    </a-spin>
  </div>
</template>
<script>
import stPackage from "./stPackage.vue";
import stAddItems from "./stAddItems.vue";
import stAddKucunItems from "./stAddKucunItems.vue";
import FeeModel from "../../components/feeModel/feeModel.vue";
import {
  dictionaryList,
  itemDictionaryInfoList,
  wareHouseList,
} from "../../services/purchaseSaleInventory";
import { partnerList, partnerList2 } from "../../services/reportSettlementMa";
import { mustContract } from "../../services/commonSaasApi";
import { partnerType } from "../../services/userMa";
import {
  componentGetItems,
  orderInsert,
  componentGetInventoryList,
  uploadFiledoUpload,
  overallOrderInsert,
  orderGetsingle,
  orderUpdate,
  orderInsertTodDraft,
  overallOrderUpdate,
  overallOrderInsertDraft,
  contract,
} from "../../services/sales";
import { formatDate, isFalse, debounce } from "../../utils/util";
let refresh = true
const patchArray = (function () {
  const methodsToPatch = [
    "push",
    "pop",
    "shift",
    "unshift",
    "splice",
    "reverse",
    "sort",
  ];

  //设置对象属性的工具方法
  function def(obj, key, val) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: true,
      writable: true,
      configurable: true,
    });
  }

  const arrayProto = Array.prototype, //缓存Array的原型
    arrayMethods = Object.create(arrayProto); //继承Array的原型

  // methodsToPatch.forEach(function (method, index) {
  methodsToPatch.forEach(function (method) {
    def(arrayMethods, method, function (...args) {
      //首先调用Array原型的方法
      const res = arrayProto[method].apply(this, args);
      //data中每个数组都有一个__ob__的私有属性指向创建的Observer实例（有兴趣看看源码中的observe方法，这里不详述）
      const ob = this.__ob__;

      let inserted = null;

      //记录插入的值
      switch (method) {
        case "push":
        case "unshift":
          inserted = args;
          break;
        case "splice":
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        //如果是调用了push、unshift、splice，则尝试对新插入的值进行响应式绑定，因为插入的值有可能是对象(Object)或者数组(Array)
        ob && ob.observeArray(inserted);
      }

      console.log("数组发生改变了");

      //向所有依赖发送通知，告诉它们数组的值发生变化了
      ob && ob.dep.notify();
      return res;
    });
  });

  return function (target) {
    //看看浏览器支不支持__proto__这个属性，通过改变__proto__的值，可以设置对象的原型
    if ("__proto__" in {}) {
      //将数组的原型指向arrayMethods，这样当数组调用上述的7个方法时，其实是调用arrayMethods中的方法而不是调用Array.prototype中的方法
      target.__proto__ = arrayMethods;
    } else {
      //如果浏览器不支持__proto__，则设置数组对应的属性，这样当数组调用上述的7个方法时，其实是调用数组对应属性指向的方法
      for (let i = 0, l = methodsToPatch.length; i < l; i++) {
        let key = methodsToPatch[i];
        def(target, key, arrayMethods[key]);
      }
    }
  };
})();
export default {
  name: "stSalesOrder",
  components: {
    stAddItems,
    stPackage,
    stAddKucunItems,
    FeeModel,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  data() {
    let validateNumRequired = (rule, value, callback) => {
      if (value <= 0 || !value) {
        callback(new Error("必填>0"));
      } else {
        callback();
      }
    };
    let validateNum = (rule, value, callback) => {
      if (value === "0") {
        callback(new Error("要大于0"));
      } else {
        callback();
      }
    };
    return {
      //免税二期
      contractOption: [],
      invoiceOption:[
        {value:1,text:'增值税普通发票'},
        {value:2,text:'增值税专用发票'},
        {value:3,text:'增值税普通发票(免税)'}
      ],
      //分页0127
      screen: !0,
      paginationTable: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ["10", "20", "30"],
        showTotal: (total) => {
          return "共" + total + "条";
          // return range[0] + "-" + range[1] + "共" + total + "条";
        },
        total: 0,
        showQuickJumper: true,
        showSizeChanger: true,
      },
      saleChecked: false,
      getItemsNoPageVal: "",
      submitDraftLoading: false,
      submitLoading: false,
      spinning: false,
      pageState: "add",
      productLoading: false,
      previewVisible: false,
      previewImage: undefined,
      form: {
        type: 1,
        source: 1,
        orderDate: formatDate(new Date(), "YYYY-MM-dd hh:mm:ss"),
        deliveryDate: formatDate(
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          "YYYY-MM-dd hh:mm:ss"
        ),
        customerType: 1,
        whId: undefined,
        customerName: "",
        customerId: undefined,
        storeName: "",
        storeId: undefined,
        storeType: 1,
        deliveryType: 1,
        purchaseSelected: undefined,
        payType: 2,
        receiptPhone: "",
        receiptRegion: "",
        receiptAddress: "",
        remark: "",
        saleInvoiceUrls: [],
        purchaseInvoiceUrls: [],
        allMarketCost: null,
        isMarketSale: 1,
      },
      dataForm: {
        data: [],
      },
      customerData: [],
      purchaseSelectedData: [],
      storeData: [],
      supplierData: [],
      columns: [
        {dataIndex: "del",title: "操作",width: 80,align: "center",scopedSlots: { customRender: "del" },},
        {title: "序号",dataIndex: "sortId",width: 70,align: "center",},
        // {title: "序号",dataIndex: "keyIndex",width: 70,align: "center",},
        {title: "商品名称",dataIndex: "itemName",width: 200,align: "center",scopedSlots: { customRender: "itemName" },},
        {title: "商品编码",dataIndex: "itemCode",width: 200,align: "center",scopedSlots: { customRender: "itemCode" },},
        {title: "规格",dataIndex: "specs",width: 180,align: "center",scopedSlots: { customRender: "specs" },},
        {titleTips: "数量",slots: { title: "saleQtyTitle" },dataIndex: "saleQty",width: 180,align: "center",scopedSlots: { customRender: "saleQty" },},
        {titleTips: "销售单价",slots: { title: "saleTitle" },dataIndex: "salePrice",width: 180,align: "center",scopedSlots: { customRender: "salePrice" },},
        {title: "采购单价",dataIndex: "supplyPrice",width: 180,align: "center",scopedSlots: { customRender: "supplyPrice" },},
        {titleTips: "计价单位",slots: { title: "priceUnitTitle" },dataIndex: "priceUnit",width: 100,align: "center",scopedSlots: { customRender: "priceUnit" },},
        {title: "销售额",dataIndex: "saleAmount",width: 240,align: "center",scopedSlots: { customRender: "saleAmount" },},
        {title: "辅助单位",dataIndex: "unit",width: 150,align: "center",scopedSlots: { customRender: "unit" },},
        {title: "包装",width: 120,scopedSlots: { customRender: "Packaging" },align: "center",},
        {title: "包装费用(元)",dataIndex: "packingCost",width: 180,align: "center",scopedSlots: { customRender: "packingCost" },},
        {titleTips: "发票类型",slots: { title: "invoiceBusinessTypeTit" },dataIndex: "invoiceBusinessType",width: 280,align: "center",scopedSlots: { customRender: "invoiceBusinessType" },},
        {titleTips: "增值税（%）",slots: { title: "vatTitle" },dataIndex: "vat",width: 150,align: "center",scopedSlots: { customRender: "vat" },},
        {title: "备注",dataIndex: "remark",width: 240,ellipsis: true,align: "center",scopedSlots: { customRender: "remark" },},
      ],
      columnsKuCun: [
        {dataIndex: "del",title: "操作",width: 80,align: "center",scopedSlots: { customRender: "del" },},
        {title: "序号",dataIndex: "sortId",width: 80,align: "center",},
        // {title: "序号",dataIndex: "keyIndex",width: 80,align: "center",},
        {title: "商品名称",dataIndex: "itemName",width: 200,align: "center",scopedSlots: { customRender: "itemName" },},
        {title: "商品编码",dataIndex: "itemCode",width: 180,align: "center",scopedSlots: { customRender: "itemCode" },},
        {title: "规格",dataIndex: "specs",width: 180,align: "center",scopedSlots: { customRender: "specs" },},
        {titleTips: "数量",slots: { title: "saleQtyTitle" },dataIndex: "saleQty",width: 180,align: "center",scopedSlots: { customRender: "saleQty" },},
        {titleTips: "销售单价",slots: { title: "saleTitle" },dataIndex: "salePrice",width: 180,align: "center",scopedSlots: { customRender: "salePrice" },},
        {title: "采购单价",dataIndex: "supplyPrice",width: 180,align: "center",scopedSlots: { customRender: "supplyPrice" },},
        {titleTips: "计价单位",slots: { title: "priceUnitTitle" },dataIndex: "priceUnit",width: 100,align: "center",scopedSlots: { customRender: "priceUnit" },},
        {titleTips: "出库数量/单位",slots: { title: "deliveryCountTitle" },dataIndex: "deliveryCount",width: 180,align: "center",scopedSlots: { customRender: "deliveryCount" },},
        {title: "销售额",dataIndex: "marketSalePrice",width: 240,align: "center",scopedSlots: { customRender: "marketSalePrice" },},
        {title: "市场费用",dataIndex: "marketCost",width: 160,align: "center",scopedSlots: { customRender: "marketCost" },},
        {title: "销售费用",dataIndex: "costSales",width: 160,align: "center",scopedSlots: { customRender: "costSales" },},
        {title: "扣款",dataIndex: "deductions",width: 180,align: "center",scopedSlots: { customRender: "deductions" },},
        {title: "币种",dataIndex: "currency",width: 100,align: "center",scopedSlots: { customRender: "currency" },},
        {title: "柜号",dataIndex: "containerCode",width: 160,align: "center",scopedSlots: { customRender: "containerCode" },},
        {title: "辅助单位",dataIndex: "unit",width: 150,align: "center",scopedSlots: { customRender: "unit" },},
        {title: "成本价",dataIndex: "costPrice",width: 180,align: "center",scopedSlots: { customRender: "costPrice" },},
        {title: "成本数量",dataIndex: "costQty",width: 180,align: "center",scopedSlots: { customRender: "costQty" },},
        {title: "库存规格",dataIndex: "itemSpec",width: 150,align: "center",},
        {title: "包装",width: 120,scopedSlots: { customRender: "Packaging" },align: "center",},
        {title: "包装费用(元)",dataIndex: "packingCost",width: 180,align: "center",scopedSlots: { customRender: "packingCost" },},
        {titleTips: "发票类型",slots: { title: "invoiceBusinessTypeTit" },dataIndex: "invoiceBusinessType",width: 280,align: "center",scopedSlots: { customRender: "invoiceBusinessType" },},
        {titleTips: "税率/抵扣率",slots: { title: "vatTitle" },dataIndex: "vat",width: 150,align: "center",scopedSlots: { customRender: "vat" },},
        {title: "备注",dataIndex: "remark",width: 240,ellipsis: true,align: "center",scopedSlots: { customRender: "remark" },},
      ],
      columnsNor: [
        {dataIndex: "del",title: "操作",width: 80,align: "center",scopedSlots: { customRender: "del" },},
        {title: "序号",dataIndex: "sortId",width: 80,align: "center",},
        // {title: "序号",dataIndex: "keyIndex",width: 80,align: "center",},
        {title: "商品名称",dataIndex: "itemName",width: 200,align: "center",scopedSlots: { customRender: "itemName" },},
        {title: "商品编码",dataIndex: "itemCode",width: 180,align: "center",scopedSlots: { customRender: "itemCode" },},
        {title: "规格",dataIndex: "specs",width: 180,align: "center",scopedSlots: { customRender: "specs" },},
        {titleTips: "数量",slots: { title: "saleQtyTitle" },dataIndex: "saleQty",width: 180,align: "center",scopedSlots: { customRender: "saleQty" },},
        {titleTips: "销售单价",slots: { title: "saleTitle" },dataIndex: "salePrice",width: 180,align: "center",scopedSlots: { customRender: "salePrice" },},
        {title: "采购单价",dataIndex: "supplyPrice",width: 180,align: "center",scopedSlots: { customRender: "supplyPrice" },},
        {titleTips: "计价单位",slots: { title: "priceUnitTitle" },dataIndex: "priceUnit",width: 100,align: "center",scopedSlots: { customRender: "priceUnit" },},
        {title: "销售额",dataIndex: "saleAmount",width: 240,align: "center",scopedSlots: { customRender: "saleAmount" },},
        {title: "辅助单位",dataIndex: "unit",width: 150,align: "center",scopedSlots: { customRender: "unit" },},
        {title: "包装",width: 120,scopedSlots: { customRender: "Packaging" },align: "center",},
        {title: "包装费用(元)",dataIndex: "packingCost",width: 180,align: "center",scopedSlots: { customRender: "packingCost" },},
        {titleTips: "发票类型",slots: { title: "invoiceBusinessTypeTit" },dataIndex: "invoiceBusinessType",width: 280,align: "center",scopedSlots: { customRender: "invoiceBusinessType" },},
        {titleTips: "税率/抵扣率",slots: { title: "vatTitle" },dataIndex: "vat",width: 150,align: "center",scopedSlots: { customRender: "vat" },},
        {title: "备注",dataIndex: "remark",width: 240,ellipsis: true,align: "center",scopedSlots: { customRender: "remark" },},
      ],
      columnsCaixiao: [
        {dataIndex: "del",title: "操作",width: 80,align: "center",scopedSlots: { customRender: "del" },},
        {title: "序号",dataIndex: "sortId",width: 80,align: "center",},
        // {title: "序号",dataIndex: "keyIndex",width: 80,align: "center",},
        {title: "供应商名称",dataIndex: "supplierId",width: 240,align: "center",scopedSlots: { customRender: "supplierId" },},
        {title: "商品名称",dataIndex: "itemName",width: 200,align: "center",scopedSlots: { customRender: "itemName" },},
        {title: "商品编码",dataIndex: "itemCode",width: 140,align: "center",scopedSlots: { customRender: "itemCode" },},
        {title: "规格",dataIndex: "specs",width: 150,align: "center",scopedSlots: { customRender: "specs" },},
        {titleTips: "数量",slots: { title: "saleQtyTitle" },dataIndex: "saleQty",width: 180,align: "center",scopedSlots: { customRender: "saleQty" },},
        // {title: "销售单价",dataIndex: "salePrice",width: 150,align: "center",scopedSlots: { customRender: "salePrice" },},
        {titleTips: "销售单价",slots: { title: "saleTitle" },dataIndex: "salePrice",width: 180,align: "center",scopedSlots: { customRender: "salePrice" },},
        {titleTips: "采购数量",slots: { title: "purchaseQtyTitle" },dataIndex: "purchaseQty",width: 180,align: "center",scopedSlots: { customRender: "purchaseQty" },},
        {titleTips: "采购单价",slots: { title: "purchaseUnitPriceTitle" },dataIndex: "purchaseUnitPrice",width: 180,align: "center",scopedSlots: { customRender: "purchaseUnitPrice" },},
        {title: "采购金额",dataIndex: "purchaseAmount",width: 180,align: "center",scopedSlots: { customRender: "purchaseAmount" },},
        {titleTips: "计价单位",slots: { title: "priceUnitTitle" },dataIndex: "priceUnit",width: 150,align: "center",scopedSlots: { customRender: "priceUnit" },},
        {title: "出库数量/单位",dataIndex: "deliveryCount",width: 150,align: "center",scopedSlots: { customRender: "deliveryCount" },},
        {title: "销售额",dataIndex: "marketSalePrice",width: 240,align: "center",scopedSlots: { customRender: "marketSalePrice" },},
        {title: "市场费用",dataIndex: "marketCost",width: 180,align: "center",scopedSlots: { customRender: "marketCost" },},
        {title: "销售费用",dataIndex: "costSales",width: 180,align: "center",scopedSlots: { customRender: "costSales" },},
        {title: "扣款",dataIndex: "deductions",width: 180,align: "center",scopedSlots: { customRender: "deductions" },},
        {title: "币种",dataIndex: "currency",width: 100,align: "center",scopedSlots: { customRender: "currency" },},
        {title: "柜号",dataIndex: "containerCode",width: 180,align: "center",scopedSlots: { customRender: "containerCode" },},
        {title: "辅助单位",dataIndex: "unit",width: 150,align: "center",scopedSlots: { customRender: "unit" },},
        {title: "销售金额",dataIndex: "saleAmount",width: 240,align: "center",scopedSlots: { customRender: "saleAmount" },},
        {title: "损耗后销售金额",dataIndex: "lossEndAmount",width: 180,align: "center",scopedSlots: { customRender: "lossEndAmount" },},
        {title: "供应商结算金额",dataIndex: "settlementAmount",width: 180,align: "center",scopedSlots: { customRender: "settlementAmount" },},
        {title: "成本价格",dataIndex: "costPrice",width: 180,align: "center",scopedSlots: { customRender: "costPrice" },},
        {title: "库存规格",dataIndex: "itemSpec",width: 150,align: "center",},
        {title: "包装",width: 120,scopedSlots: { customRender: "Packaging" },align: "center",},
        {title: "包装费用(元)",dataIndex: "packingCost",width: 180,align: "center",scopedSlots: { customRender: "packingCost" },},
        {titleTips: "发票类型",slots: { title: "invoiceBusinessTypeTit" },dataIndex: "invoiceBusinessType",width: 280,align: "center",scopedSlots: { customRender: "invoiceBusinessType" },},
        {titleTips: "税率/抵扣率",slots: { title: "vatTitle" },dataIndex: "vat",width: 150,align: "center",scopedSlots: { customRender: "vat" },},
        {title: "备注",dataIndex: "remark",width: 240,ellipsis: true,align: "center",scopedSlots: { customRender: "remark" },},
      ],
      dictionaryData: [],
      orderTtpe: [
        {name: "销售单",type: 1},
        {name: "库存单",type: 2},
        {name: "服务单",type: 3},
        {name: "换货单",type: 4},
        {name: "直送单",type: 5},
        {name: "销采一体单",type: 6}
      ],
      PartnerData: [],
      whData: [],
      rules: {
        orderDate: [{required: true,message: "请选择订单日期",trigger: "change",},],
        deliveryDate: [{required: true,message: "请选择送货日期",trigger: "change",},],
        customerName: [{required: true,message: "请输入客户名称",trigger: "blur",},],
        customerId: [{required: true,message: "请选择客户",trigger: "change",},],
        whId: [{required: true,message: "请选择入库仓库",trigger: "change",},],
        payType: [{required: true,message: "请选择收款方式",trigger: "change",},],
        deliveryType: [{required: true,message: "请选择提货方式",trigger: "change",},],
       isPurchaseServer: [
         { required: true, message: "请选择是否采购服务", trigger: "change" },
       ],
        vat: [{required: true,message: "请选择增值税",trigger: "change",},],
        saleQty: [{ validator: validateNumRequired, trigger: ["change"] }],
        salePrice: [{ validator: validateNumRequired, trigger: ["change"] }],
        purchaseUnitPrice: [{ validator: validateNumRequired, trigger: ["change"] },],
        supplyPrice: [{ validator: validateNum, trigger: ["change"] }],
        deliveryCount: [{ validator: validateNum, trigger: ["change"] }],
        saleAmount: [{ validator: validateNum, trigger: ["change"] }],
        lossEndAmount: [{ validator: validateNum, trigger: ["change"] }],
        marketSalePrice: [{ validator: validateNum, trigger: ["change"] }],
        marketCost: [{ validator: validateNum, trigger: ["change"] }],
        costSales: [{ validator: validateNum, trigger: ["change"] }],
        deductions: [{ validator: validateNum, trigger: ["change"] }],
        purchaseQty: [{ validator: validateNumRequired, trigger: ["change"] }],
        settlementAmount: [{ validator: validateNum, trigger: ["change"] }],
        priceUnit: [{required: true,message: "必填",trigger: ["change"],},],
      },

      dataItemSource: [],
      addItemValue: undefined,
      addItemObj: {
        saleQty: "",
        balance: 0,
        measureNetBalance: "",
      },
      addItemObjBalance: 0,
      productSelectState: "produ",
      ItemsObj: {},
      totalSaleAty: 0, //总数量
      totalOrderPrice: 0, //订单总金额
      totalPurchaseQty: 0, //采购总数量,
      totalPurchasePrice: 0, //采购总金额
      orderId: "",
      itemsPagination: {
        totalPage: 0,
        pageSize: 10,
        total: 0,
        pageIndex: 1,
        direction: "",
        sortName: "",
      },
      //费用项
      orderFeeList:[],
      mustSelectContract: [],
      mustCheck: false,
    };
  },
  watch: {
    dataForm: {
      handler(val, oldval) {
        console.log(oldval);
        if (val.data && val.data.length > 0) {
          this.paginationTable.total = val.data.length;
          val.data.forEach((item, index) => {
            item.keyIndex = index + 1;
          });
        }
      },
      deep: true,
    },
  },
  computed: {
    itemsTotalNum() {
      let num = 0;
      if (this.dataForm.data && this.dataForm.data.length > 0) {
        num = this.dataForm.data.length;
      }
      return num;
    },
  },
  directives: {
    numtrim: {
      inserted: function(el) {
        el.oninput = () => el.value = el.value?.replace(/[^0-9-.]|(?<=\.{1}[0-9]{8}).*/,'')
        el.onpaste = () => el.value = el.value?.replace(/[^0-9-.]|(?<=\.{1}[0-9]{8}).*/,'')
      }
    },
  },
  async activated() {
    await this.mustContract();
    this.$nextTick(() => {
      this.getDictionaryData();
      this.getCustumers2(20, "");
      this.getCustumers2(30, "");
      this.getPartnerData();
      // this.getItemsNoPage("");
      this.getWhData();
      if (this.$route.query.orderId) {
        this.mustCheck = false;
        this.orderId = this.$route.query.orderId;
        this.handleClickLi({ type: parseInt(this.$route.query.orderType) });
        this.getSingle(this.$route.query.orderId);
        this.pageState = this.$route.query.type;
      } else {
        // this.handleClickLi({
        //   type: 1,
        // });
        // this.pageState = "add";
      }
    });
  },
  deactivated() {
    if (this.pageState !== "add") {
      this.handleClickLi({
        type: 1,
      });
      this.pageState = "add";
    }
  },
  methods: {
    checkNumber(v) {
      let num = v + ''
      let decimal = !Number.isInteger(+v || 0) && num.substr(1+num.indexOf(".")).length > 2
      let roundNum = num.substr(0,3+num.indexOf("."))
      if (refresh && decimal) {
        refresh = false
        setTimeout(() => refresh = true, 100)
        this.$message.warn('最多可输入两位小数')
      }
      return decimal && roundNum || v
    },
    clearContract() {
      this.form.contractId = undefined
      this.form.contractTitle = undefined
      this.contract()
    },
    contract(contractTitle, id, alrealy) {
      if (this.isUndef(this.form.customerId)) return
      contract({partnerId: this.form.customerId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.contractOption = res.data.data
          if(id && this.contractOption.every(vip => vip.id != id)) {
            this.contractOption.unshift(alrealy)
          }
        } else {
          this.contractOption.splice(0)
        }
      }).catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id === id)
      this.form.contractTitle = contractMsg.contractTitle
      this.$forceUpdate()
    },
    //费用
    updateFee(data){
      this.orderFeeList=data||[]
    },
    screenBtn() {
      this.screen = !+this.screen
    },
    saleAmountChange(record) {
      if (record.saleQty && record.saleAmount) {
        record.salePrice = this.formatPrice(
          Number(record.saleAmount) / Number(record.saleQty)
        );
      }
      this.getTotal();
    },
    handleTableDataChange(pagination) {
      this.paginationTable.current = pagination.current;
      this.paginationTable.pageSize = pagination.pageSize;
    },
    handleDeliveryCount(record) {
      record.costQty = record.deliveryCount;
      this.$forceUpdate();
    },
    purchaseSelectedChange() {
      this.$forceUpdate();
    },
    specsChange(value) {
      console.log(value);
      this.$forceUpdate();
    },
    onCheckedChange(e) {
      this.saleChecked = e.target.checked;
      this.dataForm.data = [];
      this.form.allMarketCost = null;
      this.getItemsNoPage("");
    },
    toRefreshSelect() {
      this.$forceUpdate();
    },
    getSingle(id) {
      this.spinning = true;
      orderGetsingle({id}).then((res) => {
        this.spinning = false;
        const data = res.data;
        if (data.code === "200") {
          this.form = data.data;
          this.contract(undefined,data.data.contractId,{id: data.data.contractId, contractTitle: data.data.contractTitle})
          if (!this.typeis(data.data.customerId, 'undefined')) this.handleCustomerChange(data.data.customerId, "stopClear")
          this.orderFeeList=data.data.orderFeeList||[]
          this.$refs.feemodel.receiveData(this.orderFeeList)
          this.form.purchaseSelected = this.form.purchaseSelected
            ? Number(this.form.purchaseSelected)
            : undefined;
          this.form.purchaseInvoiceUrls
            ? ""
            : (this.form.purchaseInvoiceUrls = []);
          this.form.saleInvoiceUrls ? "" : (this.form.saleInvoiceUrls = []);
          if (this.typeis(data.data.orderDetailList) == 'array') {
            data.data.orderDetailList?.forEach((item, j) => item.sortId = ++ j)
          }
          this.dataForm.data = data.data.orderDetailList;
          this.dataForm.data.pop();
          this.dataForm.data.forEach((item, index) => {
            item.keyIndex = index + 1;
            item.itemCode = item.itemCode || item.itemSno;
            if (item.itemPackList && item.itemPackList.length > 0) {
              item.packingCost = 0;
              item.itemPackList.forEach((val) => {
                let total = val.packQty * val.packUnitPrice;
                item.packingCost += total;
              });
            }
          });
          if (this.form.isMarketSale === 0) {
            this.saleChecked = true;
            this.productSelectState = "kucun";
          }
          this.getCustumers(22, this.form.customerId);
          this.getTotal();
          this.getItemsNoPage("");
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getTotal() {
      this.totalSaleAty = 0;
      this.totalOrderPrice = 0;
      this.totalPurchaseQty = 0;
      this.totalPurchasePrice = 0;
      let tempData = JSON.parse(JSON.stringify(this.dataForm.data));
      tempData.forEach((item, m) => {
        item.sortId = ++m
        item.saleQty
          ? (this.totalSaleAty += parseFloat(item.saleQty))
          : (this.totalSaleAty += 0);
        item.purchaseQty
          ? (this.totalPurchaseQty += parseFloat(item.purchaseQty))
          : (this.totalPurchaseQty += 0);
        // 总金额
        let totalPrice = 0;
        let marketSalePrice = item.marketSalePrice || 0;
        let marketCost = item.marketCost || 0;
        let costSales = item.costSales || 0;
        // let saleQty = item.saleQty || 0;
        // let salePrice = item.salePrice || 0;
        if (this.saleChecked) {
          totalPrice = marketSalePrice - marketCost - costSales;
        } else {
          totalPrice =
            this.productSelectState == "kucun"
              ? totalPrice + Number(marketSalePrice)
              : totalPrice + Number(item.saleAmount);
          // totalPrice = saleQty * salePrice;
        }
        //采购总金额
        let totalCaigouPrice = 0;
        item.purchaseQty && item.purchaseUnitPrice
          ? this.formatPrice(
              (totalCaigouPrice =
                Number(item.purchaseQty) * Number(item.purchaseUnitPrice))
            )
          : "";
        this.totalOrderPrice += totalPrice;
        this.totalPurchasePrice += totalCaigouPrice;
      });
      //0317
      let nullArr = [];
      this.dataForm.data.forEach((item) => {
        if (this.form.type === 6) {
          if (
            isFalse([
              item.saleQty,
              item.salePrice,
              item.priceUnit,
              item.purchaseQty,
              item.purchaseUnitPrice,
              item.vat,
              item.invoiceBusinessType,
              item.invoiceType,
            ])
          ) {
            nullArr.push(item.itemName);
          }
        } else {
          if (
            isFalse([item.saleQty, item.salePrice, item.priceUnit, item.vat,item.invoiceBusinessType,item.invoiceType,])
          ) {
            nullArr.push(item.itemName);
          }
        }
      });
      if (nullArr.length <= 0) {
        console.log(11);
        this.$refs.dataForm.clearValidate();
      }
      this.$forceUpdate();
    },
    deleteCgImgs(index) {
      this.form.purchaseInvoiceUrls.splice(index, 1);
    },
    deleteXsImgs(index) {
      this.form.saleInvoiceUrls.splice(index, 1);
    },
    downloadFile(url) {
      let labelA = document.createElement("a");
      labelA.href = url;
      labelA.click();
    },
    preView(url) {
      this.previewImage = url;
      this.previewVisible = true;
    },
    handleCancel() {
      this.previewImage = undefined;
      this.previewVisible = false;
    },
    async uploadFun(file) {
      let uploadResult = undefined;
      let params = new FormData();
      params.append("file", file);
      params.append("mode", "batch");
      params.append("type", "item");
      params.append("tableName", "signed");
      await uploadFiledoUpload(params).then((res) => {
        if (res.data.code === "200") {
          let uploadFileData = {
            type: res.data.data[0].fileType,
            name: res.data.data[0].fileName,
            url: res.data.data[0].filePath,
            state: res.data.data[0].fileState,
          };
          uploadResult = uploadFileData;
        } else {
          this.$message.error(res.data.message);
        }
      });
      return uploadResult;
    },
    beforeXsUpload(file) {
      this.uploadFun(file).then((res) => {
        this.form.saleInvoiceUrls.push(res);
      });
    },
    beforeCgUpload(file) {
      this.uploadFun(file).then((res) => {
        this.form.purchaseInvoiceUrls.push(res);
      });
    },
    handleInputSaleQtyChange(row, index) {
      row.purchaseQty = row.saleQty;
      // row.deliveryCount = row.saleQty;
      if (this.productSelectState == "kucun") {
        row.marketSalePrice =
          row.saleQty && row.salePrice
            ? this.formatPrice(Number(row.saleQty) * Number(row.salePrice))
            : "";
      }
      if (this.saleChecked) {
        if (row.poQty) {
          let saleQty = row.saleQty || 0;
          row.marketCost =
            (parseFloat(this.form.allMarketCost) * parseFloat(saleQty)) /
            parseFloat(row.poQty);

          row.marketCost = (row.marketCost.toFixed(8) * 100000000) / 100000000;
        } else {
          row.marketCost = 0;
        }
      }
      console.log(row.saleQty);
      console.log(row.salePrice);
      row.saleAmount =
        row.saleQty && row.salePrice
          ? this.formatPrice(row.saleQty * row.salePrice)
          : "";
      if (row.saleAmount) {
        row.lossEndAmount = this.formatPrice(row.saleAmount * (1 - 0.065));
      }
      if (this.saleChecked) {
        this.handleInputMarketSalePrice(row, "ms", index);
      }
      this.getTotal();
    },
    handleAllMarketCostChange() {
      let allMarketCost = this.form.allMarketCost;
      let mspTo = 0;
      this.dataForm.data.forEach((item, r) => {
        item.sortId = ++r
        if (this.saleChecked) {
          if (item.marketSalePrice) {
            mspTo += Number(item.marketSalePrice);
          } else {
            mspTo += 0;
          }
          // if (item.poQty === 0) {
          //   item.marketCost = 0;
          // } else {
          //   item.marketCost =
          //     (parseFloat(allMarketCost) * parseFloat(item.saleQty)) /
          //     parseFloat(item.poQty);

          //   item.marketCost =
          //     (item.marketCost.toFixed(8) * 100000000) / 100000000;
          // }
        }
      });
      this.dataForm.data.forEach((item, h) => {
        item.sortId = ++h
        if (this.saleChecked) {
          if (item.marketSalePrice) {
            item.marketCost = this.formatPrice(
              (Number(item.marketSalePrice) / mspTo) * Number(allMarketCost)
            );
            item.costSales = this.formatPrice(
              (item.marketSalePrice - item.marketCost) * 0.03
            );
            item.salePrice = this.formatPrice(
              (item.marketSalePrice - item.marketCost - item.costSales) /
                Number(item.saleQty)
            );
          } else {
            item.marketCost = "";
            item.costSales = "";
          }
        }
      });
      this.getTotal();
    },
    unitChange(val, record) {
      record.invId ? "" : (record.deliveryUnit = val);
      this.$forceUpdate();
    },
    handleInputChange(row) {
      console.log('row: ', row);
      row.saleAmount =
        row.saleQty && row.salePrice
          ? this.formatPrice(row.saleQty * row.salePrice)
          : "";
      if (row.saleAmount) {
        row.lossEndAmount = this.formatPrice(row.saleAmount * (1 - 0.065));
      }
      if (this.productSelectState == "kucun") {
        row.marketSalePrice =
          row.saleQty && row.salePrice
            ? this.formatPrice(Number(row.saleQty) * Number(row.salePrice))
            : "";
      }
      console.log(row.salePrice);
      this.getTotal();
    },
    handlePurchaseChange(row) {
      row.purchaseAmount =
        row.purchaseQty && row.purchaseUnitPrice
          ? this.formatPrice(row.purchaseQty * row.purchaseUnitPrice)
          : "";
      if (row.purchaseAmount > 0) {
        row.settlementAmount = row.purchaseAmount;
      }
      row.invId ? "" : (row.costPrice = row.purchaseUnitPrice);
      if (!row.invAvailableType) {
        row.costPrice = row.purchaseUnitPrice;
      }
      this.getTotal();
    },
    handleInputMarketSalePrice(row, state) {
      if (row) {
        let marketSalePrice = row.marketSalePrice || 0;
        let marketCost = row.marketCost || 0;
        let saleQty = row.saleQty || 0;
        let costSales = row.costSales || 0;
        if (state == "ms" && this.saleChecked) {
          row.costSales = this.formatPrice(
            (marketSalePrice - marketCost) * 0.03
          );
        }
        row.salePrice = this.formatPrice(
          (marketSalePrice - marketCost - costSales) / saleQty
        );
        if (state == "ms") {
          let allMarketCost = this.form.allMarketCost;
          let mspTo = 0;
          this.dataForm.data.forEach((item) => {
            if (this.saleChecked) {
              if (item.marketSalePrice) {
                mspTo += Number(item.marketSalePrice);
              } else {
                mspTo += 0;
              }
            }
          });
          this.dataForm.data.forEach((item, f) => {
            item.sortId = ++f
            if (this.saleChecked) {
              if (item.marketSalePrice) {
                item.marketCost = this.formatPrice(
                  (Number(item.marketSalePrice) / mspTo) * Number(allMarketCost)
                );
                item.costSales = this.formatPrice(
                  (item.marketSalePrice - item.marketCost) * 0.03
                );
                item.salePrice = this.formatPrice(
                  (item.marketSalePrice - item.marketCost - item.costSales) /
                    item.saleQty
                );
              }
            }
          });
        }
      }

      this.getTotal();
      this.$forceUpdate();
    },
    handleItemsSelectsChange(type, row) {
      const params = {
        type: type,
        itemId: row.id,
      };
      itemDictionaryInfoList(params).then((res) => {
        const data = res.data;
        if (data.code === "200") {
          switch (type) {
            case 1:
              row.pzData = data.data;
              break;
            case 2:
              row.ycgData = data.data;
              break;
            case 3:
              row.ggData = data.data;
              break;
          }
          this.$forceUpdate();
        } else {
          this.$message.error(data.message);
        }
      });
    },
    openPackage(row, pageState) {
      this.ItemsObj = row;
      this.$refs.stPackage.openPachage(row, pageState);
    },
    openPrudoct() {
      this.$refs.stAddItems.openPrudoct(this.form.customerId, this.orderDate);
    },
    openKucunPrudoct() {
      if (this.saleChecked) {
        if (!this.form.allMarketCost) {
          this.$message.error(`市场总费用为必填项！`);
          return;
        }
      }
      this.$refs.stAddKucunItems.openPrudoct(
        this.form.customerId,
        this.saleChecked,
        this.form.type
      );
    },
    handleSubmitPackage(data, price) {
      this.dataForm.data.forEach((item, d) => {
        item.sortId = ++d
        if (this.ItemsObj.id === item.id) {
          item.itemPackList = data;
          item.packDetailList = data;

          item.packingCost = price;
        }
      });
      this.$forceUpdate();
      this.$refs.stPackage.handleCancelPackage();
    },
    getItems(data, type) {
      let uniqArr = [];
      let bananceArr = [];
      this.dataForm.data.forEach((item) => {
        data.forEach((val) => {
          if (item.id === val.id) {
            uniqArr.push(item.itemName);
            if (
              parseFloat(item.saleQty) + parseFloat(val.saleQty) >
              item.balance
            ) {
              bananceArr.push(item.itemName);
            }
          }
        });
      });
      // if (bananceArr.length > 0) {
      //   let str = bananceArr.join(",");
      //   this.$message.error(`商品${str}数量不能大于可用数量！`);
      //   return;
      // }
      if (uniqArr.length > 0) {
        let str = uniqArr.join(",");
        this.$message.error(`商品${str}已经存在！`);
        // return;
      }
      if (type === "items") {
        this.$refs.stAddItems.handleCancelItems();
      } else if (type === "kucun") {
        if (this.saleChecked) {
          let containerCodeArr = [];
          data.forEach((item) => {
            if (item.poQty === 0) {
              item.marketCost = 0;
            } else {
              item.marketCost = 0;
              //   (parseFloat(this.form.allMarketCost) *
              //     parseFloat(item.saleQty)) /
              //   parseFloat(item.poQty);

              // item.marketCost =
              //   (item.marketCost.toFixed(8) * 100000000) / 100000000;
            }
            this.form.isMarketSale = 0;
            containerCodeArr.push(item.containerCode);
          });
          if (this.dataForm.data.length) {
            let i = this.dataForm.data[0].containerCode;
            let j = containerCodeArr[0];
            if (i != j) {
              this.$message.error(`市场销售的商品只能选择相同柜号里的商品！`);
              return;
            }
          } else {
            let uniArr = Array.from(new Set(containerCodeArr));
            if (uniArr.length > 1) {
              this.$message.error(`市场销售的商品只能选择相同柜号里的商品！`);
              return;
            }
          }
        } else {
          this.form.isMarketSale = 1;
        }
        this.$refs.stAddKucunItems.handleCancelItems();
      }
      let tempD = this.dataForm.data.concat(data);
      this.$set(this.dataForm, "data", tempD);
      // this.dataForm.data = this.dataForm.data.concat(data);
      this.dataForm.data.forEach((item, s) => {
        item.keyIndex = ++s;
        item.sortId = s;
      });
      this.getTotal();
    },
    delOne(row, index) {
      console.log(row);
      console.log(index);
      this.dataForm.data.splice(index - 1, 1);
      this.getTotal();
    },
    cancel() {
      this.$message.error("取消");
    },
    clearTable() {
      if (this.dataForm.data?.length == 0) return
      this.dataForm.data = []
      this.totalSaleAty = 0
      this.totalOrderPrice = 0
      this.totalPurchaseQty = 0
      this.totalPurchasePrice = 0
      this.paginationTable.current = 1
      this.paginationTable.pageSize = 10
      this.paginationTable.total = 0
    },
    addItem() {
      if (!this.addItemObj.id) {
        this.$message.error(`请至少选择一条商品！`);
        return;
      }
      if (this.productSelectState === "kucun") {
        // if (this.addItemObjBalance < parseFloat(this.addItemObj.saleQty)) {
        //   this.$message.error(`商品数量不能大于可用数量！`);
        //   return;
        // }
        if (this.dataForm.data.length) {
          // let addItemObjBalanceAll = 0;
          for (let i = 0; i < this.dataForm.data.length; i++) {
            let item = this.dataForm.data[i];
            // if (item.id === this.addItemObj.id) {
            //   addItemObjBalanceAll += parseFloat(item.saleQty);
            // }
            item.specs = item.itemSpec || "";
          }
          console.log(this.dataForm.data);
          // if (
          //   this.addItemObjBalance <
          //   addItemObjBalanceAll + parseFloat(this.addItemObj.saleQty)
          // ) {
          //   this.$message.error(`商品数量不能大于可用数量！`);
          //   return;
          // }
        }
        this.addItemObj.invId = this.addItemObj.id;
        this.addItemObj.costPrice = this.addItemObj.poPrice;
        this.addItemObj.supplyPrice = this.addItemObj.poPrice;
        this.addItemObj.supplyPrice = this.addItemObj.poPrice;
        this.addItemObj.costQty = this.addItemObj.saleQty;
        if (this.saleChecked) {
          if (this.dataForm.data.length) {
            let conCode = this.dataForm.data[0].containerCode;
            if (this.addItemObj.containerCode != conCode) {
              this.$message.error(`市场销售的商品只能选择相同柜号里的商品！`);
              return;
            }
          }
          this.form.isMarketSale = 0;
          if (!this.form.allMarketCost) {
            this.$message.error(`市场总费用为必填项！`);
            return;
          }
          if (this.addItemObj.saleQty) {
            if (this.addItemObj.poQty) {
              this.addItemObj.marketCost =
                (parseFloat(this.form.allMarketCost) *
                  parseFloat(this.addItemObj.saleQty)) /
                parseFloat(this.addItemObj.poQty);
              this.addItemObj.marketCost = this.formatPrice(
                this.addItemObj.marketCost
              );
            } else {
              this.addItemObj.marketCost = 0;
            }
          }
        } else {
          this.form.isMarketSale = 1;
        }
      }
      const uniqArr = this.dataForm.data.filter((item) => {
        return item.id === this.addItemValue;
      });
      if (uniqArr.length > 0) {
        this.$message.error(`商品已经存在！`);
        // return;
      }
      this.addItemObj.deliveryCount = this.addItemObj.balance
        ? this.addItemObj.saleQty
        : "";
      this.addItemObj.deliveryUnit = this.addItemObj.measureUnit;
      this.addItemObj.priceUnit = this.addItemObj.priceUnit ? this.addItemObj.priceUnit : this.addItemObj.defUom || "";
      this.addItemObj.purchaseQty = this.addItemObj.saleQty;
      this.addItemObj.purchaseAmount =
        this.addItemObj.purchaseQty && this.addItemObj.purchaseUnitPrice
          ? this.formatPrice(
              this.addItemObj.purchaseQty * this.addItemObj.purchaseUnitPrice
            )
          : "";

      this.addItemObj.vat = this.addItemObj.outputTaxRate
        ? this.addItemObj.outputTaxRate
        : "";
      let tempD = JSON.parse(JSON.stringify(this.addItemObj));
      patchArray(this.dataForm.data);
      this.dataForm.data.unshift(JSON.parse(JSON.stringify(tempD)));
      // this.$set(this.dataForm.data,this.dataForm.data.length,tempD)
      console.log(this.dataForm.data);
      this.dataForm.data.forEach((item, index) => {
        item.keyIndex = ++index;
        item.sortId = index;
        if (!item.invId && item.specList && item.specList.length > 0) {
          item.specs = item.specList[0].specName;
        } else {
          item.specs = item.itemSpec || "";
        }
        //211230
        item.saleAmount =
          item.saleQty && item.salePrice
            ? this.formatPrice(item.saleQty * item.salePrice)
            : "";
        if (item.saleAmount) {
          item.lossEndAmount = this.formatPrice(item.saleAmount * (1 - 0.065));
        }
        if (item.purchaseAmount > 0) {
          item.settlementAmount = item.purchaseAmount;
        }
        //--------
        this.$forceUpdate();
      });

      this.getTotal();
      this.addItemObj.saleQty = "";
      this.addItemObj.salePrice = "";
      this.addItemValue = undefined;
      console.log(this.dataForm.data);
      this.$refs.sucker.focus();
      this.getItemsNoPage("");
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    getCustumers(partnerType, parentId) {
      const params = {
        partnerType,
        parentId,
        isEnable: 1
      };
      partnerList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (partnerType === 22) {
            if (parentId) {
              this.storeData = data.data;
            }
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getCustumers2(partnerType, parentId) {
      partnerList2({ partnerType, parentId, isEnable: 1 }).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          if (partnerType === 20) {
            this.customerData = data.data;
          }else if (partnerType === 30) {
            this.purchaseSelectedData = data.data;
            this.supplierData = data.data;
          }
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getWhData() {
      const params = {};
      wareHouseList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.whData = data.data;
          this.form.whId = this.whData[0].id;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    async mustContract() {
      await mustContract().then(res => {
        if (res.data.code == 200) {
          this.mustSelectContract = res.data.data
        }
      })
    },
    handleCustomerChange(val, stopClear) {
      this.form.storeId = undefined;
      if (val) {
        const customerObj = this.customerData.find((item) => {
          return val === item.id;
        });
        if (this.form.customerType != 2 && this.isUndef(customerObj)) {
          this.PartnerData.unshift({id: val, partnerName: this.form.supplierName, orgId: this.form.orgId})
        }
        this.mustCheck = this.form.customerType != 2 ? this.mustSelectContract.includes(customerObj?.orgId || this.form.orgId) : false
        this.form.receiptPhone = customerObj.contactPhone;
        this.form.receiptRegion = customerObj.cityId;
        this.form.receiptAddress = customerObj.address;
        this.form.customerName = customerObj.partnerName
        this.getCustumers(22, val);
        this.getItemsNoPage("");
      }
      if (stopClear != 'stopClear') this.clearContract()
    },
    handleStoreChange(val) {
      if (val) {
        const storeObj = this.storeData.find((item) => {
          return val === item.id;
        });
        this.form.receiptPhone = storeObj.contactPhone;
        this.form.receiptRegion = storeObj.cityId;
        this.form.receiptAddress = storeObj.address;
        this.form.storeName = storeObj.partnerName;
      } else {
        this.form.receiptPhone = "";
        this.form.receiptRegion = "";
        this.form.receiptAddress = "";
      }
    },
    handlePopupScroll(e) {
      if (
        e.target.scrollTop + e.target.offsetHeight >
        e.target.scrollHeight-4
      ) {
        if (this.itemsPagination.pageIndex >= this.itemsPagination.totalPage) {
          return false;
        }
        this.getItemsNoPage(this.getItemsNoPageVal, "scroll");
      }
    },
    getItemsNoPageSelect() {
      const itemData = this.dataItemSource.find((item) => {
        return item.id === this.addItemValue;
      });
      this.addItemObj = itemData;
      this.addItemObj.balance
        ? (this.addItemObjBalance = this.addItemObj.balance)
        : (this.addItemObjBalance = 0);
    },
    getItemsNoPage: debounce(function (val, state) {
      this.getItemsNoPageVal = val;
      console.log(val);
      this.productLoading = true;
      if (state) {
          this.itemsPagination.pageIndex++
        }
      if (this.productSelectState === "produ") {
        const params = {
          likeItemName: this.getItemsNoPageVal,
          customerId: this.form.customerId,
          orderDate: this.form.orderDate,
          rows: this.itemsPagination.pageSize,
          page: this.itemsPagination.pageIndex,
          sort: "id",
          order: "DESC",
        };
        componentGetItems(params).then((res) => {
          this.productLoading = false;
          const data = res.data;
          if (data.code == 200) {
            this.itemsPagination.totalPage = data.totalPage;
            if (state) {
              this.dataItemSource = this.dataItemSource.concat(data.data);
            } else {
              this.dataItemSource = data.data;
            }
          } else {
            this.$message.error(data.message);
          }
        });
      } else if (this.productSelectState === "kucun") {
        const params = {
          itemName: this.getItemsNoPageVal,
          customerId: this.form.customerId,
          hasContainerCode: this.saleChecked,
          // itemCode: "",
          rows: this.itemsPagination.pageSize,
          page: this.itemsPagination.pageIndex,
          sort: "id",
          order: "DESC",
        };
        componentGetInventoryList(params).then((res) => {
          this.productLoading = false;
          const data = res.data;
          if (data.code == 200) {
            this.itemsPagination.totalPage = data.totalPage;
            if (state) {
              this.dataItemSource = this.dataItemSource.concat(data.data);
            } else {
              this.dataItemSource = data.data;
            }
          } else {
            this.$message.error(data.message);
          }
        });
      }
    }, 1000),
    getDictionaryData() {
      const params = {
        type: 10,
      };
      dictionaryList(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.dictionaryData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    getPartnerData() {
      const params = {
        partnerType: 30,
        isEnable: 1
      };
      partnerType(params).then((res) => {
        const data = res.data;
        if (data.code == 200) {
          this.PartnerData = data.data;
        } else {
          this.$message.error(data.message);
        }
      });
    },
    handleProductChange() {
      this.dataItemSource = [];
      this.getItemsNoPage("");
      this.addItemValue = undefined;
    },
    handlecustomertypeChange(v) {
      this.clearContract()
      if (this.form.customerType === 2) {
        this.itemsPagination.pageIndex = 1;
        this.getItemsNoPage("");
      }
      v == 2 && (this.form.payType = 1)
      this.form.customerName = "";
      this.form.customerId = undefined;
      this.form.storeName = "";
      this.form.storeId = undefined;
      this.$refs.infoform.clearValidate(["customerName", "customerId"]);
    },
    handleClickLi(item) {
      this.form = {
        source: 1,
        orderDate: formatDate(new Date(), "YYYY-MM-dd hh:mm:ss"),
        deliveryDate: formatDate(
          new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          "YYYY-MM-dd hh:mm:ss"
        ),
        customerType: 1,
        whId: this.whData.length > 0 ? this.whData[0].id : undefined,
        customerName: "",
        customerId: undefined,
        storeName: "",
        storeId: undefined,
        storeType: 1,
        deliveryType: 1,
        purchaseSelected: undefined,
        payType: 2,
        receiptPhone: "",
        receiptRegion: "",
        receiptAddress: "",
        remark: "",
        saleInvoiceUrls: [],
        purchaseInvoiceUrls: [],
        allMarketCost: null,
        isMarketSale: 1,
        // data: [],
      };
      this.saleChecked = false;
      this.form.type = item.type;
      this.dataForm = {
        data: [],
      };
      this.addItemValue = undefined;
      this.addItemObj = {
        saleQty: "",
        balance: 0,
        measureNetBalance: "",
      };
      this.dataItemSource = [];
      // this.getItemsNoPage("");
      this.addItemObjBalance = 0;
      this.columns = [];
      switch (this.form.type) {
        case 1:
        case 3:
        case 5:
          this.columns = this.columnsNor;
          this.productSelectState = "produ";
          break;
        case 2:
        case 4:
          this.columns = this.columnsKuCun;
          this.productSelectState = "kucun";
          break;
        case 6:
          this.columns = this.columnsCaixiao;
          this.productSelectState = "produ";
          break;
        default:
          this.columns = this.columnsNor;
          this.productSelectState = "produ";
          break;
      }
      this.$refs.infoform.clearValidate();
    },
    submit(val) {
      if (this.isUndef(this.form.contractId) && this.mustCheck) {
        this.$message.error("请选择关联合同", 3.5)
        return
      }
      this.$refs.infoform.validate(async (valid) => {
        if (valid) {
          let nullArr = [];
          let invIds = [];
          if (this.dataForm.data.length === 0) {
            this.$message.error(`请添加商品！`);
            return;
          }
          this.dataForm.data.forEach((item) => {
            if (this.form.type === 6) {
              if (
                isFalse([
                  item.saleQty,
                  item.salePrice,
                  item.priceUnit,
                  item.purchaseQty,
                  item.purchaseUnitPrice,
                  item.vat,
                  item.invoiceBusinessType,
                  item.invoiceType,
                ])
              ) {
                nullArr.push(item.itemName);
              }
            } else {
              if (
                isFalse([
                  item.saleQty,
                  item.salePrice,
                  item.priceUnit,
                  item.vat,
                  item.invoiceBusinessType,
                  item.invoiceType,
                ])
              ) {
                nullArr.push(item.itemName);
              }
            }
            if (item.invId) {
              invIds.push(item.invId);
            }
          });
          if (nullArr.length > 0) {
            let str = nullArr.join(",");
            if (this.form.type === 6) {
              this.$message.error(
                 `商品${str}的数量、售价、计价单位、采购数量、采购单价、增值税、发票类型为必填项！`
              );
            } else {
              this.$message.error(
                `商品${str}的数量、售价、计价单位、增值税、发票类型为必填项！`
              );
            }
            return;
          } else {
            this.$refs.dataForm.clearValidate();
          }
          invIds = [...new Set(invIds)];
          let invItems = [];
          invIds.forEach((item) => {
            let invObj = {
              invQtys: 0,
              invId: "",
            };
            this.dataForm.data.forEach((val) => {
              if (item === val.invId) {
                invObj.invQtys = parseFloat(val.saleQty) + invObj.invQtys;
                invObj.invId = val.invId;
                invObj.itemName = val.itemName;
                invObj.balance = val.balance;
              }
            });
            invItems.push(invObj);
          });
          // for (let i = 0; i < invItems.length; i++) {
          //   let item = invItems[i];
          //   if (item.invQtys > item.balance) {
          //     this.$message.error(
          //       `商品${item.itemName}的数量不能大于库存数量！`
          //     );
          //     return false;
          //   }
          // }
          let data = JSON.parse(JSON.stringify(this.dataForm.data));
          data.forEach((item) => {
            item.deductions = item.deductions
              ? (item.deductions.toFixed(8) * 100000000) / 100000000
              : "";

            item.itemId = item.itemId ? item.itemId : item.id;
            item.saleQty = parseFloat(item.saleQty);
            item.specs = item.specs ? item.specs : "";
            if (item.invId) {
              item.saleItemSpec = item.specs;
            }
          });
          //费用项
          this.$refs.feemodel.submit()
          if ( this.orderFeeList&&this.orderFeeList.length>0?this.orderFeeList.some(
            (item) => isFalse([item.receivingSubjectId,item.rate,item.feeAmount])
             ):false
             ) {
              this.$message.error("请填写费用必填项");
             return;
            }
          const params = {
            ...this.form,
            orderDetailList: data,
            orderFeeList:this.orderFeeList
          };
          if (this.form.type == 2 && params.orderDetailList.some(dc => dc.deliveryCount <= 0 || !dc.deliveryCount)) {
            this.$message.error("库存单的出库数量为必填项，且必须大于0")
            return
          }
          //新增草稿
          if (val === "draft" && !this.$route.query.orderId) {
            this.submitDraftLoading = true;
            params.state = 99;
            if (this.form.type === 6) {
              overallOrderInsertDraft(params).then((res) => {
                this.submitDraftLoading = false;
                const data = res.data;
                if (data.code == 200) {
                  this.$closePage(
                    "/enterSaleStore/sale/saleOrderAdd",
                    "/enterSaleStore/sale/orderList"
                  );
                  this.handleClickLi({
                    type: this.form.type,
                  });
                  this.$message.success(data.message);
                } else {
                  this.$message.error(data.message);
                }
              });
            } else {
              orderInsertTodDraft(params).then((res) => {
                this.submitDraftLoading = false;
                const data = res.data;
                if (data.code == 200) {
                  this.$closePage(
                    "/enterSaleStore/sale/saleOrderAdd",
                    "/enterSaleStore/sale/orderList"
                  );
                  this.handleClickLi({
                    type: this.form.type,
                  });
                  this.$message.success(data.message);
                } else {
                  this.$message.error(data.message);
                }
              });
            }
          } else {
            //其余情况
            if (this.pageState === "add" || this.pageState === "copy") {
              //新增或者复制
              this.submitLoading = true;
              if (this.form.type === 6) {
                overallOrderInsert(params).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$closePage(
                      "/enterSaleStore/sale/saleOrderAdd",
                      "/enterSaleStore/sale/orderList"
                    );
                    this.handleClickLi({
                      type: this.form.type,
                    });
                    this.$message.success(data.message);
                  } else {
                    this.$message.error(data.message);
                  }
                });
              } else {
                orderInsert(params).then((res) => {
                  this.submitLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$closePage(
                      "/enterSaleStore/sale/saleOrderAdd",
                      "/enterSaleStore/sale/orderList"
                    );
                    this.handleClickLi({
                      type: this.form.type,
                    });
                    this.$message.success(data.message);
                  } else {
                    this.$message.error(data.message);
                  }
                });
              }
            } else if (this.pageState === "edit") {
              //修改
              if (val !== "draft") {
                //说明是点的普通的按钮
                params.state === 99 ? (params.state = 0) : "";
                this.submitLoading = true;
              } else {
                //草稿按钮
                this.submitDraftLoading = true;
              }
              if (this.form.type === 6) {
                overallOrderUpdate(params).then((res) => {
                  this.submitLoading = false;
                  this.submitDraftLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$closePage(
                      "/enterSaleStore/sale/saleOrderAdd",
                      "/enterSaleStore/sale/orderList"
                    );
                    if (val === "draft") {
                      this.getSingle(this.orderId);
                      this.$message.success(data.message);
                    } else {
                      this.$message.success(data.message);
                    }
                  } else {
                    this.$message.error(data.message);
                  }
                });
              } else {
                orderUpdate(params).then((res) => {
                  this.submitLoading = false;
                  this.submitDraftLoading = false;
                  const data = res.data;
                  if (data.code == 200) {
                    this.$closePage(
                      "/enterSaleStore/sale/saleOrderAdd",
                      "/enterSaleStore/sale/orderList"
                    );
                    if (val === "draft") {
                      this.getSingle(this.orderId);
                      this.$message.success(data.message);
                    } else {
                      this.$message.success(data.message);
                    }
                  } else {
                    this.$message.error(data.message);
                  }
                });
              }
            }
          }
        } else {
          this.$message.error("存在必填项未填请核对后再提交");
          return false;
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
@import "index.less";
/deep/.ant-form-item {
  margin-bottom: 0;
}
</style>