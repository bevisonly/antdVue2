// 基础客户数据查询，20：客户；21：客户实体；22：客户门店;30：供应商;40：代理公司
export const PARTNER_STRATEGY = {
  SUPPLIER: partner => partner.partnerType === 30,
  AGENCY: partner => partner.partnerType === 40
}
