<template>
  <div class="modalTop" id="scrollTop">
    <div class="modalContainer">
      <div class="divBorder" v-if="fullScreen">
        <p class="pTittle fontWeight">订单信息</p>
        <a-row class="rowMarginTop" :gutter="[10, 10]">
          <a-col :span="6">
            <div class="fontWeight">结算单号：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.apInvoiceCode"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">供货商名称：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.supplierName"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">公司余额：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.companyBalance"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">单据金额：</div>
            <a-input v-if="dataType == 2" disabled class="widthMarginFull" v-model="headMsg.payAmount"></a-input>
            <a-input v-else disabled class="widthMarginFull" v-model="headMsg.settlementAmount"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">支付方式：</div>
            <a-select :disabled="flag == 'details' ? true : false" class="widthMargin" :show-arrow="flag != 'details' ? true : false" v-model="headMsg.payType">
              <!-- //!当前支付方式使用固定值，暂时保留已注释接口渲染选项 -->
              <!-- <a-select-option v-for="(item, i) in option.payWayOption" :value="item.id" :key="i"> {{ item.dicText }} </a-select-option> -->
              <a-select-option value="1">微信</a-select-option>
              <a-select-option value="2">支付宝</a-select-option>
              <a-select-option value="3">转账</a-select-option>
              <a-select-option value="4">现金</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">结算货币：</div>
            <a-select disabled class="widthMargin" :show-arrow="flag != 'details' ? true : false" v-model="headMsg.currency">
              <!-- //!当前结算货币使用固定值，暂时保留已注释接口渲染选项 -->
              <!-- <a-select-option v-for="(item, i) in option.moneyOption" :value="item.id" :key="i"> {{ item.dicText }} </a-select-option> -->
              <a-select-option :value="1"> 人民币 </a-select-option>
              <a-select-option :value="2"> 港币 </a-select-option>
              <a-select-option :value="3"> 美元 </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">预付金额：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.payAmount"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">结算状态：</div>
            <a-input disabled class="widthMarginFull" :value="headMsg.state == 1 ? '未结算' : headMsg.state == 2 ? '结算中' : headMsg.state == 3 ? '部分结算' :'已结算'"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">已付金额：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.payAmounted"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">本次结算金额：</div>
            <a-input v-if="dataType == 2" disabled class="widthMargin" v-model="headMsg.payAmount"></a-input>
            <a-input v-else-if="headMsg.poType==2" disabled class="widthMargin" v-model="headMsg.surplusPayAmount"></a-input>
            <a-input-number v-else :disabled="flag == 'details' ? true : false" class="widthMargin" v-model="headMsg.surplusPayAmount"></a-input-number>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">未付金额：</div>
            <a-input v-if="dataType == 2" disabled class="widthMargin" value="0"></a-input>
            <a-input v-else disabled class="widthMargin" :value="noPayAmount"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">折扣金额：</div>
            <a-input v-if="dataType == 2" disabled class="widthMarginFull" v-model="headMsg.discountAmount"></a-input>
            <a-input v-else :disabled="flag == 'details' ? true : false" class="widthMarginFull"
            v-model="headMsg.discountAmount" @change="globalAmountCompute"  v-inputLimit="2"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">备注：</div>
            <div v-if="flag == 'details'" class="widthMargin heightBgc">{{ headMsg.remark }}</div>
            <a-input v-else class="widthMargin" v-model.trim="headMsg.remark"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">所属运营主体：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.opName"></a-input>
          </a-col>
          <a-col :span="6">
            <div class="fontWeight">柜号：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.containerCode"></a-input>
          </a-col>
          <!-- <a-col :span="6">
            <div class="fontWeight aRequired">关联合同：</div>
            <a-input v-if="flag == 'details'" disabled class="widthMargin" v-model="headMsg.contractTitle"></a-input>
            <a-select
              v-else
              style="width: 100%;"
              show-search
              v-model="headMsg.contractId"
              placeholder="请先选择客户"
              :default-active-first-option="false"
              :filter-option="false"
              :not-found-content="null"
              :disabled="!headMsg.supplierId"
              @search="contract"
              @select="contractSelect"
              @focus="contract"
            >
              <a-select-option v-for="item in contractOption" :key="item.id">{{item.contractTitle}}</a-select-option>
            </a-select>
          </a-col> -->
          <!-- //! glht -->
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">代理公司名称：</div>
            <a-select
              class="widthMargin"
              v-model.trim="headMsg.agencyId"
              placeholder="请输入代理商名称"
              @change="agencyChange"
              @search="agencySearch"
              :filter-option="filterOption"
              allowClear
              showSearch
              :disabled="flag == 'details'"
            >
              <a-select-option
                v-for="(item, index) in agencyList"
                :value="item.id"
                :key="index"
                >{{ item.partnerName }}</a-select-option
              >
            </a-select>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">预估人民币金额：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.predictAmountTwo"></a-input>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">实际人民币金额：</div>
            <a-input disabled class="widthMargin" v-model="headMsg.actualAmountTwo"></a-input>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">手续费：</div>
            <a-input class="widthMargin" v-model="headMsg.handlingFee" v-inputLimit="2" :min='0' :disabled="flag == 'details'"></a-input>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">电报费：</div>
            <a-input class="widthMargin" v-model="headMsg.cableFee" :min='0' v-inputLimit="2" :disabled="flag == 'details'"></a-input>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">实际汇率：</div>
             <a-input-number class="widthMargin" :disabled="flag == 'details'"
             v-model="headMsg.actualExchangeRate" :min='0' @keydown="inputSixNum" @change="getGlobalCompute" >
             </a-input-number>
          </a-col>
          <a-col :span='6' v-if="headMsg.poType==2">
            <div class="fontWeight">差额：</div>
             <a-input disabled class="widthMargin" v-model="headMsg.balanceAmountTwo"></a-input>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="6">
            <span class="fontWeight">上传图片：</span>
          </a-col>
        </a-row>
        <a-row class="rowMarginTop">
          <a-col :span="24">
            <div class="marginLeft">
              <a-upload
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
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="tableContainer">
        <p class="pTittle">关联银行流水</p>
        <a-form-model :model="form">
          <a-row>
            <a-col :span="24">
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select placeholder="请选择流水关联状态" v-model="form.status" allowClear>
                  <a-select-option v-for="item in optionx.referenceStatus" :key="item.key">{{item.value}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择本方的户名" v-model="form.accountName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.accountNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择银行" v-model="form.bankName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.bankNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择对方的户名" v-model="form.oppAccName" :filter-option="filterOption" allowClear>
                  <a-select-option v-for="item in optionx.oppAccNameList" :key="item">{{item}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择付款类型" v-model="form.paymentMethod" allowClear>
                  <a-select-option v-for="item in optionx.paymentList" :key="item.id">{{item.name}}</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-select show-search placeholder="请选择收支类型" v-model="form.transWay" @change="fouceUpdate" allowClear>
                  <a-select-option value="收入">收入</a-select-option>
                  <a-select-option value="支出">支出</a-select-option>
                </a-select>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle formItemStylewidth">
                <a-input placeholder="请输入银行流水号" v-model.trim="form.bankSerialNumber" allowClear></a-input>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle dateWidth">
                <a-range-picker
                  v-model="form.time"
                  format="YYYY-MM-DD HH:mm:ss"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                  :placeholder="['交易开始日期','交易结束日期']"
                  @change="onChangex"
                  allowClear
                >
                  <template slot="dateRender" slot-scope="current, today">
                    <div class="ant-calendar-date" :style="getCurrentStyle(current, today)">{{current.date()}}</div>
                  </template>
                </a-range-picker>
              </a-form-model-item>
              <a-form-model-item class="formItemStyle">
                <a-button class="ant-button" type="primary" icon="redo" @click="resetBtn">清空</a-button>
                <a-button class="ant-button" type="primary" icon="search" @click="submitBtn('select')">查询</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
        <div class="tableInfo">
          <a-table
            bordered
            ref="tableRef"
            size="middle"
            :columns="columns"
            :data-source="dataTable"
            :loading='loading'
            rowKey="id"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :scroll="{ x: 307.778 , y: pagination.size > 10 ? 600 : 0}"
            :pagination='false'
          >
            <template slot="relatedBill" slot-scope="text, record">
              <a-popover trigger="hover" placement="right">
                <template slot="content">
                  <div style="max-width:200px; margin:0; word-wrap:break-word; color:#1900ff;">
                    {{ record.relatedBill }}
                  </div>
                </template>
                <p style="width:174px; margin:0; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
                  {{ record.relatedBill }}
                </p>
              </a-popover>
            </template>
            <span slot="status" slot-scope="text, record">
              <a-tag color="#999999" v-show="record.status == 0">
                <div style="width: 48px;text-align: center;">{{optionx.status[text]}}</div>
              </a-tag>
              <a-tag color="#F59A23" v-show="record.status == 1">
                {{optionx.status[text]}}
              </a-tag>
              <a-tag color="#5F9900" v-show="record.status == 2">
                <div style="width: 48px;text-align: center;">{{optionx.status[text]}}</div>
              </a-tag>
            </span>
            <span slot="paymentMethod" slot-scope="text"><span>{{text == 1 ? '现结' : '周期结算'}}</span></span>
            <span slot="accountNumber" tips="本方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
            <span slot="oppAccNo" tips="对方账户账号" slot-scope="text"><div>{{strExchange(text)}}</div></span>
            <span slot="fileName" tips="文件名" slot-scope="text, record">
              <a-button type="link" style="text-decoration: underline;" @click="exportSingle(record)">{{text}}</a-button>
            </span>
            <template tips='本页合计' slot="footer" slot-scope="currentPageData" v-if="currentPageData">
              <span class="greyfont">已选择关联金额</span>
              &lt;<span class="redfont">{{ referenceMoney }}</span>&gt;
              <a-divider class="dividerStyle" type="vertical" />
              <span class="greyfont">剩余未关联金额</span>
              &lt;<span class="redfont">{{
                0 > formatPrice((typeis(+headMsg.surplusPayAmount == 'number') ? +headMsg.surplusPayAmount : 0) - referenceMoney) ? 0 :
                formatPrice((typeis(+headMsg.surplusPayAmount == 'number') ? +headMsg.surplusPayAmount : 0) - referenceMoney)
              }}</span>&gt;
            </template>
          </a-table>
          <div class="paginationContainer flex-ed" v-show="dataTable[0]">
            <a-pagination
              :pageSizeOptions='pageSizeOptions'
              v-model="pagination.page"
              :pageSize="pagination.size"
              :total="pagination.total"
              :show-total="() => `共 ${pagination.total} 条`"
              show-size-changer
              :show-quick-jumper="pagination.total >= 500 ? true : false"
              @showSizeChange="paginationSize"
              @change="paginationPage"
            />
          </div>
        </div>
      </div>
      <div class="tableContainer">
        <p class="pTittle fontWeight">结算单明细列表</p>
        <div class="flex-sb heightDiv">
          <a-button-group>
            <a-button icon="ordered-list" :type="whichData == 'order' ? 'primary' : ''" @click="changeData('order', 1)"> 按订单查看 </a-button>
            <a-button icon="shopping" :type="whichData == 'item' ? 'primary' : ''" @click="changeData('item', 2)"> 按商品查看 </a-button>
          </a-button-group>
          <a-button-group>
            <a-button class="a-btn" type="primary" icon="sync" title="刷新数据" @click="redo"></a-button>
            <a-button class="a-btn" type="primary" icon="fullscreen" title="全屏" @click="fullScreenBtn"></a-button>
            <checkboxList v-model="mainColumns" width="280" />
          </a-button-group>
        </div>
        <a-table
          bordered
          :scroll="{ x: 307.778, y: total < 20 ? 0 : 1300 }"
          :columns="mainColumns"
          :data-source="tableData" rowKey="id"
          :pagination='tableData.length > 19 ? {showTotal: ()=>`共 ${tableData.length} 条`,showSizeChanger: true,showQuickJumper: tableData.length > 1000} : false'
        >
          <span slot="inputTaxRate" slot-scope="text,record">
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':''}}{{record.invoiceType==3?'抵扣率':record.invoiceType==1||record.invoiceType==2?'税率':''}}
            {{ record.inputTaxRate+'%' }}
          </span>
          <template tips='合计' slot="footer" slot-scope="currentPageData">
            本页合计：
            <span v-for="(item, j) in footerTotal" :key="item.name">
              <span class="greyfont">{{item.name}}</span>
              &lt;<span class="redfont">{{ currentPageData.reduce((t, c) => formatPrice(+t + +c[item.value]), 0) }}</span>&gt;
              <a-divider v-show="j != footerTotal.length - 1" type="vertical" />
            </span>
          </template>
        </a-table>
      </div>
      <div class="divBorder marginBottom">
        <p class="pTittle fontWeight">费用项列表</p>
        <a-table
          bordered
          :scroll="{ x: 300, y: costTableData.length < 11 ? 0 : 1300 }"
          :columns="costColumns" :data-source="costTableData" rowKey="id"
          :pagination='false'
        >
          <template tips='费用类型' slot="feeType" slot-scope="text, record">
            <span>{{record.feeType == 1 ? '国内' : record.feeType == 2 ? '国际' : '其他'}}</span>
          </template>
         <span slot-scope="text,record" slot="rate">
            {{record.invoiceBusinessType==0?'应税 -':record.invoiceBusinessType==1?'免税 -':''}}
            {{record.invoiceType==1?'普票 -':record.invoiceType==2?'专票 -':record.invoiceType==3?'普票(免税) -':
            record.invoiceType==4?'进口增值税 -':record.invoiceType==5?'进口关税 -':''}}
            {{record.invoiceType==3?'抵扣率':[1,2,4,5].includes(record.invoiceType)?'税率':''}}
            {{ record.rate+'%' }}
          </span>
          <template slot="footer">
            <div>
              费用项合计 : {{totalFee}}
            </div>
          </template>
        </a-table>
      </div>
      <div class="flex-ed">
        <a-button class="bottomMargin" v-show="flag == 'edit'&&this.headMsg.poType!=2" type="primary" @click="okSettlement">确认结算</a-button>
        <a-button class="bottomMargin" v-show="flag == 'edit'&&this.headMsg.poType==2" @click="globalOrderSettle(5)" :loading='loadingPre'>预估结算</a-button>
        <a-button class="bottomMargin" v-show="flag == 'edit'&&this.headMsg.poType==2" type="primary" :loading='loadingFact' @click="globalOrderSettle(3)">实际结算</a-button>
      </div>
    </div>
    <div style="position: fixed; bottom: 64px; right: 42px; z-index: 999999;">
      <a-space :size='10'>
        <a-button type="primary" shape="circle" icon="up" @click="scrollTop" />
        <a-button type="primary" shape="circle" icon="close" @click="changeComp" />
      </a-space>
    </div>
  </div>
</template>

<script>
import {
  dataList,
  getImgURL,
  transferFile,
  deleteFile,
  saveFile,
  details,
  settlement,
  getIds,
  contract,
  SettlementForGlobal
} from '@/services/settlement/payable/clearingAccountsNeedpay'
import {
  selectOption,
  search,
  clear
} from '@/services/settlement/receive/bankFlow'
import moment from "moment";
import { throttle } from "../../utils/tool";
import { partnerType } from "@/services/userMa.js";
const mainColumns = [
  {title: "序号", dataIndex: "indexId", width: 80},
  {title: "单据号", dataIndex: "poCode", width: 220},
  {title: "商品名称", dataIndex: "itemName", width: 220},
  {title: "商品编码", dataIndex: "itemCode", width: 160},
  {title: "规格", dataIndex: "itemSpecName", width: 140},
  {title: "数量", dataIndex: "qty", width: 140},
  {title: "单位", dataIndex: "priceUnit", width: 140},
  {title: "单价", dataIndex: "price", width: 140},
  {title: "商品金额", dataIndex: "itemAmount", width: 140},
  {title: "包装费+人工费", dataIndex: "otherAmount", width: 140},
  {title: "总金额", dataIndex: "settlementAmount", width: 140},
  {title: "增值税", dataIndex: "inputTaxRate", width: 200, scopedSlots: { customRender: "inputTaxRate" }},
]
const costColumns = [
  {title: "费用类型", dataIndex: "feeType", width: 180, scopedSlots: { customRender: "feeType" }},
  {title: "费用项", dataIndex: "feeName", width: 180},
  {title: "收款主体", dataIndex: "receivingSubjectName", width: 260},
  {title: "费用金额",dataIndex: "feeAmount", width: 180},
  {title: "增值税", dataIndex: "rate", width: 200,scopedSlots: { customRender: "rate" }},
  {title: "不含税金额", dataIndex: "priceExcludingTax", width: 240},
  {title: "币种", dataIndex: "currency", width: 160},
  {title: "汇率", dataIndex: "exchangeRate", width: 160},
  {title: "外币金额", dataIndex: "foreignCurrencyAmount", width: 240},
  {title: "人民币金额", dataIndex: "currencyAmount", width: 240},
  {title: "清关单号", dataIndex: "customsClearanceFeeNumber", width: 280},
  {title: "备注", dataIndex: "remark", width: 280},
]
const columns = [
  {title: "交易时间", dataIndex: "transDatetime", width: 180},
  {title: "关联状态", dataIndex: "status", width: 160, scopedSlots: {customRender: "status"}},
  {title: "付款方式", dataIndex: "paymentMethod", width: 120, scopedSlots: {customRender: "paymentMethod"}},
  {title: "已关联流水金额", dataIndex: "noRefrenceMoney", width: 150},
  {title: "未关联流水金额", dataIndex: "surplusTransAmount", width: 150},
  {title: "关联账单", dataIndex: "relatedBill", width: 260, scopedSlots: {customRender: "relatedBill"}},
  {title: "本方组织", dataIndex: "orgName", width: 260},
  {title: "本方账户银行", dataIndex: "bankName", width: 260},
  {title: "本方账户户名", dataIndex: "accountName", width: 260},
  {title: "本方账户账号", dataIndex: "accountNumber", width: 260, scopedSlots: {customRender: "accountNumber"}},
  {title: "币种", dataIndex: "currencyCode", width: 120},
  {title: "收入", dataIndex: "income", width: 150},
  {title: "支出", dataIndex: "outcome", width: 150},
  {title: "对方账户户名", dataIndex: "oppAccName", width: 260},
  {title: "对方账户账号", dataIndex: "oppAccNo", width: 320, scopedSlots: {customRender: "oppAccNo"}},
  {title: "对方开户行", dataIndex: "oppBank", width: 320},
  {title: "银行流水号", dataIndex: "bankSerialNumber", width: 240},
  {title: "用途", dataIndex: "purpose", width: 260},
  {title: "摘要", dataIndex: "description", width: 160},
  {title: "备注", dataIndex: "noteAppended", width: 260},
  {title: "文件名", dataIndex: "fileName", width: 300, scopedSlots: {customRender: "fileName"}},
  {title: "上传人", dataIndex: "uploadUser", width: 160},
  {title: "上传时间", dataIndex: "uploadDate", width: 180},
]
export default {
  name: "modalDetails",
  data() {
    return {
      flag: 'details',
      whichData: 'order',
      mainColumns,
      costColumns,
      columns,
      dataType: undefined,
      contractOption: [],
      headMsg: {
        id: undefined,
        apInvoiceCode: undefined,
        supplierName: undefined,
        companyBalance: undefined,
        settlementAmount: undefined,
        payType: undefined,
        currency: undefined,
        payAmount: undefined,
        state: undefined,
        opName: undefined,
        surplusPayAmount: undefined,
        noPayAmount: undefined,
        discountAmount: undefined,
        remark: undefined,
        version: undefined,
        containerCode: undefined,
        capitalIds: [],
      },
      id: undefined,
      footerTotal: [
        {name: '数量', value: 'qty'},
        {name: '商品金额', value: 'itemAmount'},
        {name: '包装费', value: 'otherAmount'},
        {name: '总金额', value: 'settlementAmount'}
      ],
      option: {
        moneyOption: [],
        payWayOption: []
      },
      tableData: [],
      imgData: [],
      costTableData: [],
      fullScreen: true,
      selectedRowKeys: [],
      previewImg: undefined,
      disabledFlage: 0,
      total: 0,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fd: new FormData(),
      imgObj: new Image(),
      form: {},
      dataTable: [],
      loading: !1,
      optionx: {
        typeFlow: [{key: '', value: "全部"},{key: "应收", value: "应收银行流水"},{key: "应付", value: "应付银行流水"}],
        referenceStatus: [{key: '', value: "全部"},{key: '0', value: "未关联"},{key: 2, value: "已关联"},{key: 1, value: "部分关联"}],
        status: ["未关联", "部分关联", "已关联"],
        accountNameList: ["全部"],
        bankNameList: ["全部"],
        oppAccNameList: ["全部"],
        paymentList: [{id: 2, name: '周期结算'}] //{id: 1, name: '现结'},
      },
      dataInType: [1,3,4,'',undefined],
      pageSizeOptions: ['10','20','50','100'],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
      },
      copyParams: undefined,
      selectedRowKeysx: [],
      agencyList:[],
      loadingFact:false,
      loadingPre:false,
    }
  },
  computed: {
    noPayAmount() {
      return this.formatPrice((+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmount || 0) - (+this.headMsg.discountAmount || 0) - (+this.headMsg.surplusPayAmount || 0) - (+this.headMsg.payAmounted || 0))
    },
    referenceMoney() {
      let money = []
      this.selectedRowKeys.forEach((item) => {
        this.dataTable.forEach((val) => { item == val.id && money.push(val.surplusTransAmount) })
      })
      return money.reduce((t, c) => this.formatPrice(t + (+c || 0)), 0)
    },
    referenceIncome() {
      let money = []
      this.selectedRowKeys.forEach((item) => {
        this.dataTable.forEach((val) => { val.transWay == "收入" && item == val.id && money.push(val.income) })
      })
      return money.reduce((t, c) => this.formatPrice(t + (+c || 0)), 0)
    },
    totalFee() {
      return this.costTableData.reduce((t, c) => { return this.formatPrice(t + (+c.feeAmount || 0),2 ) }, 0) || "-"
    },
  },
  methods: {
    globalAmountCompute(){
      this.headMsg.surplusPayAmount=this.formatPrice((+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmount || 0) - (+this.headMsg.discountAmount || 0))
      if (this.headMsg.poType==2) {
        this.headMsg.predictAmount = this.formatPrice(this.headMsg.surplusPayAmount*(+this.headMsg.exchangeRate||1))
        this.headMsg.predictAmountTwo = (parseInt(this.headMsg.predictAmount*100)/100).toFixed(2)||''
        this.getGlobalCompute(this.headMsg.actualExchangeRate||'')
      }
      this.$forceUpdate()
    },
    globalOrderSettle(state){
      console.log(this.referenceMoney);
      if ((+this.headMsg.discountAmount||0)-((+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmount || 0))>0) {
        this.$message.info('折扣金额超过限制请核对！')
        return
      }
      if (this.referenceMoney<this.headMsg.predictAmount) {
          this.$message.info('已选择的关联流水金额需大于等于预估人民币金额')
          return
      }
      if (this.headMsg.actualExchangeRate===0) {
        this.$message.info('请输入正确汇率！',3)
        return
      }
      if (state==3&&(!this.headMsg.actualExchangeRate||this.headMsg.actualExchangeRate<=0)) {
        this.$message.info('若实际结算必须填写实际汇率且大于零',3)
        return
      }
      let temp={
        id:undefined,surplusPayAmount:undefined,payType:undefined,currency:undefined,payAmount:undefined,
        discountAmount:undefined,remark:undefined,version:undefined,payAmounted:undefined,
        agencyId:undefined,agencyName:undefined,predictAmount:undefined,actualAmount:undefined,
        handlingFee:undefined,cableFee:undefined,actualExchangeRate:undefined,balanceAmount:undefined,predictAmountTwo:undefined,
      }
      let data={}
      Object.keys(temp).forEach((key)=>{
          data[key]=this.headMsg[key]
      })
      let params=JSON.parse(JSON.stringify(data))
      params.state=state
      params.capitalIds=this.selectedRowKeys
      params.noPayAmount=0
      this.loadingFact=state==3?true:false
      this.loadingPre=state==5?true:false
      SettlementForGlobal(params).then(res=>{
        state==5&&(this.loadingPre=false)
        state==3&&(this.loadingFact=false)
          if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else { this.$message.error(res.data.message) }
      }).catch(e => {
        state==5&&(this.loadingPre=false)
        state==3&&(this.loadingFact=false)
        this.$message.error("更新失败"+e, 3)})
    },
    inputSixNum(e){
      e.target.value = e.target.value.match(/^\d*(\.?\d{0,5})/g)[0] || null
    },
    //国际单相关金额计算
    getGlobalCompute(value){
      // console.log(value);
      if (value||value==0) {
        // console.log(111);
        this.headMsg.actualAmount=this.formatPrice(+this.headMsg.surplusPayAmount*+value)
        this.headMsg.balanceAmount=this.formatPrice(+this.headMsg.actualAmount- +this.headMsg.predictAmount)
        this.headMsg.actualAmountTwo=(parseInt(this.headMsg.actualAmount*100)/100).toFixed(2)||''
        this.headMsg.balanceAmountTwo=(parseInt(this.headMsg.balanceAmount*100)/100).toFixed(2)||''
      }else{
        // console.log(1);
         this.headMsg.actualAmount=''
         this.headMsg.balanceAmount=''
         this.headMsg.balanceAmountTwo=''
         this.headMsg.actualAmountTwo=''
      }
      this.$forceUpdate()
      // console.log(this.headMsg.actualAmountTwo);
    },
    agencySearch(value) {
      partnerType({partnerName:value||'', partnerType: 40, isEnable: 1}).then(res => res.data.code == '200' && (this.agencyList = res.data.data||[]))
    },
    agencyChange(option) {
      console.log(option);
      if (option==undefined) {
        this.headMsg.agencyId=''
        this.headMsg.agencyName=''
      }
      this.agencyList.forEach((item) => {
        if (option == item.id) {
          this.headMsg.agencyName = item.partnerName;
        }
      });
      this.$forceUpdate()
    },
    clearContract() {
      this.headMsg.contractId = undefined
      this.headMsg.contractTitle = undefined
      this.contract()
    },
    contract(contractTitle) {
      contract({partnerId: this.headMsg.supplierId ?? '', contractTitle}).then(res => {
        if (res.data.code == 200) {
          this.contractOption = res.data.data
        } else {
          this.contractOption.splice(0)
        }
      }).catch(() => this.contractOption.splice(0))
    },
    contractSelect(id) {
      let contractMsg = this.contractOption.find(item => item.id === id)
      this.headMsg.contractTitle = contractMsg.contractTitle
    },
    filterOption(input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0);
    },
    changeComp() { this.$parent.changeComponent() },
    scrollTop() {
      document.querySelector("#scrollTop").scrollIntoView({behavior: "smooth"});
    },
    getCurrentStyle(current, today) {
      const style = {};
      if (current.format("YY-MM-DD") == moment(today).format("YY-MM-DD")) {
        style.border = '1px solid green'
        style.borderRadius = '50%'
        style.backgroundColor = 'white'
        style.color = "green"
      }
      return style;
    },
    fouceUpdate() {
      this.$forceUpdate()
    },    async getIds(docId, docCode) {
      let ids = []
      await getIds({relateType: 2, docId, docCode}).then((res) => {
        res.data.data.forEach((item) => { ids.push(item.yocylId) })
      })
      return ids
    },
    onSelectChangex(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    onChangex(v) {
      this.form.transDatetimeStart = v[0]
      this.form.transDatetimeEnd = v[1]
    },
    resetBtn() { this.form = {
      status:undefined,
      accountName:this.form.accountName,
      bankName:undefined,
      oppAccName:this.form.oppAccName,
      paymentMethod:undefined,
      bankSerialNumber:'',
      time:[],
      transDatetimeStart:'',
      transDatetimeEnd:'',
      transWay:undefined
    } },
    strExchange(str) { return String(str || "")?.replace(/(?<=.{4}).{1}(?=.{4})/g,'*') },
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
    getExcel(res,name) {
      const link = document.createElement('a')
      const blob = new Blob([res], {type: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
      link.href = URL.createObjectURL(blob)
      link.download = name
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    exportSingle(record) {
      let aNode = document.createElement('a')
      aNode.href = record.filePath
      aNode.download = record.fileName?.slice(0,record.fileName?.lastIndexOf('.')) || "文件"
      aNode.click()
    },
    selectOption() {
      let parmas = {
        // orgId: this.headMsg.orgId,
        transWay: '支持',
        partnerId:this.headMsg.poType==2&&this.headMsg.agencyId?this.headMsg.agencyId:this.headMsg.supplierId
      }
      selectOption(parmas).then(res => {
        this.optionx.accountNameList = [...(res.data.data?.accountNameList || [])]
        this.form.accountName = this.optionx.accountNameList[0]
        this.optionx.bankNameList = ["全部", ...(res.data.data?.bankNameList || [])]
        this.optionx.oppAccNameList = ["全部", ...(res.data.data?.oppAccNameList || [])]
      })
    },
    submitBtn(flag) {
      if (flag == 'select') this.pagination.page = 1
      const params = {
        page: this.pagination.page,
        rows: this.pagination.size,
        orgId: this.headMsg.orgId,
        partnerId: this.headMsg.poType==2&&this.headMsg.agencyId?this.headMsg.agencyId:this.headMsg.supplierId,
        sort: "id",
        order: "DESC",
        ...this.form
      }
      delete params.transDatetime
      params.bankSerialNumber = params.bankSerialNumber?.trim()
      if (params.accountName == "全部") delete params.accountName
      if (params.bankName == "全部") delete params.bankName
      if (params.oppAccName == "全部") delete params.oppAccName
      this.loading = true
      if (flag) this.copyParams = this.deepClone(params)
      search(params).then((res) => {
        if (res.data.code == '200') {
          res.data.data?.list.map((item) => {
            item.noRefrenceMoney = this.formatPrice((+item.transAmount || 0) - (+item.surplusTransAmount || 0))
            item.transWay == "收入" ? item.income = item.transAmount : item.outcome = item.transAmount
          })
          this.dataTable = res.data.data?.list || []
          this.pagination.total = res.data.data?.total || 0
          this.loading = false
        } else {
          this.loading = false
          this.$message.warn('流水查询失败!'+res.data.message,5)
        }
      }).catch(() => {this.loading = false})
    },
    submitPagination() {
      if (this.copyParams) {
        this.copyParams.page = this.pagination.page
        this.copyParams.rows = this.pagination.size
      } else {
        this.copyParams = this.deepClone({
          page: this.pagination.page,
          rows: this.pagination.size,
          orgId: this.headMsg.orgId,
          partnerId: this.headMsg.supplierId,
          sort: "id",
          order: "DESC",
          ...this.form
        })
      }
      this.dataTable = []
      this.copyParams.bankSerialNumber = this.copyParams.bankSerialNumber?.trim()
      delete this.copyParams.transDatetime
      if (this.copyParams.accountName == "全部") delete this.copyParams.accountName
      if (this.copyParams.bankName == "全部") delete this.copyParams.bankName
      if (this.copyParams.oppAccName == "全部") delete this.copyParams.oppAccName
      search(this.copyParams).then((res) => {
        if (res.data.code == '200') {
          res.data.data?.list.map((item) => {
            item.noRefrenceMoney = this.formatPrice((+item.transAmount || 0) - (+item.surplusTransAmount || 0))
            item.transWay == "收入" ? item.income = item.transAmount : item.outcome = item.transAmount
          })
          this.dataTable = res.data.data?.list || []
          this.pagination.total = res.data.data?.total || 0
          this.loading = false
        } else {
          this.loading = false
          this.$message.warn('流水查询失败!'+res.data.message,5)
        }
      }).catch(() => {this.loading = false})
    },
    deleteItem(id) {
      clear({id}).then((res) => {
        if (res.data.code == '200') {
          this.submitPagination()
          this.$message.success(res.data.message, 3)
        } else {
          this.$message.warn(res.data.message, 3)
        }
      })
    },
    paginationPage(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    paginationSize(currentPage, pageSize) {
      this.pagination.page = currentPage
      this.pagination.size = pageSize
      this.submitPagination()
    },
    typeOfPicture(url) {
      return new Promise((resolve, reject) => {
        this.imgObj.src = url
        this.imgObj.onload = () => resolve("picX")
        this.imgObj.onerror = () => reject("fileN")
      })
    },
    getImgURL(id) {
      getImgURL({tableId: id, tableName: 'apInvoice'}).then(res => {
        if (res.data.code == "200") {
          res.data.data.forEach((item,i) => {
            this.fileList.push({
              uid: item.id,
              name: "picX",
              type: "image",
              size: "1000",
              url: item.filePath,
            })
            this.typeOfPicture(item.filePath).catch(e => {
              this.fileList[i].name = e
              this.fileList[i].type = "application"
            })
          })
        }
      })
    },
    getFileBase64(file){
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
          resolve(imgData)
        };
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      })
    },
    getFile(res) {
      if (!res.url) {
        this.$message.warn('找不到文件链接/路径', 3)
        return
      }
      const link = document.createElement('a')
      link.href = res.url
      link.download = res.name || 'anonymous'
      link.click()
      window.URL.revokeObjectURL(link.href)
    },
    async handlePreview(file) {
      if (file.name?.match(/\.pdf|\.docx|\.doc|\.xlsx|\.xls|\.txt/g) != null || file.type?.includes("application")) {
        this.getFile(file)
        return
      }
      if (!file.url && !file.preview) {
        file.preview = await this.getFileBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    changeFile(file) {
      if (file.file.status === "uploading") return
      this.fileList.forEach((item, i) => {
        if (file.file.status === "removed" && file.file.url == item.url && file.file.uid == item.uid) {
          this.fd.set("id", item.uid)
          deleteFile(this.fd).then(res => {
            res.data.code == "200" ?
            (this.$message.success("删除文件成功"), this.fileList.splice(i, 1)) :
            this.$message.error("删除文件失败")
          }).catch(() => this.$message.error("删除文件失败"))
        }
      })
    },
    beforeUpload(file) {
      let fd = new FormData()
      fd.set("file", file)
      fd.set("mode", "batch")
      fd.set("tableId", this.headMsg.id)
      fd.set("tableName", "apInvoice")
      transferFile(fd).then(res => {
        if (res.data.code == "200") {
          this.saveFile(res.data.data[0].filePath)
          this.fileList.push({
            uid: this.fileList.length,
            url: res.data.data[0].filePath,
            name: res.data.data[0].fileName,
            size: res.data.data[0].fileSize,
            type: res.data.data[0].fileType,
          })
        }
      }).catch(() => this.$message.warn('获取上传文件记录失败'))
    },
    saveFile(url) {
      const params = {
        tableId: this.headMsg.id,
        tableName: "apInvoice",
        fileUrlList: [url]
      }
      saveFile(params).then(res => res.data.code == "200" && this.$message.success("上传文件成功"))
    },
    details(id, type = 1) {
      let parmas = {
        id: id,
        sort: 'id',
        order: 'desc',
        apInvoiceCodeState: type,
      }
      details(parmas).then(res => {
        if (res.data.code == 200) {
          res.data.data.apInvoiceDetails.forEach((item, i) => item.indexId = i + 1)
          this.tableData = res.data.data.apInvoiceDetails || []
          this.costTableData = res.data.data.apInvoiceFeeList || []
        }
      }
      ).catch(() => this.$message.error("查看待结算列表详情失败") )
    },
    changeData(flag, type) {
      this.whichData = flag
      this.details(this.id, type)
    },
    openModal(flag = 'details', record) {
      this.selectedRowKeys = []
      this.tableData = []
      this.headMsg.capitalIds = []
      this.fileList = []
      this.flag = flag
      this.whichData = 'order'
      this.dataType = undefined
      this.dataType = record.dataType
      this.headMsg.id = record.id,
      this.headMsg.apInvoiceCode = record.apInvoiceCode,
      this.headMsg.supplierName = record.supplierName,
      this.headMsg.companyBalance = record.companyBalance,
      this.headMsg.settlementAmount = record.settlementAmount,
      this.headMsg.payType = this.typeis(record.payType) == 'number' ? "" + record.payType : record.payType,
      this.headMsg.currency =record.currency||'' 
      record.poType==1&&(this.headMsg.currency=1)
      this.headMsg.payAmount = record.payAmount,
      this.headMsg.state = record.state,
      this.headMsg.opName = record.opName,
      this.headMsg.surplusPayAmount = this.dataInType.includes(record.dataType) ? (record.surplusPayAmount || 0) : record.payAmount,
      this.headMsg.noPayAmount = this.formatPrice((+record.settlementAmount || 0) - (+record.payAmount || 0) - (+record.discountAmount || 0) - (+record.surplusPayAmount || 0) - (+record.payAmounted || 0)),
      this.headMsg.payAmounted = record.payAmounted,
      this.headMsg.discountAmount = record.discountAmount,
      this.headMsg.remark = record.remark,
      this.headMsg.version = record.version,
      this.headMsg.containerCode = record.containerCode,
      this.headMsg.orgId = record.orgId,
      this.headMsg.supplierId = record.supplierId,
      this.headMsg.contractId = record.contractId
      this.headMsg.contractTitle = record.contractTitle
      this.headMsg.poType = record.poType||''
      if (record.poType&&record.poType==2) {
        this.agencySearch('')
          //国际单流程
      this.headMsg.exchangeRate=record.exchangeRate||''
      this.headMsg.surplusPayAmount=this.dataType==2?this.headMsg.payAmount:this.formatPrice((+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmount || 0) - (+this.headMsg.discountAmount || 0))
      this.headMsg.agencyId = record.agencyId||''
      this.headMsg.agencyName = record.agencyName||''
      // this.headMsg.predictAmount = record.predictAmount||''
      this.headMsg.predictAmount = this.formatPrice(this.headMsg.surplusPayAmount*(+record.exchangeRate||1))
      console.log(this.headMsg.predictAmount);
      this.headMsg.predictAmountTwo = record.predictAmountTwo||(parseInt(this.headMsg.predictAmount*100)/100).toFixed(2)||''
      console.log(this.headMsg.predictAmountTwo);
      this.headMsg.actualAmount = record.actualAmount||''
      this.headMsg.handlingFee = record.handlingFee||''
      this.headMsg.cableFee = record.cableFee||''
      this.headMsg.actualExchangeRate = record.actualExchangeRate||''
      this.headMsg.balanceAmount = record.balanceAmount||''
      this.headMsg.actualAmountTwo=(parseInt(this.headMsg.actualAmount*100)/100).toFixed(2)||''
      this.headMsg.balanceAmountTwo=(parseInt(this.headMsg.balanceAmount*100)/100).toFixed(2)||''
      this.headMsg.noPayAmount=0;
      }
      this.id = record.id
      if (record.dataType != 4) {
        if ((record.payAmount > 0 && record.dataType == 2) || (record.settlementAmount > 0 && this.dataInType.includes(record.dataType))){
          this.form.transWay = '支出'
        } else {
          this.form.transWay = '收入'
        }
      }
      this.getIds(record.id, record.apInvoiceCode).then((val) => {this.selectedRowKeys = val})
      this.details(record.id)
      this.getImgURL(record.id)
      this.submitBtn('select')
      this.selectOption()
    },
    redo() { this.details(this.id, this.whichData == 'order' ? 1 : 2) },
    fullScreenBtn() { this.fullScreen = !this.fullScreen },
    onSelectChange(selectedRowKeys) { this.selectedRowKeys = selectedRowKeys },
    throttleOKOkSettlement: throttle(function() {
      // if (this.isUndef(this.headMsg.contractId)) {
      //   this.$message.error("请选则关联合同", 3)
      //   return
      // }
      //! glht
      let goDo = (this.dataType == 3 || this.dataType == 4) && this.headMsg.settlementAmount < 0
      var result, danju, benci
      if ((this.headMsg.payAmount > 0 && this.dataType == 2) || (this.headMsg.settlementAmount > 0 && this.dataInType.includes(this.dataType))){
        result = '支出'
      } else {
        result = '收入'
      }
      if (result != this.form.transWay && this.dataType != 4) {
        this.$message.warn(`当前结算关联的是${this.form.transWay || ''}流水`)
      }
      if (this.selectedRowKeys.length == 0) {
        this.$message.error('请至少关联一条流水', 3.5)
        return
      }
      if (goDo) {
        let limit = this.headMsg.settlementAmount - this.headMsg.payAmount - this.headMsg.payAmounted
        if (this.headMsg.surplusPayAmount > this.formatPrice(limit)) {
          this.$message.error("本次结算金额不能大于未付金额")
          return
        }
      }
      if (this.dataType != 2) {
        danju = this.headMsg.settlementAmount
        benci = this.headMsg.surplusPayAmount
      }
      if ((danju > 0 && danju < benci) || (danju < 0 && danju > benci)) {
        this.$message.error('请核对本次结算金额，不得超过单据金额！')
        return
      }
      let money = this.dataType == 2 ? (+this.headMsg.payAmount || 0) - (+this.headMsg.payAmounted || 0) : (+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmounted || 0) - (+this.headMsg.payAmount || 0)
      if ((this.dataType == 2 && this.referenceMoney < this.formatPrice(money)) || this.referenceMoney < this.formatPrice(money)) {
        this.$message.error("银行流水关联数据需大于等于单据金额减去已付金额，尾款单则需再减去预付款", 3.5)
        return
      }
      if (this.dataType == 4 && this.headMsg.noPayAmount != this.headMsg.surplusPayAmount) {
        this.$message.error(`退款、尾款类型结算单的本次结算金额必须等于未付金额${this.headMsg.noPayAmount}`, 3.5)
        return
      }
      if (goDo && this.headMsg.surplusPayAmount >= 0) {
        this.$message.error("单据金额为负数的退款、尾款退款结算单的本次结算金额只能为负数")
        return
      }
      if (goDo && this.formatPrice(Math.abs(this.headMsg.surplusPayAmount)) > this.formatPrice(this.referenceIncome)) {
        this.$message.error("关联流水收入金额之和必须大于或等于本次结算结算金额的绝对值,当前关联流水收入金额之和为"+this.formatPrice(this.referenceIncome))
        return
      }
      const params = {
        id: this.headMsg.id,
        noPayAmount: this.formatPrice((+this.headMsg.settlementAmount || 0) - (+this.headMsg.payAmount || 0) - (+this.headMsg.discountAmount || 0) - (+this.headMsg.surplusPayAmount || 0) - (+this.headMsg.payAmounted || 0)),
        surplusPayAmount: this.headMsg.surplusPayAmount,
        payType: this.headMsg.payType,
        currency: this.headMsg.currency,
        payAmount: this.headMsg.payAmount,
        discountAmount: this.headMsg.discountAmount,
        remark: this.headMsg.remark,
        version: this.headMsg.version,
        payAmounted: this.headMsg.payAmounted,
        capitalIds: this.selectedRowKeys
      }
      if (this.dataType == 2) params.noPayAmount = 0
      if (params.noPayAmount < 0 && !goDo) {
        this.$message.error("未付金额不能小于0", 3)
        return
      }
      settlement(params).then(res => {
        if (res.data.code == 200) {
          this.changeComp()
          this.$message.success(res.data.message)
        } else { this.$message.error(res.data.message) }
      }).catch(e => this.$message.error("更新失败"+e, 3))
    },3500),
    okSettlement() {
      this.throttleOKOkSettlement()
    },
    dataList(type) {
      dataList({type: type}).then(res => type == 14 ? this.option.moneyOption = res.data.data : this.option.payWayOption = res.data.data)
    },
    triggerFun() {
      this.openModal(this.$parent.subPageFlag, this.$parent.dataSubPage)
    }
  },
  activated() {
    this.triggerFun();
    [14, 28].forEach(item => this.dataList(item))
  },
}
</script>

<style lang="less" scoped>
@import '../../assets/css/commonless';
.modalTop{
  .formItemStyle {
    float: left;
    margin-left: 10px;
    .ant-button {
      margin-right: 10px;
    }
  }
  .formItemStylewidth {
    width: 18.3%;
    min-width: 194.89px;
    max-width: 300px;
  }
  .dateWidth {
    width: 360px;
  }
  .ant-row .ant-form-item {
    margin-bottom: 0;
  }
  .tableInfo {
    .ant-btn-link{
      margin: 0;padding: 0px 4px;
    }
    .ant-btn > .anticon + span {
      margin-left: 0;
    }
    .dividerStyle {
      background-color: #525252;
    }
  }
  .paginationContainer{
    margin: 10px 8px 10px 0;
  }
  .modalContainer {
    margin-bottom: 10px;
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
    .bgc {
      border: 0;
      font-size: 18px;
      background-color: #009b00;
      color: white;
    }
    .divBorder {
      border: @border-color;
      .rowMarginTop {
        padding: 5px 20px;
        .widthMargin {
          width: 100%;
        }
        .widthMarginFull {
          width: 100%;
        }
        .paddingLeft {
          padding-left: 20px;
        }
        .heightBgc {
          display: -webkit-box;
          min-height: 32px;
          max-height: 104px;
          font-size: 14px;
          line-height: 1.4;
          padding: 4px 11px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          background-color: #f5f5f5;
          cursor: not-allowed;
          color: #00000040;
          pointer-events: none;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 5;
          -webkit-box-orient: vertical;
          word-break: break-all;
        }
      }
    }
    .marginBottom {
      margin-bottom: 10px;
    }
    .tableContainer {
      margin: 10px 0;
      border: @border-color;
      .ant-btn-link{
        margin: 0;padding: 0px 4px;
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
    .bottomMargin {
      margin-left: 10px;
    }
  }
}
</style>