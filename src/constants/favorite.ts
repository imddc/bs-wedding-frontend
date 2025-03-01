export const FAVORITE_TABLE_COLUMNS = [
  {
    title: 'ID',
    key: 'id',
    sorter: true,
    width: 100,
  },
  {
    title: '用户ID',
    key: 'userId',
    sorter: true,
    width: 150,
  },
  {
    title: '商家ID',
    key: 'merchantId',
    sorter: true,
    width: 150,
  },
  {
    title: '收藏时间',
    key: 'createTime',
    sorter: true,
    width: 200,
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
  },
]

export const INITIAL_QUERY_PARAMS = {
  current: 1,
  size: 10,
}

export const PAGINATION_CONFIG = {
  pageSizes: [10, 20, 50, 100],
  showSizePicker: true,
  showQuickJumper: true,
  pageSlot: 7,
}
