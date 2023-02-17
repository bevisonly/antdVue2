export const columns = [
  { title: '序号', dataIndex: 'indexAsc', width: 80, align: 'center' },
  { title: '客户编号', dataIndex: 'customerCode', width: 200, align: 'center' },
  { title: '客户名称', dataIndex: 'customerName', width: 300, align: 'center' },
  { title: '业务类型', dataIndex: 'opName', width: 200, align: 'center' },
  {
    title: '订单编号',
    dataIndex: 'docNo',
    width: 200,
    align: 'center'
  },
  {
    title: '应收账款发生额',
    dataIndex: 'receivabledAmount',
    width: 150,
    align: 'center'
  },
  {
    title: '应收账款确认日',
    dataIndex: 'receivableConfirmationDate',
    width: 150,
    align: 'center'
  },
  {
    title: '信用期(天)',
    dataIndex: 'creditPeriod',
    width: 150,
    align: 'center'
  },
  {
    title: '约定收款日',
    dataIndex: 'agreedCollectionDate',
    width: 150,
    align: 'center'
  },
  {
    title: '回款金额',
    dataIndex: 'returnAmount',
    width: 150,
    align: 'center'
  },
  {
    title: '回款日',
    dataIndex: 'returnDate',
    width: 150,
    align: 'center'
  },
  {
    title: '回款天数',
    dataIndex: 'returnDays',
    width: 150,
    align: 'center'
  },
  {
    title: '逾期天数',
    dataIndex: 'overdueDays',
    width: 150,
    align: 'center'
  },
  {
    title: '信用期内支付',
    dataIndex: 'creditPeriodAmount',
    width: 150,
    align: 'center'
  },
  {
    title: '逾期30天内支付',
    dataIndex: 'overdueOneMonthAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期30天~60天内支付',
    dataIndex: 'overdueTwoMonthsAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期60天~90天内支付',
    dataIndex: 'overdueThreeMonthsAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期90天~120天内支付',
    dataIndex: 'overdueFourMonthsAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期120天~150天内支付',
    dataIndex: 'overdueFiveMonthsAmount',
    width: 200,
    align: 'center'
  },
  {
    title: '逾期150天后支付',
    dataIndex: 'overdueOverFiveMonthsAmount',
    width: 200,
    align: 'center'
  }
]
