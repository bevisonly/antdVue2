//跨域代理前缀

// const BASE_URL = "https://saas.diligrp.com"
//const BASE_URL = "http://192.168.130.89:8089"
// const BASE_URL = process.env.VUE_APP_API_BASE_URL
// const BASE_URL = "http://saas.diligrp.com:8089"
//const API_PROXY_PREFIX = '/api'
//const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIXmodule.exports = {
  //登录
  module.exports ={ LOGIN: `/Oauth/authorization.api`,
  //登出
  LOGOUT:`/login/loginOut.action`,
  //查询
 // FUNAUTHLIST: `${BASE_URL}/resource/listResourceTree.action`,
  FUNAUTHLIST: `/resource/listResourceTree.action`,
  //查询角色的权限
  //ROLEPERMISSIONLIST: `${BASE_URL}/resource/listResourceTreeByRoleId.action`,
  ROLEPERMISSIONLIST: `/resource/listResourceTreeByRoleId.action`,

  //新增
 // FUNAUTHADD: `${BASE_URL}/resource/insert.action`,
  FUNAUTHADD: `/resource/insert.action`,

  //删除
 // FUNAUTHDEL: `${BASE_URL}/resource/delete.action`,
  FUNAUTHDEL: `/resource/delete.action`,

  //修改
 // FUNAUTHUPDATE: `${BASE_URL}/resource/update.action`,
  FUNAUTHUPDATE: `/resource/update.action`,
  //--------------------

  //--------------------角色管理的api--------------------------------------
  // 查询角色
  //SEARCHROLE: `${BASE_URL}/role/list.action`,
  SEARCHROLE: `/role/list.action`,
  //新增
 // INSERTROLE: `${BASE_URL}/role/insert.action`,
  INSERTROLE: `/role/insert.action`,
  // 更新
//UPDATEROLE: `${BASE_URL}/role/update.action`,
  UPDATEROLE: `/role/update.action`,
  //删除
 // DELROLE: `${BASE_URL}/role/delete.action`,
  DELROLE: `/role/delete.action`,
  //分配角色权限
 // ASSIGNPERMISSION: `${BASE_URL}/role/saveRoleResource.action`,
  ASSIGNPERMISSION: `/role/saveRoleResource.action`,
  //租户查询
 // TENANTQUERY: `${BASE_URL}/opSubject/list.action`,
  TENANTQUERY: `/opSubject/list.action`,
  //查询用户角色
  //SEARCHUSERROLES: `${BASE_URL}/role/getRoleListByUserId.action`,
  SEARCHUSERROLES: `/role/getRoleListByUserId.action`,

  //-----------------------------------------------------

  //--------------------用户管理的api
  //查询uap用户
  //GETUAPUSERLIST: `${BASE_URL}/userPartnerRef/getUapUserList.action`,
  GETUAPUSERLIST: `/userPartnerRef/getUapUserList.action`,
  //分页查询账户
  //USERLISTPAGE: `${BASE_URL}/userPartnerRef/userListPage.action`,
  USERLISTPAGE: `/userPartnerRef/userListPage.action`,
  //新增账户
  //USERINSERT: `${BASE_URL}/userPartnerRef/insert.action`,
  USERINSERT: `/userPartnerRef/insert.action`,
  //启用/禁用账户
 // UPDATEUSERSTATE: `${BASE_URL}/userPartnerRef/updateUserState.action`,
  UPDATEUSERSTATE: `/userPartnerRef/updateUserState.action`,
  //修改账户
 // USERUPDATE: `${BASE_URL}/userPartnerRef/update.action`,
  USERUPDATE: `/userPartnerRef/update.action`,
  //分配角色
  //USERDISTRIBUTION: `${BASE_URL}/userPartnerRef/saveUserRole.action`,
  USERDISTRIBUTION: `/userPartnerRef/saveUserRole.action`,
  //关联账户
 // USERASSOCIATE: `${BASE_URL}/userPartnerRef/createUserFromUap.action`,
  USERASSOCIATE: `/userPartnerRef/createUserFromUap.action`,
  //查询客户门店供应商
  //PARTNERTYPE: `${BASE_URL}/partner/list.action`,
  PARTNERTYPE: `/partner/list.action`,
  // ROUTES: `/routes`

  //新增
  //TENANTADD:`${BASE_URL}/opSubject/addOpSubject.action`,
  TENANTADD: `/opSubject/addOpSubject.action`,
  //查询租户
 // TENANTSEARCH:`${BASE_URL}/opSubject/list.action`,
  TENANTSEARCH: `/opSubject/list.action`,
  //修改租户信息
 // TENANTUPDATE:`${BASE_URL}/opSubject/updateOpSubject.action`,
  TENANTUPDATE: `/opSubject/updateOpSubject.action`,
  //修改租户状态
 // TENANTCHANGE:`${BASE_URL}/opSubject/updateOpSubjectState.action`,
  TENANTCHANGE: `/opSubject/updateOpSubjectState.action`,
  //获取默认的orgid
 // TENANTGETID:`${BASE_URL}/opSubject/getDefaultOrgId.action`,
  TENANTGETID: `/opSubject/getDefaultOrgId.action`,

  //!报表管理的api--------------------------------------------------

  //导入Excel表
  REPORTIMPORTEXCEL:`/report/importExcel.action`,
  //列表查询
  REPORTFINDLIST:`/report/findList.action`,
  //下载模板
  REPORTEXPORTTEMPLATE:`/report/exportTemplate.action`,
  //导出Excel表
  REPORTEXPORT:`/report/export3.action`,
  //查询客户,门店,供应商
  PARTNERLIST:`/partner/list.action`,
  //删除
  REPORTDELETEBYID:`/report/deleteById.action`,

  //!采购需求--------------------------------------------------------

 //条件查询
 REQUIREORDERLISTPAGE:`/requireOrder/listPageWithSnoNum.action`,
 //详情
 REQUIREORDERFINDINFO:`/requireOrder/findInfo.action`,
 //详情 新接口
 REQUIREORDERNEWTRANSFERPURCHASE:`/requireOrder/newTransferPurchase.action`,
 //采购
 REQUIREORDERDOTRANSFERPURCHASE:`/requireOrder/doTransferPurchase.action`,
 //包装条件查询
 COMPONENTPACKAGE:`/component/package.action`,
 //拆单
 REQUIREORDERNEWTRANSFERPURCHASESPLIT:`/requireOrder/newTransferPurchaseSplit.action`,
 //作废
 REQUIREORDERINVALID:`/requireOrder/invalid.action`,
 //计价单位
 DICTIONARYLIST:`/dictionary/list.action`,
  //!商品规格管理----------------------------------------------------
 
  //列表查询
  ITEMSPECLISTPAGE:`/itemSpec/listPage.action`,
  //删除
  ITEMSPECDELETE:`/itemSpec/delete.action`,
  //删除(规格详细)
  ITEMSPECCHILDDELETE:`/itemSpecChild/delete.action`,
  //新增
  ITEMSPECINSERT:`/itemSpec/insert.action`,
  //规格明细
  ITEMSPECCHILDLISTPAGE:`/itemSpecChild/listPage.action`,
  //更新
  ITEMSPECUPDATE:`/itemSpec/update.action`,
  //更新(规格详细)
  ITEMSPECCHILDUPDATE:`/itemSpecChild/update.action`,
  //规格详情的新增规格
  ITEMSPECCHILDINSERT:`/itemSpecChild/insert.action`,

    //!仓库管理(报损报溢，库存盘点)------------------------------------- 

  //分页查询
  LOSSOVERFLOWGETDATA:`/lossOverflow/getData.action`,
  //新增
  LOSSOVERFLOWADD:`/lossOverflow/add.action`,
  //更新
  LOSSOVERFLOWUPDATE:`/lossOverflow/update.action`,
  //删除
  LOSSOVERFLOWDELETE:`/lossOverflow/delete.action`,
  //详情
  LOSSOVERFLOWGETLOSSOVERFLOWINFO:`/lossOverflow/getLossOverflowInfo.action`,
  //审核
  LOSSOVERFLOWUPDATESTATUS:`lossOverflow/updateStatus.action`,

  //! 库存盘点-----------------------------------------------------
  //分页
  INVENTORYSTOCKGETDATA:`/inventoryStock/getData.action`,
  //详情
  INVENTORYSTOCKGETINVENTORYSTOCKINFO:`/inventoryStock/getInventoryStockInfo.action`,
  //更新
  INVENTORYSTOCKUPDATE:`/inventoryStock/update.action`,
  //删除
  INVENTORYSTOCKDELETE:`/inventoryStock/delete.action`,
  //保存
  INVENTORYSTOCKADD:`/inventoryStock/add.action`,
  //审核
  INVENTORYSTOCKUPDATESTATUS:`/inventoryStock/updateStatus.action`,
  //商品下拉
  LOSSOVERFLOWGETITEMS:`/lossOverflow/getItems.action`,
  //仓库列表
  WAREHOUSELIST:`/warehouse/list.action`,

  //--------------------商品列表管理
  //查询分类
  SEARCHCATE: `/itemType/getAllToTree.action`,
  //分类的新增和修改
  UPDATECATE: `/itemType/saveOrUpdateItemType.action`,
  //删除分类前
  BEFOREDEL: `/item/isItemEmpty.action`,
  //删除分类
  DELCATE: `/itemType/deleteItemType.action`,
  //查询商品列表
  SEARCHITEM: `/item/listPage.action`,

  //商品的批量上下架
  UPANDDOWN: `/item/batchOnAndOffSale.action`,
  //商品作废
  INVALIDITEM: `/item/voidItem.action`,
  //商品激活
  ACTIVEITEM: `/item/activeItem.action`,
  //商品的单据上传
  // UPLOAD: `/uploadFile/doUpload.action`,
  //商品的省份数据
  PROVINCE: `/cityDto/getProvinceList.action`,
  //商品市区数据
  CITYDATA: `/cityDto/getCityOrDistrictList.action`,
  //商品计量单位
  MEASUREMENT: `/item/getItemDefUom.action`,
  //商品规格下拉
  LISTSPEC: `/item/listSpec.action`,
  //商品选择包装LIST
  PACKAGELIST: `/pack/list.action`,
  //富文本上传
  EDITORUPLOAD: `/uploadFile/doUploads.action`,
  //商品的新增
  ITEMINSERT: `/item/insert.action`,
  //商品的编辑
  ITEMUPDATE: `/item/update.action`,
  //单条商品数据
  SINGLEITEM: `/item/getItem.action`,
  //新增文件上传记录
  ADDIMG:`/uploadFile/addUploadUrl.action`,
  //获取文件上传记录
  GETIMG:`/uploadFile/getUploadList.action`,
  //客户和商家商品新增
  OTHERITEMADD:`/item/addPartner.action`,
  //客户商品列表
  CUSTOMERITEM:`/item/customItems.action`,
  //商家商品列表
  SUPPLIERITEM:`/item/supplierItemList.action`,
  // 客户和商家商品删除
  OTHERITEMDEL:`/item/deletePartner.action`,
  // 已包装列表
  PACKDATA:`/itemPackRef/getListByItemId.action`,
  // 商品的上下架
  ONSALE:`/item/onSale.action`,
  // 单据记录删除
  // ONSALE:`/uploadFile/doDeleteFile.action`,

}

