import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ExtensionPoint } from 'render'

/**
 * ShelfItem Component. Normalizes the item received in the props
 * to adapt to the extension point prop.
 */
class ShelfItem extends Component {
  normalizeProduct(product) {
    if (!product) return null
    const newProduct = { ...product }
    if (newProduct.items && newProduct.items.length) {
      newProduct.sku = { ...newProduct.items[0] }
      if (newProduct.sku.sellers && newProduct.sku.sellers.length) {
        newProduct.sku.seller = newProduct.sku.sellers[0]
      } else {
        newProduct.sku.seller = {
          commertialOffer: {
            Price: 0,
            ListPrice: 0,
          },
        }
      }
      if (newProduct.sku.images && newProduct.sku.images.length) {
        newProduct.sku.image = { ...newProduct.sku.images[0] }
        newProduct.sku.image.imageUrl = newProduct.sku.image.imageUrl.replace('http:', '').replace('https:', '')
      }
      if (newProduct.sku.referenceId && newProduct.sku.referenceId.length) {
        newProduct.sku.referenceId = (newProduct.sku.referenceId && newProduct.sku.referenceId[0]) || {
          Value: '',
        }
      }
      delete newProduct.sku.sellers
      delete newProduct.sku.images
      delete newProduct.items
    }
    return newProduct
  }

  render() {
    const { item, extensionId } = this.props
    return (
      <ExtensionPoint id={extensionId} product={this.normalizeProduct(item)}>
      </ExtensionPoint>
    )
  }
}

ShelfItem.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    productName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    link: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
    brand: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      referenceId: PropTypes.arrayOf(PropTypes.shape({
        Value: PropTypes.string.isRequired,
      })),
      images: PropTypes.arrayOf(PropTypes.shape({
        imageUrl: PropTypes.string.isRequired,
        imageTag: PropTypes.string.isRequired,
      })).isRequired,
      sellers: PropTypes.arrayOf(PropTypes.shape({
        commertialOffer: PropTypes.shape({
          Price: PropTypes.number.isRequired,
          ListPrice: PropTypes.number.isRequired,
        }).isRequired,
      })).isRequired,
    })).isRequired,
  }),
  extensionId: PropTypes.string.isRequired,
}

export default ShelfItem
