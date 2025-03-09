import { EditIcon, EyeIcon, TrashIcon } from 'lucide-vue-next'
import { NButton, NImage, NPopconfirm, NSpace, NSwitch } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { h } from 'vue'
import type { Product } from '~/api/product/type'
import { PRODUCT_STATUS } from '~/constants/product'

interface CreateColumnsProps {
  handleStatusChange: (id: number, status: number) => void
  handleView: (row: Product) => void
  handleEdit: (row: Product) => void
  handleDelete: (id: number) => void
}

export function createColumns({
  handleStatusChange,
  handleView,
  handleEdit,
  handleDelete,
}: CreateColumnsProps): DataTableColumns {
  return [
    { type: 'selection' },
    {
      title: 'ID',
      key: 'id',
      width: 80,
    },
    {
      title: '商品图片',
      key: 'mainImage',
      width: 100,
      render(row: Product) {
        return row.mainImage
          ? h(NImage, {
              width: 60,
              height: 60,
              src: row.mainImage,
              objectFit: 'cover',
              fallbackSrc: 'https://via.placeholder.com/60',
              previewDisabled: false,
            })
          : h('span', {}, () => '无图片')
      },
    },
    {
      title: '商品名称',
      key: 'productName',
      width: 200,
    },
    {
      title: '商品类型',
      key: 'productTypeName',
      width: 100,
    },
    {
      title: '价格',
      key: 'price',
      width: 100,
      render(row) {
        return `￥${row.price}`
      },
    },
    {
      title: '评分',
      key: 'rating',
      width: 80,
    },
    {
      title: '库存',
      key: 'stock',
      width: 80,
    },
    {
      title: '销量',
      key: 'sales',
      width: 80,
    },
    {
      title: '地址',
      key: 'location',
      width: 150,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render(row: Product) {
        return h(
          NSwitch,
          {
            value: row.status === PRODUCT_STATUS.ON_SHELF,
            checkedValue: true,
            uncheckedValue: false,
            onUpdateValue: (value) => {
              handleStatusChange(row.id, value ? PRODUCT_STATUS.ON_SHELF : PRODUCT_STATUS.OFF_SHELF)
            },
          },
          {
            checked: () => '上架',
            unchecked: () => '下架',
          },
        )
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'actions',
      width: 180,
      fixed: 'right',
      render(row: Product) {
        return h(NSpace, { justify: 'center' }, {
          default: () => [
            h(
              NButton,
              {
                type: 'info',
                size: 'small',
                onClick: () => handleView(row),
              },
              {
                default: () => h(EyeIcon, { size: 14 }),
              },
            ),
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => handleEdit(row),
              },
              {
                default: () => h(EditIcon, { size: 14 }),
              },
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row.id),
              },
              {
                default: () => '确定删除该商品吗？',
                trigger: () =>
                  h(
                    NButton,
                    {
                      type: 'error',
                      size: 'small',
                    },
                    {
                      default: () => h(TrashIcon, { size: 14 }),
                    },
                  ),
              },
            ),
          ],
        })
      },
    },
  ]
}
