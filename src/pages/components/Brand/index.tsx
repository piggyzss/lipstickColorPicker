import React, { PureComponent } from 'react'
import { Dispatch } from 'redux'
import styled from '@emotion/styled'
import { connect } from 'umi'
import { Radio, Tag, Divider, Tooltip, Button } from 'antd'

import { BrandState } from '@/models/brand'

type BrandProps = { dispatch: Dispatch } & ReturnType<typeof mapStateToProps>

const mapStateToProps = (state: {
  brand: BrandState;
}) => ({
  lipstickInfoList: state.brand.lipstickInfoList,
  selectBrand: state.brand.selectBrand,
  selectColor: state.brand.selectColor,
})

class Brand extends PureComponent<BrandProps> {
  constructor (props: BrandProps) {
    super(props)
  }

  handleBrandChange = (e) => {
    this.props.dispatch({
      type: 'brand/changeBrand',
      payload: e.target.value,
    })
  }

  handleColorChange = (value: string) => {
    this.props.dispatch({
      type: 'brand/changeColor',
      payload: value,
    })
  }

  render () {
    const { selectBrand, selectColor, lipstickInfoList } = this.props
    const data = lipstickInfoList[selectBrand]

    return (    
      <BrandWrapper>
        <Radio.Group defaultValue="esteelauder" onChange={this.handleBrandChange}>
          <Radio.Button value="esteelauder">esteelauder</Radio.Button>
          <Radio.Button value="chanel">chanel</Radio.Button>
        </Radio.Group>
        <ColorBoard>
          {Object.entries(data).map(([group, groupData]) => { 
            return (
              <>
                <Divider orientation="left">{group}</Divider>
                <ColorWrapper>
                  {groupData.map(item => {
                    const { info, color } = item
                    const active = selectColor === color
                    return (
                      <Tooltip title={info}>
                        <ColorBlock
                          color={color} 
                          active={active}
                          onClick={() => {
                            console.log('shanshan enter')
                            this.handleColorChange(color)
                          }}
                        >
                        </ColorBlock>
                      </Tooltip>
                    )
                  })}
                </ColorWrapper>
              </>
            )
          })}
        </ColorBoard>
      </BrandWrapper>
    )
  }
}

export default connect(mapStateToProps)(Brand)

const BrandWrapper = styled.div`
  padding: 20px;

  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    z-index: 1;
    color:rgb(209,44,50);
    background: #fff;
    border-color: rgb(209,44,50);
  }
  .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
    color:rgb(209,44,50);
    /* border-color: #40a9ff; */
  }
`

const ColorBoard = styled.div`
  .ant-divider-horizontal.ant-divider-with-text {
    color: #3c4858;
    font-weight: 300;
    font-size: 16px;
    font-family: 'PingFang SC YouYuan Microsoft Yahei';
  }
`

const ColorWrapper = styled.div`
  width: 800px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
`

const ColorBlock = styled.div<{ color: string, active: boolean }>`
  position: relative;
  /* border: ${props => props.active ? '1px solid red' : null}; */
  width: 22px;
  height: 22px;
  margin: 4px;
  border-radius: 1px;
  background: ${props => props.color};
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    background-color: transparent;
    border: ${props => props.active ? '1px solid #d7d7d7' : null};
    width: 26px;
    height: 26px;
    top: -2px;
    left: -2px;
    z-index: 2;
}
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-style: ${props => props.active ? 'solid' : null};
    border-width: ${props => props.active ? '0 0 10px 10px' : null};
    border-color: transparent transparent #ffffff transparent;
    right: 0;
    bottom: 0;
    /* opacity: 0; */
    -webkit-transition: right 0.4s,bottom 0.4s;
    transition: right 0.3s,bottom 0.3s;
}
`
