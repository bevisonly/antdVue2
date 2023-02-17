export const columns = [
  { title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center' },
  { title: '客户名称', dataIndex: 'customerName', width: 300, align: 'center' },
  { title: '归属部门', dataIndex: 'partner', width: 200, align: 'center' },
  { title: '业务单元', dataIndex: 'opName', width: 200, align: 'center' },
  { title: '业务负责人', dataIndex: 'manager', width: 200, align: 'center' },
  {
    title: '欠款总金额',
    dataIndex: 'noYocylAmounts',
    width: 200,
    align: 'center'
  },
  {
    title: '未逾期金额',
    dataIndex: 'creditPeriodAmounts',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期1个月内金额',
    dataIndex: 'overdueOneMonthAmounts',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期1~2个月内金额',
    dataIndex: 'overdueTwoMonthsAmounts',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期2~3个月内金额',
    dataIndex: 'overdueThreeMonthsAmounts',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期3个月以上金额',
    dataIndex: 'overdueOverThreeMonthsAmounts',
    width: 200,
    align: 'center'
  }
]
